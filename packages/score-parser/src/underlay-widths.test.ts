/**
 * underlay-widths.test.ts
 *
 * Vitest tests for underlay-widths.ts. Written to be dropped into a
 * vitest suite (e.g. apps/web) alongside underlay-widths.ts; not run
 * in this environment.
 *
 * These check behaviour, not the specific measured numbers already
 * documented in underlay-widths.ts's header comment - so a re-measure
 * of the fonts (a new font version, say) shouldn't need matching test
 * edits, only the "known single character" checks below hardcode a
 * measured value, and they hardcode it independently of the module's
 * internal table (the module does not export the table, only the two
 * estimator functions), so a table bug can't hide from them.
 */

import { describe, expect, it } from "vitest";
import { estimateCyrillicWidthPx, estimateIpaWidthPx } from "./underlay-widths";

describe("estimateIpaWidthPx", () => {
  it("treats modifier-heavy IPA strings as much narrower than a flat length * average-width guess", () => {
    // "nʲitʲ" is 5 code points (n, ʲ, i, t, ʲ) but only 3 of them are
    // full-size base letters; the other 2 are the palatalization
    // modifier ʲ (U+02B2), which measures far narrower than a base
    // letter. The rendered width should sit much closer to "3 base
    // letters wide" than to "5 average-letters wide".
    const modifierHeavy = "nʲitʲ";
    const baseLetters = "nit"; // the same string with modifiers stripped

    const avgBaseLetterWidthPx = estimateIpaWidthPx(baseLetters, 12) / baseLetters.length;
    const threeCharEstimate = avgBaseLetterWidthPx * 3;
    const fiveCharEstimate = avgBaseLetterWidthPx * 5;

    const actual = estimateIpaWidthPx(modifierHeavy, 12);

    expect(actual).toBeGreaterThan(0);
    // Closer to the 3-character estimate than to the naive 5-character one.
    expect(Math.abs(actual - threeCharEstimate)).toBeLessThan(
      Math.abs(actual - fiveCharEstimate),
    );
    // And well short of even reaching the naive 5-character guess.
    expect(actual).toBeLessThan(fiveCharEstimate);
  });

  it("is monotonic: appending any character never decreases the estimate", () => {
    const bases = ["", "n", "nʲ", "ɑtʲˈtʲɛnʌk", "pusʲtʲ"];
    // A mix of ordinary letters, modifiers, and zero-width combining
    // marks - the zero-width case is the one most likely to trip up a
    // naive "always add something" implementation.
    const appended = ["a", "t", "ʲ", "ˈ", "ː", "̀" /* combining grave, 0-width */];

    for (const base of bases) {
      const baseWidth = estimateIpaWidthPx(base, 12);
      for (const ch of appended) {
        const grown = estimateIpaWidthPx(base + ch, 12);
        expect(grown).toBeGreaterThanOrEqual(baseWidth);
      }
    }
  });

  it("scales linearly with font size", () => {
    const samples = ["nʲitʲ", "ʃʲʃʲo", "ɑtʲˈtʲɛnʌk", "pusʲtʲ"];
    for (const s of samples) {
      const at12 = estimateIpaWidthPx(s, 12);
      const at24 = estimateIpaWidthPx(s, 24);
      expect(at24).toBeCloseTo(at12 * 2, 6);
    }
  });

  it("returns a known single character's table value scaled, computed independently of the module", () => {
    // U+02B2 (ʲ, MODIFIER LETTER SMALL J) measures 157 per-1000-em in
    // Lato IPA (fonttools hmtx: advance 314 / unitsPerEm 2000 * 1000 =
    // 157). At 20px that is 157 / 1000 * 20 = 3.14px, computed here by
    // hand rather than pulled from the module's internal table.
    const expectedPx = (157 / 1000) * 20;
    expect(estimateIpaWidthPx("ʲ", 20)).toBeCloseTo(expectedPx, 6);
  });
});

describe("estimateCyrillicWidthPx", () => {
  it("is monotonic: appending any character never decreases the estimate", () => {
    const bases = ["", "т", "прив", "ест"];
    const appended = ["а", "ш", "-", ",", " ", "́" /* combining acute, 0-width */];

    for (const base of bases) {
      const baseWidth = estimateCyrillicWidthPx(base, 12.5);
      for (const ch of appended) {
        const grown = estimateCyrillicWidthPx(base + ch, 12.5);
        expect(grown).toBeGreaterThanOrEqual(baseWidth);
      }
    }
  });

  it("scales linearly with font size", () => {
    const samples = ["привет", "тётя", "щ", "Ж"];
    for (const s of samples) {
      const at125 = estimateCyrillicWidthPx(s, 12.5);
      const at25 = estimateCyrillicWidthPx(s, 25);
      expect(at25).toBeCloseTo(at125 * 2, 6);
    }
  });

  it("returns a known single character's table value scaled, computed independently of the module", () => {
    // U+0430 (а, CYRILLIC SMALL LETTER A) measures 548 per-1000-em in
    // Source Serif 4, instanced from the variable font at opsz=12.5,
    // wght=400 (fonttools hmtx on the instanced font: advance 548 /
    // unitsPerEm 1000 * 1000 = 548). At 25px that is
    // 548 / 1000 * 25 = 13.7px, computed here by hand rather than
    // pulled from the module's internal table.
    //
    // (Earlier value: 541, measured from the static default-opsz
    // instance - that measurement was wrong, see underlay-widths.ts's
    // header comment; opsz=12.5 is narrower-optical-size-is-wider, so
    // the corrected value is bigger, not smaller.)
    const expectedPx = (548 / 1000) * 25;
    expect(estimateCyrillicWidthPx("а", 25)).toBeCloseTo(expectedPx, 6);
  });

  it("gives a combining acute accent zero width regardless of font size", () => {
    expect(estimateCyrillicWidthPx("́", 12.5)).toBe(0);
    expect(estimateCyrillicWidthPx("́", 100)).toBe(0);
  });
});

describe("cross-string sanity (naive length * 7.5 vs measured, at 12px)", () => {
  it.each([
    ["nʲitʲ"],
    ["ʃʲʃʲo"],
    ["ɑtʲˈtʲɛnʌk"],
    ["pusʲtʲ"],
  ])("measured estimate for %s is well below the naive length*7.5 guess", (s: string) => {
    const naive = s.length * 7.5;
    const measured = estimateIpaWidthPx(s, 12);
    expect(measured).toBeLessThan(naive);
    expect(measured).toBeGreaterThan(0);
  });
});
