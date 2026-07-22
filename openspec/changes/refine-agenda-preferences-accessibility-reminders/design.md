## Context

The current Quasar/Vue application uses a dark-first visual system with many app strings hardcoded in components. The Agenda page currently hosts schedule management, reminder settings, calendar export, a local-data warning, legend chips, the yearly challenge, and the list/calendar views. This makes Agenda visually dense and puts cross-cutting preferences in a feature page.

Reminder snapshots are saved by browser installation id and currently contain only the data required to send a basic reminder: movie id, title, link, watch date, and watched state. Brevo payload generation creates a short subject and a minimal HTML body. Search results already know richer movie data such as poster, overview, runtime, release year, and provider details, but the agenda/reminder model does not preserve enough of that context.

The project uses Yarn v1, Vue 3, Quasar, Tailwind CSS, localStorage, Netlify Functions, Netlify Blobs, and Brevo. Build and package-manager scripts must run inside the container context.

## Goals / Non-Goals

**Goals:**

- Move cross-cutting preferences into a dedicated Settings/Preferences page reachable from the sidebar.
- Keep dark mode as the default while adding persistent light/dark theme selection.
- Add the `accessibility` package as an English-language accessibility toolbar.
- Introduce a global EN/PT language preference and route app-owned UI strings through a translation layer.
- Refocus Agenda on scheduled movies by replacing full reminder editing with a compact saved-state summary.
- Make the full 365 Movie Challenge stop dominating Agenda.
- Make Enter submit any form with a primary save/confirm/conclude action.
- Enrich reminder e-mails with branded, useful movie context while preserving compatibility with old snapshots.

**Non-Goals:**

- Replacing Quasar or the existing Tailwind utility styling model.
- Adding user accounts, native push notifications, native mobile calendar APIs, or paid reminder infrastructure.
- Guaranteeing inbox avatar replacement through SMTP alone. Sender avatar display depends on mail-client/domain configuration such as contacts, provider profile, BIMI, or workspace settings.
- Translating third-party TMDB content or externally supplied provider names.
- Building a full e-mail template management system outside the existing Netlify Function/Brevo payload path.

## Decisions

### Add Settings as the home for cross-cutting controls

Create a Settings/Preferences route and add a bottom-aligned sidebar entry for it. The page should own Appearance, Accessibility, Language, and Reminders sections. Agenda should show only saved reminder status and relevant quick actions.

Alternative considered: keep all controls on Agenda and visually compress them. This reduces immediate movement but leaves Agenda responsible for app-wide settings and does not solve the broader sidebar/theme/accessibility needs.

### Store preferences locally first

Persist theme, language, and accessibility-related app settings in localStorage, matching the current local-first model used by agenda data and reminder preference state. Apply theme and language during app startup to avoid visible flicker where practical.

Alternative considered: server-side profile storage. That would require accounts or identity, which is outside the current application model.

### Use CSS variables and Quasar dark mode for theme

Replace hardcoded dark-only surfaces incrementally with semantic CSS variables where the changed surfaces are touched, and drive Quasar dark mode through the persisted theme preference. Keep dark as the default.

Alternative considered: add a light-mode class only around Settings. That would create inconsistent surfaces and leave the rest of the app visually broken in light mode.

### Add a small translation layer before broad i18n framework work

Introduce a local translation dictionary/composable for app-owned strings, with `en` and `pt-BR` keys. Route changed screens and shared navigation through it first, then expand coverage during implementation until the visible app-owned UI respects the selected language.

Alternative considered: install a full i18n framework immediately. The app is small and currently has no i18n structure; a lightweight layer avoids unnecessary setup unless pluralization, lazy bundles, or external localization workflows become necessary.

### Integrate `accessibility` as an auxiliary toolbar

Install and initialize the `accessibility` package with English labels and a placement that does not overlap the sidebar bottom controls or primary content. Treat the package as a user aid, not as a substitute for native accessibility work.

Alternative considered: build a custom accessibility panel. The package already provides the requested runtime controls, so custom work would add maintenance without clear benefit.

### Keep saved reminder state separate from editing state

Settings should render a read-only saved summary and only copy saved values into an edit form when the user chooses to edit. Saving updates local preference state and server snapshot behavior. Canceling edits should not mutate saved values.

Alternative considered: bind form controls directly to stored values. This is the current pattern and is what makes inputs/radios feel like display widgets instead of editing controls.

### Extend agenda item metadata for rich reminders

