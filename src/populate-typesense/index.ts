import path from 'path';

import fsExtra from 'fs-extra';

import { archiveItemSchema } from '../schemas/archive-item.ts';
import { confessionalListSchema } from '../schemas/confessional-list.js';
import { parishRegisterSchema } from '../schemas/parish-register.js';
import { revisionSchema } from '../schemas/revision.ts';
import { unstructuredSchema } from '../schemas/unstructured.ts';
import convertConfessionalListsToActs from '../utils/convert-confessional-list-to-acts.js';
import convertParishRegistersToActs from '../utils/convert-parish-registers-to-acts.js';
import convertRevisionsToActs from '../utils/convert-revisions-to-acts.ts';

import populateIndex from './populate-index.js';
import readJSONFiles from './read-json-files.ts';
import populateUnstructured from './populate-unstructured.ts';

const GENRE_FOLDERS = {
  'Confessional list': './src/content/confessional-lists',
  'Parish register': './src/content/parish-register-tables',
  Revision: './src/content/revision-tables',
  Unstructured: './src/content/unstructured',
};

try {
  for await (const { fileName, data } of readJSONFiles(
    './src/content/archive-items',
  )) {
    const archiveItem = archiveItemSchema.parse(data);
    const folder = GENRE_FOLDERS[archiveItem.genre];
    const filePath = path.join(folder, fileName);
    const jsonData = await fsExtra.readJson(filePath);
    switch (archiveItem.genre) {
      case 'Confessional list': {
        const confessionalLists = convertConfessionalListsToActs([
          confessionalListSchema.parse(jsonData),
        ]);
        await populateIndex(confessionalLists, archiveItem.tableLocale);
        break;
      }
      case 'Parish register': {
        const parishRegisters = convertParishRegistersToActs([
          parishRegisterSchema.parse(jsonData),
        ]);
        await populateIndex(parishRegisters, archiveItem.tableLocale);
        break;
      }
      case 'Revision': {
        const revisions = convertRevisionsToActs([
          revisionSchema.parse(jsonData),
        ]);
        await populateIndex(revisions, archiveItem.tableLocale);
        break;
      }
      case 'Unstructured': {
        const unstructured = unstructuredSchema.parse(jsonData);
        await populateUnstructured(unstructured.rows, archiveItem.tableLocale);
      }
    }
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
