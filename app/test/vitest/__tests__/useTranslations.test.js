import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANGUAGE,
  translateAppString,
} from "../../../src/composables/useTranslations";

describe("useTranslations", () => {
  it("returns English strings by default", () => {
    expect(translateAppString("navigation.settings")).toBe("Settings");
    expect(translateAppString("settings.sections.appearance.title")).toBe("Appearance");
  });

  it("falls back to English when Portuguese is requested", () => {
    expect(translateAppString("navigation.settings", "pt-BR")).toBe("Settings");
    expect(translateAppString("settings.sections.language.title", "pt-BR")).toBe("Language");
  });

  it("falls back to English for missing language and key values", () => {
    expect(translateAppString("navigation.agenda", "fr")).toBe("Agenda");
    expect(translateAppString("missing.key", "pt-BR")).toBe("missing.key");
    expect(DEFAULT_LANGUAGE).toBe("en");
  });
});
