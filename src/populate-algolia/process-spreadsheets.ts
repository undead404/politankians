import convertRowsToActs from './convert-rows-to-acts.js';
import fetchFromGoogleSheets from './fetch-from-google-sheets.js';
import populateIndex from './populate-index.js';

export default async function processSpreadsheets(urls: string[]) {
  const dataSets = await Promise.all(urls.map(fetchFromGoogleSheets));
  const rows = dataSets.flat();
  const acts = convertRowsToActs(rows);
  await populateIndex(acts);
}
