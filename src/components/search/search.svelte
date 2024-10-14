<script lang="ts">
  import { z } from 'astro/zod';
  import _ from 'lodash';
  import { onMount } from 'svelte';

  import environment from '../../environment.js';
  import { actSchema, type Act } from '../../schemas/act.js';
  import {
    unstructuredRecordSchema,
    type UnstructuredRecord,
  } from '../../schemas/unstructured-record.ts';
  import { nonEmptyString } from '../../schemas/non-empty-string.ts';
  import getTypesenseClient from '../../services/typesense.js';

  import Controls from './controls.svelte';
  import Results from './results.svelte';

  const actsSchema = z.array(actSchema);
  const unstructuredsSchema = z.array(unstructuredRecordSchema);
  const facetEventDetailSchema = z.object({
    attribute: nonEmptyString,
    values: z.array(nonEmptyString),
  });
  const rangeEventDetailSchema = z.object({
    attribute: nonEmptyString,
    values: z.tuple([z.number(), z.number()]),
  });

  const { debounce } = _;

  let query = '';
  let resultsActs: Act[] = [];
  let resultsUnstructured: UnstructuredRecord[] = [];
  let nbHitsActs = 0;
  let nbHitsUnstructured = 0;
  let loading = false;
  const apiKey = environment.TYPESENSE_SEARCH_KEY;
  const host = environment.TYPESENSE_HOST;
  let facets: Record<string, string[]> = {};
  let ranges: Record<string, [number, number]> = {};
  let areRefinementsExpanded = false;

  const client = getTypesenseClient(apiKey, host);

  const search = debounce(async () => {
    loading = true;
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

    resultsActs = actsSchema.parse(
      (searchResultsActs.hits || []).map((hit) => hit.document),
    );
    nbHitsActs = searchResultsActs.found;

    resultsUnstructured = unstructuredsSchema.parse(
      (searchResultsUnstructured.hits || []).map((hit) => hit.document),
    );
    nbHitsUnstructured = searchResultsUnstructured.found;

    loading = false;
  }, 300);

  function handleFacetChange(event: CustomEvent) {
    const detail = facetEventDetailSchema.parse(event.detail);
    facets[detail.attribute] = detail.values;
    search();
  }

  function handleRangeChange(event: CustomEvent) {
    const detail = rangeEventDetailSchema.parse(event.detail);
    ranges[detail.attribute] = detail.values;
    search();
  }

  function toggleRefinementsExpanded() {
    areRefinementsExpanded = !areRefinementsExpanded;
  }

  function handleInput(value: string) {
    query = value;
    search();
  }

  onMount(() => {
    search();
  });
</script>

<Controls
  {query}
  {areRefinementsExpanded}
  {client}
  on:facetChange={handleFacetChange}
  on:rangeChange={handleRangeChange}
  on:toggleRefinementsExpanded={toggleRefinementsExpanded}
  on:input={(event) => handleInput(event.detail)}
/>

<Results
  {loading}
  {resultsActs}
  {resultsUnstructured}
  {nbHitsActs}
  {nbHitsUnstructured}
/>

<style>
  /* Add your styles here */
</style>
