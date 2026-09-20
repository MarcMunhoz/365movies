# Dependency Security Baseline

Captured for GitHub issue #49 before dependency updates. Package-manager commands ran in the isolated project container with Node 22.22.3 and Yarn 1.22.22; no environment file was loaded.

## Dependabot

Dependabot reported 22 open npm alerts: 12 high, 8 medium, and 2 low; 15 development and 7 runtime; 4 direct and 18 transitive.

| Alert | Package | Severity | Advisory | Vulnerable range | First patch | Scope | Relationship |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 156 | js-yaml | high | CVE-2026-84375 / GHSA-2883-xcg3-v3hh | `>=4.0.0 <4.3.2` | 4.3.2 | development | transitive |
| 155 | vitest | medium | CVE-2026-84373 / GHSA-82fw-gwwq-j7x9 | `>=2.1.0 <4.1.11` | 4.1.11 | development | direct |
| 154 | baseline-browser-mapping | medium | CVE-2026-45819 / GHSA-w5vr-8v7q-w6rv | `>=2.0.0 <2.11.0` | 2.11.0 | development | transitive |
| 153 | vitest | medium | CVE-2026-84373 / GHSA-82fw-gwwq-j7x9 | `>=2.1.0 <4.1.11` | 4.1.11 | development | direct |
| 152 | @vitest/mocker | medium | CVE-2026-84373 / GHSA-82fw-gwwq-j7x9 | `>=2.1.0 <4.1.11` | 4.1.11 | development | transitive |
| 151 | qs | medium | CVE-2026-82417 / GHSA-4mjr-xmp4-gh2g | `>=2.2.5 <6.16.0` | 6.16.0 | runtime | transitive |
| 150 | joi | low | CVE-2026-84368 / GHSA-6w3j-5fw6-r9vr | `>=18.0.0 <18.2.5` | 18.2.5 | development | transitive |
| 149 | joi | low | CVE-2026-84367 / GHSA-gg4h-3hg2-grpc | `>=18.0.0 <18.2.4` | 18.2.4 | development | transitive |
| 148 | browserslist | high | CVE-2026-73088 / GHSA-73wf-gq98-2v4g | `<=4.28.6` | 4.28.7 | development | transitive |
| 146 | fast-uri | high | CVE-2026-76172 / GHSA-jqff-g426-hqxp | `>=3.0.0 <3.1.6` | 3.1.6 | development | transitive |
| 145 | fast-uri | high | CVE-2026-75975 / GHSA-f65p-4m7j-42xc | `>=3.0.0 <3.1.6` | 3.1.6 | development | transitive |
| 144 | qs | medium | CVE-2026-82562 / GHSA-x5fp-wj9c-mxmx | `>=6.14.2 <=6.15.3` | 6.16.0 | runtime | transitive |
| 143 | fast-uri | high | CVE-2026-75931 / GHSA-5jgf-p345-68v8 | `>=3.1.3 <3.1.6` | 3.1.6 | development | transitive |
| 142 | fast-uri | high | CVE-2026-75899 / GHSA-fph4-wmhf-6fwf | `>=3.1.2 <3.1.6` | 3.1.6 | development | transitive |
| 141 | nanoid | high | CVE-2026-67213 / GHSA-2v37-7h3g-55p8 | `<3.3.18` | 3.3.18 | runtime | transitive |
| 140 | postcss | medium | CVE-2026-69153 / GHSA-fxqj-rqcc-2cmp | `<=8.5.22` | 8.5.23 | runtime | direct |
| 137 | js-yaml | high | GHSA-5p4m-2wfm-xmqj | `>=4.0.0 <4.3.1` | 4.3.1 | development | transitive |
| 136 | image-size | high | CVE-2025-71329 / GHSA-5p2g-fcmc-qvqq | `<=2.0.2` | none | runtime | transitive |
| 135 | image-size | high | CVE-2025-71330 / GHSA-w3rx-r6r6-pgpr | `<=2.0.2` | none | runtime | transitive |
| 134 | fast-uri | high | CVE-2026-18446 / GHSA-7p8r-x3mc-p8w7 | `>=3.0.0 <3.1.5` | 3.1.5 | development | transitive |
| 132 | postcss | high | CVE-2026-73646 / GHSA-r28c-9q8g-f849 | `<=8.5.17` | 8.5.18 | development | transitive |
| 130 | quasar | medium | CVE-2026-73647 / GHSA-3r53-75j5-3g7j | `<=2.21.4` | 2.22.0 | runtime | direct |

Every alert points to `app/package.json` or `app/yarn.lock`.

## Initial Yarn Audit

