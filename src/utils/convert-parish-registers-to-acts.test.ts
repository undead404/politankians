import { actSchema } from '../schemas/act.js';
import type { Participant } from '../schemas/participant.js';

import convertParishRegistersToActs from './convert-parish-registers-to-acts.js';
import getActTitle from './act-title/index.js';
import getParticipantFullName from './get-participant-full-name.js';
import { ParishRegister } from '../schemas/parish-register.js';

jest.mock('./act-title/index.js');
jest.mock('./get-participant-full-name.js');

describe('convertParishRegistersToActs', () => {
  const mockParishRegisters: ParishRegister[] = [
    {
      id: 'mock-item',
      rows: [
        {
          act: 1,
          date: '1798-01-02',
          page: '285',
          settlement: 'Політанки',
          age: '',
          given_name: 'Петр',
          middle_name: 'Иваннов',
          surname: 'Ткач',
          note: 'первым браком',
          act_type: 'шлюб',
          role: 'наречений',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
        {
          act: 1,
          date: '02.01.1798',
          page: '285',
          settlement: 'Політанки',
          age: '',
          given_name: 'Иванн',
          middle_name: '',
          surname: 'Ткач',
          note: '',
          act_type: 'шлюб',
          role: 'батько нареченого',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
        {
          act: 1,
          date: '1798-01-02',
          page: '285',
          settlement: 'Політанки',
          age: '',
          given_name: 'Агафия',
          middle_name: 'Петрова',
          surname: 'Чернопиская',
          note: 'первым браком',
          act_type: 'шлюб',
          role: 'наречена',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
        {
          act: 1,
          date: '1798-01-02',
          page: '285',
          settlement: 'Політанки',
          age: '',
          given_name: 'Петр',
          middle_name: '',
          surname: 'Чернопиский',
          note: '',
          act_type: 'шлюб',
          role: 'батько нареченої',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
        {
          act: 1,
          date: '1798-01-03',
          page: '286',
          settlement: 'Політанки',
          age: '60',
          given_name: 'Тимофей',
          middle_name: '',
          surname: 'Фурман',
          note: '',
          act_type: 'смерть',
          role: 'померла особа',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
        {
          act: 2,
          date: '1798-01-04',
          page: '286',
          settlement: 'Політанки',
          age: '2',
          given_name: 'Екатерина',
          middle_name: 'Антонова',
          surname: '',
          note: '',
          act_type: 'смерть',
          role: 'померла особа',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
        {
          act: 2,
          date: '1798-01-04',
          page: '286',
          settlement: 'Політанки',
          age: '',
          given_name: 'Антон',
          middle_name: 'Марценов сын',
          surname: '',
          note: '',
          act_type: 'смерть',
          role: 'батько',
          archive: 'ДАХмО',
          fonds: '315',
          series: '1',
          item: '1',
        },
      ],
      settlements: 'Політанки',
      years: '1798',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getActTitle as jest.Mock).mockReturnValue('Act Title');
    (getParticipantFullName as jest.Mock).mockImplementation(
      (participant: Participant) =>
        `${participant.given_name} ${participant.surname}`,
    );
  });

  it('should convert parish registers to acts', () => {
    const result = convertParishRegistersToActs(mockParishRegisters);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      act_type: 'шлюб',
      date: -5427648000000,
      description:
        'наречений: Петр Ткач;\nбатько нареченого: Иванн Ткач;\nнаречена: Агафия Чернопиская;\nбатько нареченої: Петр Чернопиский',
      number: 1,
      id: 'DAKhmO-315-1-1-285-me-1',
      page: '285',
      primaryParticipants: [
        {
          age: '',
          role: 'наречений',
          given_name: 'Петр',
          middle_name: 'Иваннов',
          surname: 'Ткач',
          note: 'первым браком',
        },
        {
          age: '',
          role: 'наречена',
          given_name: 'Агафия',
          middle_name: 'Петрова',
          surname: 'Чернопиская',
          note: 'первым браком',
        },
      ],
      secondaryParticipants: [
        {
          age: '',
          role: 'батько нареченого',
          given_name: 'Иванн',
          middle_name: '',
          surname: 'Ткач',
          note: '',
        },
        {
          age: '',
          role: 'батько нареченої',
          given_name: 'Петр',
          middle_name: '',
          surname: 'Чернопиский',
          note: '',
        },
      ],
      settlement: 'Політанки',
      title: 'Act Title',
      year: 1798,
    });
    expect(result[1]).toMatchObject({
      act_type: 'смерть',
      date: -5427561600000,
      description: 'померла особа: Тимофей Фурман',
      number: 1,
      id: 'DAKhmO-315-1-1-286-dh-1',
      page: '286',
      primaryParticipants: [
        {
          age: '60',
          given_name: 'Тимофей',
          middle_name: '',
          surname: 'Фурман',
          note: '',
        },
      ],
      settlement: 'Політанки',
      title: 'Act Title',
      year: 1798,
    });
  });

  it('should throw an error if no acts are found', () => {
    expect(() => convertParishRegistersToActs([])).toThrow('no acts');
  });

  it('should validate the acts with actSchema', () => {
    const result = convertParishRegistersToActs(mockParishRegisters);
    result.forEach((act) => {
      expect(() => actSchema.parse(act)).not.toThrow();
    });
  });
});
