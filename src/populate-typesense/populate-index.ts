import _ from 'lodash';
import type { Act } from '../schemas/act.js';

import typesense from './typesense.js';

const CHUNK_SIZE = 1000;

export default async function populateIndex(data: Act[]) {
  const chunks = _.chunk(data, CHUNK_SIZE);
  for (const chunk of chunks) {
    await typesense.collections('acts').documents().import(chunk);
  }
}
