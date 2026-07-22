const REMINDER_OFFSET_DAYS = 2;
const REMINDER_WINDOW_START_DAYS = 0;
const REMINDER_WINDOW_END_DAYS = 2;
const REMINDER_MARKER_TYPE = 'catch-up';
const SNAPSHOT_STORE_NAME = 'agenda-reminder-snapshots';
const SENT_MARKER_STORE_NAME = 'agenda-reminder-sent-markers';

const EMAIL_REMINDER_PREFERENCES = new Set(['email', 'email_calendar']);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

const sanitizeKeyPart = (value) =>
  String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const parseAgendaDate = (watchDate) => {
  if (typeof watchDate !== 'string') {
    return null;
  }

  const [year, month, day] = watchDate.split(/[/-]/).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const formatDateKey = (date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;

const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);
  return nextDate;
};

const normalizeRunDate = (runDate = new Date()) =>
  new Date(Date.UTC(runDate.getUTCFullYear(), runDate.getUTCMonth(), runDate.getUTCDate()));

const buildSnapshotKey = (installationId) => `${sanitizeKeyPart(installationId)}.json`;

const normalizeOptionalString = (value) => {
  const normalizedValue = String(value ?? '').trim();
  return normalizedValue || undefined;
};

const normalizeOptionalNumber = (value) => {
  const normalizedValue = Number(value);
  return Number.isFinite(normalizedValue) && normalizedValue > 0 ? normalizedValue : undefined;
};

const normalizeStreamingProviders = (movie) => {
  const providers = Array.isArray(movie.streamingProviders) ? movie.streamingProviders : movie.streamingList;

  if (!Array.isArray(providers)) {
    return undefined;
  }

  const normalizedProviders = providers
    .map((provider) => {
      const providerName = normalizeOptionalString(provider.providerName ?? provider.provider_name);
      const logoPath = normalizeOptionalString(provider.logoPath ?? provider.logo_path);

      return providerName
        ? {
            providerName,
            ...(logoPath ? { logoPath } : {}),
          }
        : null;
    })
    .filter(Boolean);

  return normalizedProviders.length ? normalizedProviders : undefined;
};

const normalizeSnapshotMovie = (movie) => {
  const metadata = {
    posterPath: normalizeOptionalString(movie.posterPath ?? movie.poster_path),
    posterUrl: normalizeOptionalString(movie.posterUrl ?? movie.poster_url),
    overview: normalizeOptionalString(movie.overview),
    runtime: normalizeOptionalNumber(movie.runtime),
    releaseYear: normalizeOptionalNumber(movie.releaseYear ?? movie.release_year),
    streamingProviders: normalizeStreamingProviders(movie),
  };

  return {
    movieID: String(movie.movieID || '').trim(),
    movieTitle: String(movie.movieTitle || '').trim(),
    movieLink: String(movie.movieLink || '').trim(),
    watchDate: String(movie.watchDate || '').trim(),
    watched: Boolean(movie.watched),
    ...Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined)),
  };
};

const buildMarkerKey = ({ installationId, movieID, watchDate, suffix }) =>
  [
    sanitizeKeyPart(installationId),
    sanitizeKeyPart(movieID),
    sanitizeKeyPart(watchDate),
    sanitizeKeyPart(suffix),
  ].join('__');

const buildSentMarkerKey = ({ installationId, movieID, watchDate }) =>
  buildMarkerKey({
    installationId,
    movieID,
    watchDate,
    suffix: REMINDER_MARKER_TYPE,
  });

const buildLegacySentMarkerKey = ({ installationId, movieID, watchDate, offsetDays = REMINDER_OFFSET_DAYS }) =>
  buildMarkerKey({
    installationId,
    movieID,
    watchDate,
    suffix: `${offsetDays}d`,
  });

const buildSentMarkerLookupKeys = ({ installationId, movieID, watchDate }) => [
  buildSentMarkerKey({ installationId, movieID, watchDate }),
  buildLegacySentMarkerKey({ installationId, movieID, watchDate }),
];

const normalizeSnapshot = (snapshot) => ({
  installationId: String(snapshot.installationId || '').trim(),
  email: String(snapshot.email || '').trim(),
  preference: String(snapshot.preference || '').trim(),
  updatedAt: snapshot.updatedAt || new Date().toISOString(),
  movies: Array.isArray(snapshot.movies)
    ? snapshot.movies.map(normalizeSnapshotMovie)
    : [],
});

