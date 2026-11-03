/**
 * Each token under its note (N.135, stage 2a).
 *
 * A reader returns the tokens of one text row, each with the box it stands in
 * on the page. The notes of the voice staff above that row carry the x of their
 * head (homr's `<!-- imgpos: x, y -->`, `join-pages.ts` `placeOf`). `seatTokens`
 * says which token sits under which note, by one of the three rules of the
 * stage 1 harness (`docs/sessions/report-code-n135-underlay-harness_r1_2026-10-15.md`,
 * 4.4, `score44.py`):
 *
 * - `nearest`: the note whose x is nearest the token's centre.
 * - `order`: each bar's tokens, taken in x order, are paired with the bar's
 *   sung notes in x order, where their number equals the number of those notes
 *   (a note tied into, or under an extender, gets no syllable). A bar where the
 *   numbers differ is seated by `nearest`. The same idea as row 93's re-key,
 *   pass 1 at `score/old-reader-seats.ts` (counts agree, pair in order),
 *   applied to boxes instead of old seats.
 * - `monotone`: one least-cost alignment over the row, each token to one note,
 *   order kept, the cost the x distance, a note allowed no token (a melisma or
 *   a tie). A token is without a note in two cases only. (1) It is FAR: its
 *   centre is more than `FAR_FACTOR` times the median gap between consecutive
 *   free notes from the nearest free note, so it is text the voice does not sing
 *   (a cue over the piano's staff while the voice rests); it is left out before
 *   the alignment, so it takes no note and moves none. (2) Tokens outnumber the
 *   notes: every note takes one token, the in-order choice of least total
 *   distance, and the surplus tokens come back `unseated`, with their index.
 *   Either way the token is not dropped and not folded onto a neighbouring note.
 *
 * A NOTE TAKES AT MOST ONE TOKEN in the words (N.135 step 5, `CONTRACT.md` §0.1).
 * `monotone` never seats two tokens on a note. `nearest` and `order` can, and flag
 * both `shared`; `sewWords` (`oneToANote`) then keeps the first in x order on the
 * note and treats each other as an unseated token, carrying its letters into the
 * open word as it does for any unseated piece. It no longer joins them into one
 * syllable of two vowels.
 *
 * EVERY rule seats on the notes that sing a syllable only: a note tied into, or
 * under an extender, takes no token (the measured configurations seat on the
 * free notes: `step1c.py`, `cands='free'`). A syllable under a tie's second note
 * is the walk's "one note early". Where no note sings, every syllable token is
 * `unseated` with `by: null`. The stage 1 harness's `score44.py` seated rules 1
 * and 3 on every note; `xcheck_seat_gen.py` checks both readings.
 *
 * Call it once per row, with the notes of that row's system. A token with no
 * letter is not seated: a lone hyphen, an extender, and a stray mark are
 * returned in their place so that `sewWords` can read them. A token that holds
 * two syllables run together («су-е» read as one) is seated on one note whole
 * and says so; no rule can split a box, and this module does not guess where.
 *
 * Pure. No DOM, no dictionary, no IPA.
 */

export type SeatRule = 'nearest' | 'order' | 'monotone';

/**
 * A syllable token is not a lyric of the voice when its nearest free note is
 * further from its centre than this many times the median gap between
 * consecutive free notes of the system (N.135 rule 2, desk measure 2026-11-02:
 * a cue printed over the piano's staff while the voice rests took the voice's
 * first two notes and slid the line). 2 is the brief's value (JUDGEMENT, not a
 * sourced number): a long note followed by a wide gap leaves its own text within
 * one gap of its note, and the median is not moved by that one wide gap. With
 * fewer than two free notes there is no gap to measure and the rule does not
 * apply; a median gap of 0 (notes on one x) does not apply it either.
 */
export const FAR_FACTOR = 2;

/** The median gap between consecutive values of `xs` (sorted ascending); 0 where there are fewer than two. */
export function medianGap(xs: readonly number[]): number {
	if (xs.length < 2) return 0;
	const gaps = xs.slice(1).map((x, i) => x - xs[i]).sort((a, b) => a - b);
	const mid = gaps.length >> 1;
	return gaps.length % 2 ? gaps[mid] : (gaps[mid - 1] + gaps[mid]) / 2;
}

/** One reader token: its text, and the box it stands in on the page (pixels). */
export interface Token {
	text: string;
	x0: number;
	x1: number;
}

