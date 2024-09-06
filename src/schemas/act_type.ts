import * as v from 'valibot';
export const actTypeSchema = v.picklist([
  'відспівування',
  'миропомазання',
  'народження',
  'смерть',
  'хрещення',
  'шлюб',
]);
