import * as v from 'valibot';

import dotenv from 'dotenv';

dotenv.config();

const nonEmptyString = v.pipe(v.string(), v.nonEmpty());

const environmentSchema = v.object({
  ALGOLIA_ADMIN_API_KEY: nonEmptyString,
  ALGOLIA_APP_ID: nonEmptyString,
  ALGOLIA_INDEX_NAME: nonEmptyString,
});

const environment = v.parse(environmentSchema, process.env);

export default environment;
