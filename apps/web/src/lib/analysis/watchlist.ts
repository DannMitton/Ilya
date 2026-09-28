/**
 * The head-of-score watch list ("Places to watch"), design C.
 *
 * A pure translation layer: it reads the acoustic marks the analysis already computes
 * per note (`AnalyzedScore.events`, all from the singer's own fR1) and the
 * parsed score, and returns a severity-ranked, adaptively filtered list of the
 * places in the song most likely to challenge THIS singer as profiled. It
 * computes no new acoustics and makes no claim the per-note marks do not
 * already carry: "Insights forecasts, it does not declare" (overlay-engine.ts).
 *
 * Rulings this implements (project knowledge):
 *   - §7.1–§7.5 (`fit-watchlist-rulings_2026-07-17.md`): placement as a head
 *     band, the severity order, print-nothing on zero challenge, and the
 *     bar-first copy.
 *   - §A.149 (`fit-acoustic-framework_2026-07-20.md` §5): the ADAPTIVE
 *     inclusion rule that replaces show-all. A note earns a line when ANY of:
 *     (1) it carries a markup-invisible fact (out-of-range, at a declared
 *     passaggio edge, or a long sustain on its turning pitch) — always;
 *     (2) it carries a markup-visible mark (crossing or timbre turn) that is
 *     BOTH rare in this score AND advice-bearing; (3) it is a hazard —
 *     DEFERRED (§B), not yet wired (definition and copy both pending Dann);
 *     (4) it stacks (two or more flagged kinds). Otherwise it is left to the
 *     staff markup; silence stays the feature (§7.3).
 *   - §A.150: the closed copy — the whoop crossing line (the retired "lock or
 *     whistle" line was acoustically wrong and is gone), and the sustain line
 *     on the "pitch of turning".
 *   - §A.151: the range line offers a transposition computed by
 *     `suggestTranspositions`, named as a key when the score declares a mode
 *     and as an interval when it does not (Dann, 2026-07-20).
 *   - §A.126: the passaggio tier is proximity to EITHER declared edge, not
 *     whole-band membership; the interior stays quiet. Window ruled ±1
 *     semitone (Dann, 2026-07-18).
 *   - §A.117: a sustain is `duration.fraction` × the bpm active at the note,
 *     ≥ 2.5 s, OR a fermata; silent when neither.
 *   - §A.135 / §A.138: density weighting is IN, sourced to Bozeman pp. 42–43;
 *     Dann ruled it enters the sort WITHIN a tier only (2026-07-18).
 *
 * Tags: SOURCED (from the running code, a type, or a ruling), INFERENCE
 * (derived from them), JUDGEMENT (my build-time default, Dann rules). Copy is
 * Dann's; the copy below is CLOSED (§A.150) except the hazard line, deferred
 * with its definition (§B).
 *
 * This module is PURE and framework-free, so it is unit-testable the way the
 * parsers are. `MarkupPane` consumes it for the printed band.
 */

import {
	centsBetween,
	pitchToHz,
	pitchToMidi,
	suggestTranspositions,
	type AnalyzedScore,
	type NoteBase,
	type ParsedScore,
	type TempoMarking,
	type TranspositionSuggestion,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
	type VowelResolver
} from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { collectScoreWords } from '$lib/score/vowel-resolver';
import type { AdviceAction } from './advice-resolver';

// ── Tunable constants (each tagged; all single-point-of-change) ──────

/**
 * Passaggio edge-proximity window, in cents. RULED ±1 semitone (Dann,
 * 2026-07-18), implementing §A.126's "proximity to either declared edge,
 * interior quiet." Leans into the "interior quiet" half of §A.126 over its
 * "male edges nearly coincide" half; a single constant if it reads too tight.
 */
const PASSAGGIO_EDGE_WINDOW_CENTS = 100;

/**
 * Float guard for the window above, in cents. A note exactly one semitone from
 * an edge measures 99.99999999999972 cents on one machine and a hair over 100
 * on another, so without it the same score gave different findings on
 * different devices (found 2026-09-27, when a test passed in a Linux sandbox
 * and failed on Dann's Mac). The same guard `overlay-engine.ts` keeps for the
 * range, `RANGE_EPSILON_CENTS`.
 */
