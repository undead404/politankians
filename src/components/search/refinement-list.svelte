<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import Typesense from 'typesense';

  export let attribute = '';
  export let apiKey = '';
  export let host = '';
  export let sortBy = 'name';
  export let title = attribute;
  export let transformItems = (items) => items;

  let items = [];
  let selectedFacets = new Set<string>();

  const dispatch = createEventDispatcher();

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

  async function fetchItems() {
    const searchResults = await client
      .collections('acts_ru')
      .documents()
      .search({
        q: '*',
        query_by: attribute,
        facet_by: attribute,
      });
    items = transformItems(
      searchResults.facet_counts.flatMap(({ counts }) => counts),
    );
  }

  function handleFacetChange(event) {
    const value = event.target.id;
    if (event.target.checked) {
      selectedFacets.add(value);
    } else {
      selectedFacets.delete(value);
    }
    dispatch('facetChange', { attribute, values: Array.from(selectedFacets) });
  }

  onMount(() => {
    fetchItems();
  });
</script>

<div class="refinement-list">
  <h3>{title}</h3>
  <ul>
    {#each items as item}
      <li>
        <input type="checkbox" id={item.value} on:change={handleFacetChange} />
        <label for={item.value}
          >{item.highlighted || item.value} ({item.count})</label
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  .refinement-list {
    margin-bottom: 1rem;
  }
  .refinement-list h3 {
    margin-bottom: 0.5rem;
  }
  .refinement-list ul {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    list-style: none;
    padding: 0;
  }
  .refinement-list li {
    display: flex;
    flex-basis: 0;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .refinement-list input {
    margin-right: 0.5rem;
  }
</style>
