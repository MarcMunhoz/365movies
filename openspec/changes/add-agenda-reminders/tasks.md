## 0. Prerequisite

- [ ] 0.1 Confirm `add-test-platform` is implemented and its unit and Cypress commands pass before starting reminder implementation.

## 1. Reminder State and UI

- [ ] 1.1 Define reminder preference values and local storage keys for preference, e-mail address, and installation identifier.
- [ ] 1.2 Add an agenda-level reminder settings UI with `none`, `email`, `calendar`, and `email_calendar` options.
- [ ] 1.3 Validate e-mail input before enabling e-mail reminder synchronization.
- [ ] 1.4 Generate and persist a browser installation identifier when reminder features are first used.

## 2. Calendar Export

- [ ] 2.1 Implement `.ics` generation for future unwatched agenda items with valid watch dates.
- [ ] 2.2 Add two-day `VALARM` reminders to exported calendar events.
- [ ] 2.3 Add a whole-agenda calendar export action to the agenda page.

## 3. Server-Side Reminder Sync

- [ ] 3.1 Add Netlify Blobs dependency and environment configuration documentation.
- [ ] 3.2 Implement a save-reminders Netlify Function that validates and stores reminder snapshots by installation identifier.
- [ ] 3.3 Implement a disable/unsubscribe path that deactivates or deletes reminder snapshots.
- [ ] 3.4 Sync reminder snapshots when e-mail reminders are enabled and agenda data changes.

## 4. Scheduled E-mail Delivery

- [ ] 4.1 Add Brevo server-side environment variables for API key, sender e-mail, sender name, and app URL.
- [ ] 4.2 Implement a daily Netlify Scheduled Function that reads reminder snapshots and finds unwatched items scheduled two days later.
- [ ] 4.3 Send transactional reminder e-mails through Brevo from the scheduled function.
- [ ] 4.4 Persist sent markers to prevent duplicate e-mails for the same installation, item, date, and reminder offset.
- [ ] 4.5 Handle missing Brevo configuration and Brevo API failures without exposing secrets.

## 5. Verification

- [ ] 5.1 Add focused tests or fixtures for reminder date matching, `.ics` generation, duplicate marker keys, Brevo payload construction, and reminder preference E2E flow.
- [ ] 5.2 Manually verify reminder preference flows for none, e-mail, calendar, and both modes.
- [ ] 5.3 Manually verify Netlify Function request validation and scheduled-function dry runs.
- [ ] 5.4 Run project build or package-manager checks inside the container context.
