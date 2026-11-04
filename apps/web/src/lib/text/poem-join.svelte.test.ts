/**
 * Row 181 step 5: the join on the page (`poem-join.svelte.ts`) with the page's lend faked: it applies once, marks what it wrote,
 * counts it, takes it back, and never writes the poem. Runes are inert under this suite, so the class is the logic alone.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LineData } from '$lib/types';
import type { Pairing } from '$lib/score/pairings';
import { PoemJoin, JOIN_PAUSE_MS, wordKey, type JoinState } from './poem-join.svelte';
import type { RunEvent } from './poem-join-wire';
import type { SlotLike } from './poem-join';

const REAL = new Set(['средь', 'шумного', 'бала', 'в', 'тревоге']);
const slotsOf = (words: readonly string[]): SlotLike[] => words.flatMap((w, word) => (w.match(/[аеёиоуыэюя]/giu) ?? []).map((cyrillic) => ({ word, cyrillic })));
const syl = (lineIndex: number, wordIndex: number): Pairing => ({ kind: 'syllable', cyrillic: 'x', ipa: 'x', vowel: undefined, origin: { lineIndex, wordIndex, slotIndex: 0, word: 'x' } });
const lineOf = (text: string): LineData[] => [{ lineNumber: 1, words: text.split(/\s+/).map((cleanWord) => ({ cleanWord, lineIndex: 0 })) }] as unknown as LineData[];
const POEM = 'Средь шумного бала, в тревоге';

class Rig {
	song = { id: 's1', inputText: 'Средь шумного бапа в тревоге', publishedPoem: POEM, readOnly: false };
	sets: string[] = [];
	ready = true;
	scan = true;
	/** Lines of an older Lyrics: the transcription has not caught up with a change (the 600 ms pause). */
	staleLines: LineData[] | null = null;
	join = new PoemJoin();
	constructor() {
		this.join.attach({
			doc: () => this.song,
			setLyrics: (t) => {
				this.sets.push(t);
				this.song.inputText = t;
			},
			state: () => (this.scan ? this.stateFor() : null),
			isWord: (w) => REAL.has(w),
			slotsOf,
		});
	}
	stateFor(): JoinState {
		const events: RunEvent[] = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, type: 'note', measureIndex: 0 }) as RunEvent);
		// The notes carry the words «Средь шумного бапа в тревоге» as the scan seated them: Средь on a, шумного on b-c-d, бапа on e-f.
		return {
			scanText: 'Средь шумного бапа в тревоге',
			lines: this.staleLines ?? lineOf(this.song.inputText),
			events,
			pairings: { a: syl(0, 0), b: syl(0, 1), c: { kind: 'melisma' }, d: { kind: 'melisma' }, e: syl(0, 2), f: syl(0, 3) },
			unreadBars: [],
			ready: this.ready,
		};
	}
}

beforeEach(() => {
	vi.useFakeTimers();
	vi.spyOn(console, 'info').mockImplementation(() => {});
});
afterEach(() => {
	vi.useRealTimers();
	vi.restoreAllMocks();
});

describe('PoemJoin', () => {
	it('repairs the scan\'s garbled word from the poem once, as one Lyrics edit, and leaves the poem as it was', () => {
		const r = new Rig();
		const poemBefore = r.song.publishedPoem;
		r.join.run();
		expect(r.sets).toEqual(['Средь шумного бала в тревоге']);
		expect(r.song.publishedPoem).toBe(poemBefore);
		expect(r.song.publishedPoem).toBe(POEM);
	});

	it('marks the written word, counts its syllables for the receipt, and keeps what the print read', () => {
		const r = new Rig();
		r.join.run();
		const text = r.song.inputText;
		expect(r.join.receipt('s1', text)).toEqual({ syllables: 2, words: 1 });
		expect(r.join.marks('s1', text).map((m) => [text.slice(m.start, m.end), m.was])).toEqual([['бала', 'бапа']]);
	});

	it('keeps its marks through a change of line breaks, and ends them at the first edit to the words', () => {
		const r = new Rig();
		r.join.run();
		const broken = r.song.inputText.replace(' в ', '\nв ');
		expect(r.join.receipt('s1', broken)).not.toBeNull();
		expect(r.join.marks('s1', broken)).toHaveLength(1);
		const edited = r.song.inputText.replace('бала', 'бал');
		expect(r.join.receipt('s1', edited)).toBeNull();
		expect(r.join.marks('s1', edited)).toEqual([]);
	});

	it('takes the join back: Lyrics as they were, and no second join for the same poem', () => {
		const r = new Rig();
		r.join.run();
		r.join.revert();
		expect(r.song.inputText).toBe('Средь шумного бапа в тревоге');
		expect(r.join.receipt('s1', r.song.inputText)).toBeNull();
		r.join.run();
		expect(r.song.inputText).toBe('Средь шумного бапа в тревоге');
		// A different poem is a new occasion.
		r.song.publishedPoem = POEM + ' ';
		r.join.run();
		expect(r.song.inputText).toBe('Средь шумного бала в тревоге');
	});

	it('does not run again on the text it left, and does not loop', () => {
		const r = new Rig();
		r.join.run();
		r.join.run();
		r.join.run();
		expect(r.sets).toHaveLength(1);
	});

	it('does nothing without a scan with words, without a poem, without the dictionary, or on a read-only song', () => {
		for (const make of [(r: Rig) => (r.scan = false), (r: Rig) => (r.song.publishedPoem = '  '), (r: Rig) => (r.ready = false), (r: Rig) => (r.song.readOnly = true)]) {
			const r = new Rig();
			make(r);
			r.join.run();
			expect(r.sets).toEqual([]);
		}
	});

	it('does nothing where the transcription of Lyrics does not line up with its words, and says so', () => {
		const r = new Rig();
		r.staleLines = lineOf('Средь шумного бапа в тревоге');
		r.song.inputText = 'Средь шумного бапа в тревоге мирской';
		r.join.run();
		expect(r.sets).toEqual([]);
		expect(r.join.lastLine).toContain('does not line up');
	});

	it('runs after the pause and not before, and restarts the pause on each call', () => {
		const r = new Rig();
		r.join.schedule();
		vi.advanceTimersByTime(JOIN_PAUSE_MS - 1);
		r.join.schedule();
		vi.advanceTimersByTime(JOIN_PAUSE_MS - 1);
		expect(r.sets).toEqual([]);
		vi.advanceTimersByTime(2);
		expect(r.sets).toHaveLength(1);
	});

	it('prints one line with the counts, the desk\'s measure, and no fault on the second pass', () => {
		const r = new Rig();
		r.join.run();
		expect(r.join.lastLine).toContain('1 repaired');
		expect(r.join.lastLine).toContain('0 fault(s) on the second pass');
	});

	it('wordKey is the same through a change of line breaks and different through a change of words', () => {
		expect(wordKey('Средь шумного\nбала')).toBe(wordKey('Средь  шумного бала'));
		expect(wordKey('Средь шумного бала')).not.toBe(wordKey('Средь шумного бал'));
	});
});
