/**
 * correction.ts — the hand correction of a read, as pure data.
 *
 * N.92 first slice, ruled by Dann 2026-08-24: the template is Finale's Speedy
 * Entry BEHAVIOUR, not its chrome. Scope for this ship is ALTER and DELETE of
 * existing notes. Insertion is N.92 proper and is not here.
 *
 * WHY A DIFF AND NOT AN EDITED SCORE. A page read is not stored as its result:
 * `restoreFrom` in `+page.svelte` re-ingests the STORED BYTES on reload, so the
 * reader runs again and rebuilds the vocal line from the same greyscale ink.
 * A correction that edited the line in place would be destroyed by that
 * re-read, and "a placement made by hand must survive a re-read" is the ruled
 * protected class. So a correction is a map keyed by EVENT ID, applied after
 * the read, exactly as `PairingMap` already is. The reader's ids are
 * deterministic (`run_page2.py` builds them from measure and x since N.97), so
 * the same bytes re-read give the same ids and the same corrections land again.
 * `migrateCorrectionIds` below carries a map written under the older
 * measure-onset-x scheme across to this one.
 *
 * PURE, AND OUT OF THE COMPONENT ON PURPOSE, the note-picker.ts discipline:
 * every rule below is testable under vitest's node environment with no DOM.
 *
 * `VocalLineEvent` IS NOT TOUCHED, per the ship's hard constraint. Nothing here
 * adds a field to it; `applyCorrections` returns ordinary events built from the
 * ones the parser produced.
 */

import {
	pitchToMidi,
	spellPitch,
	type Fraction,
	type NoteBase,
	type Pitch,
	type SpellingContext,
	type VocalLineEvent
} from '@ilya/score-parser';

/**
 * One note's correction. Every field is optional and absent means untouched,
 * so a correction that only changes a duration carries no pitch and cannot
 * silently restate one.
 *
 * `deleted` is `true` or absent, never `false`: an un-delete is the removal of
 * the entry, so there is one representation of each state and no way to store
 * a contradiction.
 */
export interface NoteCorrection {
	pitch?: Pitch;
	base?: NoteBase;
	dots?: number;
	deleted?: true;
}

/** Corrections by event id, the shape `PairingMap` already established. */
export type CorrectionMap = Record<string, NoteCorrection>;

/** The diatonic letters in order from C, for stepping. */
const STEPS: Pitch['step'][] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * The five digits Finale's Speedy Entry binds, kept because Dann knows them in
 * his fingers. The map is exported so the touch buttons and the key handler
 * cannot drift apart: there is one table, and both read it.
 */
export const DIGIT_BASE: Record<string, NoteBase> = {
	'3': '16th',
	'4': 'eighth',
	'5': 'quarter',
	'6': 'half',
	'7': 'whole'
};

/** Whole-note units of each base, before dots. */
const BASE_FRACTION: Record<NoteBase, Fraction> = {
	breve: { numerator: 2, denominator: 1 },
	whole: { numerator: 1, denominator: 1 },
	half: { numerator: 1, denominator: 2 },
	quarter: { numerator: 1, denominator: 4 },
	eighth: { numerator: 1, denominator: 8 },
	'16th': { numerator: 1, denominator: 16 },
	'32nd': { numerator: 1, denominator: 32 },
	'64th': { numerator: 1, denominator: 64 },
	'128th': { numerator: 1, denominator: 128 }
};

