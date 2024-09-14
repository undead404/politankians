const LOOSE_DATE_REGEXP = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;

export default function formatDate(date: string) {
  if (!LOOSE_DATE_REGEXP.test(date)) {
    throw new Error('Not a date: ' + date);
  }
  const [year, month, day] = date.split('-');
  return [day, month, year].filter(Boolean).join('.');
}
