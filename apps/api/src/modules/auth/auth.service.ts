import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import type { RegisterDto } from './schemas/register.schema.js';
import {
  generateSecureToken,
  hashToken,
} from '../../common/utils/token.util.js';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/bcrypt.util.js';
import { LoginDto } from './schemas/login.schema.js';
import { JwtService } from '@nestjs/jwt';
import { generateRandomUsername } from '../../common/utils/name.util.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly aTExpirationMS: string;
  private readonly rTFamilyExpirationMS: string;
  private readonly rTExpirationMS: string;
  private readonly authDummyHash: string;

  private static readonly builtInAccountTypes = [
    'Cash',
    'Bank',
    'E-wallet',
    'Card',
  ];

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.aTExpirationMS = this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_EXPIRATION_MS',
    );
    this.rTFamilyExpirationMS = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_FAMILY_EXPIRATION_MS',
    );
    this.rTExpirationMS = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_EXPIRATION_MS',
    );
    this.authDummyHash =
      this.configService.getOrThrow<string>('AUTH_DUMMY_HASH');
  }

  async register(registerDto: RegisterDto) {
    const { password, rawToken } = registerDto;

    const hashedToken = hashToken(rawToken);

    const token = await this.prisma.verificationToken.findFirst({
      where: {
        tokenHash: hashedToken,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const { email, id } = token;

    const hashedPassword = await hashPassword(password);
    const randomUsername = generateRandomUsername();

    const user = await this.prisma.$transaction([
      this.prisma.user.create({
        data: { email, password: hashedPassword, name: randomUsername },
      }),
      this.prisma.verificationToken.update({
        data: { usedAt: new Date() },
        where: { id },
      }),
    ]);

    AuthService.builtInAccountTypes.forEach(async (builtInAccountType) => {
      await this.prisma.accountType.create({
        data: { name: builtInAccountType, userId: user[0].id },
      });
    });

    return token;
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      await comparePassword(password, this.authDummyHash);

      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { username: user.name, userId: user.id };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    const { sub } = payload;

    const token = generateSecureToken();
    const { rawToken, tokenHash } = token;

    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId: sub,
        tokenHash,
        familyExpiresAt: new Date(
          Date.now() + parseInt(this.rTFamilyExpirationMS, 10),
        ),
        expiresAt: new Date(Date.now() + parseInt(this.rTExpirationMS, 10)),
      },
    });

    // Example in auth.service.ts: 15 minutes + random 0–60 seconds of jitter
    const jitterMs = Math.floor(Math.random() * 60_000);
    const aTExpirationWithJitterMs =
      parseInt(this.aTExpirationMS, 10) + jitterMs;
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: Math.floor(aTExpirationWithJitterMs / 1000), // in seconds
    });

    const rTCookieValidUntil = Math.min(
      refreshToken.expiresAt.getTime(),
      refreshToken.familyExpiresAt.getTime(),
    );
    const aTCookieValidUntil = new Date(
      Date.now() + parseInt(this.aTExpirationMS, 10),
    ).getTime();

    const aTCookieMaxAge = Math.max(0, aTCookieValidUntil - Date.now());
    const rTCookieMaxAge = Math.max(0, rTCookieValidUntil - Date.now());

    return {
      access_token: accessToken,
      refresh_token: rawToken,
      rTCookieMaxAge,
      aTCookieMaxAge,
    };
  }

  async refresh(rawRefreshToken?: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const tokenHash = hashToken(rawRefreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const now = new Date();

    // 1. Reuse detection: if this token was already consumed, revoke the entire family
    if (storedToken.consumedAt !== null) {
      await this.prisma.refreshToken.updateMany({
        where: {
          familyId: storedToken.familyId,
          revokedAt: null,
        },
        data: { revokedAt: now },
      });

      throw new UnauthorizedException('Invalid refresh token.');
    }

    // 2. Check if revoked or expired (7-day sliding or 30-day family hard cap)
    if (
      storedToken.revokedAt !== null ||
      storedToken.expiresAt <= now ||
      storedToken.familyExpiresAt <= now
    ) {
      throw new UnauthorizedException('Refresh token expired or revoked.');
    }

    // 3. Rotate refresh token atomically within the same family
    const { rawToken: newRawToken, tokenHash: newTokenHash } =
      generateSecureToken();

    const slidingExpiresAt = new Date(
      now.getTime() + parseInt(this.rTExpirationMS, 10),
    );
    const nextExpiresAt =
      slidingExpiresAt < storedToken.familyExpiresAt
        ? slidingExpiresAt
        : storedToken.familyExpiresAt;

    const [, newRefreshToken] = await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { consumedAt: now },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId: storedToken.userId,
          familyId: storedToken.familyId,
          tokenHash: newTokenHash,
          familyExpiresAt: storedToken.familyExpiresAt,
          expiresAt: nextExpiresAt,
        },
      }),
    ]);

    // 4. Sign new access token with 0-60s jitter
    const payload = {
      username: storedToken.user.name,
      sub: storedToken.user.id,
    };
    const jitterMs = Math.floor(Math.random() * 60_000);
    const aTExpirationWithJitterMs =
      parseInt(this.aTExpirationMS, 10) + jitterMs;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: Math.floor(aTExpirationWithJitterMs / 1000),
    });

    const rTCookieMaxAge = Math.max(
      0,
      newRefreshToken.expiresAt.getTime() - Date.now(),
    );

    return {
      access_token: accessToken,
      refresh_token: newRawToken,
      rTCookieMaxAge,
    };
  }

  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    const tokenHash = hashToken(rawRefreshToken);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: { familyId: true },
    });

    if (!storedToken) {
      return;
    }

    await this.prisma.refreshToken.updateMany({
      where: {
        familyId: storedToken.familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
