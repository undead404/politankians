/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  searchBox,
  hits,
  refinementList,
  rangeSlider,
  //index,
  stats,
} from 'instantsearch.js/es/widgets';
import { z } from 'astro/zod';

import { nonEmptyString } from '../schemas/non-empty-string.js';
import { settlementSchema } from '../schemas/settlement.ts';
import getTypesenseSearch from '../services/typesense.ts';
import getContext from '../utils/get-context.js';
import getHitPath from '../utils/get-hit-path.ts';
//import getPersonFullName from '../utils/get-person-full-name.ts';

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
const settlementsRegistrySchema = z.object({
  settlements: z.record(settlementSchema),
});

const context = getContext('search', contextSchema);
const settlementsRegistry = getContext(
  'settlements',
  settlementsRegistrySchema,
).settlements;

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
  hits({
    container: '#output-box',
    templates: {
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
  stats({
    container: '#acts_ru_count',
    templates: {
      text: (data: any) => `(${data.nbHits})`,
    },
  }),
  refinementList({
    attribute: 'act_type',
    container: '#refinement-list',
    sortBy: ['name'],
  }),
  rangeSlider({
    attribute: 'year',
    container: '#refinement-list-year',
    max: 1919,
    min: 1795,
    pips: true,
    tooltips: true,
  }),

  refinementList({
    attribute: 'settlement',
    container: '#refinement-list-settlement',
    sortBy: ['name'],
    transformItems: (items: { label: string; value: string }[]) => {
      return items.map((item) => ({
        ...item,
        highlighted: settlementsRegistry[item.value]!.name,
      }));
    },
  }),
  /*index({ indexName: 'unstructured_uk' }).addWidgets([
    hits({
      container: '#output-box-unstructured_uk',
      templates: {
        item: (hit: any, { html, components }: any) =>
          html`<a
            href="/archive-item/${hit.archive}-${hit.fonds}-${hit.series}-${hit.item}"
            ><h2>${getPersonFullName(hit)}</h2>
            <p>${components.Snippet({ hit, attribute: 'description' })}</p>
          </a>`,
      },
    }),
    stats({
      container: '#unstructured_uk_count',
      templates: {
        text: (data: any) => `(${data.nbHits})`,
      },
    }),
  ]),*/
]);
search.start();
