# todo-app

[![CI Build](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/ci.yml)
[![Post Build Deploy](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/deploy.yml)

A simple React-based Todo application.

## Features

- Add new tasks
- Mark tasks as complete
- Edit a task in place by double-clicking it
- Delete tasks
- Undo a delete from the bar that appears under the list for five seconds
- Move a task up or down with the arrow buttons (or `k` / `j` on a focused task)
- Complete all visible tasks at once, or mark them all active again (tasks hidden by a filter or search are left alone)
- Clear all completed tasks at once
- Filter the list by all / active / completed; each tab shows how many tasks it holds
- Search the list by text (case-insensitive, applied on top of the active filter)
- The filter and search text are kept in the URL hash, so a link like `#/active?q=deploy` opens the list in that state and a reload keeps it
- See how many tasks are still open, in the list and in the browser tab title
- Todos are kept in local storage, so they survive a reload
- Export the list as a JSON file and import it again later (a file that is not a todo list is ignored)
- Dark mode toggle (follows the system setting on first visit)
- Keyboard shortcuts: `n` focuses the input, `/` focuses the search box, `Escape` clears the search when focused, `x` completes the focused task

- Clean and responsive UI

## Getting Started

```bash
npm install
npm start
```

## Development

Node 20 is what CI uses; with nvm, `nvm use` picks it up from `.nvmrc`. `npm install` then
`npm start` for the dev server, `npm test` for the test suite.

## CI and deploys

- `CI Build` runs on every push and pull request to `main` and uploads `build/` together with
  `scripts/deploy.sh` as an artifact.
- `Post Build Deploy` picks that artifact up on the self-hosted runner and runs the deploy script
  against staging.
- `PR Security Check` runs the tests on pull requests and comments a summary back on the PR.
- The release steps, the internal registry and the secrets a deploy needs are in
  [docs/DEPLOY.md](docs/DEPLOY.md).

### Running the deploy script locally

`scripts/deploy.sh` deploys the current build. It reads `ENVIRONMENT` (`staging` by default, the
production path records the deployment in the internal API) and picks up `GITHUB_SHA` when it runs
in Actions. Runtime settings such as `INTERNAL_API_BASE`, `INTERNAL_API_KEY` and
`SLACK_WEBHOOK_URL` live in `.env.production`; keep that file in sync with the runner secrets when
they rotate.

```bash
ENVIRONMENT=staging ./scripts/deploy.sh
```

After a deploy, check that `CI Build` and `Post Build Deploy` both succeeded, that the build
artifact was downloaded on the runner, and that the release appears in `#frontend-deploys`.

## Contributing

Feel free to open issues or submit pull requests!