/**
 * input-views.test.ts: N.135 stage 3. Which view opens, what the session
 * remembers, where a drop lands. Runes are inert under vitest, so the class is
 * read as plain fields.
 */
import { describe, it, expect, vi } from 'vitest';
import { initialView, inputViews } from './input-views.svelte';
import { routePoemPage } from './poem-page';

describe('initialView (row 109 C, revising row 104)', () => {
	it('opens Poem where Lyrics holds no text, whatever the Poem holds', () => {
		expect(initialView('', '')).toBe('poem');
		expect(initialView('', 'Средь шумного бала')).toBe('poem');
		expect(initialView('  \n', '   ')).toBe('poem');
	});

	it('opens Lyrics where Lyrics holds text, with or without a Poem', () => {
		expect(initialView('Тебя я увидел', '')).toBe('lyrics');
		expect(initialView('Тебя я увидел', 'Тебя я увидел')).toBe('lyrics');
	});
});

describe('the session\'s memory of the last view, per song', () => {
	it('remembers a song\'s last view and gives a new song the first-open rule', () => {
		inputViews.open('song-a', 'Тебя я увидел', '');
		expect(inputViews.view).toBe('lyrics');
		inputViews.show('poem');
		expect(inputViews.view).toBe('poem');

		inputViews.open('song-b', '', 'Средь шумного бала');
		expect(inputViews.view).toBe('poem');
		inputViews.show('lyrics');

		inputViews.open('song-a', 'Тебя я увидел', '');
		expect(inputViews.view).toBe('poem');
		inputViews.open('song-b', '', 'Средь шумного бала');
		expect(inputViews.view).toBe('lyrics');
	});

	it('a re-render of the same song moves nothing', () => {
		inputViews.open('song-c', 'слова', '');
		inputViews.show('poem');
		inputViews.open('song-c', '', 'слова');
		expect(inputViews.view).toBe('poem');
		inputViews.show('lyrics');
		inputViews.open('song-c', '', 'слова');
		expect(inputViews.view).toBe('lyrics');
	});

	it('first open with Lyrics empty and the Poem full opens Poem', () => {
		inputViews.open('song-d', '', 'Средь шумного бала');
		expect(inputViews.view).toBe('poem');
	});
});

describe('the line after a drop', () => {
	it('names where the content went, and clears on an edit or a view change', () => {
		inputViews.open('song-e', 'слова', '');
		inputViews.land('lyrics');
		expect(inputViews.landed).toBe('lyrics');
		inputViews.edited();
		expect(inputViews.landed).toBeNull();

		inputViews.land('poem');
		inputViews.show('poem');
		expect(inputViews.landed).toBeNull();
	});

	it('survives a view change that is the arrival\'s own', () => {
		inputViews.open('song-f', '', '');
		inputViews.land('lyrics');
		inputViews.show('lyrics', true);
		expect(inputViews.landed).toBe('lyrics');
	});

	it('is cleared when another song opens', () => {
		inputViews.land('poem');
		inputViews.open('song-g', '', '');
		expect(inputViews.landed).toBeNull();
	});
});

describe('routePoemPage (ruling default 9)', () => {
	const deps = (held: string) => {
		const put = vi.fn();
		const land = vi.fn();
		const ask = vi.fn();
		return { d: { held, put, land, ask }, put, land, ask };
	};

	it('puts a poem page in the Poem field, whichever view is showing, and says so', () => {
		for (const showing of ['lyrics', 'poem'] as const) {
			inputViews.open(`route-${showing}`, 'слова', '');
			inputViews.show(showing);
			const { d, put, land, ask } = deps('');
			routePoemPage('Средь шумного бала', d);
			expect(put).toHaveBeenCalledWith('Средь шумного бала');
			expect(land).toHaveBeenCalledWith('poem');
			expect(ask).not.toHaveBeenCalled();
			expect(inputViews.view).toBe(showing);
		}
	});

	it('asks before replacing a Poem that holds text, and writes nothing until the destructive answer', () => {
		const { d, put, land, ask } = deps('the poem I pasted');
		routePoemPage('another page', d);
		expect(ask).toHaveBeenCalledTimes(1);
		expect(put).not.toHaveBeenCalled();
		expect(land).not.toHaveBeenCalled();
		ask.mock.calls[0][0]();
		expect(put).toHaveBeenCalledWith('another page');
		expect(land).toHaveBeenCalledWith('poem');
	});

	it('treats a blank Poem as empty', () => {
		const { d, put, ask } = deps('  \n');
		routePoemPage('a page', d);
		expect(ask).not.toHaveBeenCalled();
		expect(put).toHaveBeenCalledWith('a page');
	});

	it('a score\'s words land in Lyrics', () => {
		inputViews.open('score-song', '', '');
		inputViews.land('lyrics');
		expect(inputViews.landed).toBe('lyrics');
	});
});

describe('a new empty song, and the witness Text transcribes (rows 109 and 110)', () => {
	it('opens Input on Poem for a song with no text at all', () => {
		inputViews.open('brand-new', '', '');
		expect(inputViews.view).toBe('poem');
	});

	it('remembers the witness the singer chose per song, for the session, Lyrics until then', () => {
		expect(inputViews.witnessChoice['w-a'] ?? 'lyrics').toBe('lyrics');
		inputViews.chooseWitness('w-a', 'poem');
		inputViews.chooseWitness('w-b', 'lyrics');
		expect(inputViews.witnessChoice['w-a']).toBe('poem');
		expect(inputViews.witnessChoice['w-b']).toBe('lyrics');
		inputViews.chooseWitness('w-a', 'lyrics');
		expect(inputViews.witnessChoice['w-a']).toBe('lyrics');
	});
});
