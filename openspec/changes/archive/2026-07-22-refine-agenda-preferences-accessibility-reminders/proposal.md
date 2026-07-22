## Why

The Agenda page has accumulated unrelated concerns: schedule management, reminder configuration, calendar export, yearly challenge analytics, legends, and local-data warnings all compete for attention. Reminder e-mails also feel too bare for a product touchpoint and do not use the movie context the app already knows.

This change refocuses Agenda on scheduled movies, moves cross-cutting preferences into a dedicated settings area, improves form completion ergonomics, and upgrades reminder e-mails into useful, branded messages.

## What Changes

- Add a Settings/Preferences area reachable from the bottom of the sidebar.
- Add dark/light theme selection while preserving the current dark visual style as the default.
- Add the `accessibility` package as an in-app accessibility toolbar with English UI copy.
- Add a global app language preference for English/Portuguese as a planned capability, with English remaining the initial/default language.
- Move reminder editing out of the Agenda page into Settings/Preferences, leaving Agenda with a compact saved reminder summary and direct calendar export action when relevant.
- Separate saved reminder state from editable reminder form fields so inputs are used for editing, not as the primary display of saved state.
- Make form completion submit via Enter wherever a primary conclude/save/confirm action exists.
- Reduce Agenda visual density by moving the full 365 Movie Challenge experience to a dedicated surface or making only a compact challenge summary visible on Agenda.
- Enrich reminder e-mails with date-forward subjects, 365movies branding, movie poster thumbnail when available, overview, runtime, release year, and streaming provider context when available.
- Preserve graceful fallback behavior for existing reminders and movies that do not have rich metadata.
- Use focused subagents during implementation for independent workstreams to reduce coordinator context load, speed up parallel investigation, and avoid spending one long session on unrelated subsystems.

## Capabilities

### New Capabilities

- `app-preferences`: Global settings surface, theme selection, accessibility toolbar, language preference, and app-wide form completion behavior.

### Modified Capabilities

- `agenda-reminders`: Reminder settings location, saved-versus-editing UX, rich reminder snapshot metadata, and branded reminder e-mails.
- `movie-year-gamification`: Placement and default presentation of the 365 Movie Challenge relative to Agenda.

## Impact

- Affects `app/src/layouts/MainLayout.vue`, sidebar navigation, theme styling, global CSS variables, and likely app-level preference persistence.
- Affects `app/src/pages/AgendaPage.vue` by removing reminder form density and reducing challenge footprint.
- Adds or updates a Settings/Preferences page and related routes.
- Adds the `accessibility` Yarn dependency and initialization/configuration code.
- Affects reminder preference utilities, Netlify reminder functions, Brevo payload generation, tests, and reminder snapshot validation.
- May extend local agenda movie records with optional display metadata such as poster, overview, runtime, release year, and provider names.
- Implementation should be split into independent subagent workstreams where practical: preferences/theme/i18n, Agenda/Challenge layout, reminder data/e-mail payloads, and test coverage/review.
