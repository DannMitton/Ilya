/**
 * Staff-renderer tests (production layout). The shared four-measure demo
 * fixture (see `demo-fixture.ts`) exercises rhythmic spacing, barlines,
 * accidentals (sung and turning layers, with the measure-opening nudge),
 * rests, flags, derived-by-beat beaming (primary, secondary, and the
 * timbre-change break), a bracketed triplet, and all four analytical marks
 * plus the `#` phonation break. String assertions over the pure SVG
 * output — no browser needed.
 *
 * Two modes are covered: the primitive shapes (byte-stable, the sandbox
 * default) and SMuFL glyph mode against a synthetic font.
 */

import { describe, expect, it } from 'vitest';
import { renderDemo, syntheticSmuflFont } from './demo-fixture';

describe('staff renderer: layout', () => {
  const svg = renderDemo();

  it('is a well-formed standalone SVG', () => {
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
  });

  it('renders the key signature (one flat) at the bass-clef B2 position', () => {
    // B2 sits on the second staff line from the bottom: y 108, text baseline 112.
    expect(svg.includes('x="62" y="112"')).toBe(true);
  });

  it('renders a natural accidental where the note contradicts the key (B natural)', () => {
    expect(svg.includes('♮')).toBe(true);
  });

  it('draws a barline between the two measures and a final barline', () => {
    const barlines = svg.match(/y1="72"[^>]*y2="120"/g) ?? [];
    expect(barlines.length).toBeGreaterThan(1); // internal + final
  });

  it('draws a rest', () => {
    expect(svg.includes('width="10" height="6"')).toBe(true);
  });

  it('flags exactly the one unbeamed eighth note (n11, isolated by the timbre break)', () => {
    expect((svg.match(/q8 3 7 12/g) ?? []).length).toBe(1);
  });

  it('sets IPA upright in Lato IPA, preserving the bright-a/dark-a contrast', () => {
    // Both allophones present: dark [ɑ] (тьма) and interpalatal bright [a]
    // (пять, §4.6.6). The IPA line must never be italic: italics flatten
    // double-storey [a] and merge the two.
    expect(svg.includes('>tʲmɑ<')).toBe(true);
    expect(svg.includes('>pʲatʲ<')).toBe(true);
    expect(svg.includes(`fill="#6a655f" font-family="'Lato IPA', sans-serif"`)).toBe(true);
    expect(svg.includes('font-style="italic" fill="#6a655f"')).toBe(false);
  });

  it('places the underlay baselines clear of the lowest notation (collision fix)', () => {
    const cyrY = Number(svg.match(/y="([\d.]+)" text-anchor="middle" font-size="12\.5"/)?.[1]);
    const inkBottoms = [...svg.matchAll(/y2="([\d.]+)" stroke="#1a1612" stroke-width="1\.5"/g)].map((m) => Number(m[1]));
    expect(inkBottoms.length).toBeGreaterThan(0);
    expect(cyrY > Math.max(...inkBottoms)).toBe(true);
  });
});

describe('staff renderer: beaming (derived by beat)', () => {
  const svg = renderDemo();

  it('draws four primary beams (n2+n3, n7+n8, n9+n10, and the triplet)', () => {
    expect((svg.match(/data-beam-level="1"/g) ?? []).length).toBe(4);
  });

  it('double-beams the 16th pair (one secondary segment, no stubs needed)', () => {
    expect((svg.match(/data-beam-level="2"/g) ?? []).length).toBe(1);
  });

  it('breaks the beam where the timbre changes (n11 beams with nothing)', () => {
    // n11 shares measure and beat with n9/n10 but is close-timbre where
    // they are open; it must fall back to a flag (asserted above) and the
    // level-1 beam count must not gain a group for it.
    expect((svg.match(/data-beam-level="1"/g) ?? []).length).toBe(4);
    expect(svg.includes('data-event-id="n11"')).toBe(true);
  });
});

