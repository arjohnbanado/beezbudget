import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { AppException } from '../exceptions/app.exception.js';
import { ProblemDetails } from '../interfaces/problem-details.interface.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const problem = this.toProblemDetails(exception, request);

    response
      .status(problem.status)
      .type('application/problem+json')
      .json(problem);
  }

  private toProblemDetails(
    exception: unknown,
    request: Request,
  ): ProblemDetails {
    /*
     * Application/business exception.
     */
    if (exception instanceof AppException) {
      return this.fromAppException(exception, request);
    }

    /*
     * Any other Nest HTTP exception.
     *
     * This includes exceptions produced by
     * Nest's StandardSchemaValidationPipe.
     */
    if (exception instanceof HttpException) {
      return this.fromHttpException(exception, request);
    }

    /*
     * Unexpected/unrecognized exception.
     */
    return this.internalServerError(request);
  }

  private fromAppException(
    exception: AppException,
    request: Request,
  ): ProblemDetails {
    const exceptionResponse = exception.getResponse();

    const body =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)
        : {};

    const { type, title, detail, code, ...extensions } = body;

    return {
      type: String(type ?? 'about:blank'),
      title: String(title ?? 'Application Error'),
      status: exception.getStatus(),
      detail: String(detail ?? 'An application error occurred.'),
      instance: request.originalUrl,
      code: String(code ?? 'APPLICATION_ERROR'),
      timestamp: new Date().toISOString(),
      ...extensions,
    };
  }

  private fromHttpException(
    exception: HttpException,
    request: Request,
  ): ProblemDetails {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    /*
     * Nest exceptions can return either
     * a string or an object.
     */
    if (typeof exceptionResponse === 'string') {
      return {
        type: 'about:blank',
        title: 'HTTP Error',
        status,
        detail: exceptionResponse,
        instance: request.originalUrl,
        code: 'HTTP_ERROR',
        timestamp: new Date().toISOString(),
      };
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const body = exceptionResponse as Record<string, unknown>;

      /*
       * Preserve an existing problem-details
       * structure if an exception already
       * provides one.
       */
      if (
        typeof body.type === 'string' &&
        typeof body.title === 'string' &&
        typeof body.detail === 'string'
      ) {
        const {
          type,
          title,
          detail,
          status: responseStatus,
          code,
          ...extensions
        } = body;

        return {
          type,

          title,

          status: typeof responseStatus === 'number' ? responseStatus : status,

          detail,

          instance:
            typeof body.instance === 'string'
              ? body.instance
              : request.originalUrl,

          code: typeof code === 'string' ? code : 'HTTP_ERROR',

          timestamp:
            typeof body.timestamp === 'string'
              ? body.timestamp
              : new Date().toISOString(),

          ...extensions,
        };
      }

      /*
       * Normal Nest HttpException.
       */
      return {
        type: 'about:blank',
        title: typeof body.error === 'string' ? body.error : 'HTTP Error',
        status,
        detail: this.extractMessage(body.message),
        instance: request.originalUrl,
        code: 'HTTP_ERROR',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      type: 'about:blank',
      title: 'HTTP Error',
      status,
      detail: 'An error occurred.',
      instance: request.originalUrl,
      code: 'HTTP_ERROR',
      timestamp: new Date().toISOString(),
    };
  }

  private extractMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message
        .filter((item): item is string => typeof item === 'string')
        .join('; ');
    }

    return 'An error occurred.';
  }

  private internalServerError(request: Request): ProblemDetails {
    return {
      type: 'https://api.beezbudget.com/problems/internal-server-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred.',
      instance: request.originalUrl,
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    };
  }
}
