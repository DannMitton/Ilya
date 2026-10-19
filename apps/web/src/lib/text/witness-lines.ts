/**
 * witness-lines.ts: the pure half of "Text shows the witness there is". ROWS
 * 109 AND 110 (N.186), `brief-code-rows109-110-poem-and-lyrics-feed-text_r4`
 * with review r2 amendment 1.
 *
 * Text can transcribe either of the song's two texts: Lyrics (the sung words,
 * which seat) or Poem (the published poem, which seats nothing). `+page.svelte`
 * keeps Lyrics' transcription as `lines` and runs this beside it for the poem,
 * so no second engine is needed: `processText` is a pure function over the
 * module-level engine (`pipeline.ts`), as `derivedLines` already relies on.
 */
import { processText, wordGrid } from '$lib/pipeline';
import type { LineData, UserStressOverride, YoToggle } from '$lib/types';
import type { Language } from '$lib/i18n';
import { comparePoem, tokenize } from './poem-compare';
import { diffWordGrid, emptyDiff, rekeyByWord } from '$lib/text-diff';
import type { WordMarks as Marks } from './word-marks.svelte';
import type { InputView } from './input-views.svelte';

export interface WitnessMarks {
	stress: ReadonlyMap<string, UserStressOverride>;
	yo: ReadonlyMap<string, YoToggle>;
}

/** The text transcribed, or no lines where it is empty or the pipeline throws (as `derivedLines` does). */
export function witnessLines(text: string, language: Language, marks: WitnessMarks): LineData[] {
	if (text.trim() === '') return [];
	try {
		return processText(text, {
			language,
			userStressOverrides: marks.stress.size > 0 ? (marks.stress as Map<string, UserStressOverride>) : undefined,
			yoToggles: marks.yo.size > 0 ? (marks.yo as Map<string, YoToggle>) : undefined,
		});
	} catch (e: unknown) {
		console.error('[Ilya] Transcription error (poem):', e);
		return [];
	}
}

/**
 * Whether the two texts differ enough for Text to offer the pair (review r2,
 * amendment 11): the comparison, which folds case, punctuation, ё and the old
 * spelling as Input's colouring does, reports a Lyrics word the poem does not
 * carry or a poem word the song does not set. A difference only in ё or only in
 * punctuation draws no pair, which is the cost. Null when either text is empty.
 */
export function witnessesDiffer(lyrics: string, poem: string): boolean {
	const cmp = comparePoem(lyrics, poem);
	return cmp !== null && (cmp.differing > 0 || cmp.omitted > 0);
}

/**
 * The poem's words the song does not set, as the pipeline's own
 * `"lineIndex-wordIndex"` keys, so Text can grey them as Input's Poem view does
 * (ruling default 11). The bridge (review r1, amendment 10): the pipeline drops
 * punctuation-only tokens and splits hyphenated particles, so a token index is
 * not a word index. Each raw line that holds a word is matched to the pipeline
 * line of the same order, and its tokens to that line's words one to one WHERE
 * THE COUNTS AGREE; a line whose counts disagree (a split particle) greys
 * nothing. Never marks anything in Lyrics' keys.
 */
export function unsetPoemWords(lyrics: string, poem: string, lines: readonly LineData[]): Set<string> {
	const out = new Set<string>();
	const cmp = comparePoem(lyrics, poem);
	if (!cmp) return out;
	const tokens = tokenize(poem);
	const byLine = new Map<number, number[]>();
	tokens.forEach((tok, i) => {
		if (tok.folded === '') return;
		const list = byLine.get(tok.line) ?? [];
		list.push(i);
		byLine.set(tok.line, list);
	});
	[...byLine.keys()]
		.sort((a, b) => a - b)
		.forEach((rawLine, lineIndex) => {
			const words = lines[lineIndex]?.words;
			const idx = byLine.get(rawLine)!;
			if (!words || words.length !== idx.length) return;
			idx.forEach((tokenIndex, wordIndex) => {
				if (!cmp.poemMatched[tokenIndex]) out.add(`${lineIndex}-${wordIndex}`);
			});
		});
	return out;
}

/** The glosses whose anchor word is still the word standing at their key in this text, or null when none fell away. */
export function survivingGlosses(
	glosses: ReadonlyMap<string, string>,
	anchors: ReadonlyMap<string, string>,
	text: string,
): { glosses: Map<string, string>; anchors: Map<string, string> } | null {
	const grid = wordGrid(text);
	const fold = (w: string) => w.toLowerCase().replace(/ё/g, 'е');
	const nextGloss = new Map<string, string>();
	const nextAnchor = new Map<string, string>();
	for (const [key, gloss] of glosses) {
		const anchor = anchors.get(key);
		if (!anchor) continue;
		const [line, word] = key.split('-').map(Number);
		const standing = grid[line]?.[word];
		if (standing !== undefined && fold(standing) === fold(anchor)) {
			nextGloss.set(key, gloss);
			nextAnchor.set(key, anchor);
		}
	}
	return nextGloss.size === glosses.size && nextAnchor.size === anchors.size ? null : { glosses: nextGloss, anchors: nextAnchor };
}

/**
 * Which of the two texts Text shows (the brief's section 2 A). Lyrics where it
 * holds text; otherwise Poem. With both, Poem only where the singer chose it
 * AND the two differ (the pair is offered only then, so a choice made while
 * they differed does not stick once they agree).
 */
export function shownWitness(lyricsHas: boolean, poemHas: boolean, differ: boolean, choice: InputView): InputView {
	if (!lyricsHas) return poemHas ? 'poem' : 'lyrics';
	return poemHas && differ && choice === 'poem' ? 'poem' : 'lyrics';
}

/**
 * A Poem edit carries the poem's marks and glosses with their words, as an edit
 * to Lyrics does (`carryOverridesAcross`, review r2 amendment 6): the diff is
 * from the poem as it was to the poem now, so a mark on a word follows it when
 * a line is inserted above. The marks are carried in place; the glosses come
 * back as new maps, with any whose anchor word no longer stands there dropped,
 * or null where nothing changed.
 */
export function carryPoemEdit(
	before: string,
	after: string,
	marks: Marks,
	glosses: ReadonlyMap<string, string>,
	anchors: ReadonlyMap<string, string>,
): { glosses: Map<string, string>; anchors: Map<string, string> } | null {
	const diff = before.trim() === '' ? emptyDiff() : diffWordGrid(wordGrid(before), wordGrid(after));
	marks.carry(diff);
	if (glosses.size === 0) return null;
	const moved = diff.unchanged ? { glosses: new Map(glosses), anchors: new Map(anchors) } : { glosses: rekeyByWord(glosses, diff), anchors: rekeyByWord(anchors, diff) };
	const kept = survivingGlosses(moved.glosses, moved.anchors, after);
	if (kept) return kept;
	return diff.unchanged ? null : moved;
}

/**
 * ROW 109 B (review r2 amendment 7): does Lyrics take the poem's text now? A
 * score that carries no words seats from Lyrics (N.55b's first pass, every scan
 * today), so where Lyrics is empty, no note carries a syllable yet, and a poem
 * is there to take, Lyrics takes it and the no-lyrics seat runs on it. The
 * caller passes `wordlessScore` false for a restore (a restore never refills,
 * the 2026-09-14 reason in `applyArrival`) and for a poem typed key by key.
 */
export function lyricsTakesPoem(wordlessScore: boolean, lyrics: string, poem: string, placements: number): boolean {
	return wordlessScore && lyrics.trim() === '' && poem.trim() !== '' && placements === 0;
}
