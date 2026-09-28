/**
 * loupe-hold.ts — the card's width while the singer stays on one measure.
 *
 * RATIFIED BY DANN 2026-09-27 20:07, offered by the desk
 * (`docs/memory/STATE.md`, item 4; calm-loupe brief §4): while the singer
 * stays on one measure the frame may grow but never shrinks; growth is eased
 * over about 150 ms, none under reduced motion; both reset on a new measure
 * or a close. The frame opens tight to its contents, as clause 12 rules.
 *
 * WHAT STILL GROWS IT, after calm-loupe slice 3 took the selection and the
 * mode out of the width: a change to the drawing itself. An accidental, a
 * note stepped onto a ledger line, or an entry entered or deleted re-renders
 * the measure and re-derives its spacing (`Loupe.svelte`, the spacing key).
 *
 * THE KEY IS THE MEASURE AND THE ROOM. A new measure starts over, and so
 * does a resized window or a drawer that changes width, because the room is
 * the ceiling the width was clamped under and a held width from a wider room
 * could stand past the new one. The notation face is in the key too: the
 * first frame of a raise is drawn before the face resolves, with no meter
 * panel, and the face lands about 2 ms later (MEASURED, «Скучай» m. 6, 586.8
 * then 624.4 px), which must land at once rather than ease as a growth. A
 * close needs nothing here: `<Loupe>` is destroyed on every dismiss, and its
 * hold with it.
 */
import { CYR_FONT_SIZE } from '@ilya/score-parser';

export class GrowOnlyWidth {
	#key: string | null = null;
	#width = 0;

	/**
	 * The width to draw at, and whether a change to it should ease. `eased` is
	 * true on every frame after the first on the same key, so a growth eases
	 * and a first frame on a new measure lands at once.
	 */
	hold(key: string, width: number): { width: number; eased: boolean } {
		const same = this.#key === key;
		this.#width = same ? Math.max(this.#width, width) : width;
		this.#key = key;
		return { width: this.#width, eased: same };
	}
}

/**
 * Where the music window's scroll should stand so the span `[left, right]`
 * (strip pixels) is in view with `pad` of air, moving as little as it can.
 *
 * THE WINDOW FOLLOWS THE SELECTED NOTE (calm-loupe slice 4). A measure wider
 * than the window scrolls sideways (clause 8, amended 2026-09-28), and until
 * this nothing brought the taken note into view: MEASURED on «Скучай» m. 3,
 * a 1,298 px strip in a 907 px window, so its right 391 px, the closing
 * barline among them, stood out of view whichever note was taken. A span
 * already in view does not move the scroll, so stepping inside it is still.
 */
export function followScroll(scrollLeft: number, viewWidth: number, left: number, right: number, pad: number): number {
	if (left - pad < scrollLeft) return Math.max(0, left - pad);
	if (right + pad > scrollLeft + viewWidth) return Math.max(0, right + pad - viewWidth);
	return scrollLeft;
}

/**
 * The music window's height while the singer stays on one measure: the first
 * height drawn on the key, held. DIRECTION AGREED WITH DANN 2026-09-27 21:22
 * to 21:46 (the scroll was his proposal, extending ruling 6 of 2026-09-20):
 * the window holds its height; a note stepped beyond it scrolls inside the
 * window, which follows the selected note; the card and its buttons never
 * move. MEASURED before (calm-loupe slice 5), «Скучай» m. 3, F♯4 stepped down
 * three octaves: the window grew 225 to 328 px and the correction buttons
 * moved 52 px down under the pointer.
 */
export class HeldHeight {
	#key: string | null = null;
	#height = 0;

