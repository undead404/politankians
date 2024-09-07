import type { z } from 'astro/zod';
import type { Schema, ZodTypeDef } from 'astro:schema';

const CACHE = new Map();

export default function getContext<
  T1,
  T2 extends ZodTypeDef,
  T3 extends Schema<T1, T2>,
>(identity: string, schema: T3): z.infer<T3> {
  let data = CACHE.get(identity);
  if (!data) {
    const jsonContainer = document.querySelector(`#context-${identity}`);
    data = JSON.parse(jsonContainer!.textContent!);
  }
  return schema.parse(data);
}