When adding/editing agenda items, preserve optional metadata already available from TMDB/search: poster path or poster URL, overview, runtime, release year, and streaming provider names/logos where available. Reminder snapshot validation should normalize these fields as optional. Existing snapshots without metadata must still send a valid fallback e-mail.

Alternative considered: fetch TMDB details at send time in the scheduled function. This would make daily scheduled delivery dependent on TMDB availability, API credentials, rate limits, and network behavior. Snapshot-time enrichment is more predictable and keeps reminders based on what the user saw when scheduling.

### Build branded e-mail HTML with graceful fallbacks

Generate a responsive HTML e-mail payload with a date-forward subject, preheader text, 365movies branding, poster thumbnail when available, concise movie details, overview, streaming providers, and clear links to movie details and the app. Escape user/content fields before interpolating into HTML.

Alternative considered: plain-text-only e-mail. It is robust but does not address the product-quality gap in the current reminder experience.

### Move or collapse the full 365 Movie Challenge

Prefer a dedicated Challenge route for the full grid and metrics. Agenda can keep a compact summary card linking to the full challenge. If implementation chooses to keep the component on Agenda, it must be collapsed by default and render only a compact header/summary until expanded.

Alternative considered: leave the challenge expanded by default. The screenshot shows this dominates Agenda even when there are no movies planned.

### Use subagents for independent implementation workstreams

During apply, use subagents for work that can proceed independently with focused context. Good workstream boundaries are:

- Preferences shell: Settings route, sidebar placement, theme persistence, language preference, and accessibility toolbar initialization.
- Agenda and Challenge UX: Agenda density changes, compact reminder/challenge summaries, and dedicated Challenge route.
- Reminder data and e-mail delivery: richer agenda metadata, reminder snapshot normalization, Brevo subject/body generation, and compatibility fallbacks.
- Verification and review: focused tests for each workstream, screenshot/E2E checks, and integration review after subagent results return.

The coordinator should give each subagent a narrow scope, explicit files or requirements to inspect, and a concrete return summary. Subagents should not edit the same files concurrently unless the coordinator intentionally sequences them. After subagents return, the coordinator must review diffs, resolve conflicts, and run full verification inside the container context.

Alternative considered: implement sequentially in one session. That simplifies coordination but increases context pressure and makes unrelated areas compete for attention.

## Risks / Trade-offs

- Global language selection expands the blast radius of a UI cleanup -> Start with a central dictionary and prioritize visible app-owned strings in touched routes, then add tests for language switching.
- Light mode can look inconsistent if only partially themed -> Use semantic CSS variables on shared layout and changed pages, and verify both themes with screenshots or E2E checks.
- Rich reminder metadata increases localStorage and Netlify Blob payload size -> Store only concise optional fields needed for reminders, not full TMDB responses.
- E-mail clients render HTML differently -> Use simple table/block layout, inline-safe styles, alt text, and fallback copy.
- Poster/provider images may be unavailable or blocked by clients -> Include text-first content and hide broken optional images where practical.
- The `accessibility` toolbar may conflict with app theme or layout -> Configure placement and test desktop/mobile overlays.
- Existing reminders saved before this change lack metadata -> Normalize optional fields and preserve current basic reminder behavior as fallback.
- Subagents can duplicate work or produce conflicting edits -> Assign non-overlapping scopes, require concise summaries, and reserve final integration/testing for the coordinator.

## Migration Plan

1. Add preference utilities with defaults for theme, language, and saved reminder edit state.
2. Add Settings route/sidebar entry and move reminder editing there while keeping current reminder storage keys.
3. Update Agenda to display compact reminder status and challenge summary/full-page link.
4. Extend agenda item and reminder snapshot normalization with optional metadata.
5. Replace reminder e-mail payload generation with rich branded HTML and fallback paths.
6. Add `accessibility` dependency inside the container package-manager workflow and initialize the toolbar.
7. Add tests for Settings, Agenda density behavior, Enter submit, reminder e-mail payloads, and backwards-compatible snapshots.
8. Use subagents for independent workstreams, then integrate and verify changes centrally.

Rollback can keep existing stored reminder keys and ignore optional rich metadata. If the accessibility package causes runtime issues, remove its initialization while preserving the Settings page structure.

## Open Questions

- Should the full 365 Movie Challenge definitely become its own sidebar page, or is collapsed-by-default on Agenda acceptable for the first implementation?
- Should reminder e-mails include provider logos or text-only provider names to reduce image-loading issues?
- Should the language selector be fully applied to every current app string in this change, or should this change introduce the infrastructure and translate only the touched surfaces first?
- Which workstreams should be dispatched to subagents during apply based on the actual repository state at implementation time?
