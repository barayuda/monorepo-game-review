# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm workspace targeting Node.js 24. `apps/api` contains the Fastify backend; domain code is grouped under `src/modules/games` and `src/modules/reviews`, with HTTP wiring kept in route files. `apps/web` contains the React/Vite client, split into `api/`, `queries/`, pages, and presentational components. Shared REST DTOs live in `packages/contracts`; do not place backend business logic there. Package tests live in each app's `test/` directory. End-to-end tests belong in `e2e/`.

## Build, Test, and Development Commands

- `corepack pnpm install --frozen-lockfile` installs the pinned workspace dependencies.
- `pnpm dev` starts package development processes; the web app proxies `/api` to the API service.
- `pnpm test` runs all Vitest suites. Use `pnpm --filter @game-review/web test` or `pnpm --filter @game-review/api test` for focused work.
- `pnpm typecheck` runs strict TypeScript checks across packages.
- `pnpm lint` runs ESLint and verifies Prettier formatting.
- `pnpm build` builds every workspace package.
- `docker compose up --build` builds and starts the complete reviewer environment.

## Coding Style & Naming Conventions

Use ESM and strict TypeScript. Prettier enforces tabs (width 2), single quotes, no semicolons, and trailing commas. Use kebab-case filenames, PascalCase for React components/classes/types, and camelCase for functions and variables. Keep route handlers transport-only, services responsible for use cases, repositories responsible for persistence, and React Query responsible for server state. Add concise Bahasa Indonesia JSDoc to exported or non-obvious boundaries; avoid comments that restate the code.

## Testing Guidelines

Follow strict red-green-refactor TDD. Name files `*.test.ts` or `*.test.tsx`. Backend HTTP tests use Fastify `inject()`; frontend behavior tests use Vitest and React Testing Library. Assert user-visible or boundary behavior, not mock existence. Keep output free of warnings and restore fake timers/globals after each test.

## Commit & Pull Request Guidelines

Follow the repository's scoped Conventional Commit style, for example `feat(web): add game browsing` or `fix(api): normalize Fastify error responses`. Commits must be GPG-signed with the configured identity. Pull requests should summarize behavior and architecture impact, list commands run, link the relevant issue, and include screenshots for visible UI changes. Never commit secrets, `.env` files, build output, `node_modules`, or agent workspaces such as `.superpowers/`.
