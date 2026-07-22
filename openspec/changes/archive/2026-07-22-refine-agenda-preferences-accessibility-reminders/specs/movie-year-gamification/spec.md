## ADDED Requirements

### Requirement: Challenge presentation does not dominate Agenda
The system SHALL prevent the full yearly movie challenge dashboard from dominating the Agenda page.

#### Scenario: Agenda page renders
- **WHEN** the Agenda page renders
- **THEN** the full 365 Movie Challenge grid and metrics MUST NOT appear expanded above the primary agenda list or calendar by default

#### Scenario: Challenge summary is shown on Agenda
- **WHEN** the Agenda page includes movie challenge information
- **THEN** the system MUST present it as a compact summary that links or expands to the full challenge experience

### Requirement: Full challenge experience remains available
The system SHALL keep the full 365 Movie Challenge grid and metrics available outside the compact Agenda summary.

#### Scenario: User opens full challenge
- **WHEN** the user activates the full challenge entry point
- **THEN** the system MUST display the yearly progress grid, quick metrics, streaks, legend, and watched-day details

#### Scenario: Full challenge is opened from sidebar
- **WHEN** the implementation provides a dedicated Challenge route
- **THEN** the sidebar MUST include a Challenge navigation entry that opens the full challenge experience
