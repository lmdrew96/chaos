import { evaluateFossilization } from '@chaos/core-ai';

describe('evaluateFossilization', () => {
  const noBaseline = { populationBaseline: null };

  describe('absolute-threshold path (no populationBaseline)', () => {
    it('flags fossilized at >= 70%', () => {
      const verdict = evaluateFossilization(noBaseline, 70, 'B1');
      expect(verdict.tier).toBe('fossilized');
      expect(verdict.reason).toBe('absolute');
    });

    it('flags nudge at >= 40%', () => {
      const verdict = evaluateFossilization(noBaseline, 45, 'B1');
      expect(verdict.tier).toBe('nudge');
      expect(verdict.reason).toBe('absolute');
    });

    it('returns normal at < 40% with no baseline', () => {
      const verdict = evaluateFossilization(noBaseline, 3, 'B1');
      expect(verdict.tier).toBe('normal');
    });
  });

  describe('baseline-relative path', () => {
    it('flags fossilized at 8× or more the population baseline', () => {
      // 12% ser-overuse, A1-A2 baseline 1.1% → ratio = 10.9× → fossilized
      const feature = { populationBaseline: { A1_A2: 0.011 } };
      const verdict = evaluateFossilization(feature, 12, 'A1_A2');
      expect(verdict.tier).toBe('fossilized');
      expect(verdict.reason).toBe('baseline-relative');
      expect(verdict.ratio).toBeCloseTo(12 / 100 / 0.011, 1);
    });

    it('flags nudge at 4×–8× the population baseline', () => {
      // 6% rate, baseline 1.1% → ratio ≈ 5.5× → nudge
      const feature = { populationBaseline: { B1: 0.011 } };
      const verdict = evaluateFossilization(feature, 6, 'B1');
      expect(verdict.tier).toBe('nudge');
      expect(verdict.reason).toBe('baseline-relative');
    });

    it('returns normal at < 4× the population baseline', () => {
      // 5% rate, baseline 1.5% → ratio ≈ 3.3× → no flag
      const feature = { populationBaseline: { B1: 0.015 } };
      const verdict = evaluateFossilization(feature, 5, 'B1');
      expect(verdict.tier).toBe('normal');
    });

    it('picks the correct CEFR band from populationBaseline', () => {
      const feature = { populationBaseline: { A1_A2: 0.001, B1: 0.011, B2: 0.020 } };
      // At A1_A2: 12% / 0.1% = 120× → fossilized
      expect(evaluateFossilization(feature, 12, 'A1_A2').tier).toBe('fossilized');
      // At B2: 12% / 2% = 6× → nudge (between 4× and 8×)
      expect(evaluateFossilization(feature, 12, 'B2').tier).toBe('nudge');
    });

    it('absolute threshold still fires for high-error patterns with no baseline', () => {
      const verdict = evaluateFossilization(noBaseline, 45, 'B1');
      expect(verdict.tier).toBe('nudge');
      expect(verdict.reason).toBe('absolute');
    });

    it('absolute threshold takes precedence over baseline-relative at >= 70%', () => {
      // Even if baseline says fossilized, absolute fires first
      const feature = { populationBaseline: { B1: 0.001 } };
      const verdict = evaluateFossilization(feature, 70, 'B1');
      expect(verdict.tier).toBe('fossilized');
      expect(verdict.reason).toBe('absolute');
    });
  });
});
