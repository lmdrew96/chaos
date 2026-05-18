// @chaos/lang-config — language module interface shared by ChaosLengua and ChaosLimbă.
//
// Codifies the contract a per-language module must satisfy (intonation rules,
// error taxonomy, and UI config). The `ui` section drives the shared Sidebar
// and TopBar components in @chaos/ui — brand name, logo stroke, nav items, and
// quick-access tools are all language-specific.

import type { ComponentType } from 'react'

// ─── Intonation ───

export interface StressVariant {
  /** English gloss — what this pronunciation means */
  meaning: string;
  /** Semantic category (e.g. 'food', 'violence', 'furniture') */
  category: string;
  /** IPA notation with primary stress marker (ˈ) and syllable boundaries (.) */
  ipa: string;
  /** Importance of getting this right; drives Error Garden severity */
  severity?: 'low' | 'medium' | 'high';
  /** Example sentence using this stress variant */
  example_sentence?: string;
}

/**
 * A word's set of stress variants, keyed by the human-readable stress pattern
 * (e.g. "TOR-tu-ri" vs "tor-TU-ri"). Index signature matches the per-app
 * STRESS_MINIMAL_PAIRS table shape exactly.
 */
export interface MinimalPair {
  [stressPattern: string]: StressVariant;
}

/** Runtime warning emitted when the user's stress pattern flips meaning. */
export interface IntonationWarning {
  word: string;
  /** Word index in the sentence */
  position: number;
  /** Context-appropriate stress */
  expected_stress: string;
  /** Stress the user actually produced */
  user_stress: string;
  expected_meaning: string;
  actual_meaning: string;
  severity: 'low' | 'medium' | 'high';
  /** User-facing explanation of the meaning shift */
  explanation: string;
}

/** A single (word, stress) observation from the intonation pipeline. */
export interface StressPattern {
  word: string;
  stress: string;
}

export interface IntonationRules {
  /** Word → stress variants. Same shape as the per-app spamD STRESS_MINIMAL_PAIRS map. */
  minimalPairs: Record<string, MinimalPair>;
}

// ─── Error taxonomy ───

/** Error category names exposed to the classifier prompt and downstream feature mapping. */
export type ErrorCategoryList = readonly string[];

export interface ErrorTaxonomy {
  grammar: ErrorCategoryList;
  pronunciation: ErrorCategoryList;
  vocabulary: ErrorCategoryList;
  word_order: ErrorCategoryList;
  /**
   * Optional dialectal policy text injected into the classifier system prompt.
   * Spanish embeds a multi-line LatAm-neutral policy; Romanian has none today.
   */
  classifierDialectalPolicy?: string;
}

// ─── CEFR ───

/** CEFR level union. Defined locally to keep this package zero-dep (no @chaos/db coupling). */
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// ─── UI config ───

/** A sidebar navigation item. Icons are typed as React components; pass Lucide icons directly. */
export interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
}

/** A quick-access tool entry in the top-bar Sparkles dropdown. */
export interface QuickTool {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface LangConfigUI {
  /** Display name rendered in the sidebar and top-bar logo lockup. */
  brandName: string;
  /** SVG path `d=` attribute for the distinctive top flourish of the Chaos atom logo. */
  logoStrokePath: string;
  /** Ordered list of sidebar nav items. Language-specific items (e.g. Pronunciación) are included here. */
  navItems: NavItem[];
  /** Language-specific quick-access tools shown in the top-bar Sparkles dropdown. */
  quickTools: QuickTool[];
}

// ─── Master interface ───

export interface LangConfig {
  /** ISO 639-1 code, e.g. 'es', 'ro' */
  code: string;
  /** English display name, e.g. 'Spanish', 'Romanian' */
  name: string;
  intonation: IntonationRules;
  errorTaxonomy: ErrorTaxonomy;
  ui?: LangConfigUI;
}
