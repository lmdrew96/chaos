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

## Empirical foundations

Error detection and fossilization tracking in ChaosLengua are grounded in the [COWS-L2H corpus](https://github.com/ucdaviscl/cowsl2h) (UC Davis, L1-English Spanish learners, ~2,500 essays across A1–C1). Key findings wired into the system:

- **Errors are directional.** L1-English learners overuse *ser* ~3× more than *estar*, *por* more than *para* at B1+, and preterite over imperfect at all levels. The grammar feature map tracks directional sub-features (`ser_estar_overuse_ser`, `pret_imp_overuse_preterite`, etc.) rather than lumping both directions together.
- **Corpus aggregate rates are 1–4%.** A learner at 12% ser-overuse is 4× the population baseline for their CEFR level — a real fossilization signal — but wouldn't trip a flat 40% threshold. The Adaptation Engine flags patterns at **4× baseline** (nudge) and **8× baseline** (fossilized candidate), in addition to the absolute 40%/70% thresholds.

Validation report: `apps/chaoslengua/docs/analysis/cows-l2h-validation.md`

## Planned siblings

- French, German, Portuguese — future
