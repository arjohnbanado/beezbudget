import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { FindAccountTypesDto } from './dto/find-account-types.dto.js';
import { CreateAccountTypeDto } from './schemas/create-account-type.schema.js';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAccountTypes(findAccountTypesDto: FindAccountTypesDto) {
    const { userId } = findAccountTypesDto;

    const accountTypes = await this.prisma.accountType.findMany({
      where: {
        userId,
      },
      orderBy: { name: 'asc' },
    });

    return accountTypes;
  }

  async createAccountType(
    user: any,
    createAccountTypeDto: CreateAccountTypeDto,
  ) {
    const { account_type } = createAccountTypeDto;

    await this.prisma.accountType.create({
      data: {
        name: account_type,
        userId: user.userId,
      },
    });
  }
}
