/**
 * loupe-fit.svelte.ts — the session's state for item 4: each song's fitted size
 * and the zoom. See `loupe-fit.ts` for the ruling and the defaults.
 *
 * Both live here and not in `Loupe.svelte` because that component is created
 * and destroyed on every raise and dismiss (`loupe-panel.svelte.ts` records the
 * same), and both are meant to outlast a raise: a size is set once per song,
 * and the zoom holds for the session. Neither is written to `localStorage`.
 */
import { zoomFactor, ZOOM_LIMIT } from '$lib/score/loupe-fit';

class SongSizes {
	#factors = $state<Record<string, number>>({});
	#pending = new Set<string>();

	/** A song's fitted factor, 1 until its fit has finished. Reading it subscribes. */
	get = (key: string): number => this.#factors[key] ?? 1;

	/** True once for a song that has neither a size nor a fit running: the caller then runs it. */
	begin = (key: string): boolean => {
		if (key in this.#factors || this.#pending.has(key)) return false;
		this.#pending.add(key);
		return true;
	};

	finish = (key: string, factor: number | null): void => {
		this.#pending.delete(key);
		if (factor !== null) this.#factors[key] = factor;
	};
}

class LoupeZoom {
	steps = $state(0);

	get factor(): number {
		return zoomFactor(this.steps);
	}
	get canIn(): boolean {
		return this.steps < ZOOM_LIMIT;
	}
	get canOut(): boolean {
		return this.steps > -ZOOM_LIMIT;
	}
	zoomIn = (): void => {
		if (this.canIn) this.steps += 1;
	};
	zoomOut = (): void => {
		if (this.canOut) this.steps -= 1;
	};
}

export const songSizes = new SongSizes();
export const loupeZoom = new LoupeZoom();
