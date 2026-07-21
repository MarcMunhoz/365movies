## Handoff

Date: 2026-07-20
Branch: `develop`
Change: `add-agenda-reminders`

## Current State

- Implementation tasks are complete: 21/21.
- The change is intentionally not archived yet.
- Do not open a PR before syncing and archiving this OpenSpec change.

## Implemented

- Agenda reminder preferences: `none`, `email`, `calendar`, `email_calendar`.
- Local reminder e-mail storage and browser `installationId`.
- Whole-agenda `.ics` export for future unwatched movies with two-day `VALARM` entries.
- Netlify `save-reminders` function for storing and disabling reminder snapshots in Netlify Blobs.
- Netlify scheduled `send-reminders` function for daily Brevo reminder delivery.
- Duplicate-send markers keyed by installation, movie, watch date, and offset.
- README documentation for Brevo and Netlify reminder environment variables.
- Unit and E2E tests for reminder preferences, `.ics` generation, server-side matching, Brevo payloads, duplicate marker keys, and Agenda reminder UI.

## Verified

- `docker compose run --rm --entrypoint yarn app test:unit:ci`
  - 8 files passed
  - 20 tests passed
- `docker compose run --rm --entrypoint yarn app test:e2e:ci`
  - 2 specs passed
  - 4 tests passed
- `docker compose run --rm --entrypoint yarn app build`
  - build passed
- `docker compose run --rm --entrypoint yarn app audit --groups dependencies --groups devDependencies`
  - 0 vulnerabilities found

## Brevo Local Check

- Brevo env vars were present in the Docker container:
  - `BREVO_API_KEY`
  - `BREVO_SENDER_EMAIL`
  - `BREVO_SENDER_NAME`
  - `BREVO_APP_URL`
- Real Brevo API send test succeeded with HTTP 201.
- Message id from the local test:
  - `<202607202052.33825416219@smtp-relay.mailin.fr>`
- The test e-mail was received by `me@marcelomunhoz.com`.

## Known Local Limitation

The scheduled function dry run cannot use Netlify Blobs inside the current Docker-only local context without Netlify Blobs `siteID` and `token`.

Observed error:

```text
The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: siteID, token
```

## Next Session

- Decide whether to test Netlify Blobs via Netlify CLI/site context or a deployed preview.
- Run an integrated reminder snapshot save and scheduled dry run in a Netlify context.
- Re-run full verification after any changes.
- Sync the `agenda-reminders` delta spec to `openspec/specs/agenda-reminders/spec.md`.
- Archive `add-agenda-reminders` before opening any PR.
