import {
  searchBox,
  hits,
  refinementList,
  numericMenu,
  poweredBy,
} from 'instantsearch.js/es/widgets';
import { z } from 'astro/zod';

import { nonEmptyString } from '../schemas/non-empty-string.js';
import getTypesenseSearch from '../services/typesense.ts';
import getContext from '../utils/get-context.js';
import getHitPath from '../utils/get-hit-path.ts';

const ACT_TYPE_CLASSES = {
  відспівування: 'memorial-service',
  долучення: 'conversion',
  миропомазання: 'confirmation',
  народження: 'birth',
  смерть: 'death',
  хрещення: 'baptism',
  шлюб: 'marriage',
};
const contextSchema = z.object({
  TYPESENSE_HOST: nonEmptyString,
  TYPESENSE_SEARCH_KEY: nonEmptyString,
});

const context = getContext('search', contextSchema);

const search = getTypesenseSearch(
  context.TYPESENSE_SEARCH_KEY,
  context.TYPESENSE_HOST,
);

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
      item(hit: { act_type: any; id: any }, { html, components }: any) {
        return html`
          <a
            class=${(ACT_TYPE_CLASSES as Record<string, string>)[
              hit.act_type as string
            ]}
            href="${getHitPath(hit)}"
            ><h2>${components.Snippet({ hit, attribute: 'title' })}</h2>
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
      {
        end: 1839,
        label: '1830-ті',
        start: 1830,
      },
      {
        end: 1849,
        label: '1840-ті',
        start: 1840,
      },
      {
        end: 1859,
        label: '1850-ті',
        start: 1850,
      },
      {
        end: 1869,
        label: '1860-ті',
        start: 1860,
      },
      {
        end: 1879,
        label: '1870-ті',
        start: 1870,
      },
      {
        end: 1889,
        label: '1880-ті',
        start: 1880,
      },
      {
        end: 1899,
        label: '1890-ті',
        start: 1890,
      },
      {
        end: 1909,
        label: '1900-ті',
        start: 1900,
      },
      {
        end: 1919,
        label: '1910-ті',
        start: 1910,
      },
    ],
  }),
]);
search.start();
