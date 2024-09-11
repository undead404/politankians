import {
  parishRegisterSchema,
  type ParishRegister,
} from '../schemas/parish-register.ts';
import readJSONFiles from './read-json-files.js';

export default async function getArchiveItems() {
  const directoryPath = './src/content/parish-register-tables';
  const jsonFileGenerator = readJSONFiles(directoryPath);

  const parishRegisters: ParishRegister[] = [];

  for await (const fileData of jsonFileGenerator) {
    parishRegisters.push(parishRegisterSchema.parse(fileData.data));
  }
  return parishRegisters;
}