const PASSAGGIO_FLOAT_GUARD_CENTS = 1;

/** Sustain threshold in seconds. SOURCED §A.117 (≥ 2.5 s OR a fermata). */
const SUSTAIN_SECONDS_THRESHOLD = 2.5;

/**
 * Rarity ceiling for a markup-visible kind (crossing, timbre turn): a kind
 * carried by at most this many notes across the whole score counts as "rare"
 * and earns a watch line (§A.149 clause 2); above it, the staff mark carries
 * it and the list stays quiet (a crossing is routine for a soprano, rare for a
 * low male voice — the dial reads that from the score, no Fach). DEFERRED
 * JUDGEMENT (§B): a PROVISIONAL default, to be CALIBRATED against real scores,
 * NOT pinned here. Single-point-of-change.
 */
const RARE_KIND_MAX_NOTES = 3;

// No cap (Dann, 2026-07-18): every note the adaptive rule INCLUDES renders,
// on the list's own page after the score. The filtering happens at inclusion
// (§A.149), not by a downstream cap.

// ── The model ───────────────────────────────────────────────────────

/** A watch kind, in severity order; its index+1 is not the tier (see TIER_OF). */
export type WatchKind =
	| 'range'
	| 'crossing'
	| 'cover'
	| 'tracking'
	| 'turnover'
	| 'passaggio'
	| 'timbre'
	| 'sustain';

/** The markup-visible marks the adaptive dial gates on rarity (§A.149 clause 2). */
const MARKUP_VISIBLE: ReadonlySet<WatchKind> = new Set(['crossing', 'timbre']);

/** The markup-invisible facts that always earn a line (§A.149 clause 1). */
const ALWAYS_KINDS: ReadonlySet<WatchKind> = new Set(['range', 'passaggio', 'sustain']);

/** Severity tier per kind, hardest first. SOURCED §7.2. */
const TIER_OF: Record<WatchKind, 1 | 2 | 3 | 4 | 5> = {
	range: 1,
	crossing: 2,
	cover: 2, // the [o]→[ɑ] cover hazard, co-equal with a crossing (§A.185). PROVISIONAL rank, Dann's to re-order.
	tracking: 2, // the exposed close-vowel active-open (formant-tracking) hazard, co-equal with the cover (H2, Dann 2026-07-22). PROVISIONAL rank.
	turnover: 2, // the male turnover hazard (turned side of the ladder), co-equal with its sibling tracking (§A.190, Dann 2026-07-22). PROVISIONAL rank.
	passaggio: 3,
	timbre: 4,
	sustain: 5
};

/** One note that earned a place, at its most severe tier. */
export interface WatchEntry {
	/** The anchoring `VocalLineEvent.id`. */
	eventId: string;
	/** Most severe tier among this note's kinds (1 = hardest). */
	tier: 1 | 2 | 3 | 4 | 5;
	/** Every kind this note carries, severity order (the stacking signal). */
	kinds: WatchKind[];
	/** Printed bar number, from `measures[measureIndex].number` (never `+1`). */
	bar: string;
	/** Operative sung vowel (IPA, verbatim from the resolver). */
	vowel: string;
	/** The sung word, when known (verse-1 reconstruction); names the copy. */
	word?: string;
	/** Direction of a timbre turn, when this note anchors one. */
	timbreDirection?: 'open-to-close' | 'close-to-open';
	/** For a range entry: above the ceiling or below the floor the singer gave. */
	rangeDirection?: 'above' | 'below';
	/**
	 * The song-level transposition, baked on at build time so `watchEntryLine`
	 * stays entry-only (Dann's ruling A, 2026-07-20), as numbers (N.82): the
	 * signed semitones of each suggestion, and their target keys when the
	 * printed score declared a mode. The line names keys when `keys` is present
	 * ("to E flat major or D flat major"), else the intervals ("down a major
	 * third or a perfect fourth"). Absent when the module found no improving
	 * key: then the range line names the fact alone (§A.150).
	 */
	transposition?: WatchTransposition;
	/**
	 * The resolved advice: the actionable second half of the line (§A.168),
	 * baked on from `AnalyzedEvent.vowelModification` at build time. Its action
	 * names the words (`watch.advice.*`), and `target` is the vowel it leans
	 * toward, when the case names one. Absent when no sourced case matched, and
	 * the line renders its description alone (ruling B, Dann 2026-07-21). The
	 * citation is NOT carried here: it is never printed on the paper apparatus
	 * (attribution lives in Learn/Guide).
	 */
	advice?: { action: AdviceAction; target?: string };
	/**
	 * Harmonic density d = fR1/fo (number of harmonics at/below the first
	 * resonance). Lower = higher in the voice = more acute; sorts first within
	 * a tier. INFERENCE on Bozeman pp. 42–43 (§A.135).
	 */
	density: number;
}

