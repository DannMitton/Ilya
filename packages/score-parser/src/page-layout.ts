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
import { renderAnalyzedStaff, type StaffRenderOptions } from './staff-renderer';
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

// Mirrors of the staff renderer's layout constants. Kept in one place so
// a renderer spacing change shows up here as a failing pagination test,
// not as a silent drift between estimate and rendering.
const RENDER_DEFAULTS = { leftMargin: 92, pxPerWhole: 240, minGap: 40 };
const BARLINE_ROOM = 14;
const RIGHT_PAD = 24;

export interface SystemSlice {
  /** Measure range in ORIGINAL indices, inclusive. */
  fromMeasure: number;
  toMeasure: number;
  /** The rendered system SVG string. */
  svg: string;
  /** Parsed from the system's viewBox. */
  width: number;
  height: number;
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
  const pxPerWhole = options.pxPerWhole ?? RENDER_DEFAULTS.pxPerWhole;
  const minGap = options.minGap ?? RENDER_DEFAULTS.minGap;
  const events = parsed.vocalLine.filter((e) => e.measureIndex >= fromMeasure && e.measureIndex <= toMeasure);
  let x = leftMargin;
  let prevMeasure = -1;
  let prevDurWhole = 0;
  let count = 0;
  for (const ev of events) {
    const newMeasure = ev.measureIndex !== prevMeasure;
    if (count > 0) {
      x += Math.max(minGap, prevDurWhole * pxPerWhole) + (newMeasure ? BARLINE_ROOM : 0);
    }
    prevMeasure = ev.measureIndex;
    prevDurWhole = ev.duration.fraction.numerator / ev.duration.fraction.denominator;
    count++;
  }
  return x + Math.max(minGap, prevDurWhole * pxPerWhole) + RIGHT_PAD;
}

function viewBoxOf(svg: string): { width: number; height: number } {
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  return { width: Number(m?.[1] ?? 0), height: Number(m?.[2] ?? 0) };
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
  const systems: SystemSlice[] = ranges.map(([a, b]) => {
    const svg = renderAnalyzedStaff(sliceScore(parsed, a, b), analyzed, renderOptions);
    const { width, height } = viewBoxOf(svg);
    return { fromMeasure: a, toMeasure: b, svg, width, height };
  });

  // ── Stack systems onto pages ──
  const pages: string[] = [];
  let pageParts: string[] = [];
  let y = o.marginTop;
  const openPage = (): void => {
    pageParts = [
      `<svg viewBox="0 0 ${o.pageWidth} ${o.pageHeight}" xmlns="http://www.w3.org/2000/svg" data-fit-page="${pages.length + 1}">`,
      `<rect x="0" y="0" width="${o.pageWidth}" height="${o.pageHeight}" fill="#FFFFFF"/>`,
    ];
    y = o.marginTop;
  };
  const closePage = (): void => {
    pageParts.push('</svg>');
    pages.push(pageParts.join('\n'));
  };
  openPage();
  for (const s of systems) {
    if (y + s.height > innerBottom && y > o.marginTop) {
      closePage();
      openPage();
    }
    // Nested svg keeps every system's internal coordinate space intact,
    // so data-event-id hit-testing math stays system-local.
    pageParts.push(
      `<svg x="${o.marginLeft}" y="${y}" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}" data-system="${s.fromMeasure}-${s.toMeasure}">`,
    );
    pageParts.push(s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''));
    pageParts.push('</svg>');
    y += s.height + o.systemGap;
  }
  closePage();

  return { pages, systems, pageCount: pages.length };
}
