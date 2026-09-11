/**
 * bandState.ts — WHAT A CLOSED BAND SAYS, AND NOTHING ELSE.
 *
 * N.115, the path pass, RULED BY DANN 2026-09-10: "A closed band shows one
 * line under it, its state; an open band shows its content, and the content is
 * the state" (`PRODUCT.md` §The drawer grammar and the path).
 *
 * FOUR PURE FUNCTIONS IN A `.ts` FILE, and that is the brief's instruction
 * rather than a preference: this repository's vitest runs in the `node`
 * environment, so a rule written inside a `.svelte` file is a rule no test can
 * pin. `one-action.ts` is the tree's own precedent and its header says the
 * same thing. What is pinned here is the EMPTY cases, because those are what
 * the ruling is mostly about: nothing is filled at rest, and a band with
 * nothing to say says nothing.
 *
 * EVERY BUILDER DROPS A PART THAT IS ZERO OR ABSENT and returns the empty
 * string when every part is gone. The caller draws no element for an empty
 * string, so an absent state line costs no height and no rule.
 *
 * THE SEPARATOR IS A MIDDLE DOT WITH A SPACE EITHER SIDE, which is the
 * drawing's (`drawing-drawer-front-side_r2_2026-09-10.html`, Plates B, C and
 * D) and the tree's own habit at `inspector.unknownStress`.
 */

import { t, type Language } from '$lib/i18n';

/** The one separator. Plates B, C and D. */
const DOT = ' · ';

/** Join the parts that exist, in order, and give back '' when none do. */
function joinParts(parts: readonly (string | null | undefined)[]): string {
	return parts.filter((p): p is string => typeof p === 'string' && p !== '').join(DOT);
}

/**
 * PIECE, closed: the title, a middle dot, the composer.
 *
 * DESK DEFAULT, named as one in the brief: with only one of the two, show that
 * one; with neither, show nothing under the band. A lone middle dot would be a
 * band reporting punctuation.
 *
 * The `from score` tag is NOT part of this string. It is a tag at the right end
 * of the row with its own recipe (`.meta-from-score`), so the caller draws it
 * beside this line rather than inside it.
 */
export function pieceStateLine(title: string, composer: string): string {
	return joinParts([title.trim(), composer.trim()]);
}

/**
 * INPUT, closed: `8 lines · 37 words · 37 / 94 placed`.
 *
 * THE THREE PARTS ARE INDEPENDENT. A poem with no transcription behind it has
 * lines and no words; a poem with no score has no placement; an empty song has
 * none of the three and shows nothing under the band. Each part is dropped on
 * its own count being zero, which is what "drop any part that is zero or
 * absent" asks for.
 *
 * THE PAIR NEEDS A SCORE, not merely a queue. `slotQueue` fills from the poem
 * alone, so a singer who has pasted a poem and attached nothing has 96 slots
 * and no notes to put them on; reporting `0 / 96 placed` there would be the
 * band counting a placement that cannot begin. The syllable line inside the
 * open band is gated on the same fact (`showSyllables`, `score !== null`), so
 * the closed line and the open one agree about when placement exists. Walk
 * finding, 2026-09-10.
 */
export function inputStateLine(
	lineCount: number,
	wordCount: number,
	slotsPlaced: number,
	slotTotal: number,
	hasScore: boolean,
	language: Language,
): string {
	return joinParts([
		lineCount > 0 ? t('intake.lines', language).replace('%s', String(lineCount)) : null,
		wordCount > 0 ? t('intake.words', language).replace('%s', String(wordCount)) : null,
		hasScore && slotTotal > 0 ? placedLine(slotsPlaced, slotTotal, language) : null,
	]);
}

/**
 * `37 / 94 placed`, the syllable line's own numeral pair with the word it was
 * missing. N.115, ruled with its French 2026-09-10.
 *
 * ONE OWNER, because the same phrase is drawn in three places: Input's closed
 * state line, the syllable line's open row, and its closed row. The thin
 * spaces around the solidus are the tree's own, from the rows this replaces.
 */
export function placedLine(placed: number, total: number, language: Language): string {
	return t('intake.placed', language)
		.replace('%s', String(placed))
		.replace('%s', String(total));
}

