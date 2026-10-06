import { z } from 'zod';

export const FindAccountTypesResponseSchema = z
  .object({
    name: z.string(),
  })
  .array();

export type FindAccountTypesResponseDto = z.infer<
  typeof FindAccountTypesResponseSchema
>;
