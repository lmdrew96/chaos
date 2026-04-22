# ChaosLengua Error Garden Taxonomy (ES)

Canonical reference for the Spanish Error Garden error-category taxonomy. Fixed-vocabulary taxonomy that Groq maps raw errors onto (via `src/lib/ai/error-enrichment.ts`), driving the clustering key `${errorType}|${category}` used by the Adaptation Engine.

For Spanish linguistic rationale, see the `chaoslengua-id-consultant` skill's `spanish-specific.md`. This doc covers the taxonomy design itself — what to cluster, not why the structures exist.

---

## 1. Pipeline

1. **Grading engine** produces raw error patterns with `{errorType, category, context, correction}` per production.
2. **`enrichErrorCategories()`** (Groq) snaps `category` onto the fixed taxonomy below.
3. **`error_logs`** rows get inserted with normalized `(errorType, category)`.
4. **`getAdaptationProfile()`** groups logs by `"${errorType}|${category}"`, computes frequency, applies fossilization thresholds, returns tier.
5. **`mapErrorCategoryToFeatureKey()`** (in `src/lib/db/queries.ts`) bridges category → `grammarFeatureMap` feature key.
6. **`findContentByFeatures()`** routes fossilizing-targeted content using that feature key.

**If a category has no bridge to a feature key**, errors still cluster and appear in the Error Garden dashboard, but the Adaptation Engine can't route content to break that fossilization — it falls through to weak/random selection. Uncovered categories should be tagged `bridge: null` and considered candidates for feature-map expansion.

## 2. Fossilization Thresholds

From `src/lib/ai/adaptation.ts`:

| Threshold | Value | Effect |
|---|---|---|
| `NUDGE_THRESHOLD` | 40% | Pattern enters adaptation awareness; tier 1 nudge weights kick in |
| `FOSSILIZATION_THRESHOLD` | 70% | Pattern qualifies for tier 2/3 escalation |
| `TIER2_INTERVENTION_COUNT` | 2 failed | Tier 1 → Tier 2 ("push") |
| `TIER3_INTERVENTION_COUNT` | 4 failed | Tier 2 → Tier 3 ("destabilize") |
| `MEASUREMENT_WINDOW_DAYS` | 3 | Lag before measuring intervention outcomes |

**Category granularity implication:** a learner broadly fossilized on a phenomenon should see that phenomenon clear the 40% nudge threshold. If a phenomenon is split into too many sub-categories, no single one reaches 40% and fossilization is invisible. Counter-pressure: a phenomenon that is too coarse hides diagnosable subtypes. The taxonomy below errs on the side of clean signal — ser/estar has 2 bins, not 4.

## 3. Stage Mapping

Stages are curriculum-level (see `structured-chaos.md`). A Stage 2 category can fire for a Stage 1 learner — it just means they produced a Stage 2 structure and got it wrong. The tag documents when the Adaptation Engine should *prioritize* routing content to that category.

- **Stage 1 (A2→B1 plateau-breakers)** — MVP target. Four fossilization-prone phenomena: ser/estar, preterite/imperfect, por/para, object pronouns.
- **Stage 2 (B1–B2)** — Subjunctive, compound tenses, combined clitic placement, regional variation exposure.
- **Stage 3 (C1+)** — Automaticity, imperfect subjunctive, stylistic refinement.

## 4. Taxonomy

### GRAMMAR (29 categories)

