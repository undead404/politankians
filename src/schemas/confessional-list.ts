import _ from 'lodash';
import { z } from 'astro/zod';

import getRowArchiveItemId from '../utils/get-row-archive-item-id.ts';
import {
  confessionalListRowSchema,
  type ConfessionalListRow,
} from './confessional-list-row.ts';

function getSettlements(rows: ConfessionalListRow[]) {
  return _.uniqBy(rows, 'settlement')
    .map((row) => row.settlement)
    .join(', ');
}

function getYears(rows: ConfessionalListRow[]) {
  if (rows.length === 0) {
    throw new Error('No rows supplied');
  }
  const firstRow = _.minBy(rows, (row) => row.date.slice(0, 4));
  const lastRow = _.maxBy(rows, (row) => row.date.slice(0, 4));
  if (firstRow!.date.slice(0, 4) === lastRow!.date.slice(0, 4)) {
    return `${firstRow!.date.slice(0, 4)}`;
  }
  return `${firstRow!.date.slice(0, 4)}-${lastRow!.date.slice(0, 4)}`;
}

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
        'All rows in a parish register must belong to the same archive item',
    },
  )
  .transform((rows) => ({
    id: getRowArchiveItemId(rows[0]!),
    rows,
    settlements: getSettlements(rows),
    years: getYears(rows),
  }));

export type ConfessionalList = z.infer<typeof confessionalListSchema>;
