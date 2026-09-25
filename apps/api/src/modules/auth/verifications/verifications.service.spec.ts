import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { EmailService } from '../../email/email.service';
import { ConflictException } from '@nestjs/common';
import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  let verificationService: VerificationsService;
  let prismaService: PrismaService;
  let emailService: EmailService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [VerificationsService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            verificationToken: {
              create: vi.fn(),
            },
            user: {
              findUnique: vi.fn(),
            },
          };
        }

        if (token === EmailService) {
          return {
            sendEmailVerification: vi.fn(),
          };
        }
      })
      .compile();

    verificationService = moduleRef.get(VerificationsService);
    prismaService = moduleRef.get(PrismaService);
    emailService = moduleRef.get(EmailService);
  });

  describe('createVerification', () => {
    it('should throw conflict error if submitted email address already exists', async () => {
      const email = 'existedEmail@email.com';

      vi.mocked(prismaService.user.findUnique).mockResolvedValue({
        email,
      } as any);

      const action = verificationService.createVerification({ email });

      await expect(action).rejects.toThrow(ConflictException);
      await expect(action).rejects.toThrow(
        'An account with this email address already exists.',
      );

      expect(prismaService.verificationToken.create).not.toHaveBeenCalled();
      expect(emailService.sendEmailVerification).not.toHaveBeenCalled();
    });
  });
});
