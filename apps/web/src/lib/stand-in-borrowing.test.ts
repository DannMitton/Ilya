/**
 * QUEUE row 167 (lane 71): all eight declared types with published or borrowed values get a starting profile, and every page that uses a borrowing says so.
 * Lives at the root of `lib/`, outside the six modules, because it reads MELODY, INSIGHTS, the VOICE pane, and the chart together and no one module may import all of them (`scripts/ratchets.mjs`, MODULES).
 * Ruling: `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md` (sections 1, 3, 5, 6, and 8); brief r4 section 7, the sixteen tests it adds.
 *
 * The principle under test, ratified 2026-11-19 10:08: a sentence never tells a singer the values are their own type's when they are a neighbour's. Every site is
 * rendered through the function the page calls. The vowel chart's caption is rendered by the same two calls the pane makes (`placeholderLabel`, then `fillVoiceType`),
 * because `singerBlocks` needs a whole model; the other sites are the page's own functions.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t, type Language } from '$lib/i18n';
import { hasPlaceholderProfile, PLACEHOLDER_PROFILE_TYPES } from '$lib/voice/engine/stand-ins';
import { TIER1, OTHER, borrowedStaffLabel, fillVoiceType, isBorrowingType, placeholderFillLabel, voiceTypePrint } from '$lib/voice/voiceTypes';
import { profileSubtitle } from '$lib/markup/subtitle';
import { genericLede, methodLineKey, placeholderLabel } from '$lib/insights/identity';
import { composeBroadNote } from '$lib/analysis/analyze-score-adapter';
import { borrowingLine } from '$lib/analysis/placeholder-line';
import { paneSentence } from '$lib/components/Drawer/voice-pane';
import { hintText, hintsFor, sheetProvenance } from '$lib/voice/chart/screen-logic';
import { CORE_VOWELS } from '$lib/voice/engine/sung';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';

const LANGS: Language[] = ['en', 'fr'];
const THREE = ['contralto', 'countertenor', 'bass-baritone'] as const;
const FIVE_PUBLISHED = ['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass'] as const;
const STAFF: Record<(typeof THREE)[number], Record<Language, string>> = {
	contralto: { en: 'mezzo-soprano', fr: 'mezzo-soprano' },
	countertenor: { en: 'mezzo and tenor', fr: 'mezzo et ténor' },
	'bass-baritone': { en: 'bass', fr: 'basse' },
};
const TYPE_NAME: Record<(typeof THREE)[number], Record<Language, string>> = {
	contralto: { en: 'contralto', fr: 'contralto' },
	countertenor: { en: 'countertenor', fr: 'contre-ténor' },
	'bass-baritone': { en: 'bass-baritone', fr: 'baryton-basse' },
};
const ALL_IDS: Array<string | undefined> = [...TIER1, undefined, '', 'castrato'];

const f = (f1: number, f2: number): CalibratedFormant => ({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
/** `n` stable core vowels, the first `n` of the roster's six. */
const sampled = (n: number): Partial<Record<Vowel, CalibratedFormant>> =>
	Object.fromEntries(CORE_VOWELS.slice(0, n).map((v, k) => [v, f(300 + 40 * k, 900 + 200 * k)])) as Partial<Record<Vowel, CalibratedFormant>>;

const hint = (voiceType: string | undefined, language: Language) =>
	hintText(hintsFor({ active: false, confirmingClear: false, selected: 'ɑ', sung: new Set<Vowel>(['i']), voiceType }), language);
const pane = (voiceType: string | undefined, language: Language) => paneSentence({ usable: 0, core: [], voiceType, restWorkedOut: false }, language);

