import { z } from 'zod';

export const FindOneForgotPasswordSchema = z.object({
  id: z.uuid('Invalid verification ID. Please provide a valid UUID'),
});

export type FindOneForgotPasswordDto = z.infer<
  typeof FindOneForgotPasswordSchema
>;

export const FindOneForgotPasswordResponseSchema = z.object({
  email: z.string(),
  resendAvailableAt: z.date(),
});

export type FindOneForgotPasswordResponseDto = z.infer<
  typeof FindOneForgotPasswordResponseSchema
>;

export const FindOneForgotPasswordFilterSchema = z.object({
  status: z.enum(['used', 'expired']).optional(),
});

export type FindOneForgotPasswordFilterDto = z.infer<
  typeof FindOneForgotPasswordFilterSchema
>;
