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
import { buildMarkupLegend, MARKUP_WITHHELD_TYPE, MARKUP_STEMS_UP_TYPE, MARKUP_STEMS_DOWN_TYPE } from './legend';
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

describe('the stems key (N.176)', () => {
	it('is absent when the page draws no note with a timbre analysis', () => {
		expect(buildMarkupLegend('en', { stems: false })).toEqual([]);
		expect(buildMarkupLegend('fr', { stems: false, withheldSyllables: false })).toEqual([]);
	});

	it('is present, up then down, when the page draws one', () => {
		const built = buildMarkupLegend('en', { stems: true });
		expect(built.map((i) => i.type)).toEqual([MARKUP_STEMS_UP_TYPE, MARKUP_STEMS_DOWN_TYPE]);
		expect(built.map((i) => i.stems)).toEqual(['up', 'down']);
	});

	it('stands beside the withheld entry without displacing it', () => {
		const built = buildMarkupLegend('en', { stems: true, withheldSyllables: true });
		expect(built.map((i) => i.type)).toEqual([MARKUP_STEMS_UP_TYPE, MARKUP_STEMS_DOWN_TYPE, MARKUP_WITHHELD_TYPE]);
	});

	it('says what Dann ratified, in both languages, and underlines the adjective alone', () => {
		const en = buildMarkupLegend('en', { stems: true });
		const fr = buildMarkupLegend('fr', { stems: true });
		expect(en.map((i) => i.label)).toEqual(['stems up = close timbre', 'stems down = open timbre']);
		expect(fr.map((i) => i.label)).toEqual(['hampes vers le haut = timbre fermé', 'hampes vers le bas = timbre ouvert']);
		expect(en.map((i) => i.emphasis)).toEqual(['close', 'open']);
		expect(fr.map((i) => i.emphasis)).toEqual(['fermé', 'ouvert']);
		for (const i of [...en, ...fr]) expect(i.label).toContain(i.emphasis!);
	});
});
