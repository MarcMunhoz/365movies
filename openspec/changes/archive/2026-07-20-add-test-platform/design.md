## Context

The application has no real automated test platform. `app/package.json` currently defines `test` as a placeholder command, and no Vitest, Jest, Cypress, or test files exist. The project is a Quasar 2 application using `@quasar/app-vite`, Vue 3, Tailwind CSS, local storage, Netlify Functions, and PWA build mode.

Quasar's current testing guidance for Vite projects points unit/component tests to the Vitest app extension. The Jest app extension explicitly notes that Jest is not compatible with Vite and that Vite-based Quasar projects should use Vitest. Cypress is the intended E2E stack and should also cover reminder flows in the active `add-agenda-reminders` change.

## Goals / Non-Goals

**Goals:**

- Add a standard unit/component test platform for the Quasar Vite application using Vitest.
- Add Cypress as the E2E platform for core browser workflows.
- Replace the placeholder test command with meaningful scripts.
- Establish baseline coverage across composables, utilities, components, pages, and serverless logic.
- Make the reminder change testable through unit tests and Cypress E2E tests.

**Non-Goals:**

- Add Jest to this Vite-based project.
- Pursue 100% test coverage in the first test-platform change.
- Rewrite application logic solely to improve coverage.
- Add paid CI services or infrastructure.
- Implement the reminder feature itself.

## Decisions

- Use `@quasar/testing-unit-vitest` for unit and component tests.
  Alternative considered: Jest. Jest is not appropriate for the current `@quasar/app-vite` setup based on Quasar's testing guidance, and would add compatibility friction.

- Use `@quasar/testing-e2e-cypress` for E2E tests.
  Alternative considered: Playwright. Cypress matches the user's requirement and has a Quasar app extension that provides integration helpers and scripts.

- Treat component tests and pure logic tests as Vitest responsibilities.
  Alternative considered: test all UI behavior only in Cypress. Cypress should cover user journeys, but unit/component tests are faster and better for local storage helpers, date logic, `.ics` generation, reminder matching, and component edge cases.

- Add baseline tests by risk area, not file-by-file exhaustive coverage.
  Alternative considered: require broad coverage thresholds immediately. A strict threshold before any test history exists would likely create noisy, low-value tests. The first change should establish meaningful examples and protect important flows.

- Keep all package-manager validation inside the container context.
  Alternative considered: run package scripts on the host. Repository rules require package-manager scripts and build checks to run only in the container.

## Risks / Trade-offs

- Installing Quasar testing app extensions may scaffold files that need manual cleanup -> Review generated files and keep only project-relevant examples.
- Cypress can be slower and heavier than unit tests -> Keep E2E coverage focused on critical user workflows.
- Existing code has low testability in places because logic is embedded in components -> Extract only the logic needed for valuable tests during implementation.
- No coverage threshold can allow regressions to slip through -> Add a small baseline first, then introduce thresholds in a later hardening change if useful.
- Reminder implementation could proceed before test platform is applied -> Treat `add-test-platform` as a prerequisite before applying `add-agenda-reminders`.
