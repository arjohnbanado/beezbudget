import { z } from 'zod';

export const FindMeResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  preferred_currency_code: z.string().nullable(),
  is_onboarded: z.boolean(),
});

export type FindMeResponseDto = z.infer<typeof FindMeResponseSchema>;
