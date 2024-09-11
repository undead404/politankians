import { z } from 'astro/zod';

export const actTypeSchema = z.enum([
  'відспівування',
  'миропомазання',
  'народження',
  'смерть',
  'хрещення',
  'шлюб',
]);
