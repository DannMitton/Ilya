/**
 * N.127 Insights, increment 1: the numbers page one prints, and nothing else.
 *
 * Insights is Ilya's third document, numbered and ruled by Dann 2026-09-11
 * (`docs/memory/STATE.md`, the N.127 block). It is read-only, and every line
 * on it is computed from the singer's inputs. This module is where that
 * computation lives, so a vitest can reach every number before a pixel of it
 * is drawn. `InsightsPane.svelte` only lays the model out.
 *
 * COMPOSITION, NOT A NEW ENGINE. Every figure comes from a seam that already
 * owns it and is tested there:
 *
 *   - the compass and the crossings read the performance-order vocal line,
 *     the same projection `VoiceProfilePane` hands `analyzeScore`;
 *   - the tessitura is `pachecoTessitura` over `aggregatePhonation`'s
 *     `byPitch`, and `PhonationTrust` decides whether it may print;
 *   - the findings are `buildWatchList`'s entries, grouped and weighed.
 *
 * N.123, the aggregation layer, is NOT built here (brief §6). This file calls
 * `aggregatePhonation` directly, as `score-metrics.ts` already does.
 *
 * ABSENCE IS NULL, NEVER A DEFAULT. A row whose reference the singer did not
 * type carries `reference: null` and `flag: null`, and the page says so in
 * words. No estimate, no guess, and no placeholder number is produced.
 */

import {
	aggregatePhonation,
	chooseClefForSpan,
	pachecoTessitura,
	pitchToMidi,
	secondsFor,
	soundingFromNotation,
	fractionToNumber,
	type ParsedScore,
	type Pitch,
	type TempoResolution,
	type TessituraBasis,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
	type VowelForEvent,
} from '@ilya/score-parser';
import type { WatchEntry, WatchKind, WatchList } from './watchlist';

/** Where a measured span sits against the span the singer typed. */
export type Containment = 'contained' | 'above' | 'below' | 'wider';

/** A span of spelled pitches, low to high, as the score or the singer spelled them. */
export interface PitchSpan {
	low: Pitch;
	high: Pitch;
}

export interface RangeRow {
	/** The lowest and highest sung pitch. Null when the line carries no pitched note. */
	measured: PitchSpan | null;
	/** The range the singer typed. Null when either edge is blank. */
	reference: PitchSpan | null;
	/** Null whenever either side is null: nothing was compared. */
	flag: Containment | null;
}

export interface CrossingsRow {
	/**
	 * Moves across each typed passaggio, counted over consecutive sung pitches.
	 * Null when the singer did not type both edges, because a count against an
	 * edge nobody gave is a count against nothing.
	 */
	measured: { primo: number; secondo: number } | null;
	reference: { primo: Pitch; secondo: Pitch } | null;
}

export interface TessituraRow {
	/** Pacheco's band. Null when nothing was sung or the band is withheld for trust. */
	measured: (PitchSpan & { basis: TessituraBasis; marginal: boolean }) | null;
	/**
	 * The printed measure numbers of the bars `PhonationTrust` could not vouch
	 * for. Non-null means the band was computed and deliberately NOT printed.
	 */
	withheldFor: string[] | null;
	reference: PitchSpan | null;
	flag: Containment | null;
}

export type Verdict = 'fit' | 'outside-range' | 'outside-tessitura' | 'range-only' | 'cannot-say';

/** One hazard, anchored by its weightiest instance. */
export interface Finding {
	/** The hazard's identity: the watch kind, split by direction where the copy splits. */
	key: string;
	kind: WatchKind;
	rangeDirection?: 'above' | 'below';
	timbreDirection?: 'open-to-close' | 'close-to-open';
	/** The anchor's printed measure number. */
	measure: string;
	/** The anchor's sung pitch, as spelled in the score. */
	pitch: Pitch;
	/** The anchor's sung vowel, IPA verbatim from the resolver. */
	vowel: string;
	word?: string;
	/** Every instance of this hazard in the watch list, the anchor included. */
	instances: number;
	/** Summed phonation over every instance, in quaver-equivalents, repeats counted. */
	massQuavers: number;
	/** `massQuavers` in seconds, N.123. Absent when the score states no tempo. */
	seconds?: SecondsFigure;
}

/**
 * A span of time in seconds. A RANGE wherever the tempo is inferred from a
 * word, because `secondsFor` then gives a band and a point would be a guess
 * printed as a measurement.
 */
