<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Client } from 'typesense';

  import RefinementList from './refinement-list.svelte';
  import RangeSlider from './range-slider.svelte';
  import showSettlementName from '../../services/settlement-name.ts';

  export let query: string = '';
  export let areRefinementsExpanded: boolean = false;
  export let client: Client;

  const dispatch = createEventDispatcher();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    dispatch('input', target.value);
  }

  function toggleRefinementsExpanded() {
    dispatch('toggleRefinementsExpanded');
  }
</script>

<div class="control-block">
  <input
    type="text"
    bind:value={query}
    on:input={handleInput}
    placeholder="Пошук..."
    aria-label="Поле пошуку"
  />
  <button
    on:click={toggleRefinementsExpanded}
    aria-expanded={areRefinementsExpanded}
    aria-controls="refinements-container"
  >
    {#if areRefinementsExpanded}
      Згорнути фільтри
    {:else}
      Розгорнути фільтри
    {/if}
  </button>
  <div
    class="refinements-container"
    id="refinements-container"
    class:expanded={areRefinementsExpanded}
  >
    <RefinementList
      attribute="act_type"
      {client}
      collections={['acts_ru', 'unstructured_uk']}
      on:facetChange
      title="Тип події"
    />
    <RangeSlider
      attribute="year"
      min={1795}
      max={1919}
      on:rangeChange
      pips={true}
      title="Рік"
      tooltips={true}
    />
    <RefinementList
      attribute="settlement"
      {client}
      collections={['acts_ru', 'unstructured_uk']}
      on:facetChange
      title="Поселення"
      transformItems={(items) =>
        items.map((item) => ({
          ...item,
          highlighted: showSettlementName(item.highlighted),
        }))}
    />
  </div>
</div>

<style>
  :root {
    --input-border-color: #ddd;
    --input-focus-border-color: #007bff;
    --input-focus-box-shadow: rgba(0, 123, 255, 0.25);
    --button-background-color: #007bff;
    --button-text-color: #fff;
    --button-hover-background-color: #0056b3;
    --control-block-background: #f8f9fa;
    --control-block-padding: 1rem;
    --control-block-box-shadow: rgba(0, 0, 0, 0.1);
    --refinements-transition: max-height 0.5s ease-in-out;
  }

  .control-block {
    background-color: var(--control-block-background);
    display: flex;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    z-index: 1;
    padding: var(--control-block-padding);
    box-shadow: 0 2px 4px var(--control-block-box-shadow);
  }

  input {
    width: 100%;
    max-width: 550px;
    padding: 0.75rem;
    border: 1px solid var(--input-border-color);
    border-radius: 4px;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
  }

  input:focus {
    border-color: var(--input-focus-border-color);
    box-shadow: 0 2px 8px var(--input-focus-box-shadow);
    outline: none;
  }

  button {
    background-color: var(--button-background-color);
    color: var(--button-text-color);
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: var(--button-hover-background-color);
  }

  .refinements-container {
    max-height: 0;
    overflow: hidden;
    transition: var(--refinements-transition);
  }

  .refinements-container.expanded {
    max-height: 100vh;
  }
</style>
