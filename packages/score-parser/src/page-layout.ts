/**
 * Multi-system pagination onto the letter page (Kimi's sequence step after
 * the glyph pass, consensus 2026-07-12).
 *
 * Pure and DOM-free, like the staff renderer it drives. The paginator:
 *   1. slices `ParsedScore` by measure (indices rebased so the renderer's
 *      per-measure state machinery works unchanged on each slice);
 *   2. packs measures into systems greedily against the page's inner
 *      width, using the same x-advance arithmetic as the renderer, so the
 *      estimate and the rendering never disagree;
 *   3. renders each system through `renderAnalyzedStaff` (primitive or
 *      SMuFL mode, per options) and stacks systems onto 816 × 1056 letter
 *      pages (Ilya's `PAGE_DIMENSIONS`), breaking to a new page when a
 *      system would cross the bottom margin.
 *
 * Page furniture (title header, footer, metadata line) is Ilya's Paper
 * system's job and attaches at live wiring; this module owns geometry
 * only. Every system carries its own clef and key signature, standard
 * practice for vocal scores.
 */

import type { ParsedScore } from './types';
import type { AnalyzedScore } from './analysis-types';
import { renderAnalyzedStaff, columnAdvance, BARLINE_ROOM, type StaffRenderOptions } from './staff-renderer';
import { chooseClef } from './clef-select';

export interface PageLayoutOptions extends StaffRenderOptions {
  /** Page size in px at 96 dpi. Defaults: US letter, 816 × 1056. */
  pageWidth?: number;
  pageHeight?: number;
  /** Inner margins in px. */
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  /** Vertical gap between stacked systems. */
  systemGap?: number;
}

const PAGE_DEFAULTS = {
  pageWidth: 816,
  pageHeight: 1056,
  marginTop: 96,
  marginRight: 72,
  marginBottom: 96,
  marginLeft: 72,
  systemGap: 28,
};

// The renderer's own left margin default. The advance arithmetic is NO LONGER
// mirrored here: `columnAdvance` and `BARLINE_ROOM` are imported from the
// renderer, so the estimate and the rendering cannot drift apart at all
// rather than merely failing a test when they do (N.6b-1).
const RENDER_DEFAULTS = { leftMargin: 92 };
/**
 * Nothing past the closing barline: the renderer's `width` is exactly its
 * `contentRight` and the barline's stroke sits inside it (N.6b-2).
 */
const RIGHT_PAD = 0;

/** Vertical justification produces fractional offsets; keep the SVG tidy. */
const round2 = (v: number): number => Math.round(v * 100) / 100;

export interface SystemSlice {
  /** Measure range in ORIGINAL indices, inclusive. */
  fromMeasure: number;
  toMeasure: number;
  /** The rendered system SVG string. */
  svg: string;
  /** Parsed from the system's viewBox. */
  width: number;
  height: number;
  /**
   * The system's viewBox min-y. Non-zero since N.6a: the renderer crops the
   * unoccupied space above the staff rather than reserving a fixed 96 px, so
   * a system's coordinate space no longer starts at 0 and the nested `<svg>`
   * has to carry the offset or the staff is clipped out of view.
   */
  minY: number;
}

export interface PaginatedScore {
  /** One standalone SVG string per letter page. */
  pages: string[];
  systems: SystemSlice[];
  pageCount: number;
}

/** A measure-range slice with rebased indices, renderer-ready. */
export function sliceScore(parsed: ParsedScore, fromMeasure: number, toMeasure: number): ParsedScore {
  const measures = parsed.measures
    .filter((m) => m.index >= fromMeasure && m.index <= toMeasure)
    .map((m) => ({ ...m, index: m.index - fromMeasure }));
  const first = parsed.measures[fromMeasure];
  return {
    ...parsed,
    measures,
    keySignatures: [{ measureIndex: 0, signature: first.keySignature }],
    clefs: first.clef ? [{ measureIndex: 0, clef: first.clef }] : [],
    timeSignatures: [{ measureIndex: 0, signature: first.timeSignature }],
    tempoMarkings: parsed.tempoMarkings
      .filter((t) => t.measureIndex >= fromMeasure && t.measureIndex <= toMeasure)
      .map((t) => ({ ...t, measureIndex: t.measureIndex - fromMeasure })),
    vocalLine: parsed.vocalLine
      .filter((e) => e.measureIndex >= fromMeasure && e.measureIndex <= toMeasure)
      .map((e) => ({ ...e, measureIndex: e.measureIndex - fromMeasure })),
  };
}

/**
 * Width a measure range would occupy, using the renderer's own x-advance
 * arithmetic (leftMargin + duration-proportional advances + barline room
 * + right pad).
 */
