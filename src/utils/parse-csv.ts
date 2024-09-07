import { finished } from 'stream/promises';

import { parse } from 'csv-parse';

export default async function parseCsv(csvString: string) {
  const parser = parse(csvString, { columns: true });
  const rawData: unknown[] = [];
  parser.on('readable', function () {
    let record = parser.read();
    while (record !== null && record !== undefined) {
      // Work with each record
      rawData.push(record);
      record = parser.read();
    }
  });
  await finished(parser);
  return rawData;
}
