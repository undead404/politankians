import _ from 'lodash';

export interface RowWithSettlement {
  settlement: string;
}

export default function getSettlements(rows: RowWithSettlement[]) {
  return _.uniqBy(rows, 'settlement')
    .map((row) => row.settlement)
    .join(', ');
}
