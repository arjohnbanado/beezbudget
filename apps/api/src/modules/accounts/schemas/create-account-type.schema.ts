import { z } from 'zod';

export const CreateAccountTypeSchema = z.object({
  account_type: z
    .string()
    .min(1, 'Account type name is required.')
    .max(100, 'Account type name must be 100 characters or fewer.'),
});

export type CreateAccountTypeDto = z.infer<typeof CreateAccountTypeSchema>;


