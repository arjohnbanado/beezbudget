import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { EmailModule } from '../email/email.module.js';
import { AuthService } from './auth.service.js';
import { VerificationsService } from './verifications/verifications.service.js';
import { VerificationsController } from './verifications/verifications.controller.js';
import { LocalStrategy } from './local.strategy.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy.js';
import { ForgotPasswordService } from './forgot-password/forgot-password.service.js';
import { ForgotPasswordController } from './forgot-password/forgot-password.controller.js';

@Module({
  imports: [
    EmailModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const privateKeyBase64 =
          configService.getOrThrow<string>('PRIVATE_KEY');
        const privateKey = Buffer.from(privateKeyBase64, 'base64').toString(
          'ascii',
        );

        return {
          privateKey,
          signOptions: { expiresIn: '15m', algorithm: 'RS256' },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    VerificationsService,
    ForgotPasswordService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [
    AuthController,
    VerificationsController,
    ForgotPasswordController,
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
