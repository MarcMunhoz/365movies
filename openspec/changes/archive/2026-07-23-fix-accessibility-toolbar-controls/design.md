## Context

The app already has an `app-preferences` capability covering theme selection, English interface copy, and the in-app accessibility toolbar. The current implementation initializes the `accessibility` package in `app/src/boot/appPreferences.js`, hides package controls that are out of scope, exposes the menu through the sidebar, and stores the app theme separately through `app/src/utils/appPreferences.js`.

The reported failures are runtime toolbar behavior: large cursor does not work, reset does not clear applied accessibility effects, and the relationship between dark mode and accessibility is unclear. Because theme persistence already exists and defaults to dark, dark mode should remain an appearance preference while accessibility reset restores the persisted theme instead of forcing a new theme.

## Goals / Non-Goals

**Goals:**

- Restore the large cursor accessibility action so it visibly affects app-owned surfaces and interactive elements.
- Restore reset so it removes toolbar-applied document/body classes, attributes, inline styles, and package state without deleting app-owned preferences.
- Preserve the existing dark/light theme preference and make reset reapply the saved theme and language after clearing accessibility effects.
- Add regression coverage for the broken actions and for reset behavior in both theme states.

**Non-Goals:**

- Do not replace the `accessibility` package unless implementation proves the package cannot support the required behavior.
- Do not add a third visual theme or a separate accessibility-only dark mode.
- Do not add Portuguese accessibility copy in this change.
- Do not change reminder settings or unrelated Settings page behavior.

## Decisions

1. Keep dark mode in app preferences, not in the accessibility toolbar.

   The app already persists `appThemePreference`, applies Quasar dark mode, and has light-mode contrast tests. Adding a second dark mode through the toolbar would create two competing sources of truth. The reset action should clear accessibility effects and then reapply the saved app theme.

2. Wrap package actions where the package behavior is incomplete.

   The `accessibility` package remains the source of toolbar UI and standard actions, but the app should add a small integration layer for actions that need app-specific guarantees. Large cursor can be enforced with global CSS hooks if the package only toggles a class/attribute inconsistently. Reset can call the package reset behavior if available, then remove known toolbar side effects and reapply app preferences.

3. Test through Cypress against browser-visible behavior.

   Unit tests are useful for preference normalization, but the broken behavior is DOM and CSS integration. Cypress should open the accessibility menu, activate large cursor, assert cursor CSS on representative app-owned elements, activate reset, and assert accessibility effects are gone while the saved theme remains active.

## Risks / Trade-offs

- Package DOM/class names may change in a future `accessibility` release -> keep selectors scoped to action buttons and document-level effects observed in the installed version, and cover the integration with Cypress.
- Reset may accidentally clear app-owned theme styles -> centralize reset through a helper that reapplies `applyThemePreference(getThemePreference(), $q)` and `applyLanguagePreference(getLanguagePreference())`.
- Large cursor CSS may miss deeply nested interactive elements -> apply the cursor hook at document/app-shell level with explicit coverage for buttons, inputs, links, and drawer/search controls.
- The package may persist state outside app-owned storage -> reset should clear only known accessibility package keys/effects, not unrelated localStorage values.
