/**
 * word-mark-rows.ts: THE INSPECTOR'S WORD MARKS, as rows on the song. ROW 184 (WORD MARKS), RULED BY DANN 2026-11-09 20:44
 * ("The data must be preserved over sessions"), brief `brief-code-word-marks-saved_r1_2026-11-09.md`.
 *
 * Plain TypeScript, no runes, so every decision in it is under the gates. `WordMarks` (`text/word-marks.svelte.ts`)
 * holds four Maps per witness; a song stores them as `[key, kind, value, anchor]` rows (`SongRecord.wordMarks`),
 * the gloss rows' pattern (`library.ts`, `GlossRow`). Three jobs live here:
 *
 *   - `validRow` and `validateWordMarks`: what a stored row must look like. A row that fails is dropped alone,
 *     never the song (the brief, step 1).
 *   - `rowsFromMaps`: the maps to rows, each with the clean form of the word it sits on (the anchor, ё folded), taken
 *     from the text the keys describe. Where the text has moved on since (a typed pause not yet transcribed), the
 *     rows go through the same re-keying the live maps will get (`rekeyByWord`, `rekeyByWordChar`), leaving the live
 *     maps alone (Fable's amendment 4 of brief 2).
 *   - `mapsFromRows`: rows to maps at open, each checked against the word standing at its key. A mark whose
 *     anchor no longer matches is dropped and counted, so a mark never lands on another word.
 *
 * `spot`'s value is the singer's CHOICE for the word, `true` reconstituted and `false` reduced (Dann, 22:20, option 2),
 * not an inversion of the device-wide setting, so it survives a change of that setting and a binder import.
 */
import type { SyllableOverride, UserStressOverride, YoToggle } from '$lib/types';
import { glossAnchorForm } from '$lib/text/gloss-survival';
import { boundariesKeepOneVowel } from '$lib/syllable-utils';
import { diffWordGrid, rekeyByWord, rekeyByWordChar } from '$lib/text-diff';
import type { MarkKind, MarkRow, MarkValue } from './types';

/** The four maps one witness holds, as plain Maps. */
export interface MarkMaps {
	stress: ReadonlyMap<string, UserStressOverride>;
	yo: ReadonlyMap<string, YoToggle>;
	syllables: ReadonlyMap<string, SyllableOverride>;
	/** The singer's choice for the word: true reconstituted, false reduced. */
	spot: ReadonlyMap<string, boolean>;
}

export type WordMarkRows = { lyrics?: MarkRow[]; poem?: MarkRow[] };

export const MARK_KINDS: readonly MarkKind[] = ['stress', 'yo', 'syllables', 'spot'];
const SOURCES: readonly string[] = ['user-dictionary', 'user-composer', 'user-override'];
const WORD_KEY = /^\d+-\d+$/;
const CHAR_KEY = /^\d+-\d+-\d+$/;

export function emptyMarkMaps(): MarkMaps {
	return { stress: new Map(), yo: new Map(), syllables: new Map(), spot: new Map() };
}

export function markMapsEmpty(maps: MarkMaps): boolean {
	return maps.stress.size + maps.yo.size + maps.syllables.size + maps.spot.size === 0;
}

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const isIndex = (n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0;

/** Does this value fit this kind? The three checks are the types' own (`$lib/types`: `UserStressOverride`, `YoToggle`, `SyllableOverride`). */
function validValue(kind: MarkKind, value: unknown): value is MarkValue {
	switch (kind) {
		case 'stress':
			return (
				isObject(value) &&
				isIndex(value.stressIndex) &&
				typeof value.stressSource === 'string' &&
				SOURCES.includes(value.stressSource) &&
				(value.promotedFromClitic === undefined || typeof value.promotedFromClitic === 'boolean')
			);
		case 'yo':
			return isObject(value) && typeof value.source === 'string' && SOURCES.includes(value.source);
		case 'syllables':
			return isObject(value) && Array.isArray(value.boundaries) && value.boundaries.every(isIndex);
		case 'spot':
			return typeof value === 'boolean';
	}
}

/** One stored row, well formed: a known kind, a key of that kind's shape, a value of that kind's shape, a non-empty anchor. */
export function validRow(row: unknown): row is MarkRow {
	if (!Array.isArray(row) || row.length !== 4) return false;
	const [key, kind, value, anchor] = row;
	if (typeof key !== 'string' || typeof kind !== 'string' || !MARK_KINDS.includes(kind as MarkKind)) return false;
	if (!(kind === 'yo' ? CHAR_KEY : WORD_KEY).test(key)) return false;
	return typeof anchor === 'string' && anchor !== '' && validValue(kind as MarkKind, value);
}

/**
 * The stored field, read: a witness whose list is not an array is dropped, a malformed row is dropped alone, and a
 * witness left with no rows is left out. Returns undefined where nothing is left. WHY NO `malformed()`: a damaged mark
 * costs one mark, never the song's saves (the brief: "drops a malformed row, not the song").
 */
export function validateWordMarks(value: unknown): WordMarkRows | undefined {
	if (!isObject(value)) return undefined;
	const out: WordMarkRows = {};
	for (const side of ['lyrics', 'poem'] as const) {
		const rows = value[side];
		if (!Array.isArray(rows)) continue;
		const kept = rows.filter(validRow).map((r): MarkRow => [r[0], r[1], r[2], r[3]]);
		if (kept.length > 0) out[side] = kept;
	}
	return out.lyrics || out.poem ? out : undefined;
}

const num = (s: string) => s.split('-').map(Number);
const byKey = (a: string, b: string) => {
	const x = num(a), y = num(b);
	for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1);
	return 0;
};

