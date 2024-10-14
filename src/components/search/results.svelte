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
