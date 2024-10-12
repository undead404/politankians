import { describe, expect, it } from 'vitest';

import getRowArchiveItemId, {
  type ArchiveTableRow,
} from './get-row-archive-item-id.js';

describe('getRowArchiveItemId', () => {
  it('should return the correct ID for a complete row', () => {
    const row: ArchiveTableRow = {
      archive: 'Archive1',
      fonds: 'Fonds1',
      series: 'Series1',
      item: 'Item1',
    };
    expect(getRowArchiveItemId(row)).toBe('Archive1-Fonds1-Series1-Item1');
  });

  it('should throw an error if archive is missing', () => {
    const row: ArchiveTableRow = {
      archive: '',
      fonds: 'Fonds1',
      series: 'Series1',
      item: 'Item1',
    };
    expect(() => getRowArchiveItemId(row)).toThrow('Missing archive item info');
  });

  it('should throw an error if fonds is missing', () => {
    const row: ArchiveTableRow = {
      archive: 'Archive1',
      fonds: '',
      series: 'Series1',
      item: 'Item1',
    };
    expect(() => getRowArchiveItemId(row)).toThrow('Missing archive item info');
  });

  it('should throw an error if series is missing', () => {
    const row: ArchiveTableRow = {
      archive: 'Archive1',
      fonds: 'Fonds1',
      series: '',
      item: 'Item1',
    };
    expect(() => getRowArchiveItemId(row)).toThrow('Missing archive item info');
  });

  it('should throw an error if item is missing', () => {
    const row: ArchiveTableRow = {
      archive: 'Archive1',
      fonds: 'Fonds1',
      series: 'Series1',
      item: '',
    };
    expect(() => getRowArchiveItemId(row)).toThrow('Missing archive item info');
  });

  it('should throw an error if all fields are missing', () => {
    const row: ArchiveTableRow = {
      archive: '',
      fonds: '',
      series: '',
      item: '',
    };
    expect(() => getRowArchiveItemId(row)).toThrow('Missing archive item info');
  });
});