export function sliceWidth(parsed: ParsedScore, fromMeasure: number, toMeasure: number, options: StaffRenderOptions = {}): number {
  const leftMargin = options.leftMargin ?? RENDER_DEFAULTS.leftMargin;
  const events = parsed.vocalLine.filter((e) => e.measureIndex >= fromMeasure && e.measureIndex <= toMeasure);
  let x = leftMargin;
  let prevMeasure = -1;
  let prevDurWhole = 0;
  let prevEv: (typeof events)[number] | undefined;
  for (const ev of events) {
    const newMeasure = ev.measureIndex !== prevMeasure;
    if (prevEv) {
      x += columnAdvance(prevEv, ev, prevDurWhole, options) + (newMeasure ? BARLINE_ROOM : 0);
    }
    prevMeasure = ev.measureIndex;
    prevDurWhole = ev.duration.fraction.numerator / ev.duration.fraction.denominator;
    prevEv = ev;
  }
  return x + (prevEv ? columnAdvance(prevEv, undefined, prevDurWhole, options) : 0) + RIGHT_PAD;
}

function viewBoxOf(svg: string): { minY: number; width: number; height: number } {
  const m = svg.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/);
  return { minY: Number(m?.[1] ?? 0), width: Number(m?.[2] ?? 0), height: Number(m?.[3] ?? 0) };
}

