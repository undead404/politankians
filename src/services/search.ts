import { z } from 'astro/zod';
import type { Client } from 'typesense';

import { type Act, actSchema } from '../schemas/act.ts';
import {
  type UnstructuredRecord,
  unstructuredRecordSchema,
} from '../schemas/unstructured-record.ts';

const actsSchema = z.array(actSchema);
const unstructuredsSchema = z.array(unstructuredRecordSchema);

export interface SearchParameters {
  client: Client;
  facets: Record<string, string[]>;
  query: string;
  ranges: Record<string, [number, number]>;
}

export interface SearchResults {
  acts_ru: {
    hits: Act[];
    number: number;
  };
  unstructured_uk: {
    hits: UnstructuredRecord[];
    number: number;
  };
}

export default async function search({
  client,
  facets,
  query,
  ranges,
}: SearchParameters): Promise<SearchResults> {
  const facetFilters = Object.entries(facets)
    .filter(([, values]) => values.length > 0)
    .map(([attribute, values]) =>
      values.map((value) => `${attribute}:${value}`).join(' || '),
    )
    .join(' && ');

  const rangeFilters = Object.entries(ranges)
    .map(
      ([attribute, [min, max]]) =>
        `${attribute}:>=${min} && ${attribute}:<=${max}`,
    )
    .join(' && ');

  const filter_by = [facetFilters, rangeFilters].filter(Boolean).join(' && ');

  const [searchResultsActs, searchResultsUnstructured] = await Promise.all([
    client
      .collections('acts_ru')
      .documents()
      .search({
        q: query,
        query_by: [
          'primaryParticipants.surname',
          'primaryParticipants.given_name',
          'primaryParticipants.middle_name',
          'secondaryParticipants.surname',
          'secondaryParticipants.given_name',
          'secondaryParticipants.middle_name',
          'tertiaryParticipants.surname',
          'tertiaryParticipants.given_name',
          'tertiaryParticipants.middle_name',
          'act_type',
          'settlement',
          'primaryParticipants.note',
          'secondaryParticipants.note',
          'tertiaryParticipants.note',
        ].join(','),
        facet_by: Object.keys(facets).join(','),
        filter_by: filter_by,
      }),
    client
      .collections('unstructured_uk')
      .documents()
      .search({
        q: query,
        query_by: [
          'surname',
          'given_name',
          'middle_name',
          'act_type',
          'note',
        ].join(','),
        facet_by: Object.keys(facets).join(','),
        filter_by: filter_by,
      }),
  ]);

  return {
    acts_ru: {
      hits: actsSchema.parse(
        (searchResultsActs.hits || []).map((hit) => hit.document),
      ),
      number: searchResultsActs.found,
    },
    unstructured_uk: {
      hits: unstructuredsSchema.parse(
        (searchResultsUnstructured.hits || []).map((hit) => hit.document),
      ),
      number: searchResultsUnstructured.found,
    },
  };
}