export type SecondsFigure = { kind: 'point'; seconds: number } | { kind: 'range'; low: number; high: number };

/** The three zones of the singer's own passaggi, as shares of phonation time, 0 to 1. */
export interface PassaggioZones {
	below: number;
	between: number;
	above: number;
}

export interface VowelTime {
	/** IPA verbatim from the resolver. */
	vowel: string;
	/** Share of total phonation time, 0 to 1. */
	share: number;
	/** Null when the score states no tempo. */
	seconds: SecondsFigure | null;
	/** True when a finding anywhere in Insights names this vowel. */
	flagged: boolean;
}

/**
 * N.123's first figure, phonation time, as Insights prints it (Dann's option 1,
 * ruled 2026-09-22 23:45).
 */
export interface PhonationSection {
	/**
	 * `point` for an encoded or singer-set tempo, `range` for a tempo inferred
	 * from a word, `none` when the score states no tempo.
	 */
	timing: 'point' | 'range' | 'none';
	/** Total sounding time. Null when `timing` is `none`. */
	phonation: SecondsFigure | null;
	/**
	 * Elapsed length, rests included, at the same tempo. A point only: where the
	 * tempo is inferred the headline drops the length (brief §3, DESK DEFAULT).
	 */
	length: number | null;
	tempo: TempoResolution | null;
	/** Null without both typed passaggi, or when nothing is sung. */
	zones: PassaggioZones | null;
	/** Most phonation time first. Null when no resolver was supplied. */
	vowels: VowelTime[] | null;
	/**
	 * The printed numbers of bars `PhonationTrust` cannot vouch for. Their time
	 * is INCLUDED in every figure, as written, and the page names them.
	 */
	untrustedMeasures: string[] | null;
	/** Nothing pitched is sung, so there is no time to divide. */
	nothingSung: boolean;
}

/** One spelled pitch's time on the tessituragram. */
export interface FigureBar {
	/** As the score spells it: the bar sits at this letter and octave. */
	pitch: Pitch;
	midi: number;
	/** Sung time on this spelling, quaver-equivalents, repeats counted. */
	quavers: number;
	/** The part of `quavers` sung on a vowel some finding names. Zero without a resolver. */
	focusQuavers: number;
}

/** One line or space of the stave. Two spellings on it split its height. */
export interface FigureSlot {
	/** Octave times seven plus the letter's index from C. */
	diatonic: number;
	/** Lowest pitch first, so the lowest draws at the bottom of the slot. */
	bars: FigureBar[];
}

/**
 * The tessituragram, N.123's figure joined to N.127 increment 2's compass
 * stave (`docs/sessions/brief-code-tessituragram_r1_2026-09-23.md`). Pure
 * data: `InsightsPane.svelte` only draws it.
 */
export interface TessituragramModel {
	clef: 'treble' | 'bass';
	/** Low to high, sung slots only. */
	slots: FigureSlot[];
	compass: PitchSpan;
	/** The longest bar, whose end carries the axis's only number. */
	longest: { pitch: Pitch; quavers: number; share: number; seconds: SecondsFigure | null };
	/** Seconds when the tempo is a point; quavers when it is a range or absent. */
	scale: 'seconds' | 'quavers';
	/** Every finding's number, 1 upward in list order, at its anchor's spelling. */
	marks: Array<{ n: number; pitch: Pitch }>;
	/** The vowels the focus colour marks. Null without a resolver. */
	focusVowels: string[] | null;
	/** No finding at all: the bars draw quietly. */
	quiet: boolean;
	range: PitchSpan | null;
	tessitura: PitchSpan | null;
	passaggio: { primo: Pitch; secondo: Pitch } | null;
	/** Whole percents that sum to 100. Null without both passaggi. */
	zones: PassaggioZones | null;
}

export interface InsightsModel {
	range: RangeRow;
	crossings: CrossingsRow;
	tessitura: TessituraRow;
	verdict: Verdict;
	/** Heaviest first. Empty is a finding: nothing fired. */
	findings: Finding[];
	phonation: PhonationSection;
	/** Null when nothing pitched is sung. */
	figure: TessituragramModel | null;
}

