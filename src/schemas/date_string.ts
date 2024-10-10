import { z } from 'zod';

// Helper function to parse and format dates
const parseDate = (dateString: string): string => {
  const isoRegex = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;
  const americanRegex = /^(?:(\d{1,2})(?:\/(\d{1,2}))?\/)(\d{4})$/;
  const ukrainianRegex = /^(?:(?:(\d{1,2})\.)?(\d{1,2})\.)?(\d{4})$/;

  let year: string | undefined,
    month: string | undefined,
    day: string | undefined;
  const isoMatch = dateString.match(isoRegex);
  if (isoMatch) {
    [, year, month, day] = isoMatch;
    return [year, month, day]
      .filter(Boolean)
      .map((input) => input?.padStart(2, '0'))
      .join('-');
  }

  const americanMatch = dateString.match(americanRegex);
  if (americanMatch) {
    const [, m, d, y] = americanMatch;
    return [y, m, d]
      .filter(Boolean)
      .map((input) => input!.padStart(2, '0'))
      .join('-');
  }
  const ukrainianMatch = dateString.match(ukrainianRegex);
  if (ukrainianMatch) {
    const [, d, m, y] = ukrainianMatch;

    return [y, m, d]
      .filter(Boolean)
      .map((input) => input!.padStart(2, '0'))
      .join('-');
  }
  throw new Error('Invalid date format');
};

// Zod schema
export const dateStringSchema = z
  .string()
  .refine(
    (dateString) => {
      try {
        const parsedDate = parseDate(dateString);
        return !!parsedDate;
      } catch {
        return false;
      }
    },
    {
      message: 'Invalid date format',
    },
  )
  .transform((dateString) => parseDate(dateString));
