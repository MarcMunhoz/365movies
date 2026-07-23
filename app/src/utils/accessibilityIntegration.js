import {
  applyLanguagePreference,
  applyThemePreference,
  getLanguagePreference,
  getThemePreference,
} from "utils/appPreferences";
import { setAppLanguage } from "composables/useTranslations";

const ACCESSIBILITY_STATE_KEY = "_accessState";
const ACCESSIBILITY_ACTIONS = [
  "textToSpeech",
  "speechToText",
  "disableAnimations",
  "underlineLinks",
  "grayHues",
  "invertColors",
  "bigCursor",
  "readingGuide",
];

const RESTORABLE_ATTRIBUTES = Object.freeze({
  "data-init-font-size": "fontSize",
  "data-init-line-height": "lineHeight",
  "data-init-word-spacing": "wordSpacing",
  "data-init-letter-spacing": "letterSpacing",
});

const runIfAvailable = (accessibility, action) => {
  const button = document.querySelector(`._access-menu [data-access-action="${action}"]`);
  const handler = accessibility?.menuInterface?.[action];

  if (button && typeof handler === "function") {
    handler.call(accessibility.menuInterface, true);
  }
};

const resetPackageSession = (accessibility) => {
  if (!accessibility?.sessionState || !accessibility?.stateValues) {
    return;
  }

  Object.assign(accessibility.sessionState, {
    textSize: 0,
    textSpace: 0,
    lineHeight: 0,
    invertColors: false,
    grayHues: false,
    underlineLinks: false,
    bigCursor: false,
    readingGuide: false,
  });

  Object.assign(accessibility.stateValues, {
    underlineLinks: false,
    textToSpeech: false,
    invertColors: false,
    grayHues: false,
    bigCursor: false,
    readingGuide: false,
  });
};

const restoreAttributeStyles = () => {
  Object.entries(RESTORABLE_ATTRIBUTES).forEach(([attribute, styleProperty]) => {
    document.querySelectorAll(`[${attribute}]`).forEach((element) => {
      element.style[styleProperty] = element.getAttribute(attribute) || "";
      element.removeAttribute(attribute);
    });
  });
};

export const clearAccessibilityRuntimeEffects = (accessibility) => {
  const html = document.documentElement;

  html.classList.remove("_access_cursor");
  html.style.filter = "";
  html.style.webkitFilter = "";
  html.style.mozFilter = "";
  html.style.msFilter = "";
  document.body.classList.remove("_access-listening");

  document.getElementById("access_read_guide_bar")?.remove();
  document.querySelector("._access-underline")?.remove();
  document.querySelectorAll("._access-menu button.active, ._access-menu div.active").forEach((element) => {
    element.classList.remove("active");
  });

  restoreAttributeStyles();
  resetPackageSession(accessibility);
  window.localStorage.removeItem(ACCESSIBILITY_STATE_KEY);
};

export const reapplyAppPreferences = (quasar) => {
  const theme = applyThemePreference(getThemePreference(), quasar);
  const language = applyLanguagePreference(getLanguagePreference());
  setAppLanguage(language);

  return { theme, language };
};

export const installAccessibilityIntegration = (accessibility, quasar) => {
  if (!accessibility || accessibility.__movies365Integrated) {
    return;
  }

  const toggleMenu = accessibility.toggleMenu?.bind(accessibility);
  const resetToolbar = () => {
    ACCESSIBILITY_ACTIONS.forEach((action) => {
      runIfAvailable(accessibility, action);
    });
    accessibility.resetTextSize?.();
    accessibility.resetTextSpace?.();
    accessibility.resetLineHeight?.();
    clearAccessibilityRuntimeEffects(accessibility);
    reapplyAppPreferences(quasar);
  };

  accessibility.toggleMenu = () => {
    if (document.querySelector("._access-menu")) {
      toggleMenu?.();
    }
  };
  accessibility.resetAll = resetToolbar;
  accessibility.__movies365Integrated = true;
};
