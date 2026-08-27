import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: PaginatedResult<unknown>['meta'];
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

function isPaginatedResult(payload: any): payload is PaginatedResult<any> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    'meta' in payload &&
    Array.isArray((payload as PaginatedResult<any>).data)
  );
}

function serializeBigInt(value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        serializeBigInt(val),
      ]),
    );
  }

  return value;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((payload): Response<T> => {
        const base = {
          success: true,
          statusCode: response.statusCode,
        };

        if (isPaginatedResult(payload)) {
          return {
            ...base,
            data: serializeBigInt(payload.data) as T,
            meta: serializeBigInt(payload.meta),
          };
        }

        return {
          ...base,
          data: serializeBigInt(payload) as T,
        };
      }),
    );
  }
}