/** Paginate an analysed score onto letter pages. */
export function paginateScore(
  parsed: ParsedScore,
  analyzed: AnalyzedScore,
  options: PageLayoutOptions = {},
): PaginatedScore {
  const o = { ...PAGE_DEFAULTS, ...options };
  const innerWidth = o.pageWidth - o.marginLeft - o.marginRight;
  const innerBottom = o.pageHeight - o.marginBottom;
  const measureCount = parsed.measures.length;

  // Resolve the clef ONCE for the whole score (v37 §A.17): a slice-level
  // heuristic could flip clefs between systems on a wide-range melody.
  const renderOptions: StaffRenderOptions = { ...options, clef: options.clef ?? chooseClef(parsed) };

  // ── Pack measures into systems against the inner width ──
  const ranges: Array<[number, number]> = [];
  let from = 0;
  while (from < measureCount) {
    let to = from;
    while (to + 1 < measureCount && sliceWidth(parsed, from, to + 1, options) <= innerWidth) {
      to++;
    }
    // A single measure wider than the page still gets its own system
    // (it will overflow horizontally rather than vanish; the correction
    // UI can surface it).
    ranges.push([from, to]);
    from = to + 1;
  }

  // ── Render each system ──
  const systems: SystemSlice[] = ranges.map(([a, b], i) => {
    // Only the slice that ends the piece gets Gould r96's final barline; every
    // other system closes with an ordinary one (Dann's ruling, 2026-08-06).
    const svg = renderAnalyzedStaff(sliceScore(parsed, a, b), analyzed, {
      ...renderOptions,
      finalBarline: i === ranges.length - 1,
      // Every system fills the line, so they all come out the same width and
      // all reach both margins (Dann's ruling, 2026-08-06). `sliceWidth` above
      // still packs on NATURAL widths, which is what decides how many measures
      // a line can hold; this only spends the leftover.
      targetWidth: innerWidth,
    });
    const { minY, width, height } = viewBoxOf(svg);
    return { fromMeasure: a, toMeasure: b, svg, width, height, minY };
  });

  // ── Assign systems to pages, THEN lay each page out ──
  // Two passes, not one, and the reason is N.6c: a page's spare vertical
  // space cannot be distributed between its systems until the page knows
  // which systems it holds. The single-pass version placed each system the
  // moment it arrived, so every page's slack landed in one lump above the
  // footer and the page read top-heavy.
  const pageGroups: SystemSlice[][] = [];
  {
    let group: SystemSlice[] = [];
    let used = 0;
    for (const s of systems) {
      const need = group.length === 0 ? s.height : used + o.systemGap + s.height;
      if (group.length > 0 && o.marginTop + need > innerBottom) {
        pageGroups.push(group);
        group = [s];
        used = s.height;
      } else {
        group.push(s);
        used = need;
      }
    }
    if (group.length > 0) pageGroups.push(group);
  }

  // THE LAST SYSTEM OF THE PIECE IS NEVER STRETCHED TO THE MARGIN.
  //
  // Dann's ruling, 8 August 2026, in his words: "a final system on the final
  // page of the contiguous musical notation that would not otherwise meet the
  // right margin must not be stretched to meet it; rather, this final system
  // should be spaced properly and allowed to terminate short of the right
  // margin."
  //
  // THIS SUPERSEDES RULING 9 of 6 August, which exempted only a system
  // standing ALONE on the final page. That test asked the wrong question: a
  // short final system sharing its page with four others is just as stretched,
  // and it was, on Kabalevsky Op. 52 No. 9 page 2, which is what prompted this.
  // The old rule survives as a special case of this one.
  //
  // It carries NO fill threshold. The 40 percent figure belongs to C11's
  // rebalance trigger ("rebalance so no page ends with a lone measure"), and
  // the E.30 handover's summary welded the two together. The condition here is
  // simply whether the system would otherwise reach the margin.
  //
  // Ruling 8 still binds everywhere else: every other system, final page or
  // not, is justified to the line.
  //
  // Re-rendered rather than decided up front, because the natural width is not
  // known until it is drawn. Safe in this direction: dropping the stretch can
  // only shorten a system (the syllabic slur's lift grows with span), so a
  // system that already fit its page still fits.
  const lastGroup = pageGroups[pageGroups.length - 1];
  const lastSystem = systems[systems.length - 1];
  if (lastGroup && lastSystem) {
    const svg = renderAnalyzedStaff(
      sliceScore(parsed, lastSystem.fromMeasure, lastSystem.toMeasure),
      analyzed,
      { ...renderOptions, finalBarline: true },
    );
    const box = viewBoxOf(svg);
    // Only when it falls short. A final system whose content genuinely fills
    // the line, or overflows it, is left exactly as it was rendered.
    if (box.width < innerWidth) {
      const natural: SystemSlice = {
        ...lastSystem,
        svg,
        width: box.width,
        height: box.height,
        minY: box.minY,
      };
      // The last element of the last page group IS the last system: the groups
      // hold the same objects, pushed in order.
      lastGroup[lastGroup.length - 1] = natural;
      systems[systems.length - 1] = natural;
    }
  }

  const pages: string[] = [];
  // The spacing the full pages settled on, carried forward to the short one.
  let establishedGap = o.systemGap;
  pageGroups.forEach((group, pageIndex) => {
    // Dann's rulings, 2026-08-06, in two parts.
    //
    // FIRST: fill full pages, leave the LAST page short. Justifying the final
    // sheet would give a closing page of two systems absurd gaps.
    //
    // SECOND: the short page is still not free-form. It repeats the spacing
    // the pages before it established, so the document reads as one
    // deliberate rhythm instead of a filled run followed by a remainder
    // slapped at the top. `o.systemGap` is therefore a FLOOR, never the
    // value, except on a document short enough to have no earlier page to be
    // consistent with.
    //
    // The slack goes BETWEEN systems only, so the first system still sits on
    // the top margin. Gould r184 supplies the floor, a gap is sized by what
    // must live inside it; distributing the remainder above that floor is
    // INFERENCE from r235's evenness principle applied vertically, and it is
    // NOT something Gould states anywhere we hold. p. 491 continues her
    // vertical-alignment discussion and has never been photographed.
    const isLast = pageIndex === pageGroups.length - 1;
    const inkHeight = group.reduce((total, s) => total + s.height, 0);
    const gapCount = group.length - 1;
    let gap = establishedGap;
    if (!isLast && gapCount > 0) {
      gap = Math.max(o.systemGap, (innerBottom - o.marginTop - inkHeight) / gapCount);
      establishedGap = gap;
    }

    const pageParts: string[] = [
      `<svg viewBox="0 0 ${o.pageWidth} ${o.pageHeight}" xmlns="http://www.w3.org/2000/svg" data-fit-page="${pageIndex + 1}">`,
      `<rect x="0" y="0" width="${o.pageWidth}" height="${o.pageHeight}" fill="#FFFFFF"/>`,
    ];
    let y = o.marginTop;
    for (const s of group) {
      // Nested svg keeps every system's internal coordinate space intact,
      // so data-event-id hit-testing math stays system-local. The viewBox
      // carries the system's own min-y (N.6a) so the cropped headroom is
      // honoured; passing 0 here would scroll the staff off the top.
      pageParts.push(
        `<svg x="${o.marginLeft}" y="${round2(y)}" width="${s.width}" height="${s.height}" viewBox="0 ${s.minY} ${s.width} ${s.height}" data-system="${s.fromMeasure}-${s.toMeasure}">`,
      );
      pageParts.push(s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''));
      pageParts.push('</svg>');
      y += s.height + gap;
    }
    pageParts.push('</svg>');
    pages.push(pageParts.join('\n'));
  });

  return { pages, systems, pageCount: pages.length };
}
