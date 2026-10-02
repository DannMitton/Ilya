/**
 * The Markup legend's stems: what a stem's direction means, drawn the way
 * the stave draws it (QUEUE row 10, brief
 * `brief-code-markup-legend-stems_r1_2026-10-01.md`; Dann 2026-10-01 01:51,
 * "We need to include a legend on Markup with this information").
 *
 * Source: Mitton 2020, Appendix B (the capture Dann sent; the page is not
 * stated): two rows of four notes, two eighth notes, a quarter, and a half,
 * stems up for close timbre and stems down for open.
 *
 * This module draws no mark of its own. The heads, the stem thickness, the
 * stem's side of the head, the stem length, the beam, and the ink colour are
 * the staff renderer's (`inkMetrics`, `headNameOf`, `STEM_LENGTH_SP`,
 * and the renderer's ink), so the legend and the stave cannot disagree. Where the music
 * font has not loaded, the renderer's primitive ellipses stand in, as the
 * renderer's do.
 */

import { headNameOf, inkMetrics, STEM_LENGTH_SP, type StaffRenderOptions } from './staff-renderer';
import type { NoteBase } from './types';

export type StemLegendDirection = 'up' | 'down';

export interface StemLegendDrawing {
  /** The drawing's own box, in px: it is an `<svg>` of this width and height. */
  width: number;
  height: number;
  /** The `<svg>` element's inner markup. */
  inner: string;
}

/** The renderer's ink for heads, stems, and beams (`staff-renderer.ts`, `#1a1612` throughout). */
const STAFF_INK = '#1a1612';
/** The stave's own space in px, which the primitive shapes are sized for. */
const STAVE_LINE_GAP = 12;

/** Stave spaces between neighbouring heads' centres. */
const NOTE_SPACING_SP = 2.6;
/** The staff-space the legend is drawn at, in px (the stave's own is 12). */
export const STEM_LEGEND_LINE_GAP = 3.5;

const round2 = (v: number): number => Math.round(v * 100) / 100;

/**
 * The four notes of the capture, in its order: two beamed eighths, a quarter,
 * and a half, every stem pointing `direction`. `options.font` and
 * `options.fontFamily` are the page's own notation font; omit them for the
 * primitive shapes.
 */
export function stemLegendDrawing(direction: StemLegendDirection, options: StaffRenderOptions = {}): StemLegendDrawing {
  const L = STEM_LEGEND_LINE_GAP;
  const sp = (v: number): number => v * L;
  const smufl = options.font;
  const M = inkMetrics({ ...options, lineGap: L });
  // Without the font the renderer's primitives are px for a 12 px stave; scale them to this one.
  const k = smufl ? 1 : L / STAVE_LINE_GAP;
  const up = direction === 'up';
  const stemLen = sp(STEM_LENGTH_SP);
  const stemT = round2(M.stemT * k);
  const stemHalf = (up ? M.stemHalfUp : M.stemHalfDown) * k;
  const beamT = smufl ? sp(smufl.engravingDefaults.beamThickness) : 4 * k;
  const bases: NoteBase[] = ['eighth', 'eighth', 'quarter', 'half'];
  const headHalf = (b: NoteBase): number => M.headHalfW(b) * k;

  const pad = 1;
  const x0 = pad + headHalf('quarter');
  const xs = bases.map((_, i) => round2(x0 + i * sp(NOTE_SPACING_SP)));
  const y = round2(pad + (up ? stemLen : 0) + sp(0.7));
  const parts: string[] = [];
  const stemX = (x: number): number => round2(x + stemHalf);

  bases.forEach((base, i) => {
    const x = xs[i];
    const name = headNameOf(base);
    if (smufl) {
      const g = smufl.glyph(name);
      parts.push(
        `<text x="${round2(x - sp(g.widthSp / 2))}" y="${y}" font-size="${4 * L}px" font-family="${options.fontFamily ?? 'Bravura'}" fill="${STAFF_INK}">${g.char}</text>`,
      );
    } else {
      const rx = 6.2 * k;
      const ry = 4.6 * k;
      parts.push(
        base === 'half'
          ? `<ellipse cx="${x}" cy="${y}" rx="${round2(rx)}" ry="${round2(ry)}" fill="none" stroke="${STAFF_INK}" stroke-width="${round2(1.6 * k)}" transform="rotate(-18 ${x} ${y})"/>`
          : `<ellipse cx="${x}" cy="${y}" rx="${round2(rx)}" ry="${round2(ry)}" fill="${STAFF_INK}" transform="rotate(-18 ${x} ${y})"/>`,
      );
    }
    const anchors = smufl ? smufl.glyph(name).anchors : undefined;
    const contactY = smufl ? y - sp((up ? anchors?.stemUpSE?.[1] : anchors?.stemDownNW?.[1]) ?? 0) : up ? y - k : y + k;
    const tipY = round2(up ? y - stemLen : y + stemLen);
    const sx = stemX(x);
    parts.push(`<line x1="${sx}" y1="${round2(contactY)}" x2="${sx}" y2="${tipY}" stroke="${STAFF_INK}" stroke-width="${stemT}"/>`);
    // The two eighths share a beam at the stem tips, which replaces flags (as the stave's beam pass does).
    if (i === 1) {
      const beamY = round2(up ? tipY + beamT / 2 : tipY - beamT / 2);
      parts.push(`<line x1="${stemX(xs[0])}" y1="${beamY}" x2="${sx}" y2="${beamY}" stroke="${STAFF_INK}" stroke-width="${round2(beamT)}"/>`);
    }
  });

  const width = round2(xs[3] + headHalf('half') + pad + 1);
  const height = round2(pad * 2 + stemLen + sp(0.7) + sp(1.2));
  return { width, height, inner: parts.join('') };
}
