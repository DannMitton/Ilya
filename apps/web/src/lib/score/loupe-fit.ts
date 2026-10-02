/**
 * loupe-fit.ts — one notation size per song, and the zoom beside it.
 *
 * Loupe remainder brief, item 4, 2026-10-02
 * (`docs/sessions/brief-code-loupe-remainder_r1_2026-09-30.md`).
 *
 * ── THE RULING ──────────────────────────────────────────────────────────
 * `docs/memory/OPEN.md`, clause 8 of THE CARET (2026-09-18), AMENDED by Dann
 * 2026-09-28 01:34: *"The notation's point size is the fixed quantity"* is
 * retracted. **The notation's size is set once per song**, chosen so the
 * song's ordinary measures fit the room without scrolling; only a measure that
 * still cannot fit (a dense one) scrolls sideways. Offered by the desk; Dann:
 * *"I guess? Maybe include a zoom/pan control as courtesy to users who need
 * finer control."* The zoom: a small minus and plus in the loupe's bar beside
 * Undo; the chosen zoom holds for the session and applies to every measure;
 * at a zoom that no longer fits, the measure scrolls sideways, which is the
 * pan. Browser zoom is untouched. The plan is Code's own, in
 * `report-code-calm-loupe_r1_2026-09-28.md` §4 item 2.
 *
 * ── WHAT THIS FILE DECIDES, AND WHAT IS A CODE DEFAULT ──────────────────
 * The size is a FACTOR on the magnification the loupe already asks for
 * (`Loupe.svelte`, `MAGNIFICATION` and the desk's derived figure), never above
 * 1: the fit only lowers. Every number below that the ruling does not give is
 * a CODE DEFAULT, reversible, and named so:
 *
 * - A measure is DENSE when its strip is wider than `DENSE_OVER_MEDIAN` (1.6)
 *   times the song's median strip at factor 1. Dense measures do not set the
 *   size; they scroll.
 * - The size never goes below the printed vocal score's stave space,
 *   `LEGIBLE_STAVE_SPACE_PX` (6.5), which `Loupe.svelte` (the note on
 *   `DESKTOP_TARGET_LINE_GAP`) takes from Gould's rastral of about 7 mm at
 *   96 dpi. A phone's loupe is already below it (about 6.2 px), so the fit
 *   leaves a phone alone. The acceptance criterion of `AGENTS.md` outranks
 *   density: a size the singer cannot read is worse than a scroll.
 * - A strip is not linear in the factor: the tap floor (44 px between carets)
 *   is in pixels, so a floor-limited measure shrinks less than the notation
 *   does. `fitSong` therefore measures the measures that limit it again after
 *   each lowering, up to `FIT_PASSES` times.
 * - The zoom steps by `ZOOM_STEP` (1.25) either way, `ZOOM_LIMIT` (3) steps
 *   each side, and ignores the legibility floor: it is the singer's choice.
 */
