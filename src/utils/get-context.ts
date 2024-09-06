import { parse, type BaseIssue, type BaseSchema } from 'valibot';

const CACHE = new Map();

export default function getContext<
  T1,
  T2,
  T3 extends BaseIssue<unknown>,
  T4 extends BaseSchema<T1, T2, T3>,
>(identity: string, schema: T4) {
  let data = CACHE.get(identity);
  if (!data) {
    const jsonContainer = document.querySelector(`#context-${identity}`);
    data = JSON.parse(jsonContainer!.textContent!);
  }
  return parse(schema, data);
}
