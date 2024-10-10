import { z } from 'astro/zod';

import getRowSettlementId from '../utils/get-row-settlement-id.ts';

import { actTypeSchema } from './act_type.js';
import { dateStringSchema } from './date_string.ts';
import { nonEmptyString } from './non-empty-string.js';
import { numericString } from './numeric-string.js';
import transliteratedString from './transliterated-string.ts';

export const parishRegisterRowSchema = z
  .object({
    Акт: numericString,
    Аркуш: nonEmptyString,
    Архів: transliteratedString,
    Вік: z.optional(z.string()),
    'Дата події': dateStringSchema,
    "Ім'я": z.string(),
    Опис: nonEmptyString,
    'По-батькові': z.string(),
    'Поселення храму': nonEmptyString,
    'Пошт. Індекс': nonEmptyString,
    Прізвище: z.string(),
    Примітка: z.optional(z.string()),
    роль: nonEmptyString,
    Справа: nonEmptyString,
    'Тип акту': actTypeSchema,
    Фонд: nonEmptyString,
  })
  .transform((input) => ({
    act: input['Акт'],
    act_type: input['Тип акту'],
    age: input['Вік'] || undefined,
    archive: input['Архів'],
    date: input['Дата події'],
    fonds: input['Фонд'],
    given_name: input["Ім'я"],
    item: input['Справа'],
    middle_name: input['По-батькові'],
    note: input['Примітка'] || undefined,
    page: input['Аркуш'],
    role: input['роль'],
    series: input['Опис'],
    settlement: getRowSettlementId(
      input['Пошт. Індекс'],
      input['Поселення храму'],
    ),
    surname: input['Прізвище'],
  }))
  .refine((input) => !!input.act);

export type ParishRegisterRow = z.infer<typeof parishRegisterRowSchema>;
