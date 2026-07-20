## Purpose

Define the automated testing platform, baseline coverage expectations, and container-only verification rules for the Quasar Vite application.

## Requirements

### Requirement: Unit test platform
The project SHALL use Vitest as the unit and component test runner for the Quasar Vite application.

#### Scenario: Developer runs unit tests
- **WHEN** a developer runs the unit test script inside the container context
- **THEN** Vitest MUST execute the configured unit and component test suite

#### Scenario: Quasar component is tested
- **WHEN** a test mounts a component that depends on Quasar components or plugins
- **THEN** the test setup MUST install the Quasar testing plugin or equivalent Quasar test configuration

### Requirement: Jest exclusion
The project SHALL NOT introduce Jest for this Vite-based Quasar application.

#### Scenario: Unit test stack is selected
- **WHEN** unit testing dependencies are added
- **THEN** the selected stack MUST use Vitest instead of Jest

### Requirement: E2E test platform
The project SHALL use Cypress as the end-to-end test runner.

#### Scenario: Developer runs E2E tests
- **WHEN** a developer runs the E2E test script inside the container context
- **THEN** Cypress MUST execute browser-based tests against the Quasar application

#### Scenario: E2E tests need an application server
- **WHEN** Cypress E2E tests run in CI-style mode
- **THEN** the test command MUST start or target the Quasar development server required by the E2E suite

### Requirement: Test scripts
The project SHALL provide meaningful package scripts for automated testing.

#### Scenario: Package test command runs
- **WHEN** the package test command is executed inside the container context
- **THEN** it MUST run real automated tests instead of a placeholder echo command

#### Scenario: Separate test types run
- **WHEN** a developer needs only unit or E2E tests
- **THEN** the project MUST provide separate scripts for unit tests and E2E tests

### Requirement: Baseline unit coverage
The project SHALL include baseline unit or component tests for important existing application areas.

#### Scenario: Local storage helpers are tested
- **WHEN** the unit test suite runs
- **THEN** it MUST cover local storage read/write behavior and malformed stored data handling

#### Scenario: Agenda logic is tested
- **WHEN** the unit test suite runs
- **THEN** it MUST cover date parsing or transformation logic used by agenda and challenge views

#### Scenario: Challenge component behavior is tested
- **WHEN** the unit or component test suite runs
- **THEN** it MUST cover core 365 challenge grid or metric behavior

#### Scenario: Serverless logic is tested
- **WHEN** backend or serverless helper logic is present
- **THEN** the unit test suite MUST cover request validation, error behavior, or response shaping without calling external APIs directly

### Requirement: Baseline E2E coverage
The project SHALL include Cypress tests for critical user workflows.

#### Scenario: Agenda page loads
- **WHEN** the E2E suite runs
- **THEN** it MUST verify that the agenda page can load and display its main controls

#### Scenario: Core navigation works
- **WHEN** the E2E suite runs
- **THEN** it MUST verify at least one core navigation flow through the application

### Requirement: Reminder test readiness
The test platform SHALL support tests required by the agenda reminders change.

#### Scenario: Reminder change adds logic tests
- **WHEN** `add-agenda-reminders` is implemented after the test platform
- **THEN** it MUST be able to add unit tests for reminder date matching, duplicate marker keys, `.ics` generation, and Brevo payload construction

#### Scenario: Reminder change adds E2E tests
- **WHEN** `add-agenda-reminders` is implemented after the test platform
- **THEN** it MUST be able to add Cypress coverage for reminder preference selection and calendar export behavior

### Requirement: Container-only verification
The project SHALL run package-manager test and build commands only in the container context.

#### Scenario: Test commands are documented
- **WHEN** the test platform documents verification commands
- **THEN** the documentation MUST indicate that package-manager scripts run in the container context
