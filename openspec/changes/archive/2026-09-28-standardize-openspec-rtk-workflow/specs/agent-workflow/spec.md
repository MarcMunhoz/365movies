## Purpose

Defines a portable, repository-native workflow that gives coding agents discoverable instructions, consistent command execution, and a mandatory OpenSpec lifecycle.

## ADDED Requirements

### Requirement: Repository-native guidance entry points
The repository SHALL provide concise root `AGENTS.md` and `RTK.md` entry points, `AGENTS.md` MUST reference `RTK.md` using a repository-relative reference, and `AGENTS.md` MUST NOT duplicate project-local rules.

#### Scenario: Agent discovers repository instructions
- **WHEN** an agent begins work from the repository root
- **THEN** it can discover the applicable project rules and RTK command policy without resolving a machine-specific path

#### Scenario: Applicable legacy guidance is relocated
- **WHEN** loose repository rule files are removed from `.agents/`
- **THEN** applicable project context and artifact guidance MUST be represented in `openspec/config.yaml` rather than duplicated in `AGENTS.md`

### Requirement: Canonical OpenSpec skill location
The repository SHALL store its five functional OpenSpec skills under `.agents/skills/` and MUST NOT retain duplicate repository-local copies under `.codex/skills/`.

#### Scenario: Agent discovers OpenSpec skills
- **WHEN** an agent inspects the repository-native skill directory
- **THEN** it finds the explore, propose, apply-change, sync-specs, and archive-change skills

#### Scenario: Legacy skill location is inspected
- **WHEN** an agent inspects `.codex/skills/` after migration
- **THEN** it finds no duplicate repository-local OpenSpec skills

### Requirement: Project-aware OpenSpec guidance
The OpenSpec configuration SHALL describe verified project context and SHALL provide artifact rules that are applicable to proposals, designs, specifications, and tasks.

#### Scenario: A new change is proposed
- **WHEN** OpenSpec generates instructions for a repository change
- **THEN** the instructions reflect the project's stack, container-only package-manager execution, validation approach, and artifact expectations

#### Scenario: Configuration content is reviewed for portability
- **WHEN** the OpenSpec configuration is inspected
- **THEN** it contains no placeholder guidance, machine-specific absolute paths, credentials, secrets, private URLs, or local environment identifiers

### Requirement: Mandatory specification synchronization before archive
The repository OpenSpec lifecycle SHALL follow `propose → apply → sync → archive`, and the archive workflow MUST prevent a change with delta specifications from being archived until those specifications are synchronized with the main specifications.

#### Scenario: Unsynchronized delta specifications exist
- **WHEN** archive is requested for a change whose delta specifications differ from the corresponding main specifications
- **THEN** the workflow requires synchronization and MUST NOT offer an archive-without-sync path

#### Scenario: Delta specifications are already synchronized
- **WHEN** archive is requested and comparison confirms that the delta specifications are represented in the main specifications
- **THEN** the workflow may archive the change without applying the same synchronization twice

#### Scenario: A change has no delta specifications
- **WHEN** archive is requested for a change that does not contain delta specifications
- **THEN** the workflow may proceed without a specification synchronization step

### Requirement: Existing OpenSpec history remains intact
The migration MUST preserve all pre-existing main specifications and archived change content.

#### Scenario: Migration is complete
- **WHEN** the repository-native workflow migration is validated
- **THEN** the pre-existing main specification files and archived changes are unchanged

### Requirement: Tooling-only migration
The workflow migration MUST NOT alter application behavior, application dependencies, package manifests, or lockfiles.

#### Scenario: Migration diff is reviewed
- **WHEN** the completed change is compared with its baseline
- **THEN** all modifications are limited to repository agent guidance, repository-local skills, OpenSpec configuration, and this change's artifacts
