import type { Act } from '../schemas/act.js';

import typesense from './typesense.js';

export default async function populateIndex(data: Act[]) {
  return typesense.collections('acts').documents().import(data);
}
