import { z } from 'astro/zod';
import _ from 'lodash';

import { nonEmptyString } from './non-empty-string.js';
import { numericString } from './numeric-string.js';

export const revisionRowSchema = z.preprocess(
  (input) => {
    if (!input || typeof input !== 'object') {
      throw new Error('Not an object');
    }
    const inputObject = input as Record<string, unknown>;
    return {
      act: inputObject['Акт'],
      age: inputObject['Вік'] || undefined,
      archive: inputObject['Архів'],
      date: inputObject['Дата події'],
      fonds: inputObject['Фонд'],
      given_name: inputObject["Ім'я"],
      item: inputObject['Справа'],
      middle_name: inputObject['По-батькові'],
      note: inputObject['Примітка'],
      page: inputObject['Аркуш'],
      postal_code: inputObject['Пошт. Індекс'],
      role: inputObject['Роль'],
      series: inputObject['Опис'],
      settlement: inputObject['Поселення храму'],
      surname: inputObject['Прізвище'],
    };
  },
  z.object({
    act: numericString,
    age: z.optional(z.string()),
    archive: nonEmptyString,
    date: nonEmptyString.transform((input) => {
      console.log(input);
      let day: string, month: string, year: string;
      if (input.includes('/')) {
        [month = '', day = '', year = ''] = input.split('/');
      } else {
        [day = '', month = '', year = ''] = input.split('.');
      }
      return [year, month, day]
        .map((part) => _.padStart(part, 2, '0'))
        .join('-');
    }),
    fonds: nonEmptyString,
    given_name: z.string(),
    item: nonEmptyString,
    middle_name: z.string(),
    note: z.string(),
    page: nonEmptyString,
    postal_code: nonEmptyString,
    role: z.string(),
    series: nonEmptyString,
    settlement: nonEmptyString,
    surname: z.string(),
  }),
);
// export const revisionRowSchema = z
// .object({
//     Акт: numericString,
//     Аркуш: nonEmptyString,
//     Архів: nonEmptyString,
//     Вік: z.optional(z.string()),
//     'Дата події': nonEmptyString.regex(LOOSE_DATE_REGEXP),
//     "Ім'я": z.string(),
//     Опис: nonEmptyString,
//     'По-батькові': z.string(),
//     'Пошт. Індекс': nonEmptyString,
//     'Поселення храму': nonEmptyString,
//     Роль: z.string(),
//     Примітка: z.string(),
//     Прізвище: z.string(),
//     Справа: nonEmptyString,
//     Фонд: nonEmptyString,
// })
// .transform((input) => ({
//     act: input['Акт'],
//     age: input['Вік'] || undefined,
//     archive: input['Архів'],
//     date: input['Дата події'],
//     fonds: input['Фонд'],
//     given_name: input["Ім'я"],
//     item: input['Справа'],
//     middle_name: input['По-батькові'],
//     note: input['Примітка'],
//     page: input['Аркуш'],
//     postal_code: input['Пошт. Індекс'],
//     role: input['Роль'],
//     series: input['Опис'],
//     settlement: input['Поселення храму'],
//     surname: input['Прізвище'],
// }));

export type RevisionRow = z.infer<typeof revisionRowSchema>;
