import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import * as tsEslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte: eslintPluginSvelte,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: svelteParser,
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
    rules: {
      // Add your Svelte-specific rules here
    },
  },
  {
    files: ['**/*.{ts}'],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    rules: {
      // Add your JavaScript/TypeScript rules here
    },
  },
  {
    files: ['*.config.mjs', '*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
