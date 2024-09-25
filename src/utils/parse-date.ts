export default function parseDate(dateString: string) {
  return new Date(dateString).getTime();
}