/** One note of the voice staff. */
export interface NotePlace {
	/** The caller's name for the note; `Seat.note` returns it. */
	id: number;
	/** The x of the note's head on the page, in the pixels of the token boxes. */
	x: number;
	/** The bar the note is in; the `order` rule pairs within a bar. */
	bar: number;
	/** The note is tied into: it sings no new syllable. */
	tiedInto?: boolean;
	/** The note is under a printed extender: it sings no new syllable. */
	underExtender?: boolean;
	/**
	 * The note lies after the first note of a printed slur, up to the slur's stop (`slurSpans`, `underlay-prepare.ts`). It
	 * is a continuation only where `seatPage` takes the slur reading for the system (the count gate); until then it is read
	 * by nothing.
	 */
	inSlur?: boolean;
}

/**
 * The note sings no new syllable: tied into, under an extender, or in a printed slur's melisma. The ONLY reader of the
 * three flags (CONTRACT.md §4): `seatTokens`' `free`, `freeNoteXs`, and the sung notes' `continuation` all ask it, so
 * they cannot disagree. `inSlur` is set on a note only where `seatPage` takes the slur reading for its system; a system
 * that does not take it hands the sites notes with `inSlur` false (`underlay-page.ts`).
 */
export function isContinuation(note: NotePlace): boolean {
	return note.tiedInto === true || note.underExtender === true || note.inSlur === true;
}

/**
 * What a token is: a `syllable` (it has a letter), a `joint` (only hyphens), an
 * `extender` (only underscores), or a `mark` (anything else with no letter).
 */
export type SeatKind = 'syllable' | 'joint' | 'extender' | 'mark';

export interface Seat {
	/** The index of the token in the list given. */
	token: number;
	kind: SeatKind;
	text: string;
	/** The token's centre, in page pixels. */
	x: number;
	/** The `id` of the note the token is seated on; null for a token that is not a syllable, or where there is no note. */
	note: number | null;
	/** The token's centre less the note's x, in pixels; null where `note` is. */
	offset: number | null;
	/**
	 * The rule that placed the token, which is `nearest` where `order` fell back to it; `monotone` for a token
	 * `monotone` left over (`unseated`); null for a token that is not a syllable, or where there is no note to seat on.
	 */
	by: SeatRule | null;
	/** A syllable token that no note took: `note` is null. Only `monotone` leaves a token over while there are notes: a surplus token, or a token far from every free note (`FAR_FACTOR`). */
	unseated: boolean;
	/** The token holds a non-letter between letters: two syllables run together, seated whole on one note. */
	runTogether: boolean;
	/** Another token is seated on the same note. */
	shared: boolean;
}

const HYPHENS = /^[-–—‐‑]+$/u;
const UNDERSCORES = /^[_‗]+$/u;
const HAS_LETTER = /\p{L}/u;
const RUN_TOGETHER = /[\p{L}\p{M}][^\p{L}\p{M}]+[\p{L}\p{M}]/u;

export function kindOf(text: string): SeatKind {
	const t = text.trim();
	if (HAS_LETTER.test(t)) return 'syllable';
	if (HYPHENS.test(t)) return 'joint';
	if (UNDERSCORES.test(t)) return 'extender';
	return 'mark';
}

/** Index of the note nearest `cx` among `xs` (sorted ascending); the leftmost on a tie. */
export function nearestOf(cx: number, xs: number[]): number {
	let best = 0;
	for (let j = 1; j < xs.length; j++) if (Math.abs(cx - xs[j]) < Math.abs(cx - xs[best])) best = j;
	return best;
}

/**
 * Rule `monotone`: token k to note j, in order, at least total distance, or -1
 * for a token left over. With no more tokens than notes every token is seated
 * and a note may go without; with more tokens than notes every note is taken
 * and the surplus tokens are left over.
 */
