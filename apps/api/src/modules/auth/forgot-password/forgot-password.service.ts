import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenType } from '../../../database/prisma/generated/prisma/client.js';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { hashPassword } from '../../../common/utils/bcrypt.util.js';
import {
  generateSecureToken,
  hashToken,
} from '../../../common/utils/token.util.js';
import { EmailService } from '../../email/email.service.js';
import type { CreateForgotPasswordDto } from './schemas/create-forgot-password.schema.js';
import type {
  FindOneForgotPasswordDto,
  FindOneForgotPasswordFilterDto,
} from './schemas/findOne-forgot-password.schema.js';
import type { ResetPasswordDto } from './schemas/reset-password.schema.js';

@Injectable()
export class ForgotPasswordService {
  private readonly resetTokenExpirationMS = 15 * 60 * 1000;
  private readonly resendTokenAvailableMS = 1 * 60 * 1000;

  constructor(
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  async createForgotPassword({ email }: CreateForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email address.');
    }

    const { rawToken, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + this.resetTokenExpirationMS);
    const resendAvailableAt = new Date(
      Date.now() + this.resendTokenAvailableMS,
    );

    const token = await this.prisma.verificationToken.create({
      data: {
        email,
        userId: user.id,
        tokenHash,
        type: TokenType.password_reset,
        expiresAt,
        resendAvailableAt,
      },
    });

    await this.emailService.sendPasswordReset({
      email,
      rawToken,
      verificationId: token.id,
    });

    return token;
  }

  async findOneForgotPassword(
    { id }: FindOneForgotPasswordDto,
    { status }: FindOneForgotPasswordFilterDto,
  ) {
    const whereClause: any = { id, type: TokenType.password_reset };

    if (status === 'used') {
      whereClause.usedAt = { not: null };
      whereClause.expiresAt = { gt: new Date() };
    } else if (status === 'expired') {
      whereClause.expiresAt = { lte: new Date() };
    } else {
      whereClause.expiresAt = { gt: new Date() };
      whereClause.usedAt = null;
    }

    const token = await this.prisma.verificationToken.findFirst({
      where: whereClause,
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return token;
  }

  async resendForgotPassword({ id }: FindOneForgotPasswordDto) {
    const token = await this.prisma.verificationToken.findFirst({
      where: {
        id,
        type: TokenType.password_reset,
        expiresAt: { gt: new Date() },
        resendAvailableAt: { lt: new Date() },
        resendCount: { lte: 5 },
        usedAt: null,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const { rawToken, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + this.resetTokenExpirationMS);
    const resendAvailableAt = new Date(
      Date.now() + this.resendTokenAvailableMS,
    );

    const results = await this.prisma.$transaction([
      this.prisma.verificationToken.delete({ where: { id } }),
      this.prisma.verificationToken.create({
        data: {
          email: token.email,
          userId: token.userId,
          tokenHash,
          type: TokenType.password_reset,
          expiresAt,
          resendAvailableAt,
          resendCount: token.resendCount + 1,
        },
      }),
    ]);

    await this.emailService.sendPasswordReset({
      email: token.email,
      rawToken,
      verificationId: results[1].id,
    });

    return results[1];
  }

  async resetPassword({ password, rawToken }: ResetPasswordDto) {
    const token = await this.prisma.verificationToken.findFirst({
      where: {
        tokenHash: hashToken(rawToken),
        type: TokenType.password_reset,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (!token || !token.userId) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const hashedPassword = await hashPassword(password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: token.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.verificationToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return token;
  }
}
