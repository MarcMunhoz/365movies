## Why

The project needs a clear progress view for the "365 Filmes no Ano" challenge so users can understand their yearly movie-watching consistency at a glance. The existing loose specification should become a tracked OpenSpec change instead of remaining as undocumented planning material.

## What Changes

- Adds a gamification dashboard for the current year's movie-watching progress.
- Adds a GitHub-contribution-style year grid with one cell per day.
- Adds quick metrics for total watched movies, completion percentage, current streak, and longest streak.
- Adds hover details for watched days, including formatted date and movie titles.

## Capabilities

### New Capabilities

- `movie-year-gamification`: Defines the yearly challenge dashboard, progress grid, cell states, tooltips, metrics, and streak behavior.

### Modified Capabilities

- None.

## Impact

- Affects the frontend application UI and TypeScript data modeling.
- Requires date-based aggregation of movie logs in `DD-MM-YYYY` format.
- Requires responsive grid rendering suitable for desktop and mobile viewports.
