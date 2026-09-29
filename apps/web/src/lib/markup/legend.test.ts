/**
 * Tests for the Markup legend, which since 2026-09-28 has one entry: the
 * withheld-syllable sigla (N.10b). Dann removed the four voice-state entries
 * that stood beside it ("Remove the four", 2026-09-28 22:18); see `legend.ts`.
 *
 * The rule these obey, Dann's standing condition: no acceptance test may take
 * its expected value from the mechanism under test. So every expectation below
 * comes from the entry's own contract: emitted only when the page carries the
 * mark, and drawn with the same sigla the stave carries.
 */

import { describe, it, expect } from 'vitest';
import { buildMarkupLegend, MARKUP_WITHHELD_TYPE } from './legend';
import { WITHHELD_SIGLA } from '@ilya/score-parser';

describe('the withheld-syllable entry (N.10b)', () => {
	it('is absent when the page carries no withheld syllable', () => {
		expect(buildMarkupLegend('en')).toEqual([]);
		expect(buildMarkupLegend('en', {})).toEqual([]);
		expect(buildMarkupLegend('en', { withheldSyllables: false })).toEqual([]);
	});

	it('is the whole legend when the page withheld a syllable', () => {
		const built = buildMarkupLegend('en', { withheldSyllables: true });
		expect(built).toHaveLength(1);
		expect(built[0].type).toBe('markup-withheld');
		// The constant PageFooter compares against is the one the builder emits.
		expect(built[0].type).toBe(MARKUP_WITHHELD_TYPE);
	});

	it('names no voice state, in either language', () => {
		// The control for the removal: none of the four ruled-out words may
		// come back through this builder.
		for (const language of ['en', 'fr'] as const) {
			const label = buildMarkupLegend(language, { withheldSyllables: true })[0].label;
			expect(label).not.toMatch(/Captur|Provisional|Provisoire|Estimat|Estimé|Unmeasured|Non mesuré/);
		}
	});

	it('has copy in both languages, and they differ', () => {
		const en = buildMarkupLegend('en', { withheldSyllables: true })[0];
		const fr = buildMarkupLegend('fr', { withheldSyllables: true })[0];
		expect(en.type).toBe(fr.type);
		// The control that catches a missing translation falling back to
		// English rather than being absent, which would read as done.
		expect(fr.label).not.toBe(en.label);
	});

	it('draws its circle, in both languages', () => {
		// Dann's ruling of 8 August: the page mark is a drawn sigla, so the
		// legend shows the sigla.
		for (const language of ['en', 'fr'] as const) {
			const item = buildMarkupLegend(language, { withheldSyllables: true })[0];
			expect(item.textOnly).toBeFalsy();
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
