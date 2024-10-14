<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Client } from 'typesense';

  import RefinementList from './refinement-list.svelte';
  import RangeSlider from './range-slider.svelte';

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
  <button on:click={toggleRefinementsExpanded}>
    {#if areRefinementsExpanded}
      Згорнути фільтри
    {:else}
      Розгорнути фільтри
    {/if}
  </button>
  <div class="refinements-container" class:expanded={areRefinementsExpanded}>
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
    />
  </div>
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

  .control-block {
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .refinements-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-in-out;
  }
  .refinements-container.expanded {
    max-height: 100vh;
  }
</style>
