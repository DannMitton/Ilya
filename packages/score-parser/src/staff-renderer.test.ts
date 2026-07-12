/**
 * Staff-renderer tests (production layout). A three-measure fixture in 3/4,
 * one flat, exercising rhythmic spacing, barlines, an accidental (B
 * natural against the flat key), a rest, flags, derived-by-beat beaming
 * (primary, secondary, and the timbre-change break), and all four
 * analytical marks plus the `#` phonation break. String assertions over
 * the pure SVG output — no browser needed.
 */

import { describe, expect, it } from 'vitest';
import { analyzeScore, type VowelResolver } from './overlay-engine';
import { renderAnalyzedStaff } from './staff-renderer';
import type { Fraction, NoteBase, ParsedScore, Pitch, TupletInfo, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const frac = (n: number, d: number): Fraction => ({ numerator: n, denominator: d });
const DUR: Record<NoteBase, Fraction> = {
  breve: frac(2, 1), whole: frac(1, 1), half: frac(1, 2), quarter: frac(1, 4), eighth: frac(1, 8),
  '16th': frac(1, 16), '32nd': frac(1, 32), '64th': frac(1, 64), '128th': frac(1, 128),
};

function note(id: string, measureIndex: number, pos: Fraction, pitch: Pitch | null, base: NoteBase, verses?: [string, string], tuplet?: TupletInfo): VocalLineEvent {
  const plain = DUR[base];
  const fraction = tuplet
    ? { numerator: plain.numerator * tuplet.normalNotes, denominator: plain.denominator * tuplet.actualNotes }
    : plain;
  return {
    id,
    type: pitch ? 'note' : 'rest',
    measureIndex,
    rhythmicPosition: { fraction: pos },
    duration: { base, dots: 0, fraction, ...(tuplet ? { tuplet } : {}) },
    ...(pitch ? { pitch } : {}),
    ...(verses ? { syllable: { id: `s-${id}`, text: verses[0], type: 'whole', verseNumber: 1, wordContext: verses[0], verses } } : {}),
  };
}

const TRIPLET: TupletInfo = { actualNotes: 3, normalNotes: 2, normalType: 'eighth' };

const profile: VoiceProfileSnapshot = {
  fR1: { a: 650, o: 450, u: 350, i: 300, e: 400, ɛ: 500, ɑ: 622 },
  range: { lowest: P('C', 2), highest: P('E', 4) },
  tessitura: { low: P('F', 2), high: P('C', 3) },
  passaggio: { primo: P('A', 2), secondo: P('D', 3) },
  label: 'bass',
};

const vowelById: Record<string, string> = {
  n1: 'a', n2: 'o', n3: 'o', n5: 'i', n6: 'i',
  n7: 'o', n8: 'u', n9: 'o', n10: 'o', n11: 'i',
  n13: 'ɑ', n14: 'ɑ', n15: 'ɑ', n16: 'a',
};
const resolver: VowelResolver = (e) => vowelById[e.id];

function demoScore(): ParsedScore {
  const events = [
    note('n1', 0, frac(0, 1), P('F', 2), 'quarter', ['Ты', 'tɨ']),
    note('n2', 0, frac(1, 4), P('A', 2), 'eighth', ['по', 'po']),
    note('n3', 0, frac(3, 8), P('B', 2), 'eighth', ['гру', 'gru']), // B natural vs Bb key → ♮
    note('n4', 0, frac(1, 2), null, 'quarter'), // rest
    note('n5', 1, frac(0, 1), P('A', 3), 'quarter', ['зи', 'zi']),
    note('n6', 1, frac(1, 4), P('D', 4), 'half', ['сь', 'sʲ']), // crossing (≈ fR1 300)
    // Measure 3: beaming cases. Beat 1: an eighth pair, both open → one
    // primary beam despite differing vowels (grouping is by timbre).
    // Beat 2: a 16th pair (open, double beam) then an eighth whose vowel
    // flips the timbre to close → the beam breaks and it takes a flag.
    note('n7', 2, frac(0, 1), P('F', 2), 'eighth', ['но', 'no']),
    note('n8', 2, frac(1, 8), P('G', 2), 'eighth', ['чу', 'tʃʲu']),
    note('n9', 2, frac(1, 4), P('A', 2), '16th', ['по', 'po']),
    note('n10', 2, frac(5, 16), P('B', 2, -1), '16th', ['го', 'go']),
    note('n11', 2, frac(3, 8), P('E', 3), 'eighth', ['ди', 'dʲi']), // close vs open n9/n10 → beam break
    note('n12', 2, frac(1, 2), null, 'quarter'), // rest
    // Measure 4: an eighth-note triplet on dark-a (fR1 622 → turning D#4:
    // the sage sharp appears once and carries through the measure), then a
    // quarter on [a] whose natural turning E4 needs no accidental.
    note('n13', 3, frac(0, 1), P('A', 2), 'eighth', ['тьма', 'tʲmɑ'], TRIPLET),
    note('n14', 3, frac(1, 12), P('B', 2, -1), 'eighth', ['на', 'nɑ'], TRIPLET),
    note('n15', 3, frac(1, 6), P('C', 3), 'eighth', ['ста', 'stɑ'], TRIPLET),
    note('n16', 3, frac(1, 4), P('D', 3), 'quarter', ['ла', 'łɑ']),
    note('n17', 3, frac(1, 2), null, 'quarter'), // rest
  ];
  const m = (index: number) => ({ index, number: String(index + 1), timeSignature: { beats: 3, beatType: 4 }, keySignature: { fifths: -1 }, expectedDuration: frac(3, 4) });
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures: [m(0), m(1), m(2), m(3)],
    keySignatures: [{ measureIndex: 0, signature: { fifths: -1 } }],
    timeSignatures: [{ measureIndex: 0, signature: { beats: 3, beatType: 4 } }],
    tempoMarkings: [],
    vocalLine: events,
  };
}

/** Analyse the demo and mark n2 as a phonation break (as the diction layer would). */
export function renderDemo(): string {
  const parsed = demoScore();
  const analyzed = analyzeScore(parsed, profile, resolver, { generatedAt: '2026-07-12T00:00:00.000Z' });
  analyzed.events.n2.phonationBreak = true;
  return renderAnalyzedStaff(parsed, analyzed);
}

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
    expect(svg.includes('fill="#8FA294"')).toBe(true);
    expect(svg.includes('#9a968f')).toBe(false);
  });

  it('shows the turning D# sharp once, then carries it through the measure', () => {
    expect((svg.match(/fill="#8FA294">♯</g) ?? []).length).toBe(1);
  });

  it('draws no turning accidental for natural turning pitches', () => {
    expect((svg.match(/fill="#8FA294">♮/g) ?? []).length).toBe(0);
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
    expect(svg.includes('fill="#8FA294"')).toBe(true);
  });
  it('3. red squircle at the fR1/fo crossing (n6)', () => {
    expect(svg.includes('stroke="#b23b3b"')).toBe(true);
  });
  it('4. dual Cyrillic / IPA underlay', () => {
    expect(svg.includes('>Ты<')).toBe(true);
    expect(svg.includes('>tɨ<')).toBe(true);
  });
  it('draws the # phonation break', () => {
    expect(svg.includes('>#<')).toBe(true);
  });
  it('binds every note by data-event-id', () => {
    for (const id of ['n1', 'n2', 'n3', 'n5', 'n6']) {
      expect(svg.includes(`data-event-id="${id}"`)).toBe(true);
    }
  });
});
