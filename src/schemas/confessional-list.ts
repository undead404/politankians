import { z } from 'astro/zod';

import getRowArchiveItemId from '../utils/get-row-archive-item-id.js';
import getSettlements from '../utils/get-settlements.js';
import getYears from '../utils/get-years.js';

import { confessionalListRowSchema } from './confessional-list-row.js';

export const confessionalListSchema = z
  .array(confessionalListRowSchema)
  .refine(
    (rows) => {
      const firstRow = rows.at(0);
      if (!firstRow) {
        return false;
      }
      const firstRowArchiveItemId = getRowArchiveItemId(firstRow);
      return rows.every(
        (row) => getRowArchiveItemId(row) === firstRowArchiveItemId,
      );
    },
    {
      message:
        'All rows in a confessional list must belong to the same archive item',
    },
  )
  .transform((rows) => ({
    id: getRowArchiveItemId(rows[0]!),
    rows,
    settlements: getSettlements(rows),
    years: getYears(rows),
  }))
  .refine(({ settlements, years }) => {
    return !!settlements && !!years;
  });

export type ConfessionalList = z.infer<typeof confessionalListSchema>;
