## Why

The project currently has no real automated test platform: the package test script only prints a placeholder and exits. Adding a standard unit/component and E2E testing foundation is needed before implementing higher-risk features such as agenda reminders, serverless reminder logic, calendar export, and Brevo integration.

## What Changes

- Adds a Quasar/Vite-compatible unit and component testing platform using Vitest.
- Adds Cypress for end-to-end coverage of core user flows.
- Establishes baseline tests across the main project areas instead of only testing new code.
- Adds scripts and conventions for local and CI-style test execution.
- Creates the testing foundation that the `add-agenda-reminders` change can use for reminder preference, `.ics` export, and scheduled reminder behavior.
- Excludes Jest because the project uses `@quasar/app-vite`, and Quasar's current testing guidance points Vite projects to Vitest.

## Capabilities

### New Capabilities

- `test-platform`: Defines the repository's unit/component and E2E testing stack, baseline coverage expectations, scripts, and reminder-change testing expectations.

### Modified Capabilities

- None.

## Impact

- Affects `app/package.json`, test configuration files, and generated test directories.
- Adds development dependencies for Quasar Vitest and Cypress testing harnesses.
- Adds baseline tests for composables, utility logic, important components/pages, backend/serverless logic, and core browser flows.
- Provides Cypress coverage expected by the active `add-agenda-reminders` change.
- Requires test and build commands to be run only inside the container context, following repository rules.
