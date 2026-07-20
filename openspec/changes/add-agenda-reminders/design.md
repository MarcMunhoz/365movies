## Context

The agenda is currently stored locally in the browser through `watchMovies` in `localStorage`, and the Netlify backend only proxies TMDB requests. Reminder e-mails require server-side state because a scheduled process must know which agenda items exist, which e-mail address to notify, and which reminders have already been sent.

The project is personal and cost-sensitive. The first version must stay within free-tier services: Netlify Functions, Netlify Scheduled Functions, Netlify Blobs, and Brevo Free. Calendar integration should avoid native Android/iOS APIs and use a portable `.ics` export instead.

## Goals / Non-Goals

**Goals:**

- Add one global reminder preference for the whole agenda.
- Support `none`, `email`, `calendar`, and `email_calendar` reminder modes.
- Send e-mail reminders two days before unwatched scheduled agenda items through Brevo.
- Store the minimum server-side reminder snapshot needed for scheduled e-mails.
- Export the whole future agenda as one `.ics` file with two-day alarms.
- Keep user setup simple and avoid paid services by default.

**Non-Goals:**

- Add user accounts or authentication.
- Add a full database, paid scheduler, or external backend service beyond Brevo.
- Write directly to native Android or iOS calendars.
- Add push notifications.
- Make reminder preferences configurable per movie.
- Guarantee zero cost under all traffic volumes; the implementation only targets free-tier usage.

## Decisions

- Use a browser-generated `installationId` instead of accounts.
  Alternative considered: user login. Login would give stronger identity and cross-device sync but is too large for this personal first version.

- Store reminder subscriptions in Netlify Blobs.
  Alternative considered: keep everything in `localStorage`. That cannot support scheduled e-mails because the server has no access to browser-only data. Netlify Blobs is a small key/value store available in the existing hosting platform.

- Sync an agenda snapshot whenever e-mail reminders are enabled or agenda data changes.
  Alternative considered: store only one reminder per movie. A whole snapshot is simpler, idempotent, and easier to replace when dates or watch status change.

- Run one daily Netlify Scheduled Function to send reminders.
  Alternative considered: schedule individual Brevo e-mails when each item is saved. Daily scanning makes duplicate protection and updated agenda dates easier to reason about and avoids relying on long-lived scheduled e-mails in Brevo.

- Use Brevo Transactional Email API from Netlify Functions only.
  Alternative considered: call Brevo from the frontend. That would expose the Brevo API key and is not acceptable.

- Generate one full-agenda `.ics` file from the frontend.
  Alternative considered: add calendar entries per item. Per-item export creates repetitive work for the user and does not match the agenda-level reminder preference.

- Use a fixed two-day reminder offset for V1.
  Alternative considered: configurable reminder timing. Fixed timing keeps the UX and scheduled job simpler and matches the stated need.

## Risks / Trade-offs

- Free-tier services can still stop or throttle when their limits are exceeded -> Document the expected free-tier usage and avoid paid auto-recharge by default.
- No login means no reliable cross-device identity -> Treat each browser installation as independent and preserve the existing local-agenda model.
- Netlify Blobs is a key/value snapshot store, not a relational database -> Keep records small, replace whole snapshots, and store sent-reminder markers separately.
- Duplicate reminder e-mails could be sent if the scheduled job retries -> Persist sent markers keyed by installation, movie, date, and reminder offset before or immediately after a successful send.
- Users can disable e-mail locally but leave stale server-side data if sync fails -> Provide a disable/unsubscribe endpoint that deletes or deactivates the server-side snapshot.
- Brevo setup may require sender/domain verification for deliverability -> Keep API keys and sender settings in Netlify environment variables and document setup before enabling production e-mails.
- Imported `.ics` files may not update automatically after agenda edits -> Make export a manual snapshot and tell users to re-export when dates change.
