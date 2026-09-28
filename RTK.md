# RTK - Rust Token Killer

Use RTK as the token-optimized proxy for shell commands in this repository.

## Usage

Prefix shell commands with `rtk`:

```sh
rtk git status
rtk docker compose run --rm --entrypoint yarn app test:unit:ci
rtk openspec list --json
```

Use the raw proxy when filtered output is unsuitable for diagnosis or exact verification:

```sh
rtk proxy <command>
```

RTK does not change the requirement that package-manager scripts, builds, and application tests run only inside the project container.
