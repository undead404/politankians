import { readFile } from 'fs/promises';

import processSpreadsheets from './process-spreadsheets.js';

try {
  // Read the URLs from the file
  const data = await readFile('./spreadsheets.txt', 'utf8');
  // Split the URLs into an array
  const urls = data.split('\n').filter((url) => !!url);

  // Process the spreadsheets
  await processSpreadsheets(urls);
} catch (error) {
  console.error(error);
  process.exit(1);
}
