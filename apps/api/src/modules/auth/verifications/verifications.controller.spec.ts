import { vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';

describe('VerificationsController', () => {
  let verificationController: VerificationsController;
  let verificationsService: VerificationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VerificationsController],
    })
      .useMocker((token) => {
        if (token === VerificationsService) {
          return {
            createVerification: vi.fn(),
          };
        }
      })
      .compile();

    verificationController = moduleRef.get(VerificationsController);
    verificationsService = moduleRef.get(VerificationsService);
  });

  describe('create', () => {
    it('should pass the data to the service and return the id of newly created verification token', async () => {
      const dto = { email: 'myemail@email.com' };
      const expectedResult = { id: 'create-verification-id' };

      vi.mocked(verificationsService.createVerification).mockResolvedValue(
        expectedResult as any,
      );

      const result = await verificationController.create(dto);

      expect(verificationsService.createVerification).toHaveBeenCalledWith(dto);

      expect(result).toEqual(expectedResult);
    });
  });
});
