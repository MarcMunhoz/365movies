# AGENTS

## Mandatory rules
- NEVER run build, test, lint, or package manager scripts.
- Make only the requested code changes.
- If you need to validate something, explain what it validates without running any commands.
- When creating a commit, use GitHub's default format with an English message.
- The commit title must start with a capital letter.
- In the commit description, do not insert blank lines between items.
- The commit title must be only on the first line, without an attached description.
- The description must be in the commit body, using separate `-m` flags so it does not get appended to the title.
- Required format of the commit message:
  `type(scope): Summary message`
  `- Explanatory description 01`
  `- Explanatory description 02`
- Allowed commit types:
  `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
