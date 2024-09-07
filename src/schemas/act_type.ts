import { z } from 'zod';

export const actTypeSchema = z.enum([
  'відспівування',
  'миропомазання',
  'народження',
  'смерть',
  'хрещення',
  'шлюб',
]);
