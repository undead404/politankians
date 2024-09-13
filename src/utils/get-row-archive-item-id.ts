interface ArchiveTableRow {
  archive: string;
  fonds: string;
  item: string;
  series: string;
}

export default function getRowArchiveItemId(row: ArchiveTableRow) {
  return [row.archive, row.fonds, row.series, row.item].join('-');
}
