import { parishRegisterRowSchema } from './parish-register-row.js';

describe('parishRegisterRowSchema', () => {
  const validRow = {
    Прізвище: 'Гуминюк',
    "Ім'я": 'Михаил',
    'По-батькові': '',
    Архів: 'ДАХмО',
    Фонд: '315',
    Опис: '1',
    Справа: '6773',
    Аркуш: '561',
    Акт: '1',
    'Тип акту': 'відспівування',
    роль: 'померла особа',
    Вік: '89',
    'Дата події': '03.01.1800',
    'Пошт. Індекс': '23542',
    'Поселення храму': 'Політанки',
    Примітка: '',
  };
  it('should validate a correct parish register row', () => {
    const result = parishRegisterRowSchema.safeParse(validRow);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        act: 1,
        act_type: 'відспівування',
        age: '89',
        archive: 'ДАХмО',
        date: '1800-01-03',
        fonds: '315',
        given_name: 'Михаил',
        item: '6773',
        middle_name: '',
        note: undefined,
        page: '561',
        role: 'померла особа',
        series: '1',
        settlement: 'Політанки',
        surname: 'Гуминюк',
      });
    }
  });
  it('should validate a correct parish register row with American date', () => {
    const result = parishRegisterRowSchema.safeParse({
      ...validRow,
      'Дата події': '1/3/1800',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        act: 1,
        act_type: 'відспівування',
        age: '89',
        archive: 'ДАХмО',
        date: '1800-01-03',
        fonds: '315',
        given_name: 'Михаил',
        item: '6773',
        middle_name: '',
        note: undefined,
        page: '561',
        role: 'померла особа',
        series: '1',
        settlement: 'Політанки',
        surname: 'Гуминюк',
      });
    }
  });

  it('should throw an error for an invalid numeric string in "Акт"', () => {
    const invalidRow = {
      ...validRow,
      Акт: 'abc',
    };
    const result = parishRegisterRowSchema.safeParse(invalidRow);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe('Invalid input');
    }
  });

  it('should throw an error for an empty required field', () => {
    const invalidRow = {
      ...validRow,
      Аркуш: '',
    };
    const result = parishRegisterRowSchema.safeParse(invalidRow);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'String must contain at least 1 character(s)',
      );
    }
  });

  it('should validate an optional field correctly', () => {
    const rowWithOptionalField = {
      ...validRow,
      Вік: '',
    };
    const result = parishRegisterRowSchema.safeParse(rowWithOptionalField);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.age).toBeUndefined();
    }
  });
});