export interface InsightsInputs {
	/** The performance-order score the analysis read (`scoreInPerformanceOrder(...).score`). */
	analysisScore: ParsedScore;
	/** The singer's snapshot, from `buildVoiceProfileSnapshot`. */
	profile: VoiceProfileSnapshot;
	/** The watch list built over the same analysis, or null when none was built. */
	watchList: WatchList | null;
	/** The resolver the analysis used. Omit it and the per-vowel list is absent. */
	vowelForEvent?: VowelForEvent;
}

function pitched(score: ParsedScore): Array<VocalLineEvent & { pitch: Pitch }> {
	return score.vocalLine.filter(
		(ev): ev is VocalLineEvent & { pitch: Pitch } => ev.type === 'note' && !!ev.pitch,
	);
}

function containment(measured: { low: number; high: number }, reference: { low: number; high: number }): Containment {
	const under = measured.low < reference.low;
	const over = measured.high > reference.high;
	if (under && over) return 'wider';
	if (over) return 'above';
	if (under) return 'below';
	return 'contained';
}

/** The printed number of a measure, never `index + 1` where the score says otherwise. */
function measureNumber(score: ParsedScore, index: number): string {
	const m = score.measures.find((x) => x.index === index);
	return m && m.number.trim() ? m.number : String(index + 1);
}

/**
 * Crossings of one edge. A crossing is a move between two consecutive sung
 * pitches that puts one of them below the edge and the other at or above it.
 *
 * DESK DEFAULT, N.127 increment 1, and the definition is the tree's first: no
 * passaggio-crossing count existed before this file. Rests do not reset the
 * walk, because the voice still turns across a breath. A note ON the edge
 * counts as above it, since the edge is where the turn has happened.
 */
export function countCrossings(midis: readonly number[], edge: number): number {
	let n = 0;
	for (let i = 1; i < midis.length; i++) {
		if (midis[i - 1] < edge !== midis[i] < edge) n++;
	}
	return n;
}

function rangeRow(line: Array<VocalLineEvent & { pitch: Pitch }>, profile: VoiceProfileSnapshot): RangeRow {
	let low: Pitch | null = null;
	let high: Pitch | null = null;
	for (const ev of line) {
		const m = pitchToMidi(ev.pitch);
		if (!low || m < pitchToMidi(low)) low = ev.pitch;
		if (!high || m > pitchToMidi(high)) high = ev.pitch;
	}
	const measured = low && high ? { low, high } : null;
	const reference = profile.range ? { low: profile.range.lowest, high: profile.range.highest } : null;
	const flag =
		measured && reference
			? containment(
					{ low: pitchToMidi(measured.low), high: pitchToMidi(measured.high) },
					{ low: pitchToMidi(reference.low), high: pitchToMidi(reference.high) },
				)
			: null;
	return { measured, reference, flag };
}

function crossingsRow(line: Array<VocalLineEvent & { pitch: Pitch }>, profile: VoiceProfileSnapshot): CrossingsRow {
	const p = profile.passaggio;
	if (!p) return { measured: null, reference: null };
	const midis = line.map((ev) => pitchToMidi(ev.pitch));
	return {
		measured: {
			primo: countCrossings(midis, pitchToMidi(p.primo)),
			secondo: countCrossings(midis, pitchToMidi(p.secondo)),
		},
		reference: { primo: p.primo, secondo: p.secondo },
	};
}

function tessituraRow(
	score: ParsedScore,
	line: Array<VocalLineEvent & { pitch: Pitch }>,
	profile: VoiceProfileSnapshot,
): TessituraRow {
	const reference = profile.tessitura ? { low: profile.tessitura.low, high: profile.tessitura.high } : null;
	const totals = aggregatePhonation(score);

	/* TRUST FIRST. `aggregatePhonation` includes an untrusted bar's time in
	   `byPitch` and says so rather than dropping it. The band is cut from
	   those durations, so a band built on a bar the metre contradicts is not
	   printed, and the row names the bars instead (brief §5). */
	if (totals.trust.untrustedBars > 0) {
		return {
			measured: null,
			withheldFor: totals.trust.untrustedMeasureIndices.map((i) => measureNumber(score, i)),
			reference,
			flag: null,
		};
	}

	const band = pachecoTessitura(totals.byPitch);
	if (!band) return { measured: null, withheldFor: null, reference, flag: null };

	/* SPELLED AS THE SCORE SPELLS IT. The band's ends are MIDI numbers, and a
	   MIDI number is two spellings at once; both ends are pitches the line
	   actually sings, so the first sung note at each takes the name. */
	const spell = (midi: number): Pitch | null => line.find((ev) => pitchToMidi(ev.pitch) === midi)?.pitch ?? null;
	const low = spell(band.low);
	const high = spell(band.high);
	if (!low || !high) return { measured: null, withheldFor: null, reference, flag: null };

	const measured = { low, high, basis: band.basis, marginal: band.marginal };
	const flag = reference
		? containment(
				{ low: band.low, high: band.high },
				{ low: pitchToMidi(reference.low), high: pitchToMidi(reference.high) },
			)
		: null;
	return { measured, withheldFor: null, reference, flag };
}

