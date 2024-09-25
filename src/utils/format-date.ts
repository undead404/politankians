const LOOSE_DATE_REGEXP = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;

export default function formatDate(date: string | number) {
  if (typeof date === 'number') {
    const dateObject = new Date(date);
    return `${`${dateObject.getDate()}`.padStart(2, '0')}.${`${dateObject.getMonth() + 1}`.padStart(2, '0')}.${dateObject.getFullYear()}`;
  }
  if (!LOOSE_DATE_REGEXP.test(date)) {
    throw new Error('Not a date: ' + date);
  }
  const [year, month, day] = date.split('-');
  return [day, month, year].filter(Boolean).join('.');
}
