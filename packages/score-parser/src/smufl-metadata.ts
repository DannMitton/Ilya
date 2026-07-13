/**
 * SMuFL font-metadata loader and glyph metric cache (Kimi's glyph-pass
 * steps 1 and 2, consensus 2026-07-12).
 *
 * Pure module: the caller (browser or test) supplies the parsed metadata
 * JSON object; nothing here fetches, touches the DOM, or reads files. The
 * browser side does `fetch(...).then(r => r.json())` and hands the object
 * to `prepareSmuflFont`.
 *
 * Kimi's guardrails, both honoured here:
 *  1. Metadata validation on load, with per-glyph fallback to Bravura (the
 *     SMuFL reference font) for any missing bounding box or anchor. Every
 *     fallback is recorded in `warnings` so the taste-test page can surface
 *     incomplete fonts instead of silently mixing metrics.
 *  2. Unit normalization: SMuFL metadata coordinates (bounding boxes,
 *     anchors, engraving defaults) are expressed in STAFF SPACES by the
 *     W3C SMuFL spec, independent of the font's units-per-em, so UPM never
 *     leaks into layout. `spToPx` converts spaces to px via the renderer's
 *     `lineGap` (1 space = 1 staff-line gap). Font size for SVG text is
 *     4 spaces = 4 * lineGap px (one em spans the five-line staff).
 *
 * Codepoints are not part of font metadata files; they come from the SMuFL
 * specification's stable glyph registry. The subset Fit renders is embedded
 * below (SMuFL 1.4 glyphnames).
 */

// ── Types ──────────────────────────────────────────────────────────

/** [x, y] in staff spaces, y positive upward (SMuFL convention). */
export type SpPoint = [number, number];

export interface SmuflGlyphMetrics {
  /** Unicode codepoint for the glyph, e.g. 0xE0A4 for noteheadBlack. */
  codepoint: number;
  /** The glyph as a string, ready for SVG text content. */
  char: string;
  /** Bounding box in staff spaces: north-east and south-west corners. */
  bBoxNE: SpPoint;
  bBoxSW: SpPoint;
  /** Advance width in staff spaces (bbox width; SMuFL noteheads abut stems). */
  widthSp: number;
  /** Anchor points in staff spaces (stemUpSE, stemDownNW, cutOuts, ...). */
  anchors: Record<string, SpPoint>;
}

/** The engraving defaults Fit consumes, in staff spaces. */
export interface SmuflEngravingDefaults {
  staffLineThickness: number;
  stemThickness: number;
  beamThickness: number;
  beamSpacing: number;
  thinBarlineThickness: number;
  thickBarlineThickness: number;
  legerLineThickness: number;
  legerLineExtension: number;
  tupletBracketThickness: number;
}

export interface PreparedSmuflFont {
  fontName: string;
  fontVersion: string;
  engravingDefaults: SmuflEngravingDefaults;
  /** Metric lookup for every glyph in REQUIRED_GLYPHS. */
  glyph(name: RequiredGlyphName): SmuflGlyphMetrics;
  /** Fallbacks and gaps recorded during preparation. Empty = fully native. */
  warnings: string[];
}

// ── SMuFL glyph registry subset (SMuFL 1.4, spec-stable codepoints) ──

export const SMUFL_CODEPOINTS = {
  gClef: 0xe050,
  gClef8vb: 0xe052,
  fClef: 0xe062,
  timeSig0: 0xe080,
  timeSig1: 0xe081,
  timeSig2: 0xe082,
  timeSig3: 0xe083,
  timeSig4: 0xe084,
  timeSig5: 0xe085,
  timeSig6: 0xe086,
  timeSig7: 0xe087,
  timeSig8: 0xe088,
  timeSig9: 0xe089,
  noteheadWhole: 0xe0a2,
  noteheadHalf: 0xe0a3,
  noteheadBlack: 0xe0a4,
  augmentationDot: 0xe1e7,
  flag8thUp: 0xe240,
  flag8thDown: 0xe241,
  flag16thUp: 0xe242,
  flag16thDown: 0xe243,
  flag32ndUp: 0xe244,
  flag32ndDown: 0xe245,
  accidentalFlat: 0xe260,
  accidentalNatural: 0xe261,
  accidentalSharp: 0xe262,
  accidentalDoubleSharp: 0xe263,
  accidentalDoubleFlat: 0xe264,
  restWhole: 0xe4e3,
  restHalf: 0xe4e4,
  restQuarter: 0xe4e5,
  rest8th: 0xe4e6,
  rest16th: 0xe4e7,
  rest32nd: 0xe4e8,
} as const;

export type RequiredGlyphName = keyof typeof SMUFL_CODEPOINTS;

export const REQUIRED_GLYPHS = Object.keys(SMUFL_CODEPOINTS) as RequiredGlyphName[];

/** Glyphs whose stem anchors the layout genuinely needs. */
const STEM_ANCHOR_GLYPHS: RequiredGlyphName[] = ['noteheadWhole', 'noteheadHalf', 'noteheadBlack'];

// ── Engraving defaults ─────────────────────────────────────────────

