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
import { I18nService } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const language = this.getLanguage(request);
    const { httpStatus, message, args } = this.resolveExceptionDetails(exception);
    const translatedMessage = this.translateMessage(message, language, args);

    this.logger.error(
      `${httpAdapter.getRequestUrl(request)} - ${JSON.stringify(translatedMessage)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const responseBody = {
      success: false,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message: translatedMessage,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private resolveExceptionDetails(
    exception: unknown,
  ): { httpStatus: number; message: unknown; args?: Record<string, unknown> } {
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
      message: 'messages.internalServerError',
    };
  }

  private mapPrismaError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): { httpStatus: number; message: unknown; args?: Record<string, unknown> } {
    switch (exception.code) {
      case 'P2002': {
        const fields = this.getUniqueConstraintFields(exception);
        return {
          httpStatus: HttpStatus.CONFLICT,
          message: fields ? 'messages.duplicateField' : 'messages.duplicateRecord',
          args: fields ? { fields: fields.join(', ') } : undefined,
        };
      }

      case 'P2025':
        return {
          httpStatus: HttpStatus.NOT_FOUND,
          message: 'messages.recordNotFound',
        };

      case 'P2003':
        return {
          httpStatus: HttpStatus.BAD_REQUEST,
          message: 'messages.invalidRelatedRecord',
        };

      case 'P2014':
        return {
          httpStatus: HttpStatus.BAD_REQUEST,
          message: 'messages.requiredRelation',
        };

      default:
        return {
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'messages.databaseError',
        };
    }
  }

  private getLanguage(request: { headers: { 'accept-language'?: string } }): string {
    const header = request.headers['accept-language'];
    return this.i18n.resolveLanguage(header?.split(',')[0]?.trim() || 'en');
  }

  private translateMessage(
    message: unknown,
    language: string,
    args?: Record<string, unknown>,
  ): unknown {
    if (typeof message === 'string' && message.startsWith('messages.')) {
      return this.i18n.translate(message, { lang: language, args });
    }

    if (typeof message === 'string') {
      const validation = this.translateValidationMessage(message, language);
      if (validation !== message) {
        return validation;
      }
    }

    if (Array.isArray(message)) {
      return message.map((item) => this.translateMessage(item, language));
    }

    if (message && typeof message === 'object') {
      const response = message as Record<string, unknown>;
      return response.message
        ? {
            ...response,
            message: this.translateMessage(
              response.message,
              language,
              response.args as Record<string, unknown> | undefined,
            ),
          }
        : response;
    }

    return message;
  }

  private translateValidationMessage(message: string, language: string): string {
    const translate = (key: string, validationArgs: Record<string, unknown>) =>
      this.i18n.translate(`messages.validation.${key}`, {
        lang: language,
        args: validationArgs,
      }) as string;
    let match = message.match(/^(.+) should not be empty$/);
    if (match) return translate('isNotEmpty', { property: match[1] });
    match = message.match(/^(.+) must be a string$/);
    if (match) return translate('isString', { property: match[1] });
    match = message.match(/^(.+) must be an? email$/);
    if (match) return translate('isEmail', { property: match[1] });
    match = message.match(/^(.+) must be an integer number$/);
    if (match) return translate('isInt', { property: match[1] });
    match = message.match(/^(.+) must be a boolean value$/);
    if (match) return translate('isBoolean', { property: match[1] });
    match = message.match(/^(.+) must be an array$/);
    if (match) return translate('isArray', { property: match[1] });
    match = message.match(/^(.+) must not be greater than (\d+)$/);
    if (match) return translate('max', { property: match[1], max: match[2] });
    match = message.match(/^(.+) must not be less than (\d+)$/);
    if (match) return translate('min', { property: match[1], min: match[2] });
    match = message.match(/^(.+) must be shorter than or equal to (\d+) characters$/);
    if (match) return translate('maxLength', { property: match[1], max: match[2] });
    match = message.match(/^(.+) must be longer than or equal to (\d+) characters$/);
    if (match) return translate('minLength', { property: match[1], min: match[2] });
    return message;
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