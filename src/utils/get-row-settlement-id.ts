import { transliterateUaToLatin } from 'ua2latin';

export default function getRowSettlementId(
  postalCode: string,
  settlementName: string,
) {
  if (!postalCode) {
    throw new Error('Postal code not supplied');
  }
  if (!settlementName) {
    throw new Error('Settlement name not supplied');
  }
  return `${postalCode}-${transliterateUaToLatin(settlementName)}`;
}
