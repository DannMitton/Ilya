/**
 * N.160 step 2, THE DRY RUN OF THE HEAL. It works out, for every seat on the
 * score, how the heal would find the seat's word in the poem the singer has
 * now, and it WRITES NOTHING.
 *
 * WHY IT EXISTS. A seat remembers its word by address, `(line, word)`, and an
 * address dies when the poem is re-laid out while no diff is watching (a
 * Clear and a paste, a reload inside the typing pause, an edit during the
 * dictionary load: `memo-n160b-the-approach_r1_2026-09-21.md` s0). Such a
 * seat keeps the text it was placed with, and the Notation switches never
 * reach it. Step 3 heals those seats in place, once. This step computes the
 * same answer read-only and logs it, so the only copy of the fault is never
 * written to blind (`memo-n160b` s2, step 2).
 *
 * THE RULES ARE N.160's, and none is new here
 * (`memo-n160-the-work-and-its-views_r1_2026-09-21.md` s4.1):
 *
 * 1. THE ADDRESS FIRST. A seat whose `(line, word, slot)` still holds a slot
 *    of the same word is fixed as it stands. This is `drawPairings`' own test,
 *    so the count equals N.159's "drawn live".
 * 2. THE ANCHOR. The word's letters (`SlotOrigin.word`) plus the syllable's
 *    ordinal (`slotIndex`). Letters are compared with case and ё folded, as
 *    the gloss guard folds them (`+page.svelte`, `glossAnchorForm`).
 * 3. ORDER IS THE TIEBREAK. The seated words, in the order the notes sing
 *    them, are aligned against the poem's words by a longest common
 *    subsequence, `diffWordGrid`'s algorithm (`text-diff.ts`). Each run of
 *    unfixed seats is aligned only against the words strictly between the
 *    fixed seats on either side of it, so a fixed seat bounds the search.
 *    That is what sends the second «тень» of the music to the second «тень»
 *    of the poem.
 * 4. THE JOINED-RUN RULE. One old word may match a run of two or more
 *    adjacent words of the poem whose letters join to the same thing:
 *    «непроглядная» against «не» + «проглядная». Its syllables map across by
 *    ordinal over the run's slots, because they are the same letters.
 * 5. THE GUARD, DESK DEFAULT of N.160 s4.1. A match is accepted only when it
 *    sits in a run of two or more matched words, or between two seats that
 *    are already fixed. Otherwise it is REJECTED, and the seat keeps what it
 *    shows now.
 *
 * HOW THIS FILE READS THE GUARD, DESK DEFAULT 2026-09-21, reversible:
 * - A "run" is consecutive seated words, in note order, whose matches are
 *   consecutive words of the poem. A fixed seat counts as a matched word, so
 *   a match right beside a fixed seat is in a run of two.
 * - "Between two fixed seats" means the match is the ONLY unfixed seated
 *   word between two fixed ones, and it lands between their words. A wider
 *   reading would accept any match in a bounded window, which is no guard.
 * - Adjacency counts words that own a note (a Cyrillic vowel). A vowelless
 *   clitic owns none, so it never breaks a run.
 *
 * THE SAFETY RULE governs every outcome (`OPEN.md` s N.160): a seat the heal
 * cannot find keeps what it shows now, and it is counted. Nothing here can
 * erase anything, because nothing here writes: the map and the lines are read
 * and never mutated.
 */

import type { LineData } from '$lib/types';
import { buildSlotQueue, type PairingMap, type Slot } from './pairings';

/** The five outcomes. Every seated note lands in exactly one. */
export type HealKind = 'address' | 'anchor' | 'joined' | 'rejected' | 'unfound';

export const HEAL_KINDS: readonly HealKind[] = [
	'address',
	'anchor',
	'joined',
	'rejected',
	'unfound',
];

/** Where a seat points, in the poem's coordinates. */
export interface HealAddress {
	line: number;
	word: number;
	slot: number;
}

