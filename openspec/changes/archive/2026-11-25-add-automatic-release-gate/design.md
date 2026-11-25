## Context

The reference repository validates production pull requests and publishes releases from main. The existing 365movies release baseline is v2.6.2 and main already contains a later commit with the same version.

## Goals / Non-Goals

Reuse the reference's commit-based version rules and validate the existing build and test commands in Docker. Keep the existing deployment and historical releases in place.

## Decisions

- A read-only pull request workflow validates the same-repository develop source, calculates the expected version from the base and head commits, then runs quality checks on the proposed merge.
- A push workflow compares the before and after versions. A higher version requires matching package metadata, Docker label and changelog heading. An equal version skips publication. This avoids the tag conflict that would result from running the reference publisher unchanged on every push.
- Publication targets the pushed commit and is idempotent for that commit. Only the publisher receives contents write permission. An existing tag at another commit is an error.

## Risks / Trade-offs

- A missing or invalid version baseline fails closed. The existing v2.6.2 baseline requires no migration.
- Publication failures can be retried against the same push. Rolling back the workflow disables future automation while published tags and releases keep their history.
