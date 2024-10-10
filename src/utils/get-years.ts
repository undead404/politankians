import _ from 'lodash';

import getDateYear from './get-date-year.ts';

export interface RowWithDate {
  date: string | number;
}

export default function getYears(rows: RowWithDate[]) {
  if (rows.length === 0) {
    throw new Error('No rows supplied');
  }
  const firstRow = _.minBy(rows, (row) => getDateYear(row.date));
  const lastRow = _.maxBy(rows, (row) => getDateYear(row.date));
  if (getDateYear(firstRow!.date) === getDateYear(lastRow!.date)) {
    return `${getDateYear(firstRow!.date)}`;
  }
  return `${getDateYear(firstRow!.date)}-${getDateYear(lastRow!.date)}`;
}
