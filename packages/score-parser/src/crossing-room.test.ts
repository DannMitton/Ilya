/**
 * crossing-room.test.ts: the notes make room for the red crossing ring (QUEUE
 * row 78c; Dann 2026-10-11 20:14, `OPEN.md` "THE RED CROSSING RING STANDS
 * OUTSIDE THE SELECTION RING"). The renderer knows each crossing before layout
 * (`AnalyzedEvent.crossing`), carries the ring's reach on the column's ink,
 * and adds it to the spacing and to the system's headroom. A song with no
 * crossing is drawn exactly as before.
 */
import { describe, expect, it } from 'vitest';
import { analyzeScore } from './overlay-engine';
import { columnAdvance, columnInk, newAccidentalCarry, renderAnalyzedStaff, type ColumnInk, type StaffRenderOptions } from './staff-renderer';
import { demoProfile, demoResolver, demoScore } from './demo-fixture';
import { CROSSING_RING_HEADROOM, CROSSING_RING_REACH } from './ring-geometry';
import type { AnalyzedScore } from './analysis-types';

const AT = { generatedAt: '2026-10-12T00:00:00.000Z' };
const viewBox = (svg: string) => /viewBox="([^"]+)"/.exec(svg)![1].split(' ').map(Number);
/** The demo, with n6's crossing as the engine forecasts it or switched off. */
function demo(crossing: boolean, options: StaffRenderOptions = {}): { svg: string; analyzed: AnalyzedScore } {
  const parsed = demoScore();
  const analyzed = analyzeScore(parsed, demoProfile, demoResolver, AT);
  if (!crossing) for (const e of Object.values(analyzed.events)) e.crossing = false;
  return { svg: renderAnalyzedStaff(parsed, analyzed, options), analyzed };
}

describe('the crossing ring\'s room (row 78c)', () => {
  it('the demo forecasts one crossing, n6', () => {
    expect(Object.values(demo(true).analyzed.events).filter((e) => e.crossing).map((e) => e.eventId)).toEqual(['n6']);
  });

  it('a crossing column carries the ring\'s reach on its ink; another carries none', () => {
    const parsed = demoScore();
    const analyzed = analyzeScore(parsed, demoProfile, demoResolver, AT);
    const byId = Object.fromEntries(parsed.vocalLine.map((e) => [e.id, e]));
    const ink = (id: string) => columnInk(byId[id], analyzed.events[id], newAccidentalCarry(0), {}, {});
    expect(ink('n6').ringReach).toBe(CROSSING_RING_REACH);
    expect(ink('n5').ringReach).toBeUndefined();
  });

  it('adds the reach to the ink term on the crossing\'s side, and to the text term', () => {
    const ev = demoScore().vocalLine.find((e) => e.id === 'n5')!;
    const plain: ColumnInk = { left: 20, right: 20, turningDisplaced: false };
    const ringed: ColumnInk = { ...plain, ringReach: CROSSING_RING_REACH };
    const opts = { minGap: 0, pxPerWhole: 0 };
    expect(columnAdvance(ev, ev, 0, opts, ringed, plain) - columnAdvance(ev, ev, 0, opts, plain, plain)).toBeCloseTo(CROSSING_RING_REACH, 9);
    expect(columnAdvance(ev, ev, 0, opts, ringed, ringed) - columnAdvance(ev, ev, 0, opts, plain, plain)).toBeCloseTo(2 * CROSSING_RING_REACH, 9);
    // With no ink measured, the text term alone answers, and it grows by the same reach.
    const textOnly = { minGap: 0, pxPerWhole: 0 };
    expect(columnAdvance(ev, ev, 0, textOnly, { left: 0, right: 0, turningDisplaced: false, ringReach: CROSSING_RING_REACH }, { left: 0, right: 0, turningDisplaced: false }))
      .toBeGreaterThan(columnAdvance(ev, ev, 0, textOnly, { left: 0, right: 0, turningDisplaced: false }, { left: 0, right: 0, turningDisplaced: false }));
  });

  it('widens the system by the reach the crossing needs, and changes nothing without one', () => {
    const [, , wWith] = viewBox(demo(true).svg);
    const [, , wWithout] = viewBox(demo(false).svg);
    expect(wWith - wWithout).toBeCloseTo(CROSSING_RING_REACH, 6);
  });

  it('gives a system that holds a crossing the ring\'s headroom above its highest ink', () => {
    const tall = { staffMidY: 300 };
    const [, yWith] = viewBox(demo(true, tall).svg);
    const [, yWithout] = viewBox(demo(false, tall).svg);
    expect(yWithout - yWith).toBeGreaterThanOrEqual(Math.floor(CROSSING_RING_HEADROOM));
    expect(yWithout - yWith).toBeLessThanOrEqual(Math.ceil(CROSSING_RING_HEADROOM));
  });
});
