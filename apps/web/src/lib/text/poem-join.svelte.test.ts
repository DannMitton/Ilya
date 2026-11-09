/**
 * Row 181 step 5: the join on the page (`poem-join.svelte.ts`) with the page's lend faked: it applies once, marks what it wrote,
 * counts it, takes it back, and never writes the poem. Runes are inert under this suite, so the class is the logic alone.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LineData } from '$lib/types';
import type { Pairing, PairingMap, Slot } from '$lib/score/pairings';
import { reseatByDiff } from '$lib/score/reseat';
import { diffWordGrid } from '$lib/text-diff';
import { PoemJoin, JOIN_PAUSE_MS, wordKey, type JoinState } from './poem-join.svelte';
import type { RunEvent } from './poem-join-wire';
import type { SlotLike } from './poem-join';

const REAL = new Set(['средь', 'шумного', 'бала', 'в', 'тревоге', 'раз', 'два', 'три', 'пять']);
const slotsOf = (words: readonly string[]): SlotLike[] => words.flatMap((w, word) => (w.match(/[аеёиоуыэюя]/giu) ?? []).map((cyrillic) => ({ word, cyrillic })));
const syl = (lineIndex: number, wordIndex: number, slotIndex = 0, word = 'x'): Pairing => ({ kind: 'syllable', cyrillic: 'x', ipa: 'x', vowel: undefined, origin: { lineIndex, wordIndex, slotIndex, word } });
const lineOf = (text: string): LineData[] => [{ lineNumber: 1, words: text.split(/\s+/).map((cleanWord) => ({ cleanWord, lineIndex: 0 })) }] as unknown as LineData[];
const POEM = 'Средь шумного бала, в тревоге';

/* STEP 7a. The page's `setLyrics` is `handleInput(text, 'paste')`, which transcribes at once and re-seats by the diff
   (`reseatByDiff`). The rig does the same, with the real `reseatByDiff` on a queue of one slot per vowel, so the join's
   check of the seats counts what the page would have seated and not what the test hand-wrote. */
const wordsOf = (text: string): string[][] => text.split('\n').map((l) => l.split(/\s+/).filter(Boolean).map((w) => w.replace(/[^\p{L}]/gu, '').toLowerCase()));
const queueOf = (text: string): Slot[] =>
	wordsOf(text).flatMap((line, lineIndex) =>
		line.flatMap((word, wordIndex) => (word.match(/[аеёиоуыэюя]/giu) ?? []).map((cyrillic, slotIndex) => ({ cyrillic, ipa: cyrillic, vowel: undefined, origin: { lineIndex, wordIndex, slotIndex, word } }) as Slot)),
	);
/** Seat the slots of `text` on notes: `seats` lists, per note id, the queue index it carries. */
function seatOn(text: string, seats: Record<string, number>): PairingMap {
	const q = queueOf(text);
	return Object.fromEntries(Object.entries(seats).map(([id, k]) => [id, { kind: 'syllable', cyrillic: q[k].cyrillic, ipa: q[k].ipa, vowel: undefined, origin: q[k].origin } as Pairing]));
}

class Rig {
	song = { id: 's1', inputText: 'Средь шумного бапа в тревоге', publishedPoem: POEM, readOnly: false };
	sets: string[] = [];
	ready = true;
	scan = true;
	/** Lines of an older Lyrics: the transcription has not caught up with a change (the 600 ms pause). */
	staleLines: LineData[] | null = null;
	ids = ['a', 'b', 'c', 'd', 'e', 'f'];
	scanText = 'Средь шумного бапа в тревоге';
	/** The notes carry «Средь шумного бапа в тревоге» as the scan seated them: Средь on a, шумного on b-c-d, бапа on e-f. */
	pairings: PairingMap = seatOn('Средь шумного бапа в тревоге', { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5 });
	join = new PoemJoin();
	constructor() {
		this.join.attach({
			doc: () => this.song,
			setLyrics: (t) => {
				const before = wordsOf(this.song.inputText);
				this.sets.push(t);
				this.song.inputText = t;
				const after = wordsOf(t);
				this.pairings = reseatByDiff(this.pairings, this.ids, queueOf(t), diffWordGrid(before, after), before).map;
			},
			state: () => (this.scan ? this.stateFor() : null),
			isWord: (w) => REAL.has(w),
			slotsOf,
		});
	}
	stateFor(): JoinState {
		const events: RunEvent[] = this.ids.map((id) => ({ id, type: 'note', measureIndex: 0 }) as RunEvent);
		return { scanText: this.scanText, lines: this.staleLines ?? lineOf(this.song.inputText), events, pairings: this.pairings, unreadBars: [], ready: this.ready };
	}
}

