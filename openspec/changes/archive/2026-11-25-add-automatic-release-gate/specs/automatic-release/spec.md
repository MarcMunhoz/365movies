## ADDED Requirements

### Requirement: Production release validation

The quality gate SHALL accept production pull requests from the same repository's develop branch and verify the expected version and the existing build, unit and end-to-end checks in Docker.

#### Scenario: Calculate the required version from the PR commits

- **WHEN** a production pull request contains Conventional Commits
- **THEN** the gate SHALL apply the highest required bump to the base version, using major for breaking changes, minor for feat and patch for fix, perf and chore(dependencies)
- **AND** commits outside those rules SHALL leave the version unchanged
- **AND** a required bump SHALL have matching package, Docker and changelog metadata

#### Scenario: Quality check fails

- **WHEN** version validation, the build or either test suite fails
- **THEN** the quality workflow SHALL report failure

### Requirement: Publish a GitHub release from main

The publication workflow SHALL create a vX.Y.Z tag on the pushed main commit and publish a GitHub Release with generated notes when the version increases.

#### Scenario: Merge without a version increase

- **WHEN** a push to main leaves the version unchanged
- **THEN** the workflow SHALL skip all publication writes

#### Scenario: Retry a versioned push

- **WHEN** the expected tag already points at the pushed commit
- **THEN** the workflow SHALL publish a missing release or succeed if it already exists

#### Scenario: Conflicting tag

- **WHEN** the expected tag already points at another commit
- **THEN** the workflow SHALL fail and preserve the original tag
