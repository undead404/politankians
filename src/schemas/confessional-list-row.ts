import { z } from 'astro/zod';

import { nonEmptyString } from './non-empty-string.js';
import { numericString } from './numeric-string.js';

const LOOSE_DATE_REGEXP = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;
export const confessionalListRowSchema = z
  .object({
    Акт: numericString,
    Аркуш: nonEmptyString,
    Архів: nonEmptyString,
    Вік: z.optional(z.string()),
    'Дата події': nonEmptyString.regex(LOOSE_DATE_REGEXP),
    "Ім'я": z.string(),
    Опис: nonEmptyString,
    'По-батькові': z.string(),
    'Пошт. Індекс': nonEmptyString,
    'Поселення храму': nonEmptyString,
    Примітка: z.string(),
    Прізвище: z.string(),
    Справа: nonEmptyString,
    Фонд: nonEmptyString,
  })
  .transform((input) => ({
    act: input['Акт'],
    age: input['Вік'] || undefined,
    archive: input['Архів'],
    date: input['Дата події'],
    fonds: input['Фонд'],
    given_name: input["Ім'я"],
    item: input['Справа'],
    middle_name: input['По-батькові'],
    note: input['Примітка'],
    page: input['Аркуш'],
    postal_code: input['Пошт. Індекс'],
    series: input['Опис'],
    settlement: input['Поселення храму'],
    surname: input['Прізвище'],
  }));

export type ConfessionalListRow = z.infer<typeof confessionalListRowSchema>;