beforeEach(() => {
	vi.useFakeTimers();
	vi.spyOn(console, 'info').mockImplementation((...a) => { if (process.env.JOINDBG) process.stderr.write(a.join(' ') + '\n'); });
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
		expect(r.join.lastLine).toContain('after the last transcribed word, no further word against Lyrics token 5 «мирской»');
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

describe('"Fill from the poem" on a bar the count rule refused (amendment 9; Dann 2026-11-04 14:00)', () => {
	/** Notes a to f: Средь on a, шумного on b, three notes c d e with no word, тревоге on f. The poem has «бала, в» (two slots) between. */
	class Refused extends Rig {
		constructor() {
			super();
			this.song.inputText = 'Средь шумного тревоге';
			this.scanText = 'Средь шумного тревоге';
			// Средь on a, шумного on b (c and d open for three syllables in all), тревоге on f; e open.
			this.pairings = seatOn('Средь шумного тревоге', { a: 0, b: 1, f: 6 });
		}
		override stateFor(): JoinState {
			const events: RunEvent[] = this.ids.map((id, i) => ({ id, type: 'note', measureIndex: i < 2 ? 4 : 5 }) as RunEvent);
			return { scanText: this.scanText, lines: lineOf(this.song.inputText), events, pairings: this.pairings, unreadBars: [[6, 6]], ready: true };
		}
	}

	it('draws nothing and changes nothing: the refused run is an offer, and Lyrics stay as they were', () => {
		const r = new Refused();
		r.join.run();
		expect(r.sets).toEqual([]);
		expect(r.join.lastLine).toContain('1 offered (count-refused)');
		expect(r.join.receipt('s1', r.song.inputText)).toBeNull();
	});

	it('offers the button on a bar of the run, and not on another', () => {
		const r = new Refused();
		r.join.run();
		expect(r.join.canFill(6)).toBe(true);
		expect(r.join.canFill(5)).toBe(false);
		expect(r.join.canFill(7)).toBe(false);
	});

	it('inserts the poem\'s words between the two neighbours when tapped, marks them, counts them, and cannot be tapped twice', () => {
		const r = new Refused();
		r.join.run();
		expect(r.join.fillBar(6)).toBe(true);
		expect(r.sets).toEqual(['Средь шумного бала, в тревоге']);
		const text = r.song.inputText;
		expect(r.join.marks('s1', text).map((m) => text.slice(m.start, m.end))).toEqual(['бала,', 'в']);
		expect(r.join.receipt('s1', text)).toEqual({ syllables: 2, words: 2 });
		expect(r.join.canFill(6)).toBe(false);
		expect(r.join.fillBar(6)).toBe(false);
		expect(r.song.publishedPoem).toBe(POEM);
	});

	it('is taken back with the rest of the join by Revert', () => {
		const r = new Refused();
		r.join.run();
		r.join.fillBar(6);
		r.join.revert();
		expect(r.song.inputText).toBe('Средь шумного тревоге');
	});

	it('does nothing when the Lyrics have moved on since the plan, or the song is read-only', () => {
		const r = new Refused();
		r.join.run();
		r.song.inputText = 'Средь шумного тревоге!';
		expect(r.join.canFill(6)).toBe(false);
		const ro = new Refused();
		ro.join.run();
		ro.song.readOnly = true;
		expect(ro.join.fillBar(6)).toBe(false);
	});
});

/* INTEGRATION STEP 7a (Fable's review of row 181, 2026-11-09). A run whose open notes straddle a `melisma` note passes the
   count, because `poem-join-wire.ts` skips melisma notes, but `reseatByDiff` puts each slot at the anchor plus one and leaves a
   slot unseated where that note already holds a pairing (`score/reseat.ts`). So the join wrote two syllables, the receipt would
   say two were filled, and one note stayed blank. These check that the join then counts the seats after the reseat, takes itself
   back, and says which bar in one console line; and that a run with no melisma in it is kept. If the check stops, the receipt
   can claim a note is filled that is blank. The brief's case reads «три четыре», but «четыре» has three syllables and cannot pass
   a count of two open notes, so the inserted words here are «три пять» (one syllable each). */
describe('the join counts the seats after the reseat (step 7a)', () => {
	class Straddle extends Rig {
		constructor(melisma: boolean) {
			super();
			this.song.inputText = 'раз два';
			this.song.publishedPoem = 'раз три пять два';
			this.scanText = 'раз два';
			this.ids = melisma ? ['n0', 'n1', 'n2', 'n3', 'n4'] : ['n0', 'n1', 'n2', 'n3'];
			this.pairings = melisma ? { ...seatOn('раз два', { n0: 0, n4: 1 }), n2: { kind: 'melisma' } } : seatOn('раз два', { n0: 0, n3: 1 });
		}
	}
	const infos = (): string[] => (console.info as unknown as { mock: { calls: unknown[][] } }).mock.calls.map((c) => String(c[0]));

	it('reverts the join and names the bar where a melisma note leaves one slot unseated', () => {
		const r = new Straddle(true);
		r.join.run();
		expect(r.sets).toEqual(['раз три пять два', 'раз два']);
		expect(r.song.inputText).toBe('раз два');
		expect(r.join.receipt('s1', r.song.inputText)).toBeNull();
		expect(infos().some((l) => /reverted \(bar 1\): 2 syllable\(s\) written, 1 seated/.test(l))).toBe(true);
	});

	it('keeps the join where both slots find a note', () => {
		const r = new Straddle(false);
		r.join.run();
		expect(r.sets).toEqual(['раз три пять два']);
		expect(r.join.receipt('s1', r.song.inputText)).toEqual({ syllables: 2, words: 2 });
		expect(Object.values(r.pairings).filter((p) => p.kind === 'syllable')).toHaveLength(4);
		expect(infos().some((l) => l.includes('reverted'))).toBe(false);
	});

	it('says it did not check, and keeps the join, where the transcription has not caught up with the new Lyrics', () => {
		const r = new Straddle(false);
		r.staleLines = lineOf('раз два');
		r.join.run();
		expect(r.sets).toEqual(['раз три пять два']);
		expect(infos().some((l) => /not checked \(bar 1\)/.test(l))).toBe(true);
		expect(infos().some((l) => l.includes('reverted'))).toBe(false);
	});
});
