import { describe, expect, it } from 'vitest';
import { notePositions, rekeyLine, rekeyOldReaderSeats, rekeyOnArrival, scaleOf, type PlacedEvent } from './old-reader-seats';
import type { Pairing, PairingMap } from './pairings';

/** An event as the parser names it without a supplied id: `m{bar}-{num}-{den}`. */
function ev(bar: number, num: number, den: number, extra: Partial<PlacedEvent> = {}): PlacedEvent {
	return { id: `m${bar}-${num}-${den}`, type: 'note', measureIndex: bar, rhythmicPosition: { fraction: { numerator: num, denominator: den } }, ...extra };
}
const syl = (cyrillic: string): Pairing => ({ kind: 'syllable', cyrillic, ipa: cyrillic, vowel: undefined, origin: { line: 0, word: 0, slot: 0 } as never });

// Bar 7: rest, rest, one note. Bar 8: three eighths. As «Средь шумного бала» opens.
const LINE: PlacedEvent[] = [
	ev(7, 0, 1, { type: 'rest' }), ev(7, 1, 8, { type: 'rest' }), ev(7, 1, 4),
	ev(8, 0, 1), ev(8, 1, 8), ev(8, 1, 4),
];

describe('row 93 rekeyOldReaderSeats', () => {
	it('files a wholly old-keyed map under the notes of an id-less reading, in x order within each bar', () => {
		const map: PairingMap = { 'r7-2883': syl('Средь'), 'r8-3100': syl('го'), 'r8-2990': syl('шум'), 'r8-3040': syl('но') };
		const r = rekeyOldReaderSeats(map, LINE);
		expect(r.map).toEqual({ 'm7-1-4': syl('Средь'), 'm8-1-4': syl('го'), 'm8-0-1': syl('шум'), 'm8-1-8': syl('но') });
		expect([r.moved, r.left]).toEqual([4, 0]);
		expect(r.bars).toEqual([
			{ measureIndex: 7, rule: 'order', seats: 1, targets: 1 },
			{ measureIndex: 8, rule: 'order', seats: 3, targets: 3 },
		]);
		expect(rekeyLine(r)).toBe('[Ilya] N.185 re-key: 4 seats moved, 0 left under old names, 0 bars left');
	});

	it('orders a shared x by the collision ordinal', () => {
		const map: PairingMap = { 'r8-3000-1': syl('но'), 'r8-3000': syl('шум'), 'r8-3100': syl('го') };
		expect(rekeyOldReaderSeats(map, LINE).map).toEqual({ 'm8-1-8': syl('но'), 'm8-0-1': syl('шум'), 'm8-1-4': syl('го') });
	});

	it('moves only the old names of a mixed map, keeps the current ones, and leaves a bar whose target already holds an entry', () => {
		const later: PlacedEvent[] = [...LINE, ev(9, 0, 1)];
		const map: PairingMap = {
			'r7-2883': syl('Средь'),
			'm8-0-1': syl('шум'), 'm8-1-8': syl('но'), 'm8-1-4': syl('го'),
			'r9-500': syl('ба'), 'm9-0-1': syl('ла'),
		};
		const r = rekeyOldReaderSeats(map, later);
		expect(r.map).toEqual({ 'm7-1-4': syl('Средь'), 'm8-0-1': syl('шум'), 'm8-1-8': syl('но'), 'm8-1-4': syl('го'), 'r9-500': syl('ба'), 'm9-0-1': syl('ла') });
		expect([r.moved, r.left]).toEqual([1, 1]);
		expect(r.bars.map((b) => b.rule)).toEqual(['order', 'left']);
		expect(rekeyLine(r)).toBe('[Ilya] N.185 re-key: 1 seat moved, 1 left under old names, 1 bar left');
	});

	it('places a bar whose counts disagree by bar-relative page position where that is one-to-one', () => {
		// Four notes, two seats: on the first and the third, at the old reader's own scale.
		const bar: PlacedEvent[] = [ev(3, 0, 1), ev(3, 1, 8), ev(3, 1, 4), ev(3, 3, 8)];
		const imgpos = new Map([['m3-0-1', 1000], ['m3-1-8', 1100], ['m3-1-4', 1200], ['m3-3-8', 1300]]);
		const map: PairingMap = { 'r3-400': syl('а'), 'r3-600': syl('о') };
		// Old span 400..600 normalises to 0 and 1, so the seats land on the first and the last note.
		const r = rekeyOldReaderSeats(map, bar, imgpos);
		expect(r.map).toEqual({ 'm3-0-1': syl('а'), 'm3-3-8': syl('о') });
		expect(r.bars).toEqual([{ measureIndex: 3, rule: 'imgpos', seats: 2, targets: 4 }]);
	});

	it('leaves a bar whose counts disagree under the old names where the nearest notes are not one-to-one', () => {
		const bar: PlacedEvent[] = [ev(3, 0, 1), ev(3, 1, 4)];
		const imgpos = new Map([['m3-0-1', 1000], ['m3-1-4', 1300]]);
		// Three seats on two notes: two of them must share a note.
		const map: PairingMap = { 'r3-400': syl('а'), 'r3-500': syl('о'), 'r3-600': syl('у') };
		const r = rekeyOldReaderSeats(map, bar, imgpos);
		expect(r.map).toBe(map);
		expect([r.moved, r.left]).toEqual([0, 3]);
		expect(r.bars).toEqual([{ measureIndex: 3, rule: 'left', seats: 3, targets: 2 }]);
	});

	it('leaves a bar whose counts disagree where the reading carries no page position', () => {
		const map: PairingMap = { 'r8-2990': syl('шум'), 'r8-3100': syl('го') };
		const r = rekeyOldReaderSeats(map, LINE);
		expect(r.map).toBe(map);
		expect(r.bars).toEqual([{ measureIndex: 8, rule: 'left', seats: 2, targets: 3 }]);
	});

	it('moves melisma and empty entries with their bar, and never onto a tie continuation', () => {
		const tied: PlacedEvent[] = [ev(4, 0, 1, { tied: { type: 'start' } }), ev(4, 1, 4, { tied: { type: 'stop' } }), ev(4, 1, 2), ev(4, 3, 4)];
		const map: PairingMap = { 'r4-10': syl('ла'), 'r4-30': { kind: 'melisma' }, 'r4-40': { kind: 'empty' } };
		const r = rekeyOldReaderSeats(map, tied);
		expect(r.map).toEqual({ 'm4-0-1': syl('ла'), 'm4-1-2': { kind: 'melisma' }, 'm4-3-4': { kind: 'empty' } });
		expect(r.bars).toEqual([{ measureIndex: 4, rule: 'order', seats: 3, targets: 3 }]);
	});

	it('is a no-op on a map already re-keyed, returning the same map', () => {
		const once = rekeyOldReaderSeats({ 'r7-2883': syl('Средь'), 'r8-2990': syl('шум'), 'r8-3040': syl('но'), 'r8-3100': syl('го') }, LINE);
		const twice = rekeyOldReaderSeats(once.map, LINE);
		expect(twice.map).toBe(once.map);
		expect([twice.moved, twice.left, twice.bars.length]).toEqual([0, 0, 0]);
		expect(rekeyLine(twice)).toBeNull();
	});

	it('is a no-op where the reading is the old reader’s own: its missing names are orphans of a re-read', () => {
		const own: PlacedEvent[] = [{ ...ev(7, 1, 4), id: 'r7-2883' }];
		const map: PairingMap = { 'r7-2883': syl('Средь'), 'r7-2950': syl('шум') };
		expect(rekeyOldReaderSeats(map, own).map).toBe(map);
	});
});

