import { describe, expect, it } from 'vitest';
import { createViewMotion, type Scheduler } from './view-motion';
import type { View } from './geometry';

const A: View = { u0: 8, u1: 6, v0: 5, v1: 7 };
const B: View = { u0: 7.5, u1: 7, v0: 5.5, v1: 6 };

function fake() {
	let t = 0, id = 0;
	const queue = new Map<number, () => void>();
	const sched: Scheduler = { now: () => t, request: (fn) => (queue.set(++id, fn), id), cancel: (i) => void queue.delete(i) };
	const advance = (ms: number) => {
		t += ms;
		const fns = [...queue.values()];
		queue.clear();
		fns.forEach((f) => f());
	};
	return { sched, advance, pending: () => queue.size };
}

describe('the view in motion', () => {
	it('moves from where it is to the target over the time, eased, and ends exactly on it', () => {
		const f = fake();
		const seen: View[] = [];
		const m = createViewMotion(A, (v) => seen.push(v), f.sched);
		m.to(B, 1000);
		expect(m.running).toBe(true);
		f.advance(500);
		expect(seen[seen.length - 1].u0).toBeCloseTo((A.u0 + B.u0) / 2);
		f.advance(500);
		expect(seen[seen.length - 1]).toEqual(B);
		expect(m.running).toBe(false);
		expect(f.pending()).toBe(0);
	});
	it('with no time (reduced motion) sets the view at once and never schedules a frame', () => {
		const f = fake();
		const seen: View[] = [];
		const m = createViewMotion(A, (v) => seen.push(v), f.sched);
		m.to(B, 0);
		expect(seen).toEqual([B]);
		expect(f.pending()).toBe(0);
		expect(m.running).toBe(false);
	});
	it('a new move starts from wherever the last had got to, and the old one stops', () => {
		const f = fake();
		const seen: View[] = [];
		const m = createViewMotion(A, (v) => seen.push(v), f.sched);
		m.to(B, 1000);
		f.advance(500);
		const mid = seen[seen.length - 1];
		m.to(A, 1000);
		f.advance(1000);
		expect(seen[seen.length - 1]).toEqual(A);
		expect(mid.u0).toBeLessThan(A.u0);
		expect(f.pending()).toBe(0);
	});
	it('set ends a move and sets the view', () => {
		const f = fake();
		const seen: View[] = [];
		const m = createViewMotion(A, (v) => seen.push(v), f.sched);
		m.to(B, 1000);
		m.set(A);
		f.advance(2000);
		expect(seen[seen.length - 1]).toEqual(A);
		expect(m.running).toBe(false);
	});
});
