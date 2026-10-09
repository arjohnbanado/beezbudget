import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import type { RegisterDto } from './schemas/register.schema.js';
import { hashToken } from '../../common/utils/token.util.js';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/bcrypt.util.js';
import { LoginDto } from './schemas/login.schema.js';
import { JwtService } from '@nestjs/jwt';
import { generateRandomUsername } from '../../common/utils/name.util.js';

@Injectable()
export class AuthService {
  private readonly DUMMY_HASH =
    '$2b$10$EdiWowSabawdiWowSabawiWowSabawWowSabawowS';

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

    const builtInAccountTypes = ['Cash', 'Bank', 'E-wallet', 'Card'];

    builtInAccountTypes.forEach(async (builtInAccountType) => {
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
      await comparePassword(password, this.DUMMY_HASH);

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
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
