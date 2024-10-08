import { z } from 'astro/zod';

import dotenv from 'dotenv';

dotenv.config({ override: true, path: '.env' });

const nonEmptyString = z.string().min(1);

const environmentSchema = z.object({
  TYPESENSE_HOST: nonEmptyString,
  TYPESENSE_SEARCH_KEY: nonEmptyString,
});

const environment = environmentSchema.parse(process.env);
export default environment;
