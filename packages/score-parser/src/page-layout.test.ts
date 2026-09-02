/**
 * Pagination tests: the shared demo fixture packed onto letter pages.
 * String and arithmetic assertions only — no browser.
 */

import { describe, expect, it } from 'vitest';
import { analyzeScore, pitchToHz } from './overlay-engine';
import { demoProfile, demoResolver, demoScore } from './demo-fixture';
import { LAST_SYSTEM_JUSTIFY_FILL, paginateScore, sliceScore, sliceWidth } from './page-layout';
import type { AnalyzedScore, VoiceProfileSnapshot } from './analysis-types';
import type { ParsedScore, Pitch, VocalLineEvent } from './types';

function demo() {
  const parsed = demoScore();
  const analyzed = analyzeScore(parsed, demoProfile, demoResolver, { generatedAt: '2026-07-12T00:00:00.000Z' });
  return { parsed, analyzed };
}

describe('page layout: slicing', () => {
  const { parsed } = demo();

  it('rebases measure indices and carries the active signatures', () => {
    const slice = sliceScore(parsed, 2, 3);
    expect(slice.measures).toHaveLength(2);
    expect(slice.measures[0].index).toBe(0);
    expect(slice.vocalLine[0].id).toBe('n7');
    expect(slice.vocalLine[0].measureIndex).toBe(0);
    expect(slice.keySignatures[0].signature.fifths).toBe(-1);
    expect(slice.timeSignatures[0].signature.beats).toBe(3);
  });

  it('packs on natural width, and a sole system is the FINAL one, so it is not stretched', () => {
    // History, because this assertion has now turned over twice. It first read
    // `rendered.width === sliceWidth(...)`, when a system was as wide as its
    // content. N.6b-2's justification made those two different numbers on
    // purpose and it asserted the stretched width instead. Dann's ruling of
    // 8 August turns it back for this case ONLY, and for a reason rather than
    // a loosening: a one-system score's only system is also the last system of
    // the piece, and the last system of the piece is never stretched.
    //
    // `sliceWidth` still decides packing, which is the other half of N.6b-2
    // and is asserted below unchanged. The justification half now lives in the
    // multi-system test, where there are non-final systems to justify.
    const { parsed: p, analyzed } = demo();
    const natural = sliceWidth(p, 0, p.measures.length - 1);
    const rendered = paginateScore(p, analyzed, { pageWidth: 4000, marginLeft: 0, marginRight: 0 });
    expect(rendered.systems).toHaveLength(1);
    expect(natural).toBeLessThan(4000);              // it fit, which is why there is one system
    expect(rendered.systems[0].width).toBeLessThan(4000); // and it was NOT stretched to the line
  });

  it('gives every system but the last the same width, reaching both margins', () => {
    const { parsed: p, analyzed } = demo();
    const out = paginateScore(p, analyzed, { pageWidth: 500, marginLeft: 0, marginRight: 0 });
    expect(out.systems.length).toBeGreaterThan(1);
    // Ruling 8 binds every system except the piece's last, which Dann's ruling
    // of 8 August exempts wherever it falls short of the margin. That is now a
    // property of BEING LAST rather than of standing alone on a page: this
    // fixture puts every system on one page and the exemption still applies to
    // the last of them.
    const body = out.systems.slice(0, -1);
    const last = out.systems[out.systems.length - 1];
    expect(body.length).toBeGreaterThan(0);
    for (const s of body) expect(s.width).toBe(500);
    expect(last.width).toBeLessThan(500);
    // The stave itself reaches the right margin, not merely the box around it.
    // Its LEFT edge is no longer 0: it is derived, one stave-space before the
    // clef (Gould r81), so only the right end is asserted here and the indent
    // has its own test in `staff-renderer.test.ts`.
    for (const s of body) expect(s.svg).toContain('x2="500"');
    // And the exempt one does NOT, which is the whole point of the ruling.
    expect(last.svg).not.toContain('x2="500"');
  });

  it('justifies the last system above the fill limit and not below it', () => {
    // Dann's ruling of 8 August: 75 percent is the limit for no justification,
    // 76 percent justifies. BOTH branches are exercised here, because a test
    // that only ever took the un-justified path would pass on the commit
    // before the threshold existed and would therefore prove nothing.
    //
    // The line width is derived from the content rather than chosen, so the
    // fill is known by construction: at pageWidth = natural / 0.95 the sole
    // system is about 95 percent full, and at natural / 0.5 about 50 percent.
    // pageHeight is huge so everything lands on one page and the aloneness
    // exemption cannot fire and confuse the reading.
    const { parsed: p, analyzed } = demo();
    const natural = sliceWidth(p, 0, p.measures.length - 1);
    const base = { pageHeight: 100000, marginLeft: 0, marginRight: 0 };

    const wide = Math.ceil(natural / 0.95); // ~95% full: above the limit
    const above = paginateScore(p, analyzed, { ...base, pageWidth: wide });
    expect(above.systems).toHaveLength(1);
    expect(above.systems[0].width).toBe(wide);

    const roomy = Math.ceil(natural / 0.5); // ~50% full: below the limit
    const below = paginateScore(p, analyzed, { ...base, pageWidth: roomy });
    expect(below.systems).toHaveLength(1);
    expect(below.systems[0].width).toBeLessThanOrEqual(roomy * LAST_SYSTEM_JUSTIFY_FILL);
  });

  it('lets a system standing alone on the last page keep its natural width', () => {
    // Ruling 9's original case, kept because it is the one Dann walked in
    // August and because it must survive the 8 August generalisation: what was
    // its own rule is now a special case of "the last system is not stretched".
    // If this ever fails while the test above passes, the generalisation has
    // lost the case it was generalised from.
    //
    // Page height sized from the REAL heights to fit exactly all but one
    // system, so the final page holds precisely one and the exemption applies.
    const { parsed: p, analyzed } = demo();
    const base = { pageWidth: 500, marginLeft: 0, marginRight: 0, marginTop: 40, marginBottom: 40, systemGap: 10 };
    const all = paginateScore(p, analyzed, { ...base, pageHeight: 100000 });
    const heights = all.systems.map((s) => s.height);
    expect(heights.length).toBeGreaterThanOrEqual(3);
    const head = heights.slice(0, -1);
    const need = head.reduce((a, b) => a + b, 0) + (head.length - 1) * base.systemGap;
    const out = paginateScore(p, analyzed, { ...base, pageHeight: base.marginTop + need + base.marginBottom });
    expect(out.pageCount).toBe(2);
    for (const s of out.systems.slice(0, -1)) expect(s.width).toBe(500);
    expect(out.systems[out.systems.length - 1].width).toBeLessThan(500);
  });
});