/** One seated note, and what the heal would do with it. */
export interface HealCase {
	eventId: string;
	/** 1-based position among the score's notes, or null if this score has
	 *  no such note. */
	note: number | null;
	/** What the note shows now: the stored syllable, verbatim. */
	syllable: string;
	/** The word the seat was placed from, verbatim (`origin.word`). */
	word: string | undefined;
	/** The stored address. */
	from: HealAddress;
	kind: HealKind;
	/** Where the heal would put the seat. For `address` it is `from`; for
	 *  `rejected` it is the match the guard refused; absent for `unfound`. */
	to?: HealAddress;
	/** For `rejected` only: which rule found the refused match. */
	via?: 'anchor' | 'joined';
	/** For `rejected` and `unfound`: why, in a few words. */
	reason?: string;
}

export interface HealPlan {
	/** Every syllable seat in the map. */
	seated: number;
	counts: Record<HealKind, number>;
	/** In note order; seats on no note of this score come last. */
	cases: HealCase[];
}

/** Case and ё folded, as `glossAnchorForm` folds them. */
export function foldLetters(word: string): string {
	return word.toLowerCase().replace(/ё/g, 'е');
}

/** A word of the current poem that owns at least one note. */
interface OwnerWord {
	line: number;
	word: number;
	letters: string;
	slots: Slot[];
}

/** A seated word: consecutive seats, in note order, from one old word. */
interface SeatedWord {
	cases: HealCase[];
	letters: string;
	/** Index into the owner words, for a fixed word. */
	fixedAt: number | null;
	/** The owner-word range the alignment matched, inclusive. */
	match: { start: number; end: number; via: 'anchor' | 'joined' } | null;
}

/** The largest alignment this computes exactly, in cells. Past it, the
 *  window's seats are left unfound rather than guessed at. `diffWordGrid`
 *  caps its own at 600 words a side; this is the same order. */
const ALIGN_CELLS = 360_000;

/** The longest run the joined-run rule tries. An engraver splits a word in
 *  two, rarely three; four covers a word split at every syllable of a
 *  four-syllable word. */
const JOIN_MAX = 4;

/**
 * Work out, read-only, what the heal would do with every seat.
 *
 * `noteOrder` is the score's notes in the order they are sung, the same
 * list the placement writers use (`syllableTargetIds`). `lines` is the RAW
 * transcription of the poem the singer has now.
 */
