import type { Row } from '../schemas/row.js';

export default function getRowArchiveItemId(row: Row) {
  return [row.archive, row.fonds, row.series, row.item].join('-');
}
