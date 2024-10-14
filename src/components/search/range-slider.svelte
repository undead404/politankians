<script lang="ts">
  import noUiSlider, { type Options, PipsMode } from 'nouislider';
  import 'nouislider/dist/nouislider.css';
  import { createEventDispatcher, onMount } from 'svelte';

  export let attribute: string = '';
  export let min: number = 0;
  export let max: number = 100;
  export let pips: boolean = true;
  export let title: string = attribute;
  export let tooltips: boolean = true;

  let slider: HTMLDivElement;
  const dispatch = createEventDispatcher<{
    rangeChange: { attribute: string; values: number[] };
  }>();

  onMount(() => {
    const sliderOptions: Options = {
      start: [min, max],
      connect: true,
      range: {
        min: min,
        max: max,
      },
      tooltips: tooltips,
      pips: pips
        ? {
            mode: PipsMode.Positions,
            values: [0, 25, 50, 75, 100],
            density: 4,
          }
        : undefined,
    };

    const sliderInstance = noUiSlider.create(slider, sliderOptions);

    sliderInstance.on('change', (values) => {
      dispatch('rangeChange', {
        attribute,
        values: values.map((value) => Number.parseInt(`${value}`)),
      });
    });
  });
</script>

<div class="range-slider">
  <h3>{title}</h3>
  <div bind:this={slider} aria-label={title}></div>
</div>

<style>
  :root {
    --slider-margin-bottom: 3rem;
    --slider-title-margin-bottom: 1rem;
  }

  .range-slider {
    margin-bottom: var(--slider-margin-bottom);
  }

  .range-slider h3 {
    margin-bottom: var(--slider-title-margin-bottom);
  }

  :global(.noUi-handle .noUi-tooltip) {
    display: none;
  }

  :global(.noUi-handle.noUi-active .noUi-tooltip) {
    display: block;
  }
</style>
