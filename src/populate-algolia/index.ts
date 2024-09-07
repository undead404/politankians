import getArchiveItems from './get-archive-items.js';
import convertDocumentsToActs from '../utils/convert-documents-to-acts.js';
import populateIndex from './populate-index.js';

try {
  const archiveItems = await getArchiveItems();
  const acts = convertDocumentsToActs(archiveItems);
  await populateIndex(acts);
} catch (error) {
  console.error(error);
  process.exit(1);
}