/**
 * The seven notation toggles, and how many depart from the Grayson default.
 *
 * THE SEVEN, from the brief §3.3: the five `NotationPreferences` fields, which
 * are all `false` at the default (`packages/phonology/src/engine.ts:25-36`
 * says so on each field), `showStressDiacritics` (`+page.svelte:1918`,
 * `false`), and `doc.openSyllabification`
 * (`apps/web/src/lib/library/document.svelte.ts:67`, `false`; the record's own
 * default at `library/types.ts:170` agrees).
 *
 * EVERY ONE OF THE SEVEN DEFAULTS TO `false`, so the count is the number of
 * `true`s and no per-field default table is needed. That is a fact about
 * today's seven and not a law: if a toggle ever ships defaulting to `true`,
 * this function is where it is written down.
 */
export interface NotationToggleState {
	reducedVowel: boolean;
	geminate: boolean;
	shcha: boolean;
	palatalNasal: boolean;
	reconstitution: boolean;
	showStressDiacritics: boolean;
	openSyllabification: boolean;
}

/** How many of the seven the singer has moved. */
export function notationDepartures(state: NotationToggleState): number {
	return [
		state.reducedVowel,
		state.geminate,
		state.shcha,
		state.palatalNasal,
		state.reconstitution,
		state.showStressDiacritics,
		state.openSyllabification,
	].filter(Boolean).length;
}

/** The denominator, so the count and the phrase cannot disagree. */
export const NOTATION_TOGGLE_COUNT = 7;

/**
 * THE TEXT FOLD, closed: nothing at rest, `2 of 7 changed` once a toggle moved.
 *
 * N.115 increment 2, RULED BY DANN 2026-09-10 21:55: nothing at default.
 * `Grayson defaults` is struck with its key; he read it on the walk as
 * "seems random". REDUCED TO THE CHANGED CASE RATHER THAN DELETED, because
 * the count and its phrase still need one owner and this is it. The empty
 * string at rest is the convention every other builder in this file keeps,
 * and the caller draws no element for it.
 *
 * TEXT IS NO LONGER A BAND. It folds into INPUT under the poem box, and this
 * line sits at the right end of the fold's header row, in secondary ink,
 * because it is apparatus rather than the singer's own content.
 */
export function textStateLine(state: NotationToggleState, language: Language): string {
	const changed = notationDepartures(state);
	if (changed === 0) return '';
	return t('text.state.changed', language)
		.replace('%s', String(changed))
		.replace('%s', String(NOTATION_TOGGLE_COUNT));
}

/**
 * SCORE MARKUP, closed: the corrected-note count, the voice, the voice's
 * sampled-vowel count, in that order, built from the parts that exist.
 *
 * `2 notes corrected`, THE PHRASE THE PLATES DRAW, and it is its own pair of
 * keys. The brief §3.4 asked for `correct.count` and `correct.countOne`
 * because those carried ratified French and the plate's phrase had none; Dann
 * ruled `correct.state` and `correct.stateOne` with their French on
 * 2026-09-10, after the walk showed the sentence eating the row at 390 px
 * before the voice reached it. The two sentence keys keep their one render
 * site, the notice inside the Corrections station body, and are not touched.
 *
 * THE VOICE HALF IS `calib.anchor.named`, the string the Voice station's own
 * line already uses, for the same reason: it reads "Voice: {voice}" and its
 * French is ratified. A voice with readings but no name falls out of the line
 * rather than printing an empty pair of guillemets, which is `VoiceAnchor`'s
 * own rule and this is the second reader of it.
 *
 * AN EMPTY SONG WITH NO SCORE AND NO VOICE RETURNS '', which is the brief's
 * first bullet: band and nothing under it.
 */
export function scoreStateLine(
	correctedCount: number,
	voiceName: string | undefined,
	sampledVowels: number,
	totalVowels: number,
	language: Language,
): string {
	const named = voiceName !== undefined && voiceName !== '';
	return joinParts([
		correctedCount === 1
			? t('correct.stateOne', language)
			: correctedCount > 1
				? t('correct.state', language).replace('%s', String(correctedCount))
				: null,
		named ? t('calib.anchor.named', language).replace('{voice}', voiceName) : null,
		named && sampledVowels > 0
			? t('voice.state.count', language)
					.replace('%s', String(sampledVowels))
					.replace('%s', String(totalVowels))
			: null,
	]);
}
