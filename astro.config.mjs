import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import * as dotenv from 'dotenv';

import icon from 'astro-icon';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), icon()],
  site: process.env.SITE,
});