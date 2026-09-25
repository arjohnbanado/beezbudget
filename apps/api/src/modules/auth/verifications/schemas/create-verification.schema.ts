import { z } from 'zod';
export const CreateVerificationSchema = z.object({
  email: z
    .email(
      'Invalid email address. Please provide a valid one (e.g., name@example.com)',
    )
    .min(5, 'Email address must be at least 5 characters long')
    .max(320, 'Email cannot exceed 320 characters'),
});

export type CreateVerificationDto = z.infer<typeof CreateVerificationSchema>;

export const CreateVerificationResponseSchema = z.object({
  id: z.string(),
});

export type CreateVerificationResponseDto = z.infer<
  typeof CreateVerificationResponseSchema
>;
