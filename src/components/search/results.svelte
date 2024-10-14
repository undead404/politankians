<script lang="ts">
  import { transliterateUaToLatin } from 'ua2latin';

  import type { Act } from '../../schemas/act.ts';
  import type { UnstructuredRecord } from '../../schemas/unstructured-record.ts';
  import settlementsRegistry from '../../services/settlements-registry.js';
  import formatDate from '../../utils/format-date.js';
  import getHitPath from '../../utils/get-hit-path.js';

  import Stats from './stats.svelte';

  export let loading: boolean = false;
  export let resultsActs: Act[] = [];
  export let resultsUnstructured: UnstructuredRecord[] = [];
  export let nbHitsActs: number = 0;
  export let nbHitsUnstructured: number = 0;

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
</script>

<div class="results-container">
  {#if loading}
    <p class="loading-indicator" aria-live="assertive">Завантаження...</p>
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
            href={`/archive-item/${[result.archive, result.fonds, result.series, result.item].map(transliterateUaToLatin).join('-')}#row-${result.number}`}
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
  :root {
    --loading-indicator-color: #007bff;
    --result-item-margin-bottom: 1rem;
    --result-item-padding: 1rem;
    --result-item-border-radius: 4px;
    --result-item-box-shadow: rgba(0, 0, 0, 0.1);
    --result-item-hover-box-shadow: rgba(0, 0, 0, 0.15);
    --result-item-hover-filter: brightness(1.1);
    --result-item-title-color: #343a40;
    --result-item-text-color: #555;
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
    color: var(--loading-indicator-color);
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
    margin-bottom: var(--result-item-margin-bottom);
  }

  .results li a {
    display: block;
    padding: var(--result-item-padding);
    border-radius: var(--result-item-border-radius);
    color: inherit;
    text-decoration: none;
    box-shadow: 0 2px 4px var(--result-item-box-shadow);
    transition:
      background-color 0.3s,
      box-shadow 0.3s;
  }

  .results li a:hover {
    box-shadow: 0 4px 8px var(--result-item-hover-box-shadow);
    filter: var(--result-item-hover-filter);
  }

  .results li a h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: var(--result-item-title-color);
  }

  .results li a p {
    margin: 0;
    color: var(--result-item-text-color);
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
