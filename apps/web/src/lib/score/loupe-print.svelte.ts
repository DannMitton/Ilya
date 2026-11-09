/**
 * THE PRINT IN THE LOUPE (row 181, step 6; `OPEN.md` JOINING POEM TO LYRICS ON A SCAN items 8 to 15; Fable's memo
 * `memo-fable-loupe-print-strip_r1_2026-11-04.md`).
 *
 * On any bar of a scanned song the Loupe shows the strip of the singer's own scan under the header, cut from the stored scan when
 * the Loupe opens (design (a), `omr/band-strip.ts`), then the drawn notes, then the syllables. It is the assistive witness of
 * what Ilya replicated, never printed (Dann 2026-11-04 14:00). This module holds what the Loupe and the banner share:
 * - the bars the banner lists, as one list the Loupe steps through («m. 14 · to check, 1 of 3», Previous, Next);
 * - the strip of a bar, cut once and kept for the session (the page is rendered once per page);
 * - the Loupe opening itself ONCE, when a dropped scan arrives with bars to check, never on a restore (memo finding 8), and the
 *   focus it takes and gives back (finding 9);
 * - the way into the Loupe from the banner: the page lends `openAt`, which does the order the whole fix lives in (finding 1:
 *   switch to Markup, lower the drawer on a phone, set the cursor, only then open).
 * Session state only. Nothing here is stored.
 */
import { t, type Language } from '$lib/i18n';
import { cutBandStrip, renderScanPage, type Strip } from '$lib/omr/band-strip';
import { stripRect, systemOfBar, type BandFractions, type KeptSystem } from '$lib/omr/kept-bands';

/** The scan as the Loupe reads it: where its bands are and the stored file they were cut from. */
export interface PrintScan {
	systems: readonly KeptSystem[];
	file: File;
	kind: 'image' | 'pdf';
}

export interface PrintDeps {
	songId(): string;
	/** The open song's scan with its kept bands, or null where the song is not a scan read with bands (the strip is then not drawn). */
	scan(): PrintScan | null;
	/** The bars the banner lists, as song bars, in order. */
	toCheck(): number[];
	/** Open the Loupe on a bar, in the order that holds on a phone (the page's). */
	openAt(bar: number): void;
	render?: (file: File, kind: 'image' | 'pdf', page: number) => Promise<Blob>;
	cut?: (page: Blob, band: BandFractions) => Promise<Strip | null>;
	url?: (blob: Blob) => string;
}

/** The cut strip as the Loupe draws it. */
export interface PrintStrip {
	url: string;
	/** The strip's own pixels, as cut from the stored scan. */
	width: number;
	height: number;
	/** The system's staff space in those pixels: what letter height is judged by. */
	spacePx: number;
}

export class LoupePrint {
	#deps: PrintDeps | null = null;
	#pages = new Map<string, Promise<Blob | null>>();
	#strips = new Map<string, Promise<PrintStrip | null>>();
	#shown = new Set<string>();
	#dropped: { songId: string; scan: PrintScan } | null = null;
	#returnTo: Element | null = null;
	/** Bumped each time the Loupe opens itself, so the strip's row can take focus once for each. */
	focusRequest = $state(0);

	attach(deps: PrintDeps): void {
		this.#deps = deps;
	}

	/** The scan a drop just read, with the file it was cut from, for the session: the stored copy is not in memory until the song is opened again. */
	dropped(songId: string, file: File, systems: readonly KeptSystem[]): void {
		this.#dropped = { songId, scan: { systems, file, kind: /\.pdf$/i.test(file.name) ? 'pdf' : 'image' } };
	}

