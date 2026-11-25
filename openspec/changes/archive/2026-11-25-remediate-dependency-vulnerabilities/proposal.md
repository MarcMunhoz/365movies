## Why

Issue #53 records 67 open Dependabot alerts across 65 advisories and 22 packages. The application dependency graph needs a compatible refresh that also covers actionable findings from a fresh container audit.

## What Changes

- Reconcile Dependabot and local audit findings against every affected dependency path.
- Update runtime, build, and test packages and refresh the Yarn Classic lockfile. Migrate configuration and tooling where required by patched releases.
- Verify the development workflow, production PWA, automated suites, and affected application and Netlify integrations.

## Capabilities

### New Capabilities

### Modified Capabilities

- `dependency-security` ties verification to the current remediation baseline and requires focused regression checks for major upgrades.

## Impact

The work affects `app/package.json`, `app/yarn.lock`, and compatibility changes required by the dependency refresh. The target stack remains Vue 3, Quasar 2, Node 22, and Yarn Classic. Existing application behavior and persisted data formats are in scope for regression verification. Findings without a compatible fix require a documented disposition.

[GitHub issue #53](https://github.com/MarcMunhoz/365movies/issues/53) · [Exploration findings](https://github.com/MarcMunhoz/365movies/issues/53#issuecomment-7172384681)
