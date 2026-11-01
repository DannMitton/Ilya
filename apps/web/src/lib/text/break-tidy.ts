/**
 * QUEUE row 163 step 3 (Dann 2026-10-30 14:23 and 14:27: "humans are going to be messy in their input and I believe
 * this will keep Ilya organized"). When the singer leaves the Lyrics field, every typed # is tidied to «<unit> #», at
 * the end of the unit the break belongs to, written as `BREAK_MARK`. This DEPARTS from Dann's 2026-10-21 02:18 and
 * 02:19 rulings (a typed # stays where typed); the reason is that Lyrics then shows the # where it acts.
 *
 * Every form `peelSyntacticBreaks` reads is tidied: no space («полёт#»), any number of spaces or no-break spaces, a
 * mix, a # inside a word («ва#с» to «вас #»), a # after a proclitic («в# доме» to «в доме #»; the unit finder is
 * `syntactic-break-unit.ts`, fed the clitic sets as the pipeline's boundary pass feeds it). Two #s together become
 * one. A # at the start of a line moves to the end of the line before; one with no word before it is removed, and a
 * line that held nothing else goes with it. Where the line before is blank, there is no word before the # (the peel
 * reads each line alone), so the # is removed: NOT ESTABLISHED whether Dann means it to cross a blank line.
 *
 * THE WORDS, SYLLABLES, SEATS, AND IPA DO NOT CHANGE for any # that stands after a word in its own line, because the
 * peel already reads each of these forms and moves the break to the same unit end (`boundaries.ts`). A line-initial #
 * changes meaning by ruling: dropped before, a break on the line before after.
 *
 * The clitic sets are the engine's static sets, so no dictionary has to be loaded; only the split of a hyphenated
 * particle («велит-ли») reads it, and a token it does not split is one word with the same end.
 */
import { GraysonEngine } from '@ilya/phonology';
import { moveBreaksToUnitEnds } from '../boundaries';
import { splitIntoPreLines } from '../pipeline';
import { tokenSpans } from '../syntactic-break';
import { BREAK_MARK } from './break-text';

/** Every # with the no-break spaces standing immediately before it. */
const MARKS = / *#/g;
/** A line that opens with a #: the break of the line before. */
const LINE_INITIAL = /^ ?#/;

/** The text with every typed # moved to the end of its unit as `BREAK_MARK`. Idempotent. */
export function tidyBreaks(text: string): string {
	const rawLines = text.split('\n');
	const entries = new Map(splitIntoPreLines(rawLines).map((e) => [e.rawIndex, e]));

	// Pass 1: the token starts that end a unit with a break, per raw line.
	const breaksAt = new Map<number, Set<number>>();
	for (const [rawIndex, entry] of entries) {
		moveBreaksToUnitEnds(entry.words, GraysonEngine);
		breaksAt.set(rawIndex, new Set(entry.words.flatMap((w, i) => (w.syntacticBreak ? [entry.spans[i].start] : []))));
	}
	rawLines.forEach((line, i) => {
		const first = tokenSpans(line)[0];
		const before = entries.get(i - 1);
		if (first && LINE_INITIAL.test(first.text) && before) breaksAt.get(i - 1)!.add(before.spans[before.spans.length - 1].start);
	});

	// Pass 2: each line without its marks, a mark written after the last token of every unit that ends in one.
	const out: string[] = [];
	rawLines.forEach((line, i) => {
		const breaks = breaksAt.get(i);
		let tidy = '';
		let cursor = 0;
		let leading = true; // nothing kept yet: a dropped first token takes the whitespace after it too
		for (const token of tokenSpans(line)) {
			const bare = token.text.replace(MARKS, '');
			if (bare !== '') tidy += (leading && cursor > 0 ? '' : line.slice(cursor, token.start)) + bare;
			if (breaks?.has(token.start)) tidy += BREAK_MARK;
			if (bare !== '') leading = false;
			cursor = token.end;
		}
		tidy += line.slice(cursor);
		// A line that held only marks has nothing left to keep.
		if (tidy.trim() === '' && line.includes('#')) return;
		out.push(tidy);
	});
	return out.join('\n');
}

/**
 * What leaving the Lyrics field changes, if anything: the tidied text, or null where nothing changes or where the field is
 * showing the score's derived words (a change there would claim them, `claimDerivedPoem` in `+page.svelte`, and the score's
 * own text is never touched).
 */
export function lyricsOnLeave(value: string, shownIsDerived: boolean): string | null {
	if (shownIsDerived) return null;
	const tidy = tidyBreaks(value);
	return tidy === value ? null : tidy;
}
