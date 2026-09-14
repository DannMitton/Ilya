/**
 * system-ground.ts — where a mark goes in a rendered system so the paper does
 * not cover it.
 *
 * SINCE N.133 THE RENDERER PAINTS NO GROUND, so on today's page this always
 * answers "the front of the system", which is under all of the music. It is
 * kept rather than inlined as `firstChild` because the fault it fixed was a
 * mark landing under an opaque full-width rect, and the rule stays correct if
 * any surface ever paints one into a system again.
 *
 * Until N.133 every system `staff-renderer.ts` drew opened with a full-width
 * `<rect>`, the ground, painted in the paper's colour. SVG paints in document
 * order, so anything inserted before the ground is painted UNDER it and cannot
 * be seen. Two marks are inserted into the page's systems from outside the
 * renderer and both want to sit under the music but over the paper:
 * `VoiceProfilePane`'s selection ring, and the loupe's held-measure rectangle.
 *
 * FOUND 2026-09-14, on the N.138 walk, and established with the Browser pane
 * visible on the engraved Without Sun song 1, m. 18, at 1440 × 900. The pane
 * skipped only LEADING full-width rects before inserting its ring, and the loupe
 * put its rectangle at `firstChild`. Once the loupe's rectangle stood first,
 * the pane's skip stopped on it at once, so a ring inserted while the loupe was
 * up landed before the ground: children read held-measure, ring, ground. Taking
 * the D3 eighth by keyboard with the loupe up drew no box on the page and none
 * in the loupe, whose body is a clone of that system. Moving the page's ring
 * after the ground by hand brought the box back on the page alone. The loupe's
 * rectangle stood before the ground in every order observed.
 *
 * THE RULE: insert after the LAST ground, wherever the ground stands among the
 * children, so the answer does not depend on which of the two marks arrived
 * first. Neither mark is ever read as ground, because neither is full width by
 * design and both are named out explicitly in case one ever is.
 */

/** What the rule needs to know about one child of a system. */
export interface SystemChild {
	tagName: string;
	/** The `width` attribute, as a number; NaN where absent. */
	width: number;
	/** A hit rectangle, a selection ring or a held-measure rectangle. */
	marked: boolean;
}

/** How much of the system's width a rect must cover to be its ground. */
const GROUND_SHARE = 0.95;

/**
 * The index a mark is inserted at: one past the last ground among `children`,
 * or 0 when the system paints no ground (N.133 removes it, and then nothing
 * covers the front of the system).
 */
export function afterGroundIndex(children: readonly SystemChild[], systemWidth: number): number {
	let index = 0;
	children.forEach((c, i) => {
		if (c.marked || c.tagName.toLowerCase() !== 'rect') return;
		if (!(systemWidth > 0) || !(c.width >= systemWidth * GROUND_SHARE)) return;
		index = i + 1;
	});
	return index;
}

/** The node to `insertBefore` in a live system: the child just after its ground. */
export function afterGround(system: Element): Element | null {
	const children = [...system.children];
	const index = afterGroundIndex(
		children.map((el) => ({
			tagName: el.tagName,
			width: Number(el.getAttribute('width')),
			marked:
				el.hasAttribute('data-hit') ||
				el.hasAttribute('data-selection-ring') ||
				el.hasAttribute('data-held-measure'),
		})),
		Number(system.getAttribute('width')),
	);
	return children[index] ?? null;
}
