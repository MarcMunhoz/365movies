import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  REMINDER_PREFERENCES,
  buildReminderSnapshot,
  getOrCreateInstallationId,
  isEmailReminderPreference,
  isValidEmail,
} from '../../../src/utils/reminderPreferences';

describe('reminderPreferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('validates e-mail reminder preferences and addresses', () => {
    expect(isEmailReminderPreference(REMINDER_PREFERENCES.email)).toBe(true);
    expect(isEmailReminderPreference(REMINDER_PREFERENCES.emailCalendar)).toBe(true);
    expect(isEmailReminderPreference(REMINDER_PREFERENCES.calendar)).toBe(false);
    expect(isValidEmail('viewer@example.test')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('generates and reuses a browser installation identifier', () => {
    const randomUUID = vi.spyOn(crypto, 'randomUUID').mockReturnValue('installation-123');

    expect(getOrCreateInstallationId()).toBe('installation-123');
    expect(getOrCreateInstallationId()).toBe('installation-123');
    expect(randomUUID).toHaveBeenCalledTimes(1);

    randomUUID.mockRestore();
  });

  it('builds a minimal reminder snapshot', () => {
    const snapshot = buildReminderSnapshot({
      installationId: 'installation-123',
      email: ' viewer@example.test ',
      preference: REMINDER_PREFERENCES.email,
      movies: [
        {
          movieID: 550,
          movieTitle: 'Fight Club',
          movieLink: 'https://example.test/movie/550',
          watchDate: '2026-07-22',
          watched: false,
          streamingList: [{ provider_name: 'Ignored' }],
        },
      ],
    });

    expect(snapshot).toMatchObject({
      installationId: 'installation-123',
      email: 'viewer@example.test',
      preference: REMINDER_PREFERENCES.email,
      movies: [
        {
          movieID: '550',
          movieTitle: 'Fight Club',
          movieLink: 'https://example.test/movie/550',
          watchDate: '2026-07-22',
          watched: false,
        },
      ],
    });
  });

  it('builds reminder snapshots with concise rich movie metadata when available', () => {
    const snapshot = buildReminderSnapshot({
      installationId: 'installation-123',
      email: 'viewer@example.test',
      preference: REMINDER_PREFERENCES.email,
      movies: [
        {
          movieID: 550,
          movieTitle: 'Fight Club',
          movieLink: 'https://example.test/movie/550',
          watchDate: '2026-07-22',
          watched: false,
          posterPath: '/poster.jpg',
          posterUrl: 'https://image.tmdb.org/t/p/w300/poster.jpg',
          overview: 'An insomniac office worker looks for a different life.',
          runtime: 139,
          releaseYear: 1999,
          streamingList: [
            {
              provider_id: 8,
              provider_name: 'Example+',
              logo_path: '/example.png',
              display_priority: 2,
              unexpected_nested_payload: { ignored: true },
            },
            { provider_id: 9, provider_name: 'Cinema Now', logo_path: '/cinema.png' },
            { provider_id: 10, logo_path: '/missing-name.png' },
          ],
        },
      ],
    });

    expect(snapshot.movies[0]).toEqual({
      movieID: '550',
      movieTitle: 'Fight Club',
      movieLink: 'https://example.test/movie/550',
      watchDate: '2026-07-22',
      watched: false,
      posterPath: '/poster.jpg',
      posterUrl: 'https://image.tmdb.org/t/p/w300/poster.jpg',
      overview: 'An insomniac office worker looks for a different life.',
      runtime: 139,
      releaseYear: 1999,
      streamingProviders: [
        { providerName: 'Example+', logoPath: '/example.png' },
        { providerName: 'Cinema Now', logoPath: '/cinema.png' },
      ],
    });
  });
});