/**
 * The one sentence under the table. It forecasts from the flags and never from
 * anything else, so it cannot say more than the rows above it say.
 */
export function verdictOf(range: RangeRow, tessitura: TessituraRow): Verdict {
	if (!range.flag) return 'cannot-say';
	if (range.flag !== 'contained') return 'outside-range';
	if (!tessitura.flag) return 'range-only';
	return tessitura.flag === 'contained' ? 'fit' : 'outside-tessitura';
}

function hazardKey(e: WatchEntry): string {
	const kind = e.kinds[0];
	return kind === 'range' ? `range-${e.rangeDirection ?? 'above'}` : kind;
}

/**
 * One entry per hazard, anchored by its weightiest instance, heaviest first
 * (curation criteria 4 and 5, ruled by Dann 2026-09-11 as a living list).
 *
 * A hazard is a watch entry's headline kind, the kind `watchEntryLine` names
 * it by, with range split by direction because rising above and dropping
 * below are two different findings. Weight is phonation mass: a note's
 * sounding length in quavers, summed over every time the performance order
 * sings it. The anchor is the heaviest instance; a tie keeps the watch list's
 * own severity order. Hazards sort by their summed mass, and a tie keeps the
 * order of their first appearance in the watch list.
 */
export function groupFindings(watchList: WatchList | null, analysisScore: ParsedScore): Finding[] {
	if (!watchList || watchList.entries.length === 0) return [];

	const massById = new Map<string, number>();
	const eventById = new Map<string, VocalLineEvent>();
	for (const ev of analysisScore.vocalLine) {
		if (ev.type !== 'note' || !ev.pitch) continue;
		eventById.set(ev.id, ev);
		const q = fractionToNumber(soundingFromNotation(ev.duration)) * 8;
		massById.set(ev.id, (massById.get(ev.id) ?? 0) + q);
	}

	const groups = new Map<string, WatchEntry[]>();
	for (const e of watchList.entries) {
		const key = hazardKey(e);
		const g = groups.get(key);
		if (g) g.push(e);
		else groups.set(key, [e]);
	}

	const findings: Finding[] = [];
	for (const [key, entries] of groups) {
		let anchor = entries[0];
		let mass = 0;
		for (const e of entries) {
			const m = massById.get(e.eventId) ?? 0;
			mass += m;
			if (m > (massById.get(anchor.eventId) ?? 0)) anchor = e;
		}
		const ev = eventById.get(anchor.eventId);
		if (!ev?.pitch) continue;
		findings.push({
			key,
			kind: anchor.kinds[0],
			...(anchor.rangeDirection ? { rangeDirection: anchor.rangeDirection } : {}),
			...(anchor.timbreDirection ? { timbreDirection: anchor.timbreDirection } : {}),
			measure: anchor.bar,
			pitch: ev.pitch,
			vowel: anchor.vowel,
			...(anchor.word ? { word: anchor.word } : {}),
			instances: entries.length,
			massQuavers: mass,
		});
	}

	// Array.prototype.sort is stable, so equal masses keep first-appearance order.
	return findings.sort((a, b) => b.massQuavers - a.massQuavers);
}

/**
 * Seconds for a span of quavers. Seconds are linear in quavers at one tempo,
 * so one call to `secondsFor` for a single quaver prices every figure on the
 * page, and the section and the findings cannot disagree about the tempo.
 */
function secondsPerQuaver(score: ParsedScore): { tempo: TempoResolution; price: (q: number) => SecondsFigure } | null {
	const one = secondsFor({ numerator: 1, denominator: 1 }, score);
	if (!one) return null;
	const range = one.secondsRange;
	return {
		tempo: one.tempo,
		price: range
			? (q) => ({ kind: 'range', low: q * range[0], high: q * range[1] })
			: (q) => ({ kind: 'point', seconds: q * one.seconds }),
	};
}

