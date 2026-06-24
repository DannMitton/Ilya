/**
 * Shane pacifier: contrast verification tests.
 *
 * Run with: pnpm vitest (or `pnpm test` once wired into package.json).
 *
 * Three layers:
 *   1. Unit tests pinning the WCAG maths against known reference values, so
 *      the computation itself can't drift.
 *   2. Obligation tests asserting two honesty properties of the Route B
 *      registry: every 'locked' state combination clears its WCAG
 *      threshold, and every 'owned-exception' is in fact sub-threshold.
 *      The first fails loudly if a styling change drops a locked state below
 *      contrast; the second fails loudly if a change lifts an owned
 *      exception into compliance, which is the signal to reclassify it as
 *      'locked' rather than leave it mislabelled.
 *   3. Regression pins fixing the exact ratios computed for spec v6, so a
 *      token change that happens to stay on the right side of a threshold
 *      is still caught as a drift.
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

describe('palette', () => {
	// Route B added white, arc-green, and signal-red. Pin them so a typo in a
	// hex value surfaces here rather than as a silently wrong ratio.
	it('carries the Route B additions and the v11 prep-amber', () => {
		expect(PALETTE['white']).toEqual([255, 255, 255]);
		expect(PALETTE['arc-green']).toEqual([29, 185, 84]);
		expect(PALETTE['signal-red']).toEqual([163, 45, 45]);
		expect(PALETTE['prep-amber']).toEqual([188, 126, 8]);
	});
});

describe('pacifier state contrast obligations (Route B)', () => {
	const results = evaluateAll();

	// Composition of the registry. Guards against an obligation being added
	// or dropped without the change being noticed here.
	it('has the expected status counts: 12 locked, 6 owned-exception, 0 policy-pending', () => {
		const count = (s: string) => results.filter((r) => r.status === s).length;
		expect(count('locked')).toBe(12);
		expect(count('owned-exception')).toBe(6);
		expect(count('policy-pending')).toBe(0);
	});

	// Every locked obligation must clear its threshold. If one fails, the
	// failure message names the state, element, ratio, and threshold so the
	// regression is immediately legible.
	const locked = results.filter((r) => r.status === 'locked');

	it.each(locked)(
		'locked $state $element: $ratio:1 meets $threshold:1 ($kind)',
		(r) => {
			expect(
				r.pass,
				`${r.state} ${r.element}: ${r.ratio.toFixed(2)}:1 < ${r.threshold}:1 threshold`
			).toBe(true);
		}
	);

	// Every owned-exception must in fact be sub-threshold. These are
	// deliberate accepted deviations; if one starts clearing its threshold,
	// the honest move is to reclassify it as 'locked', not to leave it
	// labelled an exception. This test fails to force that relabelling.
	const owned = results.filter((r) => r.status === 'owned-exception');

	it.each(owned)(
		'owned-exception $state $element: $ratio:1 is below $threshold:1 ($kind)',
		(r) => {
			expect(
				r.pass,
				`${r.state} ${r.element}: ${r.ratio.toFixed(2)}:1 now clears the ${r.threshold}:1 threshold; reclassify as 'locked'`
			).toBe(false);
		}
	);

	// Policy-pending obligations are reported but neither required to pass
	// nor required to fail (undecided). None at present; this block
	// keeps a deferral visible in test output if one is ever added.
	const pending = results.filter((r) => r.status === 'policy-pending');
	if (pending.length > 0) {
		it.each(pending)(
			'[policy-pending] $state $element: $ratio:1 (threshold $threshold:1, not enforced)',
			(r) => {
				expect(typeof r.ratio).toBe('number');
			}
		);
	}
});

describe('contrast regression pins (spec v6 computed values)', () => {
	// These pin the exact ratios computed under Route B, so a token change
	// that happens to stay on the right side of a threshold is still caught.
	const byKey = (state: string, element: string) =>
		evaluate(OBLIGATIONS.find((o) => o.state === state && o.element === element)!);

	// Glyphs on the white interior.
	it('dormant glyph (owned) is ~3.42:1', () => {
		expect(byKey('dormant', 'glyph').ratio).toBeCloseTo(3.42, 1);
	});
	it('deselected glyph is ~6.66:1', () => {
		expect(byKey('deselected', 'glyph').ratio).toBeCloseTo(6.66, 1);
	});
	it('listening glyph is ~9.47:1', () => {
		expect(byKey('listening', 'glyph').ratio).toBeCloseTo(9.47, 1);
	});
	it('working glyph is ~9.47:1', () => {
		expect(byKey('working', 'glyph').ratio).toBeCloseTo(9.47, 1);
	});
	it('captured glyph is ~17.99:1', () => {
		expect(byKey('captured', 'glyph').ratio).toBeCloseTo(17.99, 1);
	});

	// Outlines against the band.
	it('dormant outline (owned) is ~2.10:1', () => {
		expect(byKey('dormant', 'outline').ratio).toBeCloseTo(2.10, 1);
	});
	it('deselected outline is ~3.85:1', () => {
		expect(byKey('deselected', 'outline').ratio).toBeCloseTo(3.85, 1);
	});
	it('listening outline (owned) is ~1.87:1', () => {
		expect(byKey('listening', 'outline').ratio).toBeCloseTo(1.87, 1);
	});
	it('working outline is ~3.30:1', () => {
		expect(byKey('working', 'outline').ratio).toBeCloseTo(3.30, 1);
	});
	it('captured outline (owned) is ~2.50:1', () => {
		expect(byKey('captured', 'outline').ratio).toBeCloseTo(2.50, 1);
	});

	// Progress arc and white resting fill (both owned exceptions).
	it('progress arc (owned) is ~1.73:1 against the band', () => {
		expect(byKey('working', 'progress-arc').ratio).toBeCloseTo(1.73, 1);
	});
	it('resting fill (owned) is ~1.50:1 against the band', () => {
		expect(byKey('resting', 'fill').ratio).toBeCloseTo(1.50, 1);
	});

	// Badges.
	it('captured badge mark is ~9.47:1', () => {
		expect(byKey('captured', 'badge-mark').ratio).toBeCloseTo(9.47, 1);
	});
	it('captured badge disc is ~6.32:1 (band-governed)', () => {
		expect(byKey('captured', 'badge-disc').ratio).toBeCloseTo(6.32, 1);
	});
	it('retake badge mark is ~7.07:1', () => {
		expect(byKey('retake', 'badge-mark').ratio).toBeCloseTo(7.07, 1);
	});
	it('retake badge disc is ~4.72:1 (band-governed)', () => {
		expect(byKey('retake', 'badge-disc').ratio).toBeCloseTo(4.72, 1);
	});

	// v11 prep-countdown flash (locked): a full-opacity fill on the white
	// interior, and the IPA glyph at the peak of that flash.
	it('prep flash is ~3.43:1 on the white interior', () => {
		expect(byKey('preparing', 'prep-flash').ratio).toBeCloseTo(3.43, 1);
	});
	it('prep-flash glyph is ~5.25:1 on the amber peak', () => {
		expect(byKey('preparing', 'glyph').ratio).toBeCloseTo(5.25, 1);
	});
});
