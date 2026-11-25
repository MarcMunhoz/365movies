## 1. Capture the baseline

- [x] 1.1 Capture current Dependabot records for issue #53 and run the baseline Yarn audit covering runtime and development dependencies in the project container. Record alert IDs, advisory IDs, resolved versions, dependency paths, and severity.
- [x] 1.2 Reconcile the audit with Dependabot and verify candidate fixes, parent ranges, and compatibility constraints for every affected path.

## 2. Update the dependency graph

- [x] 2.1 Remediate the critical `proxy-addr` paths through both Express copies and the `shell-quote` path through `concurrently`. Verify application server startup and the combined development command.
- [x] 2.2 Migrate Quasar CLI and Vite together. Update affected extensions and configuration, then verify preparation, the dev server, and the PWA build. Recheck Quasar's Express, SSR error, compression, certificate, and `node-forge` paths.
- [x] 2.3 Update Axios, Vue, and other compatible runtime packages. Recheck affected transitive paths for HTTP redirects, parsing, and Netlify integrations.
- [x] 2.4 Align Vitest and companions, update Happy DOM and Cypress, and refresh remaining transitive packages. Review each remaining Yarn resolution and confirm all affected copies resolve as intended.
- [x] 2.5 Document any advisory without a compatible fix, its remaining exposure, and the evidence supporting the selected disposition.

## 3. Verify compatibility and security

- [ ] 3.1 Verify a frozen install from the final lockfile in Docker. Run the final Yarn audit and compare the resolved graph and findings against the baseline. Record the evidence and any remaining findings.
- [ ] 3.2 Run the production PWA build, Vitest, Cypress E2E, and applicable component checks inside the project container. Verify that the built PWA registers its service worker, handles deep links, and reloads offline after precaching.
- [ ] 3.3 Verify movie discovery, watch planning, yearly challenge, preferences and accessibility, and agenda reminders. Exercise affected Netlify functions and redirects in an isolated context, including the reminder dry run with fixtures and zero outbound email.
- [ ] 3.4 Record the results and blockers for all checks. Verify locally that the updated dependency paths satisfy the advisory ranges captured in the baseline.
