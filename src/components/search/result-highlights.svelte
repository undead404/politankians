<script lang="ts">
  /** eslint-disable svelte/no-at-html-tags */
  import { z } from 'astro/zod';
  import type { SearchResponseHighlight } from 'typesense/lib/Typesense/Documents.js';

  import type { Act } from '../../schemas/act.ts';
  import { nonEmptyString } from '../../schemas/non-empty-string.ts';
  import type { UnstructuredRecord } from '../../schemas/unstructured-record.ts';

  export let highlight: SearchResponseHighlight<Act | UnstructuredRecord>;
  export let highlights: {
    field: keyof Act | keyof UnstructuredRecord;
    matched_tokens: string[][] | string[];
    snippet?: string;
  }[];

  const matchedTokensSchema = z.array(nonEmptyString).min(1);

  const TRANSLATION: Record<string, string> = {
    given_name: "власне ім'я",
    middle_name: 'по батькові',
    note: 'примітка',
    primaryParticipants: 'Головні учасники',
    secondaryParticipants: 'Другорядні учасники',
    surname: 'прізвище',
    tertiaryParticipants: 'Третьорядні учасники',
  };

  function isNumeric(str: string) {
    if (typeof str !== 'string') return false;
    const asInt = Number.parseInt(str);
    return !Number.isNaN(asInt) && `${asInt}` === str;
  }

  function findSnippetsRecursively(
    object: Record<string, unknown>,
    path = '',
  ): [string, string][] {
    const snippets: [string, string][] = [];
    const parseResult = nonEmptyString.safeParse(object.snippet);
    if (parseResult.success) {
      const matchedTokensResult = matchedTokensSchema.safeParse(
        object.matched_tokens,
      );
      if (matchedTokensResult.success) {
        snippets.push([path, parseResult.data]);
      }
    }
    for (const [key, value] of Object.entries(object)) {
      if (value && typeof value === 'object') {
        snippets.push(
          ...findSnippetsRecursively(
            value as Record<string, unknown>,
            [path, key].filter(Boolean).join('.'),
          ),
        );
      }
    }
    return snippets;
  }

  function explainPath(path: string): string {
    return path
      .split('.')
      .filter((part) => !isNumeric(part))
      .map((part) => TRANSLATION[part] || part)
      .join(', ');
  }

  const snippetsToShow: [string, string][] =
    highlights.length > 0
      ? highlights
          .filter(
            (highlight) =>
              highlight.snippet && highlight.matched_tokens.length > 0,
          )
          .map((highlight) => [highlight.field as string, highlight.snippet!])
      : findSnippetsRecursively(highlight);
</script>

<div class="highlights">
  <h3>Знайдене</h3>
  <ul>
    {#each snippetsToShow as [key, snippet]}
      <li><strong>{explainPath(key)}</strong>: {@html snippet}</li>
    {/each}
  </ul>
</div>

<style>
  .highlights {
    background-color: #f8f9fa;
    padding: 0.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  ul {
    list-style-type: none;
    /* padding: 0; */
  }

  li {
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }

  li:not(:last-child) {
    margin-bottom: 0.75rem;
  }
</style>
