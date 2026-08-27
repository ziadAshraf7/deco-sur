import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const { httpStatus, message } = this.resolveExceptionDetails(exception);

    this.logger.error(
      `${httpAdapter.getRequestUrl(ctx.getRequest())} - ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const responseBody = {
      success: false,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private resolveExceptionDetails(
    exception: unknown,
  ): { httpStatus: number; message: unknown } {
    if (exception instanceof HttpException) {
      return {
        httpStatus: exception.getStatus(),
        message: exception.getResponse(),
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.mapPrismaError(exception);
    }

    return {
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private mapPrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): { httpStatus: number; message: unknown } {
    switch (exception.code) {
      case 'P2002': {
        const fields = this.getUniqueConstraintFields(exception);
        return {
          httpStatus: HttpStatus.CONFLICT,
          message: fields
            ? `A record with this ${fields.join(', ')} already exists`
            : 'A record with these values already exists',
        };
      }

      case 'P2025':
        return {
          httpStatus: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        };

      case 'P2003':
        return {
          httpStatus: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference to a related record',
        };

      case 'P2014':
        return {
          httpStatus: HttpStatus.BAD_REQUEST,
          message: 'The change would violate a required relation',
        };

      default:
        return {
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
        };
    }
  }

  private getUniqueConstraintFields(
    exception: Prisma.PrismaClientKnownRequestError,
  ): string[] | null {
    const target = (exception.meta as { target?: string | string[] })
      ?.target;

    if (Array.isArray(target)) {
      return target;
    }

    if (typeof target === 'string') {
      const match = target.match(/^(?:.*_)?([a-zA-Z0-9]+)_key$/);
      return match ? [match[1]] : [target];
    }

    return null;
  }
}