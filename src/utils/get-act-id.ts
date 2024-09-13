import type { ActType } from '../schemas/act_type.ts';
import type { ParishRegisterRow } from '../schemas/parish-register-row.ts';

const typeKeyMapping: Record<ParishRegisterRow['act_type'], string> = {
  відспівування: 'ml',
  миропомазання: 'cn',
  народження: 'bh',
  смерть: 'dh',
  сповідь: 'cl',
  хрещення: 'bm',
  шлюб: 'me',
};

interface ArchiveItemRow {
  act: number;
  act_type: ActType;
  archive: string;
  fonds: string;
  item: string;
  page: number;
  series: string;
}

export default function getActId(row: ArchiveItemRow) {
  return `${row.archive}-${row.fonds}-${row.series}-${row.item}-${row.page}-${
    typeKeyMapping[row.act_type]
  }-${row.act}`;
}