/**
 * The phonation-time section (N.123, the first figure).
 *
 * ZONE BOUNDARIES, DESK DEFAULT (brief 2026-09-23 §1.2): below means a MIDI
 * number under the primo; above means one over the secondo; between is
 * everything else, both passaggi included. A note ON a passaggio is counted
 * between, which differs from `countCrossings`, where the edge counts as above:
 * a crossing asks whether the voice has turned, a zone asks where it sits.
 *
 * TRUST, DESK DEFAULT, and deliberately NOT the tessitura row's. An untrusted
 * bar is counted as written and named, never dropped (`PhonationTrust`). The
 * tessitura withholds because Pacheco's cut can turn on half a quaver; an
 * "about" figure in seconds does not, and withholding it hid the whole section
 * on the engraved Sunless no. 1, whose bar 17 does not close (probe,
 * 2026-09-23).
 */
export function phonationSection(
	score: ParsedScore,
	profile: VoiceProfileSnapshot,
	findings: readonly Finding[],
	vowelForEvent?: VowelForEvent,
): PhonationSection {
	const totals = aggregatePhonation(score, vowelForEvent ? { vowelForEvent } : {});
	const pricing = secondsPerQuaver(score);
	const timing = !pricing ? 'none' : pricing.tempo.provenance === 'inferred' ? 'range' : 'point';
	const tempo = pricing?.tempo ?? null;
	const total = fractionToNumber(totals.total);
	const untrustedMeasures =
		totals.trust.untrustedBars > 0 ? totals.trust.untrustedMeasureIndices.map((i) => measureNumber(score, i)) : null;
	if (total <= 0) {
		return { timing, tempo, phonation: null, length: null, zones: null, vowels: null, untrustedMeasures, nothingSung: true };
	}

	const phonation = pricing ? pricing.price(total) : null;
	const lengthFigure = pricing && timing === 'point' ? pricing.price(fractionToNumber(totals.elapsed)) : null;
	const length = lengthFigure?.kind === 'point' ? lengthFigure.seconds : null;

	let zones: PassaggioZones | null = null;
	if (profile.passaggio) {
		const primo = pitchToMidi(profile.passaggio.primo);
		const secondo = pitchToMidi(profile.passaggio.secondo);
		let below = 0;
		let above = 0;
		for (const [midi, q] of totals.byPitch) {
			if (midi < primo) below += fractionToNumber(q);
			else if (midi > secondo) above += fractionToNumber(q);
		}
		zones = { below: below / total, between: (total - below - above) / total, above: above / total };
	}

	let vowels: VowelTime[] | null = null;
	if (totals.byVowel) {
		const flagged = new Set(findings.map((f) => f.vowel));
		// Array.prototype.sort is stable, so equal times keep first-sung order.
		vowels = [...totals.byVowel]
			.map(([vowel, q]) => {
				const n = fractionToNumber(q);
				return { vowel, share: n / total, seconds: pricing ? pricing.price(n) : null, flagged: flagged.has(vowel) };
			})
			.sort((a, b) => b.share - a.share);
	}

	return { timing, tempo, phonation, length, zones, vowels, untrustedMeasures, nothingSung: false };
}

const DIATONIC_INDEX: Record<Pitch['step'], number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/** The stave step a spelled pitch sits on. */
export function diatonicOf(p: Pitch): number {
	return p.octave * 7 + DIATONIC_INDEX[p.step];
}

/**
 * The tessituragram's data (N.123 with N.127 increment 2).
 *
 * BY SPELLING, NOT BY KEY. `aggregatePhonation`'s `byPitch` is keyed by MIDI
 * number, where B♭3 and A♯3 are one key, but the figure places each bar at
 * its letter and octave. So the aggregation runs once more with a resolver
 * whose answer is the spelling and the vowel together, and `byVowel` comes
 * back keyed by both. That keeps the bar-reading arbitration and the trust
 * rules `aggregatePhonation` applies, rather than summing durations a
 * second way here.
 */
