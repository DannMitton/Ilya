import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import { beatName } from '$lib/tempo/beat-glyph';
import { restFragmentParts, valueName, valueParts } from './value-name';

/** Row 133's tables, typed from the brief (`docs/sessions/ratified-loupe-dot-words_2026-10-19.md`): base, English value, French value, French rest, the rest's dotted ending. */
const TABLE: ReadonlyArray<readonly [string, string, string, string, string]> = [
	['whole', 'Whole', 'Ronde', 'Pause', 'pointée'],
	['half', 'Half', 'Blanche', 'Demi-pause', 'pointée'],
	['quarter', 'Quarter', 'Noire', 'Soupir', 'pointé'],
	['eighth', 'Eighth', 'Croche', 'Demi-soupir', 'pointé'],
	['16th', 'Sixteenth', 'Double croche', 'Quart de soupir', 'pointé'],
	['32nd', 'Thirty-second', 'Triple croche', 'Huitième de soupir', 'pointé'],
	['64th', 'Sixty-fourth', 'Quadruple croche', 'Seizième de soupir', 'pointé'],
];

describe('row 133: every cell of the ratified tables, code point for code point', () => {
	for (const [base, en, fr, rest, end] of TABLE) {
		const e = en.toLowerCase();
		const doubly = end === 'pointée' ? 'doublement pointée' : 'doublement pointé';
		it(`${base}: notes`, () => {
			expect(t(`loupe.value.${base}.1`, 'en')).toBe(`Dotted ${e}`);
			expect(t(`loupe.value.${base}.1`, 'fr')).toBe(`${fr} pointée`);
			expect(t(`loupe.value.${base}.2`, 'en')).toBe(`Double-dotted ${e}`);
			expect(t(`loupe.value.${base}.2`, 'fr')).toBe(`${fr} doublement pointée`);
		});
		it(`${base}: rests`, () => {
			expect(t(`loupe.restValue.${base}.0`, 'en')).toBe(`Rest \u00b7 ${en}`);
			expect(t(`loupe.restValue.${base}.1`, 'en')).toBe(`Rest \u00b7 Dotted ${e}`);
			expect(t(`loupe.restValue.${base}.2`, 'en')).toBe(`Rest \u00b7 Double-dotted ${e}`);
			expect(t(`loupe.restValue.${base}.0`, 'fr')).toBe(rest);
			expect(t(`loupe.restValue.${base}.1`, 'fr')).toBe(`${rest} ${end}`);
			expect(t(`loupe.restValue.${base}.2`, 'fr')).toBe(`${rest} ${doubly}`);
		});
	}
});

const word = (b: string) => `<${b}>`;
const base = { language: 'en' as const, word, label: 'B\u266d3' };

describe('row 133: the readout pieces', () => {
	it('a dotted note, a double-dotted note, and a dotted rest, in both languages', () => {
		expect(valueParts({ ...base, isRest: false, base: 'quarter', dots: 1 })).toEqual(['B\u266d3', 'Dotted quarter']);
		expect(valueParts({ ...base, isRest: false, base: 'quarter', dots: 2 })).toEqual(['B\u266d3', 'Double-dotted quarter']);
		expect(valueParts({ ...base, isRest: true, base: 'eighth', dots: 1 }).join(' \u00b7 ')).toBe('Rest \u00b7 Dotted eighth');
		expect(valueParts({ ...base, language: 'fr', isRest: false, base: 'quarter', dots: 1 })).toEqual(['B\u266d3', 'Noire pointée']);
		expect(valueParts({ ...base, language: 'fr', isRest: false, base: 'quarter', dots: 0 })).toEqual(['B\u266d3', 'Noire']);
		expect(valueParts({ ...base, language: 'fr', isRest: true, base: 'eighth', dots: 1 })).toEqual(['Demi-soupir pointé']);
		expect(valueParts({ ...base, language: 'fr', isRest: true, base: 'eighth', dots: 0 })).toEqual(['Demi-soupir']);
	});

	it('the beat clause stands between: the rest first in French, "Rest · beat 2 · Dotted eighth" in English', () => {
		expect(valueParts({ ...base, language: 'fr', isRest: true, base: 'eighth', dots: 1, beat: 'temps 2' })).toEqual(['Demi-soupir pointé', 'temps 2']);
		expect(valueParts({ ...base, isRest: true, base: 'eighth', dots: 1, beat: 'beat 2' }).join(' \u00b7 ')).toBe('Rest \u00b7 beat 2 \u00b7 Dotted eighth');
		expect(valueParts({ ...base, isRest: false, base: 'quarter', dots: 1, beat: 'beat 2' })).toEqual(['B\u266d3', 'beat 2', 'Dotted quarter']);
	});

	it('a base the tables do not name keeps today\u2019s readout', () => {
		expect(valueName('breve', 1, false, 'en')).toBeNull();
		expect(valueParts({ ...base, isRest: false, base: 'breve' as never, dots: 1 })).toEqual(['B\u266d3', '<breve>', 'Dot']);
		expect(valueParts({ ...base, isRest: false, base: '128th' as never, dots: 2 })).toEqual(['B\u266d3', '<128th>', 'Double dot']);
		expect(valueParts({ ...base, isRest: true, base: '128th' as never, dots: 0 })).toEqual(['Rest', '<128th>']);
	});

	it('splits a fragment where the beat goes', () => {
		expect(restFragmentParts('Rest \u00b7 Dotted eighth')).toEqual(['Rest', 'Dotted eighth']);
		expect(restFragmentParts('Soupir')).toEqual(['Soupir']);
	});

	it('a tempo chip says "Dotted half"', () => {
		expect(beatName('half', 1, 'en')).toBe('Dotted half');
		expect(beatName('half', 1, 'fr')).toBe('Blanche pointée');
		expect(beatName('half', 0, 'en')).toBe('Half');
	});
});
