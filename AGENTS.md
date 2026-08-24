# Repository Guidelines

## Project Structure & Module Organization

This Node.js 24 pnpm workspace keeps the Fastify backend in `apps/api` and the React/Vite client in `apps/web`. Backend domain code lives under `src/modules/games` and `src/modules/reviews`; route files contain HTTP wiring. Frontend code is split into `api/`, `queries/`, pages, and presentational components. Shared REST DTOs belong in `packages/contracts`, package tests in each app's `test/`, and Playwright tests in `e2e/`.

## Build, Test, and Development Commands

- `corepack pnpm install --frozen-lockfile` installs the pinned workspace dependencies.
- `pnpm dev` starts both applications; Vite proxies `/api` to the API.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` run the release gates.
- `pnpm test:e2e:install` installs Chromium; `pnpm test:e2e` runs the Playwright acceptance flow separately.
- `docker compose up --build` starts the reviewer environment at `http://localhost:8080`.

## Coding Style & Naming Conventions

Use ESM and strict TypeScript. Prettier enforces tabs, single quotes, no semicolons, and trailing commas. Use kebab-case filenames, PascalCase for components/classes/types, and camelCase for functions and variables. Keep handlers transport-only, services focused on use cases, repositories focused on persistence, and TanStack Query responsible for server state. Add concise Bahasa Indonesia JSDoc to exported or non-obvious boundaries; do not restate the code.

## Testing Guidelines

Follow strict red-green-refactor TDD. Name files `*.test.ts` or `*.test.tsx`. Backend HTTP tests use Fastify `inject()`; frontend tests use Vitest and React Testing Library. Assert visible or boundary behavior, not mock existence. Keep output warning-free and restore fake timers/globals after each test.

## Local Hooks & CI

`pnpm install` activates Husky. The `pre-commit` hook runs lint-staged, fixing ESLint/Prettier issues only in supported staged files. The `pre-push` hook runs `pnpm test` and `pnpm typecheck`; Playwright is intentionally excluded. Hooks use `corepack pnpm` to honor the pinned package manager. Emergency bypasses (`git commit --no-verify` or `git push --no-verify`) are exceptional only: run skipped checks promptly, because GitHub Actions remains the mandatory authoritative gate for every push and pull request.

## Commit & Pull Request Guidelines

Use scoped Conventional Commits, for example `feat(web): add game browsing`. Every commit must be GPG-signed with the configured identity. Pull requests must summarize behavior and architecture impact, list commands run, link relevant issues, and include screenshots for UI changes. Never commit secrets, `.env`, build output, `node_modules`, or `.superpowers/`.
