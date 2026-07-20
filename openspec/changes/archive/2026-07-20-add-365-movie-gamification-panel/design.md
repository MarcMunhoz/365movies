## Context

The current planning note describes a gamified dashboard for the "365 Filmes no Ano" challenge, but it is stored outside OpenSpec. The feature belongs in the Vue 3, Quasar, Tailwind CSS, and strict TypeScript frontend as a user-facing progress visualization.

The source data is expected to contain movie logs with a watched date in Brazilian `DD-MM-YYYY` format. The dashboard must transform those logs into a current-year day grid and summary metrics without doing heavy work inside Vue templates.

## Goals / Non-Goals

**Goals:**

- Render a current-year progress grid with 53 week columns and 7 weekday rows.
- Represent future days, empty days, single-watch days, and multi-watch days with distinct states.
- Display quick yearly metrics for total watched movies, completion percentage, current streak, and longest streak.
- Keep data transformation typed, centralized, and efficient through computed data.
- Preserve responsive behavior, allowing horizontal scrolling on narrow screens when needed.

**Non-Goals:**

- Persist movie logs or introduce a backend API.
- Define movie creation, editing, deletion, or import workflows.
- Support multiple years in the initial dashboard.
- Replace the existing application theme system.

## Decisions

- Use a typed `MovieLog` input model and a derived `GridDay` view model.
  Alternative considered: bind raw movie logs directly in the template. The derived model is preferred because it keeps aggregation, future-day detection, counts, and display data outside rendering loops.

- Build a date-indexed lookup before generating the grid.
  Alternative considered: filter the full movie list per grid cell. The lookup avoids repeated scans across up to 365 rendered cells and keeps the component responsive as the log grows.

- Generate the current-year grid as 53 columns by 7 rows.
  Alternative considered: render only the 365 or 366 calendar days. The fixed weekly structure matches the contribution-graph mental model and keeps weekday alignment stable.

- Treat today's empty cell as non-breaking for current streak calculations.
  Alternative considered: require a movie today to preserve the streak. The original requirement explicitly allows today to remain empty without breaking the current streak; only gaps through yesterday break it.

- Use Quasar `QTooltip` for hover details.
  Alternative considered: custom tooltip markup. Quasar keeps behavior consistent with the project's UI framework and avoids bespoke accessibility and positioning logic.

## Risks / Trade-offs

- Date parsing from `DD-MM-YYYY` can be error-prone if logs include invalid dates or inconsistent separators -> centralize parsing and ignore or normalize invalid records deliberately.
- A fixed 53-column grid can overflow small screens -> wrap the grid in a horizontal scrolling container while preserving cell size.
- Leap years include 366 days -> generate actual current-year dates while preserving the weekly grid shape, and leave non-year padding cells inert if the implementation uses them.
- Tooltip content can become long when many movies share a date -> render titles in a compact list and constrain tooltip width.
