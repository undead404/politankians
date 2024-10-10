import path from 'path';

import fs from 'fs-extra';
import fetch from 'node-fetch';

import type { ArchiveItem } from '../schemas/archive-item.ts';
import parseCsv from '../utils/parse-csv.js';

const OUTPUT_DIRS = {
  'Confessional list': './src/content/confessional-lists',
  'Parish register': './src/content/parish-register-tables',
  Revision: './src/content/revision-tables',
  Unstructured: './src/content/unstructured',
};

// Function to download a CSV file and convert it to JSON
export default async function downloadAndConvertToJSON(
  url: string,
  genre: ArchiveItem['genre'],
  fileName: string,
) {
  try {
    const response = await fetch(url);
    const csvData = await response.text();
    const jsonData = await parseCsv(csvData);
    const outputPath = path.join(OUTPUT_DIRS[genre], fileName);
    await fs.outputJson(outputPath, jsonData, { spaces: 2 });
    console.log(`Successfully saved JSON to ${outputPath}`);
  } catch (error) {
    console.error(`Failed to process ${url}:`, error);
    process.exit(1);
  }
}
