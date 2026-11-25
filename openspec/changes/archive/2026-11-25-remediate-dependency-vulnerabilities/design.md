## Context

The issue #53 snapshot contains 2 critical, 30 high, 25 medium, and 10 low Dependabot alerts. The local audit baseline and the compatibility of candidate package combinations remain to be verified in the project container.

## Goals / Non-Goals

Resolve known vulnerabilities across runtime and development dependencies. Update supported packages while preserving the application stack, its behavior, and its persisted data. Limit source and configuration changes to the compatibility work needed for those upgrades.

## Decisions

- Record the initial Dependabot and Yarn audit findings by advisory, resolved version, and parent path. Preserve individual alert IDs when one package update clears multiple alerts.
- Prioritize both Express paths to `proxy-addr` and the `concurrently` path to `shell-quote`. Prefer compatible parent upgrades and lockfile refreshes. Use a targeted Yarn resolution only when necessary and verify it against every affected parent.
- Treat the Quasar CLI v3 and Vite migration as one compatibility batch. Review Node engine requirements, Vue plugin and Vitest peers, Quasar testing extensions, and current Vite and esbuild resolutions. Recheck Quasar's Express, certificate and SSR error dependencies. Verify the `ssl-certificate → selfsigned → node-forge` path and document the disposition of alert #169 separately.
- Refresh Axios and its redirect dependency, the Vue runtime and compiler packages, and remaining direct runtime dependencies in compatible batches. Align Vitest and its companion packages, verify the Happy DOM major upgrade, and refresh Cypress with its affected transitive dependencies. Reassess remaining overrides and inspect all versions of packages with several locked major lines, including `minimatch`.
- Verify the final graph from a frozen install. Run the tests and PWA build in Docker. Serve the production PWA to verify routing and offline behavior. Exercise affected Netlify paths in an isolated context with fixtures, including a reminder dry run with zero outbound email.

## Risks / Trade-offs

Major upgrades can change plugin APIs, build output, or DOM behavior. Test each affected batch before combining it with unrelated updates where the dependency graph permits. If a batch cannot meet its compatibility checks, revert that batch's manifest, lockfile, and coupled configuration changes together and evaluate a compatible alternative. Record findings that remain open and the evidence required to resolve them.

The existing production Docker stage expects `dist/spa` while the PWA build produces `dist/pwa`. Record this baseline discrepancy when evaluating production packaging so upgrade-related regressions can be identified separately.
