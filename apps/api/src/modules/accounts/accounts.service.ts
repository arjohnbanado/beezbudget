import {
  ConflictException,
  ForbiddenException,
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

const PIVOT_BASE_CURRENCY = 'EUR';

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
    const [userRecord, accounts] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          preferredCurrencyCode: true,
          preferredCurrency: {
            select: {
              code: true,
              symbol: true,
            },
          },
        },
      }),
      this.prisma.account.findMany({
        where: {
          userId: user.userId,
        },
        include: {
          accountType: true,
          currency: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!userRecord?.preferredCurrencyCode || !userRecord.preferredCurrency) {
      throw new ForbiddenException('Please complete onboarding first.');
    }

    const targetCurrencyCode = userRecord.preferredCurrencyCode;
    const targetCurrencySymbol = userRecord.preferredCurrency.symbol ?? null;

    const foreignCurrencyCodes = [
      ...new Set(
        accounts
          .filter((account) => account.openingBalance !== null)
          .map((account) => account.currencyCode)
          .filter((code) => code !== targetCurrencyCode),
      ),
    ];

    // Map of quoteCurrencyCode -> rate relative to EUR (1 EUR = X quoteCurrency)
    const eurRateMap = new Map<string, number>([[PIVOT_BASE_CURRENCY, 1]]);

    if (foreignCurrencyCodes.length > 0) {
      const quotesToLookup = [
        ...new Set([...foreignCurrencyCodes, targetCurrencyCode]),
      ].filter((code) => code !== PIVOT_BASE_CURRENCY);

      const eurRates = await this.prisma.exchangeRate.findMany({
        where: {
          baseCurrencyCode: PIVOT_BASE_CURRENCY,
          quoteCurrencyCode: { in: quotesToLookup },
        },
        orderBy: { rateDate: 'desc' },
        distinct: ['quoteCurrencyCode'],
      });

      for (const rateRecord of eurRates) {
        const numericRate = Number(rateRecord.rate);
        if (numericRate > 0) {
          eurRateMap.set(rateRecord.quoteCurrencyCode, numericRate);
        }
      }
    }

    const targetEurRate = eurRateMap.get(targetCurrencyCode);
    let totalBalance = 0;

    const mappedAccounts = accounts.map((account) => {
      const openingBalance =
        account.openingBalance !== null ? Number(account.openingBalance) : null;

      let convertedOpeningBalance: number | null = null;

      if (openingBalance !== null) {
        if (account.currencyCode === targetCurrencyCode) {
          if (account.status === 'active') {
            totalBalance += openingBalance;
          }
        } else {
          const accountEurRate = eurRateMap.get(account.currencyCode);
          // Cross-rate triangulation via EUR:
          // amountInTarget = amountInAccount * (EUR->Target / EUR->Account)
          const conversionRate =
            accountEurRate && targetEurRate
              ? targetEurRate / accountEurRate
              : 1;

          const converted = openingBalance * conversionRate;
          convertedOpeningBalance = Number(converted.toFixed(2));

          if (account.status === 'active') {
            totalBalance += converted;
          }
        }
      }

      return {
        id: account.id,
        name: account.name,
        account_type: account.accountType.name,
        account_number_last4: account.accountNumberLast4,
        opening_balance: openingBalance,
        converted_opening_balance: convertedOpeningBalance,
        currency_code: account.currencyCode,
        icon_key: account.iconKey,
        status: account.status,
        created_at: account.createdAt,
        updated_at: account.updatedAt,
        currency_symbol: account.currency.symbol
          ? account.currency.symbol
          : null,
      };
    });

    return {
      summary: {
        total_balance: Number(totalBalance.toFixed(2)),
        currency_code: targetCurrencyCode,
        currency_symbol: targetCurrencySymbol,
      },
      accounts: mappedAccounts,
    };
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
