import _ from 'lodash';
import type { Client } from 'typesense';
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';

import { type Act, actSchema } from '../schemas/act.ts';
import {
  type UnstructuredRecord,
  unstructuredRecordSchema,
} from '../schemas/unstructured-record.ts';

export interface SearchParameters {
  client: Client;
  facets: Record<string, string[]>;
  query: string;
  ranges: Record<string, [number, number]>;
}

export type SearchResult =
  | (SearchResponseHit<Act> & { kind: 'act' })
  | (SearchResponseHit<UnstructuredRecord> & { kind: 'unstructured' });
export type SearchResults = [SearchResult[], number];

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

  return [
    _.orderBy(
      [
        ...(searchResultsActs.hits || []).map(
          (hit: SearchResponseHit<object>) => ({
            ...hit,
            document: actSchema.parse(hit.document),
            kind: 'act',
          }),
        ),
        ...(searchResultsUnstructured.hits || []).map(
          (hit: SearchResponseHit<object>) => ({
            ...hit,
            document: unstructuredRecordSchema.parse(hit.document),
            kind: 'unstructured',
          }),
        ),
      ],
      ['text_match_info.best_field_score'],
      ['desc'],
    ),
    searchResultsActs.found + searchResultsUnstructured.found,
  ] as SearchResults;
}
