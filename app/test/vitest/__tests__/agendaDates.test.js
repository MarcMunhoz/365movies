import { describe, expect, it } from 'vitest';
import { formatChallengeDate } from '../../../src/utils/agendaDates';

describe('agendaDates', () => {
  it('formats agenda watch dates for the challenge grid', () => {
    expect(formatChallengeDate('2026-03-09')).toBe('09-03-2026');
    expect(formatChallengeDate('2026/12/31')).toBe('31-12-2026');
  });

  it('returns an empty value for invalid challenge dates', () => {
    expect(formatChallengeDate('2026-02-30')).toBe('');
    expect(formatChallengeDate('not-a-date')).toBe('');
    expect(formatChallengeDate(null)).toBe('');
  });
});
