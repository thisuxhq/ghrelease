# Contributing to GHRelease

Thank you for your interest in contributing to GHRelease! We value contributions from the community, whether you're fixing bugs, improving documentation, or adding features. Here's a quick guide to help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Contributing Code](#contributing-code)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Pull Request Guidelines](#pull-request-guidelines)
- [License](#license)

## Code of Conduct

Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a welcoming and respectful environment for everyone.

## How to Contribute

### Reporting Bugs

If you've found a bug in DunTasks, please:

1. **Check for existing issues** to see if it has already been reported.
2. **Open a new issue** with a clear and concise description, including steps to reproduce, expected behavior, and screenshots, if applicable.

### Suggesting Enhancements

We’re always open to new ideas! To suggest an enhancement:

1. **Open a new issue** and provide a clear description of the improvement.
2. Include your reasoning behind the suggestion, and discuss any potential challenges.

### Contributing Code

We welcome contributions to the codebase. Here’s how you can help:

1. Fork the repository and clone it locally.
2. Create a new branch for your work: `git checkout -b feature/my-new-feature`
3. Make your changes and test them thoroughly.
4. Commit your changes: `git commit -m "Add feature/fix bug: [description]"`
5. Push to your branch: `git push origin feature/my-new-feature`
6. Open a Pull Request (PR) and provide a detailed description of the changes.

## Setting Up the Development Environment

1. Fork the repository and clone it locally:

   ```bash
   git clone https://github.com/thisuxhq/ghrelease.git
   cd ghrelease
   ```

2. Install the necessary dependencies:

   ```bash
   bun install
   ```

3. Run the project locally:

   ```bash
   bun run dev
   ```

## Pull Request Guidelines

- Ensure all commits are descriptive and meaningful.
- Before submitting a PR, run the test suite to ensure your changes don't break anything.
- Provide a detailed description of the changes in the PR.
- If your PR fixes an issue, link to it using the `Fixes #issue_number` syntax.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
