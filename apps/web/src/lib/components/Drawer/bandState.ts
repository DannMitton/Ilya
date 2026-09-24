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
		lineCount > 0 ? countText(lineCount, 'line', language) : null,
		wordCount > 0 ? countText(wordCount, 'word', language) : null,
		hasScore && slotTotal > 0 ? placedLine(slotsPlaced, slotTotal, language) : null,
	]);
}

/**
 * `1 line`, `8 lines`, « 1 ligne », « 0 mot ». English takes the singular at
 * 1 only; French takes it at 0 and 1. Walk finding 2026-09-24: the receipt
 * read "1 lines".
 */
export function countText(n: number, noun: 'line' | 'word', language: Language): string {
	const singular = language === 'fr' ? n <= 1 : n === 1;
	const key = singular ? (noun === 'line' ? 'intake.line' : 'intake.word') : noun === 'line' ? 'intake.lines' : 'intake.words';
	return t(key, language).replace('%s', String(n));
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
 * NOTATION'S HEADER: nothing at rest, `2 of 7 changed` once a toggle moved.
 *
 * N.115 increment 2, RULED BY DANN 2026-09-10 21:55: nothing at default.
 * `Grayson defaults` is struck with its key; he read it on the walk as
 * "seems random". The empty string at rest is the convention every other
 * builder in this file keeps, and the caller draws no element for it.
 *
 * IT MOVED FROM THE TEXT FOLD TO NOTATION, N.115 increment 3, RULED BY DANN
 * 2026-09-10 late: "if we're going to offer this courtesy message it should
 * be on the Notation header, not the Text header." The fold is deleted. The
 * phrase sits at the right end of Notation's own station row, open or shut,
 * in secondary ink, because it is apparatus rather than the singer's own
 * content. It was `textStateLine` and its key was `text.state.changed`;
 * both names lied once the fold went, and the text is unchanged.
 */
export function notationStateLine(state: NotationToggleState, language: Language): string {
	const changed = notationDepartures(state);
	if (changed === 0) return '';
	return t('notation.state.changed', language)
		.replace('%s', String(changed))
		.replace('%s', String(NOTATION_TOGGLE_COUNT));
}

/**
 * UNDO AND REDO ON THE SCORE MARKUP BAND, N.115 increment 3. RULED BY DANN
 * 2026-09-10 late ("I hate where they are placed"): the pair leaves the top
 * bar for the right end of the SCORE MARKUP band header, as clickable text
 * in the band's own label style, and each is drawn ONLY while its stack
 * holds something.
 *
 * THE DECISION LIVES HERE AND NOT IN THE TEMPLATE, for the reason
 * `sections.svelte.ts` gives: this repository's vitest runs in `node`, where
 * no component renders, so the band draws exactly the list this returns.
 *
 * `undoLabel` AND `redoLabel` ARE `+page.svelte`'s `stackLabel`, `null` for
 * an empty stack. The VERB is the ratified `loupe.undo` or `loupe.redo` with
 * its clause and the separator before it dropped, which is `HeaderBar`'s old
 * `verbOnly` moved here with the pair, so no string is coined. `\s` matches
 * the non-breaking space that carries the French spacing before the colon.
 * The SENTENCE, clause included, is the accessible name. It begins with the
 * verb the singer sees, which keeps the visible label inside the name.
 */
export interface StackAction {
	kind: 'undo' | 'redo';
	verb: string;
	sentence: string;
}

export function stackActions(
	undoLabel: string | null,
	redoLabel: string | null,
	language: Language,
): StackAction[] {
	const action = (kind: 'undo' | 'redo', clause: string): StackAction => {
		const key = kind === 'undo' ? 'loupe.undo' : 'loupe.redo';
		return {
			kind,
			verb: t(key, language).replace(/[\s:]*%s\s*$/, ''),
			sentence: t(key, language).replace('%s', clause),
		};
	};
	const out: StackAction[] = [];
	if (undoLabel !== null) out.push(action('undo', undoLabel));
	if (redoLabel !== null) out.push(action('redo', redoLabel));
	return out;
}

/**
 * VOICE, closed: the voice and the voice's sampled-vowel count, in that
 * order, built from the parts that exist.
 *
 * IT NO LONGER ANNOUNCES CORRECTIONS. N.150, 2026-09-20: the band is named
 * Voice and holds only the Voice station, and a state line describes what its
 * band holds. Corrections moved to the loupe (N.149), so a count of them here
 * would be a stale summary. `correct.state` and `correct.stateOne`, which drew
 * it (N.115, 2026-09-10), went with it.
 *
 * THE VOICE HALF IS `calib.anchor.named`, the string the Voice station's own
 * line already uses, for the same reason: it reads "Voice: {voice}" and its
 * French is ratified. A voice with readings but no name falls out of the line
 * rather than printing an empty pair of guillemets, which is `VoiceAnchor`'s
 * own rule and this is the second reader of it.
 *
 * NO VOICE RETURNS '', band and nothing under it. The export keeps its name
 * `scoreStateLine`: the band id is still `scoreMarkup`, a wire value.
 */
export function scoreStateLine(
	voiceName: string | undefined,
	sampledVowels: number,
	totalVowels: number,
	language: Language,
): string {
	const named = voiceName !== undefined && voiceName !== '';
	return joinParts([
		named ? t('calib.anchor.named', language).replace('{voice}', voiceName) : null,
		named && sampledVowels > 0
			? t('voice.state.count', language)
					.replace('%s', String(sampledVowels))
					.replace('%s', String(totalVowels))
			: null,
	]);
}
