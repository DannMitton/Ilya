/**
 * ROW 181 STEP 5. THE JOIN, ON THE PAGE: when it runs, what it writes, how it is undone.
 *
 * `poem-join.ts` decides; this applies, once, and remembers enough to take it back. It is `poem-offer.svelte.ts`'s shape: the
 * state that outlives nothing (session only), the logic here, one `attach` call in `routes/+page.svelte` (`+page.svelte` is at its
 * size ceiling, so that call is made on a line that already existed and no line was added).
 *
 * WHEN. Poem arrives (the library fills it, or she pastes it) or is edited: `poemOffer` calls `schedule()`, and the join runs
 * after the 600 ms pause that Lyrics typing uses (`QUIET_MS`, `+page.svelte`). A scan's Lyrics edits do not start it: NOT BUILT.
 * It runs only for a scan whose score carries words (the page's `state()` is null otherwise), with the dictionary loaded (without
 * it every word fails and every word would be repaired), and not after Revert for the same poem.
 *
 * WHAT. The repairs and fills it applies are one Lyrics edit, sent by the path a typed edit takes (`setLyrics`), so the seats
 * follow by the diff (`score/reseat.ts`). POEM is never written. A run it cannot fill is an offer: nothing is drawn and nothing is
 * changed (Dann 2026-11-04 14:00); the Loupe is its door (step 6).
 *
 * UNDO. In memory for the session, like `poemOffer`'s Revert (and for the same reason): the Lyrics before the join. The marks
 * (the dotted underline), the receipt line, and Revert stand only while the Lyrics still have the words the join left, whatever
 * the line breaks; the first edit to those words ends them, which is how a hand edit clears a repaired word's mark.
 *
 * THE SELF-CHECK (Dann 2026-11-04 10:36, item 7). After the plan is made, the pure cross-check applies it and runs the tiers on
 * the result: anything it would repair a second time is a fault, counted and printed, never looped. The line printed on the
 * console is the desk's measure of the join on a real song.
 */
import type { LineData } from '$lib/types';
import type { PairingMap } from '$lib/score/pairings';
import type { BarRange } from '$lib/omr/unread-bars';
import { tokenize } from './poem-compare';
import { applyProposals, crossCheck, planJoin, type JoinInput, type JoinResult, type JoinRun, type SlotLike } from './poem-join';
import { buildRuns, byFromScan, joinIsWord, slotsFor, tokenMapOf, tokensIn, type RunEvent } from './poem-join-wire';

/** The quiet pause, as Lyrics typing has it. */
export const JOIN_PAUSE_MS = 600;

/** What the page lends: the open song's text, the one Lyrics edit it can make, and the scan's state. */
export interface JoinDeps {
	doc(): { readonly id: string; readonly inputText: string; readonly publishedPoem: string; readonly readOnly: boolean };
	setLyrics(text: string): void;
	/** The scan's state for the join, or null where the song is not a scan whose score carries words. */
	state(): JoinState | null;
	/** The dictionary and the slot count; the page's own by default. */
	isWord?: (word: string) => boolean;
	slotsOf?: (words: readonly string[]) => SlotLike[];
}

export interface JoinState {
	/** The score's own words, as the score gave them. */
	scanText: string;
	/** The transcription of the open Lyrics. */
	lines: readonly LineData[];
	events: readonly RunEvent[];
	pairings: PairingMap;
	unreadBars: readonly BarRange[];
	/** The dictionary has loaded. */
	ready: boolean;
}

/** One join as applied: enough to mark it, count it, and take it back. */
interface Applied {
	songId: string;
	/** The Lyrics before the join. */
	before: string;
	/** The folded words of the Lyrics as the join left them, in order: the marks hold while this is still so. */
	key: string;
	/** The tokens the join wrote, with the scan's word where it was a repair. */
	marks: { token: number; was: string }[];
	syllables: number;
	words: number;
}

/** The words of a text, folded and in order, as one string: what stays the same through a change of line breaks. */
export const wordKey = (text: string): string => tokenize(text).map((t) => t.folded).filter((f) => f !== '').join('|');

export class PoemJoin {
	#deps: JoinDeps | null = null;
	#timer: ReturnType<typeof setTimeout> | null = null;
	/** Reactive: a view that reads `marks` or `receipt` updates when a join is applied or reverted. */
	#applied = $state<Applied | null>(null);
	#suppressed = new Set<string>();
	#last = '';
	/** The last plan, for the Loupe's "Fill from the poem": the runs the count rule refused, with the poem words that stand between their anchors. Null once the Lyrics have moved on. */
	#plan = $state.raw<{ songId: string; lyrics: string; input: JoinInput; result: JoinResult } | null>(null);
	/** The last run's counts, for the console and the tests. */
	lastLine = '';

