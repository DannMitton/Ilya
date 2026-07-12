/**
 * SMuFL metadata loader tests. Synthetic metadata objects exercise the
 * validation, fallback, and unit-conversion paths; the real font files are
 * exercised in-browser on the taste-test page (they are static assets, not
 * importable fixtures, and the loader is deliberately fetch-free).
 */

import { describe, expect, it } from 'vitest';
import {
  prepareSmuflFont,
  smuflFontSizePx,
  spToPx,
  REQUIRED_GLYPHS,
  SMUFL_CODEPOINTS,
} from './smufl-metadata';

/** A complete synthetic metadata object covering every required glyph. */
function completeMetadata(fontName: string) {
  const glyphBBoxes: Record<string, { bBoxNE: [number, number]; bBoxSW: [number, number] }> = {};
  const glyphsWithAnchors: Record<string, Record<string, [number, number]>> = {};
  for (const name of REQUIRED_GLYPHS) {
    glyphBBoxes[name] = { bBoxNE: [1.18, 0.5], bBoxSW: [0, -0.5] };
    glyphsWithAnchors[name] = { stemUpSE: [1.18, 0.168], stemDownNW: [0, -0.168] };
  }
  return {
    fontName,
    fontVersion: '1.0',
    engravingDefaults: {
      staffLineThickness: 0.13,
      stemThickness: 0.12,
      beamThickness: 0.5,
      beamSpacing: 0.25,
      thinBarlineThickness: 0.16,
      thickBarlineThickness: 0.5,
      legerLineThickness: 0.16,
      legerLineExtension: 0.4,
      tupletBracketThickness: 0.16,
    },
    glyphBBoxes,
    glyphsWithAnchors,
  };
}

describe('smufl-metadata: preparation and metrics', () => {
  const bravura = prepareSmuflFont(completeMetadata('Bravura'));

  it('prepares a complete font with no warnings', () => {
    expect(bravura.fontName).toBe('Bravura');
    expect(bravura.warnings).toHaveLength(0);
  });

  it('exposes codepoint, char, and width for every required glyph', () => {
    const nh = bravura.glyph('noteheadBlack');
    expect(nh.codepoint).toBe(0xe0a4);
    expect(nh.char).toBe(String.fromCodePoint(0xe0a4));
    expect(nh.widthSp).toBeCloseTo(1.18, 5);
  });

  it('caches metrics (same object back on repeat lookups)', () => {
    expect(bravura.glyph('fClef')).toBe(bravura.glyph('fClef'));
  });

  it('registry covers the renderer needs (clefs, heads, flags, accidentals, rests)', () => {
    expect(SMUFL_CODEPOINTS.fClef).toBe(0xe062);
    expect(SMUFL_CODEPOINTS.accidentalSharp).toBe(0xe262);
    expect(SMUFL_CODEPOINTS.restQuarter).toBe(0xe4e5);
  });
});

describe('smufl-metadata: Kimi guardrail 1 (validation + Bravura fallback)', () => {
  const bravura = prepareSmuflFont(completeMetadata('Bravura'));

  it('fills a missing bounding box from the fallback and records a warning', () => {
    const gappy = completeMetadata('Gappy');
    delete gappy.glyphBBoxes.restQuarter;
    const font = prepareSmuflFont(gappy, bravura);
    expect(font.glyph('restQuarter').widthSp).toBeCloseTo(1.18, 5);
    expect(font.warnings).toEqual(['restQuarter: bbox from Bravura']);
  });

  it('fills a missing stem anchor from the fallback and records a warning', () => {
    const gappy = completeMetadata('Gappy');
    delete gappy.glyphsWithAnchors.noteheadBlack.stemUpSE;
    const font = prepareSmuflFont(gappy, bravura);
    expect(font.glyph('noteheadBlack').anchors.stemUpSE).toEqual([1.18, 0.168]);
    expect(font.warnings).toEqual(['noteheadBlack.stemUpSE: anchor from Bravura']);
  });

  it('throws on a missing required bbox when no fallback exists (the reference font itself)', () => {
    const gappy = completeMetadata('Gappy');
    delete gappy.glyphBBoxes.noteheadBlack;
    let threw = false;
    try {
      prepareSmuflFont(gappy);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it('falls back engraving defaults per key and records each', () => {
    const gappy = completeMetadata('Gappy');
    delete (gappy.engravingDefaults as Record<string, number | undefined>).stemThickness;
    const font = prepareSmuflFont(gappy, bravura);
    expect(font.engravingDefaults.stemThickness).toBeCloseTo(0.12, 5);
    expect(font.warnings).toEqual(['engravingDefaults.stemThickness: fallback']);
  });

  it('rejects non-object metadata outright', () => {
    let threw = false;
    try {
      prepareSmuflFont('not metadata');
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });
});

describe('smufl-metadata: Kimi guardrail 2 (unit normalization)', () => {
  it('converts staff spaces to px via lineGap; UPM never enters the layout', () => {
    expect(spToPx(0.5, 12)).toBe(6);
    expect(spToPx(1.18, 12)).toBeCloseTo(14.16, 5);
  });

  it('SMuFL font-size is 4 spaces (one em spans the staff)', () => {
    expect(smuflFontSizePx(12)).toBe(48);
  });
});