/** One song-level transposition, as numbers (see `WatchEntry.transposition`). */
export interface WatchTransposition {
	semitones: number[];
	keys?: { fifths: number; mode: 'major' | 'minor' }[];
}

export interface WatchList {
	/** Final, sorted entries to render, all of them. Empty = render nothing (§7.3). */
	entries: WatchEntry[];
}

/**
 * The inputs the range line's transposition suggestion needs (Dann's ruling A,
 * 2026-07-20: `buildWatchList` computes the one song-level suggestion itself).
 * Optional to `buildWatchList`; when omitted, range lines name the fact alone.
 */
export interface WatchTranspositionInput {
	/**
	 * The performance-order score the analysis was built from — what the search
	 * transposes, so its forecast crossings match the marks on the page.
	 */
	analysisScore: ParsedScore;
	/** The singer's profile snapshot (fR1 per vowel + declared range). */
	profile: VoiceProfileSnapshot;
	/** The id-keyed vowel resolver. */
	resolver: VowelResolver;
}

// ── Rhythm → seconds (for the sustain test) ─────────────────────────

/** Whole-note value of each note base. SOURCED: MusicXML `<type>` semantics. */
const BASE_WHOLE_NOTES: Record<NoteBase, number> = {
	breve: 2,
	whole: 1,
	half: 1 / 2,
	quarter: 1 / 4,
	eighth: 1 / 8,
	'16th': 1 / 16,
	'32nd': 1 / 32,
	'64th': 1 / 64,
	'128th': 1 / 128
};

/** Dot multiplier: 1 dot = 1.5, 2 = 1.75, n = 2 − 2^−n. */
function dotMultiplier(dots: number): number {
	return 2 - Math.pow(2, -dots);
}

/** aPos ≤ bPos over (measureIndex, fraction), fraction by cross-multiply (types.ts:26). */
function positionLE(
	aMeasure: number,
	aFrac: { numerator: number; denominator: number },
	bMeasure: number,
	bFrac: { numerator: number; denominator: number }
): boolean {
	if (aMeasure !== bMeasure) return aMeasure < bMeasure;
	return aFrac.numerator * bFrac.denominator <= bFrac.numerator * aFrac.denominator;
}

/**
 * The tempo marking active AT this note: the latest marking whose position is
 * ≤ the note's own (measureIndex, rhythmicPosition). No helper for this exists
 * in the repo, so the generator owns it (audit §5). Null when no marking
 * precedes the note (then a duration-sustain cannot be asserted; only a
 * fermata flags, which is honest — no tempo was given).
 */
function activeTempoAt(tempos: TempoMarking[], ev: VocalLineEvent): TempoMarking | null {
	let best: TempoMarking | null = null;
	for (const t of tempos) {
		if (!positionLE(t.measureIndex, t.rhythmicPosition.fraction, ev.measureIndex, ev.rhythmicPosition.fraction))
			continue;
		if (
			best === null ||
			positionLE(
				best.measureIndex,
				best.rhythmicPosition.fraction,
				t.measureIndex,
				t.rhythmicPosition.fraction
			)
		)
			best = t;
	}
	return best;
}

