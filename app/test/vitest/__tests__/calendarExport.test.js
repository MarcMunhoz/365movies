import { describe, expect, it } from 'vitest';
import { buildAgendaIcs, getFutureUnwatchedAgendaItems } from '../../../src/utils/calendarExport';

const currentDate = new Date(2026, 6, 20);

describe('calendarExport', () => {
  it('exports future unwatched agenda items with two-day alarms', () => {
    const calendar = buildAgendaIcs(
      [
        {
          movieID: '550',
          movieTitle: 'Fight Club',
          movieLink: 'https://example.test/movie/550',
          watchDate: '2026-07-22',
          watched: false,
        },
      ],
      { now: currentDate }
    );

    expect(calendar).toContain('BEGIN:VCALENDAR');
    expect(calendar).toContain('SUMMARY:Watch Fight Club');
    expect(calendar).toContain('DTSTART;VALUE=DATE:20260722');
    expect(calendar).toContain('TRIGGER:-P2D');
  });

  it('excludes watched, past, and invalid agenda items', () => {
    const items = getFutureUnwatchedAgendaItems(
      [
        { movieID: '1', movieTitle: 'Future', watchDate: '2026-07-21', watched: false },
        { movieID: '2', movieTitle: 'Watched', watchDate: '2026-07-21', watched: true },
        { movieID: '3', movieTitle: 'Past', watchDate: '2026-07-19', watched: false },
        { movieID: '4', movieTitle: 'Invalid', watchDate: 'not-a-date', watched: false },
      ],
      currentDate
    );

    expect(items).toHaveLength(1);
    expect(items[0].movie.movieTitle).toBe('Future');
  });
});
