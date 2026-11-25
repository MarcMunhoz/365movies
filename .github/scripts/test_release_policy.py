import unittest
from unittest.mock import patch

import release_policy as policy


class ReleasePolicyTest(unittest.TestCase):
    def test_highest_bump_matches_reference(self):
        cases = [
            (["docs: Updates guide", "chore(tooling): Updates CI"], "2.6.2"),
            (["chore(dependencies): Updates Vue", "perf: Speeds up build"], "2.6.3"),
            (["fix: Fixes build", "feat(app): Adds a feature"], "2.7.0"),
            (["feat!: Changes API"], "3.0.0"),
            (["docs: Updates guide\n\nBREAKING CHANGE: changes API"], "3.0.0"),
        ]
        for messages, expected in cases:
            with self.subTest(messages=messages):
                self.assertEqual(policy.expected_version("2.6.2", messages), expected)

    def test_publication_compares_numeric_versions(self):
        with patch.object(policy, "version_at", side_effect=["2.9.9", "2.10.0"]):
            self.assertEqual(policy.publication_tag("before", "after"), "v2.10.0")

    def test_unchanged_version_skips_publication(self):
        with patch.object(policy, "version_at", return_value="2.6.2"):
            self.assertIsNone(policy.publication_tag("before", "after"))

    def test_version_regression_fails(self):
        with patch.object(policy, "version_at", side_effect=["2.6.2", "2.6.1"]):
            with self.assertRaises(ValueError):
                policy.publication_tag("before", "after")

    def test_version_metadata_requires_docker_label_and_changelog_heading(self):
        with patch.object(policy, "read_at", side_effect=[
            'LABEL author="example" \\\n  version="2.6.3"',
            "## Releases\n\n### 2.6.3\n",
        ]):
            policy.validate_metadata("head", "2.6.3")
        with patch.object(policy, "read_at", side_effect=[
            'LABEL version="2.6.3"', "### 2.6.30",
        ]):
            with self.assertRaises(ValueError):
                policy.validate_metadata("head", "2.6.3")

    def test_conflicting_unquoted_docker_version_is_rejected(self):
        with patch.object(policy, "read_at", side_effect=[
            'LABEL version="2.6.3"\nLABEL version=2.6.2', "### 2.6.3",
        ]):
            with self.assertRaises(ValueError):
                policy.validate_metadata("merge", "2.6.3")

    def test_pr_validates_metadata_on_the_merge_tree(self):
        with (
            patch.object(policy, "version_at", side_effect=["2.6.2", "2.6.3", "2.6.3"]),
            patch.object(policy, "git", return_value="fix: Fixes issue\0"),
            patch.object(policy, "validate_metadata") as validate_metadata,
        ):
            policy.validate_pr("base", "head", "merge")
        validate_metadata.assert_called_once_with("merge", "2.6.3")


if __name__ == "__main__":
    unittest.main()
