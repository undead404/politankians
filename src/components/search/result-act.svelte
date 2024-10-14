<script lang="ts">
  import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';
  import type { Act } from '../../schemas/act.ts';
  import showSettlementName from '../../services/settlement-name.ts';
  import getHitPath from '../../utils/get-hit-path.js';

  import ACT_TYPE_CLASSES from './act-type-classes.ts';
  import ResultHighlights from './result-highlights.svelte';

  export let result: SearchResponseHit<Act>;
  let highlights = result.highlights || [];

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  function hasHighlights(result: SearchResponseHit<Act>) {
    return (
      result.highlights?.length || Object.values(result.highlight).length > 0
    );
  }
</script>

<li class="result-item">
  <a
    class={ACT_TYPE_CLASSES[result.document.act_type]}
    href={getHitPath(result.document)}
    aria-label={result.document.title}
  >
    <div class="result-header">
      <h2>{result.document.title}</h2>
      <span class="badge">{result.document.act_type}</span>
    </div>
    <p><strong>Дата:</strong> {formatDate(result.document.date)}</p>
    <p>
      <strong>Поселення:</strong>
      {showSettlementName(result.document.settlement)}
    </p>
    {#if hasHighlights(result)}
      <p>
        <ResultHighlights highlight={result.highlight} {highlights} />
      </p>
    {/if}
  </a>
</li>

<style>
  :root {
    --result-item-margin-bottom: 1rem;
    --result-item-padding: 1rem;
    --result-item-border-radius: 4px;
    --result-item-box-shadow: rgba(0, 0, 0, 0.1);
    --result-item-hover-box-shadow: rgba(0, 0, 0, 0.15);
    --result-item-hover-filter: brightness(1.1);
    --result-item-title-color: #343a40;
    --result-item-text-color: #555;
    --badge-background-color: #007bff;
    --badge-text-color: #fff;
  }

  .result-item {
    margin-bottom: var(--result-item-margin-bottom);
  }

  a {
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

  a:hover {
    box-shadow: 0 4px 8px var(--result-item-hover-box-shadow);
    filter: var(--result-item-hover-filter);
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    color: var(--result-item-title-color);
  }

  p {
    margin: 0.5rem 0;
    color: var(--result-item-text-color);
  }

  .badge {
    background-color: var(--badge-background-color);
    color: var(--badge-text-color);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
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
