import { z } from 'zod';

export const FindCurrenciesResponseSchema = z.array(
  z.object({
    code: z.string(),
    name: z.string(),
    symbol: z.string().nullable(),
  }),
);

export type FindCurrenciesResponseDto = z.infer<
  typeof FindCurrenciesResponseSchema
>;
