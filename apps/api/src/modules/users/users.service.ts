import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateUserDto } from './schemas/create-user.schema.js';
import type { CompleteOnboardingDto } from './schemas/complete-onboarding.schema.js';
import { hashToken } from '../../common/utils/token.util.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { hashPassword } from '../../common/utils/bcrypt.util.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, rawToken } = createUserDto;

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

    const { email } = token;

    const hashedPassword = await hashPassword(password);

    await this.prisma.user.create({
      data: { email, password: hashedPassword, name: email },
    });

    return;
  }

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        preferredCurrencyCode: true,
        onboardedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      preferred_currency_code: user.preferredCurrencyCode,
      is_onboarded: Boolean(user.onboardedAt),
    };
  }

  async completeOnboarding(
    userId: string,
    completeOnboardingDto: CompleteOnboardingDto,
  ) {
    const { name, preferred_currency_code } = completeOnboardingDto;

    const currency = await this.prisma.currency.findFirst({
      where: {
        code: preferred_currency_code,
        isSelectable: true,
      },
    });

    if (!currency) {
      throw new NotFoundException('Selected currency is not available.');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        preferredCurrencyCode: preferred_currency_code,
        onboardedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        preferredCurrencyCode: true,
        onboardedAt: true,
      },
    });

    return updatedUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
