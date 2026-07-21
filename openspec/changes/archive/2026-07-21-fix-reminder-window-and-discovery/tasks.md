## 1. Reminder Window Logic

- [x] 1.1 Add focused tests for reminder matching across today, tomorrow, two days ahead, past dates, later dates, watched items, and invalid dates.
- [x] 1.2 Update reminder core helpers to compute days-until-watch-date and match the inclusive 0-2 day catch-up window.
- [x] 1.3 Update duplicate marker key handling so one marker covers the installation, movie, and watch date across scheduled and save-time delivery.
- [x] 1.4 Preserve duplicate protection for existing legacy two-day marker keys.

## 2. Save-Time Catch-Up Delivery

- [x] 2.1 Extract shared reminder delivery logic that can run for all snapshots or one saved snapshot.
- [x] 2.2 Trigger catch-up delivery after a valid e-mail reminder snapshot is stored.
- [x] 2.3 Ensure snapshot storage remains successful if catch-up delivery fails, while returning/logging a safe warning without secrets.
- [x] 2.4 Add tests for save-time catch-up success, no-op for later dates, duplicate skipping, and safe catch-up failure.

## 3. Reminder E-mail Copy

- [x] 3.1 Update Brevo payload construction to use today, tomorrow, and in-two-days language.
- [x] 3.2 Add tests for each relative e-mail copy case.

## 4. Home Reminder Discovery

- [x] 4.1 Add a subtle reminder-discovery notice to the Home search experience without changing the primary search workflow.
- [x] 4.2 Link the notice to the Agenda page.
- [x] 4.3 Add Cypress coverage that the notice is visible, does not replace search controls, and navigates to Agenda.

## 5. Verification

- [x] 5.1 Run OpenSpec validation.
- [x] 5.2 Run unit tests inside the container.
- [x] 5.3 Run Cypress E2E tests inside the container.
- [x] 5.4 Run production build inside the container.
- [x] 5.5 Run audit/security check inside the container.
- [x] 5.6 Skip deployed preview dry run for now; preview URLs are only generated in PRs to `main`.
