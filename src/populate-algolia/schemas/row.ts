import { parse } from 'date-fns';
import * as v from 'valibot';

import { nonEmptyString } from './non-empty-string.js';
import { actTypeSchema } from './act_type.js';

const refDate = new Date(0);

export const rowSchema = v.pipe(
  v.object({
    Акт: v.pipe(
      nonEmptyString,
      v.transform((input) => Number.parseInt(input)),
    ),
    Аркуш: nonEmptyString,
    Архів: nonEmptyString,
    Вік: v.nullable(v.string()),
    'Дата події': v.pipe(
      nonEmptyString,
      v.transform((input) => parse(input, 'dd.MM.yyyy', refDate)),
    ),
    "Ім'я": v.string(),
    Опис: nonEmptyString,
    'По-батькові': v.string(),
    'Поселення храму': nonEmptyString,
    'Пошт. Індекс': nonEmptyString,
    Прізвище: v.string(),
    Примітка: v.nullable(v.string()),
    роль: nonEmptyString,
    Справа: nonEmptyString,
    'Тип акту': actTypeSchema,
    Фонд: nonEmptyString,
  }),
  v.transform((input) => ({
    act: input['Акт'],
    act_type: input['Тип акту'],
    age: input['Вік'],
    archive: input['Архів'],
    date: input['Дата події'],
    fonds: input['Фонд'],
    given_name: input["Ім'я"],
    item: input['Справа'],
    middle_name: input['По-батькові'],
    note: input['Примітка'],
    page: input['Аркуш'],
    role: input['роль'],
    series: input['Опис'],
    settlement: input['Поселення храму'],
    surname: input['Прізвище'],
  })),
);

export type Row = v.InferOutput<typeof rowSchema>;
