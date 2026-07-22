import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";

export const APP_THEME_OPTIONS = Object.freeze({
  dark: "dark",
  light: "light",
});

export const APP_LANGUAGE_OPTIONS = Object.freeze({
  en: "en",
});

export const APP_PREFERENCE_KEYS = Object.freeze({
  theme: "appThemePreference",
  language: "appLanguagePreference",
});

export const DEFAULT_THEME = APP_THEME_OPTIONS.dark;
export const DEFAULT_LANGUAGE = APP_LANGUAGE_OPTIONS.en;

const normalizePreference = (value, allowedValues, defaultValue) =>
  allowedValues.includes(value) ? value : defaultValue;

export const normalizeThemePreference = (theme) =>
  normalizePreference(theme, Object.values(APP_THEME_OPTIONS), DEFAULT_THEME);

export const normalizeLanguagePreference = (language) =>
  normalizePreference(language, Object.values(APP_LANGUAGE_OPTIONS), DEFAULT_LANGUAGE);

export const getThemePreference = () =>
  normalizeThemePreference(getLocalStorage(APP_PREFERENCE_KEYS.theme, DEFAULT_THEME));

export const setThemePreference = (theme) => {
  const normalizedTheme = normalizeThemePreference(theme);
  setLocalStorage(APP_PREFERENCE_KEYS.theme, normalizedTheme);
  return normalizedTheme;
};

export const getLanguagePreference = () =>
  normalizeLanguagePreference(getLocalStorage(APP_PREFERENCE_KEYS.language, DEFAULT_LANGUAGE));

export const setLanguagePreference = (language) => {
  const normalizedLanguage = normalizeLanguagePreference(language);
  setLocalStorage(APP_PREFERENCE_KEYS.language, normalizedLanguage);
  return normalizedLanguage;
};

export const applyThemePreference = (theme, quasar) => {
  const normalizedTheme = normalizeThemePreference(theme);

  if (typeof document !== "undefined") {
    document.documentElement.dataset.appTheme = normalizedTheme;
    document.documentElement.style.colorScheme = normalizedTheme;
  }

  quasar?.dark?.set(normalizedTheme === APP_THEME_OPTIONS.dark);
  return normalizedTheme;
};

export const applyLanguagePreference = (language) => {
  const normalizedLanguage = normalizeLanguagePreference(language);

  if (typeof document !== "undefined") {
    document.documentElement.lang = normalizedLanguage;
  }

  return normalizedLanguage;
};

export const createReminderEditState = (savedState = {}) => ({
  preference: savedState.preference || "none",
  email: savedState.email || "",
});
