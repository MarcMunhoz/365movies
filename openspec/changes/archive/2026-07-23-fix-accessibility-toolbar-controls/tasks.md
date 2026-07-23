## 1. Diagnose Current Toolbar Behavior

- [x] 1.1 Inspect the installed `accessibility` package DOM output and state changes for large cursor, reset, contrast, grayscale, text size, text spacing, line height, and reading guide.
- [x] 1.2 Identify the document/body classes, attributes, inline styles, storage keys, or generated nodes that must be managed by the app integration.
- [x] 1.3 Confirm the accessibility menu action selectors used by Cypress remain stable enough for regression tests.

## 2. Implement Accessibility Integration Fixes

- [x] 2.1 Add an app-owned accessibility integration helper in the existing preferences boot flow or a focused utility module.
- [x] 2.2 Ensure large cursor activation applies a visible cursor style to app-owned surfaces and interactive elements.
- [x] 2.3 Ensure reset invokes package reset behavior when available, removes known toolbar-applied runtime effects, and clears generated reading guide artifacts.
- [x] 2.4 Reapply saved theme and language preferences after reset without deleting `appThemePreference` or `appLanguagePreference`.
- [x] 2.5 Keep unsupported toolbar controls hidden and keep toolbar copy in English.

## 3. Update User-Facing Settings Context

- [x] 3.1 Adjust Settings accessibility copy only if needed to accurately describe the fixed toolbar behavior.
- [x] 3.2 Keep dark/light theme controls in the Appearance section and avoid adding a duplicate accessibility dark mode control.

## 4. Add Regression Coverage

- [x] 4.1 Add Cypress coverage that opens the accessibility menu, activates large cursor, and verifies cursor behavior on representative navigation, button, input, and page elements.
- [x] 4.2 Add Cypress coverage that applies multiple accessibility effects, activates reset, and verifies those effects are removed.
- [x] 4.3 Add Cypress coverage that reset preserves the saved light or dark theme preference.
- [x] 4.4 Update unit tests only if new preference helper behavior is introduced outside DOM-only integration.

## 5. Verify

- [x] 5.1 Run the affected unit tests in the container.
- [x] 5.2 Run the affected Cypress accessibility/settings tests in the container.
- [x] 5.3 Run the app build in the container.
- [x] 5.4 Validate the OpenSpec change before implementation handoff or archive.