	attach(deps: JoinDeps): void {
		this.#deps = deps;
	}

	/** Poem arrived or changed: run after the pause. */
	schedule(): void {
		if (!this.#deps) return;
		if (this.#timer !== null) clearTimeout(this.#timer);
		this.#timer = setTimeout(() => {
			this.#timer = null;
			this.run();
		}, JOIN_PAUSE_MS);
	}

	run(): void {
		const deps = this.#deps;
		if (!deps) return;
		const doc = deps.doc();
		const poem = doc.publishedPoem;
		if (doc.readOnly || poem.trim() === '') return;
		const state = deps.state();
		if (!state || !state.ready) return;
		const lyrics = doc.inputText;
		const sig = `${doc.id}|${poem}|${lyrics}`;
		if (sig === this.#last || this.#suppressed.has(`${doc.id}|${poem}`)) return;
		this.#last = sig;
		const map = tokenMapOf(state.lines, lyrics);
		if (!map) {
			this.#say('the transcription of Lyrics does not line up with its words, so nothing is joined');
			return;
		}
		const tokens = tokenize(lyrics);
		const runs = buildRuns(state.events, state.pairings, map, state.unreadBars, tokens.length);
		const mine = this.#applied && this.#applied.songId === doc.id && this.#applied.key === wordKey(lyrics) ? new Set(this.#applied.marks.map((m) => m.token)) : new Set<number>();
		const input: JoinInput = {
			lyrics,
			poem,
			by: byFromScan(lyrics, state.scanText, mine),
			slotsOf: deps.slotsOf ?? slotsFor,
			isWord: deps.isWord ?? joinIsWord,
			runs: runs.runs,
		};
		const plan = planJoin(input);
		const applied = applyProposals(input, plan);
		const check = crossCheck(input, plan);
		this.#plan = { songId: doc.id, lyrics, input, result: plan };
		const count = (kind: string): number => plan.proposals.filter((p) => p.kind === kind).length;
		const offers = plan.proposals.filter((p) => p.kind === 'offer');
		const say = `${count('repair')} repaired, ${count('fill')} filled, ${count('keep-composer')} kept as the composer's, ${offers.length} offered (${[...new Set(offers.map((o) => (o.kind === 'offer' ? o.why : '')))].join(', ') || 'none'}), ${runs.runs.length} run(s) of notes with no word, ${runs.unmapped} syllable(s) not placed, ${plan.dropped.repair + plan.dropped.fill} dropped by the one-vowel check, ${check.fault} fault(s) on the second pass`;
		this.#say(say);
		if (applied.text === lyrics || applied.written.length === 0) return;
		const syllables = plan.proposals.reduce((n, p) => n + (p.kind === 'fill' ? p.slots : p.kind === 'repair' ? (deps.slotsOf ?? slotsFor)([p.to]).length : 0), 0);
		const marked = tokensIn(applied.text, applied.written);
		const wasOf = new Map<number, string>();
		const after = tokenize(applied.text);
		for (const w of applied.written) {
			if (w.kind !== 'repair') continue;
			const t = after.findIndex((x) => x.start <= w.start && x.end >= w.end);
			if (t >= 0) wasOf.set(t, w.was);
		}
		this.#applied = { songId: doc.id, before: lyrics, key: wordKey(applied.text), marks: marked.map((token) => ({ token, was: wasOf.get(token) ?? '' })), syllables, words: marked.length };
		this.#last = `${doc.id}|${poem}|${applied.text}`;
		deps.setLyrics(applied.text);
	}

	#say(line: string): void {
		this.lastLine = line;
		console.info(`[ilya] poem join: ${line}`);
	}

