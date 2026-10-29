/**
 * The worker's half of one page's underlay (N.135 stage 2b): from the page's
 * pixels, homr's MusicXML for it, and homr's staff boxes, to the framed rows
 * the reader will read and the layout that `seatPage` (`underlay-page.ts`)
 * needs to put the reader's answer back on the page.
 *
 * In order, with the module that does each:
 *
 * 1. The voice notes: the notes of the first part of the page's MusicXML with
 *    their `imgpos` (`placeOf`), their bar, and whether a tie stops on them.
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
import { frameRow, type FramedCrop } from './underlay-frame';
import type { PageLayout, RowLayout, SystemLayout } from './underlay-page';
import { cutRows } from './underlay-rows';
import type { NotePlace } from './underlay-seat';

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
}

/** The notes of the first `<part>` of a MusicXML text, in document order. */
export function voiceNotes(musicXml: string): VoiceNote[] {
	const start = musicXml.search(/<part(?=[\s>])/);
	if (start < 0) return [];
	const end = musicXml.indexOf('</part>', start);
	const part = musicXml.slice(start, end < 0 ? undefined : end);
	const out: VoiceNote[] = [];
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
		});
	}
	return out;
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

/** The page's framed rows and layout. */
export function prepareUnderlay(page: Grey, musicXml: string, staves: readonly StaffBoxLike[]): Prepared {
	const notes = voiceNotes(musicXml).filter((n) => !n.rest && n.at !== null);
	const placed: PlacedStaff[] = [];
	let unfound = 0;
	for (const box of staves) {
		const staff = staffIn(page, box);
		if (staff) placed.push({ box, staff });
		else unfound++;
	}
	const systems: SystemLayout[] = [];
	const rows: FramedCrop[] = [];
	for (const system of systemsOf(notes.map((n) => n.at as { x: number; y: number }), placed, page.width, page.height)) {
		const space = placed[system.staff].staff.space;
		const mine: NotePlace[] = system.notes.map((i) => ({ id: notes[i].ordinal, x: (notes[i].at as { x: number }).x, bar: notes[i].bar, tiedInto: notes[i].tiedInto }));
		const layoutRows: RowLayout[] = [];
		if (system.band) {
			const { x0, x1, y0, y1 } = system.band;
			const band = crop(page, x0, x1, y0, y1);
			for (const row of cutRows(band, space)) {
				const framed = frameRow(crop(band, 0, band.width, row.y0, row.y1), space);
				layoutRows.push({ id: rows.length, transform: framed.transform, offsetX: x0, offsetY: y0 + row.y0 });
				rows.push(framed.crop);
			}
		}
		systems.push({ staffSpace: space, notes: mine, hasBand: system.band !== null, rows: layoutRows });
	}
	return { layout: { width: page.width, height: page.height, systems, unfound }, rows };
}