/** Every sentence a page prints that carries or can carry a voice type, for a generic voice, through the page's own function. */
function sites(choice: { voiceType?: string; voiceTypeSpecific?: string; voiceTypeOther?: string } | undefined, language: Language): Record<string, string> {
	const id = choice?.voiceType;
	const label = placeholderLabel(true, choice, language);
	return {
		'MELODY subtitle (4.1)': profileSubtitle({ generic: true, voiceType: choice, language }),
		'INSIGHTS lede (4.2)': genericLede(true, choice, language) ?? '',
		'vowel chart caption (4.3)': label ? fillVoiceType(t('insights.r2.vowels.against.generic', language), label, language) : '',
		'Method, typed (4.4)': t('insights.method.generic.typed', language),
		'Method, untyped (4.4)': t('insights.method.generic.untyped', language),
		'Method, no score (4.4)': t('insights.method.noScore.generic', language),
		'broad note (4.5)': composeBroadNote({ formants: true, range: false, tessitura: true, passaggio: true }, language, true),
		'VOICE pane (4.6)': pane(id, language),
		'borrowing line (4.7)': borrowingLine(id, {}, language) ?? '',
		'sheet sources note (4.10)': sheetProvenance(id, language),
		'capture hint (4.10)': hint(id, language),
	};
}

describe('1. the gate: eight declared types hold a starting profile', () => {
	it('all eight ids return true, and "Not sure", no type, and an unknown id return false', () => {
		expect([...PLACEHOLDER_PROFILE_TYPES].sort()).toEqual(TIER1.filter((id) => id !== 'not-sure').sort());
		for (const id of PLACEHOLDER_PROFILE_TYPES) expect(hasPlaceholderProfile(id), id).toBe(true);
		for (const id of ['not-sure', undefined, '', 'castrato']) expect(hasPlaceholderProfile(id), String(id)).toBe(false);
	});
});

describe('2. the declared type’s own name appears in no {voiceType} fill for a borrowing type', () => {
	for (const language of LANGS) {
		it(`${language}: the subtitle, lede, caption, and VOICE pane print the staff, never the type; the section 3 line prints both on purpose`, () => {
			for (const id of THREE) {
				const s = sites({ voiceType: id }, language);
				const staff = STAFF[id][language];
				for (const key of ['MELODY subtitle (4.1)', 'INSIGHTS lede (4.2)', 'vowel chart caption (4.3)', 'VOICE pane (4.6)'])
					expect(s[key].toLowerCase(), `${id} ${key}`).toContain(staff);
				// The declared type's name is absent wherever it is not the staff itself. A contralto's staff is "mezzo-soprano", which does not contain "contralto"; a bass-baritone's is "bass".
				const own = TYPE_NAME[id][language];
				for (const key of ['MELODY subtitle (4.1)', 'INSIGHTS lede (4.2)', 'vowel chart caption (4.3)', 'VOICE pane (4.6)', 'sheet sources note (4.10)', 'capture hint (4.10)'])
					expect(s[key].toLowerCase(), `${id} ${key}`).not.toContain(own);
				expect(s['borrowing line (4.7)']).toContain(own);
				expect(s['borrowing line (4.7)']).toContain(staff);
			}
		});
	}
});

describe('3. Other’s text and a Tier 2 label do not reach a borrowing type’s fill', () => {
	for (const language of LANGS) {
		it(`${language}: still the fixed staff label`, () => {
			const variants = [
				{ voiceTypeSpecific: OTHER, voiceTypeOther: 'My Own Name' },
				{ voiceTypeSpecific: 'haute-contre' },
				{ voiceTypeSpecific: 'sopranist' },
				{ voiceTypeSpecific: 'contralto' },
				{ voiceTypeSpecific: 'bass-baritone' },
			];
			for (const id of THREE) for (const v of variants) {
				const choice = { voiceType: id, ...v };
				const staff = STAFF[id][language];
				expect(placeholderFillLabel(choice, language), `${id} ${JSON.stringify(v)}`).toBe(staff);
				expect(borrowedStaffLabel(id, language)).toBe(staff);
				expect(genericLede(true, choice, language)).toContain(staff);
				expect(profileSubtitle({ generic: true, voiceType: choice, language })).toContain(staff);
				expect(sites(choice, language)['vowel chart caption (4.3)']).toContain(staff);
			}
		});
	}
});

