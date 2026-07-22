## 1. Preferences Foundation

- [ ] 1.1 Add local preference utilities for theme, language, and reminder edit state defaults.
- [ ] 1.2 Add a lightweight translation dictionary/composable for English and Portuguese app-owned strings.
- [ ] 1.3 Wire app startup to apply the saved theme and language preferences with dark theme and English as defaults.
- [ ] 1.4 Add the `accessibility` package with Yarn inside the container context.

## 2. Subagent Workstream Planning

- [ ] 2.1 Identify independent implementation workstreams before editing application code.
- [ ] 2.2 Dispatch focused subagents for non-overlapping workstreams when at least two areas can proceed independently.
- [ ] 2.3 Give each subagent explicit scope, relevant OpenSpec requirements, target files, constraints, and expected summary format.
- [ ] 2.4 Review subagent summaries and diffs before integrating their changes.
- [ ] 2.5 Resolve any cross-workstream conflicts centrally before running final verification.

## 3. Settings and Sidebar

- [ ] 3.1 Add a Settings/Preferences route and page.
- [ ] 3.2 Update the sidebar to show primary navigation separately from a bottom Settings/Preferences entry.
- [ ] 3.3 Build Settings sections for Appearance, Accessibility, Language, and Reminders.
- [ ] 3.4 Add dark/light controls that persist preference and update Quasar/CSS theme behavior.
- [ ] 3.5 Initialize and position the English accessibility toolbar so it does not block navigation or primary content.
- [ ] 3.6 Add EN/PT language controls and route changed Settings/sidebar copy through the translation layer.

## 4. Reminder Settings UX

- [ ] 4.1 Move full reminder method and e-mail editing controls from Agenda to Settings/Preferences.
- [ ] 4.2 Render saved reminder method and e-mail as read-only state separate from editable reminder fields.
- [ ] 4.3 Add edit, save, and cancel flows for reminder settings without mutating saved state until save.
- [ ] 4.4 Preserve current localStorage reminder keys and existing server sync/disable behavior.
- [ ] 4.5 Update Agenda to show compact reminder status and calendar export action when the saved preference includes calendar export.

## 5. Agenda Density and Challenge Placement

- [ ] 5.1 Add a dedicated Challenge route for the full 365 Movie Challenge experience.
- [ ] 5.2 Add Challenge to primary sidebar navigation.
- [ ] 5.3 Replace the expanded Challenge block on Agenda with a compact summary linking to the Challenge route.
- [ ] 5.4 Reduce Agenda legend density by showing only contextually useful legend information near the list/calendar controls.
- [ ] 5.5 Ensure Agenda primary list/calendar content appears before expanded analytics content on desktop and mobile.

## 6. Form Completion Behavior

- [ ] 6.1 Convert reminder settings, agenda edit, add/edit movie, and search-related completion flows to native form submit patterns where applicable.
- [ ] 6.2 Ensure Enter triggers the same validation and action as the primary save/confirm/add/edit button.
- [ ] 6.3 Preserve control-specific Enter behavior for selects, date pickers, and any multiline or native interaction controls.
- [ ] 6.4 Add regression coverage for Enter submission and invalid-form feedback.

## 7. Rich Reminder Metadata

- [ ] 7.1 Extend agenda item creation/editing to preserve optional poster, overview, runtime, release year, and streaming provider names when available.
- [ ] 7.2 Extend reminder snapshot building to include optional rich metadata without storing full TMDB responses.
- [ ] 7.3 Extend server-side reminder snapshot normalization and validation to accept optional rich metadata.
- [ ] 7.4 Preserve backwards compatibility for existing snapshots that only contain title, watch date, watched state, and links.

## 8. Branded Reminder E-mails

- [ ] 8.1 Update Brevo payload subject to include movie title and planned watch date context.
- [ ] 8.2 Build branded 365movies HTML e-mail content with preheader, poster thumbnail when available, movie details, overview, provider names, and clear actions.
- [ ] 8.3 Escape or sanitize interpolated movie metadata before adding it to subject or HTML content.
- [ ] 8.4 Keep fallback e-mail content valid when poster, overview, runtime, release year, providers, movie link, or app URL are missing.
- [ ] 8.5 Document that inbox avatar replacement depends on mail-client/domain configuration outside SMTP payload control.

## 9. Tests and Verification

- [ ] 9.1 Add or update unit tests for preference utilities and translation behavior.
- [ ] 9.2 Add or update unit tests for reminder snapshot rich metadata and backwards compatibility.
- [ ] 9.3 Add or update unit tests for rich Brevo payload subject/body generation and HTML escaping.
- [ ] 9.4 Add or update Cypress coverage for Settings navigation, theme toggle, language toggle, accessibility toolbar availability, and reminder edit/save/cancel UX.
- [ ] 9.5 Add or update Cypress coverage that Agenda is less dense, uses compact reminder/challenge summaries, and links to the full Challenge view.
- [ ] 9.6 Run unit, E2E, and build verification inside the container context.
