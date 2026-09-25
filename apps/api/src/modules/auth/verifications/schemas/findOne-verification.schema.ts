import { z } from 'zod';

export const FindOneVerificationSchema = z.object({
  id: z.uuid('Invalid verification ID. Please provide a valid UUID'),
});
export type FindOneVerificationDto = z.infer<typeof FindOneVerificationSchema>;

export const FindOneVerificationResponseSchema = z.object({
  email: z.string(),
  resendAvailableAt: z.date(),
});
export type FindOneVerificationResponseDto = z.infer<
  typeof FindOneVerificationResponseSchema
>;

export const FindOneVerificationFilterSchema = z.object({
  status: z.enum(['used', 'expired']).optional(),
});

export type FindOneVerificationFilterDto = z.infer<
  typeof FindOneVerificationFilterSchema
>;
