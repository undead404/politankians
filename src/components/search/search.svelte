<script lang="ts">
  import { z } from 'astro/zod';
  import _ from 'lodash';
  import { onMount } from 'svelte';

  import environment from '../../environment.js';
  import { type Act } from '../../schemas/act.js';
  import { type UnstructuredRecord } from '../../schemas/unstructured-record.ts';
  import { nonEmptyString } from '../../schemas/non-empty-string.ts';
  import getTypesenseClient from '../../services/typesense.js';

  import Controls from './controls.svelte';
  import Results from './results.svelte';
  import search from '../../services/search.ts';

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

  const handleSearch = debounce(async () => {
    loading = true;
    const searchResults = await search({ client, facets, query, ranges });

    resultsActs = searchResults.acts_ru.hits;
    nbHitsActs = searchResults.acts_ru.number;

    resultsUnstructured = searchResults.unstructured_uk.hits;
    nbHitsUnstructured = searchResults.unstructured_uk.number;

    loading = false;
  }, 300);

  function handleFacetChange(event: CustomEvent) {
    const detail = facetEventDetailSchema.parse(event.detail);
    facets[detail.attribute] = detail.values;
    handleSearch();
  }

  function handleRangeChange(event: CustomEvent) {
    const detail = rangeEventDetailSchema.parse(event.detail);
    ranges[detail.attribute] = detail.values;
    handleSearch();
  }

  function toggleRefinementsExpanded() {
    areRefinementsExpanded = !areRefinementsExpanded;
  }

  function handleInput(value: string) {
    query = value;
    handleSearch();
  }

  onMount(() => {
    handleSearch();
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
