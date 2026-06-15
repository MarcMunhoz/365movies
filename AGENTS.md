# AGENTS

## Mandatory rules
- NEVER run build, test, lint, or package manager scripts.
- Make only the requested code changes.
- If you need to validate something, explain what it validates without running any commands.
- When creating a commit, use GitHub's default format with an English message.
- The commit title must start with a capital letter.
- Write the commit title and description items in the simple present, using the third-person singular form (for example, `Adds`, `Documents`, `Updates`, or `Removes`).
- In the commit description, do not insert blank lines between items.
- The commit title must be only on the first line, without an attached description.
- The description must be in the commit body, using separate `-m` flags so it does not get appended to the title.
- Required format of the commit message:
  `type(scope): Adds summary message`
  `- Documents explanatory description 01`
  `- Updates explanatory description 02`
- Allowed commit types:
  `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
