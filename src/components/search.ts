import { liteClient } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, refinementList } from 'instantsearch.js/es/widgets';
import * as v from 'valibot';

import { nonEmptyString } from '../utils/non-empty-string.ts';
import getContext from '../utils/get-context.ts';

const contextSchema = v.object({
  ALGOLIA_APP_ID: nonEmptyString,
  ALGOLIA_INDEX_NAME: nonEmptyString,
  ALGOLIA_SEARCH_API_KEY: nonEmptyString,
});

const context = getContext('search', contextSchema);

const search = instantsearch({
  indexName: context.ALGOLIA_INDEX_NAME,
  searchClient: liteClient(
    context.ALGOLIA_APP_ID,
    context.ALGOLIA_SEARCH_API_KEY,
  ),
});
search.addWidgets([
  searchBox({
    container: '#search-box',
    showSubmit: true,
  }),

  hits({
    container: '#output-box',
    templates: {
      item(hit: unknown, { html, components }) {
        return html`
          <h2>${components.Highlight({ hit, attribute: 'title' })}</h2>
          <p>${components.Snippet({ hit, attribute: 'description' })}</p>
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
