/**
 * The worker's half of a page's underlay, on a page drawn by hand: three
 * staves (the voice's, the piano's two), a row of text under the voice staff,
 * and a MusicXML whose notes carry `imgpos` over the voice staff.
 */
import { describe, expect, it } from 'vitest';
import { prepareUnderlay, voiceNotes } from './underlay-prepare';
import { inkExtent } from './underlay-frame';
import type { Grey, StaffBoxLike } from './metre-windows';

const W = 1200;
const H = 1100;
const SPACE = 30;

function page(): Grey & { data: Uint8Array } {
	const data = new Uint8Array(W * H).fill(255);
	const fill = (x0: number, x1: number, y0: number, y1: number) => {
		for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) data[y * W + x] = 20;
	};
	for (const top of [100, 500, 800]) for (let k = 0; k < 5; k++) fill(100, 1100, top + k * SPACE - 1, top + k * SPACE + 2);
	for (let i = 0; i < 13; i++) fill(160 + i * 70, 200 + i * 70, 270, 298); // the row of words under the voice staff: 13 blocks, sparse as a row of words is
	return { width: W, height: H, data };
}

const box = (top: number, index: number): StaffBoxLike => ({ cx: 0.5, cy: (top + 60) / H, w: 1000 / W, h: 124 / H, index });
const boxes = [box(100, 0), box(500, 1), box(800, 2)];

const note = (x: number, y: number, extra = '') => `      <note>\n        <pitch><step>C</step><octave>5</octave></pitch>\n        <duration>4</duration>\n        <type>quarter</type>\n${extra}        <!-- imgpos: ${x}, ${y} -->\n      </note>\n`;
const rest = `      <note>\n        <rest />\n        <duration>4</duration>\n        <!-- imgpos: 400, 160 -->\n      </note>\n`;
const xml = (...measures: string[]) =>
	`<score-partwise>\n  <part-list><score-part id="P1"/></part-list>\n  <part id="P1">\n${measures.map((m, i) => `    <measure number="${i + 1}">\n${m}    </measure>\n`).join('')}  </part>\n  <part id="P2">\n    <measure number="1">\n${note(1, 1)}    </measure>\n  </part>\n</score-partwise>\n`;

const music = xml(note(300, 160) + rest, note(500, 150, '        <tie type="stop" />\n') + note(700, 170));

describe('voiceNotes', () => {
	it('lists the notes of the first part only, rests counted, with imgpos, bar, and a tie\'s stop', () => {
		expect(voiceNotes(music)).toEqual([
			{ ordinal: 0, rest: false, bar: 1, at: { x: 300, y: 160 }, tiedInto: false },
			{ ordinal: 1, rest: true, bar: 1, at: { x: 400, y: 160 }, tiedInto: false },
			{ ordinal: 2, rest: false, bar: 2, at: { x: 500, y: 150 }, tiedInto: true },
			{ ordinal: 3, rest: false, bar: 2, at: { x: 700, y: 170 }, tiedInto: false },
		]);
	});

	it('does not take a tie\'s start, or a note without imgpos, as anything else', () => {
		const out = voiceNotes(xml(`      <note>\n        <pitch><step>C</step><octave>5</octave></pitch>\n        <tie type="start" />\n      </note>\n`));
		expect(out).toEqual([{ ordinal: 0, rest: false, bar: 1, at: null, tiedInto: false }]);
	});

	it('has no notes where there is no part', () => {
		expect(voiceNotes('<score-partwise></score-partwise>')).toEqual([]);
	});
});

describe('prepareUnderlay', () => {
	const prepared = prepareUnderlay(page(), music, boxes);

	it('makes one system of the voice staff, with its sung notes by their ordinals and the tie flagged', () => {
		expect(prepared.layout.systems).toHaveLength(1);
		const system = prepared.layout.systems[0];
		expect(system.staffSpace).toBeGreaterThan(28);
		expect(system.staffSpace).toBeLessThan(32);
		expect(system.notes).toEqual([
			{ id: 0, x: 300, bar: 1, tiedInto: false },
			{ id: 2, x: 500, bar: 2, tiedInto: true },
			{ id: 3, x: 700, bar: 2, tiedInto: false },
		]);
		expect(system.hasBand).toBe(true);
		expect(prepared.layout.unfound).toBe(0);
	});

	it('finds the row between the voice staff and the piano\'s, and frames it with its ink 32 px high and 16 px of padding', () => {
		expect(prepared.rows).toHaveLength(1);
		const row = prepared.rows[0];
		const [first, last] = inkExtent(row.data, row.width, row.height)!;
		expect(Math.abs(last - first + 1 - 32)).toBeLessThanOrEqual(1);
		expect(first).toBeGreaterThanOrEqual(16);
		const layout = prepared.layout.systems[0].rows[0];
		expect(layout).toMatchObject({ id: 0, offsetX: 0 });
		expect(layout.transform.pad).toBe(16);
		expect(layout.transform.scale).toBeCloseTo(32 / 28, 1);
		// The band starts 1.5 spaces under the staff's bottom line, which is the row's page offset or under.
		expect(layout.offsetY).toBeGreaterThanOrEqual(220 + 45);
		expect(layout.offsetY).toBeLessThanOrEqual(270);
	});

	it('maps the framed ink back to where it stands on the page', async () => {
		const { unframeBox } = await import('./underlay-frame');
		const { transform, offsetY } = prepared.layout.systems[0].rows[0];
		const row = prepared.rows[0];
		let x0 = row.width;
		let x1 = 0;
		for (let y = 0; y < row.height; y++) {
			for (let x = 0; x < row.width; x++) {
				if (row.data[y * row.width + x] < 128) {
					x0 = Math.min(x0, x);
					x1 = Math.max(x1, x + 1);
				}
			}
		}
		const back = unframeBox(transform, { x0, y0: 0, x1, y1: 1 });
		expect(Math.abs(back.x0 - 160)).toBeLessThanOrEqual(1);
		expect(Math.abs(back.x1 - 1040)).toBeLessThanOrEqual(1);
		expect(offsetY).toBeGreaterThan(0);
	});

	it('makes no system where the page holds no voice note, and counts a box with no staff in it', () => {
		const none = prepareUnderlay(page(), xml(rest), boxes);
		expect(none.layout.systems).toEqual([]);
		const blank = { width: W, height: H, data: new Uint8Array(W * H).fill(255) };
		const lost = prepareUnderlay(blank, music, boxes);
		expect(lost.layout.systems).toEqual([]);
		expect(lost.layout.unfound).toBe(3);
	});

	it('keeps a system whose band is too thin, with no rows', () => {
		const close = prepareUnderlay(page(), music, [boxes[0], { ...boxes[1], cy: (260 + 60) / H }]);
		// The second staff box now sits where the first row of text is; no staff is found there, so only the voice staff remains and its band runs 20 spaces.
		expect(close.layout.systems).toHaveLength(1);
	});
});