| Category | L1-EN Interference? | Stage | Bridge (feature key) |
|---|---|---|---|
| `ser_vs_estar_core` | **Yes — iconic** (EN "to be" collapses distinction) | 1 | `ser_vs_estar_core` |
| `ser_vs_estar_meaning_shift` | **Yes** (aburrido/listo/rico trait-vs-state) | 2 | `ser_vs_estar_meaning_shift` |
| `preterite_formation` | No (morphological) | 1 | `preterite_formation` |
| `imperfect_formation` | No (morphological) | 1 | `imperfect_formation` |
| `preterite_vs_imperfect_aspect` | **Yes — iconic** (EN collapses aspect in simple past) | 1 | `preterite_vs_imperfect_aspect` |
| `preterite_imperfect_meaning_shift` | **Yes** (saber/conocer/querer/poder/tener shift) | 2 | `preterite_imperfect_meaning_shift` |
| `direct_object_pronouns` | **Yes** (EN has undifferentiated object pronouns) | 1 | `direct_object_pronouns` |
| `indirect_object_pronouns` | **Yes** (clitic doubling has no EN analogue) | 1 | `indirect_object_pronouns` |
| `combined_object_pronouns` | **Yes** (se-lo substitution rule) | 2 | `combined_object_pronouns` |
| `personal_a` | **Yes** (EN lacks DO marker before humans) | 1 | `basic_prepositions` |
| `por_vs_para` | **Yes — iconic** (EN "for" collapses distinction) | 1→2 | `por_vs_para_intro` |
| `gender_agreement` | **Yes** (EN has no grammatical gender) | 1 | `gender_agreement` |
| `definite_article_omission` | **Yes** (EN drops article in abstract/generic) | 1 | `definite_articles` |
| `indefinite_article_overuse` | **Yes** ("Soy una profesora" vs "Soy profesora") | 1 | `indefinite_articles` |
| `article_contraction` | No (al/del mechanical) | 1 | `basic_prepositions` |
| `present_tense_regular` | No (morphological) | 1 | `present_tense_regular_ar` |
| `present_tense_stem_change` | No (morphological) | 1 | `stem_changing_e_ie` |
| `present_tense_irregular` | Partial | 1 | `present_tense_ser` |
| `future_ir_a` | No | 1 | `future_informal_ir_a` |
| `informal_commands` | No (morphological) | 1 | `informal_commands_tu` |
| `reflexive_verbs` | **Yes** (EN lacks productive reflexive morphology) | 1 | `reflexive_verbs_es` |
| `comparisons` | Partial (irregulars mejor/peor) | 1 | `comparisons` |
| `possessives` | No (cognate-like) | 1 | `possessives` |
| `gustar_construction` | **Yes** (inversion: "Me gusta X", not "Yo gusto X") | 1 | `gustar_construction` |
| `tener_idioms` | **Yes** (tener hambre/sed/años; EN uses "to be") | 1 | `present_tense_tener` |
| `double_negation` | **Yes** (EN prescriptive against, ES requires) | 1 | `basic_negation` |
| `accent_marks` | No (orthographic) | 1 | null |
| `spelling` | No | 1 | null |
| `general_grammar` | — | — | null |

### PRONUNCIATION (9 categories)

| Category | L1-EN Interference? | Stage | Bridge |
|---|---|---|---|
| `vowel_purity` | **Yes** (EN schwa reduction, diphthongization of pure vowels) | 1 | null |
| `trill_rr` | **Yes** (absent in EN) | 1 | null |
| `flap_vs_trill_contrast` | **Yes** (pero/perro minimal pair) | 1 | null |
| `palatal_nasal_n` | **Yes** (ñ; absent as single phoneme in EN) | 1 | null |
| `velar_fricative_j` | **Yes** (absent in EN) | 1 | null |
| `sibilant_s` | Partial (regional; seseo vs distinción) | 2 | null |
| `consonant_b_v` | **Yes** (EN overdistinguishes; ES merges to /b~β/) | 1 | null |
| `stress_placement` | Partial | 1 | null |
| `general_pronunciation` | — | — | null |

Pronunciation categories have no grammar-feature bridge by design — pronunciation routing happens through the pronunciation pipeline, not `grammarFeatureMap`.

### VOCABULARY (7 categories)

