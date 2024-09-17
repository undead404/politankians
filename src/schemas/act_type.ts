import { z } from 'astro/zod';

export const actTypeSchema = z.enum([
  'відспівування',
  'долучення',
  'миропомазання',
  'народження',
  'смерть',
  'сповідь',
  'хрещення',
  'шлюб',
]);

export type ActType = z.infer<typeof actTypeSchema>;
