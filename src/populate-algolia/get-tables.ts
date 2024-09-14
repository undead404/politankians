import type { z } from 'astro/zod';

import readJSONFiles from './read-json-files.js';

export default async function getTables<T extends z.Schema>(
  directoryPath: string,
  schema: z.Schema,
): Promise<z.infer<T>> {
  const jsonFileGenerator = readJSONFiles(directoryPath);

  const tables: z.infer<T>[] = [];

  for await (const fileData of jsonFileGenerator) {
    tables.push(schema.parse(fileData.data));
  }
  return tables;
}
