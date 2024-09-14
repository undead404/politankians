import downloadAndConvertToJSON from './download-and-convert-to-json.js';
import getArchiveItems from './get-archive-items.js';

// Main function to read URLs from file and process them

export default async function processCSVFiles() {
  const archiveItems = await getArchiveItems();

  for (const { archive, csvUrl, genre, identifier } of archiveItems) {
    await downloadAndConvertToJSON(
      csvUrl,
      genre,
      `${archive}-${identifier}.json`,
    );
  }
}
