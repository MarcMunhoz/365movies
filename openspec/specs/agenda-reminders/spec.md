## Purpose
Define agenda-level reminder preferences, e-mail reminder synchronization, scheduled reminder delivery, duplicate-send protection, and whole-agenda calendar export.

## Requirements

### Requirement: Global reminder preference
The system SHALL provide one global reminder preference for the agenda.

#### Scenario: User selects no reminders
- **WHEN** the user selects `none`
- **THEN** the system MUST NOT send e-mail reminders and MUST NOT prompt the user to export a calendar file

#### Scenario: User selects e-mail reminders
- **WHEN** the user selects `email`
- **THEN** the system MUST require a valid e-mail address before enabling e-mail reminder sync

#### Scenario: User selects calendar export
- **WHEN** the user selects `calendar`
- **THEN** the system MUST make whole-agenda calendar export available without requiring an e-mail address

#### Scenario: User selects both reminder methods
- **WHEN** the user selects `email_calendar`
- **THEN** the system MUST enable e-mail reminder sync and make whole-agenda calendar export available

### Requirement: Reminder identity
The system SHALL identify reminder records with a browser-generated installation identifier.

#### Scenario: Installation identifier does not exist
- **WHEN** reminder features are first used and no installation identifier exists
- **THEN** the system MUST generate and persist an installation identifier in local storage

#### Scenario: Installation identifier exists
- **WHEN** reminder features are used and an installation identifier already exists
- **THEN** the system MUST reuse the existing identifier for reminder synchronization

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

### Requirement: Reminder snapshot storage
The system SHALL store reminder snapshots in Netlify Blobs.

#### Scenario: Snapshot is saved
- **WHEN** the save-reminders function receives a valid reminder snapshot
- **THEN** it MUST store the snapshot under a key derived from the installation identifier

#### Scenario: Snapshot contains watched items
- **WHEN** a reminder snapshot includes watched agenda items
- **THEN** the scheduled reminder process MUST ignore watched items for e-mail delivery

### Requirement: Scheduled e-mail delivery
The system SHALL send Brevo e-mail reminders for unwatched agenda items scheduled from the function run date through two days after the run date.

#### Scenario: Matching item is exactly two days away
- **WHEN** the daily scheduled function finds an unwatched agenda item scheduled exactly two days later
- **THEN** it MUST send one transactional e-mail reminder through Brevo to the snapshot e-mail address

#### Scenario: Matching item is one day away
- **WHEN** the daily scheduled function finds an unwatched agenda item scheduled exactly one day later
- **THEN** it MUST send one transactional e-mail reminder through Brevo to the snapshot e-mail address when no reminder marker exists for that installation, item, and watch date

#### Scenario: Matching item is due today
- **WHEN** the daily scheduled function finds an unwatched agenda item scheduled for the run date
- **THEN** it MUST send one transactional e-mail reminder through Brevo to the snapshot e-mail address when no reminder marker exists for that installation, item, and watch date

#### Scenario: Item is outside the catch-up window
- **WHEN** an agenda item is scheduled before the run date or more than two days after the run date
- **THEN** the scheduled function MUST NOT send a reminder for that item during that run

#### Scenario: Brevo credentials are missing
- **WHEN** the scheduled function runs without required Brevo environment variables
- **THEN** it MUST fail safely without exposing secrets and MUST log a server-side configuration error

### Requirement: Duplicate-send protection
The system SHALL prevent duplicate reminder e-mails for the same installation, agenda item, and watch date across scheduled and save-time reminder delivery.

#### Scenario: Reminder was already sent
- **WHEN** a sent marker exists for the installation, agenda item, and watch date
- **THEN** the system MUST NOT send another e-mail for that reminder

#### Scenario: Reminder is sent successfully
- **WHEN** Brevo accepts a reminder e-mail request
- **THEN** the system MUST persist a sent marker for the installation, agenda item, and watch date

#### Scenario: Legacy two-day marker exists
- **WHEN** an existing sent marker uses the previous two-day offset key for the same installation, agenda item, and watch date
- **THEN** the system MUST treat that reminder as already sent

### Requirement: Save-time reminder catch-up
The system SHALL attempt catch-up e-mail reminder delivery when an e-mail reminder snapshot is saved with unwatched agenda items due from today through two days ahead.

#### Scenario: User saves an e-mail reminder for an item due within two days
- **WHEN** the save-reminders function stores a valid e-mail reminder snapshot containing an unwatched item due from today through two days ahead
- **THEN** the system MUST attempt to send one reminder e-mail for that item when no sent marker exists

#### Scenario: Catch-up delivery fails after snapshot storage
- **WHEN** a valid reminder snapshot is stored and catch-up delivery fails because Brevo is unavailable or misconfigured
- **THEN** the system MUST keep the stored snapshot and MUST NOT expose Brevo secrets in the client response

#### Scenario: User saves reminders for only later items
- **WHEN** the save-reminders function stores a valid e-mail reminder snapshot with no unwatched items due from today through two days ahead
- **THEN** the system MUST NOT send a catch-up e-mail during that save request

### Requirement: Relative reminder e-mail copy
The system SHALL describe the watch-date timing accurately in reminder e-mails.

#### Scenario: Reminder is for today
- **WHEN** a reminder e-mail is built for an agenda item scheduled on the send date
- **THEN** the e-mail content MUST state that the planned watch date is today

#### Scenario: Reminder is for tomorrow
- **WHEN** a reminder e-mail is built for an agenda item scheduled one day after the send date
- **THEN** the e-mail content MUST state that the planned watch date is tomorrow

#### Scenario: Reminder is for two days later
- **WHEN** a reminder e-mail is built for an agenda item scheduled two days after the send date
- **THEN** the e-mail content MUST state that the planned watch date is in two days

### Requirement: Home reminder discovery
The system SHALL make agenda reminders discoverable from the Home search experience without interrupting movie search.

#### Scenario: User opens Home
- **WHEN** the user opens the Home page
- **THEN** the system MUST show a concise, friendly reminder-discovery notice that mentions agenda reminders

#### Scenario: User follows reminder notice
- **WHEN** the user activates the reminder-discovery notice action
- **THEN** the system MUST navigate to the Agenda page where reminder settings are available

#### Scenario: Search remains primary
- **WHEN** the Home page displays the reminder-discovery notice
- **THEN** the notice MUST NOT hide, replace, or visually dominate the movie search controls

### Requirement: Whole-agenda calendar export
The system SHALL export future unwatched agenda items as one `.ics` calendar file.

#### Scenario: User exports calendar
- **WHEN** the user requests calendar export
- **THEN** the system MUST generate one `.ics` file containing all future unwatched agenda items with valid watch dates

#### Scenario: Exported event includes alarm
- **WHEN** an agenda item is included in the `.ics` file
- **THEN** its calendar event MUST include an alarm scheduled two days before the watch date

#### Scenario: Agenda contains invalid dates
- **WHEN** an agenda item has an invalid watch date
- **THEN** the system MUST exclude that item from the `.ics` export

### Requirement: Cost-conscious defaults
The system SHALL avoid requiring paid services for the first reminder version.

#### Scenario: Reminder system is configured
- **WHEN** the feature is configured for production
- **THEN** it MUST use Netlify Functions, Netlify Scheduled Functions, Netlify Blobs, and Brevo free-tier-compatible transactional e-mail settings

#### Scenario: Paid-only feature is considered
- **WHEN** a reminder behavior would require paid infrastructure, native mobile calendar access, push notifications, or user accounts
- **THEN** that behavior MUST remain out of scope for this change
