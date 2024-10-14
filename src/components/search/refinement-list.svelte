<script lang="ts">
  import { z } from 'astro/zod';
  import { onMount, createEventDispatcher } from 'svelte';
  import type { ChangeEventHandler } from 'svelte/elements';
  import type { Client } from 'typesense';

  export let attribute: string = '';
  export let client: Client;
  export let collections: string[] = [];
  export let title: string = attribute;
  export let transformItems: (
    items: { count: number; highlighted: string; value: string }[],
  ) => { count: number; highlighted: string; value: string }[] = (items) =>
    items;

  let items: Array<{ count: number; highlighted: string; value: string }> = [];
  let selectedFacets = new Set<string>();
  let error: string | null = null;

  const targetElementSchema = z.object({
    checked: z.boolean(),
    id: z.string(),
  });

  const dispatch = createEventDispatcher<{
    facetChange: { attribute: string; values: string[] };
  }>();

  async function fetchItems() {
    error = null;
    try {
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
            [] as Array<{ count: number; highlighted: string; value: string }>,
          ),
      );
    } catch (err) {
      error =
        'Під час отримання фільтрів сталася помилка. Будь ласка, спробуйте ще.';
      console.error(err);
    }
  }

  const handleFacetChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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
  {#if error}
    <p class="error-message" aria-live="assertive">{error}</p>
  {/if}
  <ul>
    {#each items as item (item.value)}
      <li>
        <input
          type="checkbox"
          id={item.value}
          on:change={handleFacetChange}
          aria-label={item.value}
        />
        <label for={item.value}
          >{item.highlighted || item.value} ({item.count})</label
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  :root {
    --refinement-list-margin-bottom: 1rem;
    --refinement-list-title-margin-bottom: 0.5rem;
    --refinement-list-item-gap: 0.5rem;
    --error-message-color: red;
  }

  .refinement-list {
    margin-bottom: var(--refinement-list-margin-bottom);
  }

  .refinement-list h3 {
    margin-bottom: var(--refinement-list-title-margin-bottom);
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
    gap: var(--refinement-list-item-gap);
    margin-bottom: var(--refinement-list-item-gap);
  }

  .refinement-list input {
    margin-right: var(--refinement-list-item-gap);
  }

  .error-message {
    color: var(--error-message-color);
    font-weight: bold;
    margin-top: 1rem;
  }
</style>
