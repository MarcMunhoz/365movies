## Context

### Production observation

On July 21, 2026, a movie scheduled for July 23, 2026 was eligible only if the daily Netlify Scheduled Function had not already run. If the user saved the reminder after that run, the next daily run would be July 22 and the current exact D+2 matcher would look for July 24, skipping the July 23 item.

### Current reminder mechanics

- Reminder snapshots are saved in Netlify Blobs by browser installation id.
- The scheduled job reads all snapshots once per day.
- `findReminderMatches()` currently returns unwatched agenda items scheduled exactly two days after the job run date.
- Duplicate markers include installation, movie id, watch date, and a fixed two-day offset.
- Reminder copy currently says the planned watch date is "in two days".

### Current discovery mechanics

- Home is primarily the search experience through `MoviesView`.
- Reminder controls live only on Agenda.
- Users can use search and add movies without learning that reminder preferences exist.

## Goals / Non-Goals

**Goals:**

- Prevent missed reminders when e-mail reminders are enabled for items due today, tomorrow, or in two days.
- Keep duplicate-send protection strict: one reminder e-mail per installation, movie, and watch date for the catch-up window.
- Preserve free-tier-friendly Netlify/Brevo architecture.
- Add a Home notice that makes reminders discoverable without becoming a landing-page hero or interrupting search.
- Keep the change small enough to implement and verify in one future session.

**Non-Goals:**

- Add configurable reminder offsets.
- Add per-movie reminder preferences.
- Add user accounts, cross-device identity, push notifications, or native calendar writes.
- Send multiple countdown e-mails for the same movie date.
- Redesign the Home page or search workflow.

## Decisions

- Use a catch-up window of today through two days ahead.
  Alternative considered: keep exact D+2 and document the limitation. That leaves a surprising failure mode for a reminder feature and does not match user expectations after enabling reminders.

- Run catch-up both during scheduled delivery and after a successful snapshot save.
  Alternative considered: scheduled-only window. That fixes late D+2 saves on the next day, but still misses same-day saves after the daily job has already run. Save-time catch-up closes that gap.

- Store duplicate markers by installation, movie, watch date, and a stable catch-up reminder type instead of the current fixed `2d` offset.
  Alternative considered: store separate `0d`, `1d`, and `2d` markers. That could send the same movie reminder multiple times across consecutive daily runs. The desired behavior is one reminder, not a countdown sequence.

- Keep snapshot saving successful even if catch-up delivery fails.
  Alternative considered: fail the save request when Brevo fails. That would make preference saving feel unreliable and could lose the server-side agenda snapshot. The function should save the snapshot first, then report a warning or log catch-up failure without exposing secrets.

- Add a restrained Home reminder notice near the search flow.
  Alternative considered: a prominent banner or modal. That would compete with the Home page's primary search task. The notice should be compact, dismissible only if local UI state already supports it or otherwise simply low-emphasis, and link users to Agenda.

## Risks / Trade-offs

- Immediate catch-up can send an e-mail right after saving preferences -> Make the UI copy and success notification clear that short-lead reminders may be sent right away.
- Save-time catch-up adds Brevo work to the save path -> Save the snapshot before catch-up, keep catch-up scoped to one installation, and avoid blocking preference persistence on delivery failure.
- Window matching could include same-day items that feel too late -> This is intentional for late opt-in; e-mail copy must say "today" rather than "in two days".
- A Home notice can distract from search -> Keep it visually secondary, below or adjacent to the search context, with concise copy and a single route to Agenda.
- Duplicate marker migration could leave old `2d` markers in place -> Treat existing fixed-offset markers as already sent when evaluating a matching movie/date, or write the new marker after the next successful send path. Avoid re-sending already-reminded items during migration.

## Migration Plan

1. Add tests for reminder window matching and duplicate marker behavior.
2. Adjust reminder core helpers to compute days until watch date and return matches in the inclusive 0-2 day window.
3. Update duplicate marker keys to support a single catch-up marker per installation/movie/watch date while honoring existing fixed `2d` markers.
4. Update scheduled delivery and save-time catch-up to share the same delivery helper.
5. Update e-mail payload copy for today/tomorrow/two-day language.
6. Add the Home reminder discovery notice with Cypress coverage.
7. Verify unit tests, Cypress tests, build, audit, and a Netlify preview dry run.

## Open Questions

- Should the Home reminder notice be always visible, or dismissible using local storage? Default recommendation: always visible but low-emphasis for V1, because dismiss state adds another persistence behavior and the copy can stay compact.
- Should save-time catch-up return warning metadata to the frontend when Brevo fails? Default recommendation: yes, but keep user notification generic and log details server-side.
