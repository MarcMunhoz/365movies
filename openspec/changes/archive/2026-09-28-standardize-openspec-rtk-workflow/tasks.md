## 1. Consolidate Repository Guidance

- [x] 1.1 Keep root `AGENTS.md` as a concise discovery entry point without project-local rules, and relocate applicable project context and artifact guidance to `openspec/config.yaml`.
- [x] 1.2 Add root `RTK.md` with the repository command policy and raw proxy escape hatch, then reference it from `AGENTS.md` as `@RTK.md`.
- [x] 1.3 Remove the two superseded loose rule files and verify applicable project guidance remains discoverable through `openspec/config.yaml`.

## 2. Migrate OpenSpec Skills

- [x] 2.1 Move the explore, propose, apply-change, sync-specs, and archive-change skill directories from `.codex/skills/` to `.agents/skills/` while preserving their names and functional content.
- [x] 2.2 Update the archive skill to require synchronization when delta specs differ from main specs and remove every archive-without-sync path.
- [x] 2.3 Verify `.agents/skills/` contains exactly the five expected OpenSpec skills and `.codex/skills/` contains no duplicate repository-local copies.

## 3. Configure the Project Workflow

- [x] 3.1 Replace placeholder content in `openspec/config.yaml` with concise, verified project context covering the application domain, stack, container-only Yarn execution, test tooling, serverless components, and repository conventions.
- [x] 3.2 Add artifact rules for proposal scope, design decisions and alternatives, normative specification scenarios, verifiable task breakdowns, proportional validation, and mandatory sync before archive.
- [x] 3.3 Confirm the documented repository lifecycle is `propose → apply → sync → archive` across root guidance, OpenSpec configuration, and the archive skill.

## 4. Validate the Migration

- [x] 4.1 Run strict OpenSpec validation for the change and resolve every reported error.
- [x] 4.2 Review the diff to confirm application source, package manifests, lockfiles, existing main specs, and archived changes are unchanged.
- [x] 4.3 Scan changed artifacts for absolute machine paths, usernames, temporary directories, credentials, secrets, private URLs, placeholders, and other local identifiers; replace any findings with repository-relative or sanitized references.
- [x] 4.4 Synchronize the `agent-workflow` delta spec into the main specifications before archiving this change.
- [x] 4.5 Archive the fully completed and synchronized OpenSpec change before integration handoff.
