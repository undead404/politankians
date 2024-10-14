<script lang="ts">
  import { transliterateUaToLatin } from 'ua2latin';
  import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';

  import type { UnstructuredRecord } from '../../schemas/unstructured-record.ts';
  import showSettlementName from '../../services/settlement-name.ts';
  import formatDate from '../../utils/format-date.js';

  import ACT_TYPE_CLASSES from './act-type-classes.ts';
  import ResultHighlights from './result-highlights.svelte';

  export let result: SearchResponseHit<UnstructuredRecord>;
  const highlights = result.highlights || [];
  function hasHighlights(result: SearchResponseHit<UnstructuredRecord>) {
    return (
      result.highlights?.length || Object.values(result.highlight).length > 0
    );
  }
</script>

<li class="result-item">
  <a
    class={ACT_TYPE_CLASSES[result.document.act_type]}
    href={`/archive-item/${[result.document.archive, result.document.fonds, result.document.series, result.document.item].map(transliterateUaToLatin).join('-')}#row-${result.document.number}`}
  >
    <div class="result-header">
      <h2>
        {result.document.surname}
        {result.document.given_name}
        {result.document.middle_name}
      </h2>
      <span class="badge">{result.document.act_type}</span>
    </div>
    <p><strong>Дата події:</strong> {formatDate(result.document.date)}</p>
    <p>
      <strong>Поселення храму:</strong>
      {showSettlementName(result.document.settlement)}
    </p>
    {#if result.document.note}
      <p><strong>Примітка:</strong> {result.document.note}</p>
    {/if}
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

  a {
    text-decoration: none;
  }

  .result-item {
    margin-bottom: var(--result-item-margin-bottom);
    padding: var(--result-item-padding);
    border-radius: var(--result-item-border-radius);
    box-shadow: 0 2px 4px var(--result-item-box-shadow);
    transition:
      background-color 0.3s,
      box-shadow 0.3s;
  }

  .result-item:hover {
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
</style>