const validateReminderSnapshot = (snapshot) => {
  const normalizedSnapshot = normalizeSnapshot(snapshot || {});

  if (!normalizedSnapshot.installationId) {
    return { valid: false, error: 'installationId is required.' };
  }

  if (!EMAIL_REMINDER_PREFERENCES.has(normalizedSnapshot.preference)) {
    return { valid: false, error: 'An e-mail reminder preference is required.' };
  }

  if (!isValidEmail(normalizedSnapshot.email)) {
    return { valid: false, error: 'A valid e-mail address is required.' };
  }

  return { valid: true, snapshot: normalizedSnapshot };
};

const getDaysUntilWatchDate = (watchDate, runDate = new Date()) => {
  const parsedWatchDate = parseAgendaDate(watchDate);

  if (!parsedWatchDate) {
    return null;
  }

  const normalizedRunDate = normalizeRunDate(runDate);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parsedWatchDate.getTime() - normalizedRunDate.getTime()) / millisecondsPerDay);
};

const findReminderMatches = (snapshot, runDate = new Date()) => {
  return (snapshot.movies || []).flatMap((movie) => {
    if (movie.watched) {
      return [];
    }

    const daysUntilWatchDate = getDaysUntilWatchDate(movie.watchDate, runDate);

    if (
      daysUntilWatchDate === null ||
      daysUntilWatchDate < REMINDER_WINDOW_START_DAYS ||
      daysUntilWatchDate > REMINDER_WINDOW_END_DAYS
    ) {
      return [];
    }

    return [{ ...movie, reminderDaysUntil: daysUntilWatchDate }];
  });
};

const getRelativeWatchDateLabel = ({ movie, runDate = new Date() }) => {
  const daysUntilWatchDate =
    Number.isInteger(movie.reminderDaysUntil) ? movie.reminderDaysUntil : getDaysUntilWatchDate(movie.watchDate, runDate);

  if (daysUntilWatchDate === 0) {
    return 'today';
  }

  if (daysUntilWatchDate === 1) {
    return 'tomorrow';
  }

  return 'in two days';
};

