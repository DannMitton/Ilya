/**
 * ROW 179, STEP 1: A SINGER'S EDITED GLOSS CARRIES ITS LANGUAGE, AND ONE
 * FUNCTION SAYS WHICH GLOSS A WORD SHOWS.
 *
 * Brief: `docs/sessions/brief-code-gloss-language-and-reuse_r3_2026-11-03.md`.
 * Ruling: Dann 2026-11-03 14:22 to 14:32. A gloss the singer types is in the
 * language she typed it in. It shows in that language and not in the other.
 *
 * THE SHAPE. Each word keeps ONE value under its `"lineIndex-wordIndex"` key,
 * `{ en?: string; fr?: string }`, so every map keyed by word (the re-key, the
 * survival guard, Reset) keeps working on the key alone, and Reset clears both
 * languages in one delete. The stored row is `[key, gloss, anchorWord, language]`,
 * one row per language present.
 *
 * THE LEGACY ROW. A row with no fourth element, or one that is neither `'en'`
 * nor `'fr'`, reads as English (Dann 2026-11-03 15:21: he typed them in
 * English). Nothing migrates; the row is written tagged on the song's next
 * ordinary save.
 */
import type { Language } from '$lib/i18n';
import type { GlossRow } from '$lib/library/types';

/** What the singer has typed on one word of one song, by language. `''` is her "no gloss here". */
export interface GlossEdit {
	en?: string;
	fr?: string;
}

/** Where the gloss a word shows came from. */
export type GlossSource = 'song' | 'glossary' | 'dictionary' | 'none';

export interface ResolvedGloss {
	text: string;
	source: GlossSource;
}

/**
 * The personal glossary, as `glossFor` reads it (the store is row 179 step 2).
 * `lemma` is the word's lemma, or `''` where the lookup found none, and
 * `form` is the anchor form of the word (`glossAnchorForm`).
 */
export interface GlossaryLookup {
	get(lemma: string, form: string, language: Language): string | undefined;
}

/** The parts of a word `glossFor` reads. */
export interface GlossWord {
	cleanWord: string;
	gloss?: string;
	lemma?: string;
}

const LANGUAGES: readonly Language[] = ['en', 'fr'];

/** The stored rows as the page holds them: one edit per word key, one anchor per word key. */
export function editsFromRows(rows: readonly GlossRow[]): { edits: Map<string, GlossEdit>; anchors: Map<string, string> } {
	const edits = new Map<string, GlossEdit>();
	const anchors = new Map<string, string>();
	for (const [key, gloss, anchor, language] of rows) {
		const edit: GlossEdit = { ...edits.get(key) };
		if (language === 'fr') edit.fr = gloss;
		else edit.en = gloss;
		edits.set(key, edit);
		anchors.set(key, anchor);
	}
	return { edits, anchors };
}

/** The rows to store: each language a word has an edit in, tagged, in English then French. */
export function rowsFromEdits(edits: ReadonlyMap<string, GlossEdit>, anchors: ReadonlyMap<string, string>): GlossRow[] {
	const rows: GlossRow[] = [];
	for (const [key, edit] of edits) {
		for (const language of LANGUAGES) {
			const gloss = edit[language];
			if (gloss !== undefined) rows.push([key, gloss, anchors.get(key) ?? '', language]);
		}
	}
	return rows;
}

/**
 * The maps after the singer's edit of one word in one language: `gloss` set, or
 * `null` to take her edit in that language away. The other language's edit is
 * left alone; the key goes (with its anchor) only when neither language holds one.
 */
export function withGlossEdit(
	edits: ReadonlyMap<string, GlossEdit>,
	anchors: ReadonlyMap<string, string>,
	key: string,
	language: Language,
	gloss: string | null,
	anchorWord: string,
): [Map<string, GlossEdit>, Map<string, string>] {
	const nextEdits = new Map(edits);
	const nextAnchors = new Map(anchors);
	const edit = { ...edits.get(key) };
	if (gloss === null) delete edit[language];
	else edit[language] = gloss;
	if (edit.en === undefined && edit.fr === undefined) {
		nextEdits.delete(key);
		nextAnchors.delete(key);
	} else {
		nextEdits.set(key, edit);
		nextAnchors.set(key, anchorWord);
	}
	return [nextEdits, nextAnchors];
}

/**
 * THE ONE RESOLUTION POINT. What a word shows in `language`, and where it came from:
 * the song's own edit in that language first (an empty one is her "no gloss here"),
 * then the dictionary's displayed gloss (`word.gloss`, which the pipeline computed
 * for this language and never replaces), then the personal glossary where the
 * dictionary's is empty, then nothing.
 */
export function glossFor(word: GlossWord, language: Language, songEdit: GlossEdit | undefined, glossary: GlossaryLookup | null | undefined): ResolvedGloss {
	const own = songEdit?.[language];
	if (own !== undefined) return { text: own, source: 'song' };
	if (word.gloss) return { text: word.gloss, source: 'dictionary' };
	const kept = glossary?.get(word.lemma ?? '', word.cleanWord, language);
	if (kept) return { text: kept, source: 'glossary' };
	return { text: '', source: 'none' };
}

/**
 * What the readers receive: for the current language, an entry for each word the
 * singer's edit or the glossary decides. A word the dictionary decides has no
 * entry, so the reader's own `word.gloss` stands, as it did before this row.
 * An edit whose word is not in `lines` is still carried, as the page did.
 */
export function resolvedGlosses(
	lines: readonly { words?: readonly (GlossWord & { lineIndex: number; wordIndex: number })[] }[],
	edits: ReadonlyMap<string, GlossEdit>,
	language: Language,
	glossary: GlossaryLookup | null | undefined,
): Map<string, ResolvedGloss> {
	const out = new Map<string, ResolvedGloss>();
	for (const [key, edit] of edits) if (edit[language] !== undefined) out.set(key, { text: edit[language]!, source: 'song' });
	if (!glossary) return out;
	for (const line of lines) {
		for (const word of line.words ?? []) {
			const key = `${word.lineIndex}-${word.wordIndex}`;
			if (out.has(key)) continue;
			const resolved = glossFor(word, language, edits.get(key), glossary);
			if (resolved.source === 'glossary') out.set(key, resolved);
		}
	}
	return out;
}

/**
 * What the Inspector's field writes into the song for what she typed (`null` takes
 * her edit in this language away). Typing the dictionary's own gloss, or blanking
 * a field the dictionary fills, reverts to the dictionary. Blanking a field the
 * glossary fills writes her "no gloss here", an explicit empty edit, so the
 * glossary's text does not come back (walk item 5). An edit equal to the
 * glossary's text is still hers: the song keeps it, so "Stop using" leaves the
 * song alone.
 */
export function glossToWrite(typed: string, dictionaryGloss: string, glossaryText: string | undefined): string | null {
	if (typed === '') return !dictionaryGloss && glossaryText ? '' : null;
	return typed === dictionaryGloss ? null : typed;
}
