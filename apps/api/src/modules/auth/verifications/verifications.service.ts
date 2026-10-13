import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailService } from '../../email/email.service.js';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { generateSecureToken } from '../../../common/utils/token.util.js';
import {
  FindOneVerificationDto,
  FindOneVerificationFilterDto,
} from './schemas/findOne-verification.schema.js';
import { CreateVerificationDto } from './schemas/create-verification.schema.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationsService {
  private readonly verificationTokenExpirationMS: string;
  private readonly verificationTokenResendAvailableMS: string;

  constructor(
    private emailService: EmailService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.verificationTokenExpirationMS = this.configService.getOrThrow<string>(
      'VERIFICATION_TOKEN_EXPIRATION_MS',
    );
    this.verificationTokenResendAvailableMS =
      this.configService.getOrThrow<string>(
        'VERIFICATION_TOKEN_RESEND_AVAILABLE_MS',
      );
  }

  async createVerification(createVerificationDto: CreateVerificationDto) {
    const { email } = createVerificationDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new ConflictException(
        'An account with this email address already exists.',
      );
    }

    const { rawToken, tokenHash } = generateSecureToken();

    const expiresAt = new Date(
      Date.now() + parseInt(this.verificationTokenExpirationMS, 10),
    );

    const resendAvailableAt = new Date(
      Date.now() + parseInt(this.verificationTokenResendAvailableMS, 10),
    );

    const token = await this.prisma.verificationToken.create({
      data: {
        email,
        tokenHash,
        expiresAt,
        resendAvailableAt,
      },
    });

    await this.emailService.sendEmailVerification({
      email,
      rawToken,
      verificationId: token.id,
    });

    return token;
  }

  async findOneVerification(
    findOneVerificationDto: FindOneVerificationDto,
    findOneVerificationFilterDto: FindOneVerificationFilterDto,
  ) {
    const { id } = findOneVerificationDto;
    const { status } = findOneVerificationFilterDto;

    const whereClause: any = { id };

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

  async resendVerification(findOneVerificationDto: FindOneVerificationDto) {
    const { id } = findOneVerificationDto;

    const token = await this.prisma.verificationToken.findFirst({
      where: {
        id,
        expiresAt: { gt: new Date() },
        resendAvailableAt: { lt: new Date() },
        resendCount: { lte: 5 },
        usedAt: null,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const { email, resendCount } = token;

    const { rawToken, tokenHash } = generateSecureToken();

    const expiresAt = new Date(
      Date.now() + parseInt(this.verificationTokenExpirationMS, 10),
    );

    const resendAvailableAt = new Date(
      Date.now() + parseInt(this.verificationTokenResendAvailableMS, 10),
    );

    const results = await this.prisma.$transaction([
      this.prisma.verificationToken.delete({ where: { id } }),
      this.prisma.verificationToken.create({
        data: {
          email,
          tokenHash,
          expiresAt,
          resendAvailableAt,
          resendCount: resendCount + 1,
        },
      }),
    ]);

    await this.emailService.sendEmailVerification({
      email,
      rawToken,
      verificationId: results[1].id,
    });

    return results[1];
  }
}
