import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateUserDto } from './schemas/create-user.schema.js';
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
