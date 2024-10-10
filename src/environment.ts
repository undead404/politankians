import { z } from 'astro/zod';
import dotenv from 'dotenv';

import { nonEmptyString } from './schemas/non-empty-string.ts';
import getContext from './utils/get-context.ts';

if (typeof process !== 'undefined') {
  dotenv.config({ override: true, path: '.env' });
}

const environmentSchema = z.object({
  TYPESENSE_HOST: nonEmptyString,
  TYPESENSE_SEARCH_KEY: nonEmptyString,
});

const environment =
  typeof process === 'undefined'
    ? getContext('search', environmentSchema)
    : environmentSchema.parse(process.env);

export default environment;
