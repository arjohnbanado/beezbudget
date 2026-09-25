import { z } from 'zod';

export const CreateUserSchema = z.object({
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
    ),
  rawToken: z
    .string()
    .regex(/^[0-9a-f]{64}$/, 'Token must be a 64-character hexadecimal string'),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
