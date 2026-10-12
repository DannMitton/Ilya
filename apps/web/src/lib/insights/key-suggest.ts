/**
 * N.182, HOW ILYA SUGGESTS A KEY (QUEUE row 71; brief
 * `docs/sessions/brief-code-n182-suggesting-a-key_r2_2026-10-11.md`; the design
 * is Dann's, agreed 2026-10-11 13:38 to 13:55 and ruled 14:09,
 * `draft-n182-suggesting-a-key_r1_2026-10-11.md`; reviewed by Fable,
 * `review-fable-n182_r1_2026-10-11.md`).
 *
 * Not a key with every challenge removed: keys that let the singer see, and
 * consent to, the challenges each brings. Ilya presents; the singer chooses.
 *
 * THE RULES, as the brief numbers them:
 *  1. One source of keys on Insights: this search, whether or not the written
 *     key is in range. Markup's ruler is untouched.
 *  2. Reach: six semitones either way (`KEY_SEARCH_WINDOW`).
 *  3. Two challenges, pitch-dependent only. Range: inside, or beyond by up to
 *     `RANGE_CHALLENGE_MARGIN` semitones above or below (a challenge); farther
 *     is not workable, shown only under the reveal. Passaggio time: the share
 *     at or above the primo and the share above the secondo, as the page's own
 *     zones count them; a held note above the secondo is the example a line may
 *     name. Tessitura and crossings are neither challenges nor gates.
 *  4. Keys group by their challenge set. Within a group the smallest move is
 *     shown, but only a move that changes something that matters: a challenge
 *     gained or lost, or a share moved by `BETTER_KEY_MIN_DROP` against the
 *     written key. A group with no such key is not shown.
 *  5. Order by stakes for this singer (the intake weighting), then the smaller
 *     share at or above the primo, then the smaller move, then the lower key.
 *     At most `MAX_KEY_GROUPS` groups (DESK DEFAULT, Dann's to strike); the
 *     rest sit under the reveal.
 *  6. Vowels past their turn are described, never counted as a challenge; only
 *     vowels whose fR1 is sung or derived count (`fR1Source`), never a
 *     placeholder.
 *  7. Nothing here reads the declared voice type.
 *  8. The answers change the wording, never which keys are shown (in
 *     `singer-blocks.ts`); here they only weigh the stakes.
 *  9. Without typed passaggi the set has the range axis only; without a typed
 *     range there is no search.
 *
 * PURE: a score, a voice, and the written key's facts in; the keys out.
 */
import {
	pitchToMidi,
	transposeScore,
	type IntakeAnswers,
	type IntakePoint,
	type ParsedScore,
	type VoiceProfileSnapshot,
	type VowelForEvent,
} from '@ilya/score-parser';
import { buildInsights } from './insights';
import type { NoteFacts } from './comments';
import { BETTER_KEY_MIN_DROP, KEY_SEARCH_WINDOW, shareAboveSecondo, shareAtOrAbovePrimo, vowelTurns } from './singer-page';

/** How far past the typed range a key may reach and still be workable, in semitones (Dann 2026-10-11 13:51). */
export const RANGE_CHALLENGE_MARGIN = 2;
/** At most this many groups are shown before the reveal. DESK DEFAULT, Dann's to strike. */
export const MAX_KEY_GROUPS = 3;

/**
 * The weight of a challenge by the singer's answer to its question: points 1
 * to 2 weigh 1.0, point 3 weighs 0.75, points 4 to 5 weigh 0.5, and "not sure"
 * or no answer weighs 1.0 (DESK DEFAULT, JUDGEMENT; brief rule 5).
 */
export function challengeWeight(p: IntakePoint | undefined): number {
	if (p === undefined || p === 'not-sure') return 1;
	return p <= 2 ? 1 : p === 3 ? 0.75 : 0.5;
}

export type RangeAxis = 'inside' | 'above' | 'below' | 'both';

/** A key's challenge set (brief rule 4). The passaggio axes are absent without typed passaggi. */
export interface ChallengeSet {
	range: RangeAxis;
	primo?: boolean;
	secondo?: boolean;
	held?: boolean;
}

/** The notes past the range on one side: how many, how far the farthest goes, and the bar of the farthest. */
export interface Beyond {
	count: number;
	semitones: number;
	bar: string;
}

