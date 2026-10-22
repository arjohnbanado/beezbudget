import {
  Body,
  Controller,
  Cookies,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ApiZodBody,
  ApiProblemResponses,
  ApiZodResponse,
} from '../../common/decorators/api-docs.decorator.js';
import { AuthService } from './auth.service.js';
import {
  RegisterResponseSchema,
  RegisterSchema,
} from './schemas/register.schema.js';
import type {
  RegisterDto,
  RegisterResponseDto,
} from './schemas/register.schema.js';
import { LoginSchema } from './schemas/login.schema.js';
import { LocalAuthGuard } from './local-auth.guard.js';
import type { Request, Response } from 'express';
import { ForgotPasswordService } from './forgot-password/forgot-password.service.js';
import {
  ResetPasswordSchema,
  type ResetPasswordDto,
} from './forgot-password/schemas/reset-password.schema.js';
import {
  CreateForgotPasswordResponseSchema,
  type CreateForgotPasswordResponseDto,
} from './forgot-password/schemas/create-forgot-password.schema.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('reset-password')
  @ApiZodResponse(CreateForgotPasswordResponseSchema, {
    status: 201,
    description: 'Password reset successfully.',
  })
  @ApiProblemResponses(400, 401, 500)
  async resetPassword(
    @Body({ schema: ResetPasswordSchema }) resetPasswordDto: ResetPasswordDto,
  ): Promise<CreateForgotPasswordResponseDto> {
    const token =
      await this.forgotPasswordService.resetPassword(resetPasswordDto);

    return CreateForgotPasswordResponseSchema.parse(token);
  }

  @Post('register')
  @ApiZodResponse(RegisterResponseSchema, {
    status: 201,
    description: 'Account registered successfully.',
  })
  @ApiProblemResponses(400, 401, 500)
  async register(
    @Body({ schema: RegisterSchema }) registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const register = await this.authService.register(registerDto);

    return RegisterResponseSchema.parse(register);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Authentication succeeded and an access token cookie was set.',
    headers: {
      'Set-Cookie': {
        description: 'HttpOnly, Secure, SameSite=Strict access_token cookie.',
        schema: { type: 'string' },
      },
    },
  })
  @ApiZodBody(LoginSchema)
  @ApiProblemResponses(400, 401, 500)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const loginData = await this.authService.login(req.user);

    res.cookie('__Host-access_token', loginData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: loginData.rTCookieMaxAge,
    });

    res.cookie('__Secure-refresh_token', loginData.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: loginData.rTCookieMaxAge,
    });

    return { isOnboarded: loginData.isOnboarded };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Tokens refreshed successfully and new cookies were set.',
    headers: {
      'Set-Cookie': {
        description:
          'HttpOnly, Secure, SameSite=Strict access_token and refresh_token cookies.',
        schema: { type: 'string' },
      },
    },
  })
  @ApiProblemResponses(401, 500)
  async refresh(
    @Cookies('__Secure-refresh_token') refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshData = await this.authService.refresh(refreshToken);

      res.cookie('__Host-access_token', refreshData.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: refreshData.rTCookieMaxAge,
      });

      res.cookie('__Secure-refresh_token', refreshData.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/v1/auth',
        maxAge: refreshData.rTCookieMaxAge,
      });
    } catch (error) {
      res.clearCookie('__Host-access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });

      res.clearCookie('__Secure-refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/v1/auth',
      });

      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Logged out successfully and authentication cookies were cleared.',
  })
  @ApiProblemResponses(500)
  async logout(
    @Cookies('__Secure-refresh_token') refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(refreshToken);

    res.clearCookie('__Host-access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('__Secure-refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }
}
