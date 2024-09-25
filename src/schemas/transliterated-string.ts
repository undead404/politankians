import { transliterateUaToLatin } from 'ua2latin';
import { nonEmptyString } from './non-empty-string.ts';

const transliteratedString = nonEmptyString.transform(transliterateUaToLatin);

export default transliteratedString;
