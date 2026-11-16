/**
 * THE VISIT HELPER (N.203 lane 59 Step 1; Dann 2026-11-16 00:44: "keep the microphone open for as long as you are on the screen with the
 * ten vowels, and close it when you leave"). One rule, in one place: the microphone is held open exactly while the screen wants it AND the
 * page is visible. Chrome on iOS then announces it once per visit, not once per take.
 *
 * It takes the session, a way to end a take, a way to close the take's tick context, and a `wanted()` predicate. The capture screen's
 * predicate is "the takeover is visible" (the screen is mounted for as long as the helper lives). LANE 60 widens the predicate where it
 * creates its own helper, so one visit spans the test fry and the first vowel (the microphone is then announced once on a first
 * journey); it does not re-implement the rule.
 *
 * When wanted turns false: the take ends first (nothing is kept), then the session's visit closes, then the tick's context closes.
 * When it turns true: the visit opens. `resume()` is for the Start tap, a user gesture: it opens the visit again (idempotent) and resumes
 * a context the system suspended between takes.
 *
 * Also closed on `pagehide` and when the page goes hidden (DESK DEFAULT 2026-11-16: a tab in the background does not hold the microphone).
 */
import type { CaptureSession } from './engine/session';

export interface VisitDeps {
	session: Pick<CaptureSession, 'openVisit' | 'closeVisit'>;
	/** Ends a take in progress and keeps nothing. */
	endTake: () => void;
	/** Closes the tick's audio context. */
	closeTicks: () => void;
	/** The screen's wish, read each time the helper is asked. */
	wanted: () => boolean;
	/** Whether the page is visible. Defaults to `document.visibilityState`; injectable for tests. */
	pageVisible?: () => boolean;
}

export interface Visit {
	/** Whether the session's visit is open. */
	readonly open: boolean;
	/** Brings the session in line with `wanted()` and the page's visibility. Call it whenever either may have changed. */
	sync(): void;
	/** The Start tap: opens the visit (idempotent) so a suspended context resumes inside the gesture. A no-op when the visit is not wanted. */
	resume(): void;
	/** Ends the visit and removes the page listeners. */
	destroy(): void;
}

export function createVisit(deps: VisitDeps): Visit {
	let open = false;
	const pageVisible = deps.pageVisible ?? (() => typeof document === 'undefined' || document.visibilityState !== 'hidden');
	const should = () => deps.wanted() && pageVisible();

	function close() {
		if (!open) return;
		open = false;
		deps.endTake();
		deps.session.closeVisit();
		deps.closeTicks();
	}
	function sync() {
		if (should()) {
			if (!open) {
				open = true;
				deps.session.openVisit();
			}
		} else close();
	}
	function resume() {
		if (!should()) return;
		open = true;
		deps.session.openVisit();
	}

	const onPageChange = () => sync();
	if (typeof window !== 'undefined') {
		window.addEventListener('pagehide', close);
		document.addEventListener('visibilitychange', onPageChange);
	}

	return {
		get open() {
			return open;
		},
		sync,
		resume,
		destroy() {
			if (typeof window !== 'undefined') {
				window.removeEventListener('pagehide', close);
				document.removeEventListener('visibilitychange', onPageChange);
			}
			close();
		}
	};
}

/**
 * What the capture screen does when it unmounts (follow-up fix 7). The ritual ends first, silently (`destroy()` fires no event), and the visit closes after:
 * `visit.destroy()` ends a take through `ritual.cancel()`, which reports a CANCELLED take, and an unmounting screen may already belong to another voice, so a
 * take record written then could land on the wrong voice. Closing the visit with Back keeps the cancel as built: that is the same voice and the same screen.
 */
export function leaveScreen(visit: Visit, ritual: { destroy(): void }): void {
	ritual.destroy();
	visit.destroy();
}