function gcd(a: number, b: number): number {
	return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/**
 * The sounding length of `base` with `dots`, in whole-note units, reduced.
 *
 * A dot adds half of what precedes it, so n dots multiply by (2^(n+1) - 1) /
 * 2^n. TUPLETS ARE DELIBERATELY NOT HANDLED: `Duration.tuplet` is preserved by
 * `applyCorrections` where it was already present, but this ship offers no way
 * to add or change one, and the reader does not attempt tuplets at all (its own
 * README lists them as a blind spot). A corrected note that carried a tuplet
 * keeps it and keeps the parser's own fraction.
 */
export function durationFraction(base: NoteBase, dots: number): Fraction {
	const b = BASE_FRACTION[base];
	const num = b.numerator * (2 ** (dots + 1) - 1);
	const den = b.denominator * 2 ** dots;
	const g = gcd(num, den) || 1;
	return { numerator: num / g, denominator: den / g };
}

/**
 * One diatonic staff step up or down, spelling preserved.
 *
 * A staff step moves the NOTEHEAD, so the letter and octave change and the
 * accidental does not: a singer nudging a misread F♯ up wants G♯, which is what
 * the printed key signature would give them, not G natural. A step is the one
 * pitch operation that does not ask the spelling policy, because a semitone
 * count cannot express "one line or space" (a step is one or two semitones
 * depending where it falls) and the accidental it carries is already the
 * singer's own.
 */
export function stepPitch(p: Pitch, direction: 1 | -1): Pitch {
	const i = STEPS.indexOf(p.step);
	const next = (i + direction + 7) % 7;
	const wrapped = direction > 0 ? next < i : next > i;
	return { step: STEPS[next], alter: p.alter, octave: p.octave + (wrapped ? direction : 0) };
}

/** One octave up or down. Spelling is untouched; only the octave moves. */
export function octavePitch(p: Pitch, direction: 1 | -1): Pitch {
	return { ...p, octave: p.octave + direction };
}

/**
 * One semitone up or down, spelled by the app's ONE speller in the key the note
 * sounds in (N.92 slice 2, ruled by Dann 2026-08-24).
 *
 * This used to call `transposePitch`, which spells sharps only, so nudging D
 * down gave C♯ in every key including E flat major, where the note on the page
 * is a D flat. `spellPitch` reads the key instead. Pass the key in force at
 * this note and, where the score carries no key at all, the note before it.
 *
 * A nudge is a change of PITCH, so the spelling it lands on is the policy's to
 * choose. The three accidental verbs below are a change of SPELLING, and there
 * the singer's choice is the answer and the policy is not consulted.
 */
export function semitonePitch(
	p: Pitch,
	direction: 1 | -1,
	context: SpellingContext = {}
): Pitch {
	return spellPitch(pitchToMidi(p) + direction, context);
}

/**
 * THE ACCIDENTAL VERBS (N.92 slice 2, ruled by Dann 2026-08-24).
 *
 * CUMULATIVE, AND TWO CLICKS REACH DOUBLES. Flat lowers the spelling one degree
 * per click (B, B♭, B𝄫), sharp raises it, and natural resets to the plain
 * letter. A third click in the same direction does nothing: the alteration is
 * capped at a double, which is where notation itself stops.
 *
 * SOUND FOLLOWS SPELLING. The letter and the octave never move, so a flattened
 * B sounds a semitone lower, exactly as the singer sees it. That is the whole
 * point of the slice: a B natural the reader got wrong becomes a B flat, and
 * not the A sharp a semitone nudge used to give.
 *
 * Each verb returns the SAME pitch object when it would change nothing, so a
 * capped click leaves the correction map untouched.
 */
export function flatPitch(p: Pitch): Pitch {
	return p.alter <= -2 ? p : { ...p, alter: p.alter - 1 };
}

/** One sharp higher in spelling, capped at a double sharp. See `flatPitch`. */
export function sharpPitch(p: Pitch): Pitch {
	return p.alter >= 2 ? p : { ...p, alter: p.alter + 1 };
}

/** The plain letter: every sharp and flat removed. See `flatPitch`. */
export function naturalPitch(p: Pitch): Pitch {
	return p.alter === 0 ? p : { ...p, alter: 0 };
}

/**
 * The pitch an event currently shows, correction included. Returns undefined
 * for a rest or for an event with no pitch, which is what makes every caller
 * below able to ask without first testing the type.
 */
export function currentPitch(ev: VocalLineEvent, map: CorrectionMap): Pitch | undefined {
	return map[ev.id]?.pitch ?? ev.pitch;
}

/** The base and dots an event currently shows, correction included. */
export function currentDuration(
	ev: VocalLineEvent,
	map: CorrectionMap
): { base: NoteBase; dots: number } {
	const c = map[ev.id];
	return { base: c?.base ?? ev.duration.base, dots: c?.dots ?? ev.duration.dots };
}

/**
 * Fold one change into the map without disturbing the rest of that note's
 * correction. Returns a NEW map; nothing here mutates, so Svelte's own
 * reactivity sees an assignment rather than an in-place edit.
 *
 * An entry that ends up saying nothing is REMOVED rather than stored empty, so
 * a singer who nudges a note up and back down leaves no correction behind and
 * the stored document does not grow a record of a decision that was undone.
 */
export function withCorrection(
	map: CorrectionMap,
	id: string,
	change: NoteCorrection
): CorrectionMap {
	const next = { ...map, [id]: { ...map[id], ...change } };
	const entry = next[id];
	if (entry.deleted === undefined && entry.pitch === undefined && entry.base === undefined) {
		// `dots` alone can still be meaningful, so it is checked separately.
		if (entry.dots === undefined) {
			const { [id]: _dropped, ...rest } = next;
			return rest;
		}
	}
	return next;
}

/** Drop a note's whole correction, restoring exactly what the reader read. */
export function clearCorrection(map: CorrectionMap, id: string): CorrectionMap {
	if (!(id in map)) return map;
	const { [id]: _dropped, ...rest } = map;
	return rest;
}

/**
 * The corrected vocal line: pitches and durations replaced where corrected,
 * deleted events removed, everything else carried through untouched.
 *
 * THE SYLLABLE SURVIVES A PITCH CHANGE. It is carried by the spread, and it is
 * named here because the ship's constraint names it: a corrected pitch keeps
 * its attached syllable, and the syllable-assignment machinery is not consulted
 * or altered by anything in this file. The event ID is likewise preserved, so
 * `PairingMap` and every id-keyed consumer downstream still resolve.
 *
 * A DELETED NOTE'S SYLLABLE GOES WITH IT, which is the point: the deletions
 * this ship exists for are the reader's false positives, a measured 13 of 55 on
 * the Lamm scan, and a false positive carrying a syllable is exactly the note
 * whose removal re-aligns everything after it.
 *
 * Returns the input array unchanged where the map is empty, so a score with no
 * corrections costs nothing and renders the identical object.
 */
export function applyCorrections(
	vocalLine: VocalLineEvent[],
	map: CorrectionMap
): VocalLineEvent[] {
	if (Object.keys(map).length === 0) return vocalLine;
	const out: VocalLineEvent[] = [];
	for (const ev of vocalLine) {
		const c = map[ev.id];
		if (!c) {
			out.push(ev);
			continue;
		}
		if (c.deleted) continue;
		const base = c.base ?? ev.duration.base;
		const dots = c.dots ?? ev.duration.dots;
		const durationChanged = base !== ev.duration.base || dots !== ev.duration.dots;
		out.push({
			...ev,
			...(c.pitch ? { pitch: c.pitch } : {}),
			duration: durationChanged
				? {
						...ev.duration,
						base,
						dots,
						// A tuplet keeps the parser's own fraction: this ship cannot
						// change a tuplet, so recomputing one here would be inventing
						// arithmetic it has no input for.
						fraction: ev.duration.tuplet
							? ev.duration.fraction
							: durationFraction(base, dots)
					}
				: ev.duration
		});
	}
	return out;
}

/**
 * The id of the note `delta` places along the line from `id`, skipping rests
 * and anything already deleted, or `null` at either end.
 *
 * Stopping at the ends rather than wrapping, on `handleNotePick`'s own
 * precedent: a wrap would silently carry the singer from the last note of the
 * piece back to the first, which reads as the selection vanishing.
 */
export function neighbourId(
	vocalLine: VocalLineEvent[],
	map: CorrectionMap,
	id: string,
	delta: 1 | -1
): string | null {
	const live = vocalLine.filter((e) => e.type !== 'rest' && !map[e.id]?.deleted);
	const i = live.findIndex((e) => e.id === id);
	if (i < 0) return null;
	const j = i + delta;
	return j >= 0 && j < live.length ? live[j].id : null;
}

/** The first selectable note of a line, or null where there is none. */
export function firstNoteId(vocalLine: VocalLineEvent[], map: CorrectionMap): string | null {
	const ev = vocalLine.find((e) => e.type !== 'rest' && !map[e.id]?.deleted);
	return ev ? ev.id : null;
}

/**
 * MIDI of a pitch, re-exported so the correction surface has one import rather
 * than two and so a caller cannot reach for a second height instrument.
 */
export { pitchToMidi };

/**
 * THE ID RE-KEY, N.97, ruled by Dann 2026-08-24.
 *
 * The reader used to build an event id as `r{measureIndex}-{onsetNum}-{onsetDen}-{x}`,
 * with `na-na` standing in for the onset where a duration abstention had cost
 * it. The onset is a RUNNING SUM over the measure's preceding events, so
 * removing one event early in a measure renamed every event after it and every
 * correction keyed to those names stopped landing. N.97 removes clef and
 * key-signature false positives on purpose, which is exactly the change that
 * would have done it, so the id is now `r{measureIndex}-{x}`: two properties of
 * where the ink is, neither of which moves when a neighbour is removed.
 *
 * A stored map is re-keyed HERE, at load, by stripping the two onset segments.
 * The rule is SYNTACTIC and needs no knowledge of the score: an old id has
 * exactly four dash-separated segments and a new one has two, or three when the
 * reader's collision suffix fired. So a four-segment id is old, and nothing
 * else is.
 *
 * IDEMPOTENT BY THAT SAME COUNT. A migrated id has two or three segments and is
 * never four, so running this again is a no-op. It is safe on a map that has
 * already been through it, on a mixed map, and on a map from a future version.
 *
 * ON A COLLISION THE FIRST ENTRY WINS. Two old ids in one measure can strip to
 * the same new id only if they shared an x, which means the reader emitted two
 * events at one x in one measure; the later ones are dropped and become
 * orphans, which `orphanIds` then counts and the drawer declares. Insertion
 * order decides, which for an object read back from IndexedDB is the order it
 * was written in.
 */
export function migrateCorrectionIds(map: CorrectionMap): CorrectionMap {
	let changed = false;
	const out: CorrectionMap = {};
	for (const [id, correction] of Object.entries(map)) {
		const parts = id.split('-');
		if (parts.length !== 4) {
			out[id] = correction;
			continue;
		}
		changed = true;
		const next = `${parts[0]}-${parts[3]}`;
		if (!(next in out)) out[next] = correction;
	}
	return changed ? out : map;
}

/**
 * The ids in `map` that no event in `vocalLine` carries.
 *
 * A correction that fails to land must never fail silently: the drawer counts
 * these and says so. The count is DERIVED on every read rather than stored,
 * because whether a correction lands is a fact about the current read and not
 * about the correction.
 *
 * A deletion whose target is already gone is NOT an orphan by a different
 * standard: it is one, and it is counted, because the singer's instruction did
 * not reach a note. What it is not is a defect to fix by dropping the entry,
 * since the same bytes re-read may well bring the note back.
 */
export function orphanIds(vocalLine: VocalLineEvent[], map: CorrectionMap): string[] {
	const ids = Object.keys(map);
	if (ids.length === 0) return [];
	const live = new Set(vocalLine.map((ev) => ev.id));
	return ids.filter((id) => !live.has(id));
}
