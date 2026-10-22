import { z } from 'zod';

export const CompleteOnboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(100, 'Name must be 100 characters or fewer.'),
  preferred_currency_code: z
    .string()
    .regex(/^[A-Z]{3}$/, 'Select a valid currency.'),
});

export type CompleteOnboardingDto = z.infer<typeof CompleteOnboardingSchema>;
