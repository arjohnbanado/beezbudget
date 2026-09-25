import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .email('Please enter a valid email address.')
    .max(320, 'Email address is too long.'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
