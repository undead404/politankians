import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import * as dotenv from 'dotenv';

import icon from 'astro-icon';

import svelte from '@astrojs/svelte';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), icon(), svelte()],
  site: process.env.SITE,
});
