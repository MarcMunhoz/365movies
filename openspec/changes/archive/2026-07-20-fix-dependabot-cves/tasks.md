## 1. Dependency Assessment

- [x] 1.1 Query the current open Dependabot alerts and record the alert numbers, packages, vulnerable ranges, patched versions, and manifests.
- [x] 1.2 Inspect dependency paths for `happy-dom`, `js-yaml`, `qs`, `uuid`, and `elliptic` from inside the app package.
- [x] 1.3 Identify which alerts can be fixed by direct dependency upgrades, parent dependency upgrades, lockfile refresh, or targeted Yarn resolutions.
- [x] 1.4 Check whether `elliptic` has a non-vulnerable upgrade, replacement, or parent dependency path despite Dependabot reporting no first patched version.

## 2. Package Updates

- [x] 2.1 Update feasible direct runtime dependencies in `app/package.json`.
- [x] 2.2 Update feasible direct development dependencies in `app/package.json`.
- [x] 2.3 Refresh `app/yarn.lock` with Yarn v1 inside the container context.
- [x] 2.4 Add or adjust `resolutions` only for vulnerable transitive packages that remain after direct and parent upgrades.
- [x] 2.5 Remove obsolete resolutions if the refreshed dependency graph no longer needs them.

## 3. Compatibility Fixes

- [x] 3.1 Fix any TypeScript, Quasar, Vite, Vitest, Cypress, Workbox, or Node compatibility issues caused by package updates.
- [x] 3.2 Update focused tests or test setup only where dependency changes require behavior-compatible adjustments.
- [x] 3.3 Confirm no user-facing application behavior intentionally changes as part of the security remediation.

## 4. Verification

- [x] 4.1 Run package install verification inside the container context.
- [x] 4.2 Run the unit test suite inside the container context.
- [x] 4.3 Run the E2E test suite inside the container context when the environment supports it.
- [x] 4.4 Run the production build inside the container context.
- [x] 4.5 Run available audit or security checks and confirm the update introduces no new known CVEs.
- [x] 4.6 Push the remediation branch and query GitHub Dependabot alerts to confirm the original 8 CVEs are closed or document any remaining unavoidable alert.

## 5. Completion

- [x] 5.1 Review the final diff for unrelated dependency churn or accidental source changes.
- [x] 5.2 Commit the dependency remediation with a detailed commit message following repository rules.
- [x] 5.3 Before opening any PR, confirm the OpenSpec change is archived and synced according to the repository workflow.
