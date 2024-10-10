import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTransformMode: {
      web: ['.m?[tj]sx?$'],
    },
    alias: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
      '^(\\.{1,2}/.*)\\.mjs$': '$1',
    },
    exclude: ['node_modules', 'dist'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
