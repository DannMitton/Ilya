/**
 * poem-match.ts: which poem a song's Lyrics sets (poem library, build 1, step 3;
 * brief `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`).
 *
 * PURE. No DOM, no IndexedDB, no clock: the same Lyrics and the same library give
 * the same answer. It is the TypeScript form of `tools/poems/reference_sw_match.py`,
 * and a test holds the two to the reference's own scores
 * (`tools/poems/fixtures/expected_r1.txt`) to three decimals.
 *
 * HOW. Letters only: the Lyrics and each poem are folded to the letters а-я
 * (`foldLetters`). Smith-Waterman local alignment, match +2, mismatch -1, gap -2.
 * The score is the best local score divided by 2 x the Lyrics' letters, so a
 * Lyrics that is wholly the poem scores 1 and a Lyrics with nothing of it scores
 * near 0. A work's score is its best entry's.
 *
 * WHEN IT FILLS (DESK DEFAULT, measured not tuned; the numbers are the desk's
 * `report-desk-poem-threshold_r1`, repeated in the brief):
 *   - the top work scores at least 0.15 (`MIN_SCORE`);
 *   - it beats the second work by at least 0.10 (`MIN_MARGIN`);
 *   - the Lyrics' letters are at most 3 x the chosen entry's (`MAX_LENGTH_RATIO`):
 *     a cycle of several songs gets no fill (review amendment 12).
 *
 * AND A FLOOR THE BRIEF DOES NOT HAVE (DESK DEFAULT, mine, reversible): the
 * Lyrics must hold at least 80 letters (`MIN_QUERY_LETTERS`). The brief's numbers
 * were measured on whole songs, the shortest 113 letters. A short Lyrics scores
 * high by chance: cut into windows, the three fixtures that have no poem in the
 * library gave a fill on 440 of 963 six-letter windows, 94 of 313 fifteen-letter
 * windows, and 3 of 88 forty-letter windows; at 50 letters and more there were
 * none, and at 80 the highest top score was 0.119, below the 0.15 rule
 * (report step 3, section 3). A six-letter word that stands in «Мцыри» scored
 * 1.000. 80 is under the shortest build song, so every song in the build set keeps its fill.
 *
 * WHICH ENTRY. The best-scoring entry of the work; within 0.01 of the best, the
 * `modern` entry (amendment 10).
 *
 * ON A LARGE LIBRARY the alignment is too slow for a phone, so the 20 works
 * that share the most letter trigrams with the Lyrics are aligned and the rest
 * are not (`SHORTLIST`). With 20 works or fewer the shortlist is everything.
 *
 * THE STRETCH (amendment 1). The alignment also gives where the Lyrics sit in the
 * poem: the first and last matched letter, and their offsets in `textModern`.
 * Step 4 cuts the fill to the whole stanzas that hold this stretch. It is carried
 * forward through the table, so memory is one row, not a matrix, and the stretch is
 * the one of the first cell (in row order) that reaches the best score. Where
 * two alignments score alike, which of them is named is therefore fixed but is not
 * a claim that the other is wrong.
 */
import { decodeOffsets, type PoemEntry, type PoemLibrary } from './poem-library';

export const MIN_SCORE = 0.15;
export const MIN_MARGIN = 0.1;
export const MAX_LENGTH_RATIO = 3;
export const MIN_QUERY_LETTERS = 80;
export const SHORTLIST = 20;
/** Entries of a work within this of its best score are a tie, and the modern one stands. */
export const ENTRY_TIE = 0.01;

const MATCH = 2;
const MISMATCH = -1;
const GAP = 2;

/** The reference's fold: ѣ→е, і→и, ѳ→ф, ѵ→и, ё→е, й→и; ъ dropped; the rest of the text is dropped below. */
const FOLD: ReadonlyMap<string, string> = new Map([
	['ѣ', 'е'],
	['і', 'и'],
	['ѳ', 'ф'],
	['ѵ', 'и'],
	['ё', 'е'],
	['й', 'и'],
	['ъ', ''],
]);

/** The letters of a text, as the matcher reads it: lowercase, folded, and only а-я. */
export function foldLetters(text: string): string {
	let out = '';
	for (const ch of text) {
		const lower = ch.toLowerCase();
		const folded = FOLD.has(lower) ? FOLD.get(lower)! : lower;
		if (folded.length === 1 && folded >= 'а' && folded <= 'я') out += folded;
	}
	return out;
}

const codes = (letters: string): Uint16Array => {
	const out = new Uint16Array(letters.length);
	for (let i = 0; i < letters.length; i += 1) out[i] = letters.charCodeAt(i);
	return out;
};

