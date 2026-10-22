import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PrismaService } from '../../database/prisma/prisma.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            user: {
              findUnique: vi.fn(),
              update: vi.fn(),
            },
            currency: {
              findFirst: vi.fn(),
            },
          };
        }
      })
      .compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMe', () => {
    it('should return user profile with is_onboarded false when onboardedAt is null', async () => {
      vi.mocked(prismaService.user.findUnique).mockResolvedValue({
        id: 'user-1',
        name: 'SwiftBee',
        email: 'user@example.com',
        preferredCurrencyCode: null,
        onboardedAt: null,
      } as any);

      const result = await service.findMe('user-1');

      expect(result).toEqual({
        id: 'user-1',
        name: 'SwiftBee',
        email: 'user@example.com',
        preferred_currency_code: null,
        is_onboarded: false,
      });
    });
  });

  describe('completeOnboarding', () => {
    it('should throw NotFoundException if currency is not selectable', async () => {
      vi.mocked(prismaService.currency.findFirst).mockResolvedValue(null);

      await expect(
        service.completeOnboarding('user-1', {
          name: 'John Doe',
          preferred_currency_code: 'USD',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
