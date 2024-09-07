import { z } from 'zod';

import { actTypeSchema } from './act_type.js';
import { nonEmptyString } from './non-empty-string.js';
import _ from 'lodash';

export const rowSchema = z
  .object({
    Акт: nonEmptyString.transform((input) => Number.parseInt(input)),

    Аркуш: nonEmptyString,
    Архів: nonEmptyString,
    Вік: z.nullable(z.string()),
    'Дата події': nonEmptyString.transform((input) => {
      const [day, month, year] = input.split('.');
      return [year, month, day]
        .map((part) => _.padStart(part, 2, '0'))
        .join('-');
    }),
    "Ім'я": z.string(),
    Опис: nonEmptyString,
    'По-батькові': z.string(),
    'Поселення храму': nonEmptyString,
    'Пошт. Індекс': nonEmptyString,
    Прізвище: z.string(),
    Примітка: z.nullable(z.string()),
    роль: nonEmptyString,
    Справа: nonEmptyString,
    'Тип акту': actTypeSchema,
    Фонд: nonEmptyString,
  })
  .transform((input) => ({
    act: input['Акт'],
    act_type: input['Тип акту'],
    age: input['Вік'] || null,
    archive: input['Архів'],
    date: input['Дата події'],
    fonds: input['Фонд'],
    given_name: input["Ім'я"],
    item: input['Справа'],
    middle_name: input['По-батькові'],
    note: input['Примітка'] || null,
    page: input['Аркуш'],
    role: input['роль'],
    series: input['Опис'],
    settlement: input['Поселення храму'],
    surname: input['Прізвище'],
  }));

export type Row = z.infer<typeof rowSchema>;