const sanitizeSubjectText = (value) =>
  String(value || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeAttribute = (value) => escapeHtml(value);

const sanitizeUrl = (value) => {
  const normalizedValue = normalizeOptionalString(value);

  if (!normalizedValue) {
    return '';
  }

  try {
    return new URL(normalizedValue).toString();
  } catch (error) {
    return '';
  }
};

const buildPosterUrl = (movie) => {
  const posterUrl = sanitizeUrl(movie.posterUrl);

  if (posterUrl) {
    return posterUrl;
  }

  const posterPath = normalizeOptionalString(movie.posterPath);

  if (!posterPath || !posterPath.startsWith('/')) {
    return '';
  }

  return `https://image.tmdb.org/t/p/w300${posterPath}`;
};

const formatWatchDate = (watchDate) => {
  const parsedWatchDate = parseAgendaDate(watchDate);

  if (!parsedWatchDate) {
    return String(watchDate || '').trim();
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedWatchDate);
};

const buildBrevoPayload = ({ snapshot, movie, appUrl, senderEmail, senderName, runDate = new Date() }) => {
  const relativeWatchDate = getRelativeWatchDateLabel({ movie, runDate });
  const movieTitle = sanitizeSubjectText(movie.movieTitle) || 'your planned movie';
  const escapedMovieTitle = escapeHtml(movieTitle);
  const formattedWatchDate = formatWatchDate(movie.watchDate);
  const escapedWatchDate = escapeHtml(formattedWatchDate || movie.watchDate);
  const escapedRelativeWatchDate = escapeHtml(relativeWatchDate);
  const posterUrl = buildPosterUrl(movie);
  const movieLink = sanitizeUrl(movie.movieLink);
  const normalizedAppUrl = sanitizeUrl(appUrl);
  const detailParts = [
    movie.releaseYear ? escapeHtml(movie.releaseYear) : '',
    movie.runtime ? `${escapeHtml(movie.runtime)} min` : '',
    escapedWatchDate ? `Planned for ${escapedWatchDate}` : '',
  ].filter(Boolean);
  const providerNames = Array.isArray(movie.streamingProviders)
    ? movie.streamingProviders.map((provider) => normalizeOptionalString(provider.providerName)).filter(Boolean)
    : [];
  const providerMarkup = providerNames.length
    ? `<p style="margin:0;color:#d7e4ef;font-size:14px;line-height:1.5;">Available on ${providerNames.map(escapeHtml).join(', ')}</p>`
    : '<p style="margin:0;color:#9fb3c8;font-size:14px;line-height:1.5;">No streaming provider saved for this reminder.</p>';
  const actionLinks = [
    movieLink
      ? `<a href="${escapeAttribute(movieLink)}" style="display:inline-block;margin:0 8px 10px 0;padding:12px 16px;border-radius:6px;background:#4dc8b0;color:#06131e;font-weight:700;text-decoration:none;">Open movie details</a>`
      : '',
    normalizedAppUrl
      ? `<a href="${escapeAttribute(normalizedAppUrl)}" style="display:inline-block;margin:0 0 10px 0;padding:12px 16px;border-radius:6px;border:1px solid #4dc8b0;color:#dffcf6;font-weight:700;text-decoration:none;">Open 365movies</a>`
      : '',
  ].filter(Boolean).join('');
  const overviewMarkup = movie.overview
    ? `<p style="margin:18px 0 0;color:#d7e4ef;font-size:15px;line-height:1.6;">${escapeHtml(movie.overview)}</p>`
    : '';
  const posterMarkup = posterUrl
    ? `<td style="width:96px;padding:0 18px 0 0;vertical-align:top;"><img src="${escapeAttribute(posterUrl)}" width="96" alt="${escapedMovieTitle} poster" style="display:block;width:96px;max-width:96px;border-radius:6px;border:1px solid #31465a;"></td>`
    : '';

  return {
    sender: {
      email: senderEmail,
      name: senderName,
    },
    to: [{ email: snapshot.email }],
    subject: `${movieTitle} is planned for ${relativeWatchDate} | 365movies`,
    htmlContent: `
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Watch-date reminder for ${escapedMovieTitle} on 365movies.</div>
      <div style="margin:0;padding:0;background:#08131f;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#08131f;">
          <tr>
            <td align="center" style="padding:28px 16px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border-collapse:collapse;background:#0f1d2b;border:1px solid #24384c;border-radius:8px;">
                <tr>
                  <td style="padding:24px 24px 10px;color:#f2f7fb;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 8px;color:#4dc8b0;font-size:13px;font-weight:700;letter-spacing:0;text-transform:uppercase;">365movies</p>
                    <h1 style="margin:0;color:#f2f7fb;font-size:24px;line-height:1.25;font-weight:700;">Watch-date reminder</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 24px 24px;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                      <tr>
                        ${posterMarkup}
                        <td style="vertical-align:top;">
                          <h2 style="margin:0 0 8px;color:#f2f7fb;font-size:22px;line-height:1.3;font-weight:700;">${escapedMovieTitle}</h2>
                          <p style="margin:0 0 12px;color:#b8cada;font-size:15px;line-height:1.5;">Your planned watch date is ${escapedRelativeWatchDate}${escapedWatchDate ? ` (${escapedWatchDate})` : ''}.</p>
                          ${detailParts.length ? `<p style="margin:0 0 12px;color:#d7e4ef;font-size:14px;line-height:1.5;">${detailParts.join(' | ')}</p>` : ''}
                          ${providerMarkup}
                        </td>
                      </tr>
                    </table>
                    ${overviewMarkup}
                    ${actionLinks ? `<div style="margin-top:22px;">${actionLinks}</div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
};

const buildMissingBrevoConfigResponse = (env) => ({
  error: 'Brevo reminder configuration is missing.',
  hasApiKey: Boolean(env.BREVO_API_KEY),
  hasSenderEmail: Boolean(env.BREVO_SENDER_EMAIL),
  hasSenderName: Boolean(env.BREVO_SENDER_NAME),
  hasAppUrl: Boolean(env.BREVO_APP_URL),
});

module.exports = {
  REMINDER_OFFSET_DAYS,
  REMINDER_MARKER_TYPE,
  REMINDER_WINDOW_END_DAYS,
  REMINDER_WINDOW_START_DAYS,
  SENT_MARKER_STORE_NAME,
  SNAPSHOT_STORE_NAME,
  buildLegacySentMarkerKey,
  buildBrevoPayload,
  buildMissingBrevoConfigResponse,
  buildSentMarkerKey,
  buildSentMarkerLookupKeys,
  buildSnapshotKey,
  findReminderMatches,
  getDaysUntilWatchDate,
  isValidEmail,
  validateReminderSnapshot,
};