const ENGRAVING_DEFAULT_KEYS: Array<keyof SmuflEngravingDefaults> = [
  'staffLineThickness',
  'stemThickness',
  'beamThickness',
  'beamSpacing',
  'thinBarlineThickness',
  'thickBarlineThickness',
  'legerLineThickness',
  'legerLineExtension',
  'tupletBracketThickness',
];

/** Bravura's published values, the fallback of last resort (spaces). */
const BRAVURA_ENGRAVING_DEFAULTS: SmuflEngravingDefaults = {
  staffLineThickness: 0.13,
  stemThickness: 0.12,
  beamThickness: 0.5,
  beamSpacing: 0.25,
  thinBarlineThickness: 0.16,
  thickBarlineThickness: 0.5,
  legerLineThickness: 0.16,
  legerLineExtension: 0.4,
  tupletBracketThickness: 0.16,
};

// ── Unit conversion (Kimi guardrail 2) ─────────────────────────────

/** Staff spaces → px. 1 space = the renderer's lineGap. */
export function spToPx(sp: number, lineGap: number): number {
  return sp * lineGap;
}

/** SVG font-size in px for a SMuFL font: one em spans 4 spaces. */
export function smuflFontSizePx(lineGap: number): number {
  return 4 * lineGap;
}

// ── Loader ─────────────────────────────────────────────────────────

interface RawMetadata {
  fontName?: string;
  fontVersion?: string | number;
  engravingDefaults?: Record<string, number>;
  glyphBBoxes?: Record<string, { bBoxNE: SpPoint; bBoxSW: SpPoint }>;
  glyphsWithAnchors?: Record<string, Record<string, SpPoint>>;
}

/**
 * Validate raw SMuFL metadata and build the metric cache.
 *
 * @param raw       Parsed metadata JSON (`bravura_metadata.json` and kin).
 * @param fallback  A prepared font (normally Bravura) whose metrics fill
 *                  any gap, per Kimi's guardrail 1. Omit only when
 *                  preparing Bravura itself; then a missing required
 *                  bounding box throws, because there is nothing beneath
 *                  the reference font.
 */
export function prepareSmuflFont(raw: unknown, fallback?: PreparedSmuflFont): PreparedSmuflFont {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('smufl: metadata is not an object');
  }
  const meta = raw as RawMetadata;
  const fontName = meta.fontName ?? 'unknown';
  const warnings: string[] = [];

  // Engraving defaults: native → fallback font → Bravura's published values.
  const ed = {} as SmuflEngravingDefaults;
  for (const key of ENGRAVING_DEFAULT_KEYS) {
    const native = meta.engravingDefaults?.[key];
    if (typeof native === 'number') {
      ed[key] = native;
    } else {
      ed[key] = fallback?.engravingDefaults[key] ?? BRAVURA_ENGRAVING_DEFAULTS[key];
      warnings.push(`engravingDefaults.${key}: fallback`);
    }
  }

  // Metric cache, filled eagerly so validation happens at load, not mid-render.
  const cache = new Map<RequiredGlyphName, SmuflGlyphMetrics>();
  for (const name of REQUIRED_GLYPHS) {
    const codepoint = SMUFL_CODEPOINTS[name];
    const bbox = meta.glyphBBoxes?.[name];
    const anchors = meta.glyphsWithAnchors?.[name] ?? {};

    let bBoxNE: SpPoint;
    let bBoxSW: SpPoint;
    if (bbox?.bBoxNE && bbox?.bBoxSW) {
      bBoxNE = bbox.bBoxNE;
      bBoxSW = bbox.bBoxSW;
    } else if (fallback) {
      const fb = fallback.glyph(name);
      bBoxNE = fb.bBoxNE;
      bBoxSW = fb.bBoxSW;
      warnings.push(`${name}: bbox from ${fallback.fontName}`);
    } else {
      throw new Error(`smufl: ${fontName} is missing the bounding box for required glyph ${name} and no fallback font was given`);
    }

    const mergedAnchors: Record<string, SpPoint> = { ...anchors };
    if (STEM_ANCHOR_GLYPHS.includes(name) && name !== 'noteheadWhole') {
      for (const anchor of ['stemUpSE', 'stemDownNW'] as const) {
        if (!mergedAnchors[anchor]) {
          const fb = fallback?.glyph(name).anchors[anchor];
          if (fb) {
            mergedAnchors[anchor] = fb;
            warnings.push(`${name}.${anchor}: anchor from ${fallback!.fontName}`);
          } else if (!fallback) {
            throw new Error(`smufl: ${fontName} is missing required anchor ${name}.${anchor}`);
          } else {
            warnings.push(`${name}.${anchor}: missing everywhere; layout will approximate from the bbox`);
          }
        }
      }
    }

    cache.set(name, {
      codepoint,
      char: String.fromCodePoint(codepoint),
      bBoxNE,
      bBoxSW,
      widthSp: bBoxNE[0] - bBoxSW[0],
      anchors: mergedAnchors,
    });
  }

  return {
    fontName,
    fontVersion: String(meta.fontVersion ?? ''),
    engravingDefaults: ed,
    glyph: (name: RequiredGlyphName): SmuflGlyphMetrics => {
      const m = cache.get(name);
      if (!m) throw new Error(`smufl: unknown glyph ${name}`);
      return m;
    },
    warnings,
  };
}
