export default function getDateYear(date: string | number) {
  return new Date(date).getFullYear();
}
