import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { LoginSchema } from './schemas/login.schema.js';
import z from 'zod';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const result = LoginSchema.safeParse(request.body);

    if (!result.success) {
      const tree = z.treeifyError(result.error);

      throw new BadRequestException({
        message: 'Invalid request body',
        errors: tree.properties,
      });
    }

    request.body = result.data;

    return super.canActivate(context);
  }
}
