/**
 * N.159: the score obeys the singer's switches. `drawPairings` works out
 * what each seated note draws from the live poem, and nothing is stored.
 *
 * The node pipeline carries no dictionary, so every word here takes its
 * stress from the singer's own override (`UserStressOverride`), which is
 * also the path a hand-assigned stress takes on the page. The positive
 * control in each test is Transcription's own word, read from the same
 * `lines`, so the comparison does not depend on which stresses the
 * dictionary would have supplied.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { processText } from '$lib/pipeline';
import { applyOpenSyllabificationToLines } from '$lib/syllable-utils';
import type { LineData, UserStressOverride } from '$lib/types';
import {
	buildSlotQueue,
	drawPairings,
	drawnAcutedCyrillic,
	drawnSeatCount,
	firstPass,
	pairedCyrillic,
	stressAcutedCyrillic,
	type DrawSwitches,
	type PairingMap,
} from './pairings';

const OFF: DrawSwitches = { openSyllabification: false, reconstitution: false };

function transcribe(text: string, stress: Record<string, number> = {}): LineData[] {
	const overrides = new Map<string, UserStressOverride>(
		Object.entries(stress).map(([k, i]) => [k, { stressIndex: i, stressSource: 'user-override' }]),
	);
	return processText(text, { language: 'en', userStressOverrides: overrides });
}

/** Every slot of the poem on its own note, `e0`, `e1`, ..., as a fresh score. */
function seat(lines: LineData[]): PairingMap {
	const queue = buildSlotQueue(lines);
	return firstPass(
		queue.map((_, i) => `e${i}`),
		queue,
	);
}

/** Transcription's syllables for each non-clitic word, as the page shows them. */
function transcriptionSyllables(lines: LineData[], field: 'ipaDisplay' | 'ipaReconstituted') {
	return lines[0].words
		.filter((w) => !w.isProclitic && !w.isEnclitic)
		.map((w) => ({ word: w.cleanWord, syllables: (w[field] ?? '').split(' ') }));
}

/** The drawn IPA of each non-clitic word's notes, in slot order. */
function drawnSyllables(lines: LineData[], map: PairingMap, switches: DrawSwitches) {
	const drawn = drawPairings(map, lines, switches);
	return lines[0].words
		.filter((w) => !w.isProclitic && !w.isEnclitic)
		.map((w) => ({
			word: w.cleanWord,
			syllables: Object.entries(map)
				.filter(([, p]) => p.kind === 'syllable' && p.origin.word === w.cleanWord)
				.map(([id]) => drawn[id].ipa),
		}));
}

/* «жена» is LEARN Unit 4's own example; «в лесу» fuses a vowelless proclitic
   into its host's first note. */
const POEM = 'Комнатка тесная, в лесу жена';
const STRESS = { '0-0': 0, '0-1': 0, '0-3': 1, '0-4': 1 };

