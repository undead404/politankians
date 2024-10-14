import settlementsRegistry from './settlements-registry.js';

export default function showSettlementName(settlementId: string) {
  return settlementsRegistry[settlementId]?.name || settlementId;
}
