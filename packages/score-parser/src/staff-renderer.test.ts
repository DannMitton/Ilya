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
import { demoScore, renderDemo, renderDemoUnmeasured, syntheticSmuflFont } from './demo-fixture';
import { columnAdvance, clampHyphenX, HYPHEN_HALF } from './staff-renderer';

// ── N.11: a hyphen's ink stays inside the gap ────────────────────────
//
// Found by Dann at the browser, 2026-08-06: hyphens struck through the
// following letter, in «та-я», in «е-го», and twice on Kabalevsky page 2.
// The cause was the note-column nudge at the placement loop, which moves a
// hyphen 8 px right and never rechecks that it still fits.
//
// This covers the arithmetic. It does not prove the renderer calls it on
// every path; that is Dann's eye, and it is recorded as such.
describe('clampHyphenX', () => {
  it('leaves a hyphen that already fits exactly where it is', () => {
    expect(clampHyphenX(50, 40, 60)).toBe(50);
  });

  it('pulls back a hyphen the note-column nudge pushed past the right edge', () => {
    // The gap is 40 to 52 and the nudge lands the centre at 56, so the ink
    // would run from 53.5 to 58.5, entirely inside the following glyph.
    const hx = clampHyphenX(56, 40, 52);
    expect(hx + HYPHEN_HALF).toBeLessThanOrEqual(52);
    expect(hx - HYPHEN_HALF).toBeGreaterThanOrEqual(40);
  });

  it('never lets the ink cross either edge, wherever the nudge lands it', () => {
    const from = 100;
    const to = 130;
    for (let hx = 80; hx <= 150; hx += 0.5) {
      const c = clampHyphenX(hx, from, to);
      expect(c - HYPHEN_HALF, `centre ${hx}`).toBeGreaterThanOrEqual(from);
      expect(c + HYPHEN_HALF, `centre ${hx}`).toBeLessThanOrEqual(to);
    }
  });

  it('centres in a gap too narrow to hold the hyphen, rather than favouring one side', () => {
    // No legal centre exists here. Overhang both neighbours equally: half of
    // one of them is worse than a sliver of each.
    const from = 100;
    const to = 103;
    const c = clampHyphenX(120, from, to);
    expect(c).toBe(101.5);
    expect(c - from).toBe(to - c);
  });
});

/** The rendered contents of one note's `<g data-event-id>` wrapper. */
function eventGroup(svg: string, id: string): string {
  // The group carries attributes beyond its id since N.71, so this must not
  // demand a '>' straight after the quote.
  return svg.match(new RegExp(`<g data-event-id="${id}"[^>]*>([\\s\\S]*?)</g>`))?.[1] ?? '';
}

/**
 * A note's stem, as [contactY, tipY], from the single `<line>` inside its
 * event group (ledger lines and accidentals are emitted before the wrapper
 * opens). tipY > contactY is a down-stem.
 */
