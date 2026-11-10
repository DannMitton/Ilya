/**
 * The worker's half of one page's underlay (N.135 stage 2b): from the page's
 * pixels, homr's MusicXML for it, and homr's staff boxes, to the framed rows
 * the reader will read and the layout that `seatPage` (`underlay-page.ts`)
 * needs to put the reader's answer back on the page.
 *
 * In order, with the module that does each:
 *
 * 1. The voice notes: the notes of the first part of the page's MusicXML with
 *    their `imgpos` (`placeOf`), their bar, whether a tie stops on them, and
 *    whether they lie after the first note of a printed slur (`slurSpans`).
 * 2. The staves: `staffIn` (`metre-windows.ts`) once for each staff box homr
 *    gave, the box kept with the staff found in it. This is a second call of
 *    what the metre worker does on the same boxes (`metre.worker.ts`, by way of
 *    `readPageMetres`); neither reads the other's output. Homr's boxes are
 *    page-normalised fractions and `imgpos` is in page pixels; the boxes are
 *    taken to pixels inside `staffIn`, which is given the page's size, so every
 *    length from here is in page pixels. Within this stage the `Staff` is found
 *    once and handed down, never measured again.
 * 3. The systems and their bands (`underlay-band.ts`): the staff nearest the
 *    voice notes, the staff below it, and the rectangle between.
 * 4. The rows (`cutRows`, with the system's staff space) and their frames
 *    (`frameRow`, the same space).
 *
 * Pure: pixels and text in, pixels and numbers out. The Worker (`underlay.worker.ts`)
 * decodes the image before it and encodes the framed rows after it.
 */
import { placeOf } from './join-pages';
import { staffIn, type Grey, type StaffBoxLike } from './metre-windows';
import { systemsOf, type PlacedStaff } from './underlay-band';
import { topLineBelow } from './underlay-below';
import { frameRow, type FramedCrop } from './underlay-frame';
import type { PageLayout, RowLayout, SystemLayout } from './underlay-page';
import { bandInk, cutRows } from './underlay-rows';
import { lookWindow, stretchBand, type Look } from './underlay-looks';
import type { NotePlace } from './underlay-seat';
import { skipOf, wouldSkipOf, type SkipKind, type WouldSkipKind } from './note-kinds';

/** One note of the first part. */
export interface VoiceNote {
	/** The note's ordinal among the notes of the first part, rests counted (`writeLyrics`). */
	ordinal: number;
	rest: boolean;
	/** The measure's `number`, or the count of measures so far where it has none. */
	bar: number;
	/** The note's head on the page, in pixels; null where homr wrote no `imgpos`. */
	at: { x: number; y: number } | null;
	/** A tie stops on the note: it sings no new syllable. */
	tiedInto: boolean;
	/**
	 * The note is after the first note of a printed slur, up to and including the slur's stop note (`slurSpans`). Read
	 * here and carried to `NotePlace`; a system reads it as a melisma only where the count gate takes it (`seatPage`).
	 */
	inSlur: boolean;
	/** The note is a grace note or a chord tone and takes no syllable (`note-kinds.ts`); it stays in the XML, so no ordinal moves. */
	skip?: SkipKind;
	/** What would take it out in a later build, where `skip` is not set: a cue note, or voice 2 or later. Counted only. */
	wouldSkip?: WouldSkipKind;
}

/** One `<slur>` end on a note. A start's `number` defaults to 1, as MusicXML does; a stop with no `number` is null and closes the most recent open start of any number. */
export interface SlurEnd {
	type: 'start' | 'stop';
	number: number | null;
}

/** The slur ends of one note's text, stops before starts (a note that closes one slur and opens the next has a stop and a start). */
function slurEndsOf(note: string): SlurEnd[] {
	const ends: SlurEnd[] = [];
	for (const m of note.matchAll(/<slur\b([^>]*)>/g)) {
		const type = /\btype="(start|stop)"/.exec(m[1])?.[1];
		if (type !== 'start' && type !== 'stop') continue; // type="continue" opens and closes nothing
		const number = /\bnumber="(\d+)"/.exec(m[1]);
		ends.push({ type, number: number ? Number(number[1]) : type === 'start' ? 1 : null });
	}
	return [...ends.filter((e) => e.type === 'stop'), ...ends.filter((e) => e.type === 'start')];
}

