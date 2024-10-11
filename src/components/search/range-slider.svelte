<script lang="ts">
  import noUiSlider, { type Options, PipsMode } from 'nouislider';
  import 'nouislider/dist/nouislider.css';
  import { onMount, createEventDispatcher } from 'svelte';

  export let attribute = '';
  export let min = 0;
  export let max = 100;
  export let pips = true;
  export let title = attribute;
  export let tooltips = true;

  let slider: HTMLDivElement;
  const dispatch = createEventDispatcher();

  onMount(() => {
    const sliderOptions: Options = {
      start: [min, max],
      connect: true,
      range: {
        min: min,
        max: max,
      },
      tooltips: tooltips,
    };
    if (pips) {
      sliderOptions.pips = {
        mode: PipsMode.Positions,
        values: [0, 25, 50, 75, 100],
        density: 4,
      };
    }
    const sliderInstance = noUiSlider.create(slider, sliderOptions);

    sliderInstance.on('change', (values) => {
      dispatch('rangeChange', {
        attribute,
        values: values.map((value) => Number.parseInt(`${value}`, 10)),
      });
    });
  });
</script>

<div class="range-slider">
  <h3>{title}</h3>
  <div bind:this={slider}></div>
</div>

<style>
  .range-slider {
    margin-bottom: 3rem;
  }
  .range-slider h3 {
    margin-bottom: 1rem;
  }
  :global(.noUi-handle .noUi-tooltip) {
    display: none;
  }
  :global(.noUi-handle.noUi-active .noUi-tooltip) {
    display: block;
  }
</style>
