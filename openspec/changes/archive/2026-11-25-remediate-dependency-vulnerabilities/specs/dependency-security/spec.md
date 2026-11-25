## MODIFIED Requirements

### Requirement: Security verification
The remediation SHALL be verified against the current local dependency graph, automated checks, and known advisory state before it is considered complete. The verification MUST record the advisory baseline for the current remediation and the evidence used to reconcile it.

#### Scenario: Baseline local audit runs
- **WHEN** remediation work begins
- **THEN** an audit of the currently resolved dependency graph MUST run in the project container and its actionable findings MUST be recorded in the remediation scope

#### Scenario: Local verification runs
- **WHEN** dependency remediation is complete locally
- **THEN** package installation, relevant automated tests, production build, and available audit and security checks MUST run successfully in the project container context

#### Scenario: Dependabot state is checked
- **WHEN** GitHub has scanned the remediated dependency graph and credentials and network access are available
- **THEN** the implementation MUST reconcile every Dependabot alert recorded in the remediation baseline with the updated results and document its closure or remaining disposition

#### Scenario: Major build, runtime, or test dependency changes

- **WHEN** a major package update affects build, test, or application integrations
- **THEN** the implementation MUST verify the affected development and production workflows, including the built PWA or Netlify runtime paths where applicable
- **AND** the implementation MUST record the outcome of each focused check and any verification gap

#### Scenario: Verification cannot execute
- **WHEN** a required verification check cannot run because a container, credential, network resource, or external service is unavailable
- **THEN** the implementation MUST identify the unexecuted check and its blocker and MUST NOT report the remediation as fully verified
