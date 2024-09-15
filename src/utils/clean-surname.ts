const SUFFIXES = ['евна', 'иха', 'ыха'];

export default function cleanSurname(surname: string): string {
  for (const suffix of SUFFIXES) {
    if (surname.endsWith(suffix)) {
      return surname.slice(0, -suffix.length);
    }
  }
  return surname;
}
