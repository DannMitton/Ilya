/**
 * The head-of-score watch list ("Places to watch"), Fit design C.
 *
 * A pure translation layer: it reads the acoustic marks Fit already computes
 * per note (`AnalyzedScore.events`, all from the singer's own fR1) and the
 * parsed score, and returns a severity-ranked, capped list of the places in
 * the song most likely to challenge THIS singer as profiled. It computes no
 * new acoustics and makes no claim the per-note marks do not already carry:
 * "Fit forecasts, it does not declare" (overlay-engine.ts).
 *
 * Rulings this implements (project knowledge):
 *   - §7.1–§7.5 (`fit-watchlist-rulings_2026-07-17.md`): placement as a head
 *     band, the severity order, print-nothing on zero challenge, the
 *     severity-gated cap with honest overflow, and the bar-first copy.
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
 * Dann's; the templates below marked APPROVED are from §7.5, the one marked
 * DRAFT awaits his ruling.
 *
 * This module is PURE and framework-free, so it is unit-testable the way the
 * parsers are. `VoiceProfilePane` consumes it for the printed band.
 */

import {
	centsBetween,
	pitchToHz,
	pitchToMidi,
	type AnalyzedScore,
	type NoteBase,
	type ParsedScore,
	type TempoMarking,
	type VocalLineEvent
} from '@ilya/score-parser';
import { collectScoreWords } from './vowel-resolver';

// ── Tunable constants (each tagged; all single-point-of-change) ──────

/**
 * Passaggio edge-proximity window, in cents. RULED ±1 semitone (Dann,
 * 2026-07-18), implementing §A.126's "proximity to either declared edge,
 * interior quiet." Leans into the "interior quiet" half of §A.126 over its
 * "male edges nearly coincide" half; a single constant if it reads too tight.
 */
const PASSAGGIO_EDGE_WINDOW_CENTS = 100;

/** Sustain threshold in seconds. SOURCED §A.117 (≥ 2.5 s OR a fermata). */
const SUSTAIN_SECONDS_THRESHOLD = 2.5;

// No cap (Dann, 2026-07-18): the watch list renders on its own page after the
// score, so every item shows. A tighter curation ("highlights, not a novella")
// is a deferred design pass, not a cap.

/** Header line. APPROVED §7.5. */
export const WATCH_HEADER = 'Places to watch';

// ── The model ───────────────────────────────────────────────────────

/** A watch kind, in severity order; its index+1 is not the tier (see TIER_OF). */
export type WatchKind = 'range' | 'crossing' | 'passaggio' | 'timbre' | 'sustain';

/** Severity tier per kind, hardest first. SOURCED §7.2. */
const TIER_OF: Record<WatchKind, 1 | 2 | 3 | 4 | 5> = {
	range: 1,
	crossing: 2,
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
	 * Harmonic density d = fR1/fo (number of harmonics at/below the first
	 * resonance). Lower = higher in the voice = more acute; sorts first within
	 * a tier. INFERENCE on Bozeman pp. 42–43 (§A.135).
	 */
	density: number;
}

