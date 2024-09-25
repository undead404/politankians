import _ from 'lodash';
import type { Act } from '../schemas/act.js';

import typesense from './typesense.js';

const CHUNK_SIZE = 100;

export default async function populateIndex(data: Act[]) {
  const chunks = _.chunk(data, CHUNK_SIZE);
  for (let i = 0; i < chunks.length; i += 1) {
    console.log(`Chunk # ${i + 1}`);
    await typesense.collections('acts').documents().import(chunks[i]!);
  }
}
