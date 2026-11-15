import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LENGTH_CELLS } from '$lib/score/correction';
import { ACTIVE, BOX, FRAME, ICON_STRIPES, NOTE_BBOX, NOTE_GLYPH, NOTE_FONT_SIZE, STAFF, activeZoneEnlarged, noteBaselineY, noteX, staffLineYs, vowelSpace } from './welcome-plate';

const proto = readFileSync(new URL('../../../../../../docs/sessions/welcome-sheet/ilya-welcome-draft-17.html', import.meta.url), 'utf8').replace(/base64,[A-Za-z0-9+/=]{200,}/g, 'base64,');

/** The prototype's fifth layer: the vowel space, as it printed its numbers (taken from the chart). */
const layer5 = proto.match(/<ellipse cx="63\.6"[\s\S]*?<circle cx="183\.3"[^>]*>/)![0];
const printed = [...layer5.matchAll(/<ellipse cx="([\d.]+)" cy="([\d.]+)" rx="([\d.]+)" ry="([\d.]+)" style="fill:(#[0-9A-Fa-f]+);fill-opacity:([\d.]+)/g)].map((m) => ({
	cx: Number(m[1]), cy: Number(m[2]), rx: Number(m[3]), ry: Number(m[4]), colour: m[5], opacity: Number(m[6])
}));
const printedDot = (() => {
	const m = layer5.match(/<circle cx="([\d.]+)" cy="([\d.]+)"/)!;
	return { x: Number(m[1]), y: Number(m[2]) };
})();

describe('the vowel space is computed from the chart\'s own code and reproduces the ratified prototype', () => {
	const space = vowelSpace();

	it('has the ten zones, in Grayson\'s order, that the prototype printed', () => {
		expect(space.zones).toHaveLength(10);
		expect(printed).toHaveLength(10);
	});

	it('puts every zone where the prototype printed it, to a tenth of a unit', () => {
		space.zones.forEach((z, i) => {
			expect(z.cx, `${z.vowel} cx`).toBeCloseTo(printed[i].cx, 1);
			expect(z.cy, `${z.vowel} cy`).toBeCloseTo(printed[i].cy, 1);
			expect(z.rx, `${z.vowel} rx`).toBeCloseTo(printed[i].rx, 1);
			expect(z.ry, `${z.vowel} ry`).toBeCloseTo(printed[i].ry, 1);
			expect(z.opacity, `${z.vowel} opacity`).toBeCloseTo(printed[i].opacity, 2);
		});
	});

	it('puts the [ɑ] dot where the prototype did', () => {
		expect(space.dot.x).toBeCloseTo(printedDot.x, 1);
		expect(space.dot.y).toBeCloseTo(printedDot.y, 1);
	});

	it('takes each zone\'s colour from the chart\'s tokens, and singles out [ɑ] at 0.5', () => {
		const a = space.zones.find((z) => z.vowel === ACTIVE)!;
		expect(a.fill).toBe('var(--zone-dark-a)');
		expect(a.opacity).toBe(0.5);
		expect(space.zones.filter((z) => z.opacity === 0.5)).toHaveLength(1);
		expect(space.zones.every((z) => z.fill.startsWith('var(--zone-'))).toBe(true);
	});

	it('keeps every zone inside the frame', () => {
		for (const z of space.zones) {
			expect(z.cx - z.rx).toBeGreaterThanOrEqual(FRAME.x - 1);
			expect(z.cx + z.rx).toBeLessThanOrEqual(FRAME.x + FRAME.w + 1);
			expect(z.cy - z.ry).toBeGreaterThanOrEqual(FRAME.y - 1);
			expect(z.cy + z.ry).toBeLessThanOrEqual(FRAME.y + FRAME.h + 1);
		}
	});

	it('enlarges the [ɑ] zone to the prototype\'s 89.7 by 103.7 at the centre of the box', () => {
		const big = activeZoneEnlarged(space);
		expect(big.cx).toBe(BOX / 2);
		expect(big.cy).toBe(BOX / 2);
		expect(big.rx).toBeCloseTo(89.7, 0);
		expect(big.ry).toBeCloseTo(103.7, 0);
	});
});

describe('the staff and the note', () => {
	it('draws five lines 25 units apart, the middle one on the box\'s centre, as the prototype does', () => {
		expect(staffLineYs()).toEqual([100, 125, 150, 175, 200]);
		expect(STAFF.x1).toBe(26);
		expect(STAFF.x2).toBe(274);
		expect(noteBaselineY()).toBe(150);
	});

	it('sizes the Bravura glyph so a staff space is the staff\'s gap (SMuFL: a quarter of the font size)', () => {
		expect(NOTE_FONT_SIZE / 4).toBe(STAFF.gap);
	});

	it('holds the pinned bounding box of U+E1D7 (metNote8thUp) to Bravura\'s own metadata, so the constant cannot drift', () => {
		const meta = JSON.parse(readFileSync(new URL('../../../../static/fonts/bravura/bravura_metadata.json', import.meta.url), 'utf8'));
		const box = meta.glyphBBoxes.metNote8thUp;
		expect(NOTE_BBOX.sw).toEqual(box.bBoxSW);
		expect(NOTE_BBOX.ne).toEqual(box.bBoxNE);
	});

	it('draws the glyph the app\'s own length picker draws for an eighth note', () => {
		expect(LENGTH_CELLS.find((c) => c.base === 'eighth')!.glyph).toBe(NOTE_GLYPH);
		expect(NOTE_GLYPH).toBe('\uE1D7');
	});

	it('centres the glyph\'s bounding box on the box\'s middle', () => {
		const left = noteX();
		const right = left + NOTE_BBOX.ne[0] * STAFF.gap;
		expect((left + right) / 2).toBeCloseTo(BOX / 2, 0);
	});
});

describe('the icon', () => {
	it('is five equal stripes in the jewels of TEXT, MELODY, INSIGHTS, LEARN, GUIDE: sage, lavender, rose, slate, cobalt', () => {
		expect(ICON_STRIPES).toEqual(['var(--sage-jewel)', 'var(--lavender-jewel)', 'var(--rose-jewel)', 'var(--slate-jewel)', 'var(--cobalt-jewel)']);
	});
	it('reads Илья in the same five colours as the prototype\'s stripes (each token\'s value is the prototype\'s hex)', () => {
		const css = readFileSync(new URL('../../../app.css', import.meta.url), 'utf8');
		const token = (n: string) => css.match(new RegExp(`--${n}-jewel:\\s*(#[0-9A-Fa-f]{6})`))![1].toLowerCase();
		const hex = [...proto.matchAll(/<i style="background:(#[0-9A-Fa-f]{6})"><\/i>/g)].map((m) => m[1].toLowerCase());
		expect(hex).toEqual(['sage', 'lavender', 'rose', 'slate', 'cobalt'].map(token));
	});
});
