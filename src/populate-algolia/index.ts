import convertParishRegistersToActs from '../utils/convert-parish-registers-to-acts.ts';
import getArchiveItems from './get-parish-register-tables.js';
import populateIndex from './populate-index.js';

try {
  const archiveItems = await getArchiveItems();
  const acts = convertParishRegistersToActs(archiveItems);
  await populateIndex(acts);
} catch (error) {
  console.error(error);
  process.exit(1);
}