export function tessituragram(
	score: ParsedScore,
	profile: VoiceProfileSnapshot,
	findings: readonly Finding[],
	tessitura: TessituraRow,
	range: RangeRow,
	zones: PassaggioZones | null,
	vowelForEvent?: VowelForEvent,
): TessituragramModel | null {
	if (!range.measured) return null;
	const SEP = '\u0001';
	const spell = (p: Pitch) => `${p.step}|${p.alter ?? 0}|${p.octave}`;
	const totals = aggregatePhonation(score, {
		vowelForEvent: (ev) => (ev.pitch ? `${spell(ev.pitch)}${SEP}${vowelForEvent?.(ev) ?? ''}` : undefined),
	});
	const total = fractionToNumber(totals.total);
	if (total <= 0 || !totals.byVowel) return null;

	const focusVowels = vowelForEvent ? [...new Set(findings.map((f) => f.vowel))] : null;
	const focus = new Set(focusVowels ?? []);
	const pitchOf = new Map<string, Pitch>();
	for (const ev of score.vocalLine) if (ev.type === 'note' && ev.pitch) pitchOf.set(spell(ev.pitch), ev.pitch);

	const bars = new Map<string, FigureBar>();
	for (const [key, q] of totals.byVowel) {
		const [spelling, vowel] = key.split(SEP);
		const pitch = pitchOf.get(spelling);
		if (!pitch) continue;
		const bar = bars.get(spelling) ?? { pitch, midi: pitchToMidi(pitch), quavers: 0, focusQuavers: 0 };
		const n = fractionToNumber(q);
		bar.quavers += n;
		if (vowel && focus.has(vowel)) bar.focusQuavers += n;
		bars.set(spelling, bar);
	}

	const bySlot = new Map<number, FigureBar[]>();
	for (const bar of bars.values()) {
		const d = diatonicOf(bar.pitch);
		bySlot.set(d, [...(bySlot.get(d) ?? []), bar]);
	}
	const slots = [...bySlot]
		.map(([diatonic, b]) => ({ diatonic, bars: b.sort((x, y) => x.midi - y.midi) }))
		.sort((a, b) => a.diatonic - b.diatonic);

	// The first longest wins a tie, lowest first, so the pick is deterministic.
	let longest: FigureBar | null = null;
	for (const slot of slots) for (const bar of slot.bars) if (!longest || bar.quavers > longest.quavers) longest = bar;
	if (!longest) return null;

	const pricing = secondsPerQuaver(score);
	const scale = pricing && pricing.tempo.provenance !== 'inferred' ? 'seconds' : 'quavers';
	const typed = profile.range ? { low: profile.range.lowest, high: profile.range.highest } : null;
	const shares = zones ? wholePercents([zones.below, zones.between, zones.above]) : null;

	return {
		/* DESK DEFAULT: with no typed range there is no singer to follow, so
		   the clef follows the piece's own compass by the same rule. */
		clef: typed ? chooseClefForSpan(typed.low, typed.high) : chooseClefForSpan(range.measured.low, range.measured.high),
		slots,
		compass: range.measured,
		longest: {
			pitch: longest.pitch,
			quavers: longest.quavers,
			share: longest.quavers / total,
			seconds: pricing ? pricing.price(longest.quavers) : null,
		},
		scale,
		marks: findings.map((f, i) => ({ n: i + 1, pitch: f.pitch })),
		focusVowels,
		quiet: findings.length === 0,
		range: typed,
		tessitura: tessitura.measured ? { low: tessitura.measured.low, high: tessitura.measured.high } : null,
		passaggio: profile.passaggio ? { primo: profile.passaggio.primo, secondo: profile.passaggio.secondo } : null,
		zones: shares && zones ? { below: shares[0], between: shares[1], above: shares[2] } : null,
	};
}

/**
 * Whole percentages that sum to 100, by largest remainder, so a bar of three
 * zones never reads 33, 33, 33. Shares that sum to zero give zeros.
 */
export function wholePercents(shares: readonly number[]): number[] {
	const sum = shares.reduce((a, b) => a + b, 0);
	if (sum <= 0) return shares.map(() => 0);
	const raw = shares.map((x) => (x / sum) * 100);
	const out = raw.map(Math.floor);
	let left = 100 - out.reduce((a, b) => a + b, 0);
	// Remainders are compared at 1e-9 so float noise cannot break a true tie;
	// a tie then goes to the earlier share, which keeps the result deterministic.
	const order = raw
		.map((r, i) => ({ i, rem: Math.round((r - Math.floor(r)) * 1e9) }))
		.sort((a, b) => b.rem - a.rem);
	for (const { i } of order) {
		if (left <= 0) break;
		out[i] += 1;
		left -= 1;
	}
	return out;
}

