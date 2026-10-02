/**
 * The loupe's readings of a system as the page drew it: ink, rests and notes,
 * barlines, the end of the header, and the page-wide survey that sets the
 * frame's height.
 *
 * MOVED OUT OF `Loupe.svelte` by the loupe remainder brief, item 1,
 * 2026-10-02 (`docs/sessions/brief-code-loupe-remainder_r1_2026-09-30.md`),
 * to make room under that file's ratchet ceiling without raising it. A move,
 * not a change: every function and comment below is the one `Loupe.svelte`
 * held at `b709012` (lines 310 to 518), dedented and exported.
 */
import {
	headBound,
	isRestGlyph,
	MUSIC_MARK,
	type PageInk,
	type Vertical,
} from '$lib/score/loupe';

/* ONE CANVAS, MEASURED THE WAY THE GLYPH CELLS ARE. `getBBox` on an SVG
   `<text>` returns the font's LAYOUT box, not its ink, and a survey built
   on it reported systems whose "ink" stood taller than the viewBox that
   contained them. Canvas answers with the inked bounds. */
let inkCanvas: CanvasRenderingContext2D | null = null;

export function textInk(el: Element): { top: number; bottom: number } | null {
	const ctx = (inkCanvas ??= document.createElement('canvas').getContext('2d'));
	if (!ctx) return null;
	const cs = getComputedStyle(el);
	ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
	const m = ctx.measureText(el.textContent ?? '');
	if (!(m.actualBoundingBoxAscent > 0 || m.actualBoundingBoxDescent > 0)) return null;
	const y = Number(el.getAttribute('y'));
	if (!Number.isFinite(y)) return null;
	return { top: y - m.actualBoundingBoxAscent, bottom: y + m.actualBoundingBoxDescent };
}

/* ── THREE READINGS OF A SYSTEM AS DRAWN, shared by the frame and the survey ──
   The frame effect and `pageMetrics` used to walk these each in their own
   copy. N.138 increments 2 and 3 need all three in both places, so they
   live once. */

/** The system's paint order, the `MUSIC_MARK` gate in it, and the music's
    ink from the gate on. The frame effect's ink-walk comment says what is
    skipped and why; this is that walk, moved and unchanged. */
export function musicInk(sys: Element): { nodes: Element[]; gate: number; xs: number[] } {
	const nodes = [...sys.querySelectorAll('*')];
	const gate = nodes.findIndex((el) => el.matches(MUSIC_MARK));
	const xs: number[] = [];
	for (let i = gate; i >= 0 && i < nodes.length; i++) {
		const el = nodes[i];
		if (el.hasAttribute('data-hit') || el.hasAttribute('data-event-id')) continue;
		if (el.hasAttribute('data-selection-ring') || el.hasAttribute('data-bar-number')) continue;
		if (el.closest('[data-analysis]') || el.closest('[data-held-measure]')) continue;
		/* N.139: the page's meter is stripped from the clone, so it is not the
		   music the loupe's own meter panel stands clear of. */
		if (el.closest('[data-meter]')) continue;
		const tacet = el.closest('[data-tacet]');
		if (tacet && tacet !== el) continue;
		let b: DOMRect;
		try {
			b = (el as SVGGraphicsElement).getBBox();
		} catch {
			continue;
		}
		if (b && (b.width || b.height)) xs.push(b.x);
	}
	return { nodes, gate, xs };
}

/** The x of every RESTS-OR-NOTES mark on the system, and of nothing else.
    A note is its event group's own marks (notehead, stem, flag) and what is
    tagged `data-of-event` (accidentals, courtesy parentheses, dots); a rest
    is a bare SMuFL rest glyph, or a multibar rest's group. Underlay, ties,
    slurs and ledger lines carry neither handle and are left out, which is
    the point: the meter panel's run-in is measured to the music, as the
    page measures it (desk ruling, 2026-09-16). */
export function restOrNoteInk(sys: Element): number[] {
	const xs: number[] = [];
	for (const el of sys.querySelectorAll('*')) {
		if (el.closest('[data-analysis]') || el.closest('[data-held-measure]') || el.closest('[data-meter]')) continue;
		if (el.hasAttribute('data-hit') || el.hasAttribute('data-selection-ring') || el.hasAttribute('data-bar-number')) continue;
		const tacet = el.closest('[data-tacet]');
		const isNote = !!el.parentElement?.hasAttribute('data-event-id') || el.hasAttribute('data-of-event');
		const isRest = tacet ? tacet === el : el.tagName === 'text' && !el.closest('[data-event-id]') && isRestGlyph(el.textContent);
		if (!isNote && !isRest) continue;
		try {
			const b = (el as SVGGraphicsElement).getBBox();
			if (b && (b.width || b.height)) xs.push(b.x);
		} catch {
			/* not rendered */
		}
	}
	return xs;
}

/** The barlines, found as drawn: every vertical that spans exactly the
    staff, the staff's extent taken from the hit rectangle. Slice 3 §11's
    test, with the stroke width kept so a crop can end on a line's edge. */
