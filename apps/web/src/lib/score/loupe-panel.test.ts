/**
 * The loupe's mode and panel (calm-loupe slice 1, 2026-09-28). Every expected
 * value is written out by hand from the rulings `loupe-panel.svelte.ts` cites.
 */
import { describe, expect, it } from 'vitest';
import { KEYS_OWNED_ELSEWHERE, keyOwnedElsewhere, LoupePanel, releasesFocus } from './loupe-panel.svelte';

/* Vitest here runs without a DOM, so a target is a stand-in whose `closest`
   answers for one selector part, the way an element inside it would. */
const inside = (part: string) => ({
	closest: (selector: string) => (selector.split(',').map((s) => s.trim()).includes(part) ? {} : null),
});

describe('one key, one owner (calm-loupe slice 6)', () => {
	it('leaves a key aimed inside a tablist to the tablist', () => {
		expect(keyOwnedElsewhere(inside('[role="tablist"]') as unknown as EventTarget)).toBe(true);
	});

	it('still leaves the fields alone, as the guard did before', () => {
		for (const part of ['input', 'textarea', 'select', '[contenteditable="true"]']) {
			expect(keyOwnedElsewhere(inside(part) as unknown as EventTarget)).toBe(true);
		}
	});

	it('takes a key aimed at the page, or at a button outside the tablist', () => {
		expect(keyOwnedElsewhere(inside('body') as unknown as EventTarget)).toBe(false);
		expect(keyOwnedElsewhere(null)).toBe(false);
		expect(keyOwnedElsewhere({} as EventTarget)).toBe(false);
	});

	it('names the tablist in the one selector the page reads', () => {
		expect(KEYS_OWNED_ELSEWHERE).toContain('[role="tablist"]');
	});

	it('a pointer click on a pill hands focus back; Enter or Space keeps it', () => {
		expect(releasesFocus({ detail: 1 })).toBe(true);
		expect(releasesFocus({ detail: 2 })).toBe(true);
		expect(releasesFocus({ detail: 0 })).toBe(false);
	});
});

describe('LoupePanel', () => {
	it('opens on Syllables with the panel shut, and shows no carets', () => {
		const p = new LoupePanel();
		expect(p.mode).toBe('syllables');
		expect(p.open).toBe(false);
		expect(p.caretsShown).toBe(false);
		expect(p.musicKeys).toBe(false);
	});

	it('a press on a pill chooses the mode and opens the panel', () => {
		const p = new LoupePanel();
		p.choose('corrections');
		expect(p.mode).toBe('corrections');
		expect(p.open).toBe(true);
		expect(p.caretsShown).toBe(true);
		expect(p.musicKeys).toBe(true);
	});

	it('a second press on the filled pill closes the panel and keeps the mode', () => {
		const p = new LoupePanel();
		p.choose('corrections');
		p.choose('corrections');
		expect(p.open).toBe(false);
		expect(p.mode).toBe('corrections');
		expect(p.caretsShown).toBe(false);
	});

	it('a press on the other pill switches mode and leaves the panel open', () => {
		const p = new LoupePanel();
		p.choose('corrections');
		p.choose('syllables');
		expect(p.mode).toBe('syllables');
		expect(p.open).toBe(true);
		expect(p.caretsShown).toBe(false);
		expect(p.musicKeys).toBe(false);
	});

	it('a press on the unfilled pill of the shut panel opens it', () => {
		const p = new LoupePanel();
		p.choose('syllables');
		p.choose('syllables');
		p.choose('syllables');
		expect(p.open).toBe(true);
	});

	it('the chevron toggles the panel in the chosen mode', () => {
		const p = new LoupePanel();
		p.choose('corrections');
		p.toggle();
		expect(p.open).toBe(false);
		p.toggle();
		expect(p.open).toBe(true);
		expect(p.caretsShown).toBe(true);
	});

	it('reset returns to Syllables with the panel shut', () => {
		const p = new LoupePanel();
		p.choose('corrections');
		p.reset();
		expect(p.mode).toBe('syllables');
		expect(p.open).toBe(false);
	});

	it('the verbs keep `this` when handed on bare, as the page does', () => {
		const p = new LoupePanel();
		const { choose, toggle, reset } = p;
		choose('corrections');
		toggle();
		expect(p.open).toBe(false);
		reset();
		expect(p.mode).toBe('syllables');
	});
});