describe('page layout: system packing and page assembly', () => {
  const { parsed, analyzed } = demo();

  it('packs everything onto one letter page at default width', () => {
    const out = paginateScore(parsed, analyzed);
    expect(out.pageCount).toBe(1);
    expect(out.pages[0].startsWith('<svg viewBox="0 0 816 1056"')).toBe(true);
  });

  it('carries each system’s cropped min-y into its nested svg (N.6a)', () => {
    // The renderer crops the unoccupied space above the staff, so a system's
    // coordinate space no longer starts at 0. `viewBoxOf` and the nested
    // `<svg>` both have to honour that; a hardcoded 0 here would scroll the
    // staff off the top of every system on the page. The print stave is where
    // the crop is non-zero, so assert there.
    const out = paginateScore(parsed, analyzed, { lineGap: 5.5 });
    expect(out.systems.length).toBeGreaterThan(0);
    for (const s of out.systems) {
      expect(s.minY).toBeGreaterThan(0);
      expect(out.pages.join('\n')).toContain(`viewBox="0 ${s.minY} ${s.width} ${s.height}"`);
    }
  });

  it('breaks into multiple systems when the page is narrow', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500 });
    expect(out.systems.length).toBeGreaterThan(1);
    // Ranges tile the score exactly: no measure lost, none duplicated.
    let next = 0;
    for (const s of out.systems) {
      expect(s.fromMeasure).toBe(next);
      next = s.toMeasure + 1;
    }
    expect(next).toBe(parsed.measures.length);
  });

  it('renders every event exactly once across all pages', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500 });
    const all = out.pages.join('\n');
    for (const ev of parsed.vocalLine) {
      if (ev.type === 'note') {
        expect((all.match(new RegExp(`data-event-id="${ev.id}"`, 'g')) ?? []).length).toBe(1);
      }
    }
  });

  it('gives every system its own clef and key signature', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500 });
    const all = out.pages.join('\n');
    // Primitive-mode clef: one path + two dots per system head.
    expect((all.match(/q0 12 -14 16/g) ?? []).length).toBe(out.systems.length);
  });

  it('starts a new page rather than crossing the bottom margin', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500, pageHeight: 400, marginTop: 40, marginBottom: 40 });
    expect(out.pageCount).toBeGreaterThan(1);
    for (const [i, page] of out.pages.entries()) {
      expect(page.includes(`data-fit-page="${i + 1}"`)).toBe(true);
    }
  });

  it('fills full pages and leaves the last one short (N.6c, Dann’s ruling 2026-08-06)', () => {
    // Size the page from the REAL system heights rather than an estimate, so
    // the last page is guaranteed to hold TWO systems. A last page of one has
    // no gaps at all, and the inheritance assertion below then passes without
    // ever running: that is precisely what happened to the first version of
    // this fixture, and it is why the vacuity guards are here.
    const base = { pageWidth: 500, marginTop: 40, marginBottom: 40, systemGap: 10 };
    const all = paginateScore(parsed, analyzed, { ...base, pageHeight: 100000 });
    const heights = all.systems.map((s) => s.height);
    expect(heights.length).toBeGreaterThanOrEqual(4);
    const head = heights.slice(0, heights.length - 2);
    // Exact fit for `head`, plus slack that must be distributed but is far too
    // small to admit another system, so page 1 is full AND has a real gap.
    const SLACK = 60;
    expect(SLACK).toBeLessThan(Math.min(...heights));
    const need = head.reduce((a, b) => a + b, 0) + (head.length - 1) * base.systemGap;
    const opts = { ...base, pageHeight: base.marginTop + need + SLACK + base.marginBottom };
    const innerBottom = opts.pageHeight - opts.marginBottom;
    const out = paginateScore(parsed, analyzed, opts);
    expect(out.pageCount).toBe(2);

    const boxes = (page: string): Array<{ y: number; h: number }> =>
      [...page.matchAll(/<svg x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)"/g)]
        .map((m) => ({ y: Number(m[1]), h: Number(m[2]) }));
    const gapsOf = (b: Array<{ y: number; h: number }>): number[] =>
      b.slice(1).map((box, i) => box.y - (b[i].y + b[i].h));

    // Every page but the last reaches the bottom margin: the slack sits
    // BETWEEN the systems, not in one lump above the footer, and the first
    // system still starts on the top margin.
    let distributed = 0;
    for (const page of out.pages.slice(0, -1)) {
      const b = boxes(page);
      expect(b[0].y).toBe(opts.marginTop);
      if (b.length < 2) continue; // a page holding one tall system cannot fill
      distributed++;
      expect(b[b.length - 1].y + b[b.length - 1].h).toBeCloseTo(innerBottom, 1);
      for (const g of gapsOf(b)) expect(g).toBeGreaterThanOrEqual(opts.systemGap);
    }
    expect(distributed).toBeGreaterThan(0);

    // The last page is not justified, but it is not free-form either: it
    // repeats the spacing the earlier pages established, so the document
    // reads as one rhythm. Collapsing it to the floor would fail here.
    const prevGaps = gapsOf(boxes(out.pages[out.pages.length - 2]));
    const lastGaps = gapsOf(boxes(out.pages[out.pages.length - 1]));
    expect(prevGaps.length).toBeGreaterThan(0);
    expect(prevGaps[0]).toBeGreaterThan(opts.systemGap); // else this is vacuous
    expect(lastGaps.length).toBeGreaterThan(0); // else the inheritance is untested
    for (const g of lastGaps) expect(g).toBeCloseTo(prevGaps[0], 1);
  });

  it('keeps each system’s coordinate space intact via nested svg', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500 });
    expect((out.pages.join('\n').match(/data-system="/g) ?? []).length).toBe(out.systems.length);
  });

  it('resolves ONE clef for the whole score, never per slice (v37 §A.17)', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500 });
    // The low demo assesses to bass; every system head carries it.
    for (const s of out.systems) {
      expect(s.svg.includes('data-clef="bass"')).toBe(true);
    }
  });

  it('honours an explicit clef override on every system', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500, clef: 'treble' });
    expect(out.systems.length).toBeGreaterThan(1);
    for (const s of out.systems) {
      expect(s.svg.includes('data-clef="treble"')).toBe(true);
      expect(s.svg.includes('data-clef="bass"')).toBe(false);
    }
  });
});

