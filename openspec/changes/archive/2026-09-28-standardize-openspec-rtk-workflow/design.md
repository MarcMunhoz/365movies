## Context

The repository currently exposes a minimal root `AGENTS.md` that delegates to two loose `.agents/*.md` files. Its five OpenSpec skills are stored in the legacy `.codex/skills/` location, root `RTK.md` is absent, and `openspec/config.yaml` contains only generated examples. The current archive skill also permits skipping synchronization even though the required project lifecycle makes synchronization mandatory.

The migration must remain repository-relative and must preserve the existing application, dependencies, main specs, and archive history. See `proposal.md` for motivation and `specs/agent-workflow/spec.md` for observable requirements.

## Goals / Non-Goals

**Goals:**

- Establish two concise, discoverable root entry points for agent and RTK guidance.
- Make `.agents/skills/` the single repository-local home for all five OpenSpec skills.
- Give OpenSpec verified project context and focused artifact rules.
- Make synchronization a mandatory precondition for archiving changes with delta specs.
- Keep every reference portable and repository-relative.

**Non-Goals:**

- Change application source, runtime behavior, dependencies, package manifests, or lockfiles.
- Rewrite existing main specifications or archived changes.
- Introduce new tooling, packages, schema types, or external services.
- Expand repository guidance with machine-global behavioral preferences that do not belong to this project.

## Decisions

### Keep the root entry point free of project-local rules

`AGENTS.md` will remain a concise discovery entry point that references `@RTK.md` and points to the canonical repository-local locations without duplicating project rules. Applicable project context and artifact guidance from the loose files will be represented in `openspec/config.yaml`, after which the two loose rule files will be removed.

This keeps behavioral guidance in its proper scope while preserving discoverability. The alternatives of embedding project rules in `AGENTS.md` or retaining loose copies were rejected because both create competing sources of truth.

### Keep RTK policy repository-local and focused

Root `RTK.md` will define how repository shell commands use RTK, including the raw proxy escape hatch when filtered output is unsuitable. `AGENTS.md` will reference it by relative path instead of depending on a user-home file.

Copying machine-specific paths or unrelated global settings was rejected because repository guidance must work in other checkouts and environments.

### Move skills without semantic rewrites except for the required archive rule

The five skill directories will move from `.codex/skills/` to `.agents/skills/` with names and general behavior preserved. The archive skill will be intentionally updated so unsynchronized delta specs block archive and no skip option is presented. Existing sync comparison remains useful to avoid redundant synchronization when the main spec is already current.

Broadly rewriting all generated skills was rejected because it would increase migration risk and exceed the issue scope.

### Model the workflow as a new specification capability

The repository agent workflow is externally observable by agents and has enforceable lifecycle behavior, so it is represented as the new `agent-workflow` capability rather than marking the change as spec-less tooling. This makes mandatory synchronization and portability testable contracts.

Treating the work as pure documentation with `skip_specs: true` was rejected because it would leave the archive constraint informal.

### Configure OpenSpec with concise verified context

`openspec/config.yaml` will retain the `spec-driven` schema and add context drawn from the current repository: application domain, stack, container-only Yarn execution, tests, serverless components, and repository conventions. Artifact rules will focus on scope, decisions and alternatives, normative scenarios, task granularity, validation, and sync-before-archive.

Embedding exhaustive documentation was rejected because duplicated project documentation becomes stale and obscures artifact instructions.

## Risks / Trade-offs

- [Agents that only scan `.codex/skills/` may no longer discover repository skills] → Use the repository-native `.agents/skills/` convention required by the issue and verify all five skills exist there.
- [Consolidation may accidentally drop a still-applicable rule] → Map both loose rule files into `AGENTS.md` before deleting them and review the final diff item by item.
- [RTK filtering may hide output needed for diagnosis] → Document the RTK raw proxy escape hatch in `RTK.md`.
- [Archive enforcement could synchronize an already-current spec twice] → Compare delta and main specs first, then allow direct archive only when synchronization is demonstrably unnecessary.
- [Project context may expose local or sensitive information] → Use only repository-relative paths and public architectural facts, followed by a targeted sensitive-data scan.

## Migration Plan

1. Keep `AGENTS.md` as a concise discovery entry point and add the relative `@RTK.md` reference without embedding project-local rules.
2. Add root `RTK.md`, then remove the superseded loose `.agents` rule files.
3. Move the five OpenSpec skills to `.agents/skills/`, updating only the archive behavior required by the new lifecycle.
4. Replace placeholder OpenSpec configuration with verified context and artifact rules.
5. Validate file placement, lifecycle wording, OpenSpec artifacts, portability, and preservation of existing specs and archives.

Rollback consists of restoring the original root guidance and configuration and moving the unchanged skills back to `.codex/skills/`. No application data or dependency rollback is required.