function monotone(cx: number[], xs: number[]): number[] {
	const n = cx.length;
	const m = xs.length;
	const out = new Array<number>(n).fill(-1);
	if (n === 0 || m === 0) return out;
	const INF = 1e18;
	const swap = n > m;
	// rows run over the side that is fully seated (the shorter), columns over the longer side that may skip.
	const rows = swap ? m : n;
	const cols = swap ? n : m;
	const dist = (i: number, j: number) => Math.abs(swap ? cx[j - 1] - xs[i - 1] : cx[i - 1] - xs[j - 1]);
	const cost: number[][] = Array.from({ length: rows + 1 }, (_, i) => new Array<number>(cols + 1).fill(i === 0 ? 0 : INF));
	const took: boolean[][] = Array.from({ length: rows + 1 }, () => new Array<boolean>(cols + 1).fill(false));
	for (let i = 1; i <= rows; i++) {
		for (let j = 1; j <= cols; j++) {
			const take = cost[i - 1][j - 1] + dist(i, j);
			const skip = cost[i][j - 1];
			if (take <= skip) {
				cost[i][j] = take;
				took[i][j] = true;
			} else cost[i][j] = skip;
		}
	}
	let i = rows;
	let j = cols;
	while (i > 0 && j > 0) {
		if (took[i][j]) {
			if (swap) out[j - 1] = i - 1;
			else out[i - 1] = j - 1;
			i--;
			j--;
		} else j--;
	}
	return out;
}

export function seatTokens(tokens: Token[], notes: NotePlace[], rule: SeatRule): Seat[] {
	const centre = tokens.map((t) => (t.x0 + t.x1) / 2);
	// Tokens in x order; the caller's index is kept in `token`.
	const order = tokens.map((_, i) => i).sort((a, b) => centre[a] - centre[b]);
	const kinds = tokens.map((t) => kindOf(t.text));
	const sy = order.filter((i) => kinds[i] === 'syllable');
	const staff = [...notes].sort((a, b) => a.x - b.x);
	// The notes that sing a syllable: not a continuation (`isContinuation`: tied into, under an extender, or in a slur's melisma). Every rule seats on these only; `staff`
	// (all notes, x sorted) is kept for the bar lookup of `order`.
	const free = staff.map((_, j) => j).filter((j) => !isContinuation(staff[j]));
	const xs = free.map((j) => staff[j].x);
	const allXs = staff.map((n) => n.x);

	// For each syllable token (by position in `sy`): the note position in `staff`, and the rule that placed it.
	const at = new Array<number>(sy.length).fill(-1);
	const by = new Array<SeatRule>(sy.length).fill('nearest');
	if (free.length > 0) {
		const cx = sy.map((i) => centre[i]);
		cx.forEach((c, k) => (at[k] = free[nearestOf(c, xs)]));

		if (rule === 'monotone') {
			// A token far from every free note is not the voice's lyric: left out before the alignment, so it takes no note and moves none.
			const reach = FAR_FACTOR * medianGap(xs);
			const near = cx.flatMap((c, k) => (reach > 0 && Math.abs(c - xs[nearestOf(c, xs)]) > reach ? [] : [k]));
			by.fill('monotone');
			at.fill(-1);
			monotone(near.map((k) => cx[k]), xs).forEach((j, n) => {
				at[near[n]] = j < 0 ? -1 : free[j];
			});
		} else if (rule === 'order') {
			const barOf = new Map<number, number[]>();
			cx.forEach((c, k) => {
				const bar = staff[nearestOf(c, allXs)].bar;
				const list = barOf.get(bar);
				if (list) list.push(k);
				else barOf.set(bar, [k]);
			});
			// `sy` is in x order, so each bar's tokens are too.
			for (const [bar, ks] of barOf) {
				const sung = free.filter((j) => staff[j].bar === bar);
				if (sung.length !== ks.length) continue;
				ks.forEach((k, r) => {
					at[k] = sung[r];
					by[k] = 'order';
				});
			}
		}
	}

	const heldBy = new Map<number, number>();
	for (const j of at) if (j >= 0) heldBy.set(j, (heldBy.get(j) ?? 0) + 1);

	const seatOf = new Map<number, { j: number; k: number }>();
	sy.forEach((i, k) => seatOf.set(i, { j: at[k], k }));
	return order.map((i): Seat => {
		const base = { token: i, kind: kinds[i], text: tokens[i].text, x: centre[i] };
		const placed = seatOf.get(i);
		if (!placed || placed.j < 0) {
			const syllable = kinds[i] === 'syllable';
			// A token the rule left over was still placed by the rule: `monotone`, with no note.
			return { ...base, note: null, offset: null, by: placed && free.length > 0 ? by[placed.k] : null, unseated: syllable, runTogether: syllable && RUN_TOGETHER.test(tokens[i].text), shared: false };
		}
		const note = staff[placed.j];
		return {
			...base,
			note: note.id,
			offset: centre[i] - note.x,
			by: by[placed.k],
			unseated: false,
			runTogether: RUN_TOGETHER.test(tokens[i].text),
			shared: (heldBy.get(placed.j) ?? 0) > 1,
		};
	});
}
