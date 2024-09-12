import { defineCollection } from 'astro:content';

import { archiveItemSchema } from '../schemas/archive-item.ts';
import { parishRegisterSchema } from '../schemas/parish-register.ts';
import { settlementSchema } from '../schemas/settlement.ts';
import { archiveSchema } from '../schemas/archive.ts';

const archivesCollection = defineCollection({
  type: 'data',
  schema: archiveSchema,
});

const archiveItemsCollection = defineCollection({
  type: 'data',
  schema: archiveItemSchema,
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
  'parish-register-tables': parishRegistersCollection,
  settlements: settlementsCollection,
};
