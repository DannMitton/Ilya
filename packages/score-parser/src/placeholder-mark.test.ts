/**
 * placeholder-mark.test.ts: a mark that rests on a placeholder fR1 is drawn
 * dashed (QUEUE row 69). The overlay engine flags the note from the
 * snapshot's `fR1Source`; the renderer dashes the turning marks of that note
 * and of no other. The crossing squircle is the page's since row 34, and
 * `crossing-ring.test.ts` in the app checks its dash.
 */
import { describe, expect, it } from 'vitest';
import { placeholderMark, PLACEHOLDER_DASH, PLACEHOLDER_DASH_FINE } from './placeholder-mark';
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

  it('draws a filled mark as its own dashed outline, in its own colour', () => {
    const out = placeholderMark(true, '<ellipse data-analysis="turning-notehead" cx="1" fill="#9585A2" opacity="0.85"/>', 'outline');
    expect(out).toContain('fill="none"');
    expect(out).toContain('stroke="#9585A2"');
    expect(out).toContain(`stroke-dasharray="${PLACEHOLDER_DASH_FINE}"`);
    expect(out).toContain('data-placeholder="true"');
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
  it('dashes the turning marks of the placeholder vowel, and of no other', () => {
    const svg = render({ ...demoProfile, fR1Source: { i: 'surrogate' } }, options);
    const heads = marks(svg, 'turning-notehead');
    const dashedHeads = heads.filter((m) => m.includes('data-placeholder'));
    const iNotes = Object.values(analyzeScore(demoScore(), demoProfile, demoResolver, AT).events).filter((e) => e.vowel === 'i').length;
    expect(dashedHeads.length).toBe(iNotes);
    expect(heads.length).toBeGreaterThan(dashedHeads.length);
    for (const m of dashedHeads) expect(m).toContain('fill="none"');
    for (const m of marks(svg, 'turning-ledger').filter((x) => x.includes('data-placeholder'))) expect(m).toContain('stroke-dasharray');
    // The accidental stays solid: tagged, never outlined.
    for (const m of marks(svg, 'turning-accidental').filter((x) => x.includes('data-placeholder'))) expect(m).not.toContain('fill="none"');
  });

  it('dashes nothing for a voice whose vowels were all sung', () => {
    const svg = render({ ...demoProfile, fR1Source: Object.fromEntries(Object.keys(demoProfile.fR1).map((v) => [v, 'sung' as const])) }, options);
    expect(svg).not.toContain('data-placeholder');
    expect(svg).not.toContain('stroke-dasharray');
  });
});
