## Why

Repository agent guidance is currently fragmented across loose rule files, legacy skill locations, an external RTK reference, and placeholder OpenSpec configuration. Consolidating these entry points makes the project workflow discoverable, portable, and enforceable without changing application behavior or dependencies.

## What Changes

- Keep root `AGENTS.md` as a concise discovery entry point without duplicating project-local rules.
- Add a repository-local root `RTK.md` and reference it from `AGENTS.md`.
- Remove obsolete loose `.agents` rule files after moving applicable project context and artifact guidance to `openspec/config.yaml`.
- Move the five repository OpenSpec skills from `.codex/skills/` to `.agents/skills/` without duplicate copies.
- Replace placeholder OpenSpec configuration with verified project context and artifact-specific rules.
- Require delta specifications to be synchronized before an OpenSpec change is archived.
- Preserve all existing main specifications and archived changes.

## Capabilities

### New Capabilities

- `agent-workflow`: Defines the repository-native agent entry points, RTK command policy, OpenSpec skill discovery, project-aware artifact guidance, and mandatory propose-to-archive lifecycle.

### Modified Capabilities

- None.

## Impact

- Affects repository guidance in `AGENTS.md`, the new `RTK.md`, `.agents/`, `.codex/skills/`, and `openspec/config.yaml`.
- Changes the repository-local OpenSpec archive workflow so delta specs cannot be skipped before archiving.
- Does not change application source, runtime behavior, package manifests, lockfiles, dependencies, main specifications, or archived change history.