export interface WatchList {
	/** Final, sorted entries to render, all of them. Empty = render nothing (§7.3). */
	entries: WatchEntry[];
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

// ── The generator ───────────────────────────────────────────────────

/**
 * Build the watch list for one verse (default 1) from the parsed score and its
 * analysis overlay. Pure and deterministic.
 */
export function buildWatchList(
	parsed: ParsedScore,
	analyzed: AnalyzedScore,
	verseNumber = 1
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
	const raw: WatchEntry[] = [];

	for (const [id, a] of Object.entries(analyzed.events)) {
		const ev = eventById.get(id);
		if (!ev || !ev.pitch) continue; // needs the sung pitch, joined from the parse
		const foHz = pitchToHz(ev.pitch);
		const kinds: WatchKind[] = [];

		// Tier 1 — out of the range the singer gave. SOURCED §7.2.
		if (a.rangeStatus === 'out-of-range') kinds.push('range');

		// Tier 2 — the fundamental meets the first resonance. SOURCED §7.2.
		if (a.crossing) kinds.push('crossing');

		// Tier 3 — within ±1 semitone of EITHER declared edge; interior quiet.
		// SOURCED §A.126. Only when the singer declared both edges.
		if (passaggio) {
			const nearPrimo =
				Math.abs(centsBetween(pitchToHz(passaggio.primo), foHz)) <= PASSAGGIO_EDGE_WINDOW_CENTS;
			const nearSecondo =
				Math.abs(centsBetween(pitchToHz(passaggio.secondo), foHz)) <= PASSAGGIO_EDGE_WINDOW_CENTS;
			if (nearPrimo || nearSecondo) kinds.push('passaggio');
		}

		// Tier 4 — a timbre turn inside a sung word (this note is the flip onset).
		const turn = timbreTurnAt.get(id);
		if (turn) kinds.push('timbre');

		// Tier 5 — a long sustain parked on its own turning pitch. JUDGEMENT:
		// "on its turning pitch" = the same semitone (enharmonic-safe via MIDI).
		if (isLongSustain(ev, parsed.tempoMarkings) && pitchToMidi(ev.pitch) === pitchToMidi(a.turningPitch))
			kinds.push('sustain');

		if (kinds.length === 0) continue; // silence is the feature (§7.3 / §1)

		// A range event is above the ceiling or below the floor; the copy differs.
		let rangeDirection: 'above' | 'below' | undefined;
		if (kinds.includes('range')) {
			const singerRange = analyzed.calibrationSnapshot.range;
			rangeDirection =
				singerRange && pitchToMidi(ev.pitch) < pitchToMidi(singerRange.lowest) ? 'below' : 'above';
		}

		kinds.sort((x, y) => TIER_OF[x] - TIER_OF[y]);
		raw.push({
			eventId: id,
			tier: TIER_OF[kinds[0]],
			kinds,
			bar: barOf(parsed, ev),
			vowel: a.vowel,
			...(wordByEvent.has(id) ? { word: wordByEvent.get(id) } : {}),
			...(turn ? { timbreDirection: turn.direction } : {}),
			...(rangeDirection ? { rangeDirection } : {}),
			// d = fR1/fo, and fR1 = 2·(turning-pitch Hz), so d = 2·turningHz/fo.
			density: (2 * pitchToHz(a.turningPitch)) / foHz
		});
	}

	// Sort: tier asc → stacking (more kinds first) → density asc (more acute
	// first) → score order. SOURCED §7.2 + the density ruling (within-tier).
	raw.sort((x, y) => {
		if (x.tier !== y.tier) return x.tier - y.tier;
		if (x.kinds.length !== y.kinds.length) return y.kinds.length - x.kinds.length;
		if (x.density !== y.density) return x.density - y.density;
		return (orderById.get(x.eventId) ?? 0) - (orderById.get(y.eventId) ?? 0);
	});

	// Show all (Dann, 2026-07-18): the list renders on its own page after the
	// score, so nothing is capped or hidden. `raw` is already sorted. (A tighter
	// upthread curation — highlights, not a novella — is a deferred design pass.)
	return { entries: raw };
}

/** Bar number from the measure's own `.number`, never `measureIndex + 1` (audit §3, §A). */
function barOf(parsed: ParsedScore, ev: VocalLineEvent): string {
	const m = parsed.measures[ev.measureIndex];
	// Last-ditch only if the measure is genuinely missing; real parsers always
	// carry `.number` (which itself diverges from mi+1 on m<number> ids).
	return m ? m.number : String(ev.measureIndex + 1);
}

// ── Copy (EN). Templates: APPROVED = §7.5, DRAFT = awaiting Dann. ────

/**
 * The rendered line for an entry, leading with the bar (§7.5). Uses the most
 * severe kind's template; the stacking count still lifts the entry in the sort.
 * A note that carries several kinds is named once by its hardest.
 */
export function watchEntryLine(entry: WatchEntry): string {
	const bar = entry.bar;
	const v = `/${entry.vowel}/`;
	switch (entry.kinds[0]) {
		case 'range': // above: APPROVED §7.5. below: DRAFT (copy is Dann's), mirrors the approved line.
			return entry.rangeDirection === 'below'
				? `Bar ${bar} drops below the range you gave; you may want a transposition.`
				: `Bar ${bar} rises above the range you gave; you may want a transposition.`;
		case 'crossing': // APPROVED §7.5 (illustrative "sustained" dropped: not every crossing is held)
			return `Bar ${bar}: your ${v} sits on your first resonance, so the vowel may lock or whistle.`;
		case 'passaggio': // APPROVED §7.5
			return entry.word
				? `Bar ${bar}: '${entry.word}' falls near your passaggio; expect the turn to want managing.`
				: `Bar ${bar}: your ${v} falls near your passaggio; expect the turn to want managing.`;
		case 'timbre': { // APPROVED §7.5
			const dir = entry.timbreDirection === 'close-to-open' ? 'close to open' : 'open to close';
			const on = entry.word ? ` on '${entry.word}'` : '';
			return `Bar ${bar}: your ${v}${on} turns ${dir} inside the word, so the colour shifts as you sing it.`;
		}
		case 'sustain': // DRAFT — copy is Dann's; §7.5 approved no sustain line.
			return `Bar ${bar}: the ${v} you sustain here sits on its turning pitch, so the colour may feel unsteady as you hold it.`;
	}
}
