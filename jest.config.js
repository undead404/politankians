const ES_MODULES = [
  'astro/zod',
  'data-uri-to-buffer',
  'fetch-blob',
  'formdata-polyfill',
  'node-fetch',
].join('|');

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.m?[tj]s$': [
      'ts-jest',
      { isolatedModules: true, useESM: true, tsconfig: './tsconfig.jest.json' },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!${ES_MODULES})`],
};
