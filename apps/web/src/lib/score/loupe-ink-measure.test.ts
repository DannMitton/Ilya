import { describe, expect, it } from 'vitest';
import { MEASURE_PX, measureGlyphInk } from './loupe-ink';

/** A stub canvas: each glyph's bounds come from a table, and `font` is recorded. */
function stub(table: Record<string, Partial<TextMetrics>>) {
	return {
		font: '',
		measureText(text: string) {
			return (table[text] ?? {}) as TextMetrics;
		},
	};
}

describe('measureGlyphInk', () => {
	it('returns { x: -left, y: -ascent, width, height } per glyph', () => {
		const ctx = stub({
			a: { actualBoundingBoxLeft: 2, actualBoundingBoxRight: 30, actualBoundingBoxAscent: 88.9, actualBoundingBoxDescent: 13.2 },
		});
		const out = measureGlyphInk(['a'], ctx);
		expect(out.a.x).toBe(-2);
		expect(out.a.y).toBe(-88.9);
		expect(out.a.width).toBe(32);
		expect(out.a.height).toBeCloseTo(102.1, 5);
	});

	it('measures at MEASURE_PX in the notation face', () => {
		const ctx = stub({});
		measureGlyphInk([], ctx);
		expect(ctx.font).toBe(`${MEASURE_PX}px 'Finale Maestro'`);
	});

	it('skips a glyph with a zero box, and one the browser reports no bounds for', () => {
		const ctx = stub({
			flat: { actualBoundingBoxLeft: 0, actualBoundingBoxRight: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 },
			ok: { actualBoundingBoxLeft: 0, actualBoundingBoxRight: 10, actualBoundingBoxAscent: 5, actualBoundingBoxDescent: 0 },
		});
		const out = measureGlyphInk(['flat', 'none', 'ok'], ctx);
		expect(Object.keys(out)).toEqual(['ok']);
	});
});