export function planHeal(
	map: PairingMap,
	lines: readonly LineData[],
	noteOrder: readonly string[],
): HealPlan {
	const queue = buildSlotQueue(lines);
	const bySlot = new Map<string, Slot>();
	const owners: OwnerWord[] = [];
	const ownerAt = new Map<string, number>();
	for (const s of queue) {
		const o = s.origin;
		bySlot.set(`${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`, s);
		const key = `${o.lineIndex}-${o.wordIndex}`;
		let at = ownerAt.get(key);
		if (at === undefined) {
			at = owners.length;
			ownerAt.set(key, at);
			owners.push({
				line: o.lineIndex,
				word: o.wordIndex,
				letters: foldLetters(o.word),
				slots: [],
			});
		}
		owners[at].slots.push(s);
	}

	const position = new Map<string, number>();
	noteOrder.forEach((id, i) => position.set(id, i));

	const cases: HealCase[] = [];
	for (const [eventId, p] of Object.entries(map)) {
		if (p.kind !== 'syllable') continue;
		const o = p.origin;
		const at = position.get(eventId);
		const c: HealCase = {
			eventId,
			note: at === undefined ? null : at + 1,
			syllable: p.cyrillic,
			word: o.word,
			from: { line: o.lineIndex, word: o.wordIndex, slot: o.slotIndex },
			kind: 'unfound',
		};
		const slot = bySlot.get(`${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`);
		if (slot !== undefined && o.word !== undefined && slot.origin.word === o.word) {
			c.kind = 'address';
			c.to = { ...c.from };
		} else if (o.word === undefined) {
			c.reason = 'stored before seats kept their word';
		} else if (at === undefined) {
			c.reason = 'not a note of this score';
		}
		cases.push(c);
	}
	cases.sort((a, b) => (a.note ?? Infinity) - (b.note ?? Infinity));

	/* The seated words, in note order. Only seats on a note of this score
	   take part; an address that holds needs no note to be fixed. */
	const seatedWords: SeatedWord[] = [];
	for (const c of cases) {
		if (c.note === null) continue;
		if (c.kind === 'unfound' && c.reason !== undefined) {
			// No anchor: it cannot match, and it breaks any run it sits in.
			seatedWords.push({ cases: [c], letters: '', fixedAt: null, match: null });
			continue;
		}
		const fixedAt =
			c.kind === 'address' ? (ownerAt.get(`${c.from.line}-${c.from.word}`) ?? null) : null;
		const last = seatedWords[seatedWords.length - 1];
		const head = last?.cases[0];
		if (
			last !== undefined &&
			head !== undefined &&
			head.reason === undefined &&
			head.from.line === c.from.line &&
			head.from.word === c.from.word &&
			head.word === c.word &&
			last.fixedAt === fixedAt
		) {
			last.cases.push(c);
			continue;
		}
		seatedWords.push({
			cases: [c],
			letters: foldLetters(c.word ?? ''),
			fixedAt,
			match: null,
		});
	}

	/* Align each run of unfixed seated words against the words strictly
	   between the fixed words on either side of it. */
	let t = 0;
	while (t < seatedWords.length) {
		if (seatedWords[t].fixedAt !== null) {
			t++;
			continue;
		}
		let u = t;
		while (u < seatedWords.length && seatedWords[u].fixedAt === null) u++;
		const before = t > 0 ? seatedWords[t - 1].fixedAt! : -1;
		const after = u < seatedWords.length ? seatedWords[u].fixedAt! : owners.length;
		const run = seatedWords.slice(t, u).filter((w) => w.letters !== '');
		if (after - before > 1 && run.length > 0) {
			const window = owners.slice(before + 1, after);
			if (run.length * window.length <= ALIGN_CELLS) {
				for (const [w, m] of align(run, window)) {
					w.match = { start: before + 1 + m.start, end: before + 1 + m.end, via: m.via };
				}
			}
		}
		t = u;
	}

	/* The guard, then each seat's verdict. */
	for (let i = 0; i < seatedWords.length; i++) {
		const w = seatedWords[i];
		if (w.fixedAt !== null) continue;
		if (w.match === null) {
			for (const c of w.cases) {
				if (c.reason === undefined) c.reason = 'no word in the poem matches it here';
			}
			continue;
		}
		const accepted = inRunOfTwo(seatedWords, i) || soleBetweenFixed(seatedWords, i);
		const slots = owners.slice(w.match.start, w.match.end + 1).flatMap((o) => o.slots);
		for (const c of w.cases) {
			const slot = slots[c.from.slot];
			if (slot === undefined) {
				c.reason = 'its word was found, but not this syllable';
				continue;
			}
			c.to = {
				line: slot.origin.lineIndex,
				word: slot.origin.wordIndex,
				slot: slot.origin.slotIndex,
			};
			if (accepted) {
				c.kind = w.match.via;
			} else {
				c.kind = 'rejected';
				c.via = w.match.via;
				c.reason = 'the guard: alone, with no matched neighbour';
			}
		}
	}

	const counts: Record<HealKind, number> = {
		address: 0,
		anchor: 0,
		joined: 0,
		rejected: 0,
		unfound: 0,
	};
	for (const c of cases) counts[c.kind]++;
	return { seated: cases.length, counts, cases };
}

/** The owner-word range a seated word occupies, fixed or matched. */
function span(w: SeatedWord): { start: number; end: number } | null {
	if (w.fixedAt !== null) return { start: w.fixedAt, end: w.fixedAt };
	return w.match;
}

