import { defineCollection } from 'astro:content';

import { archiveSchema } from '../schemas/archive.js';
import { archiveItemSchema } from '../schemas/archive-item.js';
import { confessionalListSchema } from '../schemas/confessional-list.js';
import { parishRegisterSchema } from '../schemas/parish-register.js';
import { settlementSchema } from '../schemas/settlement.js';

const archivesCollection = defineCollection({
  type: 'data',
  schema: archiveSchema,
});

const archiveItemsCollection = defineCollection({
  type: 'data',
  schema: archiveItemSchema,
});

const confessionalListsCollection = defineCollection({
  type: 'data',
  schema: confessionalListSchema,
});

const parishRegistersCollection = defineCollection({
  type: 'data',
  schema: parishRegisterSchema,
});

const settlementsCollection = defineCollection({
  type: 'data',
  schema: settlementSchema,
});

export const collections = {
  archives: archivesCollection,
  'archive-items': archiveItemsCollection,
  'confessional-lists': confessionalListsCollection,
  'parish-register-tables': parishRegistersCollection,
  settlements: settlementsCollection,
};
