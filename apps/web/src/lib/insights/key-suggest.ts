/**
 * N.182, HOW ILYA SUGGESTS A KEY (QUEUE row 71; brief r3
 * `docs/sessions/brief-code-n182-suggesting-a-key_r3_2026-11-01.md`, Fable's
 * review of 2026-11-01 A1 to A12, Dann's rulings of 2026-10-11 and 2026-11-01).
 * The design is Dann's, agreed 2026-10-11 13:38 to 13:55.
 *
 * Not a key with every challenge removed: keys that let the singer see, and
 * consent to, the challenges each brings. Ilya presents; the singer chooses.
 *
 * THE RULES, as the brief numbers them, with the amendments:
 *  1. One source of keys on Insights: this search, whether or not the key the
 *     page reads is in range. Markup's ruler is untouched.
 *     A1: the reference key is the key INSIGHTS analyses, the key the singer
 *     chose on MELODY (or the printed key), after the octave reading of row 47.
 *     Every move is measured from that score, `analysisScore`.
 *  2. Reach: six semitones either way (`KEY_SEARCH_WINDOW`).
 *  3. Two challenges, pitch-dependent only. Range: inside; beyond by up to
 *     `RANGE_CHALLENGE_MARGIN` semitones above or below (a named challenge);
 *     farther is not workable, shown only under the reveal. Passaggio time:
 *     the share at or above the primo and the share above the secondo, as the
 *     page's own zones count them; a sustained note above the secondo is the
 *     example a line may name. Tessitura and crossings are neither.
 *  4. Keys group by challenge set. Within a group the smallest move is shown,
 *     and only a key with FEWER challenges than the key read is offered
 *     (`improves`, Dann 2026-11-05 11:49): a swap of one challenge for another never is.
 *  5. Order by stakes for this singer (the intake weighting), then the smaller
 *     share at or above the primo, then the smaller move, then the lower key.
 *     At most `MAX_KEY_GROUPS` groups (DESK DEFAULT, Dann's to strike).
 *  6. Vowels past their turn are described, never a challenge; only vowels
 *     whose fR1 is sung or derived count (`fR1Source`), never a placeholder.
 *  7. A2: data first, label second, except the primo. The primo axis exists
 *     only for a declared tenor, baritone, bass-baritone, or bass
 *     (`primoApplies`); for any other type, "not sure", or none, the set has
 *     no primo axis and no line names the primo.
 *  8. The answers change the wording, never which keys are shown (in
 *     `key-lines.ts`); here they only weigh the stakes.
 *  9. Without typed passaggi the set has the range axis only; without a typed
 *     range there is no search.
 *
 * A3 and Dann 2026-11-01 22:39: no line enumerates pitches or counts notes. A
 * range challenge is a PASSAGE: a run of consecutive bars with a note out of
 * range on one side. The search ranks them by sung time and keeps them all;
 * the words name the one or two that matter most.
 *
 * PURE: a score, a voice, the declared type, and the intake in; the keys out.
 */
