# CI/CD Workflows Documentation

This repository contains the following GitHub Actions workflows:

## 1. CI: Release Drafter

- **Purpose**: Automatically creates draft release notes based on merged pull requests and commits.
- **Trigger**: Scheduled to run daily at midnight.
- **Permissions**: Requires write access to the repository and pull requests.

## 2. CI: Checkout Instructions Creator

- **Purpose**: Comments checkout instructions on newly opened pull requests against the main branch.
- **Trigger**: On opening a pull request against the main branch.
- **Permissions**: Requires write access to comment on pull requests.
