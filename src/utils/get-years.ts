import _ from 'lodash';

export interface RowWithDate {
  date: string;
}

export default function getYears(rows: RowWithDate[]) {
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
