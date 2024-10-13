<script lang="ts">
  import { z } from 'astro/zod';
  import _ from 'lodash';
  import { onMount } from 'svelte';
  import { transliterateUaToLatin } from 'ua2latin';

  import environment from '../../environment.js';
  import { actSchema, type Act } from '../../schemas/act.js';
  import { nonEmptyString } from '../../schemas/non-empty-string.ts';
  import {
    unstructuredRecordSchema,
    type UnstructuredRecord,
  } from '../../schemas/unstructured-record.ts';
  import settlementsRegistry from '../../services/settlements-registry.js';
  import getTypesenseClient from '../../services/typesense.js';
  import formatDate from '../../utils/format-date.js';
  import getHitPath from '../../utils/get-hit-path.js';

  import RangeSlider from './range-slider.svelte';
  import RefinementList from './refinement-list.svelte';
  import Stats from './stats.svelte';

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
  let apiKey = environment.TYPESENSE_SEARCH_KEY;
  let host = environment.TYPESENSE_HOST;
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
            // 'misc',
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

  function handleFacetChange(event: CustomEvent<unknown>) {
    const detail = facetEventDetailSchema.parse(event.detail);
    facets[detail.attribute] = detail.values;
    search();
  }

  function handleRangeChange(event: CustomEvent<unknown>) {
    const detail = rangeEventDetailSchema.parse(event.detail);
    ranges[detail.attribute] = detail.values;
    search();
  }

  onMount(() => {
    search();
  });

  const ACT_TYPE_CLASSES: Record<string, null | string> = {
    відспівування: 'memorial-service',
    долучення: 'conversion',
    миропомазання: 'confirmation',
    народження: 'birth',
    ревізія: null,
    смерть: 'death',
    сповідь: null,
    хрещення: 'baptism',
    шлюб: 'marriage',
  };
  const transformSettlementRefinementItems = (
    items: {
      count: number;
      highlighted: string;
      value: string;
    }[],
  ) =>
    items.map((item) => ({
      ...item,
      highlighted: settlementsRegistry[item.value]?.name || item.highlighted,
    }));
  function toggleRefinementsExpanded() {
    areRefinementsExpanded = !areRefinementsExpanded;
  }
</script>

<div class="control-block">
  <input
    type="text"
    bind:value={query}
    on:input={search}
    placeholder="Пошук..."
    aria-label="Поле пошуку"
  />
  <button on:click={toggleRefinementsExpanded}
    >{#if areRefinementsExpanded}
      Згорнути фільтри
    {:else}
      Розгорнути фільтри
    {/if}</button
  >
  <div class="refinements-container" class:expanded={areRefinementsExpanded}>
    <RefinementList
      attribute="act_type"
      {client}
      collections={['acts_ru', 'unstructured_uk']}
      title="Тип події"
      on:facetChange={handleFacetChange}
    />
    <RangeSlider
      attribute="year"
      min={1795}
      max={1919}
      pips={true}
      title="Рік"
      tooltips={true}
      on:rangeChange={handleRangeChange}
    />
    <RefinementList
      attribute="settlement"
      {client}
      collections={['acts_ru', 'unstructured_uk']}
      title="Поселення"
      transformItems={transformSettlementRefinementItems}
      on:facetChange={handleFacetChange}
    />
  </div>
</div>

<div class="results-container">
  {#if loading}
    <p class="loading-indicator">Завантаження...</p>
  {/if}
  <div class="results-column">
    <h2>Акти</h2>
    <Stats nbHits={nbHitsActs} />
    <ul class="results" aria-live="polite">
      {#each resultsActs as result}
        <li>
          <a
            class={ACT_TYPE_CLASSES[result.act_type]}
            href={getHitPath(result)}
            aria-label={result.title}
          >
            <h2>{result.title}</h2>
            <p>{result.description}</p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="results-column">
    <h2>Неструктуровані записи</h2>
    <Stats nbHits={nbHitsUnstructured} />
    <ul class="results" aria-live="polite">
      {#each resultsUnstructured as result}
        <li>
          <a
            class={ACT_TYPE_CLASSES[result.act_type]}
            href={`/archive-item/${[result.archive, result.fonds, result.series, result.item].map(transliterateUaToLatin).join('-')}`}
          >
            <h2>
              {result.surname}
              {result.given_name}
              {result.middle_name}
            </h2>
            <p><strong>Тип акту:</strong> {result.act_type}</p>
            <p><strong>Дата події:</strong> {formatDate(result.date)}</p>
            <p>
              <strong>Поселення храму:</strong>
              {settlementsRegistry[result.settlement]?.name ||
                result.settlement}
            </p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  input {
    width: 100%;
    max-width: 600px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
  }

  input:focus {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25);
    outline: none;
  }

  .control-block {
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .refinements-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-in-out;
  }
  .refinements-container.expanded {
    max-height: 100vh;
  }

  .results-container {
    position: relative;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: #007bff;
  }

  .results {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .results li {
    margin-bottom: 1rem;
  }

  .results li a {
    display: block;
    padding: 1rem;
    border-radius: 4px;
    color: inherit;
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition:
      background-color 0.3s,
      box-shadow 0.3s;
  }

  .results li a:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    filter: brightness(1.1);
  }

  .results li a h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: #343a40;
  }

  .results li a p {
    margin: 0;
    color: #555;
  }

  .memorial-service {
    background-color: #ffe6e6; /* Light red */
  }

  .confirmation {
    background-color: #cce5ff; /* Light blue */
  }

  .birth {
    background-color: #ccffcc; /* Light green */
  }

  .death {
    background-color: #f2f2f2; /* Light grey */
  }

  .baptism {
    background-color: #fff2cc; /* Light yellow */
  }

  .marriage {
    background-color: #e6ccff; /* Light purple */
  }

  .conversion {
    background-color: #96c6ff; /* Soft blue */
  }
</style>
