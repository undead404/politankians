import fs from 'fs-extra';

import downloadAndConvertToJSON from './download-and-convert-to-json.js';

// Main function to read URLs from file and process them

export default async function processCSVFiles() {
  const urlsFilePath = './spreadsheets.txt';
  const outputDir = 'src/content/archive-items';

  const urls = await fs.readFile(urlsFilePath, 'utf-8');
  const urlList = urls.split('\n').filter((url) => url.trim() !== '');

  for (const url of urlList) {
    await downloadAndConvertToJSON(url, outputDir);
  }
}
