import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppExceptionOptions {
  type: string;
  code: string;
  title: string;
  detail: string;
  status: HttpStatus;
  extensions?: Record<string, unknown>;
}

export class AppException extends HttpException {
  constructor(options: AppExceptionOptions) {
    super(
      {
        type: options.type,
        code: options.code,
        title: options.title,
        detail: options.detail,
        ...options.extensions,
      },
      options.status,
    );
  }
}