export interface KeyOption {
	/** Signed semitones from the written key; 0 is the written key. */
	semitones: number;
	workable: boolean;
	set: ChallengeSet;
	above: Beyond | null;
	below: Beyond | null;
	/** Shares of sung time, 0 to 1; null without typed passaggi. */
	primoShare: number | null;
	secondoShare: number | null;
	/** The longest held note above the secondo in this key: its bar. */
	held: { bar: string } | null;
	/** Share of sung time past the turn, sung and derived vowels only; null when none counts. */
	pastTurn: number | null;
	/** The challenge set's weight for this singer. */
	stakes: number;
}

export interface KeySuggestion {
	/** `none`: the written key's set is empty and no key matters; `noneBetter`: it has challenges and no key changes them; `noWorkable`: no key within reach is workable; `keys`: one to three to show. */
	kind: 'none' | 'noneBetter' | 'noWorkable' | 'keys';
	written: KeyOption;
	shown: KeyOption[];
	/** Under "Show keys that reach higher": the capped groups, then the keys beyond the margin, nearest first. */
	reveal: KeyOption[];
	/** True when more groups qualified than `MAX_KEY_GROUPS`. */
	capBound: boolean;
}

export interface KeySearchInput {
	/** The score in performance order, as the page's other figures read it. */
	score: ParsedScore;
	profile: VoiceProfileSnapshot;
	/** The written key's note facts (`noteFacts`), for the held notes; null without them. */
	facts: readonly NoteFacts[] | null;
	vowelForEvent?: VowelForEvent;
	intake?: IntakeAnswers;
	window?: number;
}

const setKey = (s: ChallengeSet) => `${s.range}|${s.primo ?? '-'}|${s.secondo ?? '-'}|${s.held ?? '-'}`;
const sameSet = (a: ChallengeSet, b: ChallengeSet) => setKey(a) === setKey(b);

function measureNumber(score: ParsedScore, index: number): string {
	return score.measures[index]?.number || String(index + 1);
}

/** The challenge set's stakes: each challenge weighed by the answer to its own question (brief rules 5 and 8). */
export function stakesOf(set: ChallengeSet, intake: IntakeAnswers | undefined): number {
	let s = 0;
	if (set.range === 'above' || set.range === 'both') s += challengeWeight(intake?.top);
	if (set.range === 'below' || set.range === 'both') s += challengeWeight(intake?.bottom);
	if (set.primo) s += challengeWeight(intake?.passaggi);
	if (set.secondo) s += challengeWeight(intake?.passaggi);
	if (set.held) s += challengeWeight(intake?.sustained);
	return s;
}

/** True when `k` changes something that matters against `w` (brief rule 4). */
export function matters(k: KeyOption, w: KeyOption): boolean {
	if (!sameSet(k.set, w.set)) return true;
	const moved = (a: number | null, b: number | null) => a !== null && b !== null && Math.abs(a - b) >= BETTER_KEY_MIN_DROP - 1e-9;
	return moved(k.primoShare, w.primoShare) || moved(k.secondoShare, w.secondoShare);
}

