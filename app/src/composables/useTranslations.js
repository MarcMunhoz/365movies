import { computed, ref } from "vue";
import {
  APP_LANGUAGE_OPTIONS,
  DEFAULT_LANGUAGE,
  getLanguagePreference,
  normalizeLanguagePreference,
  setLanguagePreference,
} from "utils/appPreferences";

export { DEFAULT_LANGUAGE };

const translations = {
  [APP_LANGUAGE_OPTIONS.en]: {
    "navigation.search": "Movie search",
    "navigation.agenda": "Agenda",
    "navigation.challenge": "Challenge",
    "navigation.about": "About",
    "navigation.settings": "Settings",
    "layout.tagline": "1 movie per day of year, or almost it",
    "settings.title": "Settings",
    "settings.subtitle": "Preferences for display, language, accessibility, and reminder editing.",
    "settings.sections.appearance.title": "Appearance",
    "settings.sections.appearance.description": "Choose how app-owned screens render on this device.",
    "settings.search.placeholder": "Type movie title... And press Enter",
    "settings.search.invalid": "Please type at least 3 letters.",
    "settings.actions.lucky": "I'm lucky",
    "settings.actions.clearSearch": "Clear search",
    "settings.theme.dark": "Dark",
    "settings.theme.light": "Light",
    "settings.sections.accessibility.title": "Accessibility",
    "settings.sections.accessibility.description": "The accessibility toolbar loads when the optional package is available.",
    "settings.accessibility.status": "Toolbar is initialized in English when the package can be imported.",
    "settings.sections.language.title": "Language",
    "settings.sections.language.description": "Choose the language for app-owned interface text.",
    "settings.language.en": "English",
    "settings.language.ptBr": "Portuguese",
    "settings.sections.reminders.title": "Reminders",
    "settings.sections.reminders.description": "Choose how this browser handles agenda reminders.",
    "settings.reminders.savedMethod": "Saved method",
    "settings.reminders.savedEmail": "Saved e-mail",
    "settings.reminders.noEmail": "No e-mail saved",
    "settings.reminders.edit": "Edit reminders",
    "settings.reminders.cancel": "Cancel",
    "settings.reminders.save": "Save reminders",
    "settings.reminders.emailLabel": "Reminder e-mail",
    "settings.reminders.invalidEmail": "Enter a valid e-mail address",
    "settings.reminders.emailRequired": "Enter a valid e-mail address to enable e-mail reminders.",
    "settings.reminders.saved": "Reminder settings saved.",
    "settings.reminders.emailSaved": "E-mail reminders saved.",
    "settings.reminders.syncFailed": "Could not sync e-mail reminders.",
    "settings.reminders.disableFailed": "Reminder preference saved locally. Server sync did not complete.",
    "reminders.preference.none": "None",
    "reminders.preference.email": "E-mail",
    "reminders.preference.calendar": "Calendar",
    "reminders.preference.email_calendar": "Both",
  },
};

const currentLanguage = ref(getLanguagePreference());

export const translateAppString = (key, language = currentLanguage.value) => {
  const normalizedLanguage = normalizeLanguagePreference(language);
  return translations[normalizedLanguage]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
};

export const setAppLanguage = (language) => {
  currentLanguage.value = setLanguagePreference(language);
  return currentLanguage.value;
};

export const useTranslations = () => {
  const language = computed({
    get: () => currentLanguage.value,
    set: (value) => {
      setAppLanguage(value);
    },
  });

  return {
    language,
    t: (key) => translateAppString(key, currentLanguage.value),
  };
};
