import { defineCollection } from 'astro:content';

import { documentSchema } from '../schemas/document.js';

const archiveItemsCollection = defineCollection({
  type: 'data',
  schema: documentSchema,
});

export const collections = {
  'archive-items': archiveItemsCollection,
};
