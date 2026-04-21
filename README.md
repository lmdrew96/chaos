# Chaos

Monorepo for the Chaos Suite of language-learning apps. See `docs/CHAOS-MONOREPO-MIGRATION.md` (inside `apps/chaoslimba/docs/`) for the migration spec driving this restructure.

## Layout

```
chaos/
├── apps/
│   ├── chaoslimba/    Romanian — English-to-Romanian CALL app
│   └── chaoslengua/   Spanish — English-to-Spanish CALL app
├── packages/          Shared code — extracted only when duplication causes friction (Phase 3+)
└── languages/         Per-language pedagogical content + rules (Phase 2+)
```

`packages/` is code; `languages/` is pedagogical content + rules. Each language module will export the same typed interface from `@chaos/lang-config` once that's codified (Phase 4).

## Quick start

```bash
pnpm install
pnpm dev         # runs dev for all apps (chaoslimba → :5001, chaoslengua → :5002)
pnpm build       # builds all apps
pnpm test        # runs tests across the workspace
```

To run a single app:

```bash
pnpm --filter chaoslimba dev
pnpm --filter chaoslimba build
pnpm --filter chaoslengua dev
pnpm --filter chaoslengua build
```

## Tech

- **Package manager:** pnpm workspaces (pnpm 10.17+)
- **Task runner:** Turborepo
- **Node:** 20+

## Planned siblings

- French, German, Portuguese — future
