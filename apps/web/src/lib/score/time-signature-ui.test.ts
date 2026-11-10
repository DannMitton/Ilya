import { describe, expect, it, vi } from 'vitest';
import { tsUi } from './time-signature-ui.svelte';
import type { HeldBar } from './time-signature';

const held = (over: Partial<HeldBar> = {}): HeldBar => ({ bar: 2, openerId: 'x', signature: { beats: 4, beatType: 8 }, reading: { beats: 4, beatType: 8 }, ...over });

describe('the time signature card\'s state (QUEUE row 138, T1)', () => {
	it('opens on the held bar with its signature and the scope she last chose in it, and does not open on nothing', () => {
		tsUi.attach({ held: () => null, commit: () => {} });
		tsUi.show();
		expect(tsUi.open).toBe(false);
		tsUi.attach({ held: () => held({ signature: { beats: 3, beatType: 4 }, mine: { beats: 3, beatType: 4, through: 'end' } }), commit: () => {} });
		tsUi.show();
		expect(tsUi.open).toBe(true);
		expect(tsUi.parsed).toEqual({ beats: 3, beatType: 4 });
		expect(tsUi.through).toBe('end');
		tsUi.close();
		tsUi.attach({ held: () => held(), commit: () => {} });
		tsUi.show();
		expect(tsUi.through).toBe('next');
		tsUi.close();
	});
	it('a listed signature fills both fields, and only a time signature can be applied', () => {
		const commit = vi.fn();
		tsUi.attach({ held: () => held(), commit });
		tsUi.show();
		tsUi.choose(6, 8);
		expect(tsUi.valid).toBe(true);
		tsUi.beatType = 5;
		expect(tsUi.valid).toBe(false);
		tsUi.apply();
		expect(commit).not.toHaveBeenCalled();
		expect(tsUi.open).toBe(true);
		tsUi.beatType = null;
		expect(tsUi.valid).toBe(false);
		tsUi.choose(2, 2);
		tsUi.through = 'end';
		tsUi.apply();
		expect(commit).toHaveBeenCalledWith({ beats: 2, beatType: 2 }, 'end', undefined, false);
		expect(tsUi.open).toBe(false);
	});
	it('gives focus back to what opened it', () => {
		const focus = vi.fn();
		const el = { focus, isConnected: true } as unknown as HTMLElement;
		tsUi.attach({ held: () => held(), commit: () => {} });
		tsUi.show(el);
		tsUi.close();
		expect(focus).toHaveBeenCalledTimes(1);
	});

	it('opened from the score it asks for the bar of the entry tapped, and commits against that entry', () => {
		const commit = vi.fn();
		const held = vi.fn((id?: string) => (id === 'tapped' ? ({ bar: 6, openerId: 'tapped', signature: { beats: 3, beatType: 4 }, reading: { beats: 3, beatType: 4 } } as HeldBar) : null));
		tsUi.attach({ held, commit });
		tsUi.show(null, 'nowhere');
		expect(tsUi.open).toBe(false);
		tsUi.show(null, 'tapped');
		expect(tsUi.open).toBe(true);
		tsUi.choose(2, 4);
		tsUi.apply();
		expect(commit).toHaveBeenCalledWith({ beats: 2, beatType: 4 }, 'next', 'tapped', false);
	});
});
