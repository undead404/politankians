import { Act } from '../../schemas/act.js';
import getBirthTitle from './birth-title.js';
import getConfessionTitle from './confession-title.js';
import getDeathTitle from './death-title.js';
import getMarriageTitle from './marriage-title.js';

export default function getActTitle(act: Act) {
  switch (act.act_type) {
    case 'хрещення':
    case 'народження':
    case 'миропомазання':
    case 'долучення':
      return getBirthTitle(act);
    case 'шлюб':
      return getMarriageTitle(act);
    case 'відспівування':
    case 'смерть':
      return getDeathTitle(act);
    case 'сповідь':
    case 'ревізія':
      return getConfessionTitle(act);
    default:
      throw new Error(`Unknown act type: ${act.act_type}`);
  }
}
