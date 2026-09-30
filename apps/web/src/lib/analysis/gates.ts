/**
 * N.173, the gates: what the watch band says, and what it leaves to the staff.
 *
 * Source: `docs/sessions/draft-curation-rules_r1_2026-09-24.md`, "Revision r4
 * … THE GATES" (ruled 2026-09-28 16:28: ONE set of gates serves Markup's box
 * and Insights) as amended by "Revision r5" (Dann, 20:22 and 20:24): the box
 * is not a data dump; it points out what may need coaching and lets accurate
 * but unhelpful facts pass unsaid. Briefs:
 * `docs/sessions/brief-code-watch-band-says-less_r1_2026-09-28.md`,
 * `docs/sessions/brief-code-n173-gates-strict_r1_2026-09-28.md`.
 *
 * A place is said only if it passes every gate, in this order:
 *   1. The piece fits. If not, the box leads with the transposition, and no
 *      list of notes follows (curation rule 2, Dann's wording).
 *   2. There is something real to offer: a sourced thing to try, or a rare
 *      interaction worth noticing (rules 4 and 5). STRICT (r5): a place whose
 *      kind has no sourced advice in Ilya yet is not said.
 *   3. The stakes clear a threshold: the size of the demand for this singer
 *      times its musical weight (rule 7, the six demands of 2026-09-24 23:48).
 *      Weight ranks advice; it never earns a line on its own (r5).
 *   4. Patterns fold: the same vowel on the same pitch is one entry naming
 *      every bar (rule 6; Dann 2026-09-25 02:44).
 *   5. Silence is the default: nothing passes, nothing prints (rule 10).
 * r4's page limit is withdrawn (r5): no count per page or per song. A song
 * may carry none, or several on a page.
 * The survivors print in performance order (`PRODUCT.md`, "COMMENTS APPEAR IN
 * THE ORDER THE SINGER MEETS THEM": select by stakes, show in order).
 *
 * Pure and framework-free. Markup's box calls it today; Insights is to call
 * the same function (DESK DEFAULT: its findings are the same watch entries).
 *
 * Tags: SOURCED (a ruling or the draft), DESK DEFAULT (reversible, Dann's to
 * wave off), TRIAL (a starting value Dann judges by reading), NOT ESTABLISHED
 * (Ilya lacks the data).
 */

import {
	noteConditions,
	pitchToMidi,
	type AnalyzedScore,
	type NoteCondition,
	type ParsedScore,
	type VocalLineEvent,
	type VoiceProfileSnapshot,
} from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { isRare, watchEntryLine, WATCH_OPENERS, type WatchEntry, type WatchKind, type WatchList, type WatchOpener } from './watchlist';

// ── The numbers ──────────────────────────────────────────────────────

export const GATE_DEFAULTS = {
	/**
	 * The stakes threshold, RULED 2 by Dann 2026-09-28 20:32 (curation draft,
	 * Revision r5). Stakes = demands × (1 + weights). 1 is one demand on an
	 * unremarkable note, which the staff mark already carries. The first
	 * trial's 3 guarded against passaggio lines with nothing to try; strict
	 * gate 2 now removes those. At 2 an advised place speaks with two demands
	 * even where the music does not stress it, or with one demand where it does.
	 */
	stakesThreshold: 2,
	/**
	 * A leap, for the transition demand: a fifth, the value of Insights'
	 * `COMMENT_DEFAULTS.leapSemitones` (r1 §1.1, build default), so the two
	 * documents agree. Held here because `analysis/` may not import
	 * `insights/` (`scripts/ratchets.mjs`); change both together.
	 */
	leapSemitones: 7,
	/** DESK DEFAULT: the range-edge demand fires within this many semitones of the declared top or bottom. */
	rangeEdgeSemitones: 1,
};

export type GateDefaults = typeof GATE_DEFAULTS;

