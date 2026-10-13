import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { AppException } from '../exceptions/app.exception.js';
import { ProblemDetails } from '../interfaces/problem-details.interface.js';

/**
 * Global exception filter for BeezBudget API.
 *
 * Catches all unhandled exceptions thrown across the application and
 * transforms them into standardized RFC 7807 / RFC 9457 Problem Details responses
 * (`application/problem+json`). Also provides centralized diagnostic logging.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Catches and processes any exception thrown during HTTP request execution.
   *
   * Formats the exception into an RFC 7807 Problem Details object, logs the event,
   * and sends an HTTP response with the `application/problem+json` media type.
   *
   * @param exception - The thrown error or exception instance.
   * @param host - Execution context providing access to HTTP request and response objects.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const problem = this.toProblemDetails(exception, request);

    /*
     * Log the exception with appropriate severity based on error type.
     */
    this.logException(exception, request);
    response
      .status(problem.status)
      .type('application/problem+json')
      .json(problem);
  }

  /**
   * Logs exceptions with contextual request details.
   *
   * Expected client or application errors (AppException, HttpException) are logged
   * as warnings, while unexpected errors are logged as errors with their full stack trace.
   *
   * @param exception - The caught exception instance.
   * @param request - The current Express HTTP request.
   */
  private logException(exception: unknown, request: Request): void {
    const message = `[${request.method}] ${request.originalUrl}`;

    if (
      exception instanceof AppException ||
      exception instanceof HttpException
    ) {
      /*
       * Expected business or client errors (4xx / known HTTP status codes).
       */
      this.logger.warn(
        `${message} - Status: ${exception.getStatus()} - Message: ${exception.message}`,
      );
    } else {
      /*
       * Unhandled / unexpected errors (potential bugs or system failures).
       */
      const errorStack =
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception);
      this.logger.error(`${message} - Unhandled Exception:\n${errorStack}`);
    }
  }

  /**
   * Maps an unknown exception to a standardized ProblemDetails response object.
   *
   * Handles business application exceptions, standard Nest HTTP exceptions
   * (including validation pipe failures), and falls back to an internal server error.
   *
   * @param exception - The caught exception.
   * @param request - The current Express HTTP request.
   * @returns A structured ProblemDetails object.
   */
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
     * Standard Nest HTTP exception.
     *
     * This includes framework-generated errors and validation failures
     * produced by Nest's StandardSchemaValidationPipe.
     */
    if (exception instanceof HttpException) {
      return this.fromHttpException(exception, request);
    }

    /*
     * Unexpected/unrecognized exception (fallback to 500 Internal Server Error).
     */
    return this.internalServerError(request);
  }

  /**
   * Converts a domain-specific AppException into a ProblemDetails response.
   *
   * Extracts standard problem attributes (type, title, detail, code) and preserves
   * any custom extension members passed via AppExceptionOptions.
   *
   * @param exception - The domain AppException instance.
   * @param request - The current Express HTTP request.
   * @returns A populated ProblemDetails object.
   */
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

  /**
   * Converts a standard Nest HttpException into a ProblemDetails response.
   *
   * Supports string error responses, pre-formatted ProblemDetails objects,
   * and standard Nest error payloads (mapping error and message fields).
   *
   * @param exception - The standard Nest HttpException instance.
   * @param request - The current Express HTTP request.
   * @returns A populated ProblemDetails object.
   */
  private fromHttpException(
    exception: HttpException,
    request: Request,
  ): ProblemDetails {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    /*
     * Nest exceptions can return either a simple string or a structured object.
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
       * Preserve an existing Problem Details structure if the exception
       * response already provides conformant fields.
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
       * Standard Nest HttpException payload (maps `error` to title and `message` to detail).
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

  /**
   * Normalizes exception message payloads into a single readable string.
   *
   * Handles string messages, string array validation errors (such as those
   * returned by validation pipes), and provides a generic fallback.
   *
   * @param message - The raw message payload from the exception response.
   * @returns A normalized string representation of the error message.
   */
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

  /**
   * Generates a generic 500 Internal Server Error ProblemDetails response.
   *
   * Used as a safe fallback for unhandled or unexpected exceptions to avoid
   * leaking sensitive internal implementation details or stack traces to clients.
   *
   * @param request - The current Express HTTP request.
   * @returns A standardized 500 ProblemDetails object.
   */
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
