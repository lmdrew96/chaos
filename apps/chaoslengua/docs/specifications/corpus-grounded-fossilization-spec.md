# Patch: Corpus-grounded directional fossilization tracking

**Project:** ChaosLengua
**Source:** `docs/analysis/cows-l2h-validation.md` — empirical validation against COWS-L2H corpus
**Goal:** Extend the grammar feature map and Adaptation Engine so Error Garden can detect *directional* fossilization (overuse-of-ser vs overuse-of-estar, etc.) and compare per-learner rates against corpus-derived population baselines.

---

## Why this matters (in one paragraph)

The COWS-L2H validation revealed two things our system can't currently act on:
1. **Errors are directional.** Students overuse ser 3× more than estar (74 vs 24 at A1-A2), overuse "por" more than "para" (94 vs 50 at B2 for "para→por" corrections), and overuse preterite over imperfect (`fue→era` dominates everywhere). Right now the grammar feature map lumps both directions together under `ser_estar_contrast` etc., so Error Garden can't track which direction a learner has fossilized.
2. **40% / 70% thresholds are too blunt.** Corpus aggregate rates are 1–4% — meaning a learner at 12% on ser overuse is *4× the population baseline at their level* but won't trip the existing thresholds. We're missing real fossilization signals at sub-threshold rates.

This patch addresses both: directional sub-features for Error Garden granularity, and a `populationBaseline` field so the Adaptation Engine can flag "X× over baseline" rather than just "≥ 40%".

---

## Scope (two coordinated changes)

### Part 1 — Schema + Feature Map: Add directional sub-features

**File:** `packages/db/src/schema.ts` (or wherever `grammarFeatureMap` lives — confirm with `grep`)

Add a new column to `grammarFeatureMap`:

```ts
populationBaseline: jsonb('population_baseline').$type<{
  A1_A2?: number;  // decimal rate, e.g. 0.026 for 2.6%
  B1?: number;
  B2?: number;
  C1?: number;
}>(),
```

Generate a Drizzle migration via `pnpm db:generate`. Apply with `pnpm db:push`.

**File:** `apps/chaoslengua/scripts/seed-grammar-features-es.ts`

Add the following **directional sub-feature keys** to the `features` array. Use upsert (the script already does `onConflictDoUpdate`), so re-running is idempotent.

```ts
// ═══════════════════════════════════════
// DIRECTIONAL FOSSILIZATION SUB-FEATURES (Corpus-grounded — Stage 1)
// Derived from COWS-L2H validation (docs/analysis/cows-l2h-validation.md)
// Each pair captures the *direction* of L1-English learner overuse.
// ═══════════════════════════════════════

// SER/ESTAR directional
{
  featureKey: 'ser_estar_overuse_ser',
  featureName: 'Ser/Estar: Overuse of Ser',
  cefrLevel: 'A2',
  category: 'grammar',
  description: 'Learner uses ser in contexts requiring estar. Corpus-dominant direction (es→está outnumbers está→es ~3:1 at A1-A2, ~3:1 at B1). Highest-leverage Stage 1 fossilization signal for L1-English learners.',
  populationBaseline: { A1_A2: 0.011, B1: 0.007, B2: 0.005 }, // es→está + esta→es + son→están + estoy→soy + soy→estoy + similar / total uses
  sortOrder: 12,
},
{
  featureKey: 'ser_estar_overuse_estar',
  featureName: 'Ser/Estar: Overuse of Estar',
  cefrLevel: 'A2',
  category: 'grammar',
  description: 'Learner uses estar in contexts requiring ser. Less common direction but emerges at B1+ as learners over-correct (estaba→era dominates at B2: 28 vs 26 for the reverse). Watch for B2+ learners showing this pattern.',
  populationBaseline: { A1_A2: 0.004, B1: 0.005, B2: 0.007 },
  sortOrder: 13,
},

// POR/PARA directional
{
  featureKey: 'por_para_overuse_por',
  featureName: 'Por/Para: Overuse of Por',
  cefrLevel: 'A2',
  category: 'grammar',
  description: 'Learner uses por in contexts requiring para. Corpus-dominant direction at B1+ (para→por outnumbers por→para roughly 3:2 at B1, 2:1 at B2). Most common L1-English fossilization for prepositions.',
  populationBaseline: { A1_A2: 0.015, B1: 0.018, B2: 0.022 },
  sortOrder: 14,
},
{
  featureKey: 'por_para_overuse_para',
  featureName: 'Por/Para: Overuse of Para',
  cefrLevel: 'A2',
  category: 'grammar',
  description: 'Learner uses para in contexts requiring por. Smaller but real signal — roughly 40% of por/para errors at A1-A2, dropping to 33% at B2.',
  populationBaseline: { A1_A2: 0.014, B1: 0.012, B2: 0.012 },
  sortOrder: 15,
},

// PRETERITE/IMPERFECT directional
{
  featureKey: 'pret_imp_overuse_preterite',
  featureName: 'Preterite/Imperfect: Overuse of Preterite',
  cefrLevel: 'B1',
  category: 'grammar',
  description: 'Learner uses preterite where imperfect was required. Corpus-dominant direction at ALL levels — fue→era is the single most common pret/imp error pair. Reflects L1-English bias toward default past tense. Highest-priority directional drill for B1+.',
  populationBaseline: { A1_A2: 0.010, B1: 0.014, B2: 0.016 },
  sortOrder: 19,
},
{
  featureKey: 'pret_imp_overuse_imperfect',
  featureName: 'Preterite/Imperfect: Overuse of Imperfect',
  cefrLevel: 'B1',
  category: 'grammar',
  description: 'Learner uses imperfect where preterite was required. Less common but real (era→fue, estaba→era at B2). Watch for over-correction patterns in learners who previously fossilized preterite-overuse.',
  populationBaseline: { A1_A2: 0.005, B1: 0.007, B2: 0.008 },
  sortOrder: 20,
},

// OBJECT PRONOUNS directional (post-recount; see Open Question below)
// Keep the existing `direct_object_pronoun_preverbal` and `indirect_object_pronoun_preverbal`
// features unchanged for now. Object pronoun directional sub-features are deferred
// pending a clean recount (corpus denominator is inflated by definite articles).
```

