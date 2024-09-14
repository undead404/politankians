import type { ActType } from '../schemas/act_type.js';

import getActId, { type ArchiveItemRow } from './get-act-id.js';

describe('getActId', () => {
  it('should generate the correct act ID for given row data', () => {
    const row: ArchiveItemRow = {
      act: 123,
      act_type: 'народження' as ActType,
      archive: 'archive1',
      fonds: 'fonds1',
      item: 'item1',
      page: 'page1',
      series: 'series1',
    };
    expect(getActId(row)).toBe('archive1-fonds1-series1-item1-page1-bh-123');
  });

  it('should handle different act types correctly', () => {
    const row: ArchiveItemRow = {
      act: 456,
      act_type: 'смерть' as ActType,
      archive: 'archive2',
      fonds: 'fonds2',
      item: 'item2',
      page: 'page2',
      series: 'series2',
    };
    expect(getActId(row)).toBe('archive2-fonds2-series2-item2-page2-dh-456');
  });
});
