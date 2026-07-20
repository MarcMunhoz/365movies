## Why

Users currently plan watch dates in the local agenda but must remember those dates themselves. A lightweight reminder system can make the personal 365 Movies workflow more useful without introducing a full account system, paid infrastructure, or native calendar integrations.

## What Changes

- Adds a global reminder preference for the agenda: no reminders, email reminders, calendar export, or both.
- Adds email reminders two days before scheduled watch dates using Brevo transactional email.
- Adds a Netlify-only persistence and scheduling flow using Netlify Functions, Scheduled Functions, and Netlify Blobs.
- Adds whole-agenda `.ics` export with calendar alarms two days before future unwatched items.
- Keeps the first version intentionally personal and free-tier oriented, with no login, no paid database, no push notifications, and no direct Android/iOS calendar write integration.

## Capabilities

### New Capabilities

- `agenda-reminders`: Defines global agenda reminder preferences, email reminder synchronization, scheduled email delivery, duplicate-send protection, and whole-agenda calendar export.

### Modified Capabilities

- None.

## Impact

- Affects the agenda UI, local storage model, and reminder preference handling.
- Adds Netlify Functions for saving reminder snapshots and running daily scheduled reminder delivery.
- Adds Netlify Blobs usage as a small key/value store for reminder subscriptions, agenda snapshots, and sent-reminder markers.
- Adds Brevo transactional email integration through server-side environment variables.
- Requires privacy-conscious handling of user email addresses and a simple unsubscribe/disable path.