import {
	fractionToNumber,
	pitchToMidi,
	soundingFromNotation,
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
/** A line names at most this many passages, the ones with the most sung time out of range (Dann 2026-11-01 22:39). */
export const MAX_NAMED_PASSAGES = 2;

/**
 * The voices whose primo Ilya measures (Dann 2026-10-11 23:20, ROW 71's KEY
 * LINES (3): "tenor, baritone, and bass only, until the voice-family table
 * defines what each voice watches"). `bass-baritone` counted with the three is
 * a DESK DEFAULT (review A2); `countertenor` counts as treble. Dann's to overturn.
 */
export const PRIMO_VOICES: ReadonlySet<string> = new Set(['tenor', 'baritone', 'bass-baritone', 'bass']);

/** True when the declared Tier 1 type has a primo axis; false for any other type, "not sure", or none. */
export const primoApplies = (voiceType: string | undefined): boolean => !!voiceType && PRIMO_VOICES.has(voiceType);

/**
 * The weight of a challenge by the singer's answer to its question: points 1
 * to 2 weigh 1.0, point 3 weighs 0.75, points 4 to 5 weigh 0.5, and "not sure"
 * or no answer weighs 1.0 (DESK DEFAULT, JUDGEMENT; brief rule 5). N.173 is
 * unruled (`OPEN.md:414`); these weights are this row's own and are not
 * written back into it (review A8).
 */
export function challengeWeight(p: IntakePoint | undefined): number {
	if (p === undefined || p === 'not-sure') return 1;
	return p <= 2 ? 1 : p === 3 ? 0.75 : 0.5;
}

export type RangeAxis = 'inside' | 'above' | 'below' | 'both';

/** A key's challenge set (brief rule 4). An axis is absent when the voice has none, or typed no passaggi. */
export interface ChallengeSet {
	range: RangeAxis;
	/** Any sung time at or above the primo; present only where `primoApplies`. */
	primo?: boolean;
	/** Any sung time above the secondo. */
	secondo?: boolean;
	/** A sustained note above the secondo. */
	sustained?: boolean;
}

/** A run of consecutive bars with a note out of range on one side, in a given key. */
export interface Passage {
	/** The printed bar numbers the run starts and ends in; equal for a single bar. */
	from: string;
	to: string;
	/** Sung time out of range in the run, in whole notes. */
	time: number;
}

/** What one key does past the range on one side: how far the farthest note goes, and the passages, ranked by time. */
export interface Beyond {
	semitones: number;
	/** Most sung time first, then earlier. */
	passages: Passage[];
}

export interface KeyOption {
	/** Signed semitones from the key INSIGHTS analyses (A1); 0 is that key. */
	semitones: number;
	workable: boolean;
	set: ChallengeSet;
	above: Beyond | null;
	below: Beyond | null;
	/** Shares of sung time, 0 to 1; null without typed passaggi (and the primo's, without a primo axis). */
	primoShare: number | null;
	secondoShare: number | null;
	/** The sustained note above the secondo with the most sung time in this key: its bar. */
	sustained: { bar: string } | null;
	/** Share of sung time past the turn, sung and derived vowels only; null when none counts. */
	pastTurn: number | null;
	/** The challenge set's weight for this singer. */
	stakes: number;
}

export interface KeySuggestion {
	/**
	 * `suits`: the key read has an empty challenge set; `noneBetter`: it has challenges and no key improves on them;
	 * `noWorkable`: no key within reach is workable; `keys`: one to three to show.
	 */
	kind: 'suits' | 'noneBetter' | 'noWorkable' | 'keys';
	/** The key INSIGHTS analyses, measured. */
	written: KeyOption;
	shown: KeyOption[];
	/** Under "Show keys that reach higher": the groups past the cap, then the keys beyond the margin, nearest first. */
	reveal: KeyOption[];
	/** True when more groups qualified than `MAX_KEY_GROUPS`. */
	capBound: boolean;
}

export interface KeySearchInput {
	/** The score as INSIGHTS analyses it: drawn in the chosen key, octave-read, in performance order. */
	score: ParsedScore;
	profile: VoiceProfileSnapshot;
	/** The declared Tier 1 type (`voiceType?.voiceType`); decides the primo axis (A2). */
	voiceType?: string;
	/** The note facts of `score` as it stands, for the sustained notes; null without them. */
	facts: readonly NoteFacts[] | null;
	vowelForEvent?: VowelForEvent;
	intake?: IntakeAnswers;
	window?: number;
	/** How many groups to show before the reveal; `MAX_KEY_GROUPS` when absent. Only a test passes it (the cap now binds rarely, see the row 71 report). */
	maxGroups?: number;
}

const setKey = (s: ChallengeSet) => `${s.range}|${s.primo ?? '-'}|${s.secondo ?? '-'}|${s.sustained ?? '-'}`;
const sameSet = (a: ChallengeSet, b: ChallengeSet) => setKey(a) === setKey(b);

function barLabel(score: ParsedScore, index: number): string {
	return score.measures[index]?.number || String(index + 1);
}

/** The challenge set's stakes: each challenge weighed by the answer to its own question (brief rules 5 and 8). */
export function stakesOf(set: ChallengeSet, intake: IntakeAnswers | undefined): number {
	let s = 0;
	if (set.range === 'above' || set.range === 'both') s += challengeWeight(intake?.top);
	if (set.range === 'below' || set.range === 'both') s += challengeWeight(intake?.bottom);
	if (set.primo) s += challengeWeight(intake?.passaggi);
	if (set.secondo) s += challengeWeight(intake?.passaggi);
	if (set.sustained) s += challengeWeight(intake?.sustained);
	return s;
}

const moved = (a: number | null, b: number | null) => a !== null && b !== null && Math.abs(a - b) >= BETTER_KEY_MIN_DROP - 1e-9;

/**
 * How many challenges a key's set holds: one for the range above, one for the range below (`both` is two), one for the
 * primo, one for the secondo, one for a sustained note above the secondo. DESK DEFAULT, JUDGEMENT: the ruling of 11-05
 * counts "challenges" and names no unit, so each named axis is one (a key that reaches both above and below the range
 * has two). It reads the set only, never a share, a distance, or the singer's answers (those weigh `stakes`, not the count).
 */
export function challengeCount(set: ChallengeSet): number {
	return (set.range === 'both' ? 2 : set.range === 'inside' ? 0 : 1) + (set.primo ? 1 : 0) + (set.secondo ? 1 : 0) + (set.sustained ? 1 : 0);
}

/**
 * THE RULE OF ROW 71 (N.182), RULED BY DANN 2026-11-05 11:49 (`docs/memory/OPEN.md`, "A KEY IS SUGGESTED ONLY WHEN IT
 * REDUCES THE CHALLENGES"): a key is offered only when the number of challenges goes down. Dann: "Recommend keys that
 * reduce the challenges. Sometimes no alteration will rectify a song for a singer's voice and the singer can decide to
 * proceed with the knowledge that a technical hurdle is present for them to work on."
 *
 * It checks `challengeCount(k.set) < challengeCount(w.set)` and nothing else. A key that trades one challenge for
 * another (the same count), one that only lowers a share without clearing a challenge, and one that only adds
 * challenges are never offered. WHY: a trade is not a way out, and the singer is shown only what helps. WHEN IT SAYS
 * NO for every key: `suggestKeys` answers `noneBetter` (the written key has challenges and nothing within reach has
 * fewer) or `noWorkable`, and the page says so as information for her decision, never as a failure. It replaces the
 * looser test the lane first built (a lost challenge or a share lowered by `BETTER_KEY_MIN_DROP`, which offered
 * swaps); `matters` (the brief's own wording) is kept beside it, unused by the search, so the difference is pinned.
 */
export function improves(k: KeyOption, w: KeyOption): boolean {
	return challengeCount(k.set) < challengeCount(w.set);
}

/** True when `k` differs from `w` in a way the 10-point test or a challenge set notices (brief rule 4 as written). Not used by the search since the ruling of 2026-11-05 (`improves` counts challenges); kept so a test pins that the two differ. */
export function matters(k: KeyOption, w: KeyOption): boolean {
	return !sameSet(k.set, w.set) || moved(k.primoShare, w.primoShare) || moved(k.secondoShare, w.secondoShare);
}

/** The passages of one side: runs of consecutive bars with an out-of-range note, ranked by sung time. */
function passagesOf(score: ParsedScore, hits: Array<{ bar: number; time: number }>): Passage[] {
	const sorted = [...hits].sort((a, b) => a.bar - b.bar);
	const runs: Array<{ from: number; to: number; time: number }> = [];
	for (const h of sorted) {
		const last = runs[runs.length - 1];
		if (last && h.bar - last.to <= 1) {
			last.to = Math.max(last.to, h.bar);
			last.time += h.time;
		} else runs.push({ from: h.bar, to: h.bar, time: h.time });
	}
	return runs
		.sort((a, b) => b.time - a.time || a.from - b.from)
		.map((r) => ({ from: barLabel(score, r.from), to: barLabel(score, r.to), time: r.time }));
}

/** One key, measured, `semitones` from the score given. Null without a typed range. */
export function measureKey(input: KeySearchInput, semitones: number): KeyOption | null {
	const { score, profile, facts, vowelForEvent, intake, voiceType } = input;
	if (!profile.range) return null;
	const top = pitchToMidi(profile.range.highest);
	const bottom = pitchToMidi(profile.range.lowest);

	// Range: the notes moved by `semitones`, each event once; passages by bar.
	const seen = new Set<string>();
	const hitsAbove: Array<{ bar: number; time: number }> = [];
	const hitsBelow: Array<{ bar: number; time: number }> = [];
	let farAbove = 0;
	let farBelow = 0;
	for (const ev of score.vocalLine) {
		if (!ev.pitch || seen.has(ev.id)) continue;
		seen.add(ev.id);
		const m = pitchToMidi(ev.pitch) + semitones;
		const time = fractionToNumber(soundingFromNotation(ev.duration));
		if (m > top) {
			farAbove = Math.max(farAbove, m - top);
			hitsAbove.push({ bar: ev.measureIndex, time });
		} else if (m < bottom) {
			farBelow = Math.max(farBelow, bottom - m);
			hitsBelow.push({ bar: ev.measureIndex, time });
		}
	}
	const above: Beyond | null = farAbove > 0 ? { semitones: farAbove, passages: passagesOf(score, hitsAbove) } : null;
	const below: Beyond | null = farBelow > 0 ? { semitones: farBelow, passages: passagesOf(score, hitsBelow) } : null;
	const range: RangeAxis = above && below ? 'both' : above ? 'above' : below ? 'below' : 'inside';
	const workable = farAbove <= RANGE_CHALLENGE_MARGIN && farBelow <= RANGE_CHALLENGE_MARGIN;

	// Passaggio time, as the page's own zones count it, in this key.
	const shifted = semitones === 0 ? score : transposeScore(score, semitones);
	const model = buildInsights({ analysisScore: shifted, profile, watchList: null });
	const hasPrimo = !!profile.passaggio && primoApplies(voiceType);
	const primoShare = hasPrimo ? shareAtOrAbovePrimo(model) : null;
	const secondoShare = profile.passaggio ? shareAboveSecondo(model) : null;

	// A sustained note above the secondo: the facts' own sustain test, moved by `semitones`.
	let sustained: { bar: string } | null = null;
	if (profile.passaggio && facts) {
		let best: NoteFacts | null = null;
		for (const f of facts) {
			if (!f.chainHead || !f.note.held || f.toSecondo === undefined || f.toSecondo + semitones <= 0) continue;
			if (!best || (f.chainSeconds ?? 0) > (best.chainSeconds ?? 0)) best = f;
		}
		if (best) sustained = { bar: barLabel(score, best.note.measureIndex) };
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
			? {
					...(hasPrimo ? { primo: (primoShare ?? 0) > 0 } : {}),
					secondo: (secondoShare ?? 0) > 0,
					sustained: sustained !== null,
				}
			: {}),
	};
	return { semitones, workable, set, above, below, primoShare, secondoShare, sustained, pastTurn, stakes: stakesOf(set, intake) };
}

