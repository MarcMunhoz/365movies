[![Netlify Status](https://api.netlify.com/api/v1/badges/580215fe-180b-48ac-ac58-3a410d8488b6/deploy-status)](https://app.netlify.com/sites/365movies/deploys)
[![Version](https://img.shields.io/badge/version-2.5.0-1f8b4c)](#)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883)](https://vuejs.org/)
[![Quasar](https://img.shields.io/badge/Quasar-2-1976d2)](https://quasar.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/tests-Vitest-6e9f18)](https://vitest.dev/)
[![Cypress](https://img.shields.io/badge/e2e-Cypress-17202c)](https://www.cypress.io/)

# 365movies

365movies is a personal movie discovery and watch-planning app. Search movies, inspect details, pick streaming availability by country, add titles to an agenda, and track the 365 Movie Challenge from a local-first browser workflow.

## Features

- Movie search with manual queries and an "I'm lucky" discovery flow.
- Movie detail cards with poster preview, metadata, trailers, providers, and sharing actions.
- Local agenda with list and calendar views.
- Agenda reminders with e-mail delivery, same-day through two-day catch-up delivery, whole-agenda calendar export, and relative reminder copy.
- Country-aware streaming provider selection when adding movies to the agenda.
- Watched/unwatched tracking with a yearly 365 Movie Challenge progress grid.
- TMDB access through server-side proxy code so bearer tokens stay out of the client.
- PWA production build with generated service worker and manifest assets.
- Automated baseline coverage with Vitest and Cypress.
- Dependency security hardening with patched transitive resolutions for current Dependabot advisories.

## Stack

- Vue 3 and Quasar Framework
- Vite and Workbox
- Tailwind CSS and Sass
- Vitest for unit/component coverage
- Cypress for end-to-end coverage
- Netlify Functions and Netlify Blobs for TMDB proxying and agenda reminder snapshots
- Brevo Transactional Email for agenda reminder delivery
- Docker Compose for the local development environment

## Security Maintenance

Dependency updates are managed through Yarn v1 inside the Docker Compose app container. Current security remediation keeps known Dependabot advisories out of the resolved dependency graph and uses targeted `resolutions` only when upstream packages still request vulnerable transitive ranges.

The `netlify-lambda` package is intentionally not part of the runtime dependency graph; Netlify Functions are served from `app/netlify/functions` without that package.

## Project Layout

```text
app/
  src/                 Quasar application source
  netlify/functions/   Serverless proxy helpers
  test/vitest/         Unit and component tests
  test/cypress/        Cypress E2E support and specs
openspec/              Change proposals, specs, and task tracking
```

## Local Development

Package-manager scripts must run inside the container context.

```sh
make dev
```

The app is served by Quasar on `http://localhost:3650`, with the local backend middleware on port `3000`.

## Verification

Run these from the repository root through Docker Compose:

```sh
docker compose run --rm --entrypoint yarn app test:unit:ci
docker compose run --rm --entrypoint yarn app test:e2e:ci
docker compose run --rm --entrypoint yarn app build
```

The combined test script is also available:

```sh
docker compose run --rm --entrypoint yarn app test
```

If Cypress needs to be bootstrapped in a fresh container volume:

```sh
docker compose run --rm --entrypoint yarn app cypress:install
```

Security checks:

```sh
docker compose run --rm --entrypoint yarn app audit --groups dependencies --groups devDependencies
```

## Environment

The client expects `VITE_API_URL` for backend requests. Server-side TMDB proxy code expects:

```text
TMDB_BASE_URL
TMDB_BEARER_TOKEN
```

`TMDB_API_URL` is still accepted as a fallback for the base URL.

Agenda e-mail reminders use Netlify Functions, Netlify Scheduled Functions, Netlify Blobs, and Brevo Transactional Email. Configure these server-side variables in Netlify before enabling production e-mail reminders:

```text
BREVO_API_KEY
BREVO_SENDER_EMAIL
BREVO_SENDER_NAME
BREVO_APP_URL
```

Netlify Blobs uses the site context provided by Netlify in production. Local function dry runs require the Netlify CLI/site context configured for Blobs.

Reminder delivery is global for the local browser installation. Users can choose no reminders, e-mail reminders, calendar export, or both. E-mail reminders are sent two days before unwatched agenda items, and calendar exports generate one `.ics` file with matching two-day alarms.

Inbox sender avatars are not controlled by the Brevo SMTP payload. Mail clients decide avatar replacement from domain and client configuration such as contacts, provider profile settings, BIMI, or workspace branding.

## Releases

Release notes live in [CHANGELOG.md](./CHANGELOG.md).

## Quasar Configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
