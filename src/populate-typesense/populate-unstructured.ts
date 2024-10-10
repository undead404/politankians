import _ from 'lodash';

import type { UnstructuredRow } from '../schemas/unstructured-row.ts';

import typesense from './typesense.js';

const CHUNK_SIZE = 100;

export default async function populateUnstructured(
  data: UnstructuredRow[],
  locale: 'ru' | 'uk',
) {
  const chunks = _.chunk(data, CHUNK_SIZE);
  for (let i = 0; i < chunks.length; i += 1) {
    console.log(`Chunk # ${i + 1}`);
    await typesense
      .collections('unstructured_' + locale)
      .documents()
      .import(chunks[i]!, { action: 'upsert' });
  }
}