/** Whether seated word `a` is followed directly by `b` in the poem too. */
function adjacent(a: SeatedWord | undefined, b: SeatedWord | undefined): boolean {
	if (a === undefined || b === undefined) return false;
	const x = span(a);
	const y = span(b);
	return x !== null && y !== null && y.start === x.end + 1;
}

function inRunOfTwo(words: readonly SeatedWord[], i: number): boolean {
	return adjacent(words[i - 1], words[i]) || adjacent(words[i], words[i + 1]);
}

function soleBetweenFixed(words: readonly SeatedWord[], i: number): boolean {
	const prev = words[i - 1];
	const next = words[i + 1];
	const m = words[i].match;
	return (
		m !== null &&
		prev?.fixedAt != null &&
		next?.fixedAt != null &&
		prev.fixedAt < m.start &&
		m.end < next.fixedAt
	);
}

/**
 * The longest common subsequence of seated words against poem words, with
 * the joined-run rule as a second way for one old word to match. A suffix
 * table, walked forward, so every tie resolves to the EARLIEST poem word:
 * the order the music sings them.
 *
 * A whole-word match is preferred over a join where both score the same.
 */
function align(
	olds: readonly SeatedWord[],
	cur: readonly OwnerWord[],
): Map<SeatedWord, { start: number; end: number; via: 'anchor' | 'joined' }> {
	const n = olds.length;
	const m = cur.length;
	const width = m + 1;
	const best = new Int32Array((n + 1) * width);
	const at = (i: number, j: number) => i * width + j;

	/* The join lengths that spell each old word from each poem word, found
	   once rather than in both passes. */
	const joins: number[][][] = olds.map((o) =>
		cur.map((_, j) => {
			const found: number[] = [];
			let letters = cur[j].letters;
			for (let k = 2; k <= JOIN_MAX && j + k <= m; k++) {
				letters += cur[j + k - 1].letters;
				if (letters.length > o.letters.length) break;
				if (letters === o.letters) found.push(k);
			}
			return found;
		}),
	);

	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			let v = Math.max(best[at(i + 1, j)], best[at(i, j + 1)]);
			if (olds[i].letters === cur[j].letters) v = Math.max(v, 1 + best[at(i + 1, j + 1)]);
			for (const k of joins[i][j]) v = Math.max(v, 1 + best[at(i + 1, j + k)]);
			best[at(i, j)] = v;
		}
	}

	const out = new Map<SeatedWord, { start: number; end: number; via: 'anchor' | 'joined' }>();
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		const v = best[at(i, j)];
		if (v === 0) break;
		if (olds[i].letters === cur[j].letters && v === 1 + best[at(i + 1, j + 1)]) {
			out.set(olds[i], { start: j, end: j, via: 'anchor' });
			i++;
			j++;
			continue;
		}
		const k = joins[i][j].find((len) => v === 1 + best[at(i + 1, j + len)]);
		if (k !== undefined) {
			out.set(olds[i], { start: j, end: j + k - 1, via: 'joined' });
			i++;
			j += k;
			continue;
		}
		if (v === best[at(i, j + 1)]) j++;
		else i++;
	}
	return out;
}

/* ── The log ─────────────────────────────────────────────────────── */

/** The console prefix the desk searches for. */
export const DRY_RUN_PREFIX = '[Ilya] N.160 dry run';

function address(a: HealAddress): string {
	return `${a.line}-${a.word}.${a.slot}`;
}

/** One seat, as the log prints it. */
export function describeCase(c: HealCase): string {
	const note = c.note === null ? 'no note' : `note ${c.note}`;
	let s = `${note} ${c.eventId} «${c.syllable}» of «${c.word ?? '?'}» ${address(c.from)}`;
	if (c.kind !== 'address' && c.to) s += ` -> ${address(c.to)}`;
	if (c.via) s += ` by ${c.via}`;
	if (c.reason) s += ` (${c.reason})`;
	return s;
}

/**
 * The dry run's console lines. The first is the totals and always prints;
 * then one line per non-empty outcome, listing every seat in it, in note
 * order. Plain strings, so they read the same in any console and in a
 * console-reading tool.
 */
