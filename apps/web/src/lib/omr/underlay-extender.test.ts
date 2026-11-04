/**
 * Row 181 step 1: the notes a printed extender lies under (`underlay-extender.ts`), the system that held no ink
 * (`bandHeldNoInk`, `seatPage`), and the song that leaves a silent system out of the banner (`applyUnderlay`).
 */
import { describe, expect, it } from 'vitest';
import { markExtenderNotes, NO_EXTENDERS } from './underlay-extender';
import { isContinuation, type NotePlace, type Token } from './underlay-seat';
import { bandHeldNoInk, seatPage, type PageLayout, type RowLayout, type Seams, type SystemLayout, type WordBox } from './underlay-page';
import { applyUnderlay } from './underlay-song';
import { bandInk } from './underlay-rows';
import type { FrameTransform } from './underlay-frame';

const notes = (...xs: number[]): NotePlace[] => xs.map((x, i) => ({ id: i, x, bar: 1 }));
const tok = (text: string, x0: number, x1: number, longDash = false): Token => ({ text, x0, x1, ...(longDash ? { longDash } : {}) });
const under = (n: readonly NotePlace[]) => n.map((x) => x.underExtender === true);

describe('markExtenderNotes, arm a', () => {
	it('marks every note under an underscore that stands after a syllable, except the note nearest that syllable', () => {
		const out = markExtenderNotes(notes(100, 200, 300, 400, 500), [[tok('ла', 90, 110), tok('___', 150, 420)]], 'a');
		expect(under(out.notes)).toEqual([false, true, true, true, false]);
		expect(out.counts).toEqual({ extender: 1, joint: 0, longDash: 0, marked: 3 });
	});

	it('reads the token\'s own box and nothing else: an underscore over no note marks nothing', () => {
		const out = markExtenderNotes(notes(100, 300), [[tok('ла', 90, 110), tok('_', 150, 250)]], 'a');
		expect(under(out.notes)).toEqual([false, false]);
		expect(out.counts.marked).toBe(0);
	});

	it('marks nothing for an underscore with no syllable before it on the row', () => {
		const out = markExtenderNotes(notes(100, 200), [[tok('_', 90, 250), tok('ла', 260, 300)]], 'a');
		expect(under(out.notes)).toEqual([false, false]);
		expect(out.counts.extender).toBe(1);
	});

	it('takes a long dash for the print\'s line as it takes an underscore, and counts it apart', () => {
		const out = markExtenderNotes(notes(100, 200, 300), [[tok('ла', 90, 110), tok('_', 150, 320, true)]], 'a');
		expect(under(out.notes)).toEqual([false, true, true]);
		expect(out.counts).toEqual({ extender: 0, joint: 0, longDash: 1, marked: 2 });
	});

	it('does not read a hyphen in arm a, however far it reaches (a hyphen between two syllables is a pairing of seats, not ink under notes)', () => {
		const out = markExtenderNotes(notes(100, 200, 300), [[tok('ла', 90, 110), tok('-', 120, 290), tok('ва', 290, 310)]], 'a');
		expect(under(out.notes)).toEqual([false, false, false]);
		expect(out.counts).toMatchObject({ joint: 1, marked: 0 });
	});

	it('reads each row on its own, and does not change the notes it was given', () => {
		const given = notes(100, 200, 300);
		const out = markExtenderNotes(given, [[tok('ла', 90, 110)], [tok('ва', 90, 110), tok('_', 150, 320)]], 'a');
		expect(under(out.notes)).toEqual([false, true, true]);
		expect(under(given)).toEqual([false, false, false]);
	});

	it('gives no counts for no rows', () => {
		expect(markExtenderNotes(notes(100), [], 'a').counts).toEqual(NO_EXTENDERS);
	});
});

describe('markExtenderNotes, arm b', () => {
	it('also reads a hyphen whose own box spans a free note\'s x, and marks nothing where the hyphen spans no note', () => {
		const spans = markExtenderNotes(notes(100, 200, 300), [[tok('ла', 90, 110), tok('-', 120, 250)]], 'b');
		expect(under(spans.notes)).toEqual([false, true, false]);
		const none = markExtenderNotes(notes(100, 300), [[tok('ла', 90, 110), tok('-', 150, 250), tok('ва', 290, 310)]], 'b');
		expect(under(none.notes)).toEqual([false, false]);
	});

	it('does not count a note already tied into as the free note a hyphen spans', () => {
		const given = notes(100, 200, 300).map((n, i) => (i === 1 ? { ...n, tiedInto: true } : n));
		const out = markExtenderNotes(given, [[tok('ла', 90, 110), tok('-', 120, 250)]], 'b');
		expect(under(out.notes)).toEqual([false, false, false]);
	});

	it('keeps arm a\'s reading of an underscore', () => {
		const out = markExtenderNotes(notes(100, 200, 300), [[tok('ла', 90, 110), tok('_', 150, 320)]], 'b');
		expect(under(out.notes)).toEqual([false, true, true]);
	});
});

const transform: FrameTransform = { scale: 1, pad: 16, angle: 0, width: 1200, height: 42 };
const row = (id: number): RowLayout => ({ id, transform, offsetX: 0, offsetY: 265 });
const box = (text: string, x0: number, x1: number): WordBox => ({ text, x0: x0 + 16, x1: x1 + 16, y0: 16, y1: 48 });
const known = new Set(['мир', 'ты', 'бала']);
const seams: Seams = { isWord: (w) => known.has(w), cut: (w) => [w.toLowerCase()] };
const sys = (n: NotePlace[], rows: RowLayout[], extra: Partial<SystemLayout> = {}): SystemLayout => ({ staffSpace: 30, notes: n, hasBand: true, rows, ...extra });
const lay = (...systems: SystemLayout[]): PageLayout => ({ width: 1200, height: 1100, systems, unfound: 0 });