/** A local alignment: its score, and its first and last letter in each text (0-based, inclusive). */
export interface Alignment {
	score: number;
	queryStart: number;
	queryEnd: number;
	poemStart: number;
	poemEnd: number;
}

/**
 * Smith-Waterman local alignment of `query` against `poem`, linear gaps. One row
 * of the table is kept; with each cell goes where its alignment began, so the
 * best cell names its own stretch.
 */
export function align(query: Uint16Array, poem: Uint16Array): Alignment {
	const m = query.length;
	const n = poem.length;
	let hPrev = new Int32Array(n + 1);
	let hCur = new Int32Array(n + 1);
	let pPrev = new Int32Array(n + 1); // where the alignment ending at this cell began, in the poem (1-based)
	let pCur = new Int32Array(n + 1);
	let qPrev = new Int32Array(n + 1); // ... and in the query (1-based)
	let qCur = new Int32Array(n + 1);
	let best = 0;
	let bestI = 0;
	let bestJ = 0;
	let bestP = 0;
	let bestQ = 0;
	for (let i = 1; i <= m; i += 1) {
		const c = query[i - 1];
		hCur[0] = 0;
		pCur[0] = 0;
		qCur[0] = 0;
		for (let j = 1; j <= n; j += 1) {
			const diagBase = hPrev[j - 1];
			let h = diagBase + (c === poem[j - 1] ? MATCH : MISMATCH);
			let from = 0;
			const up = hPrev[j] - GAP;
			if (up > h) {
				h = up;
				from = 1;
			}
			const left = hCur[j - 1] - GAP;
			if (left > h) {
				h = left;
				from = 2;
			}
			if (h <= 0) {
				hCur[j] = 0;
				pCur[j] = 0;
				qCur[j] = 0;
				continue;
			}
			hCur[j] = h;
			if (from === 0) {
				if (diagBase > 0) {
					pCur[j] = pPrev[j - 1];
					qCur[j] = qPrev[j - 1];
				} else {
					pCur[j] = j;
					qCur[j] = i;
				}
			} else if (from === 1) {
				pCur[j] = pPrev[j];
				qCur[j] = qPrev[j];
			} else {
				pCur[j] = pCur[j - 1];
				qCur[j] = qCur[j - 1];
			}
			if (h > best) {
				best = h;
				bestI = i;
				bestJ = j;
				bestP = pCur[j];
				bestQ = qCur[j];
			}
		}
		[hPrev, hCur] = [hCur, hPrev];
		[pPrev, pCur] = [pCur, pPrev];
		[qPrev, qCur] = [qCur, qPrev];
	}
	if (best === 0) return { score: 0, queryStart: -1, queryEnd: -1, poemStart: -1, poemEnd: -1 };
	return { score: best, queryStart: bestQ - 1, queryEnd: bestI - 1, poemStart: bestP - 1, poemEnd: bestJ - 1 };
}

/** What is cached about an entry, once per library object. */
interface Prepared {
	codes: Uint16Array;
	offsets: number[];
	trigrams: Set<number>;
}
const prepared = new WeakMap<PoemEntry, Prepared>();

const trigramsOf = (letters: string): Set<number> => {
	const out = new Set<number>();
	for (let i = 0; i + 2 < letters.length; i += 1) {
		out.add(((letters.charCodeAt(i) - 0x430) << 10) | ((letters.charCodeAt(i + 1) - 0x430) << 5) | (letters.charCodeAt(i + 2) - 0x430));
	}
	return out;
};

function prepare(entry: PoemEntry): Prepared {
	let p = prepared.get(entry);
	if (!p) {
		p = { codes: codes(entry.letters), offsets: decodeOffsets(entry.at), trigrams: trigramsOf(entry.letters) };
		prepared.set(entry, p);
	}
	return p;
}

/** One work as the ranking holds it: its score, the entry that would fill, and where the Lyrics sit in that entry. */
export interface WorkScore {
	work: string;
	/** The best score of the work's entries, to the reference's definition. */
	score: number;
	entry: PoemEntry;
	alignment: Alignment;
}

/** The works to align: all of them, or the `SHORTLIST` sharing the most letter trigrams with the query. */
export function shortlist(queryLetters: string, library: PoemLibrary): Map<string, PoemEntry[]> {
	const byWork = new Map<string, PoemEntry[]>();
	for (const e of library.entries) {
		const list = byWork.get(e.work);
		if (list) list.push(e);
		else byWork.set(e.work, [e]);
	}
	if (byWork.size <= SHORTLIST) return byWork;
	const query = trigramsOf(queryLetters);
	const shared = (entries: PoemEntry[]): number => {
		let top = 0;
		for (const e of entries) {
			const t = prepare(e).trigrams;
			let n = 0;
			for (const g of query) if (t.has(g)) n += 1;
			if (n > top) top = n;
		}
		return top;
	};
	const ranked = [...byWork.entries()].map(([work, entries]) => ({ work, entries, n: shared(entries) }));
	ranked.sort((a, b) => b.n - a.n || (a.work < b.work ? -1 : 1));
	return new Map(ranked.slice(0, SHORTLIST).map((r) => [r.work, r.entries]));
}

