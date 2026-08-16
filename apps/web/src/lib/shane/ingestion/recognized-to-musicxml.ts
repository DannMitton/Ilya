/**
 * recognized-to-musicxml — the page reader's output becomes ordinary MusicXML.
 *
 * N.59, Ruling C. `ro` is never stored as a parallel score format inside Ilya.
 * It becomes MusicXML text here and enters through the existing ingest seam, so
 * a photographed page joins the app exactly where every other score joins it,
 * and NOTHING new touches `ParsedScore`. The pairing law is untouched because
 * the join happens upstream of `ParsedScore`, not beside it.
 *
 * Pure TypeScript on purpose: runes are inert under this vitest suite
 * (ENVIRONMENT, "Runes under vitest"), so every decision worth testing lives in
 * a plain module.
 *
 * RULING D'S TWO SUBSTITUTIONS, and why each is what it is.
 *
 * - PITCH. The reader nulls `midi` when the accidental engine abstains, and
 *   that ruling governs `ro` and stands. Here, one layer down, the geometric
 *   value carried as `midiAssumedNatural` is engraved. A dropped event would
 *   silently shift every later syllable one note left and corrupt the pairing
 *   invisibly; a natural shown plainly is a visible, checkable error a singer
 *   can see and hear against their own paper. Same logic that struck the
 *   uncertainty mark in E.47.
 * - DURATION. An abstained duration, and every event after it in that measure
 *   whose onset chain is therefore lost, is emitted as a QUARTER note. There is
 *   no honest recoverable value, and a visible wrong rhythm in a named measure
 *   beats an invented policy that pretends to know. Note that this discards a
 *   follower's own duration even where the reader read it confidently; that is
 *   the ruling as written, and the count is declared rather than hidden.
 *
 * Both are COUNTED, never marked. The counts go to the drawer's read report.
 */

import type {
	RecognizedFraction,
	RecognizedMeasure,
	RecognizedNote,
	RecognizedOutput,
} from './recognized';

/** The singer's answers, which the reader cannot detect (Ruling A). */
export interface EngravingAnswers {
	/** `'G'`, `'F'`, or `'C'`, with its staff line. */
	clef: { sign: string; line: number };
	/** 0, or -1 for the treble clef sounding an octave lower. */
	octaveChange: number;
	/** Key signature in fifths; negative for flats. */
	fifths: number;
}

export interface ConversionCounts {
	measures: number;
	notes: number;
	rests: number;
	/** Notes engraved from `midiAssumedNatural`, per measure. */
	pitchSubstitutions: { measureIndex: number; count: number }[];
	/** Events forced to a quarter note, per measure. */
	durationSubstitutions: { measureIndex: number; count: number }[];
	/** Notes with no pitch at all. Defensive; see the note at `spellPitch`. */
	pitchless: number;
}

export interface ConversionResult {
	xml: string;
	counts: ConversionCounts;
}

// ── Rationals ────────────────────────────────────────────────────

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number): number => Math.abs(a * b) / (gcd(a, b) || 1);

/** A quarter note, in whole notes. Ruling D's substitute duration. */
const QUARTER: RecognizedFraction = { numerator: 1, denominator: 4 };

const isUsableFraction = (f: RecognizedFraction | null | undefined): f is RecognizedFraction =>
	!!f && Number.isFinite(f.numerator) && Number.isFinite(f.denominator) &&
	f.numerator > 0 && f.denominator > 0;

// ── Note type names ──────────────────────────────────────────────

const BASE_BY_DENOMINATOR: Record<number, string> = {
	1: 'whole',
	2: 'half',
	4: 'quarter',
	8: 'eighth',
	16: '16th',
	32: '32nd',
	64: '64th',
};

/**
 * `<type>` and `<dot>` for a duration expressed in whole notes. The parser
 * treats the divisions-derived fraction as the source of truth and only uses
 * `<type>` for display, but emitting a wrong one earns an `unrecognised-element`
 * warning, so an undecidable duration emits no `<type>` at all rather than a
 * guess. Tuplet durations (denominators carrying a factor of 3) land here.
 */
