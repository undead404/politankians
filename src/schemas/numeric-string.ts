import { z } from 'astro/zod';
import { nonEmptyString } from './non-empty-string.js';

export const numericString = nonEmptyString
  .transform((input) => Number.parseInt(input))
  .refine((input) => !Number.isNaN(input));

export type NumericString = z.infer<typeof numericString>;