function stemEnds(svg: string, id: string): [number, number] | null {
  const m = eventGroup(svg, id).match(/<line [^>]*y1="([\d.]+)"[^>]*y2="([\d.]+)"/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

describe('staff renderer: layout', () => {
  const svg = renderDemo();

  it('is a well-formed standalone SVG', () => {
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
  });

  it('renders the key signature (one flat) at the bass-clef B2 position', () => {
    // B2 sits on the second staff line from the bottom: y 108, text baseline 112.
    // x is now DERIVED, not the old hardcoded 62: the key signature ends two
    // and a half stave-spaces before the first note (Gould r240), so at the
    // default stave it ends at leftMargin 92 − 30 = 62 and its single flat,
    // 9 px wide in primitive mode, starts at 53.
    expect(svg.includes('x="53" y="112"')).toBe(true);
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

  it('places the NEAR underlay baseline clear of the lowest notation (collision fix)', () => {
    // Since the 2026-08-05 swap the IPA is the near line, so it is the one
    // that has to clear the ink. Asserting the Cyrillic here would pass
    // trivially, being the further of the two.
    const ipaY = Number(svg.match(/y="([\d.]+)" text-anchor="middle" font-size="12" fill="#6a655f"/)![1]);
    const inkBottoms = [...svg.matchAll(/y2="([\d.]+)" stroke="#1a1612" stroke-width="1\.5"/g)].map((m) => Number(m[1]));
    expect(inkBottoms.length).toBeGreaterThan(0);
    expect(ipaY > Math.max(...inkBottoms)).toBe(true);
  });

  it('puts the IPA nearest the stave with the Cyrillic beneath it, matching Transcribe', () => {
    const ipaY = Number(svg.match(/y="([\d.]+)" text-anchor="middle" font-size="12" fill="#6a655f"/)![1]);
    const cyrY = Number(svg.match(/y="([\d.]+)" text-anchor="middle" font-size="12\.5"/)![1]);
    expect(ipaY).toBeLessThan(cyrY);
  });
});

describe('staff renderer: beaming (derived by beat)', () => {
  const svg = renderDemo();

  it('draws five primary beams (n2+n3, n7+n8, n9+n10, the triplet, and the melisma pair)', () => {
    expect((svg.match(/data-beam-level="1"/g) ?? []).length).toBe(5);
  });

  it('double-beams the 16th pair (one secondary segment, no stubs needed)', () => {
    expect((svg.match(/data-beam-level="2"/g) ?? []).length).toBe(1);
  });

  it('never lets a beam override the semantic direction (open n9 down, close n11 up)', () => {
    // Where a turning pitch shares the stave the melody's stem must state
    // its timbre, so a beam can never dictate direction: n9 and n10 are
    // open and beam together with stems down; n11 is close, stems up, and
    // is therefore flagged rather than beamed with them. Mutation control
    // for the precedence order in the stem block.
    const [c9, t9] = stemEnds(svg, 'n9')!;
    expect(t9).toBeGreaterThan(c9);
    const [c11, t11] = stemEnds(svg, 'n11')!;
    expect(t11).toBeLessThan(c11);
  });

  it('breaks the beam where the timbre changes (n11 beams with nothing)', () => {
    // n11 shares measure and beat with n9/n10 but is close-timbre where
    // they are open; it must fall back to a flag (asserted above) and the
    // level-1 beam count must not gain a group for it.
    expect((svg.match(/data-beam-level="1"/g) ?? []).length).toBe(5);
    expect(svg.includes('data-event-id="n11"')).toBe(true);
  });
});

describe('staff renderer: melisma (build 1: detection and alignment)', () => {
  const svg = renderDemo();

  it('left-aligns the melisma syllable at its first notehead (Gould r5)', () => {
    // n18 opens a three-note melisma: both text lines anchor "start";
    // every single-note syllable stays centred.
    expect((svg.match(/text-anchor="start"/g) ?? []).length).toBe(2);
  });

  it('draws raised hyphens between syllables of one word, including across the rest', () => {
    // по-гру (one gap), гру-зи (across rest n4, wide gap), зи-сь: at
    // least three hyphens, all raised above the Cyrillic baseline.
    const hyphens = (svg.match(/data-hyphen="/g) ?? []).length;
    expect(hyphens > 2).toBe(true);
    expect(svg.includes('data-hyphen="n2"')).toBe(true); // по → гру
    expect(svg.includes('data-hyphen="n3"')).toBe(true); // гру → зи (rest between)
    expect(svg.includes('data-hyphen="n5"')).toBe(true); // зи → сь
  });

  it('never hyphenates after a whole-word syllable', () => {
    expect(svg.includes('data-hyphen="n1"')).toBe(false); // Ты is a whole word
  });

  it('draws a baseline extender for the word-final melisma, to the last notehead', () => {
    expect((svg.match(/data-extender="/g) ?? []).length).toBe(1);
    expect(svg.includes('data-extender="n18"')).toBe(true);
  });

  it('draws no extender on long single notes (n6, half note, no melisma)', () => {
    expect(svg.includes('data-extender="n6"')).toBe(false);
  });

  it('draws a flat, head-anchored tie between the tied melisma notes (n19→n20)', () => {
    expect((svg.match(/data-tie="/g) ?? []).length).toBe(1);
    expect(svg.includes('data-tie="n19"')).toBe(true);
  });

  it('curves the tie OPPOSITE the syllabic slur above it (downward, r174)', () => {
    // The RULE under test is unchanged: the tie bows away from the slur. What
    // changed on 2026-08-27 is the tie's SHAPE, from a stroked path of one
    // width to a filled two-curve outline, so the pattern follows the markup
    // and the assertion follows the rule.
    const m = svg.match(
      /M-?[\d.]+ (-?[\d.]+) Q -?[\d.]+ (-?[\d.]+) -?[\d.]+ -?[\d.]+ Q -?[\d.]+ (-?[\d.]+) -?[\d.]+ -?[\d.]+ Z" fill="#1a1612" data-tie="n19"/,
    );
    expect(m !== null).toBe(true);
    expect(Number(m![2]) > Number(m![1])).toBe(true); // outer control below endpoints
    // AND IT TAPERS: the inner control sits between the terminals and the outer
    // one, which is what gives the shape its centre thickness and its points.
    expect(Number(m![3]) > Number(m![1])).toBe(true);
    expect(Number(m![3]) < Number(m![2])).toBe(true);
  });

  it('draws one syllabic slur over the melisma, arching above the staff', () => {
    expect((svg.match(/data-slur="/g) ?? []).length).toBe(1);
    const m = svg.match(/M[\d.]+ ([\d.]+) Q [\d.]+ ([\d.]+) [\d.]+ [\d.]+" fill="none" stroke="#1a1612" stroke-width="1.3" data-slur="n18"/);
    expect(m !== null).toBe(true);
    expect(Number(m![1]) < 72).toBe(true); // endpoints above the top staff line
    expect(Number(m![2]) < Number(m![1])).toBe(true); // slur bows upward: opposite the tie
  });

  it('draws no underlay under melisma continuation notes', () => {
    // n19 and n20 carry no syllable; their columns must be empty of text.
    expect(svg.includes('data-event-id="n19"')).toBe(true);
    expect(svg.includes('data-event-id="n20"')).toBe(true);
    const cyrTexts = (svg.match(/font-size="12\.5"/g) ?? []).length;
    expect(cyrTexts).toBe(15); // 15 syllabled notes, unchanged by the melisma
  });
});

describe('staff renderer: turning-layer accidentals and tuplets (increment 3)', () => {
  const svg = renderDemo();

  it('renders the turning layer in the appendix sage, not the old grey', () => {
    expect(svg.includes('fill="#8E7E9B"')).toBe(true);
    expect(svg.includes('#9a968f')).toBe(false);
  });

  it('shows the turning D# sharp once, then carries it through the measure', () => {
    expect((svg.match(/fill="#8E7E9B">♯</g) ?? []).length).toBe(1);
  });

  it('draws no turning accidental for natural turning pitches', () => {
    expect((svg.match(/fill="#8E7E9B">♮/g) ?? []).length).toBe(0);
  });

  it('offsets a colliding turning notehead beside the sung note (two-voice rule)', () => {
    // n5: sung D3 on [i], turning pitch also D3 (unison). The sage
    // notehead shifts right of the sung one: cx = 306 + 12.4 + 1.6 = 320.
    expect(svg.includes('cx="320"')).toBe(true);
  });

  it('keeps the rising diagonal at a second: lower turning note goes left (Gould v5, r103/104)', () => {
    // n11: sung E3 (y 90), turning D3 (y 96), a second with the turning
    // note BELOW → it displaces left: cx = 660 - 14 = 646.
    expect(svg.includes('cx="646"')).toBe(true);
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
    expect(svg.includes('fill="#8E7E9B"')).toBe(true);
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
  it('gives every analysis overlay its own handle, the phonation break included', () => {
    // Ruled by Dann 2026-08-27. The loupe shows engraving concerns only and is
    // a crop of this SVG, so it filters on this attribute. Two of these marks
    // could be found by their ink and the phonation break could not, which is
    // why the handle exists: a filter that caught three of four would suppress
    // half a layer. Asserted here so a later edit cannot drop one silently.
    for (const kind of ['turning-notehead', 'turning-accidental', 'crossing', 'phonation-break']) {
      expect(svg.includes(`data-analysis="${kind}"`), kind).toBe(true);
    }
    // And nothing the ENGRAVING draws carries it: the count is the count of
    // marks, not of noteheads.
    expect((svg.match(/data-analysis="/g) ?? []).length).toBe(
      (svg.match(/data-analysis="turning-notehead"/g) ?? []).length +
        (svg.match(/data-analysis="turning-accidental"/g) ?? []).length +
        (svg.match(/data-analysis="crossing"/g) ?? []).length +
        (svg.match(/data-analysis="phonation-break"/g) ?? []).length,
    );
  });

  it('draws the turning layer in LAVENDER, because it is voice data', () => {
    // Ruled by Dann 2026-08-27, correcting 2026-07-12's sage. Lavender is the
    // project's shorthand for music and voice — the voice anchor, the loupe's
    // insertion bar and the drawer's correction stations all carry this token
    // — and a formant-derived turning pitch is voice data. Sage codes the
    // score document and its text, and was miscoding these.
    expect(svg.includes('fill="#8E7E9B"')).toBe(true);
    expect(svg.includes('#8B9A7D')).toBe(false);
  });

  it('keeps the handle on the turning marks whatever their ink', () => {
    // THIS IS THE POINT OF THE HANDLE. The colour moved from sage to lavender
    // and the loupe's filter needed no edit, because it stopped depending on
    // ink that a ruling might change. Asserted so the two cannot come apart:
    // every turning mark carries both its handle and the current colour.
    const turning = svg.match(/<[^>]*data-analysis="turning-[^"]*"[^>]*>/g) ?? [];
    expect(turning.length).toBeGreaterThan(0);
    for (const mark of turning) expect(mark).toContain('#8E7E9B');
  });

  it('binds every note by data-event-id', () => {
    for (const id of ['n1', 'n2', 'n3', 'n5', 'n6']) {
      expect(svg.includes(`data-event-id="${id}"`)).toBe(true);
    }
  });

  // N.55b, path A. The hit target exists, it is transparent, and the targets
  // TILE without overlapping. An overlap would resolve a click to the wrong
  // note, which is a worse failure than the 7 px of ink it replaces.
  it('gives every bound note a transparent, non-overlapping hit target', () => {
    const rects = [
      ...svg.matchAll(
        /<rect data-hit="([^"]+)" x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="transparent" pointer-events="all" cursor="pointer"\/>/g,
      ),
    ].map((m) => ({ id: m[1], x: +m[2], w: +m[4] }));
    for (const id of ['n1', 'n2', 'n3', 'n5', 'n6']) {
      expect(rects.some((r) => r.id === id), id).toBe(true);
    }
    for (const r of rects) expect(r.w, r.id).toBeGreaterThan(0);
    const spans = rects.map((r) => [r.x, r.x + r.w]).sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < spans.length; i++) {
      expect(spans[i][0] + 0.02, `span ${i}`).toBeGreaterThanOrEqual(spans[i - 1][1]);
    }
  });

  // N.71 (Dann, 2026-08-16). The rectangle existing is not enough: from
  // 2026-08-13 the notehead was painted over it and still interactive, so a
  // click on the note itself hit the glyph and died. Every event group is now
  // pointer-events="none" and only the rectangle takes them back.
  it('lets nothing painted in an event group intercept the hit target', () => {
    const groups = [...svg.matchAll(/<g data-event-id="([^"]+)"([^>]*)>/g)];
    expect(groups.length).toBeGreaterThan(0);
    for (const [, id, attrs] of groups) {
      expect(attrs, `group ${id}`).toContain('pointer-events="none"');
    }
  });

  // The other half of N.71: a target that gives no sign it is a target is one
  // a singer never presses. Dann found it by noticing the pointer never changed.
  it('shows a pointer cursor over a note', () => {
    for (const m of svg.matchAll(/<rect data-hit="([^"]+)"([^>]*)\/>/g)) {
      expect(m[2], `rect ${m[1]}`).toContain('cursor="pointer"');
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
    const lavenderSharp = new RegExp(`fill="#8E7E9B">${String.fromCodePoint(0xe262)}<`, 'g');
    expect((svg.match(lavenderSharp) ?? []).length).toBe(1); // turning D#, carried
  });

  it('renders the lone flag as a glyph (up-stem eighth n11)', () => {
    expect(svg.includes(String.fromCodePoint(0xe240))).toBe(true); // flag8thUp
  });

  it('derives stem thickness and beam thickness from engraving defaults', () => {
    expect(svg.includes('stroke-width="1.44"')).toBe(true); // 0.12 sp × 12
    expect((svg.match(/stroke-width="6" data-beam-level/g) ?? []).length).toBe(6); // 0.5 sp × 12; 5 primary + 1 secondary
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

describe('staff renderer: the unmeasured page (N.4)', () => {
  // Before this fix the stem was gated on the acoustic event, so a page
  // rendered without a measured voice carried NO stems at all — and a
  // stemless notehead is this app's mark for a turning pitch, so every
  // printed melody note asserted something untrue. Nothing in the suite
  // covered this path: every note in the demo fixture is analysed.
  const svg = renderDemoUnmeasured();
  const measured = renderDemo();
  const stems = (s: string): number => (s.match(/stroke="#1a1612" stroke-width="1\.5"/g) ?? []).length;

  it('draws no acoustic marks at all: no turning layer, no crossing', () => {
    expect(svg.includes('#8E7E9B')).toBe(false);
    expect(svg.includes('stroke="#b23b3b"')).toBe(false);
  });

  it('stems every melody note, as many as the measured page does', () => {
    expect(stems(svg)).toBeGreaterThan(0);
    expect(stems(svg)).toBe(stems(measured));
  });

  it('takes Gould r84 below the middle line: F2 stems up', () => {
    const [contact, tip] = stemEnds(svg, 'n1')!;
    expect(tip).toBeLessThan(contact);
  });

  it('takes Gould r84 above the middle line: D4 stems down, where measured it stems up', () => {
    const [contact, tip] = stemEnds(svg, 'n6')!;
    expect(tip).toBeGreaterThan(contact);
    // The same note measured is close timbre, so semantics reverse it.
    const [mContact, mTip] = stemEnds(measured, 'n6')!;
    expect(mTip).toBeLessThan(mContact);
  });

  it('takes r85 on the middle line: D3 has no clear case, so it stems down', () => {
    const [contact, tip] = stemEnds(svg, 'n16')!;
    expect(tip).toBeGreaterThan(contact);
  });

  it('gives a beat-group one direction from its furthest note, not per note (r92)', () => {
    // n9 (A2), n10 (Bb2), and n11 (E3) share measure 2, beat 1. A2 is
    // furthest from the middle line and lies below it, so the whole group
    // takes up-stems — including n11, which alone would stem down. The
    // group is never split for position; only timbre splits a group.
    const [contact, tip] = stemEnds(svg, 'n11')!;
    expect(tip).toBeLessThan(contact);
  });

  it('measures the stem in stave-spaces, not pixels (Gould r86: 3.5)', () => {
    // The mutation control for the defect Dann found on the printed page:
    // a hardcoded 30 px stem is 2.5 stave-spaces at the test stave size and
    // 5.45 at the production stave size of 5.5, longer than the staff is
    // tall. Stem length must hold at 3.5 stave-spaces at ANY size, so this
    // asserts it at two, and fails for any hardcoded pixel value.
    for (const lineGap of [12, 6]) {
      const s = renderDemoUnmeasured({ lineGap });
      const g = eventGroup(s, 'n6'); // unbeamed half note, no turning head
      const headY = Number(g.match(/<ellipse cx="[\d.]+" cy="([\d.-]+)"[^>]*fill="none"/)![1]);
      const tipY = Number(g.match(/<line [^>]*y2="([\d.-]+)"/)![1]);
      expect(Math.abs(tipY - headY)).toBeCloseTo(3.5 * lineGap, 5);
    }
  });

  it('beams by beat with no flags left over, where the measured page flags n11', () => {
    expect((svg.match(/q8 3 7 12/g) ?? []).length).toBe(0);
    expect((measured.match(/q8 3 7 12/g) ?? []).length).toBe(1);
    expect((svg.match(/data-beam-level="1"/g) ?? []).length).toBe(5);
  });
});

describe('staff renderer: how a system ends (N.6b-1)', () => {
  // Gould r96 and r224: the beam-thick-plus-thin pair belongs to the bar that
  // ends the PIECE. Every system used to draw one, so every system announced
  // the song was over, and the stave then ran on past it into empty space.
  const plain = renderDemo();
  const final = renderDemo({ finalBarline: true });
  // The first `<line>` in the document is the top staff line. Its x1 is no
  // longer 0: the stave's left edge is derived, one stave-space before the
  // clef (Gould r81), so the pattern must not assume a fixed origin.
  const staffLine = (s: string): { x1: number; x2: number } => {
    const m = s.match(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)"/)!;
    return { x1: Number(m[1]), x2: Number(m[2]) };
  };
  const staffRight = (s: string): number => staffLine(s).x2;
  const barXs = (s: string): number[] =>
    [...s.matchAll(/<line x1="([\d.]+)" y1="72" x2="[\d.]+" y2="120"/g)].map((m) => Number(m[1]));

  it('stops the stave at its closing barline, with no empty continuation', () => {
    // The barline's CENTRE sits half its stroke inside the stave end so the
    // stroke's outer edge lands exactly there. The property under test is
    // that no stave runs on past it, not that the two numbers are equal: the
    // old design continued 18 px beyond, which this catches and half a pixel
    // of stroke geometry does not.
    const overhang = staffRight(plain) - Math.max(...barXs(plain));
    expect(overhang).toBeGreaterThanOrEqual(0);
    expect(overhang).toBeLessThanOrEqual(1);
  });

  it('closes an ordinary system with an ordinary barline, not the thick one', () => {
    // Primitive mode: thin barlines are 1, the r96 thick line is 1.6.
    expect(plain.includes('y1="72" x2')).toBe(true);
    expect(plain.includes('y2="120" stroke="#3a352f" stroke-width="1.6"')).toBe(false);
  });

  it('draws the r96 pair only when the piece ends there', () => {
    expect(final.includes('y2="120" stroke="#3a352f" stroke-width="1.6"')).toBe(true);
    // The thin partner sits half a stave-space before the thick line.
    const xs = barXs(final).sort((a, b) => a - b);
    const gap = xs[xs.length - 1] - xs[xs.length - 2];
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThan(12); // one lineGap at the default stave
  });

  it('indents the clef one stave-space into the stave (Gould r81)', () => {
    // SMuFL mode, because there the clef is a single glyph whose x can be read;
    // the primitive clef is a translated group of hand-drawn shapes.
    const s = renderDemo({ font: syntheticSmuflFont(), fontFamily: 'TestFont' });
    const clefX = Number(
      s.match(new RegExp(`<text x="([\\d.]+)"[^>]*>${String.fromCodePoint(0xe062)}<`))![1],
    );
    // One stave-space at the default lineGap of 12. Before this the clef sat at
    // a fixed x of 34 while the stave began at 24: a ten-pixel gap that read as
    // an inset rather than an indent, and 6.2 stave-spaces at the print stave.
    expect(clefX - staffLine(s).x1).toBeCloseTo(12, 1);
  });

  it('gives the last syllable a full stave-space before the barline', () => {
    // A half stave-space put [nuf] hard against it. Same width either way,
    // because the r96 pair is drawn inside the committed width.
    expect(staffRight(plain)).toBeCloseTo(staffRight(final), 0);
  });
});

describe('column advance: text-aware spacing (N.6b-1)', () => {
  // Real fixture events, read rather than reconstructed. n1 carries "Ты",
  // n13 carries "тьма", so their underlays differ in width.
  const byId = new Map(demoScore().vocalLine.map((e) => [e.id, e]));
  const n1 = byId.get('n1')!;
  const n13 = byId.get('n13')!;
  // Starve the duration and floor terms so the text term is what is under
  // test; all three compete for the maximum.
  const opts = { lineGap: 5.5, minGap: 1, pxPerWhole: 1 };

  it('lets the text term govern once duration and floor are small', () => {
    expect(columnAdvance(n1, n13, 0, opts)).toBeGreaterThan(opts.minGap);
  });

  it('grows with a wider syllable', () => {
    expect(columnAdvance(n13, n13, 0, opts)).toBeGreaterThan(columnAdvance(n1, n1, 0, opts));
  });

  it('discounts modifier letters rather than counting code points', () => {
    // Five code points each, but two of the second string's are modifier
    // letters that carry almost no advance. A character count would call
    // these equal; the measured table must not.
    const plain = columnAdvance(n1, n1, 0, { ...opts, ipaPreview: { n1: 'nitui' } });
    const modified = columnAdvance(n1, n1, 0, { ...opts, ipaPreview: { n1: 'nʲitʲ' } });
    expect(modified).toBeLessThan(plain);
  });

  it('never returns less than the floor', () => {
    expect(columnAdvance(n1, n13, 0, { ...opts, minGap: 500 })).toBe(500);
  });
});

describe('staff renderer: system headroom (N.6a)', () => {
  // `staffMidY` is a fixed 96 px that no caller scales with `lineGap`, so at
  // the PRINT stave of 5.5 every system reserved roughly 85 px above a 22 px
  // staff and a page fitted four systems where six belong. At the default
  // stave of 12 the same 96 px is genuinely occupied (a D4 up-stem reaches
  // y 12), which is why the waste was invisible in this suite for months.
  const vbOf = (s: string) => {
    const m = s.match(/viewBox="0 ([\d.]+) ([\d.]+) ([\d.]+)"/)!;
    return { minY: Number(m[1]), width: Number(m[2]), height: Number(m[3]) };
  };
  /** Every y-bearing attribute of DRAWN content: lines 0 and 1 are the svg
   *  tag and the background rect, and the rect sits at min-y by definition,
   *  so including it would make the clipping assertion unfailable. Path data
   *  (slurs, ties) carries no y attribute and is not covered here; those are
   *  bounded in `highestInk` by their control point, which over-reserves. */
  const drawnYs = (s: string): number[] =>
    [...s.split('\n').slice(2).join('\n').matchAll(/\s(?:y|y1|y2|cy)="(-?[\d.]+)"/g)].map((m) => Number(m[1]));

  it('crops the unoccupied headroom at the print stave', () => {
    expect(vbOf(renderDemo({ lineGap: 5.5 })).minY).toBeGreaterThan(0);
  });

  it('clips nothing at either stave size', () => {
    for (const lineGap of [12, 5.5]) {
      const s = renderDemo({ lineGap });
      const ys = drawnYs(s);
      expect(ys.length).toBeGreaterThan(20);
      expect(Math.min(...ys)).toBeGreaterThanOrEqual(vbOf(s).minY);
    }
  });

  it('shortens the system by exactly what it cropped', () => {
    const s = renderDemo({ lineGap: 5.5 });
    const { minY, height } = vbOf(s);
    const cyrY = Number(s.match(/y="([\d.]+)" text-anchor="middle" font-size="12\.5"/)![1]);
    expect(height).toBe(cyrY + 20 - minY);
  });
});

describe('staff renderer: clef passes (v37 §A.17)', () => {
  it('assesses the input when no clef option is given: the low demo takes bass', () => {
    expect(renderDemo().includes('data-clef="bass"')).toBe(true);
  });

  it('renders the treble pass on request: G-line circle, no bass dots', () => {
    const svg = renderDemo({ clef: 'treble' });
    expect(svg.includes('data-clef="treble"')).toBe(true);
    // Primitive treble marker circles the G4 line (staffMidY 96 + lineGap 12).
    expect(svg.includes('<circle cx="46" cy="108" r="4"')).toBe(true);
    // The bass primitive's paired dots must be gone.
    expect(svg.includes('cx="54"')).toBe(false);
  });

  it('places the treble key signature at the treble position (one flat on B4)', () => {
    const svg = renderDemo({ clef: 'treble' });
    // B4 = middle staff line y 96; primitive text baseline y + 4. Same derived
    // x as the bass pass: the header geometry does not depend on the clef's
    // pitch mapping, only on the clef's width.
    expect(svg.includes('x="53" y="100"')).toBe(true);
  });

  it('moves the notes with the clef: the same pitch sits lower on a treble staff', () => {
    const bass = renderDemo();
    const treble = renderDemo({ clef: 'treble' });
    const firstHeadY = (svg: string): number => Number(svg.match(/<ellipse cx="92" cy="([\d.-]+)"/)?.[1]);
    // Treble middle line is B4, twelve diatonic steps above bass's D3, so
    // the same written pitch drops by 12 half-gap steps (6 × lineGap = 72).
    expect(firstHeadY(treble) - firstHeadY(bass)).toBe(72);
  });

  it('renders treble-8vb with the primitive 8 below the clef', () => {
    const svg = renderDemo({ clef: 'treble-8vb' });
    expect(svg.includes('data-clef="treble-8vb"')).toBe(true);
    expect(svg.includes('>8<')).toBe(true);
  });

  it('renders the SMuFL gClef and gClef8vb codepoints in glyph mode', () => {
    const font = syntheticSmuflFont();
    const treble = renderDemo({ clef: 'treble', font, fontFamily: 'TestFont' });
    expect(treble.includes(String.fromCodePoint(0xe050))).toBe(true); // gClef
    expect(treble.includes(String.fromCodePoint(0xe062))).toBe(false); // no fClef
    const tenor = renderDemo({ clef: 'treble-8vb', font, fontFamily: 'TestFont' });
    expect(tenor.includes(String.fromCodePoint(0xe052))).toBe(true); // gClef8vb
  });
});
