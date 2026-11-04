/**
 * The swipe that sends the Loupe away, and the pointers that must not (row 181 step 6; Fable's memo finding 2).
 *
 * MOVED OUT OF `routes/+page.svelte` (which is at its size ceiling) unchanged in what it does, and given one thing it lacked:
 * it counts the pointers down. The print strip takes a two-finger pinch (`LoupePrintStrip.svelte`); the second finger's
 * `pointerdown` used to overwrite where the gesture began, and the `pointerup` of either finger, 60 px lower, read as the
 * dismiss swipe and closed the Loupe under her hand. While two pointers are down, and for the `pointerup` that ends either, the
 * swipe test is skipped. `onSurface` is the flag the page's tap handlers read ("the gesture began on the loupe or the dock"), so a
 * pinch that drifts onto the drawn notes cannot place a syllable by the click that follows it.
 *
 * THE SWIPE IS THE PHONE'S GESTURE AND STAYS THERE (Dann, slice 4): a mouse dragged down the loupe would dismiss it, which
 * nobody on a desk does on purpose and everybody does by accident while selecting. The desk's ways out are Escape and Close.
 */
import { isDismissSwipe } from '$lib/score/loupe';

export interface SwipeDeps {
	phone(): boolean;
	open(): boolean;
	dismiss(): void;
}

export class LoupeSwipe {
	/** Whether the gesture now in flight started on the loupe or the dock. */
	onSurface = $state(false);
	#from: { x: number; y: number } | null = null;
	#down = new Set<number>();
	#pinch = false;
	#deps: SwipeDeps;

	constructor(deps: SwipeDeps) {
		this.#deps = deps;
	}

	down(e: PointerEvent): void {
		this.#down.add(e.pointerId);
		const el = (e.target as Element | null)?.closest?.('.loupe, .dock');
		if (this.#down.size > 1) {
			// A second finger: a pinch or a two-finger gesture, never the swipe. It began on the surface if either finger did.
			this.#pinch = true;
			this.#from = null;
			this.onSurface = this.onSurface || !!el;
			return;
		}
		this.onSurface = !!el;
		this.#from = el ? { x: e.clientX, y: e.clientY } : null;
	}

	up(e: PointerEvent): void {
		const from = this.#from;
		const pinched = this.#pinch;
		this.#down.delete(e.pointerId);
		if (this.#down.size === 0) this.#pinch = false;
		this.#from = null;
		if (!pinched && this.#deps.phone() && from && this.#deps.open() && isDismissSwipe(e.clientX - from.x, e.clientY - from.y)) this.#deps.dismiss();
		/* Cleared on the NEXT frame, not here. The click that a tap synthesizes arrives after `pointerup`, and the flag has to still be standing when it does. */
		requestAnimationFrame(() => {
			if (this.#down.size === 0) this.onSurface = false;
		});
	}

	/** A gesture the browser takes away, most often to scroll something: it ends without a `pointerup`, so the flag would swallow one page tap. */
	cancel(e?: PointerEvent): void {
		if (e) this.#down.delete(e.pointerId);
		else this.#down.clear();
		if (this.#down.size === 0) this.#pinch = false;
		this.#from = null;
		this.onSurface = false;
	}
}