/**
 * Which notes a printed slur runs over, from each note's slur ends in document order (`ends[i]` is note i's, rests
 * included), with the ends that found no partner.
 *
 * Follows `slurContinuationIds` (`score/slur-seat.ts`): a span runs from its start to its stop, inclusive, and the start
 * note is not in it; overlapping or nested spans take the union; a rest inside a span does not end it and is never marked
 * (`rest[i]`). The pairing is a STACK (row 177 step 5): a `stop` closes the most recent open `start` of its `number`, or of
 * any number where the stop gives none, so two starts never share one stop and overlapping slurs (start, start, stop, stop,
 * homr writing every voice slur as number 1) each end where they end; a note stays in the union while any slur is open,
 * including the note where the last one stops. A stop on a start's own note closes the slur before it. A `start` never closed
 * opens no span (`slur-seat.ts` opens none for a start without a partner), and a `stop` with nothing to close is ignored. So
 * a slur that crosses a page break marks nothing on either page.
 */
export function slurSpans(
	ends: readonly (readonly SlurEnd[])[],
	rest: readonly boolean[],
): { inSlur: boolean[]; unmatchedStarts: number; unmatchedStops: number } {
	const inSlur = new Array<boolean>(ends.length).fill(false);
	const open: { number: number; at: number }[] = [];
	let unmatchedStops = 0;
	ends.forEach((here, i) => {
		for (const end of here) {
			if (end.type === 'start') {
				open.push({ number: end.number ?? 1, at: i });
				continue;
			}
			let j = open.length - 1;
			while (j >= 0 && end.number !== null && open[j].number !== end.number) j--;
			if (j < 0 || open[j].at === i) {
				unmatchedStops++;
				continue;
			}
			const [{ at }] = open.splice(j, 1);
			for (let k = at + 1; k <= i; k++) if (!rest[k]) inSlur[k] = true;
		}
	});
	return { inSlur, unmatchedStarts: open.length, unmatchedStops };
}

/** `skip` where the note is a grace note or a chord tone, else `wouldSkip` where it is a cue note or in voice 2 or later; neither key where neither. */
function kindsOf(note: string): { skip?: SkipKind; wouldSkip?: WouldSkipKind } {
	const skip = skipOf(note);
	if (skip) return { skip };
	const wouldSkip = wouldSkipOf(note);
	return wouldSkip ? { wouldSkip } : {};
}

/** The notes of the first `<part>` of a MusicXML text, in document order. */
export function voiceNotes(musicXml: string): VoiceNote[] {
	const start = musicXml.search(/<part(?=[\s>])/);
	if (start < 0) return [];
	const end = musicXml.indexOf('</part>', start);
	const part = musicXml.slice(start, end < 0 ? undefined : end);
	const out: VoiceNote[] = [];
	const ends: SlurEnd[][] = [];
	let measures = 0;
	let bar = 0;
	for (const m of part.matchAll(/<measure(?=[\s>])([^>]*)>|<note(?=[\s>])[^>]*>[\s\S]*?<\/note>/g)) {
		if (m[0].startsWith('<measure')) {
			measures++;
			const number = /number="([^"]*)"/.exec(m[1] ?? '');
			bar = number && Number.isFinite(Number(number[1])) ? Number(number[1]) : measures;
			continue;
		}
		out.push({
			ordinal: out.length,
			rest: /<rest[\s/>]/.test(m[0]),
			bar,
			at: placeOf(m[0]),
			tiedInto: /<tie\s[^>]*type="stop"/.test(m[0]),
			inSlur: false,
			...kindsOf(m[0]),
		});
		ends.push(slurEndsOf(m[0]));
	}
	const { inSlur } = slurSpans(ends, out.map((n) => n.rest));
	return out.map((n, i) => ({ ...n, inSlur: inSlur[i] }));
}

/** The number of `<measure>` elements in the first `<part>` of a MusicXML text: the bars the join takes from the page. */
export function measureCount(musicXml: string): number {
	const start = musicXml.search(/<part(?=[\s>])/);
	if (start < 0) return 0;
	const end = musicXml.indexOf('</part>', start);
	return (musicXml.slice(start, end < 0 ? undefined : end).match(/<measure(?=[\s>])/g) ?? []).length;
}

export interface Prepared {
	layout: PageLayout;
	/** The framed rows, in `layout`'s order: row `id` is `rows[id]`. */
	rows: FramedCrop[];
}

/** A rectangle of the page as a band for `cutRows`: the page's rows `y0` to `y1`, all columns. */
function crop(page: Grey, x0: number, x1: number, y0: number, y1: number): { width: number; height: number; data: Uint8Array } {
	const width = x1 - x0;
	const height = y1 - y0;
	const data = new Uint8Array(width * height);
	for (let y = 0; y < height; y++) data.set(page.data.subarray((y0 + y) * page.width + x0, (y0 + y) * page.width + x1), y * width);
	return { width, height, data };
}

