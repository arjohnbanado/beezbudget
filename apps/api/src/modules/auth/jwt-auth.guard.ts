import { Injectable, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppException } from '../../common/exceptions/app.exception.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // If passport-jwt encounters an error, it passes it in the `info` parameter.
    if (info instanceof Error) {
      if (info.name === 'TokenExpiredError') {
        throw new AppException({
          type: 'https://api.beezbudget.com/problems/token-expired',
          title: 'Session Expired',
          detail: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED',
          status: HttpStatus.UNAUTHORIZED,
        });
      }

      if (info.name === 'JsonWebTokenError') {
        throw new AppException({
          type: 'https://api.beezbudget.com/problems/invalid-token',
          title: 'Invalid Token',
          detail: 'The provided authentication token is invalid or malformed.',
          code: 'INVALID_TOKEN',
          status: HttpStatus.UNAUTHORIZED,
        });
      }

      if (info.name === 'NotBeforeError') {
        throw new AppException({
          type: 'https://api.beezbudget.com/problems/token-not-active',
          title: 'Token Not Active',
          detail: 'The provided authentication token is not active yet.',
          code: 'TOKEN_NOT_ACTIVE',
          status: HttpStatus.UNAUTHORIZED,
        });
      }
    }

    // Catch missing tokens or other general validation errors
    if (err || !user) {
      throw (
        err ||
        new AppException({
          type: 'https://api.beezbudget.com/problems/unauthorized',
          title: 'Unauthorized',
          detail: 'Authentication token is missing or invalid.',
          code: 'UNAUTHORIZED',
          status: HttpStatus.UNAUTHORIZED,
        })
      );
    }

    return user;
  }
}