describe('staff renderer: turning-layer accidentals and tuplets (increment 3)', () => {
  const svg = renderDemo();

  it('renders the turning layer in the appendix sage, not the old grey', () => {
    expect(svg.includes('fill="#8B9A7D"')).toBe(true);
    expect(svg.includes('#9a968f')).toBe(false);
  });

  it('shows the turning D# sharp once, then carries it through the measure', () => {
    expect((svg.match(/fill="#8B9A7D">♯</g) ?? []).length).toBe(1);
  });

  it('draws no turning accidental for natural turning pitches', () => {
    expect((svg.match(/fill="#8B9A7D">♮/g) ?? []).length).toBe(0);
  });

  it('brackets the triplet in black with its numeral', () => {
    expect((svg.match(/data-tuplet="3"/g) ?? []).length).toBe(1);
    expect(svg.includes('font-style="italic" fill="#1a1612">3<')).toBe(true);
  });

  it('nudges a measure-opening turning accidental clear of the barline', () => {
    // n13 opens measure 4: its sage sharp sits at nx - 13 (x 761), right of
    // the barline at nx - 18, instead of the mid-measure nx - 19.
    expect(svg.includes('x="761" y="58"')).toBe(true);
  });
});

describe('staff renderer: the four analytical criteria', () => {
  const svg = renderDemo();

  it('1. forced stems in both directions (open down, close up)', () => {
    expect((svg.match(/stroke-width="1\.5"/g) ?? []).length).toBeGreaterThan(1);
  });
  it('2. sage stemless turning-pitch noteheads', () => {
    expect(svg.includes('fill="#8B9A7D"')).toBe(true);
  });
  it('3. red squircle at the fR1/fo crossing (n6)', () => {
    expect(svg.includes('stroke="#b23b3b"')).toBe(true);
  });
  it('4. dual Cyrillic / IPA underlay', () => {
    expect(svg.includes('>Ты<')).toBe(true);
    expect(svg.includes('>tɨ<')).toBe(true);
  });
  it('renders the phonation break as [#] on the IPA line, not above the staff', () => {
    expect(svg.includes('>[#]<')).toBe(true);
    expect(svg.includes('fill="#4a4540"')).toBe(false); // the old above-staff mark
  });
  it('binds every note by data-event-id', () => {
    for (const id of ['n1', 'n2', 'n3', 'n5', 'n6']) {
      expect(svg.includes(`data-event-id="${id}"`)).toBe(true);
    }
  });
});

describe('staff renderer: SMuFL glyph mode (increment 4)', () => {
  const font = syntheticSmuflFont();
  const svg = renderDemo({ font, fontFamily: 'TestFont' });

  it('replaces every shape primitive with glyphs (no ellipses, no flag paths)', () => {
    expect(svg.includes('<ellipse')).toBe(false);
    expect(svg.includes('q8 3 7 12')).toBe(false);
    expect(svg.includes('width="10" height="6"')).toBe(false); // primitive rest
  });

  it('renders the bass clef, noteheads, and rests as SMuFL codepoints', () => {
    expect(svg.includes(String.fromCodePoint(0xe062))).toBe(true); // fClef
    expect(svg.includes(String.fromCodePoint(0xe0a4))).toBe(true); // noteheadBlack
    expect(svg.includes(String.fromCodePoint(0xe0a3))).toBe(true); // noteheadHalf (n6)
    expect(svg.includes(String.fromCodePoint(0xe4e5))).toBe(true); // restQuarter
  });

  it('renders key-signature and layer accidentals as glyphs (flat, natural, sage sharp)', () => {
    expect(svg.includes(String.fromCodePoint(0xe260))).toBe(true); // accidentalFlat (key)
    expect(svg.includes(String.fromCodePoint(0xe261))).toBe(true); // accidentalNatural (n3)
    const sageSharp = new RegExp(`fill="#8B9A7D">${String.fromCodePoint(0xe262)}<`, 'g');
    expect((svg.match(sageSharp) ?? []).length).toBe(1); // turning D#, carried
  });

  it('renders the lone flag as a glyph (up-stem eighth n11)', () => {
    expect(svg.includes(String.fromCodePoint(0xe240))).toBe(true); // flag8thUp
  });

  it('derives stem thickness and beam thickness from engraving defaults', () => {
    expect(svg.includes('stroke-width="1.44"')).toBe(true); // 0.12 sp × 12
    expect((svg.match(/stroke-width="6" data-beam-level/g) ?? []).length).toBe(5); // 0.5 sp × 12
  });

  it('tags glyph text with the requested font family', () => {
    expect(svg.includes('font-family="TestFont"')).toBe(true);
  });

  it('keeps the analytical marks and event bindings intact in glyph mode', () => {
    expect(svg.includes('stroke="#b23b3b"')).toBe(true);
    expect(svg.includes('>[#]<')).toBe(true);
    expect(svg.includes('data-event-id="n13"')).toBe(true);
    expect(svg.includes('>Ты<')).toBe(true);
  });
});