The initial container audit exited with Yarn status 14 and found 24 unique advisories across 1,191 resolved dependencies. Path occurrences totaled 45 high, 20 moderate, 2 low, and 0 critical.

Four actionable advisories were present in the local audit but absent from the 22-alert Dependabot snapshot:

| Package | Severity | Advisory | Resolved | Patched |
| --- | --- | --- | --- | --- |
| brace-expansion | high | CVE-2026-14257 / GHSA-mh99-v99m-4gvg | 5.0.7 | 5.0.8 |
| brace-expansion | high | CVE-2026-69152 / GHSA-rgw5-rvv9-x895 | 5.0.7 | 5.0.9 |
| nanoid | high | CVE-2026-67214 / GHSA-28wg-ghj8-5hjv | 3.3.12 | 3.3.16 |
| browserslist | high | CVE-2026-73089 / GHSA-c83g-rgw3-j3cx | 4.28.2 and 4.28.6 | 4.28.7 |

The stricter effective targets are therefore `brace-expansion >=5.0.9`, `nanoid >=3.3.18`, and `browserslist >=4.28.7`. All other unique local advisories correlate with the Dependabot set.

## Initial Remediation Boundaries

| Vulnerable package | Resolved path roots | Preferred remediation |
| --- | --- | --- |
| brace-expansion 5.0.7 | `workbox-build`; `@quasar/app-vite`; `@vue/test-utils`; Quasar Cypress extension | Upgrade direct parents first; resolution only for compatible copies that remain |
| js-yaml 4.3.0 | Quasar Cypress extension through coverage and NYC configuration | Upgrade the extension; use a targeted resolution only if the parent remains blocked |
| qs 6.15.3 | direct `express` through `qs` and `body-parser`; Cypress request tooling | Upgrade Express and Cypress parents before considering a resolution |
| vitest / @vitest/mocker 3.2.7 | direct `vitest` | Upgrade Vitest as a unit to at least 4.1.11 |
| postcss 8.5.15–8.5.20 | direct `postcss`; Vite; Vitest; Tailwind | Upgrade direct PostCSS and its parents; resolve remaining compatible copies only if necessary |
| fast-uri 3.1.4 | `workbox-build > ajv` | Upgrade Workbox/Ajv through the parent path; resolution fallback |
| nanoid 3.3.12–3.3.16 | PostCSS copies under Vite, Vitest, and Tailwind | Upgrade the PostCSS parent paths to resolve at least 3.3.18 |
| quasar 2.21.4 | direct `quasar` | Upgrade directly to at least 2.22.0 |
| browserslist 4.28.2–4.28.6 | Workbox/Babel and direct Autoprefixer paths | Upgrade Autoprefixer, Workbox, and their parents to at least 4.28.7 |
| joi 18.2.3 | Quasar Cypress extension through `start-server-and-test > wait-on` | Upgrade the testing extension or its parent path to at least 18.2.5 |
| baseline-browser-mapping 2.10.37–2.10.44 | Browserslist under Workbox/Babel and Autoprefixer | Upgrade Browserslist parent paths to at least 2.11.0 |
| image-size 2.0.2 | direct `@netlify/blobs > @netlify/dev-utils` | Upgrade or replace the parent; do not force another vulnerable `image-size` release |

The two `image-size` advisories need special treatment. The application imports `getStore` from the root `@netlify/blobs` export in its reminder functions. That root export does not load `@netlify/dev-utils`; the vulnerable package is loaded by the separate `@netlify/blobs/server` subpath, which the current source does not import. The vulnerable code is therefore present in the production dependency graph but has no evidenced execution path in the current application flow. Parent-level removal remains required when feasible; this reduced reachability is not treated as remediation.

## Group 2 Resolution

The direct and parent upgrade pass selected the following compatibility set:

| Package | Selected version |
| --- | --- |
| @netlify/blobs | 11.1.0 |
| @quasar/app-vite | 2.4.0 |
| @quasar/quasar-app-extension-testing-unit-vitest | 2.0.0 |
| @vitejs/plugin-vue | 6.0.9 |
| @vitest/ui | 4.1.11 |
| @vue/test-utils | 2.5.1 |
| autoprefixer | 10.6.1 |
| express | 4.22.3 |
| postcss | 8.5.28 |
| quasar | 2.33.0 |
| vite | 7.3.6 |
| vitest | 4.1.11 |
| workbox-build and Workbox runtime modules | 7.4.1 |

`@netlify/blobs@11.1.0` upgrades `@netlify/dev-utils` to 6.0.1, whose dependency graph no longer contains `image-size`, eliminating both no-patch advisories structurally.

