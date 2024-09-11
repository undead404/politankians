import { readdir, readFile } from 'fs/promises';
import path from 'path';

import { archiveItemSchema } from '../schemas/archive-item.ts';

const ARCHIVE_ITEMS_FOLDER = './src/content/archive-items';

export default async function getArchiveItems() {
  const files = await readdir(ARCHIVE_ITEMS_FOLDER);
  const jsonFiles = files.filter((file) => path.extname(file) === '.json');
  const dataItems = await Promise.all(
    jsonFiles.map(async (jsonFile) => {
      const filePath = path.join(ARCHIVE_ITEMS_FOLDER, jsonFile);
      const fileContent = await readFile(filePath, 'utf8');
      const parsedContent = JSON.parse(fileContent);
      return parsedContent;
    }),
  );
  return dataItems.map((rawData) => archiveItemSchema.parse(rawData));
}
