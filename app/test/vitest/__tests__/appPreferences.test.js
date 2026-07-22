import { beforeEach, describe, expect, it } from "vitest";
import {
  APP_LANGUAGE_OPTIONS,
  APP_THEME_OPTIONS,
  createReminderEditState,
  getLanguagePreference,
  getThemePreference,
  setLanguagePreference,
  setThemePreference,
} from "../../../src/utils/appPreferences";

describe("appPreferences", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to dark theme and English language", () => {
    expect(getThemePreference()).toBe(APP_THEME_OPTIONS.dark);
    expect(getLanguagePreference()).toBe(APP_LANGUAGE_OPTIONS.en);
  });

  it("persists valid theme and keeps language in English", () => {
    expect(setThemePreference(APP_THEME_OPTIONS.light)).toBe(APP_THEME_OPTIONS.light);
    expect(setLanguagePreference(APP_LANGUAGE_OPTIONS.en)).toBe(APP_LANGUAGE_OPTIONS.en);

    expect(getThemePreference()).toBe(APP_THEME_OPTIONS.light);
    expect(getLanguagePreference()).toBe(APP_LANGUAGE_OPTIONS.en);
  });

  it("normalizes invalid theme and language preferences to defaults", () => {
    expect(setThemePreference("sepia")).toBe(APP_THEME_OPTIONS.dark);
    expect(setLanguagePreference(APP_LANGUAGE_OPTIONS.ptBr)).toBe(APP_LANGUAGE_OPTIONS.en);
    expect(setLanguagePreference("fr")).toBe(APP_LANGUAGE_OPTIONS.en);
  });

  it("creates reminder edit state from saved values without mutating them", () => {
    const savedState = {
      preference: "email_calendar",
      email: "viewer@example.test",
    };

    const editState = createReminderEditState(savedState);

    expect(editState).toEqual({
      preference: "email_calendar",
      email: "viewer@example.test",
    });
    expect(editState).not.toBe(savedState);
  });
});
