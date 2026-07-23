import { boot } from "quasar/wrappers";
import { Accessibility } from "accessibility";
import {
  applyLanguagePreference,
  applyThemePreference,
  getLanguagePreference,
  getThemePreference,
} from "utils/appPreferences";
import { setAppLanguage } from "composables/useTranslations";
import { installAccessibilityIntegration } from "utils/accessibilityIntegration";

const DISABLED_ACCESSIBILITY_ACTIONS = ["underlineLinks", "disableAnimations"];

const pruneAccessibilityActions = () => {
  DISABLED_ACCESSIBILITY_ACTIONS.forEach((action) => {
    document.querySelectorAll(`button[data-access-action="${action}"]`).forEach((button) => {
      button.remove();
    });
  });
};

const observeAccessibilityMenu = () => {
  const observer = new MutationObserver(() => {
    pruneAccessibilityActions();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  pruneAccessibilityActions();
};

const initializeAccessibilityToolbar = async (quasar) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    if (typeof Accessibility !== "function") {
      return false;
    }

    document.documentElement.style.setProperty("--_access-menu-right", "0");
    document.documentElement.style.setProperty("--_access-menu-bottom", "0");
    document.documentElement.style.setProperty("--_access-menu-width", "320px");

    window.__movies365Accessibility = new Accessibility({
      modules: {
        underlineLinks: false,
        disableAnimations: false,
      },
    });
    installAccessibilityIntegration(window.__movies365Accessibility, quasar);
    observeAccessibilityMenu();
    return true;
  } catch (error) {
    console.info("Accessibility toolbar package is unavailable; continuing without it.");
    return false;
  }
};

export default boot(({ app, store, router }) => {
  const quasar = app.config.globalProperties.$q;
  const theme = applyThemePreference(getThemePreference(), quasar);
  const language = applyLanguagePreference(getLanguagePreference());
  setAppLanguage(language);

  app.provide("$appPreferences", {
    theme,
    language,
  });

  router.isReady().then(() => {
    initializeAccessibilityToolbar(quasar);
  });
});
