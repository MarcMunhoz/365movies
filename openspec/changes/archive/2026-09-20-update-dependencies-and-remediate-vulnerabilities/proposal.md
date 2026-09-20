## Why

GitHub issue #49 tracks 22 open Dependabot alerts across direct and transitive npm dependencies, including 12 high-severity findings and two `image-size` advisories without published patched versions. The dependency graph also needs a fresh container-only local audit so vulnerabilities absent from Dependabot are discovered and remediated before the next release.

## What Changes

- Update feasible direct runtime and development dependencies while preserving Vue 3, Quasar 2, Vite, Yarn Classic, and Node 22.
- Upgrade Vitest to a maintained patched release and adapt test configuration or tests where compatibility requires it.
- Refresh `app/yarn.lock` and remediate vulnerable transitive packages through direct or parent upgrades before using targeted Yarn resolutions.
- Trace the `image-size` dependency path and remove, replace, upgrade, or explicitly justify any advisory that has no published patched version.
- Run a fresh local audit inside the project container and include any newly discovered actionable vulnerabilities in the remediation scope.
- Verify the updated graph with container-only installation, automated tests, production build, audit checks, and a final Dependabot review.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `dependency-security`: Extend dependency remediation and verification requirements to cover the current Dependabot alert set, fresh local-audit findings, major test-tool upgrades, and explicit handling of advisories without patched releases.

## Impact

- Primarily affects `app/package.json` and `app/yarn.lock`.
- May require focused compatibility changes in Vitest configuration, test setup, Quasar integration, Vite configuration, or other tooling affected by package upgrades.
- Changes the resolved versions of direct and transitive runtime and development dependencies.
- Requires package-manager commands, tests, builds, and audits to run only in the project container.
- Requires GitHub issue #49 and Dependabot alert state to be reviewed before completion.
