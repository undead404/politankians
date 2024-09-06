import * as v from 'valibot';

import { nonEmptyString } from './non-empty-string.js';

export const participantSchema = v.pipe(
  v.object({
    age: v.nullable(v.string()),
    given_name: v.string(),
    middle_name: v.string(),
    note: v.nullable(v.string()),
    role: nonEmptyString,
    surname: v.string(),
  }),
  // At least a name or a surname must be present
  v.check((input) => {
    return !!(input.given_name || input.middle_name || input.surname);
  }, 'A participant must have at least either given name or middle name or surname'),
);

export type Participant = v.InferOutput<typeof participantSchema>;
