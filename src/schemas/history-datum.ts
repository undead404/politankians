import { z } from 'astro/zod';

export const historyDatumSchema = z.object({
  births: z.number().min(0),
  deaths: z.number().min(0),
  year: z.string().transform((input) => Number.parseInt(input)),
});

export type HistoryDatum = z.infer<typeof historyDatumSchema>;

export const historyDataSchema = z.array(historyDatumSchema).min(1);
