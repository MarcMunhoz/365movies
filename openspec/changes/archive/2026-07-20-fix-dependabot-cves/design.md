## Context

The application uses Yarn v1 with dependencies under `app/package.json` and `app/yarn.lock`. The current Dependabot alert set points to vulnerable packages resolved through the lockfile, mostly in development tooling: `happy-dom`, `js-yaml`, `qs`, `uuid`, and `elliptic`.

Repository rules require package-manager, build, and test commands to run inside the container context. The project also uses package `resolutions` for known vulnerable transitive dependencies, so dependency remediation can combine direct package upgrades with targeted transitive overrides when the upstream tree does not yet resolve a safe version.

## Goals / Non-Goals

**Goals:**

- Remove all currently open Dependabot CVEs that can be fixed through safe package upgrades, lockfile refreshes, or targeted Yarn resolutions.
- Upgrade all feasible direct dependencies and development dependencies without changing the application architecture or user-facing behavior.
- Preserve the current Vue 3, Quasar 2, Vite, Vitest, Cypress, Workbox, Yarn v1, and Node 22 tooling model.
- Verify the resulting dependency graph with automated tests, production build, and security/audit checks available to the repository.

**Non-Goals:**

- Migrate from Yarn v1 to another package manager.
- Migrate the app from Quasar/Vite to another frontend framework or build system.
- Rewrite runtime middleware, serverless deployment, or test architecture beyond what is necessary for compatibility with updated packages.
- Silence Dependabot alerts without actually moving the dependency graph to a non-vulnerable state.

## Decisions

### Prefer direct dependency upgrades before resolutions

Direct dependencies and devDependencies will be updated first because that lets upstream packages select compatible transitive versions and reduces long-term maintenance burden. A Yarn `resolution` will be added or retained only when the vulnerable package is transitive and no feasible direct upgrade removes it.

Alternative considered: add `resolutions` for every advisory immediately. This is faster but can force dependency versions outside upstream-tested ranges and makes future maintenance harder.

### Keep remediation scoped to the current stack

Package updates should stay within the current major architecture unless a security fix requires a breaking major upgrade. If a major upgrade is required, the implementation must include compatibility fixes and focused regression coverage.

Alternative considered: upgrade every package to latest major regardless of impact. That increases regression risk and can mix unrelated migrations into a security remediation change.

### Treat unavailable patches explicitly

If an advisory has no patched version in Dependabot metadata, implementation must inspect available package versions and dependency paths. The fix may be a parent package upgrade, a safe package replacement, a transitive resolution to a non-vulnerable version when one exists, or documented residual risk if no fixed version is available.

Alternative considered: leave no-patch advisories untouched. That would fail the remediation goal and leave runtime risk unresolved for packages such as `elliptic`.

### Verify with both local commands and GitHub alert state

Local verification catches application breakage, while Dependabot confirms whether GitHub still sees vulnerable dependency paths. The final implementation must report both command results and the Dependabot alert state when GitHub access is available.

Alternative considered: rely only on `yarn audit`. Yarn audit and Dependabot can disagree because of ecosystem metadata timing, lockfile parsing, and advisory source differences.

## Risks / Trade-offs

- Dependency major upgrades break Quasar, Vite, Vitest, Cypress, or Workbox integration -> mitigate by running unit tests, E2E tests where feasible, and production build inside the container.
- Forced `resolutions` create incompatible transitive combinations -> mitigate by preferring parent upgrades and keeping any resolution specific to the minimum safe patched version.
- New vulnerabilities appear after broad upgrades -> mitigate by checking Dependabot and audit output after lockfile refresh.
- A package has no patched release -> mitigate by tracing dependency paths, upgrading or replacing the parent package where possible, and documenting any remaining unavoidable alert before merge.

## Migration Plan

1. Inspect current dependency paths for each vulnerable package.
2. Upgrade feasible direct dependencies and devDependencies inside the container.
3. Refresh `app/yarn.lock`.
4. Add targeted `resolutions` only for remaining vulnerable transitive packages that have a safe version path.
5. Run install, tests, build, and security checks inside the container.
6. Query Dependabot alerts after pushing the branch to confirm the CVE state.

Rollback is a normal Git revert of the dependency remediation commit if package compatibility issues are discovered after merge.

## Open Questions

- Whether `elliptic` has a safe upstream resolution path by the time implementation starts, since Dependabot currently reports no first patched version.
- Whether any major version upgrades require small source compatibility changes in Quasar, Vite, Vitest, Cypress, or Workbox configuration.
