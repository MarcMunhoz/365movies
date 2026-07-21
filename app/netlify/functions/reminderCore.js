const REMINDER_OFFSET_DAYS = 2;
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

const buildSentMarkerKey = ({ installationId, movieID, watchDate, offsetDays = REMINDER_OFFSET_DAYS }) =>
  [
    sanitizeKeyPart(installationId),
    sanitizeKeyPart(movieID),
    sanitizeKeyPart(watchDate),
    `${offsetDays}d`,
  ].join('__');

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

const findReminderMatches = (snapshot, runDate = new Date()) => {
  const targetDateKey = formatDateKey(addDays(normalizeRunDate(runDate), REMINDER_OFFSET_DAYS));

  return (snapshot.movies || []).filter((movie) => {
    if (movie.watched) {
      return false;
    }

    const watchDate = parseAgendaDate(movie.watchDate);
    return watchDate && formatDateKey(watchDate) === targetDateKey;
  });
};

const buildBrevoPayload = ({ snapshot, movie, appUrl, senderEmail, senderName }) => ({
  sender: {
    email: senderEmail,
    name: senderName,
  },
  to: [{ email: snapshot.email }],
  subject: `365movies reminder: ${movie.movieTitle}`,
  htmlContent: [
    `<p>Your planned watch date for <strong>${movie.movieTitle}</strong> is in two days.</p>`,
    movie.movieLink ? `<p><a href="${movie.movieLink}">Open movie details</a></p>` : '',
    appUrl ? `<p><a href="${appUrl}">Open 365movies</a></p>` : '',
  ].join(''),
});

const buildMissingBrevoConfigResponse = (env) => ({
  error: 'Brevo reminder configuration is missing.',
  hasApiKey: Boolean(env.BREVO_API_KEY),
  hasSenderEmail: Boolean(env.BREVO_SENDER_EMAIL),
  hasSenderName: Boolean(env.BREVO_SENDER_NAME),
  hasAppUrl: Boolean(env.BREVO_APP_URL),
});

module.exports = {
  REMINDER_OFFSET_DAYS,
  SENT_MARKER_STORE_NAME,
  SNAPSHOT_STORE_NAME,
  buildBrevoPayload,
  buildMissingBrevoConfigResponse,
  buildSentMarkerKey,
  buildSnapshotKey,
  findReminderMatches,
  isValidEmail,
  validateReminderSnapshot,
};
