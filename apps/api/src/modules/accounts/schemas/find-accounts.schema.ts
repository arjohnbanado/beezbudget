import { z } from 'zod';

export const FindAccountsResponseSchema = z.object({
  summary: z.object({
    total_balance: z.number(),
    currency_code: z.string(),
    currency_symbol: z.string().nullable(),
  }),
  accounts: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      account_type: z.string(),
      account_number_last4: z.string().nullable(),
      opening_balance: z.number().nullable(),
      converted_opening_balance: z.number().nullable(),
      currency_symbol: z.string().nullable(),
      currency_code: z.string(),
      icon_key: z.string(),
      status: z.enum(['active', 'inactive']),
      created_at: z.date(),
      updated_at: z.date(),
    })
    .array(),
});

export type FindAccountsResponseDto = z.infer<
  typeof FindAccountsResponseSchema
>;
