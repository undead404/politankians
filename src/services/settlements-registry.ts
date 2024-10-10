import { z } from 'astro/zod';

import { Settlement, settlementSchema } from '../schemas/settlement.ts';
import fromServerOrClient from '../utils/from-server-or-client.ts';
import getContext from '../utils/get-context.ts';

const settlementsRegistrySchema = z.object({
  settlements: z.record(settlementSchema),
});

export type SettlementsRegistry = Record<string, Settlement>;

const settlementsRegistry = await fromServerOrClient<SettlementsRegistry>(
  async () => {
    const { getCollection } = await import('./astro-content.ts');
    const settlements = await getCollection('settlements');
    return Object.fromEntries(settlements.map(({ data, id }) => [id, data]));
  },
  async () => {
    return getContext('settlements', settlementsRegistrySchema).settlements;
  },
);

export default settlementsRegistry;
