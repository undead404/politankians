import getActs from '../services/google-sheets.js';
import populateIndex from './populate-index.js';

export default async function processSpreadsheets(urls: string[]) {
  const acts = await getActs(urls);
  await populateIndex(acts);
}
