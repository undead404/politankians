import type { Act } from '../schemas/act.ts';
import type { Participant } from '../schemas/participant.ts';

export type IMPORTANCE = 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

export default function getParticipantImportance(
  participant: Participant,
  actType: Act['act_type'],
): IMPORTANCE {
  switch (participant.role) {
    case 'дитина':
    case 'миропомазаний':
    case 'миропомазана':
    case 'наречений':
    case 'наречена':
    case 'померла особа':
      return 'PRIMARY';
    case 'батько':
    case 'мати':
      return actType === 'смерть' ? 'TERTIARY' : 'SECONDARY';
    case 'батько нареченого':
    case 'мати нареченого':
    case 'батько нареченої':
    case 'мати нареченої':
      return 'SECONDARY';
    default:
      return 'TERTIARY';
  }
}
