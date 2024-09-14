import { liteClient } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import {
  searchBox,
  hits,
  refinementList,
  numericMenu,
  poweredBy,
} from 'instantsearch.js/es/widgets';
import { z } from 'astro/zod';

import getContext from '../utils/get-context.js';
import { nonEmptyString } from '../schemas/non-empty-string.js';

const ACT_TYPE_CLASSES = {
  відспівування: 'memorial-service',
  миропомазання: 'confirmation',
  народження: 'birth',
  смерть: 'death',
  хрещення: 'baptism',
  шлюб: 'marriage',
};
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
  poweredBy({
    container: '#powered-by',
  }),
  hits({
    container: '#output-box',
    templates: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item(hit: { act_type: any; objectID: any }, { html, components }: any) {
        return html`
          <a
            class=${(ACT_TYPE_CLASSES as Record<string, string>)[
              hit.act_type as string
            ]}
            href="/act/${hit.objectID}"
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
  numericMenu({
    attribute: 'year',
    container: '#refinement-list-year',
    items: [
      {
        label: 'Усі роки',
      },
      {
        end: 1799,
        label: '1790-ті',
        start: 1790,
      },
      {
        end: 1809,
        label: '1800-ті',
        start: 1800,
      },
      {
        end: 1819,
        label: '1810-ті',
        start: 1810,
      },
      {
        end: 1829,
        label: '1820-ті',
        start: 1820,
      },
    ],
  }),
]);
search.start();
