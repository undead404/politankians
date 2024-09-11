import { defineCollection } from 'astro:content';

import { archiveItemSchema } from '../schemas/archive-item.ts';
import { parishRegisterSchema } from '../schemas/parish-register.ts';

const archiveItemsCollection = defineCollection({
  type: 'data',
  schema: archiveItemSchema,
});

const parishRegistersCollection = defineCollection({
  type: 'data',
  schema: parishRegisterSchema,
});

export const collections = {
  'archive-items': archiveItemsCollection,
  'parish-register-tables': parishRegistersCollection,
};
