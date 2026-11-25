"""Validate 365movies release metadata at explicit Git revisions."""

import argparse
import json
import re
import shlex
import subprocess
from pathlib import Path


def git(*args):
    return subprocess.check_output(["git", *args], text=True)


def read_at(revision, path):
    return git("show", f"{revision}:{path}")


def version_parts(version):
    if not isinstance(version, str) or not re.fullmatch(
        r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)", version
    ):
        raise ValueError(f"Expected an X.Y.Z version, got {version!r}")
    return tuple(map(int, version.split(".")))


def version_at(revision):
    version = json.loads(read_at(revision, "app/package.json"))["version"]
    version_parts(version)
    return version


def expected_version(base, messages):
    major, minor, patch = version_parts(base)
    bump = 0
    for message in messages:
        if re.search(r"^BREAKING(?: |-)CHANGE:", message, re.MULTILINE):
            return f"{major + 1}.0.0"
        match = re.match(r"^([a-z]+)(\([^\r\n)]+\))?(!)?:", message)
        if not match:
            continue
        kind, scope, breaking = match.groups()
        if breaking:
            return f"{major + 1}.0.0"
        if kind == "feat":
            bump = 2
        elif kind in {"fix", "perf"} or (kind == "chore" and scope == "(dependencies)"):
            bump = max(bump, 1)
    if bump == 2:
        return f"{major}.{minor + 1}.0"
    if bump == 1:
        return f"{major}.{minor}.{patch + 1}"
    return base


def validate_metadata(revision, version):
    dockerfile = re.sub(r"\\\r?\n", " ", read_at(revision, "Dockerfile"))
    labels = re.findall(r"^\s*LABEL[ \t]+([^\r\n]*)", dockerfile, re.MULTILINE | re.IGNORECASE)
    versions = []
    for label in labels:
        fields = shlex.split(label)
        if fields and fields[0] == "version":
            versions.append(" ".join(fields[1:]))
        else:
            versions.extend(field.split("=", 1)[1] for field in fields if field.startswith("version="))
    if versions != [version]:
        raise ValueError(f"Dockerfile must declare exactly one version label matching {version}")
    changelog = read_at(revision, "CHANGELOG.md")
    if not re.search(rf"^### {re.escape(version)}[ \t]*$", changelog, re.MULTILINE):
        raise ValueError(f"CHANGELOG.md must include a '### {version}' heading")


def release_version(base, head):
    base_version = version_at(base)
    messages = git("log", "-z", "--format=%B", f"{base}..{head}").split("\0")
    return base_version, expected_version(base_version, messages)


def prepare_version(base, head, root=Path(".")):
    base_version, expected = release_version(base, head)
    if expected == base_version:
        if version_at(head) != expected:
            raise ValueError(f"Expected unchanged package version {expected}")
        return

    package_path = root / "app/package.json"
    docker_path = root / "Dockerfile"
    changelog_path = root / "CHANGELOG.md"
    package = package_path.read_text()
    current = json.loads(package)["version"]
    package, count = re.subn(
        rf'^(  "version": ){re.escape(json.dumps(current))}(,?)$',
        lambda match: f'{match[1]}"{expected}"{match[2]}',
        package,
        flags=re.MULTILINE,
    )
    if count != 1:
        raise ValueError("Expected one top-level package version")
    docker, count = re.subn(
        r'(?m)^(\s*version=")[^"\r\n]+(".*)$',
        lambda match: f"{match[1]}{expected}{match[2]}",
        docker_path.read_text(),
    )
    if count != 1:
        raise ValueError("Expected one Docker version label on a continuation line")

    changelog = changelog_path.read_text()
    if not re.search(rf"^### {re.escape(expected)}[ \t]*$", changelog, re.MULTILINE):
        marker = "## Releases\n"
        if changelog.count(marker) != 1:
            raise ValueError("Expected one Releases section in CHANGELOG.md")
        subjects = git("log", "--reverse", "--no-merges", "--format=%s", f"{base}..{head}").splitlines()
        notes = "\n".join(f"- {subject}" for subject in subjects if not subject.startswith("chore(release):"))
        changelog = changelog.replace(marker, f"{marker}\n### {expected}\n{notes}\n", 1)

    for path, updated in ((package_path, package), (docker_path, docker), (changelog_path, changelog)):
        if path.read_text() != updated:
            path.write_text(updated)


def validate_pr(base, head, merge):
    base_version, expected = release_version(base, head)
    if version_at(head) != expected:
        raise ValueError(f"Set app/package.json to the expected version {expected}")
    if version_at(merge) != expected:
        raise ValueError(f"The proposed merge must preserve version {expected}")
    if expected != base_version:
        validate_metadata(merge, expected)


def publication_tag(before, after):
    previous = version_at(before)
    current = version_at(after)
    if current == previous:
        return None
    if version_parts(current) < version_parts(previous):
        raise ValueError(f"Version decreased from {previous} to {current}")
    return f"v{current}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["prepare", "pr", "push"])
    parser.add_argument("base")
    parser.add_argument("head")
    parser.add_argument("--merge", default="HEAD", help="Proposed merge revision for PR validation")
    args = parser.parse_args()
    try:
        if args.mode == "prepare":
            if git("rev-parse", "HEAD").strip() != git("rev-parse", args.head).strip():
                raise ValueError("Release preparation requires checkout of the PR head")
            prepare_version(args.base, args.head)
            return
        if args.mode == "pr":
            validate_pr(args.base, args.head, args.merge)
            return
        tag = publication_tag(args.base, args.head)
        if tag:
            validate_metadata(args.head, tag[1:])
            print(tag)
    except (ValueError, KeyError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Release validation failed: {error}\n")


if __name__ == "__main__":
    main()
