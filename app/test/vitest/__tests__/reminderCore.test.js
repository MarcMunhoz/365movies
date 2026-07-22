import { describe, expect, it } from 'vitest';
import {
  buildBrevoPayload,
  buildLegacySentMarkerKey,
  buildMissingBrevoConfigResponse,
  buildSentMarkerKey,
  buildSentMarkerLookupKeys,
  getDaysUntilWatchDate,
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

  it('normalizes optional rich metadata while preserving legacy snapshot compatibility', () => {
    expect(validateReminderSnapshot({
      installationId: 'install-1',
      email: 'viewer@example.test',
      preference: 'email',
      movies: [
        {
          movieID: 550,
          movieTitle: 'Fight Club',
          watchDate: '2026-07-22',
          watched: false,
        },
      ],
    }).snapshot.movies[0]).toEqual({
      movieID: '550',
      movieTitle: 'Fight Club',
      movieLink: '',
      watchDate: '2026-07-22',
      watched: false,
    });

    expect(validateReminderSnapshot({
      installationId: 'install-1',
      email: 'viewer@example.test',
      preference: 'email',
      movies: [
        {
          movieID: 551,
          movieTitle: 'Arrival',
          movieLink: 'https://example.test/551',
          watchDate: '2026-07-23',
          watched: false,
          posterPath: '/arrival.jpg',
          posterUrl: 'https://image.tmdb.org/t/p/w300/arrival.jpg',
          overview: 'A linguist works with alien visitors.',
          runtime: '116',
          releaseYear: '2016',
          streamingProviders: [
            { providerName: 'Example+', logoPath: '/example.png', ignored: 'value' },
            { providerName: '', logoPath: '/empty.png' },
          ],
        },
      ],
    }).snapshot.movies[0]).toEqual({
      movieID: '551',
      movieTitle: 'Arrival',
      movieLink: 'https://example.test/551',
      watchDate: '2026-07-23',
      watched: false,
      posterPath: '/arrival.jpg',
      posterUrl: 'https://image.tmdb.org/t/p/w300/arrival.jpg',
      overview: 'A linguist works with alien visitors.',
      runtime: 116,
      releaseYear: 2016,
      streamingProviders: [{ providerName: 'Example+', logoPath: '/example.png' }],
    });
  });

  it('finds unwatched movies scheduled from today through two days after the run date', () => {
    const matches = findReminderMatches(
      {
        ...snapshot,
        movies: [
          { movieID: '549', movieTitle: 'Past', watchDate: '2026-07-20', watched: false },
          { movieID: '550', movieTitle: 'Today', watchDate: '2026-07-21', watched: false },
          { movieID: '551', movieTitle: 'Tomorrow', watchDate: '2026-07-22', watched: false },
          { movieID: '552', movieTitle: 'Two Days', watchDate: '2026-07-23', watched: false },
          { movieID: '553', movieTitle: 'Later', watchDate: '2026-07-24', watched: false },
          { movieID: '554', movieTitle: 'Watched', watchDate: '2026-07-22', watched: true },
          { movieID: '555', movieTitle: 'Invalid', watchDate: '2026-02-31', watched: false },
        ],
      },
      new Date(Date.UTC(2026, 6, 21, 18, 30))
    );

    expect(matches.map((movie) => [movie.movieID, movie.reminderDaysUntil])).toEqual([
      ['550', 0],
      ['551', 1],
      ['552', 2],
    ]);
  });

  it('computes days until watch date from UTC calendar days', () => {
    const runDate = new Date(Date.UTC(2026, 6, 21, 23, 45));

    expect(getDaysUntilWatchDate('2026-07-21', runDate)).toBe(0);
    expect(getDaysUntilWatchDate('2026-07-22', runDate)).toBe(1);
    expect(getDaysUntilWatchDate('2026-07-23', runDate)).toBe(2);
    expect(getDaysUntilWatchDate('invalid', runDate)).toBeNull();
  });

  it('builds one catch-up duplicate marker key and exposes legacy lookup keys', () => {
    expect(
      buildSentMarkerKey({
        installationId: 'install 1',
        movieID: 'movie/550',
        watchDate: '2026-07-22',
      })
    ).toBe('install-1__movie-550__2026-07-22__catch-up');

    expect(
      buildLegacySentMarkerKey({
        installationId: 'install 1',
        movieID: 'movie/550',
        watchDate: '2026-07-22',
        offsetDays: 2,
      })
    ).toBe('install-1__movie-550__2026-07-22__2d');

    expect(
      buildSentMarkerLookupKeys({
        installationId: 'install 1',
        movieID: 'movie/550',
        watchDate: '2026-07-22',
      })
    ).toEqual(['install-1__movie-550__2026-07-22__catch-up', 'install-1__movie-550__2026-07-22__2d']);
  });

  it('builds Brevo payloads with relative watch-date copy without exposing secrets in config errors', () => {
    expect(
      buildBrevoPayload({
        snapshot,
        movie: { ...snapshot.movies[0], watchDate: '2026-07-21' },
        appUrl: 'https://365movies.example.test',
        runDate: new Date(Date.UTC(2026, 6, 21)),
        senderEmail: 'sender@example.test',
        senderName: '365movies',
      })
    ).toMatchObject({
      sender: { email: 'sender@example.test', name: '365movies' },
      to: [{ email: 'viewer@example.test' }],
      subject: 'Fight Club is planned for today | 365movies',
    });
    expect(
      buildBrevoPayload({
        snapshot,
        movie: { ...snapshot.movies[0], watchDate: '2026-07-21' },
        appUrl: 'https://365movies.example.test',
        runDate: new Date(Date.UTC(2026, 6, 21)),
        senderEmail: 'sender@example.test',
        senderName: '365movies',
      }).htmlContent
    ).toContain('is today');
    expect(
      buildBrevoPayload({
        snapshot,
        movie: { ...snapshot.movies[0], watchDate: '2026-07-22' },
        appUrl: 'https://365movies.example.test',
        runDate: new Date(Date.UTC(2026, 6, 21)),
        senderEmail: 'sender@example.test',
        senderName: '365movies',
      }).htmlContent
    ).toContain('is tomorrow');
    expect(
      buildBrevoPayload({
        snapshot,
        movie: { ...snapshot.movies[0], watchDate: '2026-07-23' },
        appUrl: 'https://365movies.example.test',
        runDate: new Date(Date.UTC(2026, 6, 21)),
        senderEmail: 'sender@example.test',
        senderName: '365movies',
      }).htmlContent
    ).toContain('is in two days');

    expect(buildMissingBrevoConfigResponse({ BREVO_API_KEY: 'secret' })).toEqual({
      error: 'Brevo reminder configuration is missing.',
      hasApiKey: true,
      hasSenderEmail: false,
      hasSenderName: false,
      hasAppUrl: false,
    });
  });

  it('builds branded escaped Brevo payloads with rich metadata and clear actions', () => {
    const payload = buildBrevoPayload({
      snapshot,
      movie: {
        movieID: '550',
        movieTitle: 'Fight <Club> & Friends',
        movieLink: 'https://example.test/movie?title=<bad>&safe=1',
        watchDate: '2026-07-22',
        watched: false,
        posterUrl: 'https://image.tmdb.org/t/p/w300/poster.jpg?name=<poster>',
        overview: 'A <script>alert("x")</script> office worker & soap maker.',
        runtime: 139,
        releaseYear: 1999,
        streamingProviders: [
          { providerName: 'Example+ <Now>', logoPath: '/example.png' },
          { providerName: 'Cinema & Home' },
        ],
      },
      appUrl: 'https://365movies.example.test/app?next=<agenda>',
      runDate: new Date(Date.UTC(2026, 6, 21)),
      senderEmail: 'sender@example.test',
      senderName: '365movies',
    });

    expect(payload.subject).toBe('Fight <Club> & Friends is planned for tomorrow | 365movies');
    expect(payload.htmlContent).toContain('365movies');
    expect(payload.htmlContent).toContain('Watch-date reminder');
    expect(payload.htmlContent).toContain('Fight &lt;Club&gt; &amp; Friends');
    expect(payload.htmlContent).toContain('July 22, 2026');
    expect(payload.htmlContent).toContain('139 min');
    expect(payload.htmlContent).toContain('1999');
    expect(payload.htmlContent).toContain('A &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; office worker &amp; soap maker.');
    expect(payload.htmlContent).toContain('Example+ &lt;Now&gt;');
    expect(payload.htmlContent).toContain('Cinema &amp; Home');
    expect(payload.htmlContent).toContain('alt="Fight &lt;Club&gt; &amp; Friends poster"');
    expect(payload.htmlContent).toContain('href="https://example.test/movie?title=%3Cbad%3E&amp;safe=1"');
    expect(payload.htmlContent).toContain('href="https://365movies.example.test/app?next=%3Cagenda%3E"');
    expect(payload.htmlContent).not.toContain('<script>');
  });

  it('builds valid fallback Brevo HTML without optional metadata or links', () => {
    const payload = buildBrevoPayload({
      snapshot,
      movie: {
        movieID: '550',
        movieTitle: 'Fallback Movie',
        watchDate: '2026-07-23',
        watched: false,
      },
      appUrl: '',
      runDate: new Date(Date.UTC(2026, 6, 21)),
      senderEmail: 'sender@example.test',
      senderName: '365movies',
    });

    expect(payload.subject).toBe('Fallback Movie is planned for in two days | 365movies');
    expect(payload.htmlContent).toContain('Fallback Movie');
    expect(payload.htmlContent).toContain('No streaming provider saved for this reminder.');
    expect(payload.htmlContent).not.toContain('<img');
    expect(payload.htmlContent).not.toContain('<a href=""');
  });
});
