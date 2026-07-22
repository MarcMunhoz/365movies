## ADDED Requirements

### Requirement: Settings navigation
The system SHALL provide a Settings or Preferences surface for app-wide configuration.

#### Scenario: User opens settings from sidebar
- **WHEN** the user activates the Settings or Preferences entry in the sidebar
- **THEN** the system MUST navigate to a settings surface containing app-wide preference controls

#### Scenario: Sidebar shows settings separately
- **WHEN** the sidebar renders
- **THEN** the Settings or Preferences entry MUST appear visually separated from primary navigation and remain available near the bottom of the sidebar on supported layouts

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

### Requirement: English app-owned interface copy
The system SHALL keep app-owned interface copy in English until a complete and correct Portuguese translation is available.

#### Scenario: Default language is English
- **WHEN** the application renders app-owned UI text
- **THEN** the system MUST render that text in English

#### Scenario: Unsupported language is requested
- **WHEN** a saved or requested language is not supported
- **THEN** the system MUST fall back to English app-owned UI text

#### Scenario: External content is displayed
- **WHEN** the system displays externally supplied movie titles, provider names, or TMDB content
- **THEN** the system MUST NOT translate that external content locally

### Requirement: Enter submits completion forms
The system SHALL submit forms with Enter when a primary completion action exists.

#### Scenario: Form has a primary completion button
- **WHEN** focus is inside a form with a primary save, confirm, okay, add, edit, or conclude action and the user presses Enter
- **THEN** the system MUST trigger the same validation and action as activating the primary completion button

#### Scenario: Form has invalid values
- **WHEN** the user presses Enter in a completion form with invalid values
- **THEN** the system MUST show the same validation feedback as activating the primary completion button

#### Scenario: Control uses Enter for another interaction
- **WHEN** focus is inside a control where Enter is required for native selection or multiline input behavior
- **THEN** the system MUST preserve the control-specific behavior and MUST NOT submit prematurely
