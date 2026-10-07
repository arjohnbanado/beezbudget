import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { FindAccountTypesDto } from './dto/find-account-types.dto.js';
import { CreateAccountTypeDto } from './schemas/create-account-type.schema.js';

@Injectable()
export class AccountsService {
  private readonly DEFAULT_ACCOUNT_TYPES = ['cash', 'bank', 'e-wallet', 'card'];

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

    const isDefaultAccount = this.DEFAULT_ACCOUNT_TYPES.includes(
      account_type.toLocaleLowerCase(),
    );

    if (isDefaultAccount) {
      throw new ConflictException(
        'An account type with this name already exists.',
      );
    }

    await this.prisma.accountType.create({
      data: {
        name: account_type,
        userId: user.userId,
      },
    });
  }
}
