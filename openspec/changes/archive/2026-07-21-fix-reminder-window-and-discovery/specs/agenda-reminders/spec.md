## MODIFIED Requirements

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
- **THEN** the system MUST persist a sent marker for that installation, agenda item, and watch date

#### Scenario: Legacy two-day marker exists
- **WHEN** an existing sent marker uses the previous two-day offset key for the same installation, agenda item, and watch date
- **THEN** the system MUST treat that reminder as already sent

## ADDED Requirements

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
