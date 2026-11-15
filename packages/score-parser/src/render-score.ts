/**
 * The render score (strophic lane A, brief r5, D3 and D4).
 *
 * MELODY prints a strophic song in the order it is sung, as one continuous line
 * of music. This module returns the `ParsedScore` MELODY paginates in place of
 * the notated one: its `measures` and `vocalLine` are in the order D3 prints
 * them, each later pass carrying its own verse's words (the verse view of
 * `verses.ts`) under derived ids.
 *
 * Pure. The input is never changed. With one sung verse, or when no later pass
 * is kept, the input is returned by reference (D3.3).
 *
 *  D3.1  repeat and jump marks: `unfold`, with the pass count taken from the
 *        verses, and a later run kept only where it carries its verse's words.
 *  D3.2  no kept pass but later verses: the span from the first to the last bar
 *        with a later verse's words prints once per verse; bars outside it print
 *        once (a one-line stretch after it prints once, after the last verse:
 *        RULED by Dann 2026-11-15 02:44).
 */
import type { GraceNote } from './grace';
import type { Measure, ParsedScore, SlurEnd, VocalLineEvent } from './types';
import { markersFromMeasures, unfold, type UnfoldFlag } from './unfold';
import { sungVerseNumbers, sungVersesByBar, verseView } from './verses';

/** One printed bar of the render score. */
export interface RenderBar {
	/** The notated measure index it is a copy of. */
	source: number;
	/** Its verse place: 1 for the first sung verse, k for the k-th. Outside bars and pass 1 are place 1. */
	place: number;
	/** True for a bar of a later pass: derived ids, no hit rectangles, a tag at a system start. */
	later: boolean;
	/** The verse place whose label stands above this bar (the first later bar of a later pass), where it is one. */
	label?: number;
	/** The id (as printed) of the bar's first event; absent for a bar with none (a tacet bar). The seam finds the bar's drawn position by it. */
	first?: string;
}

export interface RenderScore {
	/** The score to paginate. The input itself when `path` is `'notated'`. */
	score: ParsedScore;
	/** One entry per printed measure, by printed index. */
	bars: RenderBar[];
	/** The lyric number each place sings, by place minus 1. A single entry when nothing is kept. */
	verses: number[];
	path: 'notated' | 'repeats' | 'stacked';
	/** Printed indices where one pass ends and another (or an outside stretch) begins: a multibar rest never spans one (D7). */
	boundaries: ReadonlySet<number>;
	/** Why `unfold` gave no order, when it did not. */
	flags: UnfoldFlag[];
	/** Set when the lane declined to unfold because an event id in the file already contains `~v`. */
	declined?: 'id-shape';
}

/** The derived id of an event in verse place `k`. */
export const derivedId = (id: string, k: number): string => `${id}~v${k}`;

const notated = (parsed: ParsedScore, flags: UnfoldFlag[] = [], declined?: 'id-shape'): RenderScore => ({
	score: parsed,
	bars: parsed.measures.map((m) => ({ source: m.index, place: 1, later: false })),
	verses: [sungVerseNumbers(parsed)[0] ?? 1],
	path: 'notated',
	boundaries: new Set(),
	flags,
	...(declined ? { declined } : {}),
});

interface Printed {
	source: number;
	place: number;
	later: boolean;
	label?: number;
}
interface Plan {
	printed: Printed[];
	/** Source bars whose repeat markers this function carried out (stripped from the copies). */
	unfolded: Set<number>;
	/** True when an ending group was carried out: every `ending` is stripped. */
	stripEndings: boolean;
}

/** The repeat spans `unfold` will walk, found as it finds them (a closed span returns to the top). */
function repeatSpans(markers: ReturnType<typeof markersFromMeasures>): Array<{ start: number; end: number }> {
	const spans: Array<{ start: number; end: number }> = [];
	let start = 0;
	markers.forEach((m, i) => {
		if (m.startRepeat) start = i;
		if (m.endRepeat) {
			spans.push({ start, end: i });
			start = 0;
		}
	});
	return spans;
}