// ── N.103: the spacer sees ink, and the paginator sees the spacer ────
//
// `sliceWidth` and the render both walk `layoutColumns`, which is what has kept
// packing and drawing from drifting since N.6b-1. N.103 gives that walk the
// ANALYSIS and the resolved clef, so the turning layer is ink it can measure;
// both call sites had to gain the same two arguments or the guarantee would
// have quietly become a lie.
describe('page layout: the ink term reaches pagination (N.103)', () => {
  const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

  /** `bars` measures of four eighths on one pitch, every note on the vowel `v`. */
  const runOfEighths = (bars: number, pitch: Pitch): ParsedScore => {
    const vocalLine: VocalLineEvent[] = [];
    for (let m = 0; m < bars; m++) {
      for (let b = 0; b < 4; b++) {
        vocalLine.push({
          id: `m${m}-${b}`,
          type: 'note',
          measureIndex: m,
          rhythmicPosition: { fraction: { numerator: b, denominator: 8 } },
          duration: { base: 'eighth', dots: 0, fraction: { numerator: 1, denominator: 8 } },
          pitch,
        });
      }
    }
    return {
      source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
      vocalPart: { partId: 'P1', partName: 'Voice' },
      measures: Array.from({ length: bars }, (_, index) => ({
        index,
        number: String(index + 1),
        timeSignature: { beats: 2, beatType: 4 },
        keySignature: { fifths: 0 },
        expectedDuration: { numerator: 1, denominator: 2 },
      })),
      keySignatures: [{ measureIndex: 0, signature: { fifths: 0 } }],
      timeSignatures: [{ measureIndex: 0, signature: { beats: 2, beatType: 4 } }],
      tempoMarkings: [],
      vocalLine,
    };
  };

  /**
   * A voice whose turning pitch is `turning` on every note, chosen by
   * construction: the engine takes the turning pitch as `hzToPitch(fR1 / 2)`.
   */
  const voiced = (parsed: ParsedScore, turning: Pitch): AnalyzedScore => {
    const profile: VoiceProfileSnapshot = {
      fR1: { v: 2 * pitchToHz(turning) },
      range: { lowest: P('C', 3), highest: P('C', 6) },
      tessitura: { low: P('E', 4), high: P('A', 4) },
      passaggio: { primo: P('E', 4), secondo: P('A', 4) },
      label: 'test',
    };
    return analyzeScore(parsed, profile, () => 'v', { generatedAt: '2026-09-02T00:00:00.000Z' });
  };

  /** The same score with no measured voice: sung ink only, no turning layer. */
  const silent = (parsed: ParsedScore): AnalyzedScore =>
    analyzeScore(parsed, { fR1: {}, label: 'test' }, () => undefined, {
      generatedAt: '2026-09-02T00:00:00.000Z',
    });

  // Starve the floor and the duration term so the ink term is what decides the
  // packing, which is the only way to see it decide anything.
  const OPTS = {
    clef: 'treble' as const,
    minGap: 1,
    pxPerWhole: 1,
    pageWidth: 400,
    pageHeight: 100000,
    marginLeft: 0,
    marginRight: 0,
  };

  it('packs FEWER measures per system once the columns carry turning ink', () => {
    const parsed = runOfEighths(12, P('G', 4));
    const withTurning = paginateScore(parsed, voiced(parsed, P('A', 4)), OPTS);
    const withoutTurning = paginateScore(parsed, silent(parsed), OPTS);
    const barsInFirst = (out: ReturnType<typeof paginateScore>): number =>
      out.systems[0].toMeasure - out.systems[0].fromMeasure + 1;
    expect(barsInFirst(withTurning)).toBeLessThan(barsInFirst(withoutTurning));
    expect(withTurning.systems.length).toBeGreaterThan(withoutTurning.systems.length);
  });

  it('agrees with the render: sliceWidth equals an unstretched system’s width', () => {
    // A sole system is the piece's last, and the piece's last is not stretched
    // below the fill limit, so its rendered width IS its natural width. Both
    // sides are given the analysis and the same resolved clef, which is the
    // whole of N.103's threading.
    const parsed = runOfEighths(3, P('G', 4));
    const analyzed = voiced(parsed, P('A', 4));
    const opts = { ...OPTS, pageWidth: 100000 };
    const out = paginateScore(parsed, analyzed, opts);
    expect(out.systems).toHaveLength(1);
    // To nine places: the two sides sum the same advances in the same order and
    // differ only where floating-point addition associates differently.
    expect(out.systems[0].width).toBeCloseTo(sliceWidth(parsed, 0, 2, opts, analyzed), 9);
  });

  it('would DISAGREE with the render if the analysis were withheld, which is why it is threaded', () => {
    // The regression this guards: `sliceWidth` without the analysis measures a
    // page with no turning layer on it, and packs measures the render then has
    // to fit anyway.
    const parsed = runOfEighths(3, P('G', 4));
    const analyzed = voiced(parsed, P('A', 4));
    const opts = { ...OPTS, pageWidth: 100000 };
    expect(sliceWidth(parsed, 0, 2, opts)).toBeLessThan(sliceWidth(parsed, 0, 2, opts, analyzed));
  });

  it('leaves a system with no ink of its own exactly where it was: the control', () => {
    // No displaced turning unit, no courtesy, no dot. The sung ink term is the
    // same on both sides and smaller than the duration term, so the two pack
    // and render identically, to the digit.
    const parsed = runOfEighths(4, P('G', 4));
    const opts = { ...OPTS, minGap: 40, pxPerWhole: 240, pageWidth: 100000 };
    const a = paginateScore(parsed, silent(parsed), opts);
    const b = paginateScore(parsed, silent(parsed), opts);
    expect(a.systems[0].width).toBe(b.systems[0].width);
    expect(sliceWidth(parsed, 0, 3, opts, silent(parsed))).toBe(sliceWidth(parsed, 0, 3, opts));
  });
});
