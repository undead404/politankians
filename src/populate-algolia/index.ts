import { confessionalListSchema } from '../schemas/confessional-list.js';
import { parishRegisterSchema } from '../schemas/parish-register.js';
import convertConfessionalListsToActs from '../utils/convert-confessional-list-to-acts.js';
import convertParishRegistersToActs from '../utils/convert-parish-registers-to-acts.js';
import getTables from './get-tables.js';
import populateIndex from './populate-index.js';

try {
  const parishRegisters = await getTables(
    './src/content/parish-register-tables',
    parishRegisterSchema,
  );
  const parishRegisterActs = convertParishRegistersToActs(parishRegisters);
  await populateIndex(parishRegisterActs);
  const confessionalLists = await getTables(
    './src/content/confessional-lists',
    confessionalListSchema,
  );
  const confessionListActs = convertConfessionalListsToActs(confessionalLists);
  await populateIndex(confessionListActs);
} catch (error) {
  console.error(error);
  process.exit(1);
}
