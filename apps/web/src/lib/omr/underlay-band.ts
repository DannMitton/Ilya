/**
 * The lyric band: Dann's rectangle (N.135 stage 2b; Dann 2026-10-27 14:18 and
 * 14:27, `docs/memory/INBOX.md:449`).
 *
 * The band is the rectangle between the voice staff (A) and the staff below it,
 * the piano's upper staff (B), found by those landmarks and sized in proportion
 * to the staff space, never in fixed pixels. It runs from A's bottom line plus
 * `MARGIN` staff spaces to B's top line minus `MARGIN`; where no staff lies
 * below A, to A's bottom line plus `BELOW` spaces or the page's end. This is the
 * stage 1 harness's rule (`measure-row82-retrain_2026-10-15/harness/rowsys.py`,
 * lines 37 to 39), stated in spaces. One departure: the harness dropped a band
 * under 40 px; a band under `DROP` staff spaces is dropped here (DESK DEFAULT,
 * on Dann's proportion ruling).
 *
 * Which staff is the voice's: the staff nearest the voice notes' `imgpos`, by
 * the height of its middle line at the note's column. Every unit here is page
 * pixels: `imgpos` is in page pixels (`join-pages.ts`, `placeOf`), and a staff
 * is a `Staff` found in the ink (`metre-windows.ts`, `staffIn`), whose lines are
 * page pixels; homr's page-normalised boxes are converted by the caller
 * (`underlay-prepare.ts`) before they reach this file.
 *
 * Pure. No pixels are read here.
 */
import { linesAt, type Staff, type StaffBoxLike } from './metre-windows';

/** The band starts this many staff spaces under A's bottom line, and ends this many over B's top line. */
export const MARGIN = 1.5;
/** A band under this many staff spaces tall is dropped. */
export const DROP = 2;
/** With no staff below A, the band runs this many staff spaces under A's bottom line. */
export const BELOW = 20;

/** A staff on the page: homr's box, and the staff found inside it in page pixels. */
export interface PlacedStaff {
	box: StaffBoxLike;
	staff: Staff;
}

/** A voice note's place on the page, in pixels. */
export interface NotePoint {
	x: number;
	y: number;
}

/** A band, in page pixels; `y1` is exclusive. */
export interface LyricBand {
	/** The index of the voice staff (A) in the list given. */
	staff: number;
	x0: number;
	x1: number;
	y0: number;
	y1: number;
	/** A's staff space: the system's. */
	space: number;
}

/** The column of the middle of a staff's span. */
function centreOf(st: Staff): number {
	return (st.x0 + st.x1) / 2;
}

/** The height of a staff's middle line at column `x`. */
function middleAt(st: Staff, x: number): number {
	return linesAt(st, x)[2];
}

/** The staves in order down the page, by the height of their middle lines at their own centres. */
export function downThePage(staves: readonly PlacedStaff[]): number[] {
	return staves.map((_, i) => i).sort((a, b) => middleAt(staves[a].staff, centreOf(staves[a].staff)) - middleAt(staves[b].staff, centreOf(staves[b].staff)));
}

/** For each note, the index of the staff nearest it: by the middle line's height at the note's column. */
export function staffOfNotes(notes: readonly NotePoint[], staves: readonly PlacedStaff[]): number[] {
	return notes.map((n) => {
		let best = -1;
		let bestGap = Infinity;
		staves.forEach((s, i) => {
			const gap = Math.abs(n.y - middleAt(s.staff, n.x));
			if (gap < bestGap) {
				bestGap = gap;
				best = i;
			}
		});
		return best;
	});
}

/**
 * The band under staff `a`, given the staff `b` below it (or null), on a page
 * `width` by `height`; or null where it is under `DROP` spaces tall. The
 * margins are in `a`'s staff spaces, and the lines are read at `a`'s centre
 * column.
 */
export function lyricBand(a: PlacedStaff, b: PlacedStaff | null, width: number, height: number, index = 0, bTop?: number | null): LyricBand | null {
	const space = a.staff.space;
	const x = centreOf(a.staff);
	const bottom = linesAt(a.staff, x)[4];
	const y0 = Math.ceil(bottom + MARGIN * space);
	// `bTop`, where given, is B's top line as found in the ink (`underlay-below.ts`): a number, or null for no staff below.
	const top = bTop !== undefined ? bTop : b ? linesAt(b.staff, x)[0] : null;
	const y1 = Math.min(height, Math.floor(top !== null ? top - MARGIN * space : bottom + BELOW * space));
	if (!(y1 - y0 >= DROP * space)) return null;
	return { staff: index, x0: 0, x1: width, y0, y1, space };
}

/** One system of a page: the voice staff, the voice notes under it, and the band below. */
export interface System {
	/** The index of the voice staff in the staves given. */
	staff: number;
	/** The indices, in the notes given, of the notes this staff holds. */
	notes: number[];
	/** Null where no band of `DROP` spaces fits under it. */
	band: LyricBand | null;
}

/**
 * The systems of a page that hold voice notes, top to bottom: each voice staff
 * (the staff nearest at least one note), its notes, and its band. B is the
 * next staff below A in the page's order down.
 */
export function systemsOf(
	notes: readonly NotePoint[],
	staves: readonly PlacedStaff[],
	width: number,
	height: number,
	/** B's top line for voice staff `a` and the staff below it in the page's order, found in the ink; absent, B's own `staffIn` line is used. */
	topBelow?: (a: PlacedStaff, below: PlacedStaff | null) => number | null,
): System[] {
	if (staves.length === 0 || notes.length === 0) return [];
	const owner = staffOfNotes(notes, staves);
	const order = downThePage(staves);
	const systems: System[] = [];
	for (const a of order) {
		const mine = owner.flatMap((s, i) => (s === a ? [i] : []));
		if (mine.length === 0) continue;
		const below = order[order.indexOf(a) + 1];
		const b = below === undefined ? null : staves[below];
		const band = lyricBand(staves[a], b, width, height, a, topBelow ? topBelow(staves[a], b) : undefined);
		systems.push({ staff: a, notes: mine, band });
	}
	return systems;
}
