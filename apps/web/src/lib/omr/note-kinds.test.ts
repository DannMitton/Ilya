/**
 * Which notes take no syllable (row 181 B0g): the four tests over one `<note>`, the two lists the metre read and the seating share,
 * `voiceNotes`' flags, and a measure whose grace note stands before a long note.
 */
import { describe, expect, it } from 'vitest';
import { isChordTone, isCue, isGrace, skipOf, voiceOf, wouldSkipOf } from './note-kinds';
import { barFacts } from './metre-witness';
import { prepareUnderlay, voiceNotes } from './underlay-prepare';
import { seatPage, type PageLayout, type Seams, type SystemLayout, type WordBox } from './underlay-page';
import type { Grey, StaffBoxLike } from './metre-windows';
import { writeLyrics } from './underlay-words';

const n = (extra = '', voice = '') => `<note>${extra}<pitch><step>C</step><octave>5</octave></pitch><duration>4</duration>${voice}</note>`;

describe('the four tests over one note', () => {
	it('reads grace, chord, cue, and voice from the element, and nothing longer than its name', () => {
		expect(isGrace(n('<grace slash="yes"/>'))).toBe(true);
		expect(isGrace(n('<grace/>'))).toBe(true);
		expect(isGrace(n('<graceful/>'))).toBe(false);
		expect(isChordTone(n('<chord />'))).toBe(true);
		expect(isChordTone(n('<chord/>'))).toBe(true);
		expect(isChordTone(n('<chords/>'))).toBe(false);
		expect(isCue(n('<cue/>'))).toBe(true);
		expect(isCue(n('<cues/>'))).toBe(false);
		expect(voiceOf(n())).toBe(1);
		expect(voiceOf(n('', '<voice>2</voice>'))).toBe(2);
		expect(voiceOf(n('', '<voice> 7 </voice>'))).toBe(7);
	});

	it('skips a grace note, then a chord tone; counts a cue note, then voice 2, as would-skip and skips neither', () => {
		expect(skipOf(n('<grace/><chord/>'))).toBe('grace');
		expect(skipOf(n('<chord/>'))).toBe('chord');
		expect(skipOf(n('<cue/>'))).toBeUndefined();
		expect(skipOf(n('', '<voice>2</voice>'))).toBeUndefined();
		expect(wouldSkipOf(n('<cue/>', '<voice>2</voice>'))).toBe('cue');
		expect(wouldSkipOf(n('', '<voice>2</voice>'))).toBe('voice2');
		expect(wouldSkipOf(n())).toBeUndefined();
	});
});

/* The metre read (`barFacts`) skips grace, chord, and cue notes for the bar's sum; the underlay's seating uses the same three tests. If
   they came apart, a note the metre does not count would take a syllable, or the reverse. */
describe('the metre read and the seating share one list', () => {
	it('barFacts counts the notes that are none of grace, chord, and cue, as it did with its own regex', () => {
		const old = /<grace[\s/>]|<chord[\s/>]|<cue[\s/>]/;
		const kinds = ['', '<grace/>', '<chord/>', '<cue/>', '<grace slash="yes"/>', '<chord />'];
		for (const k of kinds) {
			expect(isGrace(n(k)) || isChordTone(n(k)) || isCue(n(k))).toBe(old.test(n(k)));
			const bar = [`<measure><attributes><divisions>4</divisions></attributes>${n(k)}</measure>`];
			expect(barFacts(bar)[0].notes).toBe(old.test(n(k)) ? 0 : 1);
		}
	});
});

const part = (...notes: string[]) => `<score-partwise><part-list><score-part id="P1"/></part-list><part id="P1"><measure number="1">${notes.join('')}</measure></part></score-partwise>`;
const at = (x: number) => `<!-- imgpos: ${x}, 160 -->`;
const withAt = (x: number, extra = '', voice = '') => `<note>${extra}<pitch><step>C</step><octave>5</octave></pitch><duration>4</duration>${voice}${at(x)}</note>`;

describe('voiceNotes flags the notes that take no syllable, and moves no ordinal', () => {
	it('flags a grace note and a chord tone as skip, a cue note and a voice-2 note as wouldSkip, and numbers every note', () => {
		const xml = part(withAt(100, '<grace/>'), withAt(200), withAt(200, '<chord/>'), withAt(300, '<cue/>'), withAt(400, '', '<voice>2</voice>'), withAt(500));
		const out = voiceNotes(xml);
		expect(out.map((v) => [v.ordinal, v.skip ?? null, v.wouldSkip ?? null])).toEqual([[0, 'grace', null], [1, null, null], [2, 'chord', null], [3, null, 'cue'], [4, null, 'voice2'], [5, null, null]]);
	});

	it('leaves the flags off a plain note, so a part without such notes reads as before', () => {
		const out = voiceNotes(part(withAt(100), withAt(200)));
		expect(out.every((v) => !('skip' in v) && !('wouldSkip' in v))).toBe(true);
	});

	it('writes a syllable onto the note it was seated on by ordinal: a skipped note ahead shifts nothing', () => {
		const xml = part(withAt(100, '<grace/>'), withAt(200));
		const written = writeLyrics(xml, [{ syllables: [{ note: 1, text: 'да', syllabic: 'single', sustained: false }] }]);
		expect(written.indexOf('<text>да</text>')).toBeGreaterThan(written.lastIndexOf('<grace/>'));
	});
});

