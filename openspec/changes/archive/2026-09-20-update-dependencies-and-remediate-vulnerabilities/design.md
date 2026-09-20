## Context

The application dependency graph is managed with Yarn v1 under `app/package.json` and `app/yarn.lock`, while the application remains on Vue 3, Quasar 2, Vite, and Node 22. GitHub issue #49 tracks the current remediation work.

The current Dependabot snapshot contains 22 open alerts: 12 high, 8 moderate, and 2 low severity. The affected graph includes direct and transitive runtime and development packages. Two advisories affect `image-size` without a first patched version published in Dependabot metadata. Vitest also requires a major-version upgrade to reach a maintained patched release, so this change may require focused test configuration or compatibility updates rather than a lockfile-only refresh.

Dependabot and a local package-manager audit can report different findings because they rely on different advisory sources, update schedules, and dependency-graph interpretation. Both views therefore form the remediation baseline: the known Dependabot snapshot establishes the remote alert set, and a fresh audit inside the project container identifies additional actionable vulnerabilities that may not yet appear on GitHub.

Repository policy requires package-manager commands, audits, tests, and builds to run only inside the container. No host installation or host package-manager execution is part of this change.

## Goals / Non-Goals

**Goals:**

- Remediate all 22 current Dependabot alerts through patched versions, dependency removal or replacement, or explicit residual-risk documentation when no safe remediation exists.
- Include actionable vulnerabilities newly discovered by the container-only local audit in the same dependency remediation cycle.
- Prefer supported direct dependency and parent-package upgrades so vulnerable transitive versions disappear through the normal dependency graph.
- Upgrade Vitest to a maintained patched major and make only the compatibility changes needed to preserve the existing test behavior.
- Determine every path that introduces `image-size` and remove, replace, or upgrade the responsible dependency where feasible; otherwise document the unavoidable risk and exposure.
- Verify application compatibility and compare the final local audit results with the refreshed Dependabot state.

**Non-Goals:**

- Migrate away from Yarn v1, Vue 3, Quasar 2, Vite, or Node 22.
- Upgrade unrelated packages solely to adopt their latest major versions.
- Redesign application features or test architecture beyond changes required for dependency compatibility.
- Suppress, ignore, or close vulnerability alerts without evidence that the resolved graph is safe or that the residual risk has been explicitly assessed.
- Run package-manager, audit, test, or build commands on the host.

## Decisions

### Establish a combined vulnerability baseline

The implementation will record the 22-alert Dependabot snapshot and run a fresh local audit in the container before selecting final versions. Findings will be normalized by package, affected range, dependency path, severity, and available patched version so duplicate advisories can be correlated without being counted as separate remediation work.

The final review will compare the post-remediation container audit with Dependabot after the updated lockfile is pushed. A finding present in only one source remains actionable when its advisory and resolved dependency path apply to this project; disagreement between sources is documented rather than resolved by automatically trusting either source.

Alternative considered: use Dependabot as the only source of truth. This would omit vulnerabilities newly visible to the local audit and would not satisfy the requirement to assess the complete resolved graph before release.

### Upgrade direct dependencies and parent packages before adding resolutions

Direct dependencies and the parent packages that introduce vulnerable transitives will be upgraded first. The lockfile will then be regenerated in the container and the remaining paths reassessed. This follows upstream compatibility ranges, reduces forced combinations, and makes future dependency maintenance less fragile.

Targeted Yarn `resolutions` may be added or retained only when a vulnerable transitive remains after feasible direct or parent upgrades and a compatible safe version is available. Each resolution must correspond to a verified remaining path and must be removed when the parent graph can select a safe version itself.

Alternative considered: add resolutions for all affected transitives immediately. Although faster initially, this can force versions outside upstream-tested ranges and conceal the package that actually needs maintenance.

### Treat the Vitest upgrade as an explicit compatibility boundary

Vitest will move from the current major to a maintained patched major because the vulnerable range cannot be remediated within the existing version line. The upgrade will be isolated conceptually from routine dependency refreshes: release notes and current configuration usage will be reviewed, then only directly affected test configuration, setup, mocks, and tests will be adapted.

Focused Vitest validation will run first in the container. Broader automated checks and the production build will follow because test-tool integrations can share Vite configuration and plugins with the application build.

Alternative considered: pin the newest release in the current Vitest major. This does not cross the patched-version boundary and therefore cannot remediate the reported vulnerability.

### Handle `image-size` advisories through dependency-path elimination or explicit risk acceptance

Both `image-size` advisories currently lack a first patched version in Dependabot metadata. Implementation will trace every resolved path to identify whether the package is used at runtime, build time, or only in development tooling. The preferred outcomes, in order, are to remove unused parents, upgrade or replace the introducing parent package, or move to a verified non-vulnerable release if one becomes available.