	hold(key: string, height: number): number {
		if (this.#key !== key) {
			this.#key = key;
			this.#height = height;
		}
		return this.#height;
	}
}

/**
 * Bring the taken entry into the window, across and down. Called after
 * `tick()`: the frame is set in an effect and drawn a flush later, so a
 * measure just raised has no hit rectangle in the DOM until then (MEASURED:
 * stepping Left into «Скучай» m. 2 landed on its closing rest at scroll 0,
 * the rest 1,101 px into a 907 px window).
 *
 * ACROSS, BY THE RING, or by the hit rectangle where there is none. A rest
 * has a ring since calm-loupe slice 7, and a gap is followed by its caret's
 * ring alone (`id` null). DOWN, BY THE NOTE'S OWN INK, never the ring: the ring runs from
 * above the stave to the IPA row, and at a far note it is taller than the
 * window (MEASURED, «Скучай» m. 3, F♯4 walked to F♯1: ring 232 px, window
 * 225), so following it cannot promise the notehead. Where the ink is taller
 * than the window (ledger lines and a stem), the end farthest from the stave
 * is kept, which is where the notehead is. MEASURED after: the notehead in
 * view from F♯1 to F♯6 (630 and 447 px, window 419 to 644).
 *
 * THE VERTICAL SCROLL IS SET HERE AND NOWHERE ELSE. The window keeps
 * `overflow-y: hidden`, so no finger drag scrolls it and the vertical swipe
 * still dismisses the loupe (desk default, calm-loupe brief §4).
 */
export function followEntry(
	win: HTMLElement,
	id: string | null,
	ring: { x: number; width: number } | null,
	pad: { across: number; down: number },
): void {
	const body = win.querySelector('.loupe-body');
	const strip = win.querySelector('.loupe-strip');
	if (!body || !strip) return;
	const s = strip.getBoundingClientRect();
	const hit = id === null ? null : body.querySelector(`[data-loupe-hit="${CSS.escape(id)}"]`);
	if (id !== null && !hit) return;
	const h = hit?.getBoundingClientRect() ?? null;
	/* A GAP HAS NO ENTRY, only its caret's ring (calm-loupe slice 7), so it is
	   followed across by that ring and down by the caret, which spans the stave. */
	const across = ring ? [ring.x, ring.x + ring.width] : h ? [h.left - s.left, h.right - s.left] : null;
	if (across) win.scrollLeft = followScroll(win.scrollLeft, win.clientWidth, across[0], across[1], pad.across);

	/* A GLYPH'S CLIENT RECT IS ITS FONT'S LAYOUT BOX, not its ink (the trap
	   `Loupe.svelte`'s `textInk` records for `getBBox`): MEASURED, F♯6's
	   notehead reported 350 to 543 px. So a `<text>` is read at its own `y`,
	   the notehead's staff position, half a stave space either side. */
	const lines = [...body.querySelectorAll(':scope > g:first-of-type > line')].map((l) => l.getBoundingClientRect());
	const staveTop = lines.length ? Math.min(...lines.map((b) => b.top)) : h?.top;
	const staveBottom = lines.length ? Math.max(...lines.map((b) => b.bottom)) : h?.bottom;
	if (staveTop === undefined || staveBottom === undefined) return;
	const half = lines.length === 5 ? (staveBottom - staveTop) / 8 : 0;
	const group = id === null ? null : body.querySelector(`[data-event-id="${CSS.escape(id)}"]`);
	/* A caret's arrowheads stand 0.6 of a space, 1.2 half-spaces, past the stave. */
	const spans: [number, number][] =
		id === null
			? [[staveTop - 1.2 * half, staveBottom + 1.2 * half]]
			: [
					...(group ? [...group.children].filter((c) => !c.hasAttribute('data-loupe-hit')) : []),
					...body.querySelectorAll(`[data-of-event="${CSS.escape(id)}"]`),
				].flatMap((el): [number, number][] => {
					if (el instanceof SVGTextElement) {
						const ctm = el.getScreenCTM();
						const y = ctm ? new DOMPoint(0, Number(el.getAttribute('y'))).matrixTransform(ctm).y : NaN;
						return Number.isFinite(y) ? [[y - half, y + half]] : [];
					}
					const b = el.getBoundingClientRect();
					return b.height > 0 ? [[b.top, b.bottom]] : [];
				});
	let top = (spans.length ? Math.min(...spans.map((v) => v[0])) : h!.top) - s.top;
	let bottom = (spans.length ? Math.max(...spans.map((v) => v[1])) : h!.bottom) - s.top;
	const room = win.clientHeight - pad.down * 2;
	if (bottom - top > room) {
		const staveMid = (staveTop + staveBottom) / 2 - s.top;
		if ((top + bottom) / 2 > staveMid) top = bottom - room;
		else bottom = top + room;
	}
	const followed = followScroll(win.scrollTop, win.clientHeight, top, bottom, pad.down);
	const rows = underlayRows(body).map(([a, b]): [number, number] => [a - s.top, b - s.top]);
	win.scrollTop = cleanEdges(
		followed,
		win.clientHeight,
		[top, bottom],
		rows,
		pad.down,
		win.scrollHeight - win.clientHeight,
	);
}

/**
 * The underlay's rows, IPA and Cyrillic, each as one band of INK in client
 * pixels, top to bottom. A syllable's ink is read from the face's measured
 * glyph extents on a canvas, not from its client rect, which is the font's
 * layout box (the trap `followEntry` records above). The hyphens, extenders,
 * and withheld sigla stand on those rows and widen the band they fall in.
 */
function underlayRows(body: Element): [number, number][] {
	const ctx = (rowCanvas ??= document.createElement('canvas').getContext('2d'));
	const spans: [number, number][] = [];
	for (const t of body.querySelectorAll('text')) {
		if (!t.hasAttribute('data-ipa-of') && Number(t.getAttribute('font-size')) !== CYR_FONT_SIZE) continue;
		const ctm = t.getScreenCTM();
		const y = Number(t.getAttribute('y'));
		if (!ctx || !ctm || !Number.isFinite(y)) continue;
		const cs = getComputedStyle(t);
		ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
		const m = ctx.measureText(t.textContent ?? '');
		const a = new DOMPoint(0, y - m.actualBoundingBoxAscent).matrixTransform(ctm).y;
		const b = new DOMPoint(0, y + m.actualBoundingBoxDescent).matrixTransform(ctm).y;
		if (b > a) spans.push([a, b]);
	}
	for (const el of body.querySelectorAll('[data-withheld], [data-hyphen], [data-extender]')) {
		const r = el.getBoundingClientRect();
		if (r.height > 0 || r.width > 0) spans.push([r.top, r.bottom]);
	}
	/* One band per row: spans whose extents overlap merge. */
	spans.sort((p, q) => p[0] - q[0]);
	const rows: [number, number][] = [];
	for (const [a, b] of spans) {
		const last = rows[rows.length - 1];
		if (last && a <= last[1]) last[1] = Math.max(last[1], b);
		else rows.push([a, b]);
	}
	return rows;
}
let rowCanvas: CanvasRenderingContext2D | null = null;

/**
 * Move the scroll the least it can so that no underlay row is cut by the
 * window's top or bottom edge, keeping `span` (the taken entry) in view with
 * `pad` of air. Calm-loupe slice 7, observation 3: at E1 the window followed
 * the note down and left fragments of the IPA and lyric rows at its bottom
 * edge. MEASURED on «Скучай» m. 25 (treble copy), window 225 px: stepping up
 * from E1, the IPA row straddled the bottom edge from G1 to D2 (at A1, ink
 * 216 to 242 px).
 *
 * A CUT ROW LEAVES THE WINDOW, WHOLE. Moving the edge off the row, away from
 * the note, keeps as much of the stave in view as the follow allowed; only
 * where the note stands too near the row for that does the window take the
 * row in whole instead. Where neither keeps `pad` of air around the note, the
 * air gives way before the glyph does: both are tried again with a pixel of
 * air (MEASURED at A6, same measure: the Cyrillic row overhung the bottom edge
 * by 1.6 px, and taking it in left the note 6.2 px from the top edge). Where
 * even that fails, the follow stands: the note wins, as slice 5 rules.
 *
 * AN OVERHANG UNDER A PIXEL IS NOT A CUT. The ink is read from the face's
 * metrics, which Chrome rounds to whole pixels (`selection-ring.ts` records
 * the same of the IPA face's descent). CODE DEFAULT, reversible.
 */
export function cleanEdges(
	scrollTop: number,
	viewHeight: number,
	span: readonly [number, number],
	rows: readonly (readonly [number, number])[],
	pad: number,
	maxScroll: number = Infinity,
): number {
	const holds = (st: number, air: number) =>
		st >= 0 && st <= maxScroll && span[0] >= st + air && span[1] <= st + viewHeight - air;
	const straddles = ([a, b]: readonly [number, number], edge: number) => a < edge - 1 && b > edge + 1;
	let st = scrollTop;
	for (let guard = 0; guard < rows.length * 2 + 1; guard++) {
		const bottomCut = rows.find((r) => straddles(r, st + viewHeight));
		const topCut = rows.find((r) => straddles(r, st));
		const cut = bottomCut ?? topCut;
		if (!cut) return st;
		const [a, b] = cut;
		/* A pixel of air between the edge and a row that leaves. */
		const [leave, take] = cut === bottomCut ? [a - 1 - viewHeight, b - viewHeight] : [b + 1, a];
		const next = [pad, 1].flatMap((air) => [leave, take].filter((c) => holds(c, air)))[0];
		if (next === undefined) return st;
		st = next;
	}
	return st;
}
