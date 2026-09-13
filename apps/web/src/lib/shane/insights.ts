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
	pachecoTessitura,
	pitchToMidi,
	soundingFromNotation,
	fractionToNumber,
	type ParsedScore,
	type Pitch,
	type TessituraBasis,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
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
}

export interface InsightsModel {
	range: RangeRow;
	crossings: CrossingsRow;
	tessitura: TessituraRow;
	verdict: Verdict;
	/** Heaviest first. Empty is a finding: nothing fired. */
	findings: Finding[];
}

export interface InsightsInputs {
	/** The performance-order score the analysis read (`scoreInPerformanceOrder(...).score`). */
	analysisScore: ParsedScore;
	/** The singer's snapshot, from `buildVoiceProfileSnapshot`. */
	profile: VoiceProfileSnapshot;
	/** The watch list built over the same analysis, or null when none was built. */
	watchList: WatchList | null;
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

/** Build page one's model from seams that already exist. Pure and deterministic. */
export function buildInsights({ analysisScore, profile, watchList }: InsightsInputs): InsightsModel {
	const line = pitched(analysisScore);
	const range = rangeRow(line, profile);
	const crossings = crossingsRow(line, profile);
	const tessitura = tessituraRow(analysisScore, line, profile);
	return {
		range,
		crossings,
		tessitura,
		verdict: verdictOf(range, tessitura),
		findings: groupFindings(watchList, analysisScore),
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
