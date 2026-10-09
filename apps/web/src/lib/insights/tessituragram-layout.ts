/**
 * tessituragram-layout.ts — where everything in the tessituragram goes.
 *
 * Moved out of `Tessituragram.svelte` (QUEUE row 42, the tessituragram refined,
 * `brief-code-tessituragram-refined_r1_2026-10-07.md`) so that "no label touches
 * a line, a bar, or another label" can be asserted in a test rather than
 * looked at. Pure: text is measured by a function the caller supplies (a canvas
 * in the app, a stand-in in a test), and the music font's glyph sizes arrive
 * the same way.
 *
 * THE 2026-10-09 REARRANGEMENT (Dann's walk, `OPEN.md` "THE INSIGHTS PAGE,
 * REARRANGED"). This figure no longer carries the compass: its two notes, its
 * barline, and the left columns of letter names are gone, and the compass is its
 * own small stave in the page's corner (`compass-stave.ts`). What is left is the
 * histogram over a quiet grey stave with its clef, and each bar carries one
 * label, its own pitch, beside it. This departs from Design's drawing 1 (QUEUE
 * row 42) on that ruling.
 *
 * The drawing it builds is Design's drawing 1
 * (`design-tessituragram-refined_r1_2026-10-07.html`; the notes beside it are
 * the source of every constant marked JUDGEMENT). Units are CSS px at letter
 * size: the figure is 570 wide and the viewBox is 570 wide.
 *
 * NO HALOS. A label finds a clear place instead. Where it cannot sit beside its
 * element, a hairline leader joins them (Ruling 2). The leader is the fallback
 * of `placeLabel`, tried only when every near place is taken.
 */
import { pitchToMidi, smuflFontSizePx, spToPx } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { withoutItalics } from '$lib/italics';
import { pitchLabel } from '$lib/voice/note-picker';
import { formatSeconds, type FigureRow, type TessituragramModel } from './insights';

/** Width in px of `text` at `size` px and `weight`. */
export type Measure = (text: string, size: number, weight: number) => number;
/** A music-font glyph's box in staff spaces, y up from the baseline; null before the font arrives. */
export type GlyphBox = { widthSp: number; top: number; bottom: number };
export type GlyphOf = (name: string) => GlyphBox | null;