/** D3.1. Undefined when `unfold` gives no order or no later pass is kept. */
function planFromRepeats(parsed: ParsedScore, sung: number[], byBar: Map<number, Set<number>>): { plan?: Plan; flags: UnfoldFlag[] } {
	const markers = markersFromMeasures(parsed.measures);
	const hasEndings = markers.some((m) => m.endingPasses && m.endingPasses.length > 0);
	const hasForward = markers.some((m) => m.startRepeat);
	const spans = repeatSpans(markers);
	const wordsIn = (from: number, to: number, verse: number): boolean => {
		for (let b = from; b <= to; b++) if (byBar.get(b)?.has(verse)) return true;
		return false;
	};
	if (!hasEndings) {
		// The pass count comes from the verses: a backward repeat plays `times` (default 2) at least.
		for (const sp of spans) {
			const count = sung.filter((v) => wordsIn(sp.start, sp.end, v)).length;
			markers[sp.end].times = Math.max(markers[sp.end].times ?? 2, count);
		}
	} else if (!hasForward) {
		markers[0].startRepeat = true; // a repeat from the top with endings: bar 0 takes the forward repeat (unfold.ts:215)
	}
	const result = unfold(markers);
	if (!result.ok) return { flags: [result.flag] };
	const order = result.order;
	const printed: Printed[] = [];
	const seen = new Set<number>();
	const keptBars = new Set<number>();
	let anyKept = false;
	for (let i = 0; i < order.length; ) {
		const e = order[i];
		if (e.pass === 1) {
			printed.push({ source: e.source, place: 1, later: false });
			seen.add(e.source);
			i++;
			continue;
		}
		let j = i;
		while (j < order.length && order[j].pass === e.pass) j++;
		const run = order.slice(i, j);
		const verse = sung[e.pass - 1];
		const kept = verse !== undefined && run.some((r) => byBar.get(r.source)?.has(verse));
		let labelled = false;
		for (const r of run) {
			if (kept) {
				const later = seen.has(r.source) || parsed.measures[r.source].ending !== undefined;
				printed.push({ source: r.source, place: later ? e.pass : 1, later, ...(later && !labelled ? { label: e.pass } : {}) });
				if (later) labelled = true;
				keptBars.add(r.source);
			} else if (!seen.has(r.source)) {
				printed.push({ source: r.source, place: 1, later: false });
			}
			seen.add(r.source);
		}
		if (kept) anyKept = true;
		i = j;
	}
	if (!anyKept) return { flags: [] };
	const unfolded = new Set<number>();
	for (const sp of spans) {
		let touched = hasEndings;
		for (let b = sp.start; b <= sp.end && !touched; b++) if (keptBars.has(b)) touched = true;
		if (touched) {
			unfolded.add(sp.start);
			unfolded.add(sp.end);
		}
	}
	return { plan: { printed, unfolded, stripEndings: hasEndings }, flags: [] };
}

/** D3.2. The passage printed once per verse, the rest once. */
function planStacked(parsed: ParsedScore, sung: number[], byBar: Map<number, Set<number>>): Plan | undefined {
	const later = new Set(sung.slice(1));
	const bars = [...byBar.entries()].filter(([, set]) => [...set].some((v) => later.has(v))).map(([b]) => b);
	if (bars.length === 0) return undefined;
	const first = Math.min(...bars);
	const last = Math.max(...bars);
	const printed: Printed[] = [];
	for (let s = 0; s < first; s++) printed.push({ source: s, place: 1, later: false });
	for (let k = 1; k <= sung.length; k++) {
		let labelled = false;
		for (let s = first; s <= last; s++) {
			const ending = parsed.measures[s].ending;
			if (ending && !ending.passes.includes(k)) continue;
			printed.push({ source: s, place: k, later: k > 1, ...(k > 1 && !labelled ? { label: k } : {}) });
			if (k > 1) labelled = true;
		}
	}
	for (let s = last + 1; s < parsed.measures.length; s++) printed.push({ source: s, place: 1, later: false });
	return { printed, unfolded: new Set(), stripEndings: false };
}

