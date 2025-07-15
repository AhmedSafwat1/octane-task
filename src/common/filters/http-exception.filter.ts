// common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  path: string;
  timestamp: string;
  message: any;
  debug?: {
    stack?: string;
    exception?: string;
    context?: any;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');
  private readonly isDebugMode: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDebugMode = this.configService.get<boolean>('app.debug') || false;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(
      `[${request.method}] ${request.url}`,
      exception instanceof Error ? exception.stack : undefined
    );

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
    };

    // Add debug information if debug mode is enabled
    if (this.isDebugMode) {
      errorResponse.debug = {
        stack: exception instanceof Error ? exception.stack : undefined,
        exception: exception instanceof Error ? exception.name : typeof exception,
        context: {
          body: request.body,
          query: request.query,
          params: request.params,
          user: request.user,
          headers: this.sanitizeHeaders(request.headers)
        }
      };
    }

    response.status(status).json(errorResponse);
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    // Remove sensitive information
    delete sanitized.authorization;
    delete sanitized.cookie;
    return sanitized;
  }
}
