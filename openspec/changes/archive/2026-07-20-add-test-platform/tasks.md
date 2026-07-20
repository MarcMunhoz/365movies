## 1. Testing Harness Setup

- [x] 1.1 Install the Quasar Vitest testing app extension and generated unit test dependencies inside the container context.
- [x] 1.2 Install the Quasar Cypress testing app extension and generated E2E dependencies inside the container context.
- [x] 1.3 Review generated testing files and remove or adapt scaffold examples that do not belong in the project.
- [x] 1.4 Replace the placeholder package test script with real unit, E2E, and combined test scripts.

## 2. Unit and Component Baseline

- [x] 2.1 Add unit tests for local storage helpers, including malformed JSON handling.
- [x] 2.2 Add tests for agenda date parsing or transformation logic.
- [x] 2.3 Add tests for 365 challenge grid or metric behavior.
- [x] 2.4 Add component coverage for one critical agenda or movie-management component.
- [x] 2.5 Add tests around backend/serverless helper behavior without calling external APIs directly.

## 3. E2E Baseline

- [x] 3.1 Add a Cypress smoke test for application loading and core navigation.
- [x] 3.2 Add a Cypress test for loading the agenda page and seeing its main controls.
- [x] 3.3 Add stable `data-cy` selectors where needed for critical tested flows.

## 4. Reminder Change Readiness

- [x] 4.1 Document that `add-agenda-reminders` should be implemented after this test platform is available.
- [x] 4.2 Identify reminder test cases for `.ics` generation, reminder date matching, duplicate markers, Brevo payload construction, and reminder preference E2E flow.

## 5. Verification

- [x] 5.1 Run unit tests inside the container context.
- [x] 5.2 Run Cypress E2E tests inside the container context.
- [x] 5.3 Run the project build or package-manager checks inside the container context.
- [x] 5.4 Validate the OpenSpec change after implementation.
