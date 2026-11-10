/**
 * barline-ui.ts — what the Loupe's Barline cell reads and presses (QUEUE row 138, B3).
 *
 * A SINGLETON THE PAGE ATTACHES, the pattern `loupePrint` and `clefUi` use, so a cell that sits two components below the page needs no prop
 * through each: `Loupe.svelte` and `CorrectionSurface.svelte` are at their line ceilings (`scripts/ratchets.json`), and a prop is six lines
 * across the two. It holds no state of its own. The page lends two functions that read its derived state, so what the cell shows follows
 * the held note exactly as the Rest and Tie cells do.
 */
export interface BarlineUiDeps {
	/** `'add'` where the held note's neighbour is in its bar, `'remove'` where a barline follows it, null where neither is offered. */
	mode(): 'add' | 'remove' | null;
	act(): void;
}

class BarlineUi {
	#deps: BarlineUiDeps | null = null;
	attach(deps: BarlineUiDeps): void {
		this.#deps = deps;
	}
	get mode(): 'add' | 'remove' | null {
		return this.#deps?.mode() ?? null;
	}
	act(): void {
		this.#deps?.act();
	}
}

export const barlineUi = new BarlineUi();
