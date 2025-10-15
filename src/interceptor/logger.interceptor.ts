/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body } = request;

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const responseTime = Date.now() - now;

        const logMessage = {
          method,
          url,
          headers: JSON.stringify(headers),
          body: JSON.stringify(body),
          statusCode,
          responseTime: `${responseTime}ms`,
        };
        if (responseTime > 1000) {
          console.log(
            'responseTime: ',
            responseTime,
            'url: ',
            url,
            'responseTime: ',
            responseTime,
          );
        }

        if (
          Object.values(logMessage).some(
            (value) =>
              value &&
              value !== 'null' &&
              value !== 'undefined' &&
              value !== '[]' &&
              value !== '{}',
          )
        ) {
          // this.logger.log(JSON.stringify(logMessage, null, 2));
        }
      }),
      catchError((err) => {
        const responseTime = Date.now() - now;

        const errorMessage = {
          method,
          url,
          headers: JSON.stringify(headers),
          body: JSON.stringify(body),
          responseTime: `${responseTime}ms`,
          error: {
            message: err.message,
            stack: err.stack,
            status: err.status || 'unknown status',
          },
        };

        this.logger.error(JSON.stringify(errorMessage, null, 2));
        return throwError(err);
      }),
    );
  }
}
