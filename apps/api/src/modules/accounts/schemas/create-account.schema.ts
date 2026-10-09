import { z } from 'zod';

export const CreateAccountSchema = z.object({
  account_type: z
    .string()
    .min(1, 'Account type is required.')
    .max(100, 'Account type name must be 100 characters or fewer.'),
  name: z
    .string()
    .trim()
    .min(1, 'Account name is required.')
    .max(100, 'Account name must be 100 characters or fewer.'),
  account_number: z
    .string()
    .max(255, 'Account number must be 255 characters or fewer.'),
  opening_balance: z
    .number()
    .min(-9999999999999999, 'Enter a valid amount.')
    .max(9999999999999999, 'Enter a valid amount.')
    .refine((val) => {
      const decimalStr = val.toString().split('.')[1];
      return !decimalStr || decimalStr.length <= 2;
    }, 'Enter a valid amount.')
    .nullable()
    .optional(),
  currency_code: z.string().regex(/^[A-Z]{3}$/, 'Select a valid currency.'),
  icon_key: z.string().trim().min(1, 'Select an icon.').max(100),
});

export type CreateAccountDto = z.infer<typeof CreateAccountSchema>;