/** The staves found in the page and the systems that hold voice notes, as `prepareUnderlay` and `prepareSystem` both take them. */
function systemsOfPage(page: Grey, musicXml: string, staves: readonly StaffBoxLike[]) {
	const notes = voiceNotes(musicXml).filter((n) => !n.rest && n.at !== null);
	const placed: PlacedStaff[] = [];
	let unfound = 0;
	for (const box of staves) {
		const staff = staffIn(page, box);
		if (staff) placed.push({ box, staff });
		else unfound++;
	}
	const systems = systemsOf(notes.map((n) => n.at as { x: number; y: number }), placed, page.width, page.height, (a, b) => topLineBelow(page, a, b));
	return { notes, placed, unfound, systems };
}

/** The page's framed rows and layout. */
export function prepareUnderlay(page: Grey, musicXml: string, staves: readonly StaffBoxLike[]): Prepared {
	const { notes, placed, unfound, systems: found } = systemsOfPage(page, musicXml, staves);
	const systems: SystemLayout[] = [];
	const rows: FramedCrop[] = [];
	for (const system of found) {
		const space = placed[system.staff].staff.space;
		const mine: NotePlace[] = system.notes.map((i) => ({ id: notes[i].ordinal, x: (notes[i].at as { x: number }).x, bar: notes[i].bar, tiedInto: notes[i].tiedInto, inSlur: notes[i].inSlur, ...(notes[i].skip ? { skip: notes[i].skip } : {}), ...(notes[i].wouldSkip ? { wouldSkip: notes[i].wouldSkip } : {}) }));
		const layoutRows: RowLayout[] = [];
		let ink: { share: number; lines: number } | null = null;
		if (system.band) {
			const { x0, x1, y0, y1 } = system.band;
			const band = crop(page, x0, x1, y0, y1);
			ink = bandInk(band, space);
			for (const row of cutRows(band, space)) {
				const framed = frameRow(crop(band, 0, band.width, row.y0, row.y1), space);
				layoutRows.push({ id: rows.length, transform: framed.transform, offsetX: x0, offsetY: y0 + row.y0 });
				rows.push(framed.crop);
			}
		}
		systems.push({ staffSpace: space, notes: mine, hasBand: system.band !== null, rows: layoutRows, ...(ink ? { inkShare: ink.share, textLines: ink.lines } : {}), ...(system.band ? { band: { x0: system.band.x0, x1: system.band.x1, y0: system.band.y0, y1: system.band.y1 } } : {}) });
	}
	return { layout: { width: page.width, height: page.height, systems, unfound }, rows };
}

/** One system's rows under one look: the framed rows, and where each stands on the page (`id` is the row's place in `rows`, from 0). */
export interface PreparedSystem {
	rows: FramedCrop[];
	layoutRows: RowLayout[];
}

/**
 * One system, one look (row 181 step 2; review amendment 14): the system's band cut again as `look` says
 * (`underlay-looks.ts`), its rows cut by `cutRows` and framed by `frameRow` exactly as `prepareUnderlay` does them. Null where
 * the page has no system `system` (the index `prepareUnderlay` gave it), the system has no band, or the look leaves no row.
 * Row ids are from 0; the caller renumbers them into the page's rows.
 */
export function prepareSystem(page: Grey, musicXml: string, staves: readonly StaffBoxLike[], system: number, look: Look): PreparedSystem | null {
	const found = systemsOfPage(page, musicXml, staves);
	return prepareSystemIn(page, found.placed, found.systems[system], look);
}

/** `prepareSystem` over systems already found, so a caller that looks at several systems finds them once. */
export function prepareSystemIn(page: Grey, placed: readonly PlacedStaff[], system: ReturnType<typeof systemsOfPage>['systems'][number] | undefined, look: Look): PreparedSystem | null {
	if (!system || !system.band) return null;
	const space = placed[system.staff].staff.space;
	const { x0, x1 } = system.band;
	const window = lookWindow(system.band.y0, system.band.y1, space, page.height, look);
	if (!window) return null;
	const [y0, y1] = window;
	const cut = crop(page, x0, x1, y0, y1);
	const band = look === 'stretch' ? stretchBand(cut) : cut;
	const rows: FramedCrop[] = [];
	const layoutRows: RowLayout[] = [];
	for (const row of cutRows(band, space)) {
		const framed = frameRow(crop(band, 0, band.width, row.y0, row.y1), space);
		layoutRows.push({ id: rows.length, transform: framed.transform, offsetX: x0, offsetY: y0 + row.y0 });
		rows.push(framed.crop);
	}
	return { rows, layoutRows };
}

/** One look for each wanted system of a page, with the systems found once (the Worker's second answer). */
export function prepareLooks(page: Grey, musicXml: string, staves: readonly StaffBoxLike[], wants: readonly { system: number; looks: readonly Look[] }[]): { system: number; look: Look; prepared: PreparedSystem | null }[] {
	const found = systemsOfPage(page, musicXml, staves);
	return wants.flatMap((w) => w.looks.map((look) => ({ system: w.system, look, prepared: prepareSystemIn(page, found.placed, found.systems[w.system], look) })));
}
