import { defineCollection } from 'astro/content/runtime';

import { archiveSchema } from '../schemas/archive.js';
import { archiveItemSchema } from '../schemas/archive-item.js';
import { confessionalListSchema } from '../schemas/confessional-list.js';
import { parishRegisterSchema } from '../schemas/parish-register.js';
import { revisionSchema } from '../schemas/revision.js';
import { settlementSchema } from '../schemas/settlement.js';
import { unstructuredSchema } from '../schemas/unstructured.ts';

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

const revisionsCollection = defineCollection({
  type: 'data',
  schema: revisionSchema,
});

const settlementsCollection = defineCollection({
  type: 'data',
  schema: settlementSchema,
});
const unstructuredCollection = defineCollection({
  type: 'data',
  schema: unstructuredSchema,
});

export const collections = {
  archives: archivesCollection,
  'archive-items': archiveItemsCollection,
  'confessional-lists': confessionalListsCollection,
  'parish-register-tables': parishRegistersCollection,
  'revision-tables': revisionsCollection,
  settlements: settlementsCollection,
  unstructured: unstructuredCollection,
};
