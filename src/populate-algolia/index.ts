import { confessionalListSchema } from '../schemas/confessional-list.ts';
import { parishRegisterSchema } from '../schemas/parish-register.ts';
import convertConfessionalListsToActs from '../utils/convert-confessional-list-to-acts.ts';
import convertParishRegistersToActs from '../utils/convert-parish-registers-to-acts.ts';
import getTables from './get-tables.ts';
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