/**
 * Every shortlisted work with its score, best first. The score is the reference's:
 * the best local score of the work's best entry over 2 x the query's letters.
 */
export function rankWorks(queryLetters: string, library: PoemLibrary): WorkScore[] {
	if (queryLetters.length === 0) return [];
	const q = codes(queryLetters);
	const ranked: WorkScore[] = [];
	for (const [work, entries] of shortlist(queryLetters, library)) {
		const scored = entries.map((entry) => {
			const alignment = align(q, prepare(entry).codes);
			return { entry, alignment, score: alignment.score / (MATCH * q.length) };
		});
		const top = Math.max(...scored.map((s) => s.score));
		// Within ENTRY_TIE of the best: the modern entry, else the best. Ties after that fall to the library's order.
		const near = scored.filter((s) => s.score >= top - ENTRY_TIE);
		const chosen = near.filter((s) => s.entry.spelling === 'modern').sort((a, b) => b.score - a.score)[0] ?? near.sort((a, b) => b.score - a.score)[0];
		ranked.push({ work, score: top, entry: chosen.entry, alignment: chosen.alignment });
	}
	// Equal scores are whole numbers over the same denominator, so they are exactly equal; the reference
	// (`sorted(..., reverse=True)`) then puts the larger work id first, and so does this.
	ranked.sort((a, b) => b.score - a.score || (a.work < b.work ? 1 : -1));
	return ranked;
}

/** A confident match: the poem the Lyrics set, and the stretch of it they set. */
export interface PoemMatch {
	entry: PoemEntry;
	work: string;
	score: number;
	/** The second work's score (0 where the library has one work). */
	second: number;
	margin: number;
	queryLetters: number;
	/**
	 * How much of the Lyrics the one alignment covers: its span in the Lyrics over the Lyrics' letters. A song that sets the
	 * whole poem with a garbled opening or a reordered stanza has a low coverage; a song that sets a passage has a high one.
	 * Computed here and nowhere else (step 8, part 2); `cutFor` (`poem-source.ts`) reads it.
	 */
	coverage: number;
	/** The matched stretch: first and last matched letter in `entry.letters`, inclusive. */
	letterStart: number;
	letterEnd: number;
	/** The same stretch in `entry.textModern`: `start` is the first matched letter's offset, `end` is just past the last. */
	start: number;
	end: number;
}

export type MatchOutcome =
	| { ok: true; match: PoemMatch }
	| { ok: false; reason: 'empty' | 'too-short' | 'low-score' | 'low-margin' | 'too-long'; top?: WorkScore; second?: WorkScore };

/** The decision with its reason, for a test or a log. `matchPoem` is its answer. */
export function evaluate(lyrics: string, library: PoemLibrary): MatchOutcome {
	const letters = foldLetters(lyrics);
	if (letters.length === 0) return { ok: false, reason: 'empty' };
	// Before any alignment: a short Lyrics is not worth the work, and chance fills it (see the header).
	if (letters.length < MIN_QUERY_LETTERS) return { ok: false, reason: 'too-short' };
	const ranked = rankWorks(letters, library);
	if (ranked.length === 0) return { ok: false, reason: 'empty' };
	const [top, next] = ranked;
	const second = next?.score ?? 0;
	if (top.score < MIN_SCORE) return { ok: false, reason: 'low-score', top, second: next };
	if (top.score - second < MIN_MARGIN) return { ok: false, reason: 'low-margin', top, second: next };
	if (letters.length > MAX_LENGTH_RATIO * top.entry.letters.length) return { ok: false, reason: 'too-long', top, second: next };
	const { alignment, entry } = top;
	const offsets = prepare(entry).offsets;
	return {
		ok: true,
		match: {
			entry,
			work: top.work,
			score: top.score,
			second,
			margin: top.score - second,
			queryLetters: letters.length,
			coverage: (alignment.queryEnd - alignment.queryStart + 1) / letters.length,
			letterStart: alignment.poemStart,
			letterEnd: alignment.poemEnd,
			start: offsets[alignment.poemStart],
			end: offsets[alignment.poemEnd] + 1,
		},
	};
}

/** The poem the Lyrics set, or `null` where the match is not confident. */
export function matchPoem(lyrics: string, library: PoemLibrary): PoemMatch | null {
	const outcome = evaluate(lyrics, library);
	return outcome.ok ? outcome.match : null;
}
