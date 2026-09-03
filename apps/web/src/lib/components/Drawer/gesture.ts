/**
 * gesture.ts — THE SWIPE THAT RAISES AND LOWERS THE DRAWER.
 *
 * N.108 increment 1a, ruled by Dann 2026-09-02: on the phone "a vertical
 * swipe in the motion's direction is a second way, and it must not fire while
 * the loupe is up or a station body is scrolling."
 *
 * A SECOND WAY, NOT THE WAY. The pull is the control; this is the shortcut a
 * thumb already knows. So every threshold here errs toward NOT firing: a
 * gesture that is ambiguous belongs to whatever is under it, and the singer
 * still has a 44 px labelled bar.
 *
 * PLAIN TYPESCRIPT, NO DOM. The decision is here and the measuring is in
 * `Drawer.svelte`, which is the split `sections.svelte.ts` already keeps and
 * for the same reason: this repository's vitest runs in the `node`
 * environment, so anything with a decision in it has to be reachable without
 * a browser. `canScrollFurther` is the caller's reading of the DOM, handed in
 * as a fact.
 */

/** What a touch did, measured from `touchstart` to `touchend`. */
export interface SwipeMove {
	/** Rightward is positive. */
	dx: number;
	/** DOWNWARD IS POSITIVE, which is the screen's own axis, not the drawer's. */
	dy: number;
	/** Milliseconds from first contact to last. */
	ms: number;
}

/** What the drawer should do, or nothing. */
export type SwipeVerdict = 'up' | 'down' | null;

/**
 * THE FLOOR, IN PIXELS. Below this the gesture is a tap with a tremor in it.
 * 60 is about a thumb's comfortable travel and is well clear of the 10 px a
 * press wobbles by; it is this file's own number and no ruling names one.
 */
export const MIN_TRAVEL = 60;

/**
 * HOW MUCH MORE VERTICAL THAN HORIZONTAL. A drawer that rises on a diagonal
 * would fight every sideways gesture the page has. Two to one is the ordinary
 * value for this and it is stated here rather than buried in the expression.
 */
export const DOMINANCE = 2;

/**
 * THE CEILING, IN MILLISECONDS. A slow drag down a long body is a scroll that
 * happened to end lower than it started, not a swipe. Above this the gesture
 * is not read at all.
 */
export const MAX_DURATION = 600;

/** What the caller knows that this file cannot see. */
export interface SwipeContext {
	/**
	 * The loupe has the screen. Dann's ruling names it: the swipe must not
	 * fire while the loupe is up. The loupe is surgery on a note and the
	 * drawer arriving over it would take the singer out of it.
	 */
	blocked: boolean;
	/**
	 * Whether the box the touch began in can still scroll in the direction
	 * the thumb went. Dann's second exclusion, "a station body is scrolling":
	 * a body scrolled halfway down belongs to the body until it reaches its
	 * end. `Drawer.svelte` walks the ancestors and answers this.
	 */
	canScrollFurther: boolean;
}

/**
 * Read a touch. Returns the direction the drawer should travel, or `null`.
 *
 * THE ORDER OF THE TESTS IS THE ORDER OF THE RULING: what Dann excluded is
 * excluded first, then the shape of the gesture. A blocked gesture is never
 * measured, so no threshold can accidentally let one through.
 */
export function readSwipe(move: SwipeMove, context: SwipeContext): SwipeVerdict {
	if (context.blocked) return null;
	if (context.canScrollFurther) return null;
	if (move.ms > MAX_DURATION) return null;
	const travel = Math.abs(move.dy);
	if (travel < MIN_TRAVEL) return null;
	if (travel < DOMINANCE * Math.abs(move.dx)) return null;
	return move.dy > 0 ? 'down' : 'up';
}
