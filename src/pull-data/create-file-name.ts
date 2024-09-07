import { z } from 'zod';

import { rowSchema } from '../schemas/row.js';
import getRowArchiveItemId from '../utils/get-row-archive-item-id.js';

const documentSchema = z.array(rowSchema).refine(
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
  { message: 'All rows in a document must belong to the same archive item' },
);
export default function createFileName(data: unknown[]) {
  const rows = documentSchema.parse(data);
  return `${getRowArchiveItemId(rows[0]!)}.json`;
}
