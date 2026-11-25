## Why

Automate GitHub release publication and validate release candidates consistently before they reach production.

## What Changes

- Validate semantic version metadata, build, unit tests, and end-to-end tests for production pull requests.
- Publish a version tag and GitHub Release when the version increases on main.

## Capabilities

### New Capabilities

- `automatic-release` covers release validation and publication.

### Modified Capabilities

## Impact

GitHub Actions gains read-only validation and a publication job with repository contents write permission. Application behavior, dependencies, and the Netlify deployment configuration stay as they are.