/** The note's sounding length in seconds, or null when no tempo is active. */
function noteSeconds(ev: VocalLineEvent, tempos: TempoMarking[]): number | null {
	const t = activeTempoAt(tempos, ev);
	if (t === null) return null;
	const beatWholeNotes = BASE_WHOLE_NOTES[t.beatUnit] * dotMultiplier(t.beatUnitDots);
	const durWholeNotes = ev.duration.fraction.numerator / ev.duration.fraction.denominator;
	const beats = durWholeNotes / beatWholeNotes;
	return beats * (60 / t.bpm);
}

/** A long sustain: a fermata, or ≥ 2.5 s by the active tempo (§A.117). */
function isLongSustain(ev: VocalLineEvent, tempos: TempoMarking[]): boolean {
	if (ev.fermata !== undefined) return true;
	const s = noteSeconds(ev, tempos);
	return s !== null && s >= SUSTAIN_SECONDS_THRESHOLD;
}

// ── The adaptive dial (§A.149) ──────────────────────────────────────

/** Per-kind note counts across the detected notes; feeds the rarity predicate. */
function countKinds(detected: WatchEntry[]): Record<WatchKind, number> {
	const counts: Record<WatchKind, number> = {
		range: 0,
		crossing: 0,
		cover: 0,
		tracking: 0,
		turnover: 0,
		passaggio: 0,
		timbre: 0,
		sustain: 0
	};
	for (const e of detected) for (const k of e.kinds) counts[k]++;
	return counts;
}

/** Rare in THIS score: at or below the (deferred, provisional) rarity ceiling. */
function isRare(kind: WatchKind, counts: Record<WatchKind, number>): boolean {
	return counts[kind] <= RARE_KIND_MAX_NOTES;
}

/**
 * Whether a markup-visible mark is worth a watch line under §A.149 clause 2.
 * RULED ADDITIVE (Dann's ruling B, 2026-07-21): a crossing and a timbre turn
 * are STRUCTURALLY advice-bearing, i.e. worth a line when rare, whether or not
 * the advice resolver (`advice-resolver.ts`) found a sourced fix for them. The
 * resolved `[i]→[ɪ]` advice is APPENDED to the crossing line at render
 * (`watchEntryLine`), never used to GATE inclusion here: a rare crossing the analysis can
 * describe (the whoop) but not yet advise still earns its line, so the dial
 * never silently hides an honest forecast. Kept as a structural predicate (not
 * inlined) so the deferred hazard clause (§A.149 clause 3) can later branch on
 * the resolved register without reworking the inclusion rule.
 */
function isAdviceBearing(_kind: WatchKind): boolean {
	return true;
}

/**
 * The §A.149 adaptive inclusion rule. A note (by its detected kinds) earns a
 * line when ANY of the clauses hold. Clause 3 (a hazard, regardless of
 * frequency) is now WIRED (§A.185, RULED Option A): the `[o]→[ɑ]` cover, the
 * exposed-sustain hazard, always earns a line. Clauses 1, 2, and 4 unchanged.
 */
function isIncluded(kinds: WatchKind[], counts: Record<WatchKind, number>): boolean {
	// Clause 3 — a hazard (the [o]→[ɑ] cover, the exposed tracking or turnover
	// hazard): always, regardless of frequency.
	if (kinds.includes('cover') || kinds.includes('tracking') || kinds.includes('turnover')) return true;
	// Clause 1 — a markup-invisible fact: always.
	if (kinds.some((k) => ALWAYS_KINDS.has(k))) return true;
	// Clause 4 — stacking: two or more flagged kinds on one note.
	if (kinds.length >= 2) return true;
	// Clause 2 — a rare, advice-bearing markup-visible mark.
	return kinds.some((k) => MARKUP_VISIBLE.has(k) && isRare(k, counts) && isAdviceBearing(k));
}

// ── The generator ───────────────────────────────────────────────────

/**
 * Build the watch list for one verse (default 1) from the parsed score and its
 * analysis overlay. Pure and deterministic. When `transposition` is supplied
 * and a range violation exists, the one song-level transposition suggestion is
 * computed and its phrase baked onto every range entry (§A.151).
 */
