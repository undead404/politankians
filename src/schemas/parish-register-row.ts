import { z } from 'astro/zod';
import _ from 'lodash';

import { actTypeSchema } from './act_type.js';
import { nonEmptyString } from './non-empty-string.js';
import { numericString } from './numeric-string.js';

export const parishRegisterRowSchema = z
  .object({
    Акт: numericString,
    Аркуш: nonEmptyString,
    Архів: nonEmptyString,
    Вік: z.optional(z.string()),
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
    settlement: input['Поселення храму'],
    surname: input['Прізвище'],
  }));

export type ParishRegisterRow = z.infer<typeof parishRegisterRowSchema>;
