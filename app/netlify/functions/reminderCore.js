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
    ? snapshot.movies.map((movie) => ({
        movieID: String(movie.movieID || '').trim(),
        movieTitle: String(movie.movieTitle || '').trim(),
        movieLink: String(movie.movieLink || '').trim(),
        watchDate: String(movie.watchDate || '').trim(),
        watched: Boolean(movie.watched),
      }))
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

const buildBrevoPayload = ({ snapshot, movie, appUrl, senderEmail, senderName, runDate = new Date() }) => {
  const relativeWatchDate = getRelativeWatchDateLabel({ movie, runDate });

  return {
    sender: {
      email: senderEmail,
      name: senderName,
    },
    to: [{ email: snapshot.email }],
    subject: `365movies reminder: ${movie.movieTitle}`,
    htmlContent: [
      `<p>Your planned watch date for <strong>${movie.movieTitle}</strong> is ${relativeWatchDate}.</p>`,
      movie.movieLink ? `<p><a href="${movie.movieLink}">Open movie details</a></p>` : '',
      appUrl ? `<p><a href="${appUrl}">Open 365movies</a></p>` : '',
    ].join(''),
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
