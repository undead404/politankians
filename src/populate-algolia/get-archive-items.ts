import { documentSchema, type Document } from '../schemas/document.js';
import readJSONFiles from './read-json-files.js';

export default async function getArchiveItems() {
  const directoryPath = './src/content/archive-items';
  const jsonFileGenerator = readJSONFiles(directoryPath);

  const documents: Document[] = [];

  for await (const fileData of jsonFileGenerator) {
    documents.push(documentSchema.parse(fileData.data));
  }
  return documents;
}