/**
 * Seconds as the page prints them: `2 min 40 s`, or `40 s` under a minute,
 * rounded to the whole second because every figure is "about". The spaces
 * are no-break so a figure never splits across a line.
 */
export function formatSeconds(seconds: number): string {
	const whole = Math.round(seconds);
	const m = Math.floor(whole / 60);
	const s = whole % 60;
	if (m === 0) return `${s}\u00a0s`;
	return s === 0 ? `${m}\u00a0min` : `${m}\u00a0min\u00a0${s}\u00a0s`;
}

const BEAT_GLYPH: Record<string, string> = {
	whole: '\u{1D15D}',
	half: '\u{1D15E}',
	quarter: '\u2669',
	eighth: '\u266A',
	'16th': '\u{1D161}',
};

/** The tempo as a metronome mark, `♩ = 72`, from the resolution's own beat. */
export function formatTempo(tempo: TempoResolution, language: 'en' | 'fr'): string {
	const glyph = (BEAT_GLYPH[tempo.beatUnit] ?? tempo.beatUnit) + (tempo.beatUnitDots > 0 ? '.'.repeat(tempo.beatUnitDots) : '');
	const bpm = new Intl.NumberFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 1 }).format(tempo.bpm);
	return `${glyph}\u00a0=\u00a0${bpm}`;
}

/** Build page one's model from seams that already exist. Pure and deterministic. */
export function buildInsights({ analysisScore, profile, watchList, vowelForEvent }: InsightsInputs): InsightsModel {
	const line = pitched(analysisScore);
	const range = rangeRow(line, profile);
	const crossings = crossingsRow(line, profile);
	const tessitura = tessituraRow(analysisScore, line, profile);
	const grouped = groupFindings(watchList, analysisScore);
	const phonation = phonationSection(analysisScore, profile, grouped, vowelForEvent);

	/* Option 2, "only as a complement to option 1's claims" (Dann, 2026-09-22):
	   a finding carries seconds at the tempo the section prints, and none
	   where the section prints none. */
	const pricing = secondsPerQuaver(analysisScore);
	const findings = pricing ? grouped.map((f) => ({ ...f, seconds: pricing.price(f.massQuavers) })) : grouped;

	return {
		range,
		crossings,
		tessitura,
		verdict: verdictOf(range, tessitura),
		findings,
		phonation,
		figure: phonation.nothingSung
			? null
			: tessituragram(analysisScore, profile, findings, tessitura, range, phonation.zones, vowelForEvent),
	};
}

/**
 * The lieder.net clause, in whichever language `footer.attribution` carries it:
 * the comma, the lead-in words, and the link, up to and not including the
 * period that closes the sentence.
 */
const LIEDER_CLAUSE = /, [^,<]*<a href="https:\/\/www\.lieder\.net"[^>]*>www\.lieder\.net<\/a>/g;

/**
 * Insights' copy of the attribution, the lieder.net clause struck.
 *
 * Ruled by Dann 2026-09-11: Insights' foot drops the clause and its siblings
 * are untouched. So the clause is struck HERE, from the one string the tree
 * already holds, rather than kept as a second copy of a two-kilobyte string
 * that could drift from the first. The rest of the sentence is untouched in
 * both languages, and the period that closed the clause now closes the one
 * before it, so no French is written.
 */
export function strikeLiederClause(attribution: string): string {
	return attribution.replace(LIEDER_CLAUSE, '');
}

/**
 * How many findings page one carries before the rest go to the earned page.
 * DESK DEFAULT, N.127 increment 1, and it is set by the worst case rather than
 * the usual one, because page one is fixed at one page (Dann, 2026-09-11).
 *
 * MEASURED on the engraved Sunless no. 1 with a stand-in voice, at letter,
 * with the compass's space reserved: three one-line findings end the
 * squircle at y 835.8 against a foot beginning at y 930.7, 95 px spare. A
 * two-line finding costs about 20 px more, the tessitura's two qualifiers
 * about 36, and the footnote that comes with a printed tessitura about 28, so
 * three findings can reach the foot and two cannot. Design R3 kept the same
 * budget the same way, by demoting whole findings to page 2.
 */
export const PAGE_ONE_FINDINGS = 2;
