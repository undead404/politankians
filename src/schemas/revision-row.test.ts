import { revisionRowSchema } from './revision-row.js';

describe('revisionRowSchema', () => {
  it('should validate a correct revision row', () => {
    const validData = {
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
    };

    const result = revisionRowSchema.safeParse(validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
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
    });
  });

  it('should invalidate an incorrect revision row', () => {
    const invalidData = {
      Акт: '123',
      Аркуш: '',
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
    };

    const result = revisionRowSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should transform the input correctly', () => {
    const validData = {
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
    };

    const result = revisionRowSchema.parse(validData);
    expect(result).toEqual({
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
    });
  });
});
