import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config();

const nonEmptyString = z.string().min(1);

const environmentSchema = z.object({
  ALGOLIA_ADMIN_API_KEY: nonEmptyString,
  ALGOLIA_APP_ID: nonEmptyString,
  ALGOLIA_INDEX_NAME: nonEmptyString,
  ALGOLIA_SEARCH_API_KEY: nonEmptyString,
});

const environment = environmentSchema.parse(process.env);

export default environment;
