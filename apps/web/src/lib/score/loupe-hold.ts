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
 * ACROSS, BY THE RING, or by the hit rectangle where there is none, as a rest
 * has none. DOWN, BY THE NOTE'S OWN INK, never the ring: the ring runs from
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
	id: string,
	ring: { x: number; width: number } | null,
	pad: { across: number; down: number },
): void {
	const body = win.querySelector('.loupe-body');
	const hit = body?.querySelector(`[data-loupe-hit="${CSS.escape(id)}"]`);
	const strip = win.querySelector('.loupe-strip');
	if (!body || !hit || !strip) return;
	const s = strip.getBoundingClientRect();
	const h = hit.getBoundingClientRect();
	const [left, right] = ring ? [ring.x, ring.x + ring.width] : [h.left - s.left, h.right - s.left];
	win.scrollLeft = followScroll(win.scrollLeft, win.clientWidth, left, right, pad.across);

	/* A GLYPH'S CLIENT RECT IS ITS FONT'S LAYOUT BOX, not its ink (the trap
	   `Loupe.svelte`'s `textInk` records for `getBBox`): MEASURED, F♯6's
	   notehead reported 350 to 543 px. So a `<text>` is read at its own `y`,
	   the notehead's staff position, half a stave space either side. */
	const lines = [...body.querySelectorAll(':scope > g:first-of-type > line')].map((l) => l.getBoundingClientRect());
	const staveTop = lines.length ? Math.min(...lines.map((b) => b.top)) : h.top;
	const staveBottom = lines.length ? Math.max(...lines.map((b) => b.bottom)) : h.bottom;
	const half = lines.length === 5 ? (staveBottom - staveTop) / 8 : 0;
	const group = body.querySelector(`[data-event-id="${CSS.escape(id)}"]`);
	const spans = [
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
	let top = (spans.length ? Math.min(...spans.map((v) => v[0])) : h.top) - s.top;
	let bottom = (spans.length ? Math.max(...spans.map((v) => v[1])) : h.bottom) - s.top;
	const room = win.clientHeight - pad.down * 2;
	if (bottom - top > room) {
		const staveMid = (staveTop + staveBottom) / 2 - s.top;
		if ((top + bottom) / 2 > staveMid) top = bottom - room;
		else bottom = top + room;
	}
	win.scrollTop = followScroll(win.scrollTop, win.clientHeight, top, bottom, pad.down);
}