A Yarn resolution will not be used merely to select another version that remains inside a vulnerable range. If no safe graph exists, the remaining alert must be documented with affected paths, reachable usage, environment, compensating controls, and a follow-up condition for reassessment. Residual-risk documentation is an exception outcome, not equivalent to remediation.

Alternative considered: leave `image-size` unchanged because Dependabot lists no patch. This would provide no evidence about reachability or available parent-level removal and would leave an unassessed risk.

### Keep all dependency operations and verification inside the container

Dependency installation, lockfile generation, package-manager audit, unit and E2E tests, production build, and any package inspection that executes package-manager scripts will run only in the project container. The host may be used for read-only source and lockfile inspection, Git operations, and GitHub alert queries, but not for package-manager execution.

The verification sequence will avoid redundant gates: focused checks will follow localized compatibility changes, and the full required suite will run once against the final dependency tree unless a later edit can affect a previously passing result.

Alternative considered: use host commands for faster iteration. This violates repository policy and could produce a lockfile or result that differs from the Node and system environment used by the project.

### Follow the repository's owner workflow without an issue-branch pull request

Work for GitHub issue #49 remains on `issue_49` until it is verified and ready for manual integration into `develop`. No pull request is opened from `issue_49` to `develop`; pull requests are reserved for promoting `develop` to `main` under the owner's release workflow.

Alternative considered: open a feature pull request from `issue_49` to `develop`. This does not match the workflow selected by the repository owner and would create an unnecessary review boundary for this personal project.

## Risks / Trade-offs

- The Vitest major upgrade may change mocks, environments, coverage behavior, or Vite integration -> mitigate with release-note review, focused test updates, and container-only unit test execution before broader gates.
- Quasar or other direct upgrades may introduce application compatibility regressions -> mitigate by keeping updates within the existing architecture and running automated tests plus the production build against the final graph.
- Parent upgrades may replace one vulnerable transitive with another advisory -> mitigate by rerunning the local audit after the final lockfile refresh and comparing the result with the original and refreshed Dependabot sets.
- A forced Yarn resolution may violate an upstream package's expected version range -> mitigate by using resolutions only after parent-upgrade attempts, keeping them narrowly targeted, and exercising the affected integration.
- `image-size` may have no currently safe dependency path -> mitigate through reachability analysis, parent removal or replacement where feasible, explicit residual-risk documentation, and a defined follow-up trigger when a patch becomes available.
- Dependabot may not update immediately after the branch is pushed -> mitigate by recording the query time and distinguishing propagation delay from a verified remaining vulnerable path.
- Broad lockfile churn can obscure causality and complicate rollback -> mitigate by reviewing dependency diffs by remediation group and keeping compatibility edits focused on packages whose upgrades require them.

## Migration Plan

1. Record the current 22-alert Dependabot baseline, including affected packages, ranges, severities, patched-version metadata, and dependency paths available from GitHub.
2. Run the initial package-manager audit inside the container and correlate its findings with Dependabot, adding newly discovered actionable vulnerabilities to the working remediation matrix.
3. Trace direct and transitive paths, with separate attention to the Vitest major boundary and both unpatched `image-size` advisories.
4. Upgrade feasible direct dependencies and introducing parent packages inside the container, including the maintained patched Vitest major and any required focused compatibility changes.
5. Regenerate `app/yarn.lock` inside the container and reassess the resolved graph.
6. Add narrowly targeted Yarn resolutions only for remaining vulnerable transitives with verified compatible patched versions.
7. Run focused checks for compatibility changes, followed by the required final install, automated tests, production build, and audit/security checks inside the container.
8. Review the final dependency and audit delta to confirm that no new known vulnerabilities were introduced.
9. Push the remediation branch when authorized, allow Dependabot to refresh, and compare its open alerts with both the original 22-alert baseline and the final local audit. Document any propagation delay or accepted residual risk.
10. Synchronize and archive the OpenSpec change, then hand off `issue_49` for manual integration into `develop` without opening a pull request. Any later release pull request is opened only from `develop` to `main` by the owner.

Rollback is performed by reverting the dependency remediation commit or commits so `app/package.json`, `app/yarn.lock`, and any associated compatibility changes return together to the last verified state. If a partial rollback is necessary, it must preserve consistency between manifest, lockfile, and compatibility code and must be revalidated in the container.

## Open Questions

- Which direct or parent dependencies currently introduce each `image-size` path, and are those paths reachable in production or restricted to build and development tooling?
- Will a patched `image-size` release or an upstream parent release become available before implementation reaches final verification?
- Which Vitest breaking changes affect the current configuration, setup files, mocks, or Quasar/Vite integration?
- Which findings appear only in the fresh local audit, and do their advisory ranges apply to the exact versions selected in `app/yarn.lock`?
- How long will GitHub need to refresh Dependabot state after the remediated lockfile is pushed, and which remaining alerts, if any, require documented follow-up?
