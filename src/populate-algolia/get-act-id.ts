import type { Row } from './schemas/row.js';

const typeKeyMapping: Record<Row['act_type'], string> = {
  відспівування: 'ml',
  миропомазання: 'cn',
  народження: 'bh',
  смерть: 'dh',
  хрещення: 'bm',
  шлюб: 'me',
};

export default function getActId(row: Row) {
  return `${row.archive}-${row.fonds}-${row.series}-${row.item}-${row.page}-${
    typeKeyMapping[row.act_type]
  }-${row.act}`;
}