function typeAndDots(f: RecognizedFraction): { base: string; dots: number } | null {
	for (let dots = 0; dots <= 2; dots++) {
		// base = f / ((2^(dots+1) - 1) / 2^dots)
		const num = f.numerator * (1 << dots);
		const den = f.denominator * ((1 << (dots + 1)) - 1);
		const g = gcd(num, den) || 1;
		const n = num / g;
		const d = den / g;
		if (n === 1 && BASE_BY_DENOMINATOR[d]) return { base: BASE_BY_DENOMINATOR[d], dots };
	}
	return null;
}

// ── Pitch spelling ───────────────────────────────────────────────

const SHARP_SPELLING: [string, number][] = [
	['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0],
	['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0],
];
const FLAT_SPELLING: [string, number][] = [
	['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0],
	['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0],
];

/**
 * Spell a MIDI number as step, alter, and octave, choosing sharps in sharp keys
 * and flats in flat keys. `fifths === 0` takes sharps, which is what C major's
 * chromatic notes are conventionally written as in this repertoire.
 *
 * Neither table ever spells B sharp or C flat, so the step never wraps past an
 * octave boundary and the octave arithmetic below cannot be off by one.
 */
function spellPitch(midi: number, fifths: number): { step: string; alter: number; octave: number } {
	const table = fifths < 0 ? FLAT_SPELLING : SHARP_SPELLING;
	const pc = ((midi % 12) + 12) % 12;
	const [step, alter] = table[pc];
	return { step, alter, octave: Math.floor(midi / 12) - 1 };
}

// ── XML ──────────────────────────────────────────────────────────

const escapeXml = (s: string): string =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── The conversion ───────────────────────────────────────────────

export function recognizedToMusicXml(
	ro: RecognizedOutput,
	answers: EngravingAnswers
): ConversionResult {
	const notes = ro.verses?.[0]?.notes ?? [];
	const measuresByIndex = new Map<number, RecognizedMeasure>();
	for (const m of ro.measures ?? []) measuresByIndex.set(m.measureIndex, m);

	// Every event's EFFECTIVE duration, with Ruling D's substitution already
	// applied, so `divisions` is computed over what is actually emitted rather
	// than over what the reader wished it had.
	const effective = new Map<RecognizedNote, RecognizedFraction>();
	const durationSubs = new Map<number, number>();
	const pitchSubs = new Map<number, number>();
	const bump = (m: Map<number, number>, k: number) => m.set(k, (m.get(k) ?? 0) + 1);

	for (const n of notes) {
		const lostOnset = !!n.abstain?.onset || n.onset === null;
		if (!isUsableFraction(n.duration) || lostOnset) {
			effective.set(n, QUARTER);
			bump(durationSubs, n.measureIndex);
		} else {
			effective.set(n, n.duration);
		}
	}

	// `divisions` is per QUARTER note, and a duration in whole notes n/d becomes
	// 4 * divisions * n / d. Taking divisions as the LCM of the denominators
	// makes every one of those integral, which is the only property that
	// matters; a tighter value would be smaller, not more correct.
	let divisions = 1;
	for (const f of effective.values()) divisions = lcm(divisions, f.denominator);
	if (!Number.isFinite(divisions) || divisions <= 0) divisions = 4;

	const durationDivs = (f: RecognizedFraction): number =>
		Math.max(1, Math.round((4 * divisions * f.numerator) / f.denominator));

	// Group by measure, keeping the reader's own order within each.
	const byMeasure = new Map<number, RecognizedNote[]>();
	for (const n of notes) {
		const list = byMeasure.get(n.measureIndex);
		if (list) list.push(n);
		else byMeasure.set(n.measureIndex, [n]);
	}

	const indices = [...new Set([...byMeasure.keys(), ...measuresByIndex.keys()])].sort(
		(a, b) => a - b
	);

	const lines: string[] = [];
	lines.push('<?xml version="1.0" encoding="UTF-8"?>');
	lines.push(
		'<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" ' +
			'"http://www.musicxml.org/dtds/partwise.dtd">'
	);
	lines.push('<score-partwise version="4.0">');
	lines.push('  <work>');
	lines.push(`    <work-title>${escapeXml(ro.pieceId ?? 'Untitled')}</work-title>`);
	lines.push('  </work>');
	lines.push('  <part-list>');
	lines.push('    <score-part id="P1">');
	lines.push('      <part-name>Voice</part-name>');
	lines.push('    </score-part>');
	lines.push('  </part-list>');
	lines.push('  <part id="P1">');

	let noteCount = 0;
	let restCount = 0;
	let pitchless = 0;
	let emittedMeasures = 0;
	/** The metre currently in force, so `<time>` is emitted only on a change. */
	let currentMetre: string | null = null;

	for (let i = 0; i < indices.length; i++) {
		const mi = indices[i];
		const events = byMeasure.get(mi) ?? [];
		const measure = measuresByIndex.get(mi);
		emittedMeasures++;
		lines.push(`    <measure number="${emittedMeasures}">`);

		// A measure whose metre abstained carries no <time>, which is valid
		// MusicXML and is counted in the read report rather than invented.
		const metre =
			measure && measure.metre && !measure.abstain?.metre
				? `${measure.metre.beats}/${measure.metre.beatType}`
				: null;
		const first = i === 0;
		const metreChanged = metre !== null && metre !== currentMetre;

		if (first || metreChanged) {
			lines.push('      <attributes>');
			if (first) lines.push(`        <divisions>${divisions}</divisions>`);
			if (first) {
				lines.push('        <key>');
				lines.push(`          <fifths>${answers.fifths}</fifths>`);
				lines.push('        </key>');
			}
			if (metre) {
				lines.push('        <time>');
				lines.push(`          <beats>${measure!.metre!.beats}</beats>`);
				lines.push(`          <beat-type>${measure!.metre!.beatType}</beat-type>`);
				lines.push('        </time>');
			}
			if (first) {
				lines.push('        <clef>');
				lines.push(`          <sign>${escapeXml(answers.clef.sign)}</sign>`);
				lines.push(`          <line>${answers.clef.line}</line>`);
				if (answers.octaveChange !== 0) {
					lines.push(`          <clef-octave-change>${answers.octaveChange}</clef-octave-change>`);
				}
				lines.push('        </clef>');
			}
			lines.push('      </attributes>');
			if (metre) currentMetre = metre;
		}

		for (const n of events) {
			const dur = effective.get(n) ?? QUARTER;
			const divs = durationDivs(dur);
			lines.push('      <note>');
			if (n.type === 'rest') {
				restCount++;
				lines.push('        <rest/>');
			} else {
				const midi = n.midi ?? n.midiAssumedNatural ?? null;
				if (n.midi === null || n.midi === undefined) {
					if (n.midiAssumedNatural === null || n.midiAssumedNatural === undefined) {
						// DEFENSIVE ONLY. `run_page2` sets midiAssumedNatural from the
						// geometric value whenever it nulls midi, so a note reaches
						// here with neither only if that invariant breaks. A rest holds
						// the position, which is the one thing that must not shift; the
						// count says so out loud rather than engraving an invented pitch.
						pitchless++;
						restCount++;
						lines.push('        <rest/>');
						lines.push(`        <duration>${divs}</duration>`);
						const td0 = typeAndDots(dur);
						if (td0) {
							lines.push(`        <type>${td0.base}</type>`);
							for (let d = 0; d < td0.dots; d++) lines.push('        <dot/>');
						}
						lines.push('      </note>');
						continue;
					}
					bump(pitchSubs, n.measureIndex);
				}
				noteCount++;
				const p = spellPitch(midi as number, answers.fifths);
				lines.push('        <pitch>');
				lines.push(`          <step>${p.step}</step>`);
				if (p.alter !== 0) lines.push(`          <alter>${p.alter}</alter>`);
				lines.push(`          <octave>${p.octave}</octave>`);
				lines.push('        </pitch>');
			}
			lines.push(`        <duration>${divs}</duration>`);
			const td = typeAndDots(dur);
			if (td) {
				lines.push(`        <type>${td.base}</type>`);
				for (let d = 0; d < td.dots; d++) lines.push('        <dot/>');
			}
			lines.push('      </note>');
		}

		lines.push('    </measure>');
	}

	lines.push('  </part>');
	lines.push('</score-partwise>');

	const asList = (m: Map<number, number>) =>
		[...m.entries()]
			.filter(([, c]) => c > 0)
			.sort((a, b) => a[0] - b[0])
			.map(([measureIndex, count]) => ({ measureIndex, count }));

	return {
		xml: lines.join('\n') + '\n',
		counts: {
			measures: emittedMeasures,
			notes: noteCount,
			rests: restCount,
			pitchSubstitutions: asList(pitchSubs),
			durationSubstitutions: asList(durationSubs),
			pitchless,
		},
	};
}
