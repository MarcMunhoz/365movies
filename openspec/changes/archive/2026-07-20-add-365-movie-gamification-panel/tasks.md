## 1. Data Modeling

- [ ] 1.1 Define strict TypeScript interfaces for movie logs, derived grid days, and dashboard metrics.
- [ ] 1.2 Implement date parsing and formatting helpers for `DD-MM-YYYY` watched dates.
- [ ] 1.3 Build a date-indexed movie lookup for current-year logs.

## 2. Grid and Metrics Logic

- [ ] 2.1 Generate the current-year grid with 53 week columns and 7 weekday rows.
- [ ] 2.2 Derive cell state, future state, matching movies, and movie count for each day.
- [ ] 2.3 Calculate total watched movies, completion percentage, current streak, and longest streak.

## 3. Dashboard UI

- [ ] 3.1 Render the progress grid with distinct states for empty, single-watch, multi-watch, and future cells.
- [ ] 3.2 Add Quasar tooltips for watched cells with date and movie titles.
- [ ] 3.3 Render the quick metrics panel.
- [ ] 3.4 Add responsive horizontal scrolling for narrow viewports while preserving grid alignment.

## 4. Verification

- [ ] 4.1 Add focused tests or fixtures for grid derivation, date mapping, and streak calculations.
- [ ] 4.2 Verify the dashboard manually on desktop and mobile-width layouts.
- [ ] 4.3 Run the project build or package-manager checks inside the container context.
