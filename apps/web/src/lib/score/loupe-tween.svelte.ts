/**
 * loupe-tween.svelte.ts — the tween between the loupe's two modes.
 *
 * Loupe remainder brief, item 1, 2026-10-02
 * (`docs/sessions/brief-code-loupe-remainder_r1_2026-09-30.md`).
 *
 * ── THE RULING ──────────────────────────────────────────────────────────
 * `docs/memory/OPEN.md`, THE LOUPE'S TWO MODES, ruling 3, ruled by Dann on
 * the walk of 2026-09-19 into 2026-09-20, refining clause 14 (2026-09-18):
 * *"having those carets fade in should intuitively tell the user that they
 * are controls interleaved with the notes on the page."* The tween runs
 * Syllables to Corrections, both directions. The brief restates its terms:
 * the carets fade in to 0.32; the perimeter moves on the same curve, about
 * 220 ms in and 150 ms out; the mode toggle is locked while it runs; Escape,
 * the swipe, and the chevron stay live; `prefers-reduced-motion` is honoured.
 *
 * ── WHAT MOVES, AND WHAT DOES NOT ───────────────────────────────────────
 * THE CARETS FADE. They are always drawn into the strip, and a class on the
 * body panel (`Loupe.svelte`, `.carets-on`) fades them between 0 and 1 over
 * the 0.32 their own group already carries. The CSS rule for the two
 * durations is in that file's stylesheet, and the numbers here are the ones
 * it states.
 *
 * THE PERIMETER MOVES. The card's outline changes when the panel region under
 * the bar changes height: a mode swap swaps its content, and the chevron
 * opens or shuts it. `animatePanel` runs that change as a height animation on
 * the same curve, from the height before the DOM changed to the height after.
 * The Web Animations API is used because the panel's height is `auto`, which
 * a CSS transition cannot start from.
 *
 * THE NOTES AND RESTS DO NOT MOVE, because the tree gives both modes one
 * spacing: `Loupe.svelte` places the carets in both modes and derives the
 * measure's spacing from them, so the card's width and every note's x are the
 * same in either (calm-loupe slice 3, 2026-09-28). The ruling's "notes and
 * rests move" has nothing to act on today. If Corrections is meant to open
 * the notes wider than Syllables does (ruling 4: *"Corrections necessarily
 * carries more generous spacing"*), that is a change to the spacing and
 * would be built here as a second tween; it is reported, not assumed.
 */

/** The tween in, toward Corrections, in milliseconds. OPEN.md, the loupe's two modes, ruling 3, as the brief restates it. */
export const TWEEN_IN_MS = 220;
/** The tween out, toward Syllables, in milliseconds. */
export const TWEEN_OUT_MS = 150;
/** The one curve, for the carets and the perimeter alike. CODE DEFAULT: `ease-out`, the curve `loupe-rise` already uses. */
export const TWEEN_EASING = 'ease-out';

export type TweenDirection = 'in' | 'out';

/** What the loupe shows: whether the carets are drawn, and whether the panel is open. */
export interface TweenState {
	carets: boolean;
	panel: boolean;
}

/**
 * Which way a change runs, or null where nothing changed. A change in the
 * carets decides it, since they are what the ruling is about: they appearing
 * is in, and going is out. A change in the panel alone (the chevron in
 * Syllables mode) opens as in and shuts as out.
 */
export function tweenDirection(before: TweenState, next: TweenState): TweenDirection | null {
	if (before.carets !== next.carets) return next.carets ? 'in' : 'out';
	if (before.panel !== next.panel) return next.panel ? 'in' : 'out';
	return null;
}

export function tweenMs(direction: TweenDirection): number {
	return direction === 'in' ? TWEEN_IN_MS : TWEEN_OUT_MS;
}

/** Whether the system asks for no motion. */
export function reducedMotion(): boolean {
	return typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
}

/**
 * The tween's state: which way it runs, and so whether the mode toggle is
 * locked. Under reduced motion `update` starts nothing, so nothing locks.
 * Fields are `$state`, so a template reading `direction` or `locked` re-runs
 * when the tween starts and when its timer ends it.
 */
export class ModeTween {
	direction = $state<TweenDirection | null>(null);
	#seen: TweenState | null = null;
	#timer: ReturnType<typeof setTimeout> | undefined;

	/** The mode toggle is locked while this is true. Escape, the swipe, and the chevron never read it. */
	get locked(): boolean {
		return this.direction !== null;
	}

	/**
	 * Called with the loupe's state each time it may have changed. The first
	 * call only records it, so a loupe raised in Syllables with its panel shut
	 * does not start a tween. Returns the direction a change began, or null.
	 */
	update(next: TweenState, reduced: boolean): TweenDirection | null {
		const before = this.#seen;
		this.#seen = { ...next };
		if (!before || reduced) return null;
		const direction = tweenDirection(before, next);
		if (!direction) return null;
		this.direction = direction;
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => (this.direction = null), tweenMs(direction));
		return direction;
	}

	/** The loupe is going away. */
	dispose(): void {
		clearTimeout(this.#timer);
		this.direction = null;
	}
}

/**
 * Move the card's perimeter: animate the panel region's height from `before`
 * (read before the DOM changed) to what it is now. Nothing runs where the
 * heights agree, where the browser has no `animate`, or under reduced motion.
 */
export function animatePanel(el: HTMLElement, before: number, direction: TweenDirection | null): void {
	if (!direction || typeof el.animate !== 'function') return;
	const after = el.offsetHeight;
	if (Math.abs(after - before) < 1) return;
	el.animate([{ height: `${before}px` }, { height: `${after}px` }], {
		duration: tweenMs(direction),
		easing: TWEEN_EASING,
	});
}