export function dryRunLog(plan: HealPlan): string[] {
	const sum = HEAL_KINDS.map((k) => `${plan.counts[k]} ${k}`).join(' + ');
	const lines = [`${DRY_RUN_PREFIX}: ${plan.seated} seated = ${sum}. Nothing written.`];
	for (const kind of HEAL_KINDS) {
		const these = plan.cases.filter((c) => c.kind === kind);
		if (these.length === 0) continue;
		lines.push(
			`${DRY_RUN_PREFIX}, ${kind} (${these.length}): ${these.map(describeCase).join(' | ')}`,
		);
	}
	return lines;
}

/* ── N.160 step 3, the write ─────────────────────────────────────── */

/**
 * The heal's write: every `anchor` and `joined` seat takes the slot the plan
 * found for it, text and all, the way `reseat.ts` refreshes a seat whose word
 * moved. A `rejected` or `unfound` seat is not touched, and neither is an
 * `address` seat: the plan's outcome is the whole decision.
 *
 * NOTHING IS MUTATED. Where nothing is written the SAME map comes back, so a
 * caller can test identity and skip the assignment, and a song with nothing
 * to repair is never saved by the heal.
 */
export function applyHeal(
	map: PairingMap,
	plan: HealPlan,
	lines: readonly LineData[],
): { map: PairingMap; wrote: HealCase[] } {
	const bySlot = new Map<string, Slot>();
	for (const s of buildSlotQueue(lines)) {
		bySlot.set(`${s.origin.lineIndex}-${s.origin.wordIndex}-${s.origin.slotIndex}`, s);
	}
	const wrote: HealCase[] = [];
	let next: PairingMap | null = null;
	for (const c of plan.cases) {
		if ((c.kind !== 'anchor' && c.kind !== 'joined') || !c.to) continue;
		const slot = bySlot.get(`${c.to.line}-${c.to.word}-${c.to.slot}`);
		if (slot === undefined || map[c.eventId]?.kind !== 'syllable') continue;
		next ??= { ...map };
		next[c.eventId] = {
			kind: 'syllable',
			cyrillic: slot.cyrillic,
			ipa: slot.ipa,
			vowel: slot.vowel,
			origin: slot.origin,
		};
		wrote.push(c);
	}
	return { map: next ?? map, wrote };
}

/** The console prefix of the heal's own record of what it wrote. */
export const HEAL_PREFIX = '[Ilya] N.160 heal';

/**
 * What the heal wrote, per song, in the dry run's format. Printed only when
 * it wrote something, so a heal line in the console IS the record of a
 * write: a seat that changed on a load with no such line was changed by
 * something else.
 */
export function healLog(songId: string, plan: HealPlan, wrote: readonly HealCase[]): string[] {
	if (wrote.length === 0) return [];
	const written = new Set(wrote.map((c) => c.eventId));
	const left = plan.cases.filter(
		(c) => (c.kind === 'rejected' || c.kind === 'unfound') && !written.has(c.eventId),
	);
	const n = (kind: HealKind, from: readonly HealCase[]) => from.filter((c) => c.kind === kind);
	const lines = [
		`${HEAL_PREFIX}, song ${songId}: wrote ${wrote.length} of ${plan.seated} seated = ` +
			`${n('anchor', wrote).length} anchor + ${n('joined', wrote).length} joined; ` +
			`left ${n('rejected', left).length} rejected + ${n('unfound', left).length} unfound as they were.`,
	];
	for (const [label, these] of [
		['wrote anchor', n('anchor', wrote)],
		['wrote joined', n('joined', wrote)],
		['left rejected', n('rejected', left)],
		['left unfound', n('unfound', left)],
	] as const) {
		if (these.length === 0) continue;
		lines.push(`${HEAL_PREFIX}, ${label} (${these.length}): ${these.map(describeCase).join(' | ')}`);
	}
	return lines;
}
