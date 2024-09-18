import { z } from 'astro/zod';

export const participantSchema = z.object({
  age: z.optional(z.string()),
  given_name: z.string(),
  middle_name: z.string(),
  note: z.optional(z.string()),
  role: z.string(),
  surname: z.string(),
});
// At least a name or a surname must be present
// .refine(
//   (input) => {
//     return !!(input.given_name || input.middle_name || input.surname);
//   },
//   {
//     message:
//       'A participant must have at least either given name or middle name or surname',
//   },
// );

export type Participant = z.infer<typeof participantSchema>;