/**
 * Amendment 1. `inOrder` bars of one note each (20 by default, amendment 1b's minimum), placed in order, whose old x sits `gap` px from homr's imgpos;
 * then the next bar, whose counts disagree, with the given notes at the given imgpos and seats at the given old x.
 */
function song(gap: number, bar5: number[], seatXs: number[], inOrder = 20) {
	const line: PlacedEvent[] = [];
	const imgpos = new Map<string, number>();
	const map: PairingMap = {};
	for (let b = 0; b < inOrder; b++) {
		const e = ev(b, 0, 1);
		line.push(e);
		imgpos.set(e.id, 1000 + 100 * b);
		map[`r${b}-${1000 + 100 * b + gap}`] = syl(`s${b}`);
	}
	bar5.forEach((x, i) => {
		const e = ev(inOrder, i, 8);
		line.push(e);
		imgpos.set(e.id, x);
	});
	seatXs.forEach((x, i) => (map[`r${inOrder}-${x}`] = syl(`t${i}`)));
	return { line, imgpos, map };
}

describe('row 93 amendment 1, the raw-position rule', () => {
	it('places a lone seat by absolute x where the song passes the scale test', () => {
		// As «ви»: one seat at 3009, homr's notes at 3004 and 3160.
		const { line, imgpos, map } = song(9, [3004, 3160], [3009]);
		const r = rekeyOldReaderSeats(map, line, imgpos);
		expect(r.scale).toEqual({ pairs: 20, median: 9, p95: 9, shared: true });
		expect(r.map['m20-0-8']).toEqual(syl('t0'));
		expect(r.bars.at(-1)).toEqual({ measureIndex: 20, rule: 'raw', seats: 1, targets: 2 });
		expect([r.moved, r.left]).toEqual([21, 0]);
	});

	it('pairs by absolute x ahead of the bar-relative rule, which would stretch two seats over three notes', () => {
		// As bar 90: «люб» 1153 and «лю!» 1244 over eighths at 1150 and 1251 and a sixteenth at 1348.
		const { line, imgpos, map } = song(9, [1150, 1251, 1348], [1153, 1244]);
		const r = rekeyOldReaderSeats(map, line, imgpos);
		expect([r.map['m20-0-8'], r.map['m20-1-8'], r.map['m20-2-8']]).toEqual([syl('t0'), syl('t1'), undefined]);
		expect(r.bars.at(-1)?.rule).toBe('raw');
	});

	it('falls through unchanged where the song fails the scale test', () => {
		const shared = rekeyOldReaderSeats(...args(song(9, [1150, 1251, 1348], [1153, 1244])));
		const apart = rekeyOldReaderSeats(...args(song(45, [1150, 1251, 1348], [1153, 1244])));
		expect(apart.scale?.shared).toBe(false);
		// The bar-relative rule, as before amendment 1: the two seats go to the first and the last note.
		expect([apart.map['m20-0-8'], apart.map['m20-1-8'], apart.map['m20-2-8']]).toEqual([syl('t0'), undefined, syl('t1')]);
		expect(apart.bars.at(-1)?.rule).toBe('imgpos');
		expect(shared.bars.at(-1)?.rule).toBe('raw');
		// And a lone seat between two notes is still left.
		const lone = rekeyOldReaderSeats(...args(song(45, [3004, 3160], [3082])));
		expect(lone.bars.at(-1)?.rule).toBe('left');
		expect(lone.map['r20-3082']).toEqual(syl('t0'));
	});

	it('refuses a raw pairing beyond 60 px, leaving the bar to the bar-relative rule', () => {
		// The lone seat's nearest note is 61 px away; the bar-relative rule cannot place a lone seat between two notes.
		const r = rekeyOldReaderSeats(...args(song(9, [3004, 3160], [3065])));
		expect(r.scale?.shared).toBe(true);
		expect(r.bars.at(-1)?.rule).toBe('left');
		expect(r.map['r20-3065']).toEqual(syl('t0'));
		const within = rekeyOldReaderSeats(...args(song(9, [3004, 3160], [3064])));
		expect(within.bars.at(-1)?.rule).toBe('raw');
	});

	it('fails the scale test below 20 seats placed in order, however small the gaps (amendment 1b)', () => {
		const few = rekeyOldReaderSeats(...args(song(1, [1150, 1251, 1348], [1153, 1244], 19)));
		expect(few.scale).toEqual({ pairs: 19, median: 1, p95: 1, shared: false });
		// The old path: the bar-relative rule, the two seats on the first and the last note.
		expect(few.bars.at(-1)?.rule).toBe('imgpos');
		expect([few.map['m19-0-8'], few.map['m19-1-8'], few.map['m19-2-8']]).toEqual([syl('t0'), undefined, syl('t1')]);
	});

	it('takes the median and the nearest-rank 95th percentile of the gaps', () => {
		expect(scaleOf([])).toBeNull();
		const gaps = [...Array(19).fill(10), 41];
		expect(scaleOf(gaps)).toEqual({ pairs: 20, median: 10, p95: 10, shared: true });
		expect(scaleOf([...gaps, 41])).toEqual({ pairs: 21, median: 10, p95: 41, shared: false });
		expect(scaleOf([21, 21])?.shared).toBe(false);
	});
});