/**
 * The six demands (draft r3, Dann's "yes" of 2026-09-24 23:48). `dynamic` is
 * NOT ESTABLISHED: dynamics are not parsed, so it never fires and never lifts
 * a place's stakes (the conservative failure the brief asks for).
 */
export type Demand = 'register' | 'resonance' | 'rangeEdge' | 'endurance' | 'dynamic' | 'transition';

/** Musical weight (gate 3's list: climax, phrase top, final note, held note). */
export type Weight = 'climax' | 'phraseTop' | 'final' | 'held';

/** One place the box prints. */
export interface GatedEntry {
	/** The anchor: the highest-stakes instance of its pattern. */
	entry: WatchEntry;
	/** Every bar the entry names, in performance order, the anchor's included. */
	bars: string[];
	stakes: number;
	demands: Demand[];
	weights: Weight[];
}

export interface GateResult {
	/** Gate 1. False when any note lies outside the range the singer gave. */
	fits: boolean;
	/** What the box prints, in performance order. Empty: the box does not render. */
	shown: GatedEntry[];
	/** Gate 1 withheld these: the piece does not fit, so no list of notes follows. */
	notFit: WatchEntry[];
	/** Gate 2 dropped these: no sourced thing to try, and not rare. */
	noOffer: WatchEntry[];
	/** Gate 3 dropped these, with their stakes. */
	lowStakes: Array<{ entry: WatchEntry; stakes: number }>;
	/** Gate 4: instances folded into another entry's line. */
	folded: WatchEntry[];
}

export interface GateInput {
	watchList: WatchList;
	/** `noteConditions(...).notes` over the performance-order score the analysis read. */
	notes: readonly NoteCondition[];
	profile: VoiceProfileSnapshot;
	defaults?: GateDefaults;
}

// ── Demands and weight, per note ─────────────────────────────────────

const RESONANCE_KINDS: ReadonlySet<WatchKind> = new Set(['crossing', 'cover', 'tracking', 'turnover', 'sustain']);

function demandsOf(e: WatchEntry, n: NoteCondition | undefined, profile: VoiceProfileSnapshot, d: GateDefaults): Demand[] {
	const out: Demand[] = [];
	const has = (k: WatchKind) => e.kinds.includes(k);
	if (has('passaggio')) out.push('register');
	if (e.kinds.some((k) => RESONANCE_KINDS.has(k))) out.push('resonance');
	const range = profile.range;
	const nearEdge =
		n !== undefined &&
		range !== undefined &&
		(pitchToMidi(range.highest) - n.midi <= d.rangeEdgeSemitones || n.midi - pitchToMidi(range.lowest) <= d.rangeEdgeSemitones);
	if (has('range') || nearEdge) out.push('rangeEdge');
	if (n?.held) out.push('endurance');
	if (has('timbre') || (n !== undefined && leapsAcrossPassaggio(n, profile, d))) out.push('transition');
	return out;
}

/**
 * A leap whose two notes lie on either side of a declared passaggio edge
 * (draft r3, demand 6). A leap is `leapSemitones`, a fifth: the conditions'
 * `leap-up` band starts at a minor third, and near two edges a fourth apart
 * most thirds cross one, so that band put nearly every passaggio note here.
 */
function leapsAcrossPassaggio(n: NoteCondition, profile: VoiceProfileSnapshot, d: GateDefaults): boolean {
	const a = n.approach;
	if (!a || a.band === 'tie' || Math.abs(a.semitones) < d.leapSemitones || !profile.passaggio) return false;
	const from = n.midi - a.semitones;
	const lo = Math.min(from, n.midi);
	const hi = Math.max(from, n.midi);
	return [profile.passaggio.primo, profile.passaggio.secondo].some((p) => {
		const edge = pitchToMidi(p);
		return lo < edge && edge <= hi;
	});
}

