/**
 * placeholder-mark.test.ts: a mark that rests on a placeholder fR1 says so
 * (QUEUE row 69). The turning notehead is a hollow lavender circle of the
 * half-note head's height, solid and stemless (row 78b, Dann 2026-10-11 19:56
 * and 20:03 to 20:04); its ledger lines and accidental are solid and tagged.
 * The overlay engine flags the note from the snapshot's `fR1Source`; the
 * renderer marks the turning marks of that note and of no other. The crossing
 * squircle is the page's since row 34, and `crossing-ring.test.ts` in the app
 * checks its dash.
 */
import { describe, expect, it } from 'vitest';
import { placeholderMark, rotatedEllipseHeight, PLACEHOLDER_DASH, PLACEHOLDER_HOLLOW_STROKE_SP } from './placeholder-mark';
import { analyzeScore } from './overlay-engine';
import { renderAnalyzedStaff, type StaffRenderOptions } from './staff-renderer';
import { demoProfile, demoResolver, demoScore, syntheticSmuflFont } from './demo-fixture';
import type { VoiceProfileSnapshot } from './analysis-types';

const AT = { generatedAt: '2026-10-11T00:00:00.000Z' };

describe('placeholderMark', () => {
  it('leaves a mark alone when it rests on no placeholder', () => {
    const m = '<line x1="0" y1="0" x2="1" y2="0" stroke="#000"/>';
    expect(placeholderMark(undefined, m, 'stroke')).toBe(m);
    expect(placeholderMark(false, m, 'stroke')).toBe(m);
  });

  it('dashes a stroked mark and names it', () => {
    const out = placeholderMark(true, '<rect data-analysis="crossing" x="0" fill="none" stroke="#b23b3b"/>', 'stroke');
    expect(out).toContain(`stroke-dasharray="${PLACEHOLDER_DASH}"`);
    expect(out).toContain('data-placeholder="true"');
    expect(out).toContain('stroke="#b23b3b"');
  });

  it('tags a mark drawn solid, and changes nothing else', () => {
    const m = '<text data-analysis="turning-accidental" x="1" fill="#9585A2">♯</text>';
    expect(placeholderMark(true, m, 'tag')).toBe('<text data-placeholder="true" data-analysis="turning-accidental" x="1" fill="#9585A2">♯</text>');
  });

  it('draws a notehead as a hollow circle of the given height: solid, in its own colour, at its own opacity (row 78b)', () => {
    const out = placeholderMark(true, '<ellipse data-analysis="turning-notehead" cx="1" fill="#9585A2" opacity="0.85"/>', { cx: 10, cy: 20, d: 12.77, space: 12 });
    const w = PLACEHOLDER_HOLLOW_STROKE_SP * 12;
    expect(out).toBe(
      `<circle data-placeholder="true" data-analysis="turning-notehead" cx="10" cy="20" r="${Math.round(((12.77 - w) / 2) * 100) / 100}" fill="none" stroke="#9585A2" stroke-width="${Math.round(w * 100) / 100}" opacity="0.85"/>`,
    );
    expect(out).not.toContain('stroke-dasharray');
  });

  it('measures the primitive head\'s footprint: an ellipse of 6 by 4.4 turned 18 degrees is about 9.15 px tall', () => {
    expect(rotatedEllipseHeight(6, 4.4, 18)).toBeCloseTo(9.15, 2);
    expect(rotatedEllipseHeight(6, 4.4, 0)).toBeCloseTo(8.8, 6);
  });
});

describe('the overlay engine flags a note that rests on a placeholder', () => {
  it('flags the surrogate vowel only; a derived or sung vowel is not a placeholder', () => {
    const profile: VoiceProfileSnapshot = { ...demoProfile, fR1Source: { i: 'surrogate', o: 'derived', a: 'sung' } };
    const a = analyzeScore(demoScore(), profile, demoResolver, AT);
    const events = Object.values(a.events);
    expect(events.some((e) => e.vowel === 'i')).toBe(true);
    for (const e of events) expect(e.placeholder, `${e.eventId} [${e.vowel}]`).toBe(e.vowel === 'i' ? true : undefined);
  });

  it('flags nothing without a source record', () => {
    const a = analyzeScore(demoScore(), demoProfile, demoResolver, AT);
    expect(Object.values(a.events).some((e) => e.placeholder)).toBe(false);
  });
});

/** The demo rendered under `profile`. */
function render(profile: VoiceProfileSnapshot, options?: StaffRenderOptions): string {
  const parsed = demoScore();
  return renderAnalyzedStaff(parsed, analyzeScore(parsed, profile, demoResolver, AT), options);
}
const marks = (svg: string, kind: string) => svg.match(new RegExp(`<\\w+ [^>]*data-analysis="${kind}"[^>]*>`, 'g')) ?? [];

describe.each([
  ['primitive glyphs', undefined],
  ['SMuFL glyphs', { font: syntheticSmuflFont(), fontFamily: 'TestFont' }],
] as Array<[string, StaffRenderOptions | undefined]>)('the renderer, %s', (_name, options) => {
  it('draws the placeholder vowel\'s turning heads hollow, of the half-note head\'s height, and no other (row 78b)', () => {
    const svg = render({ ...demoProfile, fR1Source: { i: 'surrogate' } }, options);
    const heads = marks(svg, 'turning-notehead');
    const hollow = heads.filter((m) => m.includes('data-placeholder'));
    const iNotes = Object.values(analyzeScore(demoScore(), demoProfile, demoResolver, AT).events).filter((e) => e.vowel === 'i').length;
    expect(hollow.length).toBe(iNotes);
    expect(heads.length).toBeGreaterThan(hollow.length);
    const space = 12; // the renderer's default lineGap
    const half = options?.font ? options.font.glyph('noteheadHalf') : null;
    const d = half ? (half.bBoxNE[1] - half.bBoxSW[1]) * space : rotatedEllipseHeight(6, 4.4, 18);
    for (const m of hollow) {
      expect(m.startsWith('<circle ')).toBe(true);
      expect(m).toContain('fill="none"');
      expect(m).toContain('opacity="0.85"');
      expect(m).not.toContain('stroke-dasharray');
      const r = Number(/ r="([\d.]+)"/.exec(m)![1]);
      const w = Number(/ stroke-width="([\d.]+)"/.exec(m)![1]);
      expect(2 * r + w).toBeCloseTo(d, 1);
    }
    // A sampled vowel's head is filled.
    for (const m of heads.filter((x) => !x.includes('data-placeholder'))) expect(m).not.toContain('fill="none"');
    // Ledger lines and the accidental are solid lavender: tagged, never dashed or outlined.
    for (const m of marks(svg, 'turning-ledger').filter((x) => x.includes('data-placeholder'))) expect(m).not.toContain('stroke-dasharray');
    for (const m of marks(svg, 'turning-accidental').filter((x) => x.includes('data-placeholder'))) expect(m).not.toContain('fill="none"');
  });

  it('dashes nothing for a voice whose vowels were all sung', () => {
    const svg = render({ ...demoProfile, fR1Source: Object.fromEntries(Object.keys(demoProfile.fR1).map((v) => [v, 'sung' as const])) }, options);
    expect(svg).not.toContain('data-placeholder');
    expect(svg).not.toContain('stroke-dasharray');
  });
});
