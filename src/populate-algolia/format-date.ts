import { format } from 'date-fns';

export default function formatDate(date: Date) {
  return format(date, 'dd.MM.yyyy');
}