/** Each note's musical weight, by event id. A repeated bar keeps its heaviest pass. */
function weightsById(notes: readonly NoteCondition[]): Map<string, { note: NoteCondition; weights: Weight[] }> {
	const top = Math.max(...notes.map((n) => n.midi));
	const phraseTop = new Map<number, number>();
	for (const n of notes) phraseTop.set(n.phrase.index, Math.max(phraseTop.get(n.phrase.index) ?? -Infinity, n.midi));
	// The final note is the last sung note, and every note tied into it.
	const finalIds = new Set<string>();
	for (let i = notes.length - 1; i >= 0; i--) {
		finalIds.add(notes[i].eventId);
		if (notes[i].approach?.band !== 'tie') break;
	}
	const out = new Map<string, { note: NoteCondition; weights: Weight[] }>();
	for (const n of notes) {
		const weights: Weight[] = [];
		if (n.midi === top) weights.push('climax');
		if (n.midi === phraseTop.get(n.phrase.index)) weights.push('phraseTop');
		if (finalIds.has(n.eventId)) weights.push('final');
		if (n.held) weights.push('held');
		const prev = out.get(n.eventId);
		if (!prev || weights.length > prev.weights.length) out.set(n.eventId, { note: n, weights });
	}
	return out;
}

// ── The gates ────────────────────────────────────────────────────────

/**
 * Gate 2, strict (r5): a sourced thing to try (`advice-resolver.ts`, today
 * the crossing and the three exposed hazards), or a kind rare in this score.
 * Nothing else: weight is not an offer, so a climax with no advice is unsaid.
 */
function hasOffer(e: WatchEntry, counts: Record<WatchKind, number>): boolean {
	return e.advice !== undefined || e.kinds.some((k) => isRare(k, counts));
}

/**
 * Gate 4's pattern: the headline, the vowel, the pitch, and the direction the
 * copy names. Not the word: the same vowel on the same pitch folds across
 * words, and a folded line names the vowel, not a word (`gatedLines`).
 */
function patternKey(e: WatchEntry, midi: number | undefined): string {
	return [e.kinds[0], e.vowel, midi ?? e.eventId, e.timbreDirection ?? ''].join('|');
}

function countEntries(entries: readonly WatchEntry[]): Record<WatchKind, number> {
	const c = { range: 0, crossing: 0, cover: 0, tracking: 0, turnover: 0, passaggio: 0, timbre: 0, sustain: 0 };
	for (const e of entries) for (const k of e.kinds) c[k]++;
	return c;
}