import type { ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { positionsInMeasure, type Cursor } from '$lib/score/entry';

export const DENSE_OVER_MEDIAN = 1.6;
export const LEGIBLE_STAVE_SPACE_PX = 6.5;
export const FIT_PASSES = 3;
/** A strip must shrink by at least this share of the notation's own shrink to count as answering to the size. CODE DEFAULT. */
export const RESPONSE_SHARE = 0.25;
export const ZOOM_STEP = 1.25;
export const ZOOM_LIMIT = 3;

/** The zoom factor for a number of steps, clamped to the limits. */
export function zoomFactor(steps: number): number {
	return ZOOM_STEP ** Math.max(-ZOOM_LIMIT, Math.min(ZOOM_LIMIT, steps));
}

export function median(xs: readonly number[]): number {
	if (xs.length === 0) return 0;
	const s = [...xs].sort((a, b) => a - b);
	const mid = s.length >> 1;
	return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Which strips are dense: wider than `DENSE_OVER_MEDIAN` times the median. Under three, none is. */
export function denseMeasures(widths: readonly number[]): boolean[] {
	if (widths.length < 3) return widths.map(() => false);
	const limit = median(widths) * DENSE_OVER_MEDIAN;
	return widths.map((w) => w > limit);
}

/** The lowest factor that keeps the stave space at the legible floor, or 1 where it is already at or below it. */
export function floorFactor(baseStaveSpacePx: number): number {
	return baseStaveSpacePx > LEGIBLE_STAVE_SPACE_PX ? LEGIBLE_STAVE_SPACE_PX / baseStaveSpacePx : 1;
}

/** Round a factor to a hundredth, so a size is a stable number and not a float's tail. */
const settle = (f: number): number => Math.round(f * 100) / 100;

export interface FitInput {
	/** The measures the song sings in, in order. */
	measures: readonly number[];
	/** A measure's strip width at a factor, in CSS px, frame sides included; null where it cannot be drawn. */
	widthAt: (measure: number, factor: number) => number | null;
	/** The widest a frame may be. */
	room: number;
	/** The lowest factor allowed (`floorFactor`). */
	floor: number;
	/** Give the page a turn between measures. */
	yieldTurn: () => Promise<void>;
	/** False once the loupe is gone: the fit stops and answers null. */
	alive: () => boolean;
}

/**
 * The song's factor: the largest at or below 1, and not below `floor`, at which
 * every ordinary measure fits `room`. Null if the loupe went away first.
 *
 * Every measure is measured at factor 1; the dense ones are set aside; the rest
 * lower the factor by the worst ratio of room to width; and the measures that
 * limited it are measured again at the new factor, because a floor-limited
 * strip does not shrink with the notation. One that shrinks by under a quarter
 * of the notation's own shrink (`RESPONSE_SHARE`) is set aside like a dense one,
 * and the factor is worked out again without it. Measures that fitted keep
 * fitting at a lower factor, so they are not measured again.
 */
export async function fitSong(input: FitInput): Promise<number | null> {
	const { measures, widthAt, room, floor, yieldTurn, alive } = input;
	if (!(floor < 1) || measures.length === 0) return 1;
	const width = new Map<number, number>();
	for (const m of measures) {
		if (!alive()) return null;
		const w = widthAt(m, 1);
		if (w !== null) width.set(m, w);
		await yieldTurn();
	}
	const drawn = measures.filter((m) => width.has(m));
	const dense = denseMeasures(drawn.map((m) => width.get(m)!));
	/* A strip that does not answer to the size is set aside, as a dense one is: lowering the notation for it
	   would only drag every other measure down. */
	const scrolls = new Set(drawn.filter((_, i) => dense[i]));
	let factor = 1;
	const measureAt = async (ms: readonly number[], f: number): Promise<boolean> => {
		for (const m of ms) {
			if (!alive()) return false;
			const w = widthAt(m, f);
			if (w !== null) width.set(m, w);
			await yieldTurn();
		}
		return true;
	};
	for (let pass = 0; pass < FIT_PASSES; pass++) {
		const limiting = drawn.filter((m) => !scrolls.has(m) && width.get(m)! > room + 0.5);
		if (limiting.length === 0) break;
		const before = new Map(limiting.map((m) => [m, width.get(m)!]));
		const target = (ms: readonly number[]) => settle(Math.max(floor, factor * Math.min(...ms.map((m) => room / before.get(m)!))));
		let next = target(limiting);
		if (next >= factor - 0.005) break;
		if (!(await measureAt(limiting, next))) return null;
		const drop = 1 - next / factor;
		const stuck = limiting.filter((m) => width.get(m)! > before.get(m)! * (1 - RESPONSE_SHARE * drop));
		if (stuck.length > 0) {
			for (const m of stuck) scrolls.add(m);
			const responsive = limiting.filter((m) => !scrolls.has(m));
			next = responsive.length > 0 ? target(responsive) : factor;
			if (responsive.length > 0 && next < factor - 0.005) {
				if (!(await measureAt(responsive, next))) return null;
			} else {
				for (const m of limiting) width.set(m, before.get(m)!);
				next = factor;
			}
		}
		if (next >= factor - 0.005) break;
		factor = next;
		if (factor <= floor) break;
	}
	return factor;
}

/** What the loupe needs to draw one measure other than the held one: the held measure's props, rebuilt from the score. */
export interface MeasureHold {
	measure: number;
	/** Entry ids that are not rests, as the page's `heldMeasureIds`. */
	ids: string[];
	positions: Cursor[];
	meter: { beats: number; beatType: number } | null;
}

/** The measures a song sings in. */
export function singingMeasures(line: readonly VocalLineEvent[]): number[] {
	return [...new Set(line.map((e) => e.measureIndex))].sort((a, b) => a - b);
}

/** A measure's hold, from the score alone: the page's `heldMeasureIds`, `heldMeasurePositions`, and `heldMeter`. */
export function measureHold(score: ParsedScore, measure: number): MeasureHold {
	const m = score.measures.find((x) => x.index === measure);
	return {
		measure,
		ids: score.vocalLine.filter((e) => e.type !== 'rest' && e.measureIndex === measure).map((e) => e.id),
		positions: positionsInMeasure(score.vocalLine, measure),
		meter: m ? { beats: m.timeSignature.beats, beatType: m.timeSignature.beatType } : null,
	};
}

/**
 * Which song a size belongs to: the title, the measure count, the first event,
 * and the room it was fitted to (to eight px, the viewport and drawer, so a
 * resize that matters refits and a hair does not). Not the event count: entering
 * a note must not change the size under the singer's hand. Not the page's scale
 * either: it differs from one system to the next, and a song has one size.
 */
export function songKey(score: ParsedScore, room: number, isPhone: boolean): string {
	return [score.workMetadata?.title ?? '', score.measures.length, score.vocalLine[0]?.id ?? '', Math.round(room / 8), isPhone ? 'p' : 'd'].join('|');
}