export function renderScoreOf(parsed: ParsedScore): RenderScore {
	const sung = sungVerseNumbers(parsed);
	if (sung.length < 2 || parsed.measures.length === 0) return notated(parsed);
	if (parsed.vocalLine.some((e) => e.id.includes('~v'))) return notated(parsed, [], 'id-shape');
	const byBar = sungVersesByBar(parsed, new Set(sung));
	const fromRepeats = planFromRepeats(parsed, sung, byBar);
	let path: RenderScore['path'] = 'repeats';
	let plan = fromRepeats.plan;
	if (!plan) {
		plan = planStacked(parsed, sung, byBar);
		path = 'stacked';
	}
	if (!plan) return notated(parsed, fromRepeats.flags);
	return build(parsed, sung, plan, path, fromRepeats.flags);
}

function build(parsed: ParsedScore, sung: number[], plan: Plan, path: RenderScore['path'], flags: UnfoldFlag[]): RenderScore {
	const { printed } = plan;
	const places = Math.max(...printed.map((p) => p.place));
	const views = new Map<number, Map<number, VocalLineEvent[]>>();
	const eventsOf = (place: number, bar: number): VocalLineEvent[] => {
		let byBar = views.get(place);
		if (!byBar) {
			byBar = new Map();
			for (const ev of verseView(parsed, sung[place - 1]).vocalLine) {
				const bucket = byBar.get(ev.measureIndex);
				if (bucket) bucket.push(ev);
				else byBar.set(ev.measureIndex, [ev]);
			}
			views.set(place, byBar);
		}
		return byBar.get(bar) ?? [];
	};

	// The measures.
	const measures: Measure[] = printed.map((p, index) => {
		const m: Measure = { ...parsed.measures[p.source], index };
		if (plan.unfolded.has(p.source)) {
			if (parsed.measures[p.source].repeatStart) delete m.repeatStart;
			if (parsed.measures[p.source].repeatEnd) {
				delete m.repeatEnd;
				delete m.repeatTimes;
				delete m.repeatAfterJump;
			}
		}
		if (plan.stripEndings) delete m.ending;
		return m;
	});

	// The events, copied; partner pointers still name source ids.
	const flat: Array<{ ev: VocalLineEvent; srcId: string; bar: number }> = [];
	printed.forEach((p, bar) => {
		for (const ev of eventsOf(p.place, p.source)) {
			flat.push({ ev: { ...ev, id: p.later ? derivedId(ev.id, p.place) : ev.id, measureIndex: bar }, srcId: ev.id, bar });
		}
	});

	// Partner pointers (D4): a pointer survives only where the partner is printed in the contiguous run of source bars that
	// holds the event, and then it names that copy.
	const srcBarOf = new Map(parsed.vocalLine.map((e) => [e.id, e.measureIndex]));
	const srcNext = new Map<string, string>();
	parsed.vocalLine.forEach((e, i) => {
		const n = parsed.vocalLine[i + 1];
		if (n) srcNext.set(e.id, n.id);
	});
	const copyIn = new Map<number, Map<string, string>>(); // printed bar -> source id -> printed id
	for (const f of flat) {
		const m = copyIn.get(f.bar) ?? new Map<string, string>();
		m.set(f.srcId, f.ev.id);
		copyIn.set(f.bar, m);
	}
	const contiguous = (from: number, to: number): boolean => {
		for (let t = Math.min(from, to); t < Math.max(from, to); t++) {
			if (!printed[t + 1] || printed[t + 1].source !== printed[t].source + 1) return false;
		}
		return true;
	};
	const partnerCopy = (bar: number, partnerSrc: string): string | undefined => {
		const sp = srcBarOf.get(partnerSrc);
		if (sp === undefined) return undefined;
		const target = bar + (sp - printed[bar].source);
		if (target < 0 || target >= printed.length || printed[target].source !== sp) return undefined;
		if (!contiguous(bar, target)) return undefined;
		return copyIn.get(target)?.get(partnerSrc);
	};
	flat.forEach((f, idx) => {
		const ev = f.ev;
		if (ev.slurs) {
			ev.slurs = ev.slurs.map((end): SlurEnd => {
				if (!end.partnerEventId) return end;
				const { partnerEventId, ...rest } = end;
				const copy = partnerCopy(f.bar, partnerEventId);
				return copy ? { ...rest, partnerEventId: copy } : rest;
			});
		}
		const tie = ev.tied;
		if (!tie) return;
		if (tie.type === 'start' || tie.type === 'continue') {
			// A tie joins the next placed note (ties-and-slurs.ts, drawTies): keep it only when that note is its partner.
			const want = tie.partnerEventId ?? srcNext.get(f.srcId);
			const next = flat[idx + 1];
			if (next && next.srcId === want && next.ev.type === 'note') {
				ev.tied = { ...tie, ...(tie.partnerEventId ? { partnerEventId: next.ev.id } : {}) };
			} else if (tie.type === 'start') {
				delete ev.tied;
			} else {
				ev.tied = { type: 'stop', ...(tie.partnerEventId && partnerCopy(f.bar, tie.partnerEventId) ? { partnerEventId: partnerCopy(f.bar, tie.partnerEventId) } : {}) };
			}
		} else if (tie.partnerEventId) {
			const copy = partnerCopy(f.bar, tie.partnerEventId);
			const { partnerEventId: _drop, ...rest } = tie;
			void _drop;
			ev.tied = copy ? { ...rest, partnerEventId: copy } : rest;
		}
	});

	// Lists keyed by bar: one entry per printed copy of the source bar.
	const bySource = new Map<number, number[]>();
	printed.forEach((p, i) => bySource.set(p.source, [...(bySource.get(p.source) ?? []), i]));
	const remap = <T extends { measureIndex: number }>(list: T[] | undefined): T[] | undefined =>
		list &&
		list
			.flatMap((entry) => (bySource.get(entry.measureIndex) ?? []).map((i) => ({ ...entry, measureIndex: i })))
			.sort((a, b) => a.measureIndex - b.measureIndex);

	// Grace notes ride with their principal's copy.
	let graceNotes: GraceNote[] | undefined;
	if (parsed.graceNotes) {
		const byPrincipal = new Map<string, GraceNote[]>();
		for (const g of parsed.graceNotes) byPrincipal.set(g.principalId, [...(byPrincipal.get(g.principalId) ?? []), g]);
		graceNotes = [];
		for (const f of flat) {
			for (const g of byPrincipal.get(f.srcId) ?? []) {
				graceNotes.push(f.ev.id === f.srcId ? g : { ...g, id: f.ev.id + g.id.slice(f.srcId.length), principalId: f.ev.id });
			}
		}
	}

	const score: ParsedScore = {
		...parsed,
		measures,
		vocalLine: flat.map((f) => f.ev),
		keySignatures: remap(parsed.keySignatures) ?? [],
		timeSignatures: remap(parsed.timeSignatures) ?? [],
		tempoMarkings: remap(parsed.tempoMarkings) ?? [],
		...(parsed.clefs ? { clefs: remap(parsed.clefs) ?? [] } : {}),
		...(parsed.tempoWords ? { tempoWords: remap(parsed.tempoWords) ?? [] } : {}),
		...(parsed.metricModulations ? { metricModulations: remap(parsed.metricModulations) ?? [] } : {}),
		...(graceNotes ? { graceNotes } : {}),
	};
	delete score.accompaniment; // not drawn by MELODY, and keyed by notated bars

	const firstOf = new Map<number, string>();
	for (const f of flat) if (!firstOf.has(f.bar)) firstOf.set(f.bar, f.ev.id);
	const boundaries = new Set<number>();
	printed.forEach((p, i) => {
		const before = printed[i - 1];
		if (before && (p.source !== before.source + 1 || p.place !== before.place || p.later !== before.later)) boundaries.add(i);
	});
	return {
		score,
		bars: printed.map((p, i) => ({ source: p.source, place: p.place, later: p.later, ...(p.label ? { label: p.label } : {}), ...(firstOf.has(i) ? { first: firstOf.get(i) } : {}) })),
		verses: sung.slice(0, places),
		path,
		boundaries,
		flags,
	};
}
