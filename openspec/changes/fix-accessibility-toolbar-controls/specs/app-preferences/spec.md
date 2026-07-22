## MODIFIED Requirements

### Requirement: Theme preference
The system SHALL allow the user to choose between dark and light visual themes.

#### Scenario: Default theme is dark
- **WHEN** no theme preference has been saved
- **THEN** the system MUST render with the dark theme

#### Scenario: User selects light theme
- **WHEN** the user selects the light theme
- **THEN** the system MUST persist the preference and render app-owned surfaces using the light theme

#### Scenario: User selects dark theme
- **WHEN** the user selects the dark theme
- **THEN** the system MUST persist the preference and render app-owned surfaces using the dark theme

#### Scenario: Accessibility reset preserves selected theme
- **WHEN** the user activates accessibility controls and then activates the accessibility reset action
- **THEN** the system MUST clear toolbar-applied accessibility effects and keep rendering app-owned surfaces with the saved theme preference

### Requirement: Accessibility toolbar
The system SHALL integrate an in-app accessibility toolbar using the `accessibility` package.

#### Scenario: Accessibility toolbar is available
- **WHEN** the application loads
- **THEN** the system MUST make the accessibility toolbar available without blocking primary navigation or page content

#### Scenario: Accessibility copy is English
- **WHEN** the accessibility toolbar displays its controls
- **THEN** the toolbar labels and actions MUST be presented in English for this project

#### Scenario: Accessibility controls are applied
- **WHEN** the user activates a toolbar control such as text size, text spacing, line height, contrast inversion, grayscale, large cursor, or reading guide
- **THEN** the system MUST apply the corresponding runtime accessibility behavior supplied by the toolbar package

#### Scenario: Large cursor applies across app-owned surfaces
- **WHEN** the user activates the large cursor accessibility control
- **THEN** the system MUST visibly apply a large cursor to app-owned surfaces and interactive elements including navigation items, buttons, links, inputs, and page content

#### Scenario: Accessibility reset clears toolbar effects
- **WHEN** the user activates one or more accessibility controls and then activates the reset accessibility control
- **THEN** the system MUST remove toolbar-applied runtime effects including large cursor, text sizing, spacing, line height, contrast inversion, grayscale, and reading guide
- **AND** the system MUST leave app-owned persisted preferences such as theme and language intact
