## Why

Dependabot is reporting 8 open security alerts after the application update, including critical and high severity vulnerabilities in development tooling dependencies plus one runtime transitive dependency alert. The project needs a focused dependency remediation pass that upgrades all feasible packages, removes or overrides vulnerable transitive versions, and verifies that the resulting dependency graph does not introduce new known CVEs.

## What Changes

- Updates direct dependencies and devDependencies where feasible within the current Vue 3, Quasar, Vite, Vitest, Cypress, Workbox, and Node 22 stack.
- Refreshes `app/yarn.lock` so vulnerable transitive packages resolve to patched or non-vulnerable versions.
- Adds or updates Yarn `resolutions` only when a vulnerable transitive dependency cannot be fixed by a safe direct dependency upgrade.
- Fixes the currently open Dependabot alerts for `happy-dom`, `js-yaml`, `qs`, `uuid`, and `elliptic` where patches or safe replacement paths are available.
- Verifies application build and automated tests after dependency updates.
- Confirms the final dependency graph has no remaining open Dependabot CVEs caused by the update.

## Capabilities

### New Capabilities

- `dependency-security`: Defines how the application dependency graph is remediated, verified, and kept free of known security advisories after package updates.

### Modified Capabilities

- None.

## Impact

- Affects `app/package.json` and `app/yarn.lock`.
- May affect test tooling, build tooling, Quasar/Vite integration, Cypress execution, and Workbox service worker build behavior through package upgrades.
- Current alert scope from Dependabot:
  - `happy-dom`: `CVE-2025-61927`, `CVE-2026-33943`, `CVE-2026-34226`
  - `js-yaml`: `CVE-2025-64718`, `CVE-2026-53550`
  - `qs`: `CVE-2026-8723`
  - `uuid`: `CVE-2026-41907`
  - `elliptic`: `CVE-2025-14505`
- Requires container-only package manager and build/test verification according to repository rules.
- Requires checking the GitHub Dependabot alert state after remediation when network credentials are available.