const gridsEqual = (a: readonly (readonly string[])[], b: readonly (readonly string[])[]): boolean =>
	a.length === b.length && a.every((line, i) => line.length === b[i].length && line.every((w, j) => w === b[i][j]));

/**
 * The maps as rows, in a fixed order (kind, then line, word, character), so the same marks always write the same bytes.
 *
 * `keyedTo` is the grid the keys describe. `current` is the text's grid now, or null where it is the same. Where they
 * differ, each map is re-keyed over the diff first (`rekeyByWord`; `rekeyByWordChar` for ё), and the anchors are read
 * from `current`. A mark whose word is not in the grid it is anchored to has no anchor to write and is left out.
 */
export function rowsFromMaps(maps: MarkMaps, keyedTo: readonly (readonly string[])[], current: readonly (readonly string[])[] | null): MarkRow[] {
	if (markMapsEmpty(maps)) return [];
	const moved = current !== null && keyedTo.length > 0 && !gridsEqual(keyedTo, current);
	const diff = moved ? diffWordGrid(keyedTo, current) : null;
	const grid = moved ? current : keyedTo;
	const stress = diff ? rekeyByWord(maps.stress, diff) : maps.stress;
	const yo = diff ? rekeyByWordChar(maps.yo, diff) : maps.yo;
	const syllables = diff ? rekeyByWord(maps.syllables, diff) : maps.syllables;
	const spot = diff ? rekeyByWord(maps.spot, diff) : maps.spot;
	const rows: MarkRow[] = [];
	const add = (kind: MarkKind, key: string, value: MarkValue) => {
		const [line, word] = num(key);
		const standing = grid[line]?.[word];
		if (standing === undefined || standing === '') return;
		rows.push([key, kind, value, glossAnchorForm(standing)]);
	};
	for (const key of [...stress.keys()].sort(byKey)) add('stress', key, stress.get(key)!);
	for (const key of [...yo.keys()].sort(byKey)) add('yo', key, yo.get(key)!);
	for (const key of [...syllables.keys()].sort(byKey)) add('syllables', key, syllables.get(key)!);
	for (const key of [...spot.keys()].sort(byKey)) add('spot', key, spot.get(key)!);
	return rows;
}

/**
 * Rows to maps at open. Each row's anchor is compared, ё folded, with the word standing at its key in `grid`
 * (the grid of the stored text, from `wordGrid`, before any transcription). A row that fails is dropped and counted.
 */
export function mapsFromRows(rows: readonly MarkRow[], grid: readonly (readonly string[])[]): { maps: MarkMaps; dropped: number } {
	const stress = new Map<string, UserStressOverride>();
	const yo = new Map<string, YoToggle>();
	const syllables = new Map<string, SyllableOverride>();
	const spot = new Map<string, boolean>();
	let dropped = 0;
	for (const row of rows) {
		const [key, kind, value, anchor] = row;
		const [line, word] = num(key);
		const standing = grid[line]?.[word];
		if (standing === undefined || glossAnchorForm(standing) !== glossAnchorForm(anchor)) {
			dropped++;
			continue;
		}
		// One vowel per note (CONTRACT §0.1): a stored division that moves a vowel is refused, and counted as dropped so it is not written back.
		if (kind === 'syllables' && !boundariesKeepOneVowel(standing, (value as SyllableOverride).boundaries)) {
			dropped++;
			continue;
		}
		if (kind === 'stress') stress.set(key, value as UserStressOverride);
		else if (kind === 'yo') yo.set(key, value as YoToggle);
		else if (kind === 'syllables') syllables.set(key, value as SyllableOverride);
		else spot.set(key, value as boolean);
	}
	return { maps: { stress, yo, syllables, spot }, dropped };
}
