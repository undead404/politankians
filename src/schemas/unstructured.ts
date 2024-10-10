import { z } from 'astro/zod';

import getRowArchiveItemId from '../utils/get-row-archive-item-id.ts';
import getSettlements from '../utils/get-settlements.ts';
import getYears from '../utils/get-years.ts';

import { unstructuredRowSchema } from './unstructured-row.ts';

export const unstructuredSchema = z
  .array(unstructuredRowSchema)
  .transform((rows) => ({
    id: getRowArchiveItemId(rows[0]!),
    rows,
    settlements: getSettlements(rows),
    years: getYears(rows),
  }));

export type Unstructured = z.infer<typeof unstructuredSchema>;
