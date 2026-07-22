import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";

export const REMINDER_PREFERENCES = Object.freeze({
  none: "none",
  email: "email",
  calendar: "calendar",
  emailCalendar: "email_calendar",
});

export const REMINDER_STORAGE_KEYS = Object.freeze({
  preference: "agendaReminderPreference",
  email: "agendaReminderEmail",
  installationId: "agendaReminderInstallationId",
});

export const EMAIL_REMINDER_PREFERENCES = new Set([
  REMINDER_PREFERENCES.email,
  REMINDER_PREFERENCES.emailCalendar,
]);

export const CALENDAR_REMINDER_PREFERENCES = new Set([
  REMINDER_PREFERENCES.calendar,
  REMINDER_PREFERENCES.emailCalendar,
]);

export const isEmailReminderPreference = (preference) => EMAIL_REMINDER_PREFERENCES.has(preference);

export const isCalendarReminderPreference = (preference) => CALENDAR_REMINDER_PREFERENCES.has(preference);

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

const createFallbackInstallationId = () => {
  const randomValue = Math.random().toString(36).slice(2);
  return `browser-${Date.now().toString(36)}-${randomValue}`;
};

export const getReminderPreference = () => {
  const storedPreference = getLocalStorage(REMINDER_STORAGE_KEYS.preference, REMINDER_PREFERENCES.none);
  return Object.values(REMINDER_PREFERENCES).includes(storedPreference)
    ? storedPreference
    : REMINDER_PREFERENCES.none;
};

export const setReminderPreference = (preference) => {
  const normalizedPreference = Object.values(REMINDER_PREFERENCES).includes(preference)
    ? preference
    : REMINDER_PREFERENCES.none;
  setLocalStorage(REMINDER_STORAGE_KEYS.preference, normalizedPreference);
  return normalizedPreference;
};

export const getReminderEmail = () => getLocalStorage(REMINDER_STORAGE_KEYS.email, "");

export const setReminderEmail = (email) => {
  const normalizedEmail = String(email || "").trim();
  setLocalStorage(REMINDER_STORAGE_KEYS.email, normalizedEmail);
  return normalizedEmail;
};

export const getInstallationId = () => getLocalStorage(REMINDER_STORAGE_KEYS.installationId, "");

export const getOrCreateInstallationId = () => {
  const existingInstallationId = getInstallationId();

  if (existingInstallationId) {
    return existingInstallationId;
  }

  const installationId = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : createFallbackInstallationId();
  setLocalStorage(REMINDER_STORAGE_KEYS.installationId, installationId);
  return installationId;
};

const normalizeOptionalString = (value) => {
  const normalizedValue = String(value ?? "").trim();
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

const buildReminderMovieSnapshot = (movie) => {
  const metadata = {
    posterPath: normalizeOptionalString(movie.posterPath ?? movie.poster_path),
    posterUrl: normalizeOptionalString(movie.posterUrl ?? movie.poster_url),
    overview: normalizeOptionalString(movie.overview),
    runtime: normalizeOptionalNumber(movie.runtime),
    releaseYear: normalizeOptionalNumber(movie.releaseYear ?? movie.release_year),
    streamingProviders: normalizeStreamingProviders(movie),
  };

  return {
    movieID: String(movie.movieID ?? ""),
    movieTitle: String(movie.movieTitle ?? ""),
    movieLink: String(movie.movieLink ?? ""),
    watchDate: String(movie.watchDate ?? ""),
    watched: Boolean(movie.watched),
    ...Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined)),
  };
};

export const buildReminderSnapshot = ({ installationId, email, preference, movies }) => ({
  installationId,
  email: String(email || "").trim(),
  preference,
  updatedAt: new Date().toISOString(),
  movies: (movies || []).map(buildReminderMovieSnapshot),
});
