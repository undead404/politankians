import environment from '../environment.js';
import algoliaClient from './algolia.js';
import type { Act } from './schemas/act.js';

export default async function populateIndex(data: Act[]) {
  return algoliaClient.saveObjects({
    indexName: environment.ALGOLIA_INDEX_NAME,
    objects: data,
  });
}
