import { describe, expect, it } from 'vitest';

import { actTypeSchema } from './act_type.js';

describe('actTypeSchema', () => {
  it('should validate correct act types', () => {
    const validActTypes = [
      'відспівування',
      'долучення',
      'миропомазання',
      'народження',
      'ревізія',
      'смерть',
      'сповідь',
      'хрещення',
      'шлюб',
    ];

    validActTypes.forEach((actType) => {
      expect(() => actTypeSchema.parse(actType)).not.toThrow();
    });
  });

  it('should invalidate incorrect act types', () => {
    const invalidActTypes = ['похорон', 'конфірмація', 'вінчання', "ім'я"];

    invalidActTypes.forEach((actType) => {
      expect(() => actTypeSchema.parse(actType)).toThrow();
    });
  });
});
