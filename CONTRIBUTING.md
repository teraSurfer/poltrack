# Contributing to PolTrack Project

Want to help? Great!! Pick an existing issue or open a new one and follow the steps below.

## Recommended Workflow

1. Make a fork of the PolTrack project on GitHub.
2. Clone the fork on your development computer.
3. Create a branch where you will do the work.
4. Test and review your work.
5. Commit your changes (see _Commit Message Guidelines_).
6. Sync your fork on GitHub and the repo on your computer with the latest changes from the poltrack repository (see _How to sync your fork_). This will minimize the effort needed to merge your changes in the poltrack repo.
7. Merge upstream changes if necessary and make sure all tests still pass.
8. Push your work to the remote fork created in Step 2.
9. Create a Pull Request to initiate the integration of your changes in the PolTrack project.

## Getting Started with GitHub

Please check out one of the getting started guides about GitHub fork / pull requests workflow:

* [Forking project](https://guides.github.com/activities/forking/)
* [Fork a repo](https://help.github.com/articles/fork-a-repo/)
* [Forking](https://gist.github.com/Chaser324/ce0505fbed06b947d962)

## How to sync your fork

Your fork of the repo can fall behind as more work is done in the original repository.
It is always good idea to update your work before starting to work on new issue.
The fork can be updated by navigating to your for directory and running the following command:

`git checkout master --force && git fetch upstream && git merge upstream/master && git push`

This command assumes you're using unix or unix like environment (macOS, cygwin, WSL, ...). 
If not you might need to execute commands one by one instead of chaining them with `&&`.

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the [change log](https://github.com/vis/poltrack/blob/master/CHANGELOG.md)**.

### Format

Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**. 
The **header** is mandatory and the **scope** of the header is optional.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Scope

The commit scope is optional and defines the major area of the app that the commit affects.

Functional area affected by the change … | Examples of recommended scope values …
-----------------------------------------|----------------------------------------
Whole project or multiple modules | No scope specified
Single well-defined module | `core`, `shared`, `app`
Feature module or “sub-module” | Name of the module or “sub-module” (e.g. `todos`)
Cross-cutting concern | `animations`, `logging`, `build`
Unique entity or document | `readme`, `contributing`

### Type

Commit types that will appear in changelog:

* **feat** - adding new feature
* **fix** - fixing bug (please use `fixes #<issue-number>` at the end of commit message)
* **perf** - changes to improve performance
* If there is **BREAKING CHANGE** text anywhere in the commit message, the commit will always appear in the changelog

Other types that will not appear in changelog:

* **docs** - changes in documentation
* **chore** - changes in build or other application unrelated changes
* **refactor** - changes to implementation without changes to functionality
* **test** - adding tests
* **style** - changes to codestyle (should be unnecessary since we use prettier)

Any line of the commit message should not be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Examples

```
fix(polyfills): add missing hammerjs, fixes #247
```
```
refactor(settings): reorder imports
```
```
test(todos): add dispatch filter action test, adjust existing tests
```
```
fix(app): rework main layout to prevent scrollbar issues, closes #221, closes #240
```
```
docs(readme): add logo, update meta assets
```
```
feat(settings): add runtime animations toggles
```
```
fix(animations): fix dynamic animations in prod build, fixes #71
```
```
chore(release): 6.0.1
```

Even more [examples](https://github.com/vis/poltrack/commits/master) of commit messages from commit history of this project.
