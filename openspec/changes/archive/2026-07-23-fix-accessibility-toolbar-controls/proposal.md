## Why

The accessibility area currently exposes controls that do not reliably apply or clear their effects, with the large cursor and reset actions reported as broken. This is user-facing accessibility behavior and should be restored before more preference work builds on top of it.

## What Changes

- Ensure the accessibility toolbar large cursor action visibly applies the intended cursor behavior across the app shell and app-owned content.
- Ensure the accessibility toolbar reset action clears all toolbar-applied runtime accessibility effects and returns the document to the persisted app preferences.
- Keep dark mode as an app appearance preference, not as a separate accessibility-only control, while verifying accessibility controls do not break either dark or light theme.
- Add focused regression coverage for large cursor, reset, and theme coexistence.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `app-preferences`: Clarify accessibility toolbar expectations for large cursor, reset behavior, and coexistence with the existing dark/light theme preference.

## Impact

- Affects the Quasar boot integration for the `accessibility` package, global accessibility CSS, Settings page messaging, and Cypress regression tests around the toolbar.
- No API, persistence key, or dependency change is expected.
