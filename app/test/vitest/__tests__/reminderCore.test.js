import { describe, expect, it } from 'vitest';
import {
  buildBrevoPayload,
  buildMissingBrevoConfigResponse,
  buildSentMarkerKey,
  findReminderMatches,
  validateReminderSnapshot,
} from '../../../netlify/functions/reminderCore';

const snapshot = {
  installationId: 'install-1',
  email: 'viewer@example.test',
  preference: 'email',
  movies: [
    { movieID: '550', movieTitle: 'Fight Club', movieLink: 'https://example.test/550', watchDate: '2026-07-22', watched: false },
    { movieID: '551', movieTitle: 'Watched', watchDate: '2026-07-22', watched: true },
    { movieID: '552', movieTitle: 'Other Day', watchDate: '2026-07-23', watched: false },
  ],
};

describe('reminderCore', () => {
  it('validates reminder snapshots', () => {
    expect(validateReminderSnapshot(snapshot).valid).toBe(true);
    expect(validateReminderSnapshot({ ...snapshot, email: 'invalid' })).toEqual({
      valid: false,
      error: 'A valid e-mail address is required.',
    });
  });

  it('finds unwatched movies scheduled two days after the run date', () => {
    const matches = findReminderMatches(snapshot, new Date(Date.UTC(2026, 6, 20)));

    expect(matches).toHaveLength(1);
    expect(matches[0].movieID).toBe('550');
  });

  it('builds stable duplicate marker keys', () => {
    expect(
      buildSentMarkerKey({
        installationId: 'install 1',
        movieID: 'movie/550',
        watchDate: '2026-07-22',
        offsetDays: 2,
      })
    ).toBe('install-1__movie-550__2026-07-22__2d');
  });

  it('builds Brevo payloads without exposing secrets in config errors', () => {
    expect(
      buildBrevoPayload({
        snapshot,
        movie: snapshot.movies[0],
        appUrl: 'https://365movies.example.test',
        senderEmail: 'sender@example.test',
        senderName: '365movies',
      })
    ).toMatchObject({
      sender: { email: 'sender@example.test', name: '365movies' },
      to: [{ email: 'viewer@example.test' }],
      subject: '365movies reminder: Fight Club',
    });

    expect(buildMissingBrevoConfigResponse({ BREVO_API_KEY: 'secret' })).toEqual({
      error: 'Brevo reminder configuration is missing.',
      hasApiKey: true,
      hasSenderEmail: false,
      hasSenderName: false,
      hasAppUrl: false,
    });
  });
});