export interface Box {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

// ── Constants. JUDGEMENT throughout (Design's notes, "For the code") ──────
export const W = 570;
export const RIGHT = W - 2;
const CLEF_X = 4;
const LABEL = 10;
const TITLE = 9.5;
const BASE_STEP = 11;
const BAR = 6;
const THIN = 4.5;
const MIN_GAP = 1;
/** The longest a bar may draw. 196 until the left name columns went (2026-10-09); their width went to the bars. */
const BAR_CAP = 320;
const BAR_FLOOR = 60;
/** Text boxes: ascent and descent as shares of the size, Source Sans 3's. */
const ASC = 0.74;
const DESC = 0.25;
const LINE_H = 12.5;
/** The fan between a cluster's longest bar and its label column: a straight run, then the slope in. */
const FAN = 26;
const TITLE_BASELINE = 12;
/** Where the first piece of content below the title starts. */
const CONTENT_TOP = 20;

const WHITE: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
const pc = (midi: number) => ((midi % 12) + 12) % 12;
const isWhite = (midi: number) => WHITE[pc(midi)] !== undefined;
const whiteStep = (midi: number) => (Math.floor(midi / 12) - 1) * 7 + WHITE[pc(midi)];
const upperStep = (midi: number) => whiteStep(isWhite(midi) ? midi : midi + 1);
const lowerStep = (midi: number) => whiteStep(isWhite(midi) ? midi : midi - 1);
/**
 * Positions as near as possible to `want` (ascending) yet at least `gap` apart,
 * in the same order: the least-squares fit, by pooling adjacent violators on
 * `want[i] - i * gap`. Pure.
 */
export function spreadApart(want: number[], gap: number): number[] {
	const blocks: Array<{ sum: number; n: number }> = [];
	want.forEach((w, i) => {
		blocks.push({ sum: w - i * gap, n: 1 });
		while (blocks.length > 1 && blocks[blocks.length - 2].sum / blocks[blocks.length - 2].n > blocks[blocks.length - 1].sum / blocks[blocks.length - 1].n) {
			const b = blocks.pop()!;
			blocks[blocks.length - 1].sum += b.sum;
			blocks[blocks.length - 1].n += b.n;
		}
	});
	const out: number[] = [];
	for (const b of blocks) for (let k = 0; k < b.n; k++) out.push(b.sum / b.n + out.length * gap);
	return out;
}

/**
 * The spelling that names a row: the one with more sung time; on a tie, the
 * less altered, then the lower letter. A row built without per-spelling times
 * treats them as equal.
 */
export function spellingOf(r: FigureRow): FigureRow['spellings'][number] {
	const w = (i: number) => r.spellingQuavers?.[i] ?? 0;
	let best = 0;
	for (let i = 1; i < r.spellings.length; i++) {
		const a = r.spellings[i];
		const b = r.spellings[best];
		if (w(i) > w(best) || (w(i) === w(best) && Math.abs(a.alter ?? 0) < Math.abs(b.alter ?? 0))) best = i;
	}
	return r.spellings[best];
}

/**
 * Positions as near as possible to `want` (ascending) yet each at least
 * `gaps[i]` above the one before it, in the same order: `spreadApart` for
 * labels of different heights. The same least-squares fit, by pooling adjacent
 * violators on `want[i]` less the gaps summed before it. Pure.
 */
export function spreadByGaps(want: number[], gaps: number[]): number[] {
	const offset: number[] = [];
	let acc = 0;
	want.forEach((_, i) => {
		offset.push(acc);
		acc += gaps[i] ?? 0;
	});
	const blocks: Array<{ sum: number; n: number }> = [];
	want.forEach((w, i) => {
		blocks.push({ sum: w - offset[i], n: 1 });
		while (blocks.length > 1 && blocks[blocks.length - 2].sum / blocks[blocks.length - 2].n > blocks[blocks.length - 1].sum / blocks[blocks.length - 1].n) {
			const b = blocks.pop()!;
			blocks[blocks.length - 1].sum += b.sum;
			blocks[blocks.length - 1].n += b.n;
		}
	});
	const out: number[] = [];
	for (const b of blocks) for (let k = 0; k < b.n; k++) out.push(b.sum / b.n + offset[out.length]);
	return out;
}

/**
 * WHICH BAR LABELS STAND TOGETHER IN A COLUMN. Rows a semitone apart sit 5.5 px
 * apart and a label is about 10 px tall, so a run of them cannot each stand at its
 * own bar's end. The labels are spread to at least a label's height apart, as
 * near their rows as that allows, and a run that had to move is a CLUSTER: its
 * labels stand in one column past the longest bar the run touches, and a hairline
 * joins each to its own bar. A bar no neighbour crowds is no cluster, and its label
 * stands at its end. This depends on the rows' places and the labels' line counts
 * only, never on a bar's length or a language, so the bar scale can reserve the
 * room before the bars are drawn. Pure.
 */
export interface ClusterPlan {
	/** Each label's centre line after spreading, by row. */
	centre: Map<number, number>;
	/** The rows of each cluster, and the other rows whose bars stand beside its labels. */
	clusters: Array<{ members: number[]; blockers: number[] }>;
}

export function planLabelClusters(items: Array<{ midi: number; cy: number; lines: number; barHalf: number }>): ClusterPlan {
	const sorted = [...items].sort((a, b) => a.cy - b.cy);
	const h = (n: number) => (n - 1) * LINE_H + (ASC + DESC) * LABEL;
	const gaps = sorted.map((it, i) => (i + 1 < sorted.length ? (h(it.lines) + h(sorted[i + 1].lines)) / 2 + 0.75 : 0));
	const placed = spreadByGaps(sorted.map((it) => it.cy), gaps);
	const centre = new Map<number, number>();
	sorted.forEach((it, i) => centre.set(it.midi, placed[i]));
	const clusters: ClusterPlan['clusters'] = [];
	let run: number[] = [0];
	const close = () => {
		if (run.length > 1) {
			const members = run.map((i) => sorted[i].midi);
			const blockers: number[] = [];
			for (const j of sorted) {
				if (members.includes(j.midi)) continue;
				const beside = run.some((i) => {
					const half = h(sorted[i].lines) / 2 + 0.75;
					return Math.abs(j.cy - placed[i]) < half + j.barHalf;
				});
				if (beside) blockers.push(j.midi);
			}
			clusters.push({ members, blockers });
		}
	};
	for (let i = 1; i < sorted.length; i++) {
		if (placed[i] - placed[i - 1] <= gaps[i - 1] + 0.01) run.push(i);
		else {
			close();
			run = [i];
		}
	}
	close();
	return { centre, clusters };
}

export const STAVE_LINES: Record<'treble' | 'bass', number[]> = {
	bass: [18, 20, 22, 24, 26], // G2 B2 D3 F3 A3
	treble: [30, 32, 34, 36, 38], // E4 G4 B4 D5 F5
};
const fill = (s: string, vars: Record<string, string | number>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

// ── What the layout returns ───────────────────────────────────────────
export type TextKind =
	| 'title'
	| 'barLabel'
	| 'passaggio'
	| 'share'
	| 'tessitura'
	| 'half'
	| 'centre'
	| 'key';

export interface TextItem {
	kind: TextKind;
	/** The words as drawn; a bar label's IPA is bracketed, a passaggio's or key's italics are asterisked. */
	text: string;
	x: number;
	y: number;
	anchor: 'start' | 'middle' | 'end';
	size: number;
	weight: number;
	fill: string;
	box: Box;
}

export interface Seg {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	stroke: string;
	opacity?: number;
	dash?: string;
	width: number;
}

export interface DrawnRow extends FigureRow {
	cy: number;
	height: number;
	length: number;
	dark: boolean;
}

export interface KeyMark {
	kind: 'tessitura' | 'passaggi' | 'ledger';
	x: number;
	y: number;
}

export interface Layout {
	height: number;
	/** Everything but the title is drawn translated down by this much. */
	dy: number;
	barX: number;
	barMax: number;
	rows: DrawnRow[];
	staveYs: number[];
	ledgerYs: number[];
	band: { x: number; y: number; width: number; height: number } | null;
	tessBracket: Seg[];
	/** The stave behind the bars (from the clef to the band's end) and the ledger lines under them, broken around every label. */
	faint: Seg[];
	passLines: Seg[];
	halfBracket: Seg[];
	leaders: Seg[];
	texts: TextItem[];
	/** The clef's left edge and its anchor line's y; null before the music font arrives. */
	clef: { x: number; y: number } | null;
	keyMarks: KeyMark[];
	/** Labels no near place could take and no slot could take: a contact the layout could not avoid. */
	unplaced: string[];
	/** Bar-scale reasoning, for the report: the longest bar's length in each language. */
	barMaxByLanguage: Record<Language, number>;
	glyphPx: number;
	lineGap: number;
}

// ── Boxes ───────────────────────────────────────────────────────────
const boxOf = (x: number, baseline: number, w: number, size: number, anchor: 'start' | 'middle' | 'end', lines = 1): Box => {
	const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
	return { x0, x1: x0 + w, y0: baseline - (lines - 1) * LINE_H - ASC * size, y1: baseline + DESC * size };
};
const hit = (a: Box, b: Box, pad = 0) => a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;
const segBox = (s: Seg): Box => ({
	x0: Math.min(s.x1, s.x2) - s.width / 2,
	x1: Math.max(s.x1, s.x2) + s.width / 2,
	y0: Math.min(s.y1, s.y2) - s.width / 2,
	y1: Math.max(s.y1, s.y2) + s.width / 2,
});

/**
 * The first candidate box that touches no obstacle. Null when every candidate is taken.
 * `bounds` keeps a label inside the figure.
 */
export function firstClear<C extends { box: Box }>(candidates: C[], obstacles: Box[], pad = 0.75): C | null {
	for (const c of candidates) {
		if (c.box.x0 < 0 || c.box.x1 > W) continue;
		if (!obstacles.some((o) => hit(c.box, o, pad))) return c;
	}
	return null;
}

/**
 * The fallback: a free slot near `anchor`, joined to it by a short hairline.
 * Slots are tried nearest first; a slot's leader must itself cross nothing.
 * Design's first fallback ran parallel to the bracket and read as a second
 * bracket, so the leader runs at an angle: the slot is always offset sideways.
 */
export function slotWithLeader(
	anchor: { x: number; y: number },
	w: number,
	size: number,
	obstacles: Box[],
	pad = 0.75,
	/** What the leader itself must not cross; the label's obstacles, unless told otherwise. */
	crossing: Box[] = obstacles,
): { x: number; baseline: number; box: Box; leader: { x1: number; y1: number; x2: number; y2: number } } | null {
	const cands: Array<{ dx: number; dy: number; d: number }> = [];
	for (let dx = 14; dx <= 260; dx += 6) for (let dy = -120; dy <= 120; dy += 3) if (Math.abs(dy) >= 8) cands.push({ dx, dy, d: Math.hypot(dx, dy) });
	cands.sort((a, b) => a.d - b.d);
	for (const c of cands) {
		const x = anchor.x + c.dx;
		const baseline = anchor.y + c.dy + 0.33 * size;
		const box = boxOf(x, baseline, w, size, 'start');
		if (box.x1 > W || box.x0 < 0 || box.y0 < -200) continue;
		if (obstacles.some((o) => hit(box, o, pad))) continue;
		const leader = { x1: anchor.x, y1: anchor.y, x2: x - 3, y2: anchor.y + c.dy };
		let clear = true;
		const steps = Math.ceil(Math.hypot(leader.x2 - leader.x1, leader.y2 - leader.y1) / 1.5);
		for (let i = 1; i < steps && clear; i++) {
			const p = { x: leader.x1 + ((leader.x2 - leader.x1) * i) / steps, y: leader.y1 + ((leader.y2 - leader.y1) * i) / steps };
			if (crossing.some((o) => p.x >= o.x0 && p.x <= o.x1 && p.y >= o.y0 && p.y <= o.y1)) clear = false;
		}
		if (clear) return { x, baseline, box, leader };
	}
	return null;
}

// ── The bar labels, per language ────────────────────────────────────
/**
 * ONE LABEL A BAR, ITS OWN PITCH (Dann, 2026-10-09, `OPEN.md` "THE INSIGHTS
 * PAGE, REARRANGED", ruling 3). The label's first line begins with the pitch's
 * name, spelled the way the row's more-sung spelling is. A dark bar's findings
 * and the longest bar's value follow on the same label, joined by " · ", as the
 * list under the figure names them; a bar with several findings continues them
 * on further lines of the one label.
 */
function barLabels(figure: TessituragramModel, language: Language): Map<number, { dark: boolean; lines: string[] }> {
	const T = (key: string) => t(key, language);
	const longestText = (() => {
		const s = figure.longest.seconds;
		if (figure.scale === 'seconds' && s?.kind === 'point') return formatSeconds(s.seconds);
		if (s?.kind === 'range') return fill(T('insights.fit.span'), { low: formatSeconds(s.low), high: formatSeconds(s.high) });
		return fill(T('insights.phonation.share'), { n: Math.round(figure.longest.share * 100) });
	})();
	const out = new Map<number, { dark: boolean; lines: string[] }>();
	for (const row of figure.rows) {
		const dark = !figure.quiet && row.tags.length > 0;
		const lines = dark ? row.tags.map((tag) => `${T('loupe.measureTagShort').replace('%m', tag.measure)} · [${tag.vowel}]`) : [];
		if (row.midi === figure.longest.midi) {
			if (lines.length > 0) lines[0] = `${lines[0]} · ${longestText}`;
			else lines.push(longestText);
		}
		const name = pitchLabel(spellingOf(row));
		if (lines.length > 0) lines[0] = `${name} · ${lines[0]}`;
		else lines.push(name);
		out.set(row.midi, { dark, lines });
	}
	return out;
}

/** What the figure's text needs, as widths, in one language. */
function columnWidths(figure: TessituragramModel, language: Language, measure: Measure) {
	const T = (key: string) => t(key, language);
	const share = (n: number) => fill(T('insights.phonation.share'), { n });
	const z = figure.zones;
	const passaggiWords = figure.passaggio && z ? [T('insights.figure.primo'), T('insights.figure.secondo')].map(withoutItalics) : [];
	const shares =
		figure.passaggio && z
			? [
					fill(T('insights.figure.zoneAbove'), { share: share(z.above) }),
					fill(T('insights.figure.zoneBetween'), { share: share(z.between) }),
					fill(T('insights.figure.zoneBelow'), { share: share(z.below) }),
				]
			: [];
	const rightCol = Math.max(0, ...shares.map((s) => measure(s, LABEL, 600)), ...passaggiWords.map((s) => measure(s, LABEL, 500)));
	const centreText = figure.centre ? `${T('insights.figure.centre')} ${pitchLabel(figure.centre.pitch)}` : '';
	return {
		rightCol,
		centreW: centreText ? measure(centreText, LABEL, 500) : 0,
	};
}

// ── The layout ──────────────────────────────────────────────────────
export interface LayoutOptions {
	/** A test seam: boxes the bracket's labels must also avoid, to force the leader. */
	extraObstacles?: Box[];
}

export function layoutTessituragram(figure: TessituragramModel, language: Language, measure: Measure, glyph: GlyphOf, options: LayoutOptions = {}): Layout {
	const T = (key: string) => t(key, language);
	const rowsIn = figure.rows;

	// STAVE STEP. A bar is 6 px; beside a sung neighbour half a step away both
	// draw 4.5 px. Rows closer than a thin bar plus a 1 px gap cannot be told
	// apart, so where such a pair is sung the step grows until half a step clears it.
	const sung = new Set(rowsIn.map((r) => r.midi));
	const tight = (midi: number) => [midi - 1, midi + 1].some((n) => sung.has(n) && (!isWhite(n) || !isWhite(midi)));
	const STEP = rowsIn.some((r) => tight(r.midi)) ? Math.max(BASE_STEP, 2 * (THIN + MIN_GAP)) : BASE_STEP;
	const LINE_GAP = STEP * 2;
	const sp = (n: number) => spToPx(n, LINE_GAP);

	const lines = STAVE_LINES[figure.clef];
	const bottomLine = lines[0];
	const topLine = lines[4];
	/* THE COMPASS IS NOT DRAWN HERE any more: it is its own small stave in the page's
	   corner (`compass-stave.ts`). This figure's stave is a quiet background, so each
	   bar's height says its pitch, and its extent is the stave's and the bars'. */
	const ups = [topLine, ...rowsIn.map((r) => upperStep(r.midi))];
	const downs = [bottomLine, ...rowsIn.map((r) => lowerStep(r.midi))];
	if (figure.tessitura) {
		ups.push(upperStep(pitchToMidi(figure.tessitura.high)));
		downs.push(lowerStep(pitchToMidi(figure.tessitura.low)));
	}
	if (figure.passaggio && figure.zones) {
		ups.push(upperStep(pitchToMidi(figure.passaggio.secondo)) + 1);
		downs.push(lowerStep(pitchToMidi(figure.passaggio.primo)) - 1);
	}
	const extent = { top: Math.max(...ups) + 1, bottom: Math.min(...downs) - 1 };
	/* Raw y: zero at the extent's top; `dy` moves the whole figure once its contents are known. */
	const y = (d: number) => (extent.top - d) * STEP;
	const rowY = (midi: number) => (isWhite(midi) ? y(whiteStep(midi)) : (y(whiteStep(midi - 1)) + y(whiteStep(midi + 1))) / 2);

	const hi = Math.max(...rowsIn.map((r) => upperStep(r.midi)));
	const lo = Math.min(...rowsIn.map((r) => lowerStep(r.midi)));
	const ledgerSteps: number[] = [];
	for (let l = topLine + 2; l <= hi; l += 2) ledgerSteps.push(l);
	for (let l = bottomLine - 2; l >= lo; l -= 2) ledgerSteps.push(l);

	// ── The clef, at the stave's left, and what stands between it and the bars ──
	const clefName = figure.clef === 'bass' ? 'fClef' : 'gClef';
	const clefG = glyph(clefName);
	/* Before the music font arrives the clef's width is a stand-in, so the bars do not jump when it does. */
	const clefRight = CLEF_X + (clefG ? sp(clefG.widthSp) : sp(2.7));
	/* "tessitura" is the wider of the two languages' words, so the columns hold still across them. */
	const tessW = figure.tessitura ? Math.max(...(['en', 'fr'] as const).map((l) => measure(t('insights.figure.tessitura', l), LABEL, 500))) : 0;
	const tessBx = clefRight + 8;
	const barX = figure.tessitura ? tessBx + 15 + tessW + 8 : clefRight + 12;

	// ── One bar scale for both languages ──
	/* Design found the French right-hand column shortens the longest bar (152 px
	   against 137). The length comes from the tighter language, so an English
	   page and a French one draw the same bars.

	   A label that has a sung semitone neighbour may have to stand beyond that
	   neighbour's own label, so a run of semitone neighbours keeps its labels in
	   a column past its longest bar (`planLabelClusters`), and every bar the column
	   stands beside reserves the room for it. */
	const maxFrac = (r: FigureRow) => r.quavers / figure.longest.quavers;
	const bandRows = figure.halfMass ? rowsIn.filter((r) => r.midi >= figure.halfMass!.low && r.midi <= figure.halfMass!.high) : [];
	const labelWidth = (info: { dark: boolean; lines: string[] }) => Math.max(...info.lines.map((l) => measure(l, LABEL, info.dark ? 600 : 500)));
	const plan = planLabelClusters(
		rowsIn.map((r) => ({ midi: r.midi, cy: rowY(r.midi), lines: barLabels(figure, 'en').get(r.midi)!.lines.length, barHalf: (tight(r.midi) ? THIN : BAR) / 2 })),
	);
	const barMaxFor = (lang: Language): number => {
		const cw = columnWidths(figure, lang, measure);
		const labels = barLabels(figure, lang);
		const colLeft = RIGHT - cw.rightCol - (cw.rightCol ? 4 : 0);
		const spineMax = colLeft - (figure.centre ? 9 + cw.centreW : 6) + (cw.rightCol ? 4 : 0);
		/* A bar whose label stands in a column reserves the fan and the column's widest label. */
		const reserve = new Map<number, number>();
		for (const c of plan.clusters) {
			const widest = Math.max(...c.members.map((m) => labelWidth(labels.get(m)!)));
			for (const m of [...c.members, ...c.blockers]) reserve.set(m, FAN + widest);
		}
		let m = BAR_CAP;
		for (const r of rowsIn) {
			const info = labels.get(r.midi)!;
			const lw = reserve.get(r.midi) ?? 4 + labelWidth(info);
			const inBand = bandRows.includes(r);
			const limit = inBand && figure.halfMass ? spineMax - 10 : colLeft - 6;
			m = Math.min(m, (limit - barX - lw) / Math.max(maxFrac(r), 1e-9));
		}
		return Math.max(BAR_FLOOR, m);
	};
	const barMaxByLanguage = { en: barMaxFor('en'), fr: barMaxFor('fr') } as Record<Language, number>;
	const barMax = Math.min(barMaxByLanguage.en, barMaxByLanguage.fr);
	const bandEnd = barX + barMax + 4;

	// ── Rows ──
	const labelInfo = barLabels(figure, language);
	const rows: DrawnRow[] = rowsIn.map((r) => ({
		...r,
		cy: rowY(r.midi),
		height: tight(r.midi) ? THIN : BAR,
		length: maxFrac(r) * barMax,
		dark: labelInfo.get(r.midi)!.dark,
	}));
	const rowBoxes: Box[] = rows.map((r) => ({ x0: barX, x1: barX + r.length, y0: r.cy - r.height / 2, y1: r.cy + r.height / 2 }));

	const texts: TextItem[] = [];
	const addText = (item: Omit<TextItem, 'box'>, w: number, lines = 1): TextItem => {
		const full = { ...item, box: boxOf(item.x, item.y, w, item.size, item.anchor, lines) };
		texts.push(full);
		return full;
	};
	const TERTIARY = 'var(--ink-tertiary)';
	const INK = 'var(--rose-ink)';
	const leaders: Seg[] = [];
	const unplaced: string[] = [];

	/* EVERY BAR HAS ONE LABEL, ITS OWN PITCH, BESIDE THE BAR. A bar no semitone
	   neighbour crowds has its label at its end. A run of semitone neighbours
	   (rows 5.5 px apart under labels 10 px tall) has its labels spread to a label's
	   height apart, in one column that starts past the run's longest bar, and each
	   bar is joined to its label by a hairline: along its own row to the fan, then
	   in. The labels keep their order, so the hairlines never cross (see
	   `planLabelClusters`). */
	const cwHere = columnWidths(figure, language, measure);
	const colLeftPx = RIGHT - cwHere.rightCol - (cwHere.rightCol ? 4 : 0);
	const barLabelItems: TextItem[] = [];
	const labelsByRow = new Map<number, TextItem[]>();
	const rowOf = new Map(rows.map((r) => [r.midi, r]));
	const clusterOf = new Map<number, ClusterPlan['clusters'][number]>();
	for (const c of plan.clusters) for (const m of c.members) clusterOf.set(m, c);
	const columnX = new Map<ClusterPlan['clusters'][number], number>();
	for (const c of plan.clusters) {
		const tips = [...c.members, ...c.blockers].map((m) => barX + rowOf.get(m)!.length);
		columnX.set(c, Math.max(...tips) + FAN);
	}
	for (const r of rows) {
		const info = labelInfo.get(r.midi)!;
		const n = info.lines.length;
		const weight = r.dark ? 600 : 500;
		const w = labelWidth(info);
		const tipX = barX + r.length;
		const cluster = clusterOf.get(r.midi);
		const centre = plan.centre.get(r.midi)!;
		const x = cluster ? columnX.get(cluster)! : tipX + 4;
		const lineY = (i: number) => centre + 3.3 + (i - (n - 1) / 2) * LINE_H;
		if (x + w > colLeftPx - 2) unplaced.push(`bar ${r.midi}`);
		info.lines.forEach((line, i) => {
			const item = addText({ kind: 'barLabel', text: line, x, y: lineY(i), anchor: 'start', size: LABEL, weight, fill: INK }, measure(line, LABEL, weight));
			barLabelItems.push(item);
			labelsByRow.set(r.midi, [...(labelsByRow.get(r.midi) ?? []), item]);
		});
		if (cluster) {
			/* Along the bar's own row to the fan's start, then in to the label's middle. */
			const fanStart = x - FAN + 3;
			const to = { x: x - 3, y: centre };
			if (fanStart > tipX + 1.5) leaders.push({ x1: tipX + 1, y1: r.cy, x2: fanStart, y2: r.cy, stroke: INK, width: 0.6 });
			leaders.push({ x1: Math.max(tipX + 1, fanStart), y1: r.cy, x2: to.x, y2: to.y, stroke: INK, width: 0.6 });
		}
	}

	// ── The tessitura band, and the bracket beside the bars ──
	let band: Layout['band'] = null;
	const tessBracket: Seg[] = [];
	const cutters: TextItem[] = [...barLabelItems];
	if (figure.tessitura) {
		const top = rowY(pitchToMidi(figure.tessitura.high)) - STEP / 2;
		const bottom = rowY(pitchToMidi(figure.tessitura.low)) + STEP / 2;
		band = { x: barX - 4, y: top, width: bandEnd - (barX - 4), height: bottom - top };
		const ink = { stroke: INK, width: 1 };
		tessBracket.push(
			{ x1: tessBx, y1: top, x2: tessBx + 4, y2: top, ...ink },
			{ x1: tessBx + 4, y1: top, x2: tessBx + 4, y2: bottom, ...ink },
			{ x1: tessBx, y1: bottom, x2: tessBx + 4, y2: bottom, ...ink },
		);
		const word = T('insights.figure.tessitura');
		cutters.push(addText({ kind: 'tessitura', text: word, x: tessBx + 11, y: (top + bottom) / 2 + 3.3, anchor: 'start', size: LABEL, weight: 500, fill: INK }, measure(word, LABEL, 500)));
	}

	/* A line at height `yy` from `x1` to `x2`, in the pieces left once every label it would run through is cut out (3 px clear each side). */
	const spansAround = (yy: number, x1: number, x2: number): Array<[number, number]> => {
		let spans: Array<[number, number]> = [[x1, x2]];
		for (const lab of cutters) {
			if (lab.box.y0 - 1 > yy || lab.box.y1 + 1 < yy) continue;
			const cutA = lab.box.x0 - 3;
			const cutB = lab.box.x1 + 3;
			const next: Array<[number, number]> = [];
			for (const [a, b] of spans) {
				if (cutB <= a || cutA >= b) next.push([a, b]);
				else {
					if (cutA - a > 1) next.push([a, cutA]);
					if (b - cutB > 1) next.push([cutB, b]);
				}
			}
			spans = next;
		}
		return spans;
	};

	// ── The passaggi, their names, and the zone shares ──
	const passLines: Seg[] = [];
	if (figure.passaggio && figure.zones) {
		const p = pitchToMidi(figure.passaggio.primo);
		const s = pitchToMidi(figure.passaggio.secondo);
		/* The line sits on the zone edge (`phonationSection`): the primo belongs
		   to the zone between, so its line runs halfway to the pitch a semitone
		   under it, and the secondo's halfway to the one a semitone over it. */
		const primoY = (rowY(p) + rowY(p - 1)) / 2;
		const secondoY = (rowY(s) + rowY(s + 1)) / 2;
		const share = (n: number) => fill(T('insights.phonation.share'), { n });
		const z = figure.zones;
		for (const [key, ly] of [
			['insights.figure.primo', primoY],
			['insights.figure.secondo', secondoY],
		] as const) {
			const word = T(key);
			const w = measure(withoutItalics(word), LABEL, 500);
			addText({ kind: 'passaggio', text: word, x: RIGHT, y: ly + 3.2, anchor: 'end', size: LABEL, weight: 500, fill: INK }, w);
			for (const [a, b] of spansAround(ly, barX - 4, RIGHT - w - 4)) passLines.push({ x1: a, y1: ly, x2: b, y2: ly, stroke: INK, width: 1, dash: '4 3' });
		}
		const shareAt = (key: string, n: number, by: number) => {
			const text = fill(T(key), { share: share(n) });
			addText({ kind: 'share', text, x: RIGHT, y: by, anchor: 'end', size: LABEL, weight: 600, fill: INK }, measure(text, LABEL, 600));
		};
		shareAt('insights.figure.zoneAbove', z.above, secondoY - 9.6);
		shareAt('insights.figure.zoneBetween', z.between, secondoY + 15.2);
		shareAt('insights.figure.zoneBelow', z.below, primoY + 16.2);
	}

	// ── The stave behind the bars, and the ledger lines under them, broken around any label that sits on one ──
	const faint: Seg[] = [];
	const breakAround = (yy: number, from: number, base: Omit<Seg, 'x1' | 'x2' | 'y1' | 'y2'>) => {
		for (const [a, b] of spansAround(yy, from, bandEnd)) faint.push({ x1: a, x2: b, y1: yy, y2: yy, ...base });
	};
	for (const l of lines) breakAround(y(l), 0, { stroke: 'var(--ink-stave, #1a1612)', opacity: 0.25, width: 1 });
	for (const l of ledgerSteps) breakAround(y(l), barX - 4, { stroke: 'var(--ink-stave, #1a1612)', opacity: 0.35, dash: '1 2', width: 1 });

	// ── Half the singing, and its centre: the bracket and where each label sits ──
	const halfBracket: Seg[] = [];
	if (figure.halfMass) {
		/* The bracket stands just past the longest label among the bars it spans,
		   so no label runs into it. */
		const reach = Math.max(
			barX + barMax * 0.25,
			...rows.filter((r) => bandRows.some((b) => b.midi === r.midi)).map((r) => {
				const labs = labelsByRow.get(r.midi) ?? [];
				return Math.max(barX + r.length, ...labs.map((l) => l.box.x1));
			}),
		);
		const spine = reach + 10;
		const serifTop = rowY(figure.halfMass.high) - BAR / 2;
		const serifBottom = rowY(figure.halfMass.low) + BAR / 2;
		const tick = figure.centre ? rowY(figure.centre.midi) : null;
		const top = tick === null ? serifTop : Math.min(serifTop, tick);
		const bottom = tick === null ? serifBottom : Math.max(serifBottom, tick);
		const ink = { stroke: INK, width: 1 };
		halfBracket.push(
			{ x1: spine, y1: top, x2: spine, y2: bottom, ...ink },
			{ x1: spine - 5, y1: serifTop, x2: spine, y2: serifTop, ...ink },
			{ x1: spine - 5, y1: serifBottom, x2: spine, y2: serifBottom, ...ink },
		);
		if (tick !== null) halfBracket.push({ x1: spine, y1: tick, x2: spine + 6, y2: tick, ...ink });

		const fixedBoxes = (withExtra = true): Box[] => [
			...(withExtra ? (options.extraObstacles ?? []) : []),
			...rowBoxes,
			...texts.map((x) => x.box),
			...faint.map(segBox),
			...passLines.map(segBox),
			...halfBracket.map(segBox),
			...leaders.map(segBox),
			...(band ? [{ x0: band.x, x1: band.x + band.width, y0: band.y, y1: band.y + band.height }] : []),
		];

		// "half the singing": above the bracket, beside its top, then below it; one line, then two.
		const halfWords = T('insights.figure.halfMass');
		const oneW = measure(halfWords, LABEL, 500);
		const split = (() => {
			const words = halfWords.split(' ');
			let best: [string, string] | null = null;
			let bestW = Infinity;
			for (let i = 1; i < words.length; i++) {
				const a = words.slice(0, i).join(' ');
				const b = words.slice(i).join(' ');
				const w = Math.max(measure(a, LABEL, 500), measure(b, LABEL, 500));
				if (w < bestW) {
					bestW = w;
					best = [a, b];
				}
			}
			return best ? { lines: best, w: bestW } : null;
		})();
		type Place = { box: Box; x: number; y: number; lines: string[]; w: number };
		const halfPlaces: Place[] = [];
		const addHalf = (x: number, firstBaseline: (n: number) => number, lines: string[], w: number) => {
			const baseline = firstBaseline(lines.length);
			halfPlaces.push({ x, y: baseline, lines, w, box: boxOf(x, baseline, w, LABEL, 'start', lines.length) });
		};
		const forms = [{ lines: [halfWords], w: oneW }, ...(split ? [{ lines: split.lines as string[], w: split.w }] : [])];
		for (const f of forms) addHalf(spine - 5, () => top - 4, f.lines, f.w);
		for (const f of forms) addHalf(spine + 6, (n) => top + 3.3 + (n - 1) * LINE_H, f.lines, f.w);
		for (const f of forms) addHalf(spine - 5, (n) => bottom + 12.5 + (n - 1) * LINE_H, f.lines, f.w);
		const chosenHalf = firstClear(halfPlaces, fixedBoxes());
		const drawHalf = (x: number, baseline: number, ls: string[], w: number) => {
			ls.forEach((line, i) =>
				addText({ kind: 'half', text: line, x, y: baseline - (ls.length - 1 - i) * LINE_H, anchor: 'start', size: LABEL, weight: 500, fill: INK }, measure(line, LABEL, 500)),
			);
			void w;
		};
		if (chosenHalf) drawHalf(chosenHalf.x, chosenHalf.y, chosenHalf.lines, chosenHalf.w);
		else {
			const slot = slotWithLeader({ x: spine, y: top }, oneW, LABEL, fixedBoxes(), 0.75, [...rowBoxes, ...texts.map((x) => x.box)]);
			if (slot) {
				drawHalf(slot.x, slot.baseline, [halfWords], oneW);
				leaders.push({ ...slot.leader, stroke: INK, width: 0.6 });
			} else {
				unplaced.push('half');
				drawHalf(spine - 5, top - 4, [halfWords], oneW);
			}
		}

		// "centre A3": level with the tick, then just above it, then just below.
		if (tick !== null && figure.centre) {
			const words = `${T('insights.figure.centre')} ${pitchLabel(figure.centre.pitch)}`;
			const w = measure(words, LABEL, 500);
			const x = spine + 9;
			const centrePlaces = [tick + 3.3, tick - 2.5, tick + 11.3].map((baseline) => ({ x, y: baseline, box: boxOf(x, baseline, w, LABEL, 'start') }));
			const chosen = firstClear(centrePlaces, fixedBoxes());
			if (chosen) addText({ kind: 'centre', text: words, x: chosen.x, y: chosen.y, anchor: 'start', size: LABEL, weight: 500, fill: INK }, w);
			else {
				const slot = slotWithLeader({ x: spine + 6, y: tick }, w, LABEL, fixedBoxes(), 0.75, [...rowBoxes, ...texts.map((x) => x.box)]);
				if (slot) {
					addText({ kind: 'centre', text: words, x: slot.x, y: slot.baseline, anchor: 'start', size: LABEL, weight: 500, fill: INK }, w);
					leaders.push({ ...slot.leader, stroke: INK, width: 0.6 });
				} else {
					unplaced.push('centre');
					addText({ kind: 'centre', text: words, x, y: tick - 2.5, anchor: 'start', size: LABEL, weight: 500, fill: INK }, w);
				}
			}
		}
	}

	// ── The key: one line under the figure, left-aligned with the bars ──
	const keyMarks: KeyMark[] = [];
	const entries: Array<{ kind: KeyMark['kind']; words: string }> = [];
	if (figure.tessitura) entries.push({ kind: 'tessitura', words: T('insights.figure.key.tessitura') });
	if (figure.passaggio && figure.zones) entries.push({ kind: 'passaggi', words: T('insights.figure.key.passaggi') });
	if (ledgerSteps.length > 0) entries.push({ kind: 'ledger', words: T('insights.figure.key.ledger') });
	const yBottom = y(extent.bottom);
	/* A run of semitone neighbours spreads its labels past the bars it spans, so the
	   key stands under the lowest of them as well as under the stave. */
	const labelsBottom = Math.max(yBottom, ...barLabelItems.map((x) => x.box.y1));
	const keyBaseline = Math.max(yBottom + 13, labelsBottom + 12);
	let kx = barX;
	for (const e of entries) {
		keyMarks.push({ kind: e.kind, x: kx, y: keyBaseline - 3.4 });
		const wx = kx + 16 + 5;
		const w = measure(withoutItalics(e.words), LABEL, 400);
		addText({ kind: 'key', text: e.words, x: wx, y: keyBaseline, anchor: 'start', size: LABEL, weight: 400, fill: TERTIARY }, w);
		kx = wx + w + 18;
	}

	// ── Where the figure begins and ends ──
	const clefAnchor = figure.clef === 'bass' ? 24 : 32;
	const glyphPx = smuflFontSizePx(LINE_GAP);
	const clefTop = clefG ? y(clefAnchor) - sp(clefG.top) : y(topLine);
	const tops = [
		clefTop,
		y(topLine),
		...rows.map((r) => r.cy - r.height / 2),
		...texts.filter((x) => x.kind !== 'key').map((x) => x.box.y0),
		...(band ? [band.y] : []),
		...halfBracket.map((s) => Math.min(s.y1, s.y2)),
	];
	const dy = CONTENT_TOP - Math.min(...tops);
	const lastBaseline = entries.length ? keyBaseline : Math.max(yBottom + 4, labelsBottom + 2);
	const height = lastBaseline + dy + 4;

	return {
		height,
		dy,
		barX,
		barMax,
		rows,
		staveYs: lines.map(y),
		ledgerYs: ledgerSteps.map(y),
		band,
		tessBracket,
		faint,
		passLines,
		halfBracket,
		leaders,
		texts,
		clef: clefG ? { x: CLEF_X, y: y(clefAnchor) } : null,
		keyMarks,
		unplaced,
		barMaxByLanguage,
		glyphPx,
		lineGap: LINE_GAP,
	};
}

/**
 * Every contact the drawing has: a text box against another, against a bar,
 * the band, a line, the bracket, or a leader. Empty means Design's check holds
 * ("every label against every line, bar, and other label"). Pure.
 */
export function contacts(layout: Layout, pad = 0.25): string[] {
	const out: string[] = [];
	const solid: Array<{ name: string; box: Box }> = [
		...layout.rows.map((r) => ({ name: `bar ${r.midi}`, box: { x0: layout.barX, x1: layout.barX + r.length, y0: r.cy - r.height / 2, y1: r.cy + r.height / 2 } })),
		...layout.faint.map((s, i) => ({ name: `faint line ${i}`, box: segBox(s) })),
		...layout.passLines.map((s, i) => ({ name: `passaggio line ${i}`, box: segBox(s) })),
		...layout.halfBracket.map((s, i) => ({ name: `bracket ${i}`, box: segBox(s) })),
		...layout.tessBracket.map((s, i) => ({ name: `tessitura bracket ${i}`, box: segBox(s) })),
		...(layout.band ? [{ name: 'band', box: { x0: layout.band.x, x1: layout.band.x + layout.band.width, y0: layout.band.y, y1: layout.band.y + layout.band.height } }] : []),
	];
	/* A leader is a line, not its bounding box: it touches a label only if a point of it does. */
	const onLeader = (s: Seg, b: Box) => {
		const n = Math.max(2, Math.ceil(Math.hypot(s.x2 - s.x1, s.y2 - s.y1)));
		for (let i = 0; i <= n; i++) {
			const px = s.x1 + ((s.x2 - s.x1) * i) / n;
			const py = s.y1 + ((s.y2 - s.y1) * i) / n;
			if (px >= b.x0 - s.width && px <= b.x1 + s.width && py >= b.y0 - s.width && py <= b.y1 + s.width) return true;
		}
		return false;
	};
	const labels = layout.texts.filter((x) => x.kind !== 'title');
	for (const a of labels) {
		for (const s of solid) {
			/* A bar's own label may sit on the band when its bar is inside the tessitura:
			   rose ink on the band is about 5.9:1, over the 4.5:1 text needs. The line
			   names, which are grey and would fall to 3.95:1, never reach it. */
			if (s.name === 'band' && a.kind === 'barLabel') continue;
			if (hit(a.box, s.box, -pad)) out.push(`${a.kind} "${a.text}" touches ${s.name}`);
		}
	}
	for (const a of labels) layout.leaders.forEach((s, i) => onLeader(s, a.box) && out.push(`${a.kind} "${a.text}" touches leader ${i}`));
	for (let i = 0; i < labels.length; i++)
		for (let j = i + 1; j < labels.length; j++) {
			// The two lines of one wrapped label are one label.
			if (labels[i].kind === 'half' && labels[j].kind === 'half') continue;
			if (hit(labels[i].box, labels[j].box, -pad)) out.push(`${labels[i].kind} "${labels[i].text}" touches ${labels[j].kind} "${labels[j].text}"`);
		}
	for (const u of layout.unplaced) out.push(`${u} label found no place`);
	return out;
}
