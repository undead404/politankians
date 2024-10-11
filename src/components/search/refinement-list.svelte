<script lang="ts">
  import { z } from 'astro/zod';
  import { onMount, createEventDispatcher } from 'svelte';
  import type { ChangeEventHandler } from 'svelte/elements';
  import Typesense from 'typesense';

  export let attribute = '';
  export let apiKey = '';
  export let collections: string[] = [];
  export let host = '';
  //   export let sortBy = 'name';
  export let title = attribute;
  export let transformItems = (
    items: {
      count: number;
      highlighted: string;
      value: string;
    }[],
  ) => items;

  let items: {
    count: number;
    highlighted: string;
    value: string;
  }[] = [];
  let selectedFacets = new Set<string>();

  const targetElementSchema = z.object({
    checked: z.boolean(),
    id: z.string(),
  });

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
    const searchResults = await Promise.all(
      collections.map((collection) =>
        client.collections(collection).documents().search({
          q: '*',
          query_by: attribute,
          facet_by: attribute,
        }),
      ),
    );
    items = transformItems(
      searchResults
        .flatMap(({ facet_counts }) => facet_counts)
        .flatMap((item) =>
          item ? item.counts : { count: 0, highlighted: '', value: '' },
        )
        .reduce(
          (accumulator, item) => {
            const previousSame = accumulator.find(
              ({ value }) => value === item.value,
            );
            if (previousSame) {
              previousSame.count += item.count;
            } else {
              accumulator.push(item);
            }
            return accumulator;
          },
          [] as {
            count: number;
            highlighted: string;
            value: string;
          }[],
        ),
    );
  }

  const handleFacetChange: ChangeEventHandler<HTMLInputElement> =
    function handleFacetChange(event) {
      const eventTarget = targetElementSchema.parse(event.target);
      const value = eventTarget.id;
      if (eventTarget.checked) {
        selectedFacets.add(value);
      } else {
        selectedFacets.delete(value);
      }
      dispatch('facetChange', {
        attribute,
        values: Array.from(selectedFacets),
      });
    };

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
