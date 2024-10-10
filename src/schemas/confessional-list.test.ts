import { describe, expect, it } from 'vitest';

import { confessionalListSchema } from './confessional-list.js';

describe('confessionalListSchema', () => {
  const validRows = [
    {
      Примітка: '',
      Прізвище: 'Гуцол',
      "Ім'я": 'Григорей',
      'По-батькові': 'Николаев сын',
      Архів: 'ДАХмО',
      Фонд: '315',
      Опис: '1',
      Справа: '7071',
      Аркуш: '974',
      Акт: '124',
      Вік: '50',
      'Дата події': '1820',
      'Пошт. Індекс': '23542',
      'Поселення храму': 'Політанки',
      Роль: '',
    },
    {
      Примітка: 'у него жена',
      Прізвище: '',
      "Ім'я": 'Мария',
      'По-батькові': 'Василиевна',
      Архів: 'ДАХмО',
      Фонд: '315',
      Опис: '1',
      Справа: '7071',
      Аркуш: '974',
      Акт: '124',
      Вік: '43',
      'Дата події': '1820',
      'Пошт. Індекс': '23542',
      'Поселення храму': 'Політанки',
      Роль: 'жена его',
    },
  ];

  it('should validate a correct confessional list', () => {
    const result = confessionalListSchema.safeParse(validRows);
    expect(result.success).toBe(true);
  });

  it('should throw an error if rows belong to different archive items', () => {
    const invalidRows = [
      ...validRows,
      {
        Примітка: '',
        Прізвище: 'Гуминюков',
        "Ім'я": 'Алексий',
        'По-батькові': 'Лукиянов сын',
        Архів: 'ДАХмО',
        Фонд: '316', // Different archive item
        Опис: '1',
        Справа: '7072',
        Аркуш: '975',
        Акт: '125',
        Вік: '31',
        'Дата події': '1820',
        'Пошт. Індекс': '23542',
        'Поселення храму': 'Політанки',
        Роль: '',
      },
    ];

    const result = confessionalListSchema.safeParse(invalidRows);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'All rows in a confessional list must belong to the same archive item',
      );
    }
  });

  it('should transform rows correctly', () => {
    const result = confessionalListSchema.parse(validRows);
    expect(result).toEqual({
      id: 'DAKhmO-315-1-7071',
      rows: [
        {
          act: 124,
          age: '50',
          archive: 'DAKhmO',
          date: '1820',
          fonds: '315',
          given_name: 'Григорей',
          item: '7071',
          middle_name: 'Николаев сын',
          note: '',
          page: '974',
          postal_code: '23542',
          role: '',
          series: '1',
          settlement: '23542-Politanky',
          surname: 'Гуцол',
        },
        {
          act: 124,
          age: '43',
          archive: 'DAKhmO',
          date: '1820',
          fonds: '315',
          given_name: 'Мария',
          item: '7071',
          middle_name: 'Василиевна',
          note: 'у него жена',
          page: '974',
          postal_code: '23542',
          role: 'жена его',
          series: '1',
          settlement: '23542-Politanky',
          surname: '',
        },
      ],
      settlements: '23542-Politanky',
      years: '1820',
    });
  });

  it('should throw an error if no rows are supplied', () => {
    const result = confessionalListSchema.safeParse([]);
    expect(result.success).toBe(false);
  });
});
