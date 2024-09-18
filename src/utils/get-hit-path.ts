import type { Act } from '../schemas/act.ts';

export default function getHitPath(hit: unknown): string {
  const act = hit as Act;
  if (act.act_type === 'сповідь' || act.act_type === 'ревізія') {
    const [archive, fonds, series, item] = act.objectID.split('-');
    return `/archive-item/${archive}-${fonds}-${series}-${item}#act-${act.number}`;
  }
  return `/act/${act.objectID}`;
}