	/** The join as it stands on this song, while the Lyrics are still the words it left; else null. */
	#current(songId: string, lyrics: string): Applied | null {
		const a = this.#applied;
		return a && a.songId === songId && a.key === wordKey(lyrics) ? a : null;
	}

	/** The receipt's counts, or null. */
	receipt(songId: string, lyrics: string): { syllables: number; words: number } | null {
		const a = this.#current(songId, lyrics);
		return a ? { syllables: a.syllables, words: a.words } : null;
	}

	/** The written words as ranges in `lyrics` (any line breaks), each with the scan's word where it was a repair. */
	marks(songId: string, lyrics: string): { start: number; end: number; was: string }[] {
		const a = this.#current(songId, lyrics);
		if (!a) return [];
		const tokens = tokenize(lyrics);
		return a.marks.flatMap((m) => (tokens[m.token] ? [{ start: tokens[m.token].start, end: tokens[m.token].end, was: m.was }] : []));
	}

	/**
	 * The run the Loupe's "Fill from the poem" can fill for this bar (a song bar): a run the count rule refused whose anchors are
	 * both words, with the poem words between them (`poemFrom .. poemTo`). Null where there is none, or the Lyrics have changed
	 * since the plan (the join runs again after the pause and makes a new one).
	 */
	fillable(songId: string, lyrics: string, bar: number): { run: JoinRun; poemFrom: number; poemTo: number } | null {
		const plan = this.#plan;
		if (!plan || plan.songId !== songId || plan.lyrics !== lyrics) return null;
		for (const p of plan.result.proposals) {
			if (p.kind !== 'offer' || !p.run || p.poemFrom === undefined || p.poemTo === undefined || p.why === 'no-poem') continue;
			const run = plan.input.runs?.find((r) => r.id === p.run);
			if (run && bar >= run.bars[0] && bar <= run.bars[1] && !Number.isNaN(run.afterWord) && !Number.isNaN(run.beforeWord)) return { run, poemFrom: p.poemFrom, poemTo: p.poemTo };
		}
		return null;
	}

	/** `fillable` for the open song as it stands now: what the Loupe asks to decide whether to draw its button. */
	canFill(bar: number): boolean {
		const doc = this.#deps?.doc();
		return !!doc && !doc.readOnly && this.fillable(doc.id, doc.inputText, bar) !== null;
	}

	/**
	 * "Fill from the poem" on a bar (amendment 9): ONE tap inserts the poem's words between the run's two paired neighbours into
	 * Lyrics at that place, marked. The existing reseat seats them on the open notes in order (`score/reseat.ts`); words past the
	 * last open note stay in Lyrics unseated, as stage 3 item 5 does, and the bar stays in the banner until she places them. It
	 * applies even where the count rule refused the run: she asked. The receipt and Revert cover it with the rest of the join.
	 */
	fillBar(bar: number): boolean {
		const deps = this.#deps;
		if (!deps) return false;
		const doc = deps.doc();
		const can = this.fillable(doc.id, doc.inputText, bar);
		const plan = this.#plan;
		if (!can || !plan || doc.readOnly) return false;
		const result: JoinResult = { ...plan.result, proposals: [{ kind: 'fill', run: can.run.id, afterWord: can.run.afterWord, poemFrom: can.poemFrom, poemTo: can.poemTo, slots: 0 }] };
		const applied = applyProposals(plan.input, result);
		if (applied.text === doc.inputText || applied.written.length === 0) return false;
		const slots = (deps.slotsOf ?? slotsFor)(Array.from({ length: can.poemTo - can.poemFrom + 1 }, (_, k) => plan.result.comparison!.poem[can.poemFrom + k]).filter((t) => t.folded !== '').map((t) => plan.input.poem.slice(t.start, t.end))).length;
		const marked = tokensIn(applied.text, applied.written);
		const earlier = this.#current(doc.id, doc.inputText);
		const shifted = (earlier?.marks ?? []).map((m) => ({ ...m, token: m.token > can.run.afterWord ? m.token + marked.length : m.token }));
		this.#applied = {
			songId: doc.id,
			before: earlier?.before ?? doc.inputText,
			key: wordKey(applied.text),
			marks: [...shifted, ...marked.map((token) => ({ token, was: '' }))].sort((a, b) => a.token - b.token),
			syllables: (earlier?.syllables ?? 0) + slots,
			words: (earlier?.words ?? 0) + marked.length,
		};
		this.#last = `${doc.id}|${doc.publishedPoem}|${applied.text}`;
		this.#plan = null;
		deps.setLyrics(applied.text);
		return true;
	}

	/** Take the join back: Lyrics as they were before it, no second join for this poem. */
	revert(): void {
		const deps = this.#deps;
		if (!deps) return;
		const doc = deps.doc();
		const a = this.#current(doc.id, doc.inputText);
		if (!a) return;
		this.#suppressed.add(`${doc.id}|${doc.publishedPoem}`);
		this.#applied = null;
		this.#last = `${doc.id}|${doc.publishedPoem}|${a.before}`;
		deps.setLyrics(a.before);
	}
}

export const poemJoin = new PoemJoin();
