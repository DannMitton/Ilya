/**
 * Tests for the Fit provenance legend (item 1.6).
 *
 * The rule these obey, Dann's standing condition: no acceptance test may take
 * its expected value from the mechanism under test. So every expectation below
 * comes from the item's own contract rather than from a reading of the code:
 *
 *   1. **Only states that are present.** E.22 §4's clause is "never guesses
 *      where calibration is absent"; a legend naming a state the singer does
 *      not have is a guess about their voice.
 *   2. **`Unmeasured` is orthogonal** (item 1.4b, `engine/types.ts:48-63`): it
 *      rides on `noiseFloor`, so it can co-occur with any reading, and one
 *      unmeasurable room among ten earns the entry.
 *   3. **Most evidence to least**, then `Unmeasured` last, because it is a
 *      statement about our instrument rather than about the singer.
 */

import { describe, it, expect } from 'vitest';
import { buildFitLegend, fitLegendTypes, FIT_LEGEND_ORDER } from './fit-legend';
import type { CalibratedFormant, Vowel } from './engine/types';
import { WITHHELD_SIGLA } from '@ilya/score-parser';

/** A reading with only the fields this legend reads; the rest is scaffolding. */
function reading(
	r: CalibratedFormant['reading'],
	noiseFloor?: CalibratedFormant['noiseFloor']
): CalibratedFormant {
	return {
		f1: 500,
		f2: 1500,
		confidence: 'medium',
		reading: r,
		source: r === 'estimated' ? 'derived-interpolated' : 'measured-user',
		...(noiseFloor ? { noiseFloor } : {})
	};
}

const profile = (m: Partial<Record<Vowel, CalibratedFormant>>) => m;

describe('the Fit legend names only what the singer actually has', () => {
	it('an empty profile earns no legend at all', () => {
		expect(fitLegendTypes({})).toEqual([]);
		expect(buildFitLegend({}, 'en')).toEqual([]);
	});

	it('a profile of one captured vowel names captured and nothing else', () => {
		expect(fitLegendTypes(profile({ i: reading('captured') }))).toEqual(['fit-captured']);
	});

	it('a profile with no estimated vowels never mentions estimated', () => {
		const types = fitLegendTypes(
			profile({ i: reading('captured'), e: reading('provisional') })
		);
		expect(types).toEqual(['fit-captured', 'fit-provisional']);
		expect(types).not.toContain('fit-estimated');
	});

	it('all three reading states, in most-evidence-first order', () => {
		// Deliberately inserted in the WRONG order, so a builder that simply
		// echoed insertion order would fail this.
		const types = fitLegendTypes(
			profile({
				ɨ: reading('estimated'),
				e: reading('provisional'),
				i: reading('captured')
			})
		);
		expect(types).toEqual(['fit-captured', 'fit-provisional', 'fit-estimated']);
	});
});

describe('Unmeasured is orthogonal, not a fourth reading', () => {
	it('one unmeasurable room among many earns the entry', () => {
		const types = fitLegendTypes(
			profile({
				i: reading('captured'),
				e: reading('captured'),
				a: reading('captured', 'unmeasured')
			})
		);
		expect(types).toContain('fit-unmeasured');
	});

	it('co-occurs with captured rather than replacing it', () => {
		// The whole point of the ruling: "we heard you perfectly and could not
		// measure your room" is two facts, not one verdict.
		expect(fitLegendTypes(profile({ i: reading('captured', 'unmeasured') }))).toEqual([
			'fit-captured',
			'fit-unmeasured'
		]);
	});

	it('a measured noise floor earns nothing', () => {
		expect(fitLegendTypes(profile({ i: reading('captured', 'measured') }))).toEqual([
			'fit-captured'
		]);
	});

	it('sorts last, after every reading state', () => {
		const types = fitLegendTypes(
			profile({
				i: reading('captured', 'unmeasured'),
				e: reading('provisional'),
				ɨ: reading('estimated')
			})
		);
		expect(types).toEqual([
			'fit-captured',
			'fit-provisional',
			'fit-estimated',
			'fit-unmeasured'
		]);
		expect(types[types.length - 1]).toBe('fit-unmeasured');
	});
});

