## Purpose

Define dependency security requirements for package updates, vulnerability remediation, lockfile maintenance, and verification of the application dependency graph.

## Requirements

### Requirement: Vulnerable dependency remediation
The application dependency graph SHALL resolve the packages identified by current Dependabot alerts to patched, non-vulnerable, replaced, or explicitly justified versions.

#### Scenario: Patched version is available
- **WHEN** a vulnerable package has a patched version available through a direct dependency upgrade, parent dependency upgrade, or safe lockfile refresh
- **THEN** the implementation MUST update the dependency graph so the vulnerable version is no longer selected

#### Scenario: Vulnerability has no patched version
- **WHEN** a Dependabot advisory reports no first patched version for a vulnerable package
- **THEN** the implementation MUST inspect dependency paths and either remove the vulnerable package, replace the parent package, upgrade to a non-vulnerable release if one exists, or document the remaining unavoidable risk

### Requirement: Dependency updates remain compatible
The dependency remediation SHALL preserve the current application stack and user-facing behavior unless a security fix requires a compatibility change.

#### Scenario: Direct packages are updated
- **WHEN** dependencies or devDependencies are upgraded
- **THEN** the application MUST continue to build and run using Vue 3, Quasar 2, Vite, Yarn v1, and Node 22

#### Scenario: Major package upgrade is necessary
- **WHEN** a required security fix forces a major package upgrade
- **THEN** the implementation MUST include any source, configuration, or test updates needed to keep existing behavior working

### Requirement: Targeted transitive overrides
The project SHALL use Yarn resolutions for security remediation only when a safe direct or parent dependency upgrade is not sufficient.

#### Scenario: Resolution is required
- **WHEN** a vulnerable transitive dependency remains after feasible direct and parent upgrades
- **THEN** the implementation MUST add or update a targeted Yarn resolution to select a safe version when one is available

#### Scenario: Resolution is unnecessary
- **WHEN** direct or parent package upgrades remove the vulnerable transitive version
- **THEN** the implementation MUST avoid adding an unnecessary Yarn resolution for that advisory

### Requirement: Security verification
The remediation SHALL be verified against automated checks and known advisory state before it is considered complete.

#### Scenario: Local verification runs
- **WHEN** dependency remediation is complete locally
- **THEN** package install, automated tests, production build, and available audit/security checks MUST run in the container context

#### Scenario: Dependabot state is checked
- **WHEN** GitHub credentials and network access are available after the remediated lockfile is pushed
- **THEN** the implementation MUST query open Dependabot alerts and confirm whether the original 8 CVEs are closed or document any remaining alerts

### Requirement: No new known CVEs
The dependency remediation SHALL NOT introduce new known vulnerable packages into the resolved dependency graph.

#### Scenario: Dependency graph is refreshed
- **WHEN** `app/yarn.lock` is updated
- **THEN** audit or Dependabot results MUST be reviewed to ensure no new known CVEs were introduced by the update