Yarn Classic produced a reproducible linker invariant when `@quasar/app-vite@2.4.0` and `vitest@4.1.11` supplied compatible but differently expressed Vite ranges. A minimal container reproduction failed without an override and passed with `vite` fixed to 7.3.6, so the exact Vite resolution is retained as a package-manager compatibility constraint.

After parent upgrades, the first regenerated graph still selected vulnerable transitive copies. Targeted resolutions were therefore added for `js-yaml`, `postcss`, `fast-uri`, `nanoid`, `browserslist`, `baseline-browser-mapping`, `qs`, and `joi`. `brace-expansion` is constrained only below the Workbox and Quasar Cypress paths that resolve the vulnerable 5.x line, leaving consumers of the unaffected 1.x and 2.x lines on their declared majors. The obsolete OpenTelemetry override was removed so Netlify's exact 2.10.0 dependencies resolve consistently. Existing resolutions protecting other earlier advisories remain in place; the incompatible `uuid` range warning is accepted temporarily because removing the override would reintroduce the prior UUID advisory.

The reviewed graph resolves `@opentelemetry/core@2.10.0`, keeps unaffected `brace-expansion@1.1.21` and `2.1.7` consumers on their declared majors, and selects `brace-expansion@5.0.12` for the vulnerable 5.x paths. The resulting container audit completed with exit status 0 and reported zero advisories across 1,165 resolved dependencies. This is the Group 2 dependency-graph check, not the final compatibility and release verification required by Groups 3 and 4.

## Group 3 Compatibility Review

The [Vitest 4 migration guide](https://vitest.dev/guide/migration.html#migrating-to-vitest-4-0) was reviewed against the project configuration and test sources. The project already meets the Vitest 4 prerequisites with Node 22 and Vite 7. It does not use the removed pool, dependency-inlining, environment-glob, reporter, browser-mode, or deprecated entry-point APIs. Coverage is not configured through Vitest, and the explicit test `include` patterns prevent the broader Vitest 4 default discovery rules from collecting Cypress or generated files.

The existing mocks use supported `vi.mock`, `vi.fn`, `vi.spyOn`, environment stubs, and fake timers. No snapshot depends on the changed default mock name, and no test relies on `vi.restoreAllMocks` resetting automocks. Consequently, the minimum compatible change is to keep the current Vitest configuration, setup file, mocks, and tests unchanged.

A focused container run used Vitest 4.1.11 on Node 22.22.3 and exercised Vue/Quasar component mounting, module mocks, spies, fake timers, environment stubs, and Netlify function mocks. All four selected files and all ten tests passed. The complete unit suite remains reserved for the Group 4 final verification gate.

The final lockfile contains `@netlify/blobs@11.1.0` and `@netlify/dev-utils@6.0.1` but no `image-size` package, so both unpatched `image-size` advisories are removed through the parent upgrade. The remaining `buffer-image-size` entry is a distinct package and is not affected by those advisories. No no-patch advisory remains in the resolved graph; residual-risk acceptance and compensating controls are therefore not applicable. Reassessment is required if a later dependency change reintroduces `image-size` or a new advisory affects the selected graph.

## Group 4 Final Local Verification

All executable verification gates ran inside the prepared container with the real environment file masked. No package installation or download was performed during these checks.

| Gate | Result |
| --- | --- |
| Installation and graph | `yarn check --integrity` passed; the expected Quasar, Vite, Vitest, Netlify, OpenTelemetry, and `brace-expansion` versions were resolved; `image-size` was absent |
| Unit tests | 15 files and 45 tests passed |
| E2E tests | 4 specs and 18 tests passed in Cypress 15.18.1 with headless Electron |
| Component tests | Command executed, but no files match the configured `src/**/*.cy.{js,jsx,ts,tsx}` pattern, so no component suite is available |
| Production build | Quasar PWA application and Workbox service worker compiled successfully |
| Final audit | Exit status 0, with zero critical, high, moderate, low, or informational advisories across 1,165 dependencies |

Cypress emitted a non-blocking deprecation warning that the Quasar integration enables `allowCypressEnv`; the option is scheduled for removal in a future Cypress major. The warning did not affect the E2E result and does not represent an advisory in the final package audit.

The final diff is limited to `app/package.json`, `app/yarn.lock`, and the OpenSpec change artifacts. No application, test, or configuration source file changed. The lockfile resolves the direct versions and targeted overrides declared by the manifest, and its broader churn corresponds to the parent upgrades and vulnerability removals documented above. The known `uuid@11.1.1` resolution range warning remains documented as a protective compatibility trade-off against reintroducing the earlier UUID advisory.
