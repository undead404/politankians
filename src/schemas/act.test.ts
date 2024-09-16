import { actSchema } from './act.js';

describe('actSchema', () => {
  it('should validate a correct act', () => {
    const validAct = {
      act_type: 'народження',
      date: '2023-09-14',
      description: 'Опис події',
      number: 1,
      objectID: '12345',
      page: '10',
      primaryParticipants: [
        {
          role: 'дитина',
          given_name: 'Іван',
          middle_name: '',
          surname: 'Іванишин',
        },
      ],
      secondaryParticipants: [],
      settlement: 'Київ',
      tertiaryParticipants: [],
      title: 'Народження Івана',
      year: 2023,
    };

    expect(() => actSchema.parse(validAct)).not.toThrow();
  });

  it('should invalidate an act with incorrect act_type', () => {
    const invalidAct = {
      act_type: 'похорон',
      date: '2023-09-14',
      description: 'Опис події',
      number: 1,
      objectID: '12345',
      page: '10',
      primaryParticipants: [
        {
          role: 'дитина',
          given_name: 'Іван',
          middle_name: '',
          surname: 'Іванишин',
        },
      ],
      settlement: 'Київ',
      title: 'Народження Івана',
      year: 2023,
    };

    expect(() => actSchema.parse(invalidAct)).toThrow();
  });

  it('should invalidate an act with no participants', () => {
    const invalidAct = {
      act_type: 'народження',
      date: '2023-09-14',
      description: 'Опис події',
      number: 1,
      objectID: '12345',
      page: '10',
      primaryParticipants: [],
      settlement: 'Київ',
      title: 'Народження Івана',
      year: 2023,
    };

    expect(() => actSchema.parse(invalidAct)).toThrow();
  });

  it('should invalidate an act with conflicting participants', () => {
    const invalidAct = {
      act_type: 'народження',
      date: '2023-09-14',
      description: 'Опис події',
      number: 1,
      objectID: '12345',
      page: '10',
      primaryParticipants: [
        {
          role: 'дитина',
          given_name: 'Іван',
          middle_name: '',
          surname: 'Іванишин',
        },
        {
          role: 'наречений',
          given_name: 'Петро',
          middle_name: '',
          surname: 'Коваль',
        },
      ],
      settlement: 'Київ',
      title: 'Народження Івана',
      year: 2023,
    };

    expect(() => actSchema.parse(invalidAct)).toThrow();
  });
});
