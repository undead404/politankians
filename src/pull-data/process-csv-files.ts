import downloadAndConvertToJSON from './download-and-convert-to-json.js';
import getArchiveItems from './get-archive-items.ts';

// Main function to read URLs from file and process them

const OUTPUT_DIR = './src/content/parish-register-tables';

export default async function processCSVFiles() {
  const archiveItems = await getArchiveItems();

  for (const url of archiveItems.map(({ csvUrl }) => csvUrl)) {
    await downloadAndConvertToJSON(url, OUTPUT_DIR);
  }
}
