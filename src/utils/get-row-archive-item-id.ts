export interface ArchiveTableRow {
  archive: string;
  fonds: string;
  item: string;
  series: string;
}

export default function getRowArchiveItemId(row: ArchiveTableRow) {
  if (!row.archive || !row.fonds || !row.series || !row.item) {
    throw new Error('Missing archive item info');
  }
  return [row.archive, row.fonds, row.series, row.item].join('-');
}