Also **add `populationBaseline` to the existing non-directional features** where the validation report has data — at minimum `ser_estar_contrast`, `preterite_imperfect_contrast`, `direct_object_pronoun_preverbal`, `indirect_object_pronoun_preverbal`. Use the aggregate rates from the validation summary table (e.g. ser/estar A1-A2 = 0.026). This lets the Adaptation Engine compare both aggregate and directional signals against baselines.

### Part 2 — Adaptation Engine: Add baseline-relative fossilization

**File:** `apps/chaoslengua/src/lib/ai/adaptation.ts` (confirm path)

Currently the engine compares per-learner error rates against the flat `NUDGE_THRESHOLD = 0.40` and `FOSSILIZATION_THRESHOLD = 0.70`.

Add a **baseline-relative signal** alongside the absolute thresholds. Pseudo-code:

```ts
// Existing thresholds (keep — these are valid for high-error patterns)
const NUDGE_THRESHOLD = 0.40;
const FOSSILIZATION_THRESHOLD = 0.70;

// New baseline-relative thresholds
const BASELINE_MULTIPLIER_NUDGE = 4;   // 4× population baseline → nudge
const BASELINE_MULTIPLIER_FOSSIL = 8;  // 8× population baseline → fossilization candidate

function evaluateFossilization(
  feature: GrammarFeature,
  learnerRate: number,
  learnerCEFR: 'A1_A2' | 'B1' | 'B2' | 'C1'
): FossilizationVerdict {
  const baseline = feature.populationBaseline?.[learnerCEFR];

  // Absolute-threshold path (unchanged behavior for high-error patterns)
  if (learnerRate >= FOSSILIZATION_THRESHOLD) return { tier: 'fossilized', reason: 'absolute' };
  if (learnerRate >= NUDGE_THRESHOLD) return { tier: 'nudge', reason: 'absolute' };

  // Baseline-relative path (new — catches sub-40% directional fossilization)
  if (baseline && baseline > 0) {
    const ratio = learnerRate / baseline;
    if (ratio >= BASELINE_MULTIPLIER_FOSSIL) {
      return { tier: 'fossilized', reason: 'baseline-relative', ratio };
    }
    if (ratio >= BASELINE_MULTIPLIER_NUDGE) {
      return { tier: 'nudge', reason: 'baseline-relative', ratio };
    }
  }

  return { tier: 'normal' };
}
```

The `reason` field in the verdict is important — it lets the Error Garden UI explain *why* something flagged ("4.2× the typical rate for B1 learners" reads better than just "above threshold").

---

## Testing

Add unit tests in `apps/chaoslengua/__tests__/` (match existing Jest patterns):

1. **Schema migration** — verify `populationBaseline` column exists and accepts JSONB.
2. **Seed idempotency** — run `seed-grammar-features-es.ts` twice, confirm no duplicates and baselines are upserted correctly.
3. **Adaptation Engine cases:**
   - Learner at 12% ser-overuse, A1-A2 baseline 1.1% → should flag as fossilized (10.9× ratio).
   - Learner at 45% on a pattern with no baseline → flag via absolute threshold (existing behavior, unchanged).
   - Learner at 3% on a pattern with no baseline → no flag.
   - Learner at 5% on baseline 1.5% → 3.3× ratio, below 4× nudge threshold → no flag.

---

## Open question (flag before implementing)

The validation report notes the **object pronoun denominator is inflated** because `lo/la/los/las` tokens are mostly definite articles, not clitics. The 0.1–0.2% rate is artificially low.

**Decision needed before adding obj-pron directional features:** Either
- (a) defer obj-pron directional baselines until the recount is done (recommended — cleaner data), or
- (b) add the features with `populationBaseline` set to `null` for now, populate later.

The spec above takes path (a) — keep existing non-directional obj-pron features unchanged, no new directional sub-features yet. Mention this in the PR description.

---

## Don't

- Don't change the existing `NUDGE_THRESHOLD` / `FOSSILIZATION_THRESHOLD` values — they're valid for high-error patterns where baselines aren't available.
- Don't backfill `populationBaseline` for phonology features — corpus is written-only, no phonological error data.
- Don't change the Workshop challenge generator in this patch — that's a separate downstream task once Error Garden starts emitting directional verdicts.
- Don't touch Romanian (ChaosLimbă) features — those baselines don't exist yet and the corpus doesn't cover Romanian.

---

## When this lands

The validation report (`docs/analysis/cows-l2h-validation.md`) should be updated with a closing note: "Directional baselines from this report are now wired into the Adaptation Engine via `populationBaseline` on the grammar feature map (PR #XXX)."

Add a brief mention in the README's "Empirical foundations" section (if it doesn't exist yet, create it — corpus grounding is a defensible distinctive claim).
