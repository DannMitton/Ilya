/**
 * The chart's view in motion (N.199 Step 4c): an eased move from the view it is in to another, over a time, or at once. One move at a
 * time; a new one starts from wherever the last had got to. The clock and the frame scheduler are injected, so a test runs it without a
 * browser. Under reduced motion the caller asks for `ms = 0`, which sets the view with no animation at all.
 */
import { mixView, type View } from './geometry';

/** The zoom in runs under the first sung beat (1 s, `count-in.ts` `SING_BEAT_MS`). */
export const ZOOM_IN_MS = 1000;
/** The move back out when a take ends without a reading (a cancel or an error): quicker than the landing's. */
export const ZOOM_OUT_QUICK_MS = 400;

export interface Scheduler {
	now(): number;
	request(fn: () => void): number;
	cancel(id: number): void;
}

export const browserScheduler: Scheduler = {
	now: () => performance.now(),
	request: (fn) => requestAnimationFrame(fn),
	cancel: (id) => cancelAnimationFrame(id)
};

export interface ViewMotion {
	/** Move to `target` over `ms` (0, or less: at once). */
	to(target: View, ms: number): void;
	/** Set the view with no motion, and end any move. */
	set(view: View): void;
	readonly running: boolean;
	stop(): void;
}

export function createViewMotion(initial: View, onView: (v: View) => void, sched: Scheduler = browserScheduler): ViewMotion {
	let current = initial;
	let handle: number | null = null;

	const stop = () => {
		if (handle !== null) sched.cancel(handle);
		handle = null;
	};
	const set = (v: View) => {
		stop();
		current = v;
		onView(v);
	};
	function to(target: View, ms: number) {
		stop();
		if (ms <= 0) return set(target);
		const from = current;
		const t0 = sched.now();
		const step = () => {
			const t = (sched.now() - t0) / ms;
			if (t >= 1) {
				handle = null;
				current = target;
				onView(target);
				return;
			}
			current = mixView(from, target, t);
			onView(current);
			handle = sched.request(step);
		};
		handle = sched.request(step);
	}
	return { to, set, stop, get running() { return handle !== null; } };
}
