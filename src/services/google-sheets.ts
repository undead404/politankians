import convertRowsToActs from '../utils/convert-rows-to-acts.js';
import fetchFromGoogleSheets from './fetch-from-google-sheets.js';

export default async function getActs(urls: string[]) {
  const dataSets = await Promise.all(urls.map(fetchFromGoogleSheets));
  const rows = dataSets.flat();
  return convertRowsToActs(rows);
}
