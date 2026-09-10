/**
 * N.115, the path pass: WHAT A CLOSED BAND SAYS.
 *
 * The expectations are copied from the brief
 * (`docs/sessions/brief-path-pass_r1_2026-09-10.md` §3 and §6) and from the
 * drawing's Plates B, C and D, not read back out of `bandState.ts`, which is
 * this repository's standing condition on an acceptance test.
 *
 * THE EMPTY CASES ARE WHAT THIS FILE IS FOR. "Nothing is filled at rest" and
 * "an empty drawer opens Input alone; Piece, Text, and Score markup show their
 * band and nothing under it" are rulings about absence, and absence is the
 * thing a walk is worst at catching.
 */

import { describe, it, expect } from 'vitest';
import {
	pieceStateLine,
	inputStateLine,
	placedLine,
	textStateLine,
	notationDepartures,
	scoreStateLine,
	NOTATION_TOGGLE_COUNT,
	type NotationToggleState,
} from './bandState';

const DEFAULTS: NotationToggleState = {
	reducedVowel: false,
	geminate: false,
	shcha: false,
	palatalNasal: false,
	reconstitution: false,
	showStressDiacritics: false,
	openSyllabification: false,
};

describe('N.115 Piece’s state line', () => {
	/* Plate C: "Without Sun, no. 1: Within Four Walls · Mussorgsky". */
	it('joins the title and the composer with a middle dot', () => {
		expect(pieceStateLine('Within Four Walls', 'Mussorgsky')).toBe(
			'Within Four Walls · Mussorgsky'
		);
	});

	/* DESK DEFAULT, named as one in the brief §3.1: with one of the two, show
	   that one. A lone middle dot would be a band reporting punctuation. */
	it('shows whichever one of the two exists, with no stray dot', () => {
		expect(pieceStateLine('Within Four Walls', '')).toBe('Within Four Walls');
		expect(pieceStateLine('', 'Mussorgsky')).toBe('Mussorgsky');
	});

	it('says nothing when neither exists', () => {
		expect(pieceStateLine('', '')).toBe('');
		expect(pieceStateLine('   ', '  ')).toBe('');
	});
});

describe('N.115 Input’s state line', () => {
	/* Plate D: "8 lines · 37 words · 37 / 94 placed". */
	it('draws all three parts when all three exist', () => {
		expect(inputStateLine(8, 37, 37, 94, true, 'en')).toBe('8 lines · 37 words · 37 / 94 placed');
	});

	/* A poem typed but not yet transcribed has lines and no words. */
	it('drops the word count before there has been a transcription', () => {
		expect(inputStateLine(8, 0, 0, 0, false, 'en')).toBe('8 lines');
	});

	/* Walk finding, 2026-09-10: `slotQueue` fills from the POEM, so a singer
	   with no score has 96 slots and nothing to place them on. The pair needs
	   the score, which is the gate the syllable line inside the open band
	   already uses. */
	it('drops the whole placed pair when there is no score', () => {
		expect(inputStateLine(8, 37, 0, 0, false, 'en')).toBe('8 lines · 37 words');
		expect(inputStateLine(8, 37, 0, 96, false, 'en')).toBe('8 lines · 37 words');
	});

	/* Plate C: everything done. Nothing placed yet is still a queue. */
	it('keeps the pair at both ends of the queue', () => {
		expect(inputStateLine(8, 37, 0, 94, true, 'en')).toBe('8 lines · 37 words · 0 / 94 placed');
		expect(inputStateLine(8, 37, 94, 94, true, 'en')).toBe('8 lines · 37 words · 94 / 94 placed');
	});

	/* Brief §3.2: "an empty song shows nothing under the band." */
	it('says nothing for an empty song', () => {
		expect(inputStateLine(0, 0, 0, 0, false, 'en')).toBe('');
	});

	/* §6, ruled with its French 2026-09-10: « 37 / 94 placées ». */
	it('takes the ruled French for the placed pair', () => {
		expect(placedLine(37, 94, 'fr')).toBe('37 / 94 placées');
	});
});

