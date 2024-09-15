import cleanSurname from './clean-surname.js';

describe('cleanSurname', () => {
  test('removes suffix "евна"', () => {
    expect(cleanSurname('Фуркалевна')).toBe('Фуркал');
  });

  test('removes suffix "иха"', () => {
    expect(cleanSurname('Чубчиха')).toBe('Чубч');
  });

  test('removes suffix "ыха"', () => {
    expect(cleanSurname('Иваныха')).toBe('Иван');
  });

  test('returns surname unchanged if no suffix matches', () => {
    expect(cleanSurname('Гуменюк')).toBe('Гуменюк');
  });

  test('returns surname unchanged if suffix is in the middle', () => {
    expect(cleanSurname('Михаилихаченко')).toBe('Михаилихаченко');
  });
});
