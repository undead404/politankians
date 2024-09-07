import path from 'path';

import fs from 'fs-extra';

import parseCsv from '../utils/parse-csv.js';
import createFileName from './create-file-name.js';

// Function to download a CSV file and convert it to JSON
export default async function downloadAndConvertToJSON(
  url: string,
  outputDir: string,
) {
  try {
    const response = await fetch(url);
    const csvData = await response.text();
    const jsonData = await parseCsv(csvData);
    const fileName = createFileName(jsonData);
    const outputPath = path.join(outputDir, fileName);
    await fs.outputJson(outputPath, jsonData, { spaces: 2 });
    console.log(`Successfully saved JSON to ${outputPath}`);
  } catch (error) {
    console.error(`Failed to process ${url}:`, error);
    process.exit(1);
  }
}