export function buildWatchList(
	parsed: ParsedScore,
	analyzed: AnalyzedScore,
	verseNumber = 1,
	transposition?: WatchTranspositionInput
): WatchList {
	// Join index: every analyzed key is a `VocalLineEvent.id` (audit §2), so a
	// single map replaces an O(n) find per flagged note.
	const eventById = new Map<string, VocalLineEvent>();
	const orderById = new Map<string, number>();
	parsed.vocalLine.forEach((ev, i) => {
		orderById.set(ev.id, i);
		if (ev.type === 'note' && ev.pitch) eventById.set(ev.id, ev);
	});

	// Word membership for verse `verseNumber`: the sung word per event, and the
	// first timbre turn inside each word (tier 4).
	const words = collectScoreWords(parsed, verseNumber);
	const wordByEvent = new Map<string, string>();
	const timbreTurnAt = new Map<string, { word: string; direction: 'open-to-close' | 'close-to-open' }>();
	for (const w of words) {
		for (const id of w.slots.flat()) wordByEvent.set(id, w.raw);
		// Representative timbre per syllable = its onset (first analysed) note.
		const onsets = w.slots
			.map((slot) => {
				for (const id of slot) {
					const a = analyzed.events[id];
					if (a) return { id, timbre: a.timbre };
				}
				return null;
			})
			.filter((o): o is { id: string; timbre: 'open' | 'close' } => o !== null);
		for (let k = 0; k < onsets.length - 1; k++) {
			if (onsets[k].timbre !== onsets[k + 1].timbre) {
				timbreTurnAt.set(onsets[k + 1].id, {
					word: w.raw,
					direction: onsets[k].timbre === 'open' ? 'open-to-close' : 'close-to-open'
				});
				break; // one turn per word: the first flip
			}
		}
	}

	const passaggio = analyzed.global.passaggio;

	// Pass 1 — detect every note's candidate kinds (the pre-dial population).
	const detected: WatchEntry[] = [];
	// An exposed crossing (a crossing that also trips the exposure gate) is a
	// hazard grade of crossing: it must always surface, even when routine
	// crossings recede on the rarity dial (H2 refinement, Dann 2026-07-22). The
	// crossing predicate and its [i]→[ɪ] advice are unchanged; only inclusion is.
	const exposedCrossings = new Set<string>();

	for (const [id, a] of Object.entries(analyzed.events)) {
		const ev = eventById.get(id);
		if (!ev || !ev.pitch) continue; // needs the sung pitch, joined from the parse
		const foHz = pitchToHz(ev.pitch);
		const kinds: WatchKind[] = [];

		// Tier 1 — out of the range the singer gave. SOURCED §7.2.
		if (a.rangeStatus === 'out-of-range') kinds.push('range');

		// Tier 2 — the fundamental meets the first resonance. SOURCED §7.2.
		if (a.crossing) kinds.push('crossing');
		if (a.crossing === true && a.sustainedCeilingExposure === true) exposedCrossings.add(id);

		// Tier 3 — within ±1 semitone of EITHER declared edge; interior quiet.
		// SOURCED §A.126. Only when the singer declared both edges.
		if (passaggio) {
			const nearPrimo =
				Math.abs(centsBetween(pitchToHz(passaggio.primo), foHz)) <= PASSAGGIO_EDGE_WINDOW_CENTS + PASSAGGIO_FLOAT_GUARD_CENTS;
			const nearSecondo =
				Math.abs(centsBetween(pitchToHz(passaggio.secondo), foHz)) <= PASSAGGIO_EDGE_WINDOW_CENTS + PASSAGGIO_FLOAT_GUARD_CENTS;
			if (nearPrimo || nearSecondo) kinds.push('passaggio');
		}

		// Tier 4 — a timbre turn inside a sung word (this note is the flip onset).
		const turn = timbreTurnAt.get(id);
		if (turn) kinds.push('timbre');

		// Tier 5 — a long sustain parked on its own turning pitch. JUDGEMENT:
		// "on its turning pitch" = the same semitone (enharmonic-safe via MIDI).
		if (isLongSustain(ev, parsed.tempoMarkings) && pitchToMidi(ev.pitch) === pitchToMidi(a.turningPitch))
			kinds.push('sustain');

		// Clause 3 (§A.149; §A.185; §A.190) — the exposed-sustain hazards: the
		// engine's content-free exposure forecast (close timbre + at-or-above
		// ceiling + long sustain; §A.183), carrying a resolved hazard advice, and
		// not itself a crossing (the crossing kind already covers that). Advice
		// appends at render. Three kinds, mirroring the three advice cases the
		// resolver fires here: the [o]→[ɑ] Russian cover; on the whoop side of the
		// ladder (fo above fR1) the active-open tracking hazard; on the turned side
		// (fo below fR1) the male turnover hazard (§A.190). The split matches the
		// resolver's predicates exactly, so the kind and the appended advice agree.
		if (a.sustainedCeilingExposure === true && !a.crossing && a.vowelModification?.register === 'hazard')
			kinds.push(a.vowel === 'o' ? 'cover' : a.aboveFirstResonance ? 'tracking' : 'turnover');

		if (kinds.length === 0) continue; // silence is the feature (§7.3 / §1)

		// A range event is above the ceiling or below the floor; the copy differs.
		let rangeDirection: 'above' | 'below' | undefined;
		if (kinds.includes('range')) {
			const singerRange = analyzed.calibrationSnapshot.range;
			rangeDirection =
				singerRange && pitchToMidi(ev.pitch) < pitchToMidi(singerRange.lowest) ? 'below' : 'above';
		}

		kinds.sort((x, y) => TIER_OF[x] - TIER_OF[y]);
		detected.push({
			eventId: id,
			tier: TIER_OF[kinds[0]],
			kinds,
			bar: barOf(parsed, ev),
			vowel: a.vowel,
			...(wordByEvent.has(id) ? { word: wordByEvent.get(id) } : {}),
			...(turn ? { timbreDirection: turn.direction } : {}),
			...(rangeDirection ? { rangeDirection } : {}),
			// The advice resolver's resolved clause, baked on for render (§A.168).
			// Populated only on a matched case (v1: an [i]→[ɪ] crossing); the
			// citation is deliberately not carried (never printed, Dann 2026-07-21).
			...(a.vowelModification
				? {
						advice: {
							action: a.vowelModification.action as AdviceAction,
							...(a.vowelModification.target !== undefined ? { target: a.vowelModification.target } : {})
						}
					}
				: {}),
			// d = fR1/fo, and fR1 = 2·(turning-pitch Hz), so d = 2·turningHz/fo.
			density: (2 * pitchToHz(a.turningPitch)) / foHz
		});
	}

	// Pass 2 — the adaptive dial (§A.149): count kinds across the score, then
	// keep only the notes the inclusion rule earns; the rest stay with the
	// staff markup (silence is the feature).
	const kindNoteCounts = countKinds(detected);
	// An exposed crossing always earns its line (a hazard); routine crossings
	// stay rarity-gated by isIncluded (H2 refinement, Dann 2026-07-22).
	const included = detected.filter((e) => exposedCrossings.has(e.eventId) || isIncluded(e.kinds, kindNoteCounts));

	// Sort: tier asc → stacking (more kinds first) → density asc (more acute
	// first) → score order. SOURCED §7.2 + the density ruling (within-tier).
	included.sort((x, y) => {
		if (x.tier !== y.tier) return x.tier - y.tier;
		if (x.kinds.length !== y.kinds.length) return y.kinds.length - x.kinds.length;
		if (x.density !== y.density) return x.density - y.density;
		return (orderById.get(x.eventId) ?? 0) - (orderById.get(y.eventId) ?? 0);
	});

	// Transposition (§A.151): one song-level suggestion, shared by every range
	// line and baked on here. Computed only when a range violation exists and
	// the caller supplied the inputs; empty suggestion → the fact alone.
	if (transposition && included.some((e) => e.kinds.includes('range'))) {
		const found = watchTransposition(
			suggestTranspositions(transposition.analysisScore, transposition.profile, transposition.resolver)
		);
		if (found) {
			for (const e of included) if (e.kinds.includes('range')) e.transposition = found;
		}
	}

	return { entries: included };
}

