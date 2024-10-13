import { z } from 'astro/zod';

import getRowSettlementId from '../utils/get-row-settlement-id.ts';

import { nonEmptyString } from './non-empty-string.ts';
import transliteratedString from './transliterated-string.ts';
import { dateStringSchema } from './date_string.ts';
import parseDate from '../utils/parse-date.ts';

export const unstructuredRowSchema = z
  .object({
    Аркуш: nonEmptyString,
    Архів: transliteratedString,
    Вік: z.optional(z.string()),
    'Дата події': dateStringSchema,
    "Ім'я": z.string(),
    Опис: nonEmptyString,
    'По-батькові': z.string(),
    'Пошт. Індекс': nonEmptyString,
    'Поселення храму': nonEmptyString,
    Роль: z.string(),
    Примітка: z.string(),
    Прізвище: z.string(),
    Справа: nonEmptyString,
    Подія: nonEmptyString,
    Фонд: nonEmptyString,
  })
  .transform((input) => {
    const {
      Аркуш: page,
      Архів: archive,
      Вік: age,
      'Дата події': date,
      "Ім'я": given_name,
      Опис: series,
      'По-батькові': middle_name,
      Подія: act_type,
      'Поселення храму': settlement,
      'Пошт. Індекс': postal_code,
      Примітка: note,
      Прізвище: surname,
      Роль: role,
      Справа: item,
      Фонд: fonds,
      ...otherFields
    } = input;
    return {
      act_type,
      age,
      archive,
      date: parseDate(date),
      fonds,
      given_name,
      item,
      middle_name,
      misc: otherFields,
      note,
      number: 0,
      page,
      postal_code,
      role,
      series,
      settlement: getRowSettlementId(postal_code, settlement),
      surname: surname,
      year: Number.parseInt(date, 10),
    };
  });

export type UnstructuredRow = z.infer<typeof unstructuredRowSchema>;
