/**
 * Shane pacifier — contrast verification tests.
 *
 * Run with: pnpm vitest (or `pnpm test` once wired into package.json).
 *
 * Two layers:
 *   1. Unit tests pinning the WCAG maths against known reference values, so
 *      the computation itself can't drift.
 *   2. Obligation tests asserting every 'locked' pacifier state combination
 *      clears its WCAG threshold. These are the tests that fail loudly if a
 *      future styling change drops a state below contrast.
 */

import { describe, it, expect } from 'vitest';
import {
	hexToRgb,
	composite,
	relativeLuminance,
	contrastRatio,
	evaluate,
	evaluateAll,
	OBLIGATIONS,
	PALETTE,
	type RGB
} from './contrast';

describe('hexToRgb', () => {
	it('parses with and without leading hash', () => {
		expect(hexToRgb('#1A1612')).toEqual([26, 22, 18]);
		expect(hexToRgb('1A1612')).toEqual([26, 22, 18]);
	});

	it('rejects malformed hex', () => {
		expect(() => hexToRgb('#FFF')).toThrow();
		expect(() => hexToRgb('#GGGGGG')).toThrow();
	});
});

describe('relativeLuminance', () => {
	// Reference values from the WCAG definition.
	it('is 1.0 for white and 0.0 for black', () => {
		expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1.0, 5);
		expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0.0, 5);
	});
});

describe('contrastRatio', () => {
	it('is 21:1 for black on white', () => {
		expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 1);
	});

	it('is 1:1 for identical colours', () => {
		expect(contrastRatio([120, 120, 120], [120, 120, 120])).toBeCloseTo(1, 5);
	});

	it('is symmetric in argument order', () => {
		const a: RGB = [26, 22, 18];
		const b: RGB = [216, 208, 224];
		expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
	});
});

describe('composite', () => {
	it('returns the foreground at full alpha', () => {
		expect(composite([10, 20, 30], 1, [200, 200, 200])).toEqual([10, 20, 30]);
	});

	it('returns the background at zero alpha', () => {
		expect(composite([10, 20, 30], 0, [200, 200, 200])).toEqual([200, 200, 200]);
	});

	it('rejects out-of-range alpha', () => {
		expect(() => composite([0, 0, 0], 1.5, [255, 255, 255])).toThrow();
	});
});

describe('pacifier state contrast obligations', () => {
	const results = evaluateAll();

	// Every locked obligation must clear its threshold. If one fails, the
	// failure message names the state, element, ratio, and threshold so the
	// regression is immediately legible.
	const locked = results.filter((r) => r.status === 'locked');

	it.each(locked)(
		'$state $element: $ratio:1 meets $threshold:1 ($kind)',
		(r) => {
			expect(
				r.pass,
				`${r.state} ${r.element}: ${r.ratio.toFixed(2)}:1 < ${r.threshold}:1 threshold`
			).toBe(true);
		}
	);

	// Policy-pending obligations are reported but do not fail the suite.
	// This block exists so a deferral is visible in test output rather than
	// silently absent.
	const pending = results.filter((r) => r.status === 'policy-pending');
	if (pending.length > 0) {
		it.each(pending)(
			'[policy-pending] $state $element: $ratio:1 (threshold $threshold:1, not enforced)',
			(r) => {
				// Intentionally non-failing: record the number for visibility.
				expect(typeof r.ratio).toBe('number');
			}
		);
	}
});

describe('contrast regression pins (spec v5 confirmed values)', () => {
	// These pin the exact ratios documented in spec v5, so a token change
	// that happens to stay above threshold is still caught as a drift.
	const byKey = (state: string, element: string) =>
		evaluate(OBLIGATIONS.find((o) => o.state === state && o.element === element)!);

	it('dormant glyph is ~12.0:1', () => {
		expect(byKey('dormant', 'glyph').ratio).toBeCloseTo(12.0, 1);
	});

	it('deselected outline is ~3.85:1', () => {
		expect(byKey('deselected', 'outline').ratio).toBeCloseTo(3.85, 1);
	});

	it('deselected glyph is ~5.46:1', () => {
		expect(byKey('deselected', 'glyph').ratio).toBeCloseTo(5.46, 1);
	});

	it('captured glyph is ~4.80:1', () => {
		expect(byKey('captured', 'glyph').ratio).toBeCloseTo(4.8, 1);
	});

	it('listening glyph is ~9.66:1', () => {
		expect(byKey('listening', 'glyph').ratio).toBeCloseTo(9.66, 1);
	});
});
