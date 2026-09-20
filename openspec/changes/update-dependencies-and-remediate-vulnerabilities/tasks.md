## 1. Establish the Vulnerability Baseline

- [x] 1.1 Confirm explicit authorization before any dependency installation, image build, or other operation that installs packages.
- [x] 1.2 Prepare the project container without running package-manager commands on the host.
- [x] 1.3 Record the 22-alert Dependabot baseline with package, severity, affected range, patched version, manifest, scope, and dependency relationship.
- [x] 1.4 Run the initial Yarn audit inside the container and add every applicable finding that is absent from Dependabot to the remediation matrix.
- [x] 1.5 Trace all resolved dependency paths for affected direct and transitive packages, with explicit reachability analysis for both `image-size` advisories.

## 2. Update Direct Dependencies and Parent Packages

- [x] 2.1 Select patched direct dependency versions that preserve Vue 3, Quasar 2, Vite, Yarn v1, and Node 22.
- [x] 2.2 Upgrade Quasar, PostCSS, Vitest, and other affected direct dependencies inside the container.
- [x] 2.3 Upgrade or replace parent packages that introduce vulnerable transitive dependencies, prioritizing normal dependency resolution over Yarn resolutions.
- [x] 2.4 Regenerate `app/yarn.lock` inside the container and verify the selected direct and transitive versions.
- [x] 2.5 Add or update narrowly targeted Yarn resolutions only for vulnerable transitives that remain and have a verified compatible patched version.
- [x] 2.6 Remove obsolete resolutions that are no longer needed after the parent and direct dependency upgrades.

## 3. Resolve Compatibility and Unpatched Advisories

- [x] 3.1 Review Vitest breaking changes between the current release and the selected maintained patched major.
- [x] 3.2 Apply the minimum required configuration, setup, mock, or test compatibility changes for the Vitest upgrade.
- [x] 3.3 Run focused Vitest checks inside the container and resolve regressions attributable to the upgrade.
- [x] 3.4 Remove, replace, or upgrade every parent path that introduces vulnerable `image-size` versions when a safe graph is available.
- [x] 3.5 If an `image-size` path or another no-patch advisory cannot be removed, document its reachability, exposure, compensating controls, residual risk, and reassessment trigger.

## 4. Verify the Final Dependency Graph

- [x] 4.1 Verify the final package installation and resolved dependency graph inside the container.
- [x] 4.2 Run the unit test suite inside the container.
- [x] 4.3 Run the E2E and component test suites inside the container when supported by the prepared environment, documenting any external blocker without claiming full verification.
- [x] 4.4 Run the production build inside the container.
- [x] 4.5 Run the final Yarn audit inside the container and compare it with the baseline to confirm no new known vulnerability was introduced.
- [x] 4.6 Review the final diff for unrelated dependency churn, unintended source changes, and consistency between `app/package.json`, `app/yarn.lock`, and compatibility edits.

## 5. Confirm Remote Security State and Complete the Change

- [ ] 5.1 Commit the remediation in detailed, logically separated English commits that follow the repository rules and reference issue #49.
- [ ] 5.2 Push branch `issue_49` only after explicit authorization and allow GitHub to refresh its dependency graph.
- [ ] 5.3 Query Dependabot via `gh` and confirm that the original 22 alerts are closed or document each remaining alert and its disposition.
- [ ] 5.4 Update issue #49 with the verified test, build, audit, and Dependabot outcomes.
- [ ] 5.5 Synchronize the dependency-security delta spec and archive the OpenSpec change before handing the branch off for integration.
- [ ] 5.6 Hand off `issue_49` for manual integration into `develop` without opening a pull request; reserve pull requests for the owner's `develop` to `main` release flow.
