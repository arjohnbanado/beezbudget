import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import { FindAccountTypesDto } from './dto/find-account-types.dto.js';
import { CreateAccountTypeDto } from './schemas/create-account-type.schema.js';
import { CreateAccountDto } from './schemas/create-account.schema.js';
import {
  encryptSensitiveField,
  parseSensitiveFieldEncryptionKey,
} from '../../common/utils/field-encryption.util.js';

@Injectable()
export class AccountsService {
  private encodedKey: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.encodedKey = this.configService.getOrThrow<string>(
      'SENSITIVE_FIELD_ENCRYPTION_KEY',
    );
  }

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

  async findAccounts(user: any) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        accountType: true,
        currency: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      account_type: account.accountType.name,
      account_number_last4: account.accountNumberLast4,
      opening_balance: account.openingBalance
        ? Number(account.openingBalance)
        : null,
      currency_code: account.currencyCode,
      icon_key: account.iconKey,
      status: account.status,
      created_at: account.createdAt,
      updated_at: account.updatedAt,
      currency_symbol: account.currency.symbol ? account.currency.symbol : null,
    }));
  }

  async createAccountType(
    user: any,
    createAccountTypeDto: CreateAccountTypeDto,
  ) {
    const { account_type } = createAccountTypeDto;

    const isAccountTypeExist = await this.prisma.accountType.findUnique({
      where: { userId_name: { name: account_type, userId: user.userId } },
    });

    if (isAccountTypeExist) {
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

  async createAccount(user: any, createAccountDto: CreateAccountDto) {
    const {
      account_type,
      name,
      account_number,
      opening_balance,
      currency_code,
      icon_key,
    } = createAccountDto;

    const accountTypeRecord = await this.prisma.accountType.findUnique({
      where: {
        userId_name: {
          userId: user.userId,
          name: account_type,
        },
      },
    });

    if (!accountTypeRecord) {
      throw new NotFoundException('Account type not found.');
    }

    let accountNumberCiphertext = null;
    let accountNumberIv = null;
    let accountNumberAuthTag = null;
    let accountNumberLast4 = null;

    if (account_number) {
      const encryptionKey = parseSensitiveFieldEncryptionKey(this.encodedKey);
      const encrypted = encryptSensitiveField(account_number, encryptionKey);
      accountNumberCiphertext = encrypted.ciphertext;
      accountNumberIv = encrypted.iv;
      accountNumberAuthTag = encrypted.authTag;
      accountNumberLast4 = account_number.slice(-4);
    }

    const account = await this.prisma.account.create({
      data: {
        userId: user.userId,
        accountTypeId: accountTypeRecord.id,
        name,
        accountNumberCiphertext,
        accountNumberIv,
        accountNumberAuthTag,
        accountNumberLast4,
        openingBalance: opening_balance ?? null,
        currencyCode: currency_code,
        iconKey: icon_key,
      },
    });

    return account;
  }
}
