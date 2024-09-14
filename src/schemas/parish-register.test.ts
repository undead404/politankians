import { parishRegisterSchema } from './parish-register.js';

describe('parishRegisterSchema', () => {
  const validRegister = [
    {
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
    },
    {
      Прізвище: 'Бойцун',
      "Ім'я": 'Алексей',
      'По-батькові': 'Михайлов',
      Архів: 'ДАХмО',
      Фонд: '315',
      Опис: '1',
      Справа: '6773',
      Аркуш: '561',
      Акт: '1',
      'Тип акту': 'шлюб',
      роль: 'наречений',
      Вік: '',
      'Дата події': '19.01.1800',
      'Пошт. Індекс': '23542',
      'Поселення храму': 'Політанки',
      Примітка: '',
    },
  ];

  it('should validate a correct parish register', () => {
    const result = parishRegisterSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: 'ДАХмО-315-1-6773',
        rows: [
          {
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
          },
          {
            act: 1,
            act_type: 'шлюб',
            age: undefined,
            archive: 'ДАХмО',
            date: '1800-01-19',
            fonds: '315',
            given_name: 'Алексей',
            item: '6773',
            middle_name: 'Михайлов',
            note: undefined,
            page: '561',
            role: 'наречений',
            series: '1',
            settlement: 'Політанки',
            surname: 'Бойцун',
          },
        ],
        settlements: 'Політанки',
        years: '1800',
      });
    }
  });

  it('should throw an error if rows belong to different archive items', () => {
    const invalidRegister = [
      ...validRegister,
      {
        ...validRegister[0],
        Архів: 'Different Archive',
      },
    ];
    const result = parishRegisterSchema.safeParse(invalidRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'All rows in a parish register must belong to the same archive item',
      );
    }
  });

  it('should throw an error if the array is empty', () => {
    const emptyRegister: unknown[] = [];
    const result = parishRegisterSchema.safeParse(emptyRegister);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0]!.message).toBe(
        'Array must contain at least 1 element(s)',
      );
    }
  });
});