export function staffVerticals(sys: Element, staffTop: number, gap: number): Vertical[] {
	const staffBottom = staffTop + 4 * gap;
	const tol = gap * 0.3;
	const out: Vertical[] = [];
	for (const el of sys.querySelectorAll('line')) {
		/* A STEM IS NOT A BARLINE, and a stem can span the staff to within
		   the tolerance. MEASURED 2026-09-15 on Kabalevsky T05, m. 15: a stem
		   at x = 151.85 runs 85.88 to 106.95 against a staff of 85 to 107,
		   so the closing search took it and the loupe showed 12.25 units of
		   an 80-unit measure. A barline is never inside a note's group, a
		   stem always is, so the group is the test. Since `8bb406c`. */
		if (el.closest('[data-event-id]') || el.closest('[data-analysis]')) continue;
		const x1 = Number(el.getAttribute('x1'));
		if (Math.abs(x1 - Number(el.getAttribute('x2'))) > 0.01) continue;
		const y1 = Number(el.getAttribute('y1'));
		const y2 = Number(el.getAttribute('y2'));
		if (Math.abs(Math.min(y1, y2) - staffTop) > tol) continue;
		if (Math.abs(Math.max(y1, y2) - staffBottom) > tol) continue;
		out.push({ x: x1, width: Number(el.getAttribute('stroke-width')) || 0 });
	}
	return out;
}

/** Where the header ends: the right edge of the clef and of the key
    signature's last accidental, as drawn. `-Infinity` where neither is
    marked. The key signature's handle is `data-key-signature`, N.138
    increment 2. */
export function headerRightOf(sys: Element): number {
	let right = -Infinity;
	for (const el of sys.querySelectorAll('[data-clef], [data-key-signature]')) {
		let b: DOMRect;
		try {
			b = (el as SVGGraphicsElement).getBBox();
		} catch {
			continue;
		}
		if (b && (b.width || b.height)) right = Math.max(right, b.x + b.width);
	}
	return right;
}

/** Remembered per page, so a step does not re-survey the whole score. */
const surveys = new WeakMap<Element, { signature: string; metrics: PageInk }>();

export function pageMetrics(container: Element): PageInk | null {
	const systems = [...container.querySelectorAll('[data-system]')];
	const signature = systems.map((el) => el.getAttribute('viewBox') ?? '').join('|');
	const held = surveys.get(container);
	if (held && held.signature === signature) return held.metrics;

	let above = -Infinity;
	let below = -Infinity;
	let minTotalSpan = Infinity;
	for (const sys of systems) {
		const hit = sys.querySelector('[data-hit]');
		if (!hit) continue;
		const hitH = Number(hit.getAttribute('height'));
		const gap = hitH / 11;
		const staffTop = Number(hit.getAttribute('y')) + 3.5 * gap;
		const sysWidth = Number(sys.getAttribute('width'));
		if (!(gap > 0) || !Number.isFinite(staffTop)) continue;
		for (const el of sys.querySelectorAll('*')) {
			if (el.tagName === 'g') continue;
			/* WHAT THE LOUPE DOES NOT DRAW CANNOT SET ITS FRAME. The hit
			   rectangles, the page's own held rectangle and the analysis
			   layer are all stripped from the clone, so a phonation break
			   standing above the staff must not push the frame open for ink
			   the loupe then removes. The paper behind the system was skipped
			   here by its width until N.133 took it out of the renderer. */
			if (el.closest('[data-analysis]') || el.closest('[data-held-measure]')) continue;
			/* The page's selection ring is the pane's mark, not engraving, and
			   the clone drops it — so it must not size the frame either. */
			if (el.hasAttribute('data-selection-ring')) continue;
			/* N.126's measure numbers are stripped from the clone too. */
			if (el.hasAttribute('data-bar-number')) continue;
			if (el.tagName === 'rect' && el.hasAttribute('data-hit')) continue;
			let top: number;
			let bottom: number;
			if (el.tagName === 'text') {
				const ink = textInk(el);
				if (!ink) continue;
				({ top, bottom } = ink);
			} else {
				let b: DOMRect;
				try {
					b = (el as SVGGraphicsElement).getBBox();
				} catch {
					continue;
				}
				if (!b || (!b.width && !b.height)) continue;
				top = b.y;
				bottom = b.y + b.height;
			}
			above = Math.max(above, staffTop - top);
			below = Math.max(below, bottom - staffTop);
		}

		/* The system's measures, off its barlines. The same vertical test
		   the held measure's own boundary search uses: a barline is the
		   vertical that spans the staff exactly. */
		const bars = staffVerticals(sys, staffTop, gap).map((v) => v.x);
		const heads = [...sys.querySelectorAll('[data-hit]')].map((el) => Number(el.getAttribute('x')));
		const head = heads.length > 0 ? Math.max(0, Math.min(...heads)) : 0;
		const edges = [head, ...bars.sort((a, b) => a - b), sysWidth];
		/* N.138 INCREMENT 2 SHORTENS THE HEAD, so this has to stay a LOWER
		   bound on what the frame draws or a narrow measure would draw taller
		   than the window cut for it. The frame draws the header up to its last
		   glyph, then a meter, then any carried band, then the body from the
		   head's bound or the barline, then the tail: at least the header plus
		   the body. The first measure's body opens where `clipToHead` opens it,
		   at the later of its hit rectangle and the head's bound. */
		const headerRight = headerRightOf(sys);
		const bound = headBound(musicInk(sys).xs);
		const headTerm = Number.isFinite(headerRight) ? Math.min(headerRight, head) : head;
		for (let i = 0; i < edges.length - 1; i++) {
			/* The window's left edge sits half a gap inside the barline it
			   opens on, as the crop does; the first measure of a system
			   opens on the head and moves nothing. */
			const left = i === 0 ? Math.max(edges[0], bound) : edges[i] + gap * 0.5;
			const span = edges[i + 1] - left;
			if (span < gap) continue;
			minTotalSpan = Math.min(minTotalSpan, headTerm + span);
		}
	}
	if (!Number.isFinite(above) || !Number.isFinite(below)) return null;
	const metrics = { above, below, minTotalSpan };
	surveys.set(container, { signature, metrics });
	return metrics;
}
