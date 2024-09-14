// Jest unit tests for confessional-list-row.ts

import { confessionalListRowSchema } from './confessional-list-row.js';

describe('confessionalListRowSchema', () => {
  it('should validate a correct confessional list row', () => {
    const validRow = {
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
    };

    expect(() => confessionalListRowSchema.parse(validRow)).not.toThrow();
  });

  it('should invalidate a row with incorrect date format', () => {
    const invalidRow = {
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
      'Дата події': '20-1820',
      'Пошт. Індекс': '23542',
      'Поселення храму': 'Політанки',
    };

    expect(() => confessionalListRowSchema.parse(invalidRow)).toThrow();
  });

  it('should invalidate a row with missing required fields', () => {
    const invalidRow = {
      Примітка: '',
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
    };

    expect(() => confessionalListRowSchema.parse(invalidRow)).toThrow();
  });

  it('should invalidate a row with non-numeric act', () => {
    const invalidRow = {
      Примітка: '',
      Прізвище: 'Гуцол',
      "Ім'я": 'Григорей',
      'По-батькові': 'Николаев сын',
      Архів: 'ДАХмО',
      Фонд: '315',
      Опис: '1',
      Справа: '7071',
      Аркуш: '974',
      Акт: 'one-two-four',
      Вік: '50',
      'Дата події': '1820',
      'Пошт. Індекс': '23542',
      'Поселення храму': 'Політанки',
    };

    expect(() => confessionalListRowSchema.parse(invalidRow)).toThrow();
  });
});
