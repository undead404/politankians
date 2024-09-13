import { defineCollection } from 'astro:content';

import { archiveSchema } from '../schemas/archive.ts';
import { archiveItemSchema } from '../schemas/archive-item.ts';
import { confessionalListSchema } from '../schemas/confessional-list.ts';
import { parishRegisterSchema } from '../schemas/parish-register.ts';
import { settlementSchema } from '../schemas/settlement.ts';

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