describe('prepareUnderlay carries the flags to the layout\'s notes', () => {
	const W = 1200;
	const H = 1100;
	const page = (): Grey => {
		const data = new Uint8Array(W * H).fill(255);
		for (const top of [100, 500, 800]) for (let k = 0; k < 5; k++) for (let y = top + k * 30 - 1; y < top + k * 30 + 2; y++) for (let x = 100; x < 1100; x++) data[y * W + x] = 20;
		return { width: W, height: H, data };
	};
	const box = (top: number, index: number): StaffBoxLike => ({ cx: 0.5, cy: (top + 60) / H, w: 1000 / W, h: 124 / H, index });
	it('gives a skipped note its flag, a would-skip note its own, and keeps the note in the layout with its ordinal', () => {
		const xml = part(withAt(300, '<grace/>'), withAt(320), withAt(500, '<cue/>'));
		const notes = prepareUnderlay(page(), xml, [box(100, 0), box(500, 1), box(800, 2)]).layout.systems[0].notes;
		expect(notes.map((p) => [p.id, p.skip ?? null, p.wouldSkip ?? null])).toEqual([[0, 'grace', null], [1, null, null], [2, null, 'cue']]);
	});
});

describe('seatPage leaves a skipped note out of the notes it seats', () => {
	const seams: Seams = { isWord: (w) => ['ты', 'мир', 'свет'].includes(w), cut: (w) => [w.toLowerCase()] };
	const row = { id: 0, transform: { scale: 1, pad: 16, angle: 0, width: 1200, height: 42 }, offsetX: 0, offsetY: 265 };
	const box = (text: string, x0: number, x1: number): WordBox => ({ text, x0: x0 + 16, x1: x1 + 16, y0: 16, y1: 48 });
	const sys = (notes: SystemLayout['notes']): PageLayout => ({ width: 1200, height: 1100, unfound: 0, systems: [{ staffSpace: 30, notes, hasBand: true, rows: [row] }] });
	const seated = (p: ReturnType<typeof seatPage>) => p.words.flatMap((w) => w.syllables.map((s) => [s.text, s.note]));

	/* Without the skip, «ты» (centre 460) is nearest the grace note at 455 and takes it, one note early, and the long note at 500 is
	   left bare. If the filter were taken out of `seatPage`, the second assertion's result would be the first's. */
	it('seats the syllable on the long note, not on the grace note before it; the other notes\' ids are unchanged', () => {
		const notes = [{ id: 0, x: 200, bar: 1 }, { id: 1, x: 455, bar: 1, skip: 'grace' as const }, { id: 2, x: 500, bar: 1 }];
		const read = [[box('мир', 180, 220), box('ты', 430, 490)]];
		expect(seated(seatPage(sys(notes), read, seams))).toEqual([['мир', 0], ['ты', 2]]);
		expect(seated(seatPage(sys(notes.map(({ skip: _skip, ...rest }) => rest)), read, seams))).toEqual([['мир', 0], ['ты', 1]]);
	});

	it('seats a chord tone the same way, and counts every kind by name', () => {
		const notes = [
			{ id: 0, x: 200, bar: 1 },
			{ id: 1, x: 205, bar: 1, skip: 'chord' as const },
			{ id: 2, x: 400, bar: 1, wouldSkip: 'cue' as const },
			{ id: 3, x: 600, bar: 1, wouldSkip: 'voice2' as const },
			{ id: 4, x: 700, bar: 1, skip: 'grace' as const },
		];
		const page = seatPage(sys(notes), [[box('мир', 190, 215), box('ты', 390, 410), box('свет', 590, 610)]], seams);
		// the cue and voice-2 notes are seated on: counted, not skipped
		expect(seated(page)).toEqual([['мир', 0], ['ты', 2], ['свет', 3]]);
		expect(page.stats.skippedNotes).toEqual({ grace: 1, chord: 1, wouldSkip: { cue: 1, voice2: 1 } });
	});

	it('counts a skipped note outside the one-vowel-per-note check: no breach for the note that sings nothing', () => {
		const notes = [{ id: 0, x: 200, bar: 1 }, { id: 1, x: 300, bar: 1, skip: 'grace' as const }];
		const page = seatPage(sys(notes), [[box('мир', 180, 220)]], seams);
		expect(page.stats.counted.breaches).toEqual([]);
	});
});
