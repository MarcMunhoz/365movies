## MODIFIED Requirements

### Requirement: Vulnerable dependency remediation
The application dependency graph SHALL resolve every actionable vulnerability identified by the current Dependabot alerts and the current local audit to patched, non-vulnerable, replaced, or explicitly justified versions.

#### Scenario: Patched version is available
- **WHEN** a vulnerable package reported by Dependabot or the local audit has a patched version available through a direct dependency upgrade, parent dependency upgrade, or safe lockfile refresh
- **THEN** the implementation MUST update the dependency graph so the vulnerable version is no longer selected

#### Scenario: Vulnerability has no patched version
- **WHEN** a Dependabot advisory or local audit finding reports no patched version for a vulnerable package
- **THEN** the implementation MUST inspect every resolved dependency path and either remove the vulnerable package, replace or upgrade the parent package, use a verified non-vulnerable release if one exists, or document why the remaining risk is unavoidable and how it is mitigated

#### Scenario: Local audit discovers additional vulnerabilities
- **WHEN** the current local audit identifies an actionable vulnerability that is not present in the current Dependabot alert set
- **THEN** the implementation MUST include that vulnerability in the same remediation scope and resolve or explicitly justify it under the same criteria

### Requirement: Dependency updates remain compatible
The dependency remediation SHALL preserve the current application stack and user-facing behavior unless a security fix requires a compatibility change that is implemented and verified as part of the remediation.

#### Scenario: Direct packages are updated
- **WHEN** dependencies or devDependencies are upgraded
- **THEN** the application MUST continue to build and run using Vue 3, Quasar 2, Vite, Yarn v1, and Node 22

#### Scenario: Major package upgrade is necessary
- **WHEN** a required security fix forces a major package upgrade, including an upgrade of the test tooling
- **THEN** the implementation MUST include and verify any source, configuration, integration, or test updates needed to keep existing behavior and supported workflows working

#### Scenario: Compatibility regression is found
- **WHEN** automated verification or focused compatibility checks reveal a regression caused by an updated dependency
- **THEN** the implementation MUST resolve the regression or document why the dependency update cannot safely proceed before the remediation is considered complete

### Requirement: Targeted transitive overrides
The project SHALL use Yarn resolutions for security remediation only when a safe direct or parent dependency upgrade is not sufficient to remove a vulnerable transitive version identified by Dependabot or the local audit.

#### Scenario: Resolution is required
- **WHEN** a vulnerable transitive dependency remains after feasible direct and parent upgrades
- **THEN** the implementation MUST add or update a targeted Yarn resolution to select a safe and compatible version when one is available

#### Scenario: Resolution is unnecessary
- **WHEN** direct or parent package upgrades remove the vulnerable transitive version
- **THEN** the implementation MUST avoid adding an unnecessary Yarn resolution for that advisory or audit finding

#### Scenario: Safe resolution is unavailable
- **WHEN** no safe and compatible resolution exists for a vulnerable transitive dependency
- **THEN** the implementation MUST treat the finding as an advisory without a patched version and document the selected removal, replacement, mitigation, or risk-acceptance outcome

### Requirement: Security verification
The remediation SHALL be verified against the current local dependency graph, automated checks, and known advisory state before it is considered complete.

#### Scenario: Baseline local audit runs
- **WHEN** remediation work begins
- **THEN** an audit of the currently resolved dependency graph MUST run in the project container and its actionable findings MUST be recorded in the remediation scope

#### Scenario: Local verification runs
- **WHEN** dependency remediation is complete locally
- **THEN** package installation, relevant automated tests, production build, and available audit and security checks MUST run successfully in the project container context

#### Scenario: Dependabot state is checked
- **WHEN** GitHub credentials and network access are available after the remediated lockfile is pushed
- **THEN** the implementation MUST query the open Dependabot alerts associated with GitHub issue #49 and confirm whether each alert in the original set is closed or document every remaining alert and its disposition

#### Scenario: Verification cannot execute
- **WHEN** a required verification check cannot run because a container, credential, network resource, or external service is unavailable
- **THEN** the implementation MUST identify the unexecuted check and its blocker and MUST NOT report the remediation as fully verified

### Requirement: No new known CVEs
The dependency remediation SHALL NOT introduce new known vulnerable packages into the resolved dependency graph according to the final local audit and Dependabot review.

#### Scenario: Dependency graph is refreshed
- **WHEN** `app/yarn.lock` is updated
- **THEN** the final container-based audit and available Dependabot results MUST be reviewed to ensure no new known CVEs were introduced by the update

#### Scenario: New vulnerability appears after refresh
- **WHEN** the final audit or Dependabot review reports a vulnerability that was absent from the baseline findings
- **THEN** the implementation MUST remediate or explicitly justify the new finding before the dependency update is considered complete