| Category | L1-EN Interference? | Stage | Bridge |
|---|---|---|---|
| `false_cognate` | **Yes — iconic** (embarazada, éxito, actual, asistir) | 1 | `vocab_false_cognates` |
| `collocation` | **Yes** (hacer calor not ser calor; tener que not deber de) | 1 | null |
| `register_formality` | Partial (tú/usted/vos choice) | 2 | null |
| `regional_variation_lexical` | No (coche/carro/auto mixing) | 2 | null |
| `semantic_range` | **Yes** (saber vs conocer, ir vs venir polarity) | 1 | null |
| `lexical_choice` | — (general) | — | null |
| `general_vocabulary` | — | — | null |

### WORD_ORDER (6 categories)

| Category | L1-EN Interference? | Stage | Bridge |
|---|---|---|---|
| `adjective_noun_position` | **Yes** (EN prenominal default) | 1 | null |
| `adjective_meaning_shift_position` | **Yes** (gran hombre vs hombre grande) | 2 | null |
| `clitic_order` | **Yes** (combined clitic ordering) | 2 | null |
| `question_inversion` | Partial | 1 | null |
| `adverb_placement` | No | 2 | null |
| `general_word_order` | — | — | null |

## 5. Classifier Dialectal Policy

The `enrichErrorCategories()` Groq prompt must:

1. Operate with **LatAm-neutral baseline** as default target dialect.
2. **Do NOT classify as errors**: voseo conjugations (`vos tenés`), vosotros forms, Peninsular leísmo (`le vi` for masculine human direct object), standard regional lexical variants.
3. Classify these as dialectal features only when they are *inconsistent* within a single production (mixing Peninsular and LatAm forms in one sentence) — tag those under `register_formality` or `regional_variation_lexical`, not under any grammar category.
4. Stage 1 learners targeting Peninsular Spanish get leísmo tagged as feature, not error. This is governed by a future user-level `target_dialect` preference; for MVP, default to LatAm-neutral and accept Peninsular conventions when context suggests Peninsular target.

## 6. Out-of-Scope Categories (Stage 2/3 Expansion)

These are expected categories once Stage 2 content ships. Not in the initial taxonomy to keep the signal clean and the feature-bridge surface small:

- `subjunctive_formation`, `subjunctive_trigger_selection`, `subjunctive_in_noun_clause`, `subjunctive_in_adjective_clause`, `subjunctive_in_adverbial_clause`
- `compound_tense_perfect`, `pluperfect_sequence`
- `conditional_hypothetical`, `imperfect_subjunctive_si_clause`
- `se_passive`, `impersonal_se`
- `relative_clause_que_quien_cual`

Add these to `error-enrichment.ts` as the ES curriculum expands past A2→B1 plateau-breakers.

## 7. Fossilization Indicators (Operational)

For the Adaptation Engine to flag a pattern as fossilizing, three signals must align:

1. **Frequency** ≥ 70% of learner's total errors (from `adaptation.ts:FOSSILIZATION_THRESHOLD`).
2. **Intervention resistance** — 2+ past interventions targeting this `patternKey` failed to reduce frequency in the 3-day measurement window.
3. **L1-interference priors** (this doc's column 1) — categories marked "Yes — iconic" or "Yes" should be considered *plausible* fossilization candidates; categories marked "No" at the same frequency are more likely transient and less worth escalating.

The Adaptation Engine currently uses only signals 1 and 2. Signal 3 is **not** yet coded — this doc provides the priors for a future enhancement that weighs L1-interference categories more heavily (i.e., escalate `ser_vs_estar_core` at 55% frequency but wait for `present_tense_regular` to hit 70%). Filed as a follow-up consideration, not a blocker.

## 8. Bridge Function Specification

`mapErrorCategoryToFeatureKey(errorType, category)` in `src/lib/db/queries.ts` must:

1. Return the feature key column from §4 for the given (errorType, category).
2. Return `null` for categories marked `null` in the Bridge column.
3. Use direct lookup first; fall back to substring match on normalized category (matches RO pattern).

Current RO version at `queries.ts:642-675` must be replaced wholesale — RO feature keys (`definite_article`, `past_tense_perfect_compus`, etc.) have no ES counterparts.