/** True when the key's challenge set is empty: range inside and no passaggio challenge on any axis it has (A2). */
export const suits = (k: KeyOption): boolean => k.set.range === 'inside' && !k.set.primo && !k.set.secondo && !k.set.sustained;

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

	// Group the keys that improve on the key read by challenge set; each group shows its smallest move.
	const groups = new Map<string, KeyOption[]>();
	for (const k of workable) {
		if (!improves(k, written)) continue;
		const key = setKey(k.set);
		groups.set(key, [...(groups.get(key) ?? []), k]);
	}
	const picks: KeyOption[] = [];
	for (const members of groups.values()) {
		picks.push([...members].sort((a, b) => Math.abs(a.semitones) - Math.abs(b.semitones) || a.semitones - b.semitones)[0]);
	}
	picks.sort(
		(a, b) =>
			a.stakes - b.stakes ||
			(a.primoShare ?? 0) - (b.primoShare ?? 0) ||
			Math.abs(a.semitones) - Math.abs(b.semitones) ||
			a.semitones - b.semitones,
	);
	const fits = suits(written);
	const cap = input.maxGroups ?? MAX_KEY_GROUPS;
	const shown = fits ? [] : picks.slice(0, cap);
	const reveal = [...picks.slice(fits ? picks.length : cap), ...beyond];
	const capBound = !fits && picks.length > cap;

	let kind: KeySuggestion['kind'];
	if (!written.workable && workable.length === 0) kind = 'noWorkable';
	else if (fits) kind = 'suits';
	else if (shown.length > 0) kind = 'keys';
	else kind = 'noneBetter';
	return { kind, written, shown, reveal, capBound };
}
