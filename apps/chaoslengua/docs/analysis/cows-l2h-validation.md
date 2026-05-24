# COWS-L2H Validation — Stage 1 Fossilization Thresholds
*Generated: 2026-05-24 | Corpus: UC Davis COWS-L2H v2.0 | Filter: L1=English, SPA 1–24*

## Methodology

**Data source:** [COWS-L2H](https://github.com/ucdaviscl/cowsl2h) — short essays from UC Davis
SPA 1–24 students, annotated with expert error corrections in `[orig]{corr}<tag>` format.

**Filters applied:**
- L1 English speakers only (`l1 language` field contains "English", excludes "Spanish" mono-L1)
- Heritage speaker courses excluded (SPA 31–33)
- CEFR mapping: SPA 1–2 → A1-A2 | SPA 3, SPA 21 → B1 | SPA 22–24 → B2

**Annotation columns:**
- ser/estar and pret/imp: `verbs annotation ann1` (falls back to `updated anntoation ann1`)
- por/para and object pronouns: `updated anntoation ann1`
- ann2 columns excluded (inter-annotator reliability samples, not additive counts)

**Denominator notes:**
- ser/estar total = all conjugated ser+estar tokens in raw essay
- por/para total = all "por" + "para" word tokens
- pret/imp total = all preterite + imperfect tokens (combined, as both are at risk)
- object pronoun total = all clitic tokens (me/te/lo/la/le/nos/os/los/las/les/se) — **overestimates** because lo/la/los/las are often definite articles; interpret obj-pron rate as a lower bound

**Pret/imp filter:** Only `fs:st:t` / `fs:ct:t` / `fs:st:t:mo` annotations where the
original form is preterite and the correction is imperfect (or vice versa). Excludes
present→past, past→pluperfect, tense→infinitive, and other tense errors.

**Object pronoun filter:** `ga:pron`, `gat:pron`, `na:pron`, `ab:pron` annotations where
orig or corr contains a clitic form. Demonstrative/indefinite agreement errors (`ga:pron` on
este/ese/uno/otro etc.) are counted separately and excluded from object-pronoun rates.

---

## Summary Table

| CEFR Level | Essays | ser/estar errors | Total ser+estar | Error rate | por/para errors | Total por+para | Error rate | pret/imp errors | Total pret+imp | Error rate | obj-pron errors | Total clitics | Error rate |
| A1-A2 | 1150 | 342 | 13159 | 2.6% | 123 | 3788 | 3.2% | 137 | 9015 | 1.5% | 29 | 17273 | 0.2% |
| B1 | 1122 | 366 | 14483 | 2.5% | 152 | 4839 | 3.1% | 300 | 14543 | 2.1% | 29 | 19511 | 0.1% |
| B2 | 812 | 293 | 10069 | 2.9% | 148 | 4333 | 3.4% | 281 | 11663 | 2.4% | 27 | 15742 | 0.2% |

---

## 1. ser/estar Confusion

**Annotation tag:** `conf:v:seta`

| CEFR | Errors | Total uses | Rate |
|---|---|---|---|
| A1-A2 | 342 | 13159 | 2.6% |
| B1 | 366 | 14483 | 2.5% |
| B2 | 293 | 10069 | 2.9% |

**Top 10 error pairs by CEFR level:**

*A1-A2:*

| Pair | Count |
|---|---|
| `es→está` | 74 |
| `está→es` | 24 |
| `esta→es` | 23 |
| `era→estaba` | 20 |
| `están→son` | 14 |
| `son→están` | 13 |
| `estar→ser` | 12 |
| `soy→estoy` | 12 |
| `estoy→soy` | 12 |
| `fue→estaba` | 11 |

*B1:*

| Pair | Count |
|---|---|
| `es→está` | 46 |
| `era→estaba` | 35 |
| `estaba→era` | 26 |
| `estoy→soy` | 23 |
| `fue→estaba` | 21 |
| `está→es` | 15 |
| `Estoy→Soy` | 14 |
| `esta→es` | 12 |
| `ser→estar` | 11 |
| `están→son` | 11 |

*B2:*

| Pair | Count |
|---|---|
| `estaba→era` | 28 |
| `es→está` | 27 |
| `era→estaba` | 26 |
| `está→es` | 18 |
| `ser→estar` | 17 |
| `estar→ser` | 16 |
| `estoy→soy` | 14 |
| `fue→estaba` | 11 |
| `son→están` | 10 |
| `están→son` | 10 |



---

## 2. por/para Confusion

**Annotation tag:** `conf:prep:popa`

| CEFR | Errors | Total uses | Rate |
|---|---|---|---|
| A1-A2 | 123 | 3788 | 3.2% |
| B1 | 152 | 4839 | 3.1% |
| B2 | 148 | 4333 | 3.4% |

**Top 10 error pairs by CEFR level:**

*A1-A2:*

| Pair | Count |
|---|---|
| `para→por` | 58 |
| `por→para` | 54 |
| `Por→Para` | 5 |
| `Para→Por` | 3 |
| `Es→Está` | 1 |
| `por→Para` | 1 |
| `Por→para` | 1 |

*B1:*

| Pair | Count |
|---|---|
| `para→por` | 85 |
| `por→para` | 60 |
| `Por→Para` | 4 |
| `Para→Por` | 3 |

*B2:*

| Pair | Count |
|---|---|
| `para→por` | 94 |
| `por→para` | 50 |
| `Para→Por` | 2 |
| `estaba→era` | 1 |
| `Por→Para` | 1 |



---

## 3. Preterite / Imperfect Confusion

**Annotation tags:** `fs:st:t`, `fs:ct:t`, `fs:st:t:mo` (filtered to pret↔imp swaps only)

| CEFR | Errors | Total uses | Rate |
|---|---|---|---|
| A1-A2 | 137 | 9015 | 1.5% |
| B1 | 300 | 14543 | 2.1% |
| B2 | 281 | 11663 | 2.4% |

**Top 10 error pairs by CEFR level:**

*A1-A2:*

| Pair | Count |
|---|---|
| `fue→era` | 23 |
| `era→fue` | 8 |
| `gustó→gustaba` | 7 |
| `estuvo→estaba` | 5 |
| `Fue→Era` | 4 |
| `estuve→estaba` | 4 |
| `tuvo→tenía` | 3 |
| `tuve→tenía` | 3 |
| `fui→iba` | 3 |
| `fue→estaba` | 3 |

*B1:*

| Pair | Count |
|---|---|
| `fue→era` | 51 |
| `era→fue` | 23 |
| `fue→estaba` | 11 |
| `pudo→podía` | 10 |
| `tuvo→tenía` | 9 |
| `tuve→tenía` | 8 |
| `Fue→Era` | 7 |
| `fue→iba` | 6 |
| `estuvo→estaba` | 6 |
| `tenía→tuve` | 6 |

*B2:*

| Pair | Count |
|---|---|
| `fue→era` | 42 |
| `era→fue` | 19 |
| `tuve→tenía` | 14 |
| `tuvo→tenía` | 7 |
| `Fue→Era` | 6 |
| `fue→estaba` | 5 |
| `pudo→podía` | 5 |
| `estuve→estaba` | 4 |
| `estuvo→estaba` | 4 |
| `fueron→eran` | 4 |



---

## 4. Object Pronoun Errors

**Annotation tags:** `ga:pron`, `gat:pron`, `na:pron`, `ab:pron` (clitic forms only)

*Note: demonstrative/indefinite agreement errors (este/ese/uno/otra etc.) are tracked under
the same `ga:pron` tag but are excluded here.*

| CEFR | Errors | Total uses | Rate |
|---|---|---|---|
| A1-A2 | 29 | 17273 | 0.2% |
| B1 | 29 | 19511 | 0.1% |
| B2 | 27 | 15742 | 0.2% |

**Top 10 error pairs by CEFR level:**

*A1-A2:*

| Pair | Count |
|---|---|
| `lo→la` | 11 |
| `le→les` | 7 |
| `los→las` | 5 |
| `Los→Las` | 1 |
| `les→las` | 1 |
| `la→lo` | 1 |
| `Lo→Le` | 1 |
| `los→lo` | 1 |
| `Las→Los` | 1 |

*B1:*

| Pair | Count |
|---|---|
| `le→les` | 7 |
| `los→las` | 6 |
| `le→la` | 4 |
| `lo→la` | 4 |
| `el→lo` | 2 |
| `lo→los` | 1 |
| `Los→La` | 1 |
| `les→le` | 1 |
| `Los→Las` | 1 |
| `Le→La` | 1 |

*B2:*

| Pair | Count |
|---|---|
| `le→la` | 5 |
| `lo→la` | 4 |
| `lo→los` | 3 |
| `le→les` | 2 |
| `los→las` | 2 |
| `Lo→La` | 2 |
| `Lo→la` | 1 |
| `El→La` | 1 |
| `lo→las` | 1 |
| `el→la` | 1 |



**Demonstrative/indefinite pronoun agreement errors (informational):**

| CEFR | Demo-pron errors |
|---|---|
| A1-A2 | 24 |
| B1 | 42 |
| B2 | 39 |

---

## 5. Threshold Comparison

**Current ChaosLengua fossilization thresholds** (from `src/lib/ai/adaptation.ts`):
- `NUDGE_THRESHOLD` = 40% — pattern enters adaptation awareness
- `FOSSILIZATION_THRESHOLD` = 70% — tier 2/3 escalation

**Important calibration note:** These thresholds operate on *per-learner* error rates within
ChaosLengua sessions — i.e., how often a single learner makes a specific error type across
their recent productions. The rates below are *corpus-wide aggregates* across all L1-English
learners at each CEFR level. Corpus-wide rates are expected to be much lower (5–15%) than
per-learner fossilization rates (40–80%), because not every learner has fossilized every
pattern. A corpus rate of 8% on ser/estar means ~8% of all ser/estar uses in the corpus are
wrong — but an individual learner who has fossilized this pattern may hit 60–80%.

| Category | CEFR | Error rate | vs NUDGE (40%) | vs FOSSILIZATION (70%) | Flag |
|---|---|---|---|---|---|
| ser/estar | A1-A2 | 2.6% | ❌ below (gap: 37.4pp) | ✅ below (gap: 67.4pp) | 🟢 below threshold |
| ser/estar | B1 | 2.5% | ❌ below (gap: 37.5pp) | ✅ below (gap: 67.5pp) | 🟢 below threshold |
| ser/estar | B2 | 2.9% | ❌ below (gap: 37.1pp) | ✅ below (gap: 67.1pp) | 🟢 below threshold |
| por/para | A1-A2 | 3.2% | ❌ below (gap: 36.8pp) | ✅ below (gap: 66.8pp) | 🟢 below threshold |
| por/para | B1 | 3.1% | ❌ below (gap: 36.9pp) | ✅ below (gap: 66.9pp) | 🟢 below threshold |
| por/para | B2 | 3.4% | ❌ below (gap: 36.6pp) | ✅ below (gap: 66.6pp) | 🟢 below threshold |
| pret/imp | A1-A2 | 1.5% | ❌ below (gap: 38.5pp) | ✅ below (gap: 68.5pp) | 🟢 below threshold |
| pret/imp | B1 | 2.1% | ❌ below (gap: 37.9pp) | ✅ below (gap: 67.9pp) | 🟢 below threshold |
| pret/imp | B2 | 2.4% | ❌ below (gap: 37.6pp) | ✅ below (gap: 67.6pp) | 🟢 below threshold |
| obj-pron | A1-A2 | 0.2% | ❌ below (gap: 39.8pp) | ✅ below (gap: 69.8pp) | 🟢 below threshold |
| obj-pron | B1 | 0.1% | ❌ below (gap: 39.9pp) | ✅ below (gap: 69.9pp) | 🟢 below threshold |
| obj-pron | B2 | 0.2% | ❌ below (gap: 39.8pp) | ✅ below (gap: 69.8pp) | 🟢 below threshold |


### Interpretation

The corpus-wide rates are substantially below both thresholds for all four patterns at all
CEFR levels. This is expected: corpus aggregates dilute individual fossilization signals.

**What this validates:**
1. **Pattern prevalence** — All four Stage 1 patterns appear in the corpus, confirming they
   are genuine learner error categories for L1-English learners at these levels.
2. **Relative difficulty ordering** — Compare rates across CEFR levels and categories to
   see which patterns persist into higher levels (indicating fossilization risk).
3. **Content sequencing** — Categories with higher B1/B2 rates relative to A1-A2 are
   candidates for increased Error Garden weight at those levels.

**Sequencing signal:** If a pattern's error rate *increases* from A1-A2 → B1 or B1 → B2,
that suggests the pattern becomes more cognitively demanding at higher levels (more complex
structures, less rote repetition) — a signal to reinforce Error Garden routing at those
levels rather than back-loading to lower levels.

---

## 6. Implications for Error Garden Weighting

| Pattern | Evidence | Suggested adjustment |
|---|---|---|
| ser/estar | Errors present across all levels; highest absolute count reflects high usage frequency | No change — current Stage 1 priority confirmed |
| por/para | Low absolute error counts (por/para are relatively rare in short essays) | Consider increasing content density at B1+ where por/para usage contexts expand |
| pret/imp | Errors peak at B1 (expected: first exposure to past tense contrast) | Confirm B1 content weight is highest; B2 rate signals persistence risk |
| obj-pron | Denominator overestimates (lo/la/los/las counted as clitic); true rate is higher | Run a targeted recount excluding definite-article contexts for precise rate |

*All threshold adjustments should be validated against in-app per-learner error rates once
sufficient session data accumulates.*

---

*Script: `apps/chaoslengua/scripts/analyze-cows-l2h.ts`*
*Corpus: [github.com/ucdaviscl/cowsl2h](https://github.com/ucdaviscl/cowsl2h)*

---

**Status:** Directional baselines from this report are now wired into the Adaptation Engine via `populationBaseline` on the grammar feature map. Six directional sub-features (ser-overuse, estar-overuse, por-overuse, para-overuse, preterite-overuse, imperfect-overuse) and aggregate baselines for `ser_estar_contrast`, `preterite_imperfect_contrast`, `direct_object_pronoun_preverbal`, and `indirect_object_pronoun_preverbal` were added to `seed-grammar-features-es.ts`. The Adaptation Engine now flags patterns at 4× (nudge) and 8× (fossilized) the population baseline, catching sub-40% directional fossilization that absolute thresholds miss.
