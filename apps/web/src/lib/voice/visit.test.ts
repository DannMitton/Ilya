/**
 * N.203 lane 59 Step 1: the visit helper. One rule, "the screen wants it AND the page is visible", and what each change does: the take ends
 * first (nothing kept), then the session's visit closes, then the tick's context closes; the visit opens again when wanted again.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVisit, leaveScreen, type Visit } from './visit';
import { createCaptureRitual } from './capture-ritual.svelte';
import type { CaptureSession } from './engine/session';

function rig() {
	const calls: string[] = [];
	const state = { wanted: true, page: true };
	const visit = createVisit({
		session: { openVisit: () => calls.push('open'), closeVisit: () => calls.push('close') },
		endTake: () => calls.push('endTake'),
		closeTicks: () => calls.push('closeTicks'),
		wanted: () => state.wanted,
		pageVisible: () => state.page
	});
	return { calls, state, visit };
}
let live: Visit | null = null;
// The test environment has no DOM: the page's two event targets stand in for `window` and `document`.
beforeEach(() => {
	vi.stubGlobal('window', new EventTarget());
	vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
});
afterEach(() => {
	live?.destroy();
	live = null;
	vi.unstubAllGlobals();
});

describe('the visit helper', () => {
	it('opens when wanted, once however often it is asked', () => {
		const r = rig();
		live = r.visit;
		r.visit.sync();
		r.visit.sync();
		expect(r.calls).toEqual(['open']);
		expect(r.visit.open).toBe(true);
	});

	it('Back: the take ends first, then the session closes, then the tick context', () => {
		const r = rig();
		live = r.visit;
		r.visit.sync();
		r.state.wanted = false;
		r.visit.sync();
		expect(r.calls).toEqual(['open', 'endTake', 'close', 'closeTicks']);
		expect(r.visit.open).toBe(false);
	});

	it('a return after Back opens the visit again', () => {
		const r = rig();
		live = r.visit;
		r.visit.sync();
		r.state.wanted = false;
		r.visit.sync();
		r.state.wanted = true;
		r.visit.sync();
		expect(r.calls).toEqual(['open', 'endTake', 'close', 'closeTicks', 'open']);
	});

	it('the Start tap reopens an open visit (idempotent) and does nothing when the visit is not wanted', () => {
		const r = rig();
		live = r.visit;
		r.visit.sync();
		r.visit.resume();
		expect(r.calls).toEqual(['open', 'open']);
		r.state.wanted = false;
		r.visit.sync();
		r.calls.length = 0;
		r.visit.resume();
		expect(r.calls).toEqual([]);
	});

	it('pagehide closes it', () => {
		const r = rig();
		live = r.visit;
		r.visit.sync();
		window.dispatchEvent(new Event('pagehide'));
		expect(r.calls).toEqual(['open', 'endTake', 'close', 'closeTicks']);
	});

	it('a page that goes hidden closes it, and a page that returns opens it', () => {
		const r = rig();
		live = r.visit;
		r.visit.sync();
		r.state.page = false;
		document.dispatchEvent(new Event('visibilitychange'));
		expect(r.visit.open).toBe(false);
		r.state.page = true;
		document.dispatchEvent(new Event('visibilitychange'));
		expect(r.calls).toEqual(['open', 'endTake', 'close', 'closeTicks', 'open']);
	});

	it('destroy closes an open visit, removes its listeners, and closes nothing twice', () => {
		const r = rig();
		r.visit.sync();
		r.visit.destroy();
		r.visit.destroy();
		window.dispatchEvent(new Event('pagehide'));
		expect(r.calls).toEqual(['open', 'endTake', 'close', 'closeTicks']);
	});

	it('is never opened when it is never wanted', () => {
		const r = rig();
		live = r.visit;
		r.state.wanted = false;
		r.visit.sync();
		expect(r.calls).toEqual([]);
	});
});

describe('leaving the screen (follow-up fix 7)', () => {
	function screen() {
		const calls: string[] = [];
		const failed: string[] = [];
		const session = {
			start() {},
			startReadiness() {},
			cancel: () => calls.push('session.cancel'),
			openVisit: () => calls.push('open'),
			closeVisit: () => calls.push('close')
		} as CaptureSession;
		const ritual = createCaptureRitual({ session, voiceType: () => 'bass', previous: () => undefined, reducedMotion: () => false, ticks: false, onFailed: (v, e) => failed.push(`${v}:${e.code}`) });
		const visit = createVisit({ session, endTake: () => ritual.cancel(), closeTicks: () => ritual.closeTicks(), wanted: () => true, pageVisible: () => true });
		visit.sync();
		return { ritual, visit, calls, failed };
	}
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('ends a take in progress silently: no CANCELLED take is reported, and the visit still closes', () => {
		const s = screen();
		s.ritual.begin('i');
		vi.advanceTimersByTime(1000);
		leaveScreen(s.visit, s.ritual);
		expect(s.failed).toEqual([]);
		expect(s.calls).toContain('close');
		expect(s.ritual.phase).toBe('idle');
		live = null;
	});

	it('is why the order matters: closing the visit first reports the cancel', () => {
		const s = screen();
		s.ritual.begin('i');
		vi.advanceTimersByTime(1000);
		s.visit.destroy();
		s.ritual.destroy();
		expect(s.failed).toEqual(['i:CANCELLED']);
	});
});
