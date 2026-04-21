# Schema Coupling Notes — For Phase 3 `@chaos/db` Extraction

**Authored:** 2026-04-21 during Phase 2 kickoff
**Audience:** Whoever does Phase 3 (`@chaos/db` package extraction)
**Status:** Known issues to resolve when extracting shared schema

---

## TL;DR

The current Drizzle schema at `apps/chaoslimba/src/lib/db/schema.ts` has language-coupling that's invisible at runtime but problematic at extraction time. This doc lists every known coupling so Phase 3 doesn't rediscover them one at a time.

During Phase 2 (ChaosLengua scaffolding), we're **intentionally leaving these as-is** — Spanish data goes into fields named `romanian_text` and nobody cares because the column name is just a string. Fixing this properly requires a schema migration affecting live Romanian production data, which is Phase 3 territory.

---

## Known couplings

### 1. `generated_content.romanian_text` — hardcoded language name in column

```typescript
export const generatedContent = pgTable('generated_content', {
  // ...
  romanianText: text('romanian_text').notNull(),  // ← literal column name
  englishText: text('english_text'),
  // ...
});
```

**Issue:** The column is named `romanian_text`. ChaosLengua writes Spanish into it. Works at runtime, but any developer reading the schema has to understand the historical reason.

**Proposed rename:** `targetLanguageText` with column `target_language_text`. English column stays as-is (it's always English — the learner's L1 is the constant across siblings).

**Migration strategy:**
- `ALTER TABLE generated_content RENAME COLUMN romanian_text TO target_language_text;`
- Update all `.romanianText` references in code across both apps
- Drizzle migration file needs to run in both the RO prod DB and the ES DB

### 2. Comment in `mysteryItems.pronunciation` field

```typescript
pronunciation: text('pronunciation'), // syllable stress guide e.g. "în-DO-iel-nic"
```

**Issue:** The example is Romanian. Purely cosmetic — column works fine for Spanish pronunciation guides (e.g., `"em-ba-ra-ZA-da"`). Just update the comment during Phase 3.

### 3. `stressMinimalPairs` table — conceptually Romanian-rooted

```typescript
export const stressMinimalPairs = pgTable('stress_minimal_pairs', {
  word: text('word').notNull(),
  stress: text('stress').notNull(),
  meaning: text('meaning').notNull(),
  example: text('example').notNull(),
  // ...
});
```

**Issue:** Romanian stress distinctions (like `MIe` vs `miE`) are binary — stress falls on one of two syllables in a minimal pair.

Spanish has **written-accent stress distinctions** that are often three-way:
- `canto` (I sing, present) / `cantó` (he sang, preterite 3sg)
- `cantara` (imperfect subjunctive) / `cantará` (future)
- `hablo` (I speak) / `habló` (he spoke)

The current schema supports this fine (one row per word variant, multiple rows per "pair"), but the table name `stress_minimal_pairs` is misleading when the concept is really "stress-distinguished word set." Consider renaming during Phase 3 or adding a `pair_group_id` field to group related words.

### 4. `contentItems` — no `language` field

```typescript
export const contentItems = pgTable('content_items', {
  // no language column
});
```

**Issue:** No way to query "all Spanish content" if we ever consolidate databases. Currently we solve this by running separate Neon databases per language (fresh ES DB, untouched RO prod DB), but if Phase 3 extraction tries to support a shared DB option, this would need a `language` enum column.

**Recommendation:** Add `language: text('language').$type<'ro' | 'es' | ...>().notNull()` during Phase 3. Default to 'ro' for the existing RO migration; set 'es' for all ES seed data.

### 5. Hardcoded language references in `content-generator.ts` and `workshop.ts` system prompts

Not a schema issue, but related. The Romanian `CHALLENGE_SYSTEM_PROMPT` and `EVALUATION_SYSTEM_PROMPT` mention Romanian diacritics and Romanian-specific grammar pitfalls. ChaosLengua needs parallel Spanish versions (already written — see `apps/chaoslengua/src/lib/ai/workshop.ts`).

**Phase 3 extraction strategy:** The AI logic files (conductor, aggregator, adaptation) can be extracted to `@chaos/core-ai` because they're purely orchestrational. The prompt-building files (workshop, grammar, tutor) CANNOT be extracted wholesale — they must stay per-app, or be parameterized to take a `languageModule` config that supplies language-specific prompts, diacritic regex, and validation rules.

### 6. `errorLogs.category` — free-text error subcategory

```typescript
category: text('category'), // subcategory like 'genitive_case', 'verb_conjugation'
```

**Issue:** The comment example is Romanian (`genitive_case`). Spanish error categories will differ — `ser_estar_confusion`, `preterite_imperfect_aspect`, `por_para_misuse`, `object_pronoun_placement`, etc.

**Not a blocking issue** — it's a free-text column, so each language writes its own subcategories. But for cross-app analytics (Phase 3+ feature), consider a shared taxonomy prefix like `es:ser_estar` vs `ro:case_genitive`.

### 7. `prerequisites` field mismatch in `grammarFeatureMap`

**Important:** The ChaosLimbă seed script (`scripts/seed-grammar-features.ts`) includes a `prerequisites: []` field on each feature, but the schema as of 2026-04-21 does NOT have a `prerequisites` column on `grammarFeatureMap`.

Either:
- (a) There's a pending migration adding a JSONB `prerequisites` column that hasn't been applied yet
- (b) The seed script is out of sync with the schema
- (c) TypeScript is doing something permissive I'm missing

**Cody: verify which state is correct before running the ES seed script.** The ES seed script (`seed-grammar-features-es.ts`) also includes `prerequisites: []` to match the RO pattern — if the field doesn't exist on the schema, strip it from all entries before running.

---

## Recommendation for Phase 3

When Phase 3 kicks off:

1. **Start with `@chaos/core-ai` extraction** — no schema changes needed, this is the safest first step.
2. **Then `@chaos/db` extraction** — bundle all the renames and additions above into a single migration:
   - Rename `romanian_text` → `target_language_text`
   - Add `language` column to `contentItems`
   - Fix `prerequisites` field if it's missing
   - Update comments
3. **Run the migration against both DBs** (RO prod and ES dev) before marking Phase 3b done.
4. **Then `@chaos/ui` and `@chaos/ai-clients`** — these don't touch the schema.

Do NOT bundle schema changes with package extraction in the same commit. Migration + extraction in one PR is a recipe for rollback pain.

---

## What we're NOT fixing in Phase 2

- Nothing from this doc. Phase 2 only proves the monorepo works end-to-end. Cosmetic schema issues wait for Phase 3.
- The ES app will write Spanish into columns named `romanian_text`, and that's fine for now.
