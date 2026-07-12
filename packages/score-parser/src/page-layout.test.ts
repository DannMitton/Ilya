/**
 * Pagination tests: the shared demo fixture packed onto letter pages.
 * String and arithmetic assertions only — no browser.
 */

import { describe, expect, it } from 'vitest';
import { analyzeScore } from './overlay-engine';
import { demoProfile, demoResolver, demoScore } from './demo-fixture';
import { paginateScore, sliceScore, sliceWidth } from './page-layout';

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

  it('slice width matches the renderer’s own layout for the full score', () => {
    const { parsed: p, analyzed } = demo();
    const full = sliceWidth(p, 0, p.measures.length - 1);
    const rendered = paginateScore(p, analyzed, { pageWidth: 4000, marginLeft: 0, marginRight: 0 });
    expect(rendered.systems).toHaveLength(1);
    expect(rendered.systems[0].width).toBe(full);
  });
});

describe('page layout: system packing and page assembly', () => {
  const { parsed, analyzed } = demo();

  it('packs everything onto one letter page at default width', () => {
    const out = paginateScore(parsed, analyzed);
    expect(out.pageCount).toBe(1);
    expect(out.pages[0].startsWith('<svg viewBox="0 0 816 1056"')).toBe(true);
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

  it('keeps each system’s coordinate space intact via nested svg', () => {
    const out = paginateScore(parsed, analyzed, { pageWidth: 500 });
    expect((out.pages.join('\n').match(/data-system="/g) ?? []).length).toBe(out.systems.length);
  });
});