export function applyGates(input: GateInput): GateResult {
	const d = input.defaults ?? GATE_DEFAULTS;
	const entries = input.watchList.entries;
	const counts = input.watchList.kindCounts ?? countEntries(entries);
	const byId = weightsById(input.notes);
	const order = new Map(input.notes.map((n, i) => [n.eventId, i] as const));
	const severity = new Map(entries.map((e, i) => [e.eventId, i] as const));
	const result: GateResult = { fits: true, shown: [], notFit: [], noOffer: [], lowStakes: [], folded: [] };

	const gated = (e: WatchEntry): GatedEntry => {
		const n = byId.get(e.eventId);
		const demands = demandsOf(e, n?.note, input.profile, d);
		const weights = n?.weights ?? [];
		return { entry: e, bars: [e.bar], stakes: demands.length * (1 + weights.length), demands, weights };
	};

	// Gate 1. The watch list sorts range first, most acute first, so the lead
	// is its first range entry. Its line carries the transposition, when found.
	const range = entries.filter((e) => e.kinds.includes('range'));
	if (range.length > 0) {
		result.fits = false;
		// DESK DEFAULT: the lead names its own bar only; the range lines' verbs
		// are singular ("Bar {bar} rises"), and the offer is the key, not the bars.
		result.shown = [gated(range[0])];
		result.notFit = entries.filter((e) => e !== range[0]);
		return result;
	}

	// Gates 2 and 3.
	const passing: GatedEntry[] = [];
	for (const e of entries) {
		if (!hasOffer(e, counts)) {
			result.noOffer.push(e);
			continue;
		}
		const g = gated(e);
		if (g.stakes < d.stakesThreshold) result.lowStakes.push({ entry: e, stakes: g.stakes });
		else passing.push(g);
	}

	// Gate 4. The anchor is the highest-stakes instance; the watch list's own
	// order breaks a tie (it is already hardest first).
	const patterns = new Map<string, GatedEntry[]>();
	for (const g of passing) {
		const key = patternKey(g.entry, byId.get(g.entry.eventId)?.note.midi);
		patterns.set(key, [...(patterns.get(key) ?? []), g]);
	}
	const byStakes = (a: GatedEntry, b: GatedEntry) =>
		b.stakes - a.stakes || (severity.get(a.entry.eventId) ?? 0) - (severity.get(b.entry.eventId) ?? 0);
	const inOrder = (a: GatedEntry, b: GatedEntry) => (order.get(a.entry.eventId) ?? 0) - (order.get(b.entry.eventId) ?? 0);
	const folded: GatedEntry[] = [];
	for (const group of patterns.values()) {
		const anchor = [...group].sort(byStakes)[0];
		const bars = [...group].sort(inOrder).map((g) => g.entry.bar);
		folded.push({ ...anchor, bars: [...new Set(bars)] });
		result.folded.push(...group.filter((g) => g !== anchor).map((g) => g.entry));
	}

	// Gate 5 is the empty result itself.
	result.shown = folded.sort(inOrder);
	return result;
}

/**
 * The box's lines, in the order given. A folded entry names every bar: its
 * line is rendered at its anchor, then the singular lead every `watch.line.*`
 * template opens with (`watch.lead.one`) becomes the plural, the bars joined
 * by the language's own list ("3, 7, and 9"; « 3, 7 et 9 »). It drops the
 * word, since its bars may carry different words (gate 4).
 */
export function gatedLines(shown: readonly GatedEntry[], language: Language): string[] {
	const list = new Intl.ListFormat(language, { type: 'conjunction' });
	const render = (g: GatedEntry, opener: WatchOpener) => {
		if (g.bars.length < 2) return watchEntryLine(g.entry, language, opener);
		const line = watchEntryLine({ ...g.entry, word: undefined }, language, opener);
		const one = t('watch.lead.one', language).replace('{bar}', g.entry.bar);
		return line.startsWith(one) ? t('watch.lead.many', language).replace('{bars}', list.format(g.bars)) + line.slice(one.length) : line;
	};
	// No duplicate line (Dann's look, 2026-09-28), compared at one opener as
	// `watchBandLines` compares; then the openers rotate as they do there.
	const seen = new Set<string>();
	const unique = shown.filter((g) => {
		const key = render(g, 2);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	let k = 0;
	return unique.map((g) => render(g, g.entry.advice ? WATCH_OPENERS[k++ % WATCH_OPENERS.length] : 2));
}

/** What Markup's box (and, next, Insights) hands the gates: the analysis it already holds. */
export interface BandInput {
	watchList: WatchList;
	/** The performance-order score the analysis read. */
	analysisScore: ParsedScore;
	/** The notated score, which arbitrates each bar's sounding length (`noteConditions`). */
	readingScore?: ParsedScore;
	analyzed: AnalyzedScore;
	profile: VoiceProfileSnapshot;
	vowelForEvent: (event: VocalLineEvent) => string | undefined;
}

/** The gates over the analysis a document already holds, with the conditions computed as Insights computes them. */
export function gateBand(i: BandInput): GateResult {
	const notes = noteConditions(i.analysisScore, i.profile, i.analyzed.events, {
		vowelForEvent: i.vowelForEvent,
		...(i.readingScore ? { barsFrom: i.readingScore } : {}),
	}).notes;
	return applyGates({ watchList: i.watchList, notes, profile: i.profile });
}
