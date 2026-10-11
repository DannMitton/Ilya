/**
 * crossing-ring.ts — Markup's red crossing squircle, in the selection ring's
 * shape (QUEUE row 34).
 *
 * Dann, 2026-10-05 06:55, on a picture of Markup: "The squircle is supposed to
 * highlight a formant/harmonic interaction. Right now it highlights an
 * isolated notehead. Please adopt the Loupe's squircle treatment for Markup."
 * The crossing is about a note's VOWEL at that pitch, so the ring holds the
 * note and its IPA syllable, as the selection ring does.
 *
 * ONE GEOMETRY (DESK DEFAULT in the brief). The box is `ringBox`'s, the very
 * function the selection ring and the loupe read, so this file computes no
 * squircle of its own. `ringBox` measures the rendered ink, which is why the
 * ring is drawn here, on the page, and no longer by `staff-renderer.ts`: the
 * renderer emits a string and has no ink to measure.
 *
 * THE PAGE'S RULE, NOT THE LOUPE'S (`OPEN.md` §N.141): the ring never
 * re-spaces the music, and a collision with a neighbour's accidental is
 * accepted. It goes under the music, at the front of its system, as the
 * selection ring does; when the taken note is also a crossing, the two share
 * one box and the selection ring draws over the red (`selectionAnchor`).
 *
 * WHAT IT KEEPS: the colour `#b23b3b`, which carries "crossing"; the stroke
 * weight 1.8; and the handle `data-analysis="crossing"`, by which the loupe and
 * the ink survey drop analysis marks. A crossing that rests on a placeholder
 * fR1 is dashed and carries `data-placeholder` (QUEUE row 69).
 *
 * PRINTS AS IT SHOWS (WYSIWYG): the ring is an element of the page's SVG, not
 * a screen-only overlay, and nothing hides it in print.
 */
import { PLACEHOLDER_DASH } from '@ilya/score-parser';
import { entryGroup, RING_RADIUS, ringBox, type RingBox } from './selection-ring';
import { afterGround } from './system-ground';

/** The crossing's ink, unchanged from the renderer's rectangle. */
export const CROSSING_INK = '#b23b3b';
/** Its stroke, unchanged; the selection ring's is `RING_STROKE` (2). */
export const CROSSING_STROKE = 1.8;

/** A note the analysis says crosses, and whether its fR1 is a placeholder. */
export interface Crossing {
	id: string;
	placeholder: boolean;
}

/** The ring's attributes for a box. Pure, so the unit suite can read it. */
export function crossingRingAttributes(box: RingBox, placeholder: boolean): Array<[string, string]> {
	return [
		['data-analysis', 'crossing'],
		['data-crossing-ring', ''],
		['x', String(box.x)],
		['y', String(box.y)],
		['width', String(box.width)],
		['height', String(box.height)],
		['rx', String(RING_RADIUS)],
		['fill', 'none'],
		['stroke', CROSSING_INK],
		['stroke-width', String(CROSSING_STROKE)],
		...(placeholder
			? ([
					['data-placeholder', 'true'],
					['stroke-dasharray', PLACEHOLDER_DASH],
				] as Array<[string, string]>)
			: []),
	];
}

/**
 * Remove every crossing ring under `root` and draw one for each crossing, in
 * its note's system. Returns how many were drawn. A note with no hit rectangle
 * or no measurable ink draws none, as the selection ring does.
 */
export function drawCrossingRings(root: ParentNode, crossings: Iterable<Crossing>): number {
	for (const el of root.querySelectorAll('[data-crossing-ring]')) el.remove();
	let drawn = 0;
	for (const c of crossings) {
		const hit = root.querySelector(`[data-hit="${CSS.escape(c.id)}"]`);
		const group = hit ? entryGroup(hit) : null;
		const sysEl = group?.closest('[data-system]');
		const box = hit && group ? ringBox(hit, group, c.id) : null;
		if (!sysEl || !box) continue;
		const ring = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		for (const [k, v] of crossingRingAttributes(box, c.placeholder)) ring.setAttribute(k, v);
		sysEl.insertBefore(ring, afterGround(sysEl));
		drawn++;
	}
	return drawn;
}

/** Where a selection ring goes in `children`: past any crossing rings at the front, so it draws over them. */
export function selectionAnchorIndex(children: ReadonlyArray<{ crossing: boolean }>, from: number): number {
	let i = from;
	while (i < children.length && children[i].crossing) i++;
	return i;
}

/** The node to `insertBefore` for the selection ring: after the ground and after every crossing ring. */
export function selectionAnchor(system: Element): Element | null {
	const start = afterGround(system);
	const children = [...system.children];
	const from = start ? children.indexOf(start) : children.length;
	return children[selectionAnchorIndex(children.map((el) => ({ crossing: el.hasAttribute('data-crossing-ring') })), from)] ?? null;
}
