import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';

import environment from '../environment.js';

dotenv.config();

const algoliaClient = algoliasearch(
  environment.ALGOLIA_APP_ID,
  environment.ALGOLIA_ADMIN_API_KEY,
);

export default algoliaClient;
