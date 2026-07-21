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

export const buildReminderSnapshot = ({ installationId, email, preference, movies }) => ({
  installationId,
  email: String(email || "").trim(),
  preference,
  updatedAt: new Date().toISOString(),
  movies: (movies || []).map((movie) => ({
    movieID: String(movie.movieID ?? ""),
    movieTitle: String(movie.movieTitle ?? ""),
    movieLink: String(movie.movieLink ?? ""),
    watchDate: String(movie.watchDate ?? ""),
    watched: Boolean(movie.watched),
  })),
});
