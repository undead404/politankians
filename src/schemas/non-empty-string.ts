import { z } from 'astro/zod';

export const nonEmptyString = z.string().min(1);
