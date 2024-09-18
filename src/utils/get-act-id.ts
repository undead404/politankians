import type { ActType } from '../schemas/act_type.js';
import type { ParishRegisterRow } from '../schemas/parish-register-row.js';

const typeKeyMapping: Record<ParishRegisterRow['act_type'], string> = {
  відспівування: 'ml',
  долучення: 'cv',
  миропомазання: 'cn',
  народження: 'bh',
  ревізія: 'rn',
  смерть: 'dh',
  сповідь: 'cl',
  хрещення: 'bm',
  шлюб: 'me',
};

export interface ArchiveItemRow {
  act: number;
  act_type: ActType;
  archive: string;
  fonds: string;
  item: string;
  page: string;
  series: string;
}

export default function getActId(row: ArchiveItemRow) {
  return `${row.archive}-${row.fonds}-${row.series}-${row.item}-${row.page}-${
    typeKeyMapping[row.act_type]
  }-${row.act}`;
}
