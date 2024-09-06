import { finished } from 'stream/promises';

import { parse } from 'csv-parse';
import * as v from 'valibot';
import { rowSchema, type Row } from '../schemas/row.js';

export default async function fetchFromGoogleSheets(
  url: string,
): Promise<Row[]> {
  const response = await fetch(url);
  const csvString = await response.text();
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
  return rawData.map((rawDatum) => {
    return v.parse(rowSchema, rawDatum);
  });
}