	/** The scan of the open song: the one just dropped, else the stored one the page lends. */
	#scan(): PrintScan | null {
		const deps = this.#deps;
		if (!deps) return null;
		return this.#dropped && this.#dropped.songId === deps.songId() ? this.#dropped.scan : deps.scan();
	}

	/** The scan is a scan with bands: the strip is drawn on every bar of it (JOINING item 13). */
	hasScan(): boolean {
		const scan = this.#scan();
		return !!scan && scan.systems.some((s) => s.band);
	}

	/** Open the Loupe on a bar: the banner's link and Previous and Next. */
	goto(bar: number): void {
		this.#deps?.openAt(bar);
	}

	/** Where a bar stands in the banner's list, 1-based, or null where it is not listed. */
	position(bar: number): { index: number; total: number } | null {
		const list = this.#deps?.toCheck() ?? [];
		const at = list.indexOf(bar);
		return at < 0 ? null : { index: at + 1, total: list.length };
	}

	/** The bar before or after this one in the list, or null at an end (Previous and Next stop there; they do not wrap). */
	neighbour(bar: number, direction: -1 | 1): number | null {
		const list = this.#deps?.toCheck() ?? [];
		const at = list.indexOf(bar);
		return at < 0 ? null : (list[at + direction] ?? null);
	}

	/** The tag for a listed bar, «m. 14 · to check, 1 of 3»; null for any other bar, which keeps the Loupe's own tag. */
	tagFor(label: string | null, language: Language): string | null {
		if (label === null) return null;
		const at = this.position(Number.parseInt(label, 10));
		return at ? t('loupe.measureTagCheck', language).replace('%m', label).replace('%s', String(at.index)).replace('%t', String(at.total)) : null;
	}

	/** The alt text of the strip: what it is, and no pretence to read it. */
	altFor(bar: number, language: Language): string {
		return t('loupe.printAlt', language).replace('{bar}', String(bar));
	}

	/** The bar's strip, cut from the stored scan and kept for the session; null where there is none to cut. */
	strip(bar: number): Promise<PrintStrip | null> {
		const deps = this.#deps;
		const scan = this.#scan();
		if (!deps || !scan) return Promise.resolve(null);
		const system = systemOfBar(scan.systems, bar);
		const rect = system ? stripRect(system, bar) : null;
		if (!system || !rect) return Promise.resolve(null);
		const key = `${deps.songId()}|${system.page}|${bar}`;
		let made = this.#strips.get(key);
		if (!made) {
			const pageKey = `${deps.songId()}|${system.page}`;
			let page = this.#pages.get(pageKey);
			if (!page) {
				page = (deps.render ?? renderScanPage)(scan.file, scan.kind, system.page).catch(() => null);
				this.#pages.set(pageKey, page);
			}
			/* WHEN THE STRIP CANNOT BE CUT (integration step 7f). It checks the two places a strip can be lost, the page's render and the
			   band's cut, and says which in one console line naming the page and the bar; the strip then resolves to null and the Loupe
			   draws none, as before. WHY: the loss was silent, so a singer's missing print could not be told from a scan with no band.
			   It relates to `renderScanPage` and `cutBandStrip`, whose failures it names, and to the cache below, which forgets a null. */
			const lost = (what: string): null => {
				console.info(`[ilya] print strip: page ${system.page}, bar ${bar}: ${what}`);
				return null;
			};
			made = page.then(async (blob) => {
				if (!blob) return lost('the scan page could not be rendered');
				const cut = await (deps.cut ?? cutBandStrip)(blob, rect).catch(() => null);
				if (!cut) return lost('the band could not be cut from the page');
				const spacePx = (rect.space / Math.max(1e-9, rect.y1 - rect.y0)) * cut.height;
				return { url: (deps.url ?? URL.createObjectURL)(cut.blob), width: cut.width, height: cut.height, spacePx };
			});
			made.then((m) => m === null && this.#strips.delete(key));
			this.#strips.set(key, made);
		}
		return made;
	}

	/**
	 * A dropped scan has arrived and read: open the Loupe once on the first bar to check. Never on a restore (the page calls this
	 * from the arrival of an upload only), never again for the same song (memo finding 8), never when nothing is listed.
	 */
	arrived(): boolean {
		const deps = this.#deps;
		if (!deps) return false;
		const songId = deps.songId();
		const bars = deps.toCheck();
		if (bars.length === 0 || this.#shown.has(songId) || !this.hasScan()) return false;
		this.#shown.add(songId);
		this.#returnTo = typeof document === 'undefined' ? null : document.activeElement;
		deps.openAt(bars[0]);
		this.focusRequest++;
		return true;
	}

	/** The Loupe has closed: focus goes back to where it was before it opened itself (finding 9). */
	closed(): void {
		const el = this.#returnTo as HTMLElement | null;
		this.#returnTo = null;
		if (el && typeof el.focus === 'function' && el.isConnected) el.focus();
	}
}

/** The letter height the strip opens at on a phone, in CSS pixels (memo finding 4: a target to measure on row 114, not a number read). JUDGEMENT. */
export const MIN_LETTER_PX = 18;
/** A lyric letter's height as a share of the staff space (x-height to ascender). JUDGEMENT, not measured. */
export const LETTER_OF_SPACE = 0.8;

/**
 * The width the strip is drawn at, as a multiple of the window's width: 1 shows the whole strip in the window; more, and the strip
 * pans sideways. `pinch` is her own pinch; `zoom` the Loupe's plus and minus (JOINING item 14: one zoom for the strip and the notes).
 * On a phone it opens at least large enough to keep the print's letters at `MIN_LETTER_PX`. Never past the scan's own pixels: the
 * strip is drawn from the stored scan at its own resolution, and enlarging it further would stretch the picture, not show more.
 */
export function stripScale(strip: Pick<PrintStrip, 'width' | 'spacePx'>, windowPx: number, o: { phone: boolean; zoom: number; pinch: number }): number {
	if (!(windowPx > 0) || !(strip.width > 0)) return 1;
	const native = Math.max(1, strip.width / windowPx);
	const letters = LETTER_OF_SPACE * strip.spacePx * (windowPx / strip.width);
	const open = o.phone && letters > 0 && letters < MIN_LETTER_PX ? MIN_LETTER_PX / letters : 1;
	return Math.min(native, Math.max(1, open * o.zoom * o.pinch));
}

/** The first sung note of a song bar, as the page names it: the measure whose number is the bar, else the bar-th measure; null where none. */
export function firstNoteOfBar(measures: readonly { index: number; number: string }[], line: readonly { id: string; type: string; measureIndex: number }[], bar: number): string | null {
	const measure = measures.find((m) => m.number.trim() === String(bar)) ?? measures.find((m) => m.index === bar - 1);
	if (!measure) return null;
	return line.find((ev) => ev.type !== 'rest' && ev.measureIndex === measure.index)?.id ?? null;
}

export const loupePrint = new LoupePrint();