describe('N.159 the drawing step', () => {
	it('Reconstitution restores each note exactly as Transcription restores its word', () => {
		const lines = transcribe(POEM, STRESS);
		const map = seat(lines);

		// Positive control: switched off, the notes read Transcription's word.
		expect(drawnSyllables(lines, map, OFF)).toEqual(transcriptionSyllables(lines, 'ipaDisplay'));

		const on = { ...OFF, reconstitution: true };
		expect(drawnSyllables(lines, map, on)).toEqual(
			transcriptionSyllables(lines, 'ipaReconstituted'),
		);

		const off = drawPairings(map, lines, OFF);
		const drawn = drawPairings(map, lines, on);
		const changed = Object.keys(map).filter((id) => off[id].ipa !== drawn[id].ipa);
		expect(changed.map((id) => `${off[id].ipa}>${drawn[id].ipa}`)).toEqual([
			'kʌ>kɑ',
			'vlʲɪ>vlʲɛ',
			'ʒɨ>ʒɛ',
		]);

		// The acoustic marks follow: the note drawn ɛ is forecast as ɛ.
		const zhe = Object.keys(map).find((id) => map[id].kind === 'syllable' && off[id].ipa === 'ʒɨ')!;
		expect([off[zhe].vowel, drawn[zhe].vowel]).toEqual(['ɨ', 'ɛ']);

		// A spot key inverts the global switch for its word alone, both ways.
		const spot = new Map([['0-4', true]]);
		expect(drawPairings(map, lines, { ...OFF, spotReconstitution: spot })[zhe].ipa).toBe('ʒɛ');
		expect(drawPairings(map, lines, { ...on, spotReconstitution: spot })[zhe].ipa).toBe('ʒɨ');
		expect(drawPairings(map, lines, { ...OFF, spotReconstitution: spot })[changed[0]].ipa).toBe('kʌ');
	});

	it('Open syllables re-divides the IPA only, cutting the raw syllables once and never effectiveLines', () => {
		const lines = transcribe(POEM, STRESS);
		const map = seat(lines);
		const open = { ...OFF, openSyllabification: true };
		const drawn = drawPairings(map, lines, open);

		const komnatka = ['e0', 'e1', 'e2'];
		expect(komnatka.map((id) => drawn[id].ipa)).toEqual(['ˈko', 'mnɑ', 'tkʌ']);
		// The Cyrillic keeps the division the singer placed.
		expect(komnatka.map((id) => drawn[id].cyrillic)).toEqual(['Ком', 'нат', 'ка']);

		// Transcription's own re-cut, alone and composed with Reconstitution.
		const effective = applyOpenSyllabificationToLines(lines, undefined, true);
		expect(drawnSyllables(lines, map, open)).toEqual(
			transcriptionSyllables(effective, 'ipaDisplay'),
		);
		expect(drawnSyllables(lines, map, { ...open, reconstitution: true })).toEqual(
			transcriptionSyllables(effective, 'ipaReconstituted'),
		);

		// A boundary moved in the Inspector, with the global switch off.
		const overrides = new Map([['0-0', { boundaries: [1, 5] }]]);
		const moved = drawPairings(map, lines, { ...OFF, syllableOverrides: overrides });
		expect(komnatka.map((id) => moved[id].ipa)).toEqual(['ˈko', 'mnɑt', 'kʌ']);
		expect(drawnSyllables(lines, map, { ...OFF, syllableOverrides: overrides })).toEqual(
			transcriptionSyllables(applyOpenSyllabificationToLines(lines, overrides, false), 'ipaDisplay'),
		);

		// IT NEVER READS `effectiveLines`. It reads the engine's syllables, not
		// a display string: garbling every display string changes nothing.
		const garbled = lines.map((l) => ({
			...l,
			words: l.words.map((w) => ({ ...w, ipaDisplay: 'X', ipaReconstituted: 'X' })),
		}));
		expect(drawPairings(map, garbled, open)).toEqual(drawn);
		// And the page hands it the raw `lines`.
		const page = readFileSync(
			fileURLToPath(new URL('../../routes/+page.svelte', import.meta.url)),
			'utf8',
		);
		expect(page).toMatch(/drawPairings\(shownPairings, lines, \{/);
		expect(page).not.toMatch(/drawPairings\([^)]*effectiveLines/);
	});

	it('a hand-assigned stress redraws the note with no write to the map', () => {
		const before = transcribe('жена');
		const map = seat(before);
		const stored = JSON.stringify(map);
		expect(drawPairings(map, before, OFF).e0.ipa).toBe('ʒɛ');

		// The singer assigns the stress to the second syllable; the pipeline
		// re-runs and `lines` is replaced, as `handleStressAssign` does.
		const after = transcribe('жена', { '0-0': 1 });
		const drawn = drawPairings(map, after, OFF);
		expect([drawn.e0.ipa, drawn.e1.ipa]).toEqual(['ʒɨ', 'ˈnɑ']);
		expect([drawn.e0.acute, drawn.e1.acute]).toEqual([false, true]);
		expect(drawPairings(map, after, { ...OFF, reconstitution: true }).e0.ipa).toBe('ʒɛ');
		expect(JSON.stringify(map)).toBe(stored);
	});

	it('a seat the poem cannot identify draws its stored text under every switch', () => {
		const lines = transcribe('жена', { '0-0': 1 });
		const map: PairingMap = {
			e0: {
				kind: 'syllable',
				cyrillic: 'тень',
				ipa: 'ˈtʲɛnʲ',
				vowel: 'ɛ',
				origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'тень' },
			},
			e1: {
				kind: 'syllable',
				cyrillic: 'ла',
				ipa: 'lʌ',
				vowel: 'ʌ',
				origin: { lineIndex: 3, wordIndex: 0, slotIndex: 0, word: 'мила' },
			},
		};
		const all = {
			openSyllabification: true,
			reconstitution: true,
			spotReconstitution: new Map([['0-0', true]]),
		};
		for (const switches of [OFF, all]) {
			const drawn = drawPairings(map, lines, switches);
			expect(drawn.e0).toEqual({ cyrillic: 'тень', ipa: 'ˈtʲɛnʲ', vowel: 'ɛ', acute: false, answered: false });
			expect(drawn.e1).toEqual({ cyrillic: 'ла', ipa: 'lʌ', vowel: 'ʌ', acute: false, answered: false });
			expect(drawnSeatCount(drawn)).toEqual({ live: 0, stored: 2 });
		}
	});

	it('leaves the stored map byte-identical after every switch is flipped on and off', () => {
		const lines = transcribe(POEM, STRESS);
		const map = seat(lines);
		map.e99 = { kind: 'melisma' };
		const stored = JSON.stringify(map);
		const freeze = (o: unknown): void => {
			if (o && typeof o === 'object') {
				Object.freeze(o);
				Object.values(o).forEach(freeze);
			}
		};
		freeze(map);
		const spot = new Map([['0-4', true]]);
		const overrides = new Map([['0-0', { boundaries: [1, 5] }]]);
		for (let bits = 0; bits < 16; bits++) {
			const drawn = drawPairings(map, lines, {
				openSyllabification: !!(bits & 1),
				reconstitution: !!(bits & 2),
				...(bits & 4 ? { spotReconstitution: spot } : {}),
				...(bits & 8 ? { syllableOverrides: overrides } : {}),
			});
			expect(drawnSeatCount(drawn)).toEqual({ live: 10, stored: 0 });
			expect(drawn.e99).toBeUndefined();
		}
		expect(drawPairings(map, lines, OFF)).toEqual(drawPairings(map, lines, OFF));
		expect(JSON.stringify(map)).toBe(stored);
	});

	it('the acute marks what Transcription marks, under the same four suppressions', () => {
		// «в» is a clitic, «тень» has no stress (inferred), «ёлка» carries ё.
		const lines = transcribe('в лесу ёлка тень жена', { '0-1': 1, '0-4': 1 });
		const map = seat(lines);
		const cyr = pairedCyrillic(map)!;
		const drawn = drawnAcutedCyrillic(cyr, drawPairings(map, lines, OFF));
		expect(drawn).toEqual(stressAcutedCyrillic(cyr, map, lines));
		expect(Object.values(drawn)).toEqual(['в ле', 'су́', 'ёл', 'ка', 'тень', 'же', 'на́']);

		// Open syllables and Reconstitution leave the acute where it was.
		const all = { openSyllabification: true, reconstitution: true };
		expect(drawnAcutedCyrillic(cyr, drawPairings(map, lines, all))).toEqual(drawn);
	});
});