describe('the built items carry what the footer needs', () => {
	const full = profile({
		i: reading('captured', 'unmeasured'),
		e: reading('provisional'),
		ɨ: reading('estimated')
	});

	it('every item is textOnly, because Fit states are words on the page and not glyphs', () => {
		for (const item of buildFitLegend(full, 'en')) {
			expect(item.textOnly).toBe(true);
			expect(item.icon).toBe('');
		}
	});

	it('every entry has copy in both languages, and they differ', () => {
		const en = buildFitLegend(full, 'en');
		const fr = buildFitLegend(full, 'fr');
		expect(en).toHaveLength(fr.length);
		for (let i = 0; i < en.length; i++) {
			expect(en[i].type).toBe(fr[i].type);
			expect(en[i].label.length).toBeGreaterThan(0);
			expect(fr[i].label.length).toBeGreaterThan(0);
			// The control that catches a missing translation falling back to
			// English rather than being absent, which would read as done.
			expect(fr[i].label).not.toBe(en[i].label);
		}
	});

	it('covers every type in the declared order, with no orphans', () => {
		const built = buildFitLegend(full, 'en').map((x) => x.type);
		for (const type of FIT_LEGEND_ORDER) {
			expect(built).toContain(type);
		}
		expect(built).toEqual([...FIT_LEGEND_ORDER]);
	});
});

// ── N.10b: the withheld-syllable entry ───────────────────────────────
//
// Dann's ruling of 7 August, E.29 §5.1 ruled A. The contract these obey is
// the one the four voice states already obey, applied to a fifth thing that
// is not a voice state at all: emitted only when the page carries the mark,
// last because it is the only entry not about the singer, and never allowed
// to disturb the four when the flag is off.

describe('the withheld-syllable entry (N.10b)', () => {
	const captured: CalibratedFormant = {
		reading: 'captured'
	} as CalibratedFormant;

	it('is absent when the page carries no withheld syllable', () => {
		expect(buildFitLegend({}, 'en')).toEqual([]);
		expect(buildFitLegend({}, 'en', {})).toEqual([]);
		expect(buildFitLegend({}, 'en', { withheldSyllables: false })).toEqual([]);
	});

	it('is the whole legend on an uncalibrated page that withheld a syllable', () => {
		// The two subjects are independent: a singer with no profile at all can
		// still have a score whose division Ilya could not follow.
		const built = buildFitLegend({}, 'en', { withheldSyllables: true });
		expect(built).toHaveLength(1);
		expect(built[0].type).toBe('fit-withheld');
	});

	it('sits last, after every voice state', () => {
		const formants = { i: captured } as Partial<Record<Vowel, CalibratedFormant>>;
		const built = buildFitLegend(formants, 'en', { withheldSyllables: true });
		expect(built.length).toBeGreaterThan(1);
		expect(built[built.length - 1].type).toBe('fit-withheld');
		// And it did not displace the voice states, which is the control: the
		// flag must add an entry, never rewrite the list.
		expect(built.slice(0, -1)).toEqual(buildFitLegend(formants, 'en'));
	});

	it('is the one Fit entry that draws a circle, in both languages', () => {
		// Dann's ruling of 8 August: the page mark is a drawn sigla, so the
		// legend shows the sigla. Every other Fit entry is a word in the page's
		// prose and carries no circle, which the tests above assert.
		for (const language of ['en', 'fr'] as const) {
			const item = buildFitLegend({}, language, { withheldSyllables: true })[0];
			expect(item.textOnly).toBe(false);
			expect(item.label.length).toBeGreaterThan(20);
			// The old typeset mark must not survive in the copy: the glyph is
			// drawn now, and a label quoting brackets would name a mark the page
			// no longer prints.
			expect(item.label).not.toContain('[?]');
		}
		// And the renderer's constant is real, which is what PageFooter draws.
		expect(WITHHELD_SIGLA.path.length).toBeGreaterThan(100);
		expect(WITHHELD_SIGLA.colour).toMatch(/^#[0-9A-Fa-f]{6}$/);
	});
});