function args(s: ReturnType<typeof song>): [PairingMap, PlacedEvent[], Map<string, number>] {
	return [s.map, s.line, s.imgpos];
}

describe('row 93 rekeyOnArrival', () => {
	it('answers at once where the order rule places every seat, reads the arrived reading only where it leaves one, and a failed read leaves the bar', async () => {
		let reads = 0;
		const reading = async () => {
			reads++;
			throw new Error('unreadable');
		};
		const plain = rekeyOnArrival({ 'r7-2883': syl('Средь') }, LINE, reading);
		expect(plain).not.toBeInstanceOf(Promise);
		expect((plain as { moved: number }).moved).toBe(1);
		expect(reads).toBe(0);
		const r = await rekeyOnArrival({ 'r8-2990': syl('шум'), 'r8-3100': syl('го') }, LINE, reading);
		expect(reads).toBe(1);
		expect([r.moved, r.left]).toEqual([0, 2]);
	});
});

describe('row 93 notePositions', () => {
	const note = (x: number, rest = false) => `<note>${rest ? '<rest />' : '<pitch><step>F</step><octave>4</octave></pitch>'}<duration>1</duration><!-- imgpos: ${x}, 1118 --></note>`;

	it('reads homr’s imgpos x for each event of a single-part reading, bar by bar', () => {
		const xml = `<score-partwise><part id="P1"><measure number="1"></measure><measure number="2">${note(2768, true)}${note(2871)}</measure></part></score-partwise>`;
		const line = [ev(1, 0, 1, { type: 'rest' }), ev(1, 1, 8)];
		expect([...notePositions(xml, line)]).toEqual([['m1-0-1', 2768], ['m1-1-8', 2871]]);
	});

	it('gives a bar no positions where its notes do not line up with its events, and a reading of two parts none', () => {
		const one = `<part id="P1"><measure>${note(10)}<note><chord /><pitch /><duration>1</duration><!-- imgpos: 12, 0 --></note>${note(20)}</measure><measure>${note(30)}</measure></part>`;
		const line = [ev(0, 0, 1), ev(0, 1, 8), ev(1, 0, 1), ev(1, 1, 8)];
		expect([...notePositions(one, line)]).toEqual([['m0-0-1', 10], ['m0-1-8', 20]]);
		expect(notePositions(`${one}${one}`, line).size).toBe(0);
	});
});
