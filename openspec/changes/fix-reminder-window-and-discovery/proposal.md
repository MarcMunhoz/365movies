## Why

Agenda e-mail reminders currently depend on a daily job finding items scheduled exactly two days after the job run date. If a user enables reminders after that day's job has already run, or schedules an item with fewer than two days of lead time, the reminder can miss its only send window.

The reminder feature is also only visible on the Agenda page. Users who mostly start from the Home search flow may not discover that reminders exist until they happen to open Agenda.

## What Changes

- Add catch-up reminder behavior for agenda items scheduled from today through two days ahead when e-mail reminders are saved or the agenda snapshot changes.
- Expand scheduled reminder matching from an exact D+2 date to a today-through-D+2 window, while preserving duplicate-send protection.
- Update reminder e-mail copy so it reflects whether the movie is due today, tomorrow, or in two days.
- Add a subtle, friendly reminder-discovery notice on the Home/search page that points users to Agenda reminders without competing with the search UI.
- Add tests for late opt-in, short-lead watch dates, duplicate prevention across the catch-up window, and Home reminder discovery.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `agenda-reminders`: Adjust reminder delivery timing so short-lead and late opt-in reminders are not missed, and add Home-page discovery for the agenda reminder capability.

## Impact

- Affects the reminder matching logic in `app/netlify/functions/reminderCore.js`.
- Affects scheduled reminder delivery in `app/netlify/functions/send-reminders.mjs`.
- Affects reminder snapshot save/update behavior in `app/netlify/functions/save-reminders.mjs` if immediate catch-up sending is implemented there.
- Affects reminder e-mail payload copy.
- Affects Home/search UI in `app/src/pages/IndexPage.vue` or `app/src/components/MoviesView.vue`.
- Requires focused unit and Cypress coverage.
