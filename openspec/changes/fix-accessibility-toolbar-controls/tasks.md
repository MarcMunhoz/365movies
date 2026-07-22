## 1. Diagnose Current Toolbar Behavior

- [ ] 1.1 Inspect the installed `accessibility` package DOM output and state changes for large cursor, reset, contrast, grayscale, text size, text spacing, line height, and reading guide.
- [ ] 1.2 Identify the document/body classes, attributes, inline styles, storage keys, or generated nodes that must be managed by the app integration.
- [ ] 1.3 Confirm the accessibility menu action selectors used by Cypress remain stable enough for regression tests.

## 2. Implement Accessibility Integration Fixes

- [ ] 2.1 Add an app-owned accessibility integration helper in the existing preferences boot flow or a focused utility module.
- [ ] 2.2 Ensure large cursor activation applies a visible cursor style to app-owned surfaces and interactive elements.
- [ ] 2.3 Ensure reset invokes package reset behavior when available, removes known toolbar-applied runtime effects, and clears generated reading guide artifacts.
- [ ] 2.4 Reapply saved theme and language preferences after reset without deleting `appThemePreference` or `appLanguagePreference`.
- [ ] 2.5 Keep unsupported toolbar controls hidden and keep toolbar copy in English.

## 3. Update User-Facing Settings Context

- [ ] 3.1 Adjust Settings accessibility copy only if needed to accurately describe the fixed toolbar behavior.
- [ ] 3.2 Keep dark/light theme controls in the Appearance section and avoid adding a duplicate accessibility dark mode control.

## 4. Add Regression Coverage

- [ ] 4.1 Add Cypress coverage that opens the accessibility menu, activates large cursor, and verifies cursor behavior on representative navigation, button, input, and page elements.
- [ ] 4.2 Add Cypress coverage that applies multiple accessibility effects, activates reset, and verifies those effects are removed.
- [ ] 4.3 Add Cypress coverage that reset preserves the saved light or dark theme preference.
- [ ] 4.4 Update unit tests only if new preference helper behavior is introduced outside DOM-only integration.

## 5. Verify

- [ ] 5.1 Run the affected unit tests in the container.
- [ ] 5.2 Run the affected Cypress accessibility/settings tests in the container.
- [ ] 5.3 Run the app build in the container.
- [ ] 5.4 Validate the OpenSpec change before implementation handoff or archive.