/** Bar number from the measure's own `.number`, never `measureIndex + 1` (audit §3, §A). */
function barOf(parsed: ParsedScore, ev: VocalLineEvent): string {
	const m = parsed.measures[ev.measureIndex];
	// Last-ditch only if the measure is genuinely missing; real parsers always
	// carry `.number` (which itself diverges from mi+1 on m<number> ids).
	return m ? m.number : String(ev.measureIndex + 1);
}

// ── Transposition (§A.151; Dann's copy ruling, 2026-07-20) ──────

/**
 * The one song-level suggestion as numbers, or null to say nothing (the range
 * line then names the fact alone). Keys when the printed score declared a mode
 * (every candidate carries a `targetKeySignature`); otherwise the intervals
 * alone, since three flats is both E flat major and C minor and naming a key
 * there would be a guess. The interval names cover one to six semitones, the
 * search window `watchlist.ts` asks for; a wider move says nothing rather than
 * naming an interval nobody ruled.
 */
function watchTransposition(s: TranspositionSuggestion): WatchTransposition | null {
	if (s.suggestions.length === 0) return null;
	const semitones = s.suggestions.map((c) => c.semitones);
	const keys = s.suggestions.map((c) => c.targetKeySignature);
	if (keys.every((k) => k !== undefined)) return { semitones, keys: keys as NonNullable<(typeof keys)[number]>[] };
	if (semitones.some((n) => Math.abs(n) < 1 || Math.abs(n) > 6)) return null;
	return { semitones };
}