describe('seatPage with an extender', () => {
	it('makes the notes under the line continuations before the free notes are counted, so none is a no-syllable breach', () => {
		const page = seatPage(lay(sys(notes(100, 200, 300), [row(0)])), [[box('мир', 90, 110), box('_', 150, 320)]], seams);
		expect(page.stats.counted.breaches).toEqual([]);
		expect(page.stats.counted.perSystem[0]).toMatchObject({ free: 1, slurFree: 1, units: 1 });
		expect(page.stats.extenders).toMatchObject({ extender: 1, marked: 2 });
		expect(page.words.map((w) => w.syllables.map((s) => [s.text, s.note, s.sustained]))).toEqual([[['мир', 0, true]]]);
	});

	it('without the line the same row leaves two notes with no syllable, which is what the line prevents', () => {
		const page = seatPage(lay(sys(notes(100, 200, 300), [row(0)])), [[box('мир', 90, 110)]], seams);
		expect(page.stats.counted.breaches.filter((b) => b.kind === 'no-syllable')).toHaveLength(2);
	});

	it('reads the hyphen only in arm b', () => {
		const reads = [[box('мир', 90, 110), box('-', 190, 205)]]; // 15 px wide: a hyphen, not a long dash (half the ink height is 16)
		const a = seatPage(lay(sys(notes(100, 200, 300), [row(0)])), reads, seams);
		const b = seatPage(lay(sys(notes(100, 200, 300), [row(0)])), reads, seams, { extenderArm: 'b' });
		expect(a.stats.extenders.marked).toBe(0);
		expect(b.stats.extenders.marked).toBe(1);
	});
});

describe('the system that held no ink', () => {
	it('is «no ink» only with a band, no text-line candidate, and a share at the threshold (nought, until the desk sets it)', () => {
		expect(bandHeldNoInk({ hasBand: true, inkShare: 0, textLines: 0 })).toBe(true);
		expect(bandHeldNoInk({ hasBand: true, inkShare: 0.0001, textLines: 0 })).toBe(false);
		expect(bandHeldNoInk({ hasBand: true, inkShare: 0, textLines: 1 })).toBe(false);
		expect(bandHeldNoInk({ hasBand: false, inkShare: 0, textLines: 0 })).toBe(false);
		expect(bandHeldNoInk({ hasBand: true })).toBe(false);
	});

	it('says «no ink» and not «no Russian row», and a band with ink still says the latter', () => {
		const empty = seatPage(lay(sys(notes(100), [], { inkShare: 0, textLines: 0 })), [], seams);
		expect(empty.systems[0]).toMatchObject({ written: false, why: 'no ink' });
		const inked = seatPage(lay(sys(notes(100), [], { inkShare: 0.01, textLines: 0 })), [], seams);
		expect(inked.systems[0]).toMatchObject({ written: false, why: 'no Russian row' });
	});

	it('is silent when every sung note is tied into, and not when one note needs a syllable', () => {
		const tied = (n: NotePlace[]) => n.map((x) => ({ ...x, tiedInto: true }));
		const silent = seatPage(lay(sys(tied(notes(100, 200)), [], { inkShare: 0, textLines: 0 })), [], seams);
		expect(silent.systems[0].silent).toBe(true);
		const mixed = seatPage(lay(sys([...notes(100), ...tied(notes(200))].map((n, i) => ({ ...n, id: i })), [], { inkShare: 0, textLines: 0 })), [], seams);
		expect(mixed.systems[0].silent).toBeUndefined();
	});

	it('leaves a silent system out of the unread bars, and keeps a system with ink and no Russian row in', () => {
		const written = sys(notes(100), [row(0)]);
		const silentSys = sys(notes(100, 200).map((n) => ({ ...n, bar: 2, tiedInto: true })), [], { inkShare: 0, textLines: 0 });
		const unreadSys = sys(notes(100).map((n) => ({ ...n, bar: 3 })), [], { inkShare: 0.02, textLines: 0 });
		const page = seatPage(lay(written, silentSys, unreadSys), [[box('мир', 90, 110)]], seams);
		const song = applyUnderlay(['<score-partwise><part id="P1"><measure number="1"/></part></score-partwise>'], [{ ...page, ms: { prepare: 0, read: 0, seat: 0 } }]);
		expect(song.unread.map((u) => [u.system, u.why])).toEqual([[3, 'no Russian row']]);
	});
});

describe('bandInk', () => {
	const band = (w: number, h: number, ink: (x: number, y: number) => boolean) => {
		const data = new Uint8Array(w * h).fill(255);
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (ink(x, y)) data[y * w + x] = 0;
		return { width: w, height: h, data, paper: 255 };
	};

	it('is nought and has no line for white paper', () => {
		expect(bandInk(band(200, 40, () => false), 10)).toEqual({ share: 0, lines: 0 });
	});

	it('counts a text-line candidate where more than LINE_SHARE of the width holds ink', () => {
		const got = bandInk(band(200, 40, (x, y) => y === 20 && x < 100), 10);
		expect(got.lines).toBe(1);
		expect(got.share).toBeCloseTo(100 / 8000, 6);
	});

	it('has ink and no line where a speck is under LINE_SHARE of the width', () => {
		const got = bandInk(band(200, 40, (x, y) => y === 20 && x < 3), 10);
		expect(got.lines).toBe(0);
		expect(got.share).toBeGreaterThan(0);
	});
});

describe('isContinuation still reads the flag', () => {
	it('is the only reader: a note under the line is a continuation', () => {
		expect(isContinuation({ id: 0, x: 0, bar: 1, underExtender: true })).toBe(true);
	});
});