describe('N.115 Text’s state line', () => {
	/* Brief §4: "all default gives 0; each toggle alone gives 1." */
	it('counts no departure when all seven sit at the default', () => {
		expect(notationDepartures(DEFAULTS)).toBe(0);
	});

	it('counts each of the seven on its own', () => {
		const keys = Object.keys(DEFAULTS) as (keyof NotationToggleState)[];
		expect(keys).toHaveLength(NOTATION_TOGGLE_COUNT);
		for (const key of keys) {
			expect(notationDepartures({ ...DEFAULTS, [key]: true }), key).toBe(1);
		}
	});

	it('counts them together', () => {
		expect(
			notationDepartures({ ...DEFAULTS, shcha: true, openSyllabification: true })
		).toBe(2);
		expect(
			notationDepartures({
				reducedVowel: true,
				geminate: true,
				shcha: true,
				palatalNasal: true,
				reconstitution: true,
				showStressDiacritics: true,
				openSyllabification: true,
			})
		).toBe(NOTATION_TOGGLE_COUNT);
	});

	/* Plate A and Plate C: "Grayson defaults". Plate C's caption: "If a
	   Notation toggle is on, the Text line reads '2 of 7 changed'." */
	it('reads Grayson defaults at rest and the count once one has moved', () => {
		expect(textStateLine(DEFAULTS, 'en')).toBe('Grayson defaults');
		expect(textStateLine({ ...DEFAULTS, shcha: true }, 'en')).toBe('1 of 7 changed');
		expect(textStateLine({ ...DEFAULTS, shcha: true, geminate: true }, 'en')).toBe(
			'2 of 7 changed'
		);
	});

	/* §6, ruled with its French 2026-09-10. */
	it('takes the ruled French', () => {
		expect(textStateLine(DEFAULTS, 'fr')).toBe('Grayson par défaut');
		expect(textStateLine({ ...DEFAULTS, shcha: true, geminate: true }, 'fr')).toBe(
			'2 sur 7 modifiés'
		);
	});

	/* Text is the one band that always has something true to say. */
	it('is never empty', () => {
		expect(textStateLine(DEFAULTS, 'en')).not.toBe('');
		expect(textStateLine(DEFAULTS, 'fr')).not.toBe('');
	});
});

describe('N.115 Score markup’s state line', () => {
	/* Plate C, and `correct.state` is its own key: ruled by Dann 2026-09-10
	   with its French, after the walk showed the Corrections sentence eating
	   the row at 390 px. `correct.count` keeps its one render site inside the
	   Corrections station body and is not read here. */
	it('builds the whole line from the parts that exist', () => {
		expect(scoreStateLine(2, 'Dann', 10, 10, 'en')).toBe(
			'2 notes corrected · Voice: Dann · 10 of 10'
		);
	});

	it('uses the singular phrase for one note', () => {
		expect(scoreStateLine(1, undefined, 0, 10, 'en')).toBe('1 note corrected');
		expect(scoreStateLine(1, undefined, 0, 10, 'fr')).toBe('1 note corrigée');
	});

	it('drops the corrected count when there is none', () => {
		expect(scoreStateLine(0, 'Dann', 10, 10, 'en')).toBe('Voice: Dann · 10 of 10');
	});

	/* A voice with readings but no name is the pre-naming instant, and
	   `VoiceAnchor` already refuses to print an empty pair of guillemets for
	   it. This line falls out the same way. */
	it('drops the voice when it has no name', () => {
		expect(scoreStateLine(2, undefined, 10, 10, 'en')).toBe('2 notes corrected');
		expect(scoreStateLine(2, '', 10, 10, 'en')).toBe('2 notes corrected');
	});

	it('drops the count when nothing has been sampled', () => {
		expect(scoreStateLine(0, 'Dann', 0, 10, 'en')).toBe('Voice: Dann');
	});

	/* Brief §3.4, first bullet: "Empty song, no score, no voice: band and
	   nothing under it." */
	it('says nothing for an empty song with no score and no voice', () => {
		expect(scoreStateLine(0, undefined, 0, 10, 'en')).toBe('');
		expect(scoreStateLine(0, undefined, 0, 10, 'fr')).toBe('');
	});

	/* `calib.anchor.named` carries the ratified French, guillemets and all;
	   `correct.state` carries its own, ruled 2026-09-10. */
	it('takes the ruled French across the whole line', () => {
		expect(scoreStateLine(0, 'Dann', 10, 10, 'fr')).toBe(
			'Voix : « Dann » · 10 sur 10'
		);
		expect(scoreStateLine(2, 'Dann', 10, 10, 'fr')).toBe(
			'2 notes corrigées · ' + 'Voix : « Dann » · 10 sur 10'
		);
	});
});
