/**
 * The Markup legend's stems drawing (N.176). Every expectation comes from the
 * brief's contract, not from the drawing's own code: four notes, two beamed
 * eighths, a quarter, and a half; every stem points the stated way; the heads
 * and ink are the stave's.
 */

import { describe, it, expect } from 'vitest';
import { stemLegendDrawing } from './stem-legend';
import { syntheticSmuflFont } from './demo-fixture';

const lines = (inner: string) =>
  [...inner.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)" stroke="([^"]+)" stroke-width="([-\d.]+)"\/>/g)].map((m) => ({
    x1: Number(m[1]), y1: Number(m[2]), x2: Number(m[3]), y2: Number(m[4]), ink: m[5],
  }));

describe.each([
  ['the music font', { font: syntheticSmuflFont(), fontFamily: 'TestFont' }],
  ['the primitive shapes, before the font loads', {}],
] as const)('stemLegendDrawing with %s', (_name, options) => {
  it('draws four heads and four stems, with one beam across the two eighths', () => {
    const { inner } = stemLegendDrawing('up', options);
    const heads = 'font' in options ? (inner.match(/<text /g) ?? []).length : (inner.match(/<ellipse /g) ?? []).length;
    expect(heads).toBe(4);
    // Five lines: four vertical stems and one horizontal beam.
    const ls = lines(inner);
    expect(ls.filter((l) => l.x1 === l.x2)).toHaveLength(4);
    expect(ls.filter((l) => l.y1 === l.y2)).toHaveLength(1);
  });

  it('points every stem up in the first row and down in the second', () => {
    for (const [dir, sign] of [['up', -1], ['down', 1]] as const) {
      const stems = lines(stemLegendDrawing(dir, options).inner).filter((l) => l.x1 === l.x2);
      for (const s of stems) expect(Math.sign(s.y2 - s.y1)).toBe(sign);
    }
  });

  it('draws the two rows as mirror images, and in the stave’s ink', () => {
    const up = stemLegendDrawing('up', options);
    const down = stemLegendDrawing('down', options);
    expect(up.width).toBe(down.width);
    expect(up.height).toBe(down.height);
    for (const l of [...lines(up.inner), ...lines(down.inner)]) expect(l.ink).toBe('#1a1612');
  });

  it('keeps all its ink inside its own box', () => {
    for (const dir of ['up', 'down'] as const) {
      const d = stemLegendDrawing(dir, options);
      for (const l of lines(d.inner)) {
        for (const y of [l.y1, l.y2]) {
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(d.height);
        }
        for (const x of [l.x1, l.x2]) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(d.width);
        }
      }
    }
  });
});