describe('4. "Not sure" reaches no {voiceType} fill, whatever Other holds', () => {
	for (const language of LANGS) {
		it(`${language}: undefined from borrowedStaffLabel for "Not sure", no type, and a non-Tier 1 id; no fill from the three label functions`, () => {
			const notSureOther = { voiceType: 'not-sure', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian Bass' };
			for (const id of ['not-sure', undefined, '', 'castrato', 'Contralto', ' contralto']) expect(borrowedStaffLabel(id, language), String(id)).toBeUndefined();
			for (const choice of [notSureOther, { voiceType: 'not-sure' }, {}, { voiceType: 'castrato', voiceTypeSpecific: OTHER, voiceTypeOther: 'X' }, undefined]) {
				expect(placeholderFillLabel(choice, language), JSON.stringify(choice)).toBeUndefined();
				expect(placeholderLabel(true, choice, language), JSON.stringify(choice)).toBeUndefined();
				expect(genericLede(true, choice, language), JSON.stringify(choice)).toBeNull();
				expect(borrowingLine(choice?.voiceType, {}, language)).toBeNull();
			}
			// voiceTypePrint would print Other's text for "Not sure" (`voiceTypes.ts`): the guarantee does not rest on the gate alone.
			expect(voiceTypePrint(notSureOther, language)).toBe('Russian Bass');
		});
	}
});

describe('5. the repaired strings no longer say "your voice type"', () => {
	const KEYS = ['insights.method.generic.typed', 'insights.method.generic.untyped', 'insights.method.noScore.generic', 'analysis.broad.body.generic', 'sheet.provenance', 'capture.hint.placed.typed'];
	for (const language of LANGS) {
		it(`${language}: ${KEYS.length} keys, named by key`, () => {
			for (const key of KEYS) expect(t(key, language), key).not.toMatch(/your voice type|votre type de voix/);
		});
	}
});

describe('6. the "Not sure" sentence, and the Method line for a singer with no type', () => {
	it('calib.pane.notSure equals its ratified text, EN and FR (RATIFIED by Dann 2026-11-19 11:59)', () => {
		expect(t('calib.pane.notSure', 'en')).toBe('Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya starts from published values for it.');
		expect(t('calib.pane.notSure', 'fr')).toBe('Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci.');
	});
	it('insights.method.noScore.none is still reachable for no type, "Not sure", and an unknown id (no generic, nothing sampled)', () => {
		expect(methodLineKey({ generic: false, typed: false, noScore: true, samples: false })).toBe('insights.method.noScore.none');
		expect(t('insights.method.noScore.none', 'en')).toBe('Method: record your vowels in VOICE, and this page computes from your voice.');
	});
});

describe('7. the draw rule of the borrowing line', () => {
	for (const language of LANGS) {
		it(`${language}: draws for the three with nothing sampled and with one to four core vowels sampled; not for the rest`, () => {
			for (const id of THREE) for (const n of [0, 1, 3, 4]) {
				const line = borrowingLine(id, sampled(n), language);
				expect(line, `${id} ${n}`).not.toBeNull();
				expect(line).toContain(TYPE_NAME[id][language]);
				expect(line).toContain(STAFF[id][language]);
			}
			// Five stable core vowels: the fill is the middle shape times the singer's tract scale, so no borrowed value is in use.
			for (const id of THREE) for (const n of [5, 6]) expect(borrowingLine(id, sampled(n), language), `${id} ${n}`).toBeNull();
			for (const id of [...FIVE_PUBLISHED, 'not-sure', undefined, '', 'castrato']) for (const n of [0, 3]) expect(borrowingLine(id, sampled(n), language), `${id} ${n}`).toBeNull();
		});
	}
	it('both pages carry it as their own entry in the note array, so it draws on MELODY, on INSIGHTS, and on INSIGHTS with no score', () => {
		const insights = readFileSync(new URL('./insights/InsightsPane.svelte', import.meta.url), 'utf8');
		const markup = readFileSync(new URL('./markup/MarkupPane.svelte', import.meta.url), 'utf8');
		expect(insights).toMatch(/note=\{\[[^\n]*borrowingLine\(voiceType\?\.voiceType, formants, language\)[^\n]*placeholderLine\(/);
		expect(markup).toMatch(/note=\{\[[^\n]*borrowingLine\(voiceType, formants, language\)[^\n]*placeholderNote/);
		// It takes no analysis: it draws with an empty vowel list and no score (the function has no such parameter).
		expect(borrowingLine('contralto', {}, 'en')).not.toBeNull();
	});
});

describe('8. {type} fills with the Tier 1 name, so the French gender holds', () => {
	it('un contralto, un contre-ténor, un baryton-basse, even when a Tier 2 label such as haute-contre is stored', () => {
		const line = (id: string) => borrowingLine(id, {}, 'fr')!;
		expect(line('contralto')).toContain('pour un contralto.');
		expect(line('countertenor')).toContain('pour un contre-ténor.');
		expect(line('bass-baritone')).toContain('pour un baryton-basse.');
		expect(t('placeholder.borrowing', 'en')).toContain('{type}');
		expect(borrowingLine('countertenor', {}, 'en')).toContain('for a countertenor,');
	});
});

describe('9. a bass who chose octavist', () => {
	it('reads "a bass voice" in the VOICE pane, "the bass staff" on the sheet, and "from its bass values" in the capture hint', () => {
		expect(pane('bass', 'en')).toContain('for a bass voice');
		expect(sheetProvenance('bass', 'en')).toContain('scaled to the bass staff');
		expect(hint('bass', 'en')).toContain('from its bass values');
		expect(pane('bass', 'fr')).toContain('voix type de basse');
		expect(sheetProvenance('bass', 'fr')).toContain('ajusté à la portée de basse');
		expect(hint('bass', 'fr')).toContain('d’après ses valeurs de basse');
		// The three labels take the Tier 1 id alone: a Tier 2 label cannot reach them.
		expect(borrowedStaffLabel('bass', 'en')).toBe('bass');
	});
});

describe('10. the sheet’s door', () => {
	it('opens for the eight with nothing stored, and stays shut for "Not sure", no type, and an unknown id (the doors are pinned in voice-pane.test.ts)', async () => {
		const { showVowelSpaceDoor } = await import('$lib/components/Drawer/voice-pane');
		for (const id of PLACEHOLDER_PROFILE_TYPES) expect(showVowelSpaceDoor(false, id), id).toBe(true);
		for (const id of ['not-sure', undefined, '', 'castrato']) expect(showVowelSpaceDoor(false, id), String(id)).toBe(false);
	});
});

describe('11. an undeclared voice draws the undeclared forms', () => {
	for (const language of LANGS) {
		it(`${language}: "Not sure", no type, and an unknown id each draw sheet.provenance.undeclared and capture.hint.placed.untyped`, () => {
			for (const id of ['not-sure', undefined, '', 'castrato']) {
				expect(sheetProvenance(id, language), String(id)).toBe(t('sheet.provenance.undeclared', language).replace(/\{v\}/g, '[ɑ]'));
				expect(hintsFor({ active: false, confirmingClear: false, selected: 'ɑ', sung: new Set<Vowel>(['i']), voiceType: id })[0].key, String(id)).toBe('capture.hint.placed.untyped');
			}
			for (const id of [...THREE, ...FIVE_PUBLISHED]) {
				expect(sheetProvenance(id, language), id).not.toBe(t('sheet.provenance.undeclared', language));
				expect(hintsFor({ active: false, confirmingClear: false, selected: 'ɑ', sung: new Set<Vowel>(['i']), voiceType: id })[0].key, id).toBe('capture.hint.placed.typed');
			}
		});
	}
});

describe('12. no rendered string at any of the eleven sites contains a brace', () => {
	for (const language of LANGS) {
		it(`${language}: nine Tier 1 ids, no type, an empty id, and an unknown id`, () => {
			for (const id of ALL_IDS) for (const [site, text] of Object.entries(sites({ voiceType: id }, language))) expect(text, `${id} ${site}`).not.toMatch(/[{}]/);
			// The capture hint is built from the same function with a {v} slot: nothing of {borrowed} or {type} may survive either.
			for (const id of ALL_IDS) expect(hint(id, language), String(id)).not.toMatch(/\{(borrowed|type|voiceType)\}/);
		});
	}
});

describe('13. one page read whole for a contralto, a countertenor, and a bass-baritone: no two sentences disagree about whose values these are', () => {
	for (const language of LANGS) {
		it(`${language}`, () => {
			for (const id of THREE) {
				const s = sites({ voiceType: id }, language);
				const staff = STAFF[id][language];
				const naming = ['MELODY subtitle (4.1)', 'INSIGHTS lede (4.2)', 'vowel chart caption (4.3)', 'VOICE pane (4.6)', 'borrowing line (4.7)', 'sheet sources note (4.10)', 'capture hint (4.10)'];
				for (const key of naming) {
					let text = s[key].toLowerCase();
					// The sheet's note names the zones' sources (Bozeman, "for baritones") before it names the staff; only its placeholder clause says whose values these are.
					if (key === 'sheet sources note (4.10)') text = text.slice(text.search(/placeholder values|valeurs par défaut/));
					expect(text, `${id} ${key}`).toContain(staff);
					// Strip the staff's own words, then no other staff or voice type may appear beside it, except the declared type inside the borrowing line.
					// The borrowing line is stripped of the declared type first, since "bass-baritone" contains "bass".
					let rest = text;
					if (key === 'borrowing line (4.7)') rest = rest.split(TYPE_NAME[id][language]).join('');
					rest = rest.split(staff).join('');
					for (const other of ['soprano', 'tenor', 'ténor', 'baritone', 'baryton', 'bass', 'basse', 'contralto', 'contre-ténor', 'countertenor', 'mezzo']) {
						// "voice" and "voix" are not types; "ténor" inside "mezzo et ténor" was stripped above.
						expect(rest, `${id} ${key} also names ${other}`).not.toContain(other);
					}
				}
				// The strings that carry no token say "placeholder" and name no type at all.
				for (const key of ['Method, typed (4.4)', 'Method, untyped (4.4)', 'Method, no score (4.4)', 'broad note (4.5)']) expect(s[key].toLowerCase(), key).not.toMatch(/contralto|alto|tenor|ténor|bass|basse|baryton|soprano|votre type|your voice type/);
			}
		});
	}
});

describe('14. every string the lane writes or edits: U+2019 apostrophes, U+00A0 before each French colon', () => {
	const KEYS = [
		'voiceType.staff.mezzo-soprano', 'voiceType.staff.bass', 'voiceType.staff.mezzo-tenor', 'placeholder.borrowing',
		'insights.method.generic.typed', 'insights.method.generic.untyped', 'insights.method.noScore.generic', 'analysis.broad.body.generic',
		'calib.pane.notSure', 'calib.pane.typedNone', 'sheet.provenance', 'sheet.provenance.undeclared', 'capture.hint.placed.typed',
	];
	it('no straight apostrophe in either language, and every French colon is preceded by U+00A0', () => {
		for (const key of KEYS) {
			for (const language of LANGS) expect(t(key, language), `${key} ${language}`).not.toContain("'");
			const fr = t(key, 'fr');
			for (const m of fr.matchAll(/:/g)) expect(fr[m.index! - 1], `${key}: colon at ${m.index}`).toBe(' ');
		}
	});
});
