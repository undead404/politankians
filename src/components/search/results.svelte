<script lang="ts">
  import type { SearchResult } from '../../services/search.ts';

  import ResultAct from './result-act.svelte';
  import ResultUnstructured from './result-unstructured.svelte';
  import Stats from './stats.svelte';

  export let loading: boolean = false;
  export let results: SearchResult[] = [];
  export let resultsNumber = 0;

  function getResultId(result: SearchResult) {
    return `${result.document.settlement}-${result.document.page}-${result.document.act_type}-${result.document.number}`;
  }
</script>

<div class="results-container">
  {#if loading}
    <p class="loading-indicator" aria-live="assertive">Завантаження...</p>
  {/if}
  <div class="results-column">
    <h2>Акти</h2>
    <Stats nbHits={resultsNumber} />
    <ul class="results" aria-live="polite">
      {#each results as result (getResultId(result))}
        {#if result.kind === 'act'}
          <ResultAct {result}></ResultAct>
        {/if}
        {#if result.kind === 'unstructured'}
          <ResultUnstructured {result}></ResultUnstructured>
        {/if}
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
</style>