/** One key, measured. */
export function measureKey(input: KeySearchInput, semitones: number): KeyOption | null {
	const { score, profile, facts, vowelForEvent, intake } = input;
	if (!profile.range) return null;
	const top = pitchToMidi(profile.range.highest);
	const bottom = pitchToMidi(profile.range.lowest);

	// Range, from the written notes moved by `semitones`; each event once.
	const seen = new Set<string>();
	let above: Beyond | null = null;
	let below: Beyond | null = null;
	for (const ev of score.vocalLine) {
		if (!ev.pitch || seen.has(ev.id)) continue;
		seen.add(ev.id);
		const m = pitchToMidi(ev.pitch) + semitones;
		if (m > top) {
			const d = m - top;
			above = above ? { count: above.count + 1, semitones: Math.max(above.semitones, d), bar: d > above.semitones ? measureNumber(score, ev.measureIndex) : above.bar } : { count: 1, semitones: d, bar: measureNumber(score, ev.measureIndex) };
		} else if (m < bottom) {
			const d = bottom - m;
			below = below ? { count: below.count + 1, semitones: Math.max(below.semitones, d), bar: d > below.semitones ? measureNumber(score, ev.measureIndex) : below.bar } : { count: 1, semitones: d, bar: measureNumber(score, ev.measureIndex) };
		}
	}
	const range: RangeAxis = above && below ? 'both' : above ? 'above' : below ? 'below' : 'inside';
	const workable = (above?.semitones ?? 0) <= RANGE_CHALLENGE_MARGIN && (below?.semitones ?? 0) <= RANGE_CHALLENGE_MARGIN;

	// Passaggio time, as the page's own zones count it, in this key.
	const shifted = semitones === 0 ? score : transposeScore(score, semitones);
	const model = buildInsights({ analysisScore: shifted, profile, watchList: null });
	const primoShare = profile.passaggio ? shareAtOrAbovePrimo(model) : null;
	const secondoShare = profile.passaggio ? shareAboveSecondo(model) : null;

	// A held note above the secondo: the written key's held notes, moved.
	let held: { bar: string } | null = null;
	if (profile.passaggio && facts) {
		let best: NoteFacts | null = null;
		for (const f of facts) {
			if (!f.chainHead || !f.note.held || f.toSecondo === undefined || f.toSecondo + semitones <= 0) continue;
			if (!best || (f.chainSeconds ?? 0) > (best.chainSeconds ?? 0)) best = f;
		}
		if (best) held = { bar: measureNumber(score, best.note.measureIndex) };
	}

	// Vowels past their turn: sung and derived vowels only (rule 6).
	let pastTurn: number | null = null;
	if (vowelForEvent) {
		const turns = vowelTurns(shifted, profile, vowelForEvent);
		const counts = (v: string) => profile.fR1Source?.[v] !== 'surrogate';
		const rows = turns?.rows.filter((r) => r.turn && counts(r.vowel)) ?? [];
		const time = rows.reduce((a, r) => a + r.share, 0);
		if (time > 0) pastTurn = rows.reduce((a, r) => a + r.pastShare, 0) / time;
	}

	const set: ChallengeSet = {
		range,
		...(profile.passaggio
			? { primo: (primoShare ?? 0) > 0, secondo: (secondoShare ?? 0) > 0, held: held !== null }
			: {}),
	};
	return { semitones, workable, set, above, below, primoShare, secondoShare, held, pastTurn, stakes: stakesOf(set, intake) };
}

/** The keys to show (brief rules 1 to 9). Null without a typed range. */
export function suggestKeys(input: KeySearchInput): KeySuggestion | null {
	if (!input.profile.range) return null;
	const window = input.window ?? KEY_SEARCH_WINDOW;
	const written = measureKey(input, 0)!;
	const others: KeyOption[] = [];
	for (let s = -window; s <= window; s++) {
		if (s === 0) continue;
		const k = measureKey(input, s);
		if (k) others.push(k);
	}
	const workable = others.filter((k) => k.workable);
	const beyond = others.filter((k) => !k.workable).sort((a, b) => Math.abs(a.semitones) - Math.abs(b.semitones) || a.semitones - b.semitones);

	// Group workable keys by challenge set; each group shows its smallest move that matters.
	const groups = new Map<string, KeyOption[]>();
	for (const k of workable) {
		const key = setKey(k.set);
		groups.set(key, [...(groups.get(key) ?? []), k]);
	}
	const picks: KeyOption[] = [];
	for (const members of groups.values()) {
		const pick = [...members]
			.sort((a, b) => Math.abs(a.semitones) - Math.abs(b.semitones) || a.semitones - b.semitones)
			.find((k) => matters(k, written));
		if (pick) picks.push(pick);
	}
	picks.sort(
		(a, b) =>
			a.stakes - b.stakes ||
			(a.primoShare ?? 0) - (b.primoShare ?? 0) ||
			Math.abs(a.semitones) - Math.abs(b.semitones) ||
			a.semitones - b.semitones,
	);
	// A written key that suits (range inside, nothing at or above the primo: brief, "No key suggested")
	// is not followed by keys that only add challenges; they wait under the reveal (DESK DEFAULT).
	const suits = written.set.range === 'inside' && !written.set.primo;
	const shown = suits ? [] : picks.slice(0, MAX_KEY_GROUPS);
	const reveal = [...(suits ? picks : picks.slice(MAX_KEY_GROUPS)), ...beyond];
	const capBound = !suits && picks.length > MAX_KEY_GROUPS;

	let kind: KeySuggestion['kind'];
	if (!written.workable && workable.length === 0) kind = 'noWorkable';
	else if (suits) kind = 'none';
	else if (shown.length > 0) kind = 'keys';
	else kind = 'noneBetter';
	return { kind, written, shown, reveal, capBound };
}
