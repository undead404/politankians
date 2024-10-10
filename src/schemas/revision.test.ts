import { describe, expect, it } from 'vitest';

import { revisionSchema } from './revision.js';

describe('revisionSchema', () => {
  it('should validate an array of correct revision rows', () => {
    const validData = [
      {
        Акт: '123',
        Аркуш: '1',
        Архів: 'Central Archive',
        Вік: '30',
        'Дата події': '2023-09-18',
        "Ім'я": 'John',
        Опис: 'Description',
        'По-батькові': 'Ivanovich',
        'Пошт. Індекс': '12345',
        'Поселення храму': 'Church Settlement',
        Роль: 'Role',
        Примітка: 'Note',
        Прізвище: 'Doe',
        Справа: 'Case',
        Фонд: 'Fund',
      },
      {
        Акт: '124',
        Аркуш: '2',
        Архів: 'Central Archive',
        Вік: '25',
        'Дата події': '2023-09-19',
        "Ім'я": 'Jane',
        Опис: 'Description',
        'По-батькові': 'Petrovna',
        'Пошт. Індекс': '54321',
        'Поселення храму': 'Another Church Settlement',
        Роль: 'Another Role',
        Примітка: 'Another Note',
        Прізвище: 'Smith',
        Справа: 'Case',
        Фонд: 'Fund',
      },
    ];

    const result = revisionSchema.safeParse(validData);
    console.log(result.error);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 'Central Archive-Fund-Description-Case',
      rows: [
        {
          act: 123,
          age: '30',
          archive: 'Central Archive',
          date: '2023-09-18',
          fonds: 'Fund',
          given_name: 'John',
          item: 'Case',
          middle_name: 'Ivanovich',
          note: 'Note',
          page: '1',
          postal_code: '12345',
          role: 'Role',
          series: 'Description',
          settlement: '12345-Church Settlement',
          surname: 'Doe',
        },
        {
          act: 124,
          age: '25',
          archive: 'Central Archive',
          date: '2023-09-19',
          fonds: 'Fund',
          given_name: 'Jane',
          item: 'Case',
          middle_name: 'Petrovna',
          note: 'Another Note',
          page: '2',
          postal_code: '54321',
          role: 'Another Role',
          series: 'Description',
          settlement: '54321-Another Church Settlement',
          surname: 'Smith',
        },
      ],
      settlements: '12345-Church Settlement, 54321-Another Church Settlement',
      years: '2023',
    });
  });

  it('should invalidate an array of revision rows with different archive item IDs', () => {
    const invalidData = [
      {
        Акт: '123',
        Аркуш: '1',
        Архів: 'Central Archive',
        Вік: '30',
        'Дата події': '2023-09-18',
        "Ім'я": 'John',
        Опис: 'Description',
        'По-батькові': 'Ivanovich',
        'Пошт. Індекс': '12345',
        'Поселення храму': 'Church Settlement',
        Роль: 'Role',
        Примітка: 'Note',
        Прізвище: 'Doe',
        Справа: 'Case',
        Фонд: 'Fund',
      },
      {
        Акт: '124',
        Аркуш: '2',
        Архів: 'Different Archive',
        Вік: '25',
        'Дата події': '2023-09-19',
        "Ім'я": 'Jane',
        Опис: 'Another Description',
        'По-батькові': 'Petrovna',
        'Пошт. Індекс': '54321',
        'Поселення храму': 'Another Church Settlement',
        Роль: 'Another Role',
        Примітка: 'Another Note',
        Прізвище: 'Smith',
        Справа: 'Another Case',
        Фонд: 'Another Fund',
      },
    ];

    const result = revisionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      'All rows in a revision must belong to the same archive item',
    );
  });

  it('should transform the input correctly', () => {
    const validData = [
      {
        Акт: '123',
        Аркуш: '1',
        Архів: 'Central Archive',
        Вік: '30',
        'Дата події': '2023-09-18',
        "Ім'я": 'John',
        Опис: 'Description',
        'По-батькові': 'Ivanovich',
        'Пошт. Індекс': '12345',
        'Поселення храму': 'Church Settlement',
        Роль: 'Role',
        Примітка: 'Note',
        Прізвище: 'Doe',
        Справа: 'Case',
        Фонд: 'Fund',
      },
    ];

    const result = revisionSchema.parse(validData);
    expect(result).toEqual({
      id: 'Central Archive-Fund-Description-Case',
      rows: [
        {
          act: 123,
          age: '30',
          archive: 'Central Archive',
          date: '2023-09-18',
          fonds: 'Fund',
          given_name: 'John',
          item: 'Case',
          middle_name: 'Ivanovich',
          note: 'Note',
          page: '1',
          postal_code: '12345',
          role: 'Role',
          series: 'Description',
          settlement: '12345-Church Settlement',
          surname: 'Doe',
        },
      ],
      settlements: '12345-Church Settlement',
      years: '2023',
    });
  });
});
