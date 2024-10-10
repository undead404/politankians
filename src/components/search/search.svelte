<script lang="ts">
  import { onMount } from 'svelte';
  import Typesense from 'typesense';
  import _ from 'lodash';

  import environment from '../../environment';
  import settlementsRegistry from '../../services/settlements-registry';
  import getHitPath from '../../utils/get-hit-path';
  import Stats from './stats.svelte';
  import RefinementList from './refinement-list.svelte';
  import RangeSlider from './range-slider.svelte';

  const { debounce } = _;

  let query = '';
  let results = [];
  let nbHits = 0;
  let loading = false;
  let apiKey = environment.TYPESENSE_SEARCH_KEY;
  let host = environment.TYPESENSE_HOST;
  let facets: Record<string, string[]> = {};
  let ranges: Record<string, [number, number]> = {};

  const client = new Typesense.Client({
    nodes: [
      {
        host: new URL(host).hostname,
        port: Number.parseInt(new URL(host).port) || 443,
        protocol: new URL(host).protocol.slice(0, -1),
      },
    ],
    apiKey: apiKey,
    connectionTimeoutSeconds: 2,
  });

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

    const searchResults = await client
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
      });
    results = searchResults.hits.map((hit) => hit.document);
    nbHits = searchResults.found;
    loading = false;
  }, 300);

  function handleFacetChange(
    event: CustomEvent<{ attribute: string; values: string[] }>,
  ) {
    facets[event.detail.attribute] = event.detail.values;
    search();
  }

  function handleRangeChange(
    event: CustomEvent<{ attribute: string; values: [number, number] }>,
  ) {
    ranges[event.detail.attribute] = event.detail.values;
    search();
  }

  onMount(() => {
    search();
  });

  const ACT_TYPE_CLASSES = {
    відспівування: 'memorial-service',
    долучення: 'conversion',
    миропомазання: 'confirmation',
    народження: 'birth',
    смерть: 'death',
    хрещення: 'baptism',
    шлюб: 'marriage',
  };
</script>

<input
  type="text"
  bind:value={query}
  on:input={search}
  placeholder="Пошук..."
  aria-label="Поле пошуку"
/>
<Stats {nbHits} />
<RefinementList
  attribute="act_type"
  {apiKey}
  {host}
  sortBy="name"
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
  {apiKey}
  {host}
  sortBy="name"
  title="Поселення"
  transformItems={(items) =>
    items.map((item) => ({
      ...item,
      highlighted: settlementsRegistry[item.value]?.name,
    }))}
  on:facetChange={handleFacetChange}
/>

<div class="results-container">
  {#if loading}
    <p class="loading-indicator">Loading...</p>
  {/if}
  <ul class="results" aria-live="polite">
    {#each results as result}
      <li>
        <a
          class={ACT_TYPE_CLASSES[result.act_type]}
          href="${getHitPath(result)}"
          aria-label={result.title}
        >
          <h2>{result.title}</h2>
          <p>{result.description}</p>
        </a>
      </li>
    {/each}
  </ul>
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
