import { describe, expect, it } from 'vitest';

import getHitPath from './get-hit-path.js';

describe('getHitPath', () => {
  it('should return the correct path for act_type "сповідь"', () => {
    const hit = {
      act_type: 'сповідь',
      id: 'archive1-fonds2-series3-item4',
      number: 123,
    };
    const result = getHitPath(hit);
    expect(result).toBe('/archive-item/archive1-fonds2-series3-item4#act-123');
  });

  it('should return the correct path for other act_types', () => {
    const hit = {
      act_type: 'other',
      id: 'archive1-fonds2-series3-item4',
      number: 123,
    };
    const result = getHitPath(hit);
    expect(result).toBe('/act/archive1-fonds2-series3-item4');
  });

  it('should handle unknown hit types gracefully', () => {
    const hit = {
      act_type: 'unknown',
      id: 'archive1-fonds2-series3-item4',
      number: 123,
    };
    const result = getHitPath(hit);
    expect(result).toBe('/act/archive1-fonds2-series3-item4');
  });
});
