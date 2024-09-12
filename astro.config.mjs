import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import * as dotenv from 'dotenv';

dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  site: process.env.SITE,
});
