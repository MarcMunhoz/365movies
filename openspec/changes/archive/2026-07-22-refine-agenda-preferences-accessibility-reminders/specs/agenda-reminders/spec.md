## MODIFIED Requirements

### Requirement: E-mail reminder synchronization
The system SHALL synchronize an agenda reminder snapshot to a Netlify Function when e-mail reminders are enabled, including optional display metadata needed for rich reminder e-mails.

#### Scenario: E-mail reminders are enabled
- **WHEN** the user enables e-mail reminders with a valid e-mail address
- **THEN** the system MUST send the installation identifier, e-mail address, reminder preference, agenda snapshot, and available reminder display metadata to a server-side function

#### Scenario: Agenda changes while e-mail reminders are enabled
- **WHEN** agenda items, watch dates, watched states, or reminder display metadata change while e-mail reminders are enabled
- **THEN** the system MUST update the server-side reminder snapshot

#### Scenario: E-mail reminders are disabled
- **WHEN** the user disables e-mail reminders
- **THEN** the system MUST deactivate or delete the server-side reminder snapshot for that installation identifier

## ADDED Requirements

### Requirement: Reminder settings location
The system SHALL make reminder editing available from Settings or Preferences and keep Agenda focused on schedule management.

#### Scenario: User edits reminder settings
- **WHEN** the user wants to change reminder method or reminder e-mail address
- **THEN** the system MUST provide the editable reminder form in Settings or Preferences

#### Scenario: User views Agenda reminder state
- **WHEN** the Agenda page renders
- **THEN** the system MUST show a compact saved reminder summary without rendering the full reminder method and e-mail editing form

#### Scenario: Calendar export is enabled
- **WHEN** the saved reminder preference includes calendar export
- **THEN** the Agenda page MAY provide a direct whole-agenda calendar export action without exposing the full reminder editing form

### Requirement: Saved reminder state is separate from editing controls
The system SHALL separate saved reminder state display from editable reminder form state.

#### Scenario: Reminder settings display saved values
- **WHEN** the Settings or Preferences page renders reminder settings
- **THEN** the system MUST show the currently saved reminder method and e-mail address as read-only state

#### Scenario: User starts editing reminders
- **WHEN** the user activates the reminder edit action
- **THEN** the system MUST populate editable controls from the saved reminder state

#### Scenario: User cancels reminder edits
- **WHEN** the user cancels reminder editing
- **THEN** the system MUST leave the saved reminder method and e-mail address unchanged

#### Scenario: User saves reminder edits
- **WHEN** the user saves valid reminder edits
- **THEN** the system MUST persist the new reminder settings and update server-side reminder synchronization according to the selected preference

### Requirement: Rich reminder metadata
The system SHALL preserve optional movie metadata needed to produce useful reminder e-mails.

#### Scenario: Movie metadata is available when scheduling
- **WHEN** the user adds or edits an agenda item and movie poster, overview, runtime, release year, or streaming provider metadata is available
- **THEN** the system MUST preserve that metadata for future reminder snapshots

#### Scenario: Movie metadata is missing
- **WHEN** an agenda item does not have optional poster, overview, runtime, release year, or streaming provider metadata
- **THEN** the system MUST still save the agenda item and reminder snapshot using the required reminder fields

#### Scenario: Existing reminder snapshot lacks metadata
- **WHEN** the reminder delivery process reads an older snapshot without rich metadata
- **THEN** the system MUST still send a valid reminder e-mail using the movie title, watch date, and available links

### Requirement: Branded reminder e-mail content
The system SHALL send branded reminder e-mails that include watch-date context and available movie details.

#### Scenario: Reminder subject is built
- **WHEN** the system builds a reminder e-mail for a matched agenda item
- **THEN** the e-mail subject MUST include the movie title and planned watch date context

#### Scenario: Rich metadata is available
- **WHEN** poster, overview, runtime, release year, or streaming provider metadata is available for the reminder movie
- **THEN** the e-mail body MUST include the available metadata in a readable branded 365movies layout

#### Scenario: Poster is available
- **WHEN** a poster image is available for the reminder movie
- **THEN** the e-mail body MUST include a thumbnail image with accessible alternate text

#### Scenario: Streaming providers are available
- **WHEN** streaming provider names are available for the reminder movie
- **THEN** the e-mail body MUST list the available streaming providers

#### Scenario: App and movie links are available
- **WHEN** the app URL or movie details link is available
- **THEN** the e-mail body MUST include clear actions to open 365movies or the movie details

#### Scenario: Metadata contains unsafe characters
- **WHEN** movie metadata is interpolated into the e-mail subject or HTML body
- **THEN** the system MUST escape or sanitize the metadata before sending the Brevo payload
