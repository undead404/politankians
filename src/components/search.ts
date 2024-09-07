import { liteClient } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, refinementList } from 'instantsearch.js/es/widgets';
import { z } from 'zod';

import getContext from '../utils/get-context.js';
import { nonEmptyString } from '../schemas/non-empty-string.js';

const contextSchema = z.object({
  ALGOLIA_APP_ID: nonEmptyString,
  ALGOLIA_INDEX_NAME: nonEmptyString,
  ALGOLIA_SEARCH_API_KEY: nonEmptyString,
});

const context = getContext('search', contextSchema);

const search = instantsearch({
  indexName: context.ALGOLIA_INDEX_NAME,
  routing: true,
  searchClient: liteClient(
    context.ALGOLIA_APP_ID,
    context.ALGOLIA_SEARCH_API_KEY,
  ),
});
search.addWidgets([
  searchBox({
    container: '#search-box',
    showLoading: true,
    showSubmit: true,
  }),

  hits({
    container: '#output-box',
    templates: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item(hit: { objectID: any }, { html, components }: any) {
        return html`
          <a href="/event/${hit.objectID}"
            ><h2>${components.Highlight({ hit, attribute: 'title' })}</h2>
            <p>${components.Snippet({ hit, attribute: 'description' })}</p>
          </a>
        `;
      },
    },
  }),
  refinementList({
    attribute: 'act_type',
    container: '#refinement-list',
    sortBy: ['name'],
  }),
]);
search.start();
