import type { z } from 'astro/zod';
import { type ParishRegister } from '../schemas/parish-register.ts';
import readJSONFiles from './read-json-files.ts';

export default async function getTables<T extends z.Schema>(
  directoryPath: string,
  schema: z.Schema,
): Promise<z.infer<T>> {
  const jsonFileGenerator = readJSONFiles(directoryPath);

  const parishRegisters: ParishRegister[] = [];

  for await (const fileData of jsonFileGenerator) {
    parishRegisters.push(schema.parse(fileData.data));
  }
  return parishRegisters;
}