// ── Copy, in both languages (N.82, ruled 2026-09-28 15:04 to 15:10) ──
// Every word is in `i18n.ts` under `watch.*`; this section only chooses keys
// and fills them. The English is CLOSED (§A.150), with the advice redrafted
// as opener + action and IPA in square brackets (Dann, 2026-09-28).

const fill = (s: string, vars: Record<string, string>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, v), s);

/** « de » before an infinitive, elided before a vowel or a mute h (as `comment-text.ts`). */
function de(action: string): string {
	return /^[aeiouhâàéèêîôû]/i.test(action) ? 'd’' : 'de ';
}

/** The openers the advice rotates through: Insights' `comment.opener.1` to `.5`. */
const OPENERS = [1, 2, 3, 4, 5] as const;
export type WatchOpener = (typeof OPENERS)[number];

/** Letters on the circle of fifths from F; a tonic is `fifths + 1` steps along it (+3 for minor). */
const FIFTHS_LETTERS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'] as const;

/** "E flat major", « mi bémol majeur ». */
function keyName(key: { fifths: number; mode: 'major' | 'minor' }, language: Language): string {
	const step = key.fifths + 1 + (key.mode === 'minor' ? 3 : 0);
	const letter = t(`watch.key.letter.${FIFTHS_LETTERS[((step % 7) + 7) % 7]}`, language);
	const shift = Math.floor(step / 7);
	const tonic =
		shift === 0
			? letter
			: fill(t('watch.key.tonic', language), {
					letter,
					accidental: t(shift < 0 ? 'notePicker.acc.flat' : 'notePicker.acc.sharp', language)
				});
	return fill(t('watch.key.name', language), { tonic, mode: t(`watch.key.mode.${key.mode}`, language) });
}

/** "to E flat major or D flat major", or "down a major third or a perfect fourth". */
function transpositionPhrase(tr: WatchTransposition, language: Language): string {
	if (tr.keys) {
		const [a, b] = tr.keys.map((k) => keyName(k, language));
		return fill(t(b === undefined ? 'watch.keyPhrase.one' : 'watch.keyPhrase.two', language), { a, b: b ?? '' });
	}
	const dir = (n: number) => t(n < 0 ? 'watch.direction.down' : 'watch.direction.up', language);
	const [a, b] = tr.semitones.map((n) => t(`watch.interval.${Math.abs(n)}`, language));
	const [sa, sb] = tr.semitones;
	if (b === undefined) return fill(t('watch.intervalPhrase.one', language), { direction: dir(sa), a });
	// One shared direction is said once; mixed directions each name their own.
	if (Math.sign(sa) === Math.sign(sb)) return fill(t('watch.intervalPhrase.shared', language), { direction: dir(sa), a, b });
	return fill(t('watch.intervalPhrase.mixed', language), { dirA: dir(sa), a, dirB: dir(sb), b });
}

