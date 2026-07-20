## ADDED Requirements

### Requirement: Year progress grid
The system SHALL display a current-year progress grid for the movie challenge using 53 week columns and 7 weekday rows.

#### Scenario: Current-year days are represented
- **WHEN** the dashboard renders
- **THEN** each day in the current year is represented by a grid cell associated with its calendar date

#### Scenario: Future days are disabled
- **WHEN** a grid cell represents a date after today
- **THEN** the cell MUST appear disabled or visually muted and MUST NOT appear as completed

### Requirement: Movie logs are mapped by watched date
The system SHALL map movie logs to grid cells by matching each log's watched date in `DD-MM-YYYY` format.

#### Scenario: Single date has matching movie logs
- **WHEN** one or more movie logs have `watchedAt` equal to a grid cell date
- **THEN** the grid cell MUST expose those logs and its count MUST equal the number of matching logs

#### Scenario: Date has no matching movie logs
- **WHEN** no movie logs have `watchedAt` equal to a grid cell date
- **THEN** the grid cell count MUST be zero and the movies list MUST be empty

### Requirement: Cell color states
The system SHALL apply distinct visual states for empty days, single-watch days, multi-watch days, and future days.

#### Scenario: Empty past day
- **WHEN** a non-future grid cell has zero watched movies
- **THEN** the cell MUST use the neutral or dark gray empty state

#### Scenario: Single movie day
- **WHEN** a non-future grid cell has exactly one watched movie
- **THEN** the cell MUST use a soft primary-theme completed state

#### Scenario: Multiple movie day
- **WHEN** a non-future grid cell has two or more watched movies
- **THEN** the cell MUST use a saturated or darker primary-theme completed state

### Requirement: Watched-day tooltip
The system SHALL show a Quasar tooltip for filled grid cells with the watched date and movie titles.

#### Scenario: User hovers a filled cell
- **WHEN** the user hovers over a grid cell with one or more watched movies
- **THEN** the system MUST display a tooltip containing the formatted date and the watched movie title list

#### Scenario: User hovers an empty cell
- **WHEN** the user hovers over a grid cell with no watched movies
- **THEN** the system MUST NOT display a movie-title tooltip

### Requirement: Quick metrics panel
The system SHALL display quick metrics for the yearly movie challenge.

#### Scenario: Metrics are calculated
- **WHEN** movie logs for the current year are available
- **THEN** the dashboard MUST display total watched movies out of 365, completion percentage, current streak, and longest streak

### Requirement: Streak calculation
The system SHALL calculate streaks from consecutive days with at least one watched movie in the current year.

#### Scenario: Empty day before today breaks current streak
- **WHEN** there is a day without watched movies between the start of the year and yesterday
- **THEN** the current streak MUST start after the latest such empty day

#### Scenario: Empty today does not break current streak
- **WHEN** today has no watched movies and yesterday continues an active streak
- **THEN** the current streak MUST remain based on the consecutive watched days ending yesterday

#### Scenario: Longest streak uses yearly history
- **WHEN** the dashboard calculates the longest streak
- **THEN** it MUST use the longest sequence of current-year days with at least one watched movie

### Requirement: Typed and efficient derived data
The system SHALL derive grid and metric data through typed structures without heavy per-cell template computation.

#### Scenario: Grid data is derived
- **WHEN** movie logs change
- **THEN** the system MUST derive typed grid day data containing date, future state, matching movies, and count

#### Scenario: Template renders derived data
- **WHEN** the grid renders
- **THEN** the template MUST consume precomputed grid day values instead of filtering the full movie log list per cell

### Requirement: Responsive grid behavior
The system SHALL keep the weekly grid usable on narrow screens.

#### Scenario: Viewport is narrow
- **WHEN** the grid width exceeds the viewport
- **THEN** the dashboard MUST allow horizontal scrolling while preserving week and weekday alignment