/** The advice sentence: an opener filled with the action, then a period. */
function adviceSentence(entry: WatchEntry, opener: WatchOpener, language: Language): string {
	if (!entry.advice) return '';
	const action = fill(t(`watch.advice.${entry.advice.action}`, language), {
		vowel: entry.vowel,
		target: entry.advice.target ?? ''
	});
	return `${fill(t(`comment.opener.${opener}`, language), { action, de: de(action) })}.`;
}

/**
 * The word as the score prints it, less the punctuation the engraver set
 * against it: `collectScoreWords` keeps the raw cell, comma and all, so
 * « разлуки, » reads « разлуки ». The same strip as Insights' `wordOf`
 * (`InsightsPane.svelte`), so the two documents quote a word alike.
 */
function bareWord(word: string | undefined): string {
	return (word ?? '').replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, '');
}

/**
 * The rendered line for an entry, leading with the bar (§7.5). Uses the most
 * severe kind's template; the stacking count still lifts the entry in the sort.
 * A note that carries several kinds is named once by its hardest. `opener`
 * leads the advice, when the entry carries one; `watchBandLines` rotates it.
 */
export function watchEntryLine(entry: WatchEntry, language: Language, opener: WatchOpener = 1): string {
	const vars = { bar: entry.bar, vowel: `[${entry.vowel}]`, word: bareWord(entry.word) };
	const line = (key: string, extra: Record<string, string> = {}) =>
		fill(t(`watch.line.${key}`, language), { ...vars, ...extra });
	const withAdvice = (text: string) => {
		const advice = adviceSentence(entry, opener, language);
		return advice ? `${text} ${advice}` : text;
	};
	switch (entry.kinds[0]) {
		case 'range': {
			// CLOSED §A.150: name the fact, then offer a transposition when the
			// module found one, else the fact alone.
			const side = entry.rangeDirection === 'below' ? 'rangeBelow' : 'rangeAbove';
			return entry.transposition
				? line(`${side}Transpose`, { phrase: transpositionPhrase(entry.transposition, language) })
				: line(side);
		}
		case 'crossing': // CLOSED §A.150 (the whoop); advice APPENDS when present (§A.168, ruling B)
			return withAdvice(line('crossing'));
		case 'cover': // CLOSED (Dann, 2026-07-22): the [o] cover and the tracking hazard share a line
		case 'tracking':
			return withAdvice(line('tighten'));
		case 'turnover': // CLOSED (Dann, 2026-07-22): the turned-side risk is spreading or pressing (§A.190)
			return withAdvice(line('turnover'));
		case 'passaggio': // APPROVED §7.5
			return line(entry.word ? 'passaggioWord' : 'passaggio');
		case 'timbre': { // APPROVED §7.5
			const dir = entry.timbreDirection === 'close-to-open' ? 'timbreCloseToOpen' : 'timbreOpenToClose';
			return line(entry.word ? `${dir}Word` : dir);
		}
		case 'sustain': // CLOSED §A.150 ("pitch of turning"; "sustain", never "held")
			return line('sustain');
	}
}

/**
 * Every line on the band, in order. The advice openers rotate so no two advice
 * sentences on the page share one, as Insights' page rule does
 * (`insights/comment-text.ts`, `rotate`); the band sits on one page, so the
 * rotation runs down the whole list. DESK DEFAULT: it starts at opener 1, and
 * a sixth advice line repeats the first, since the pool holds five.
 *
 * NO DUPLICATE LINE (Dann's look, 2026-09-28): two entries that would print
 * the same sentence for the same bar are one, the first (hardest) kept. The
 * line leads with its bar, so "same sentence, same bar" is "same text". It is
 * compared at opener 1, before the rotation, since otherwise two identical
 * findings would differ only by their opener and both print.
 */
export function watchBandLines(entries: readonly WatchEntry[], language: Language): string[] {
	const seen = new Set<string>();
	const unique = entries.filter((e) => {
		const key = watchEntryLine(e, language, 1);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	let k = 0;
	return unique.map((e) => watchEntryLine(e, language, e.advice ? OPENERS[k++ % OPENERS.length] : 1));
}
