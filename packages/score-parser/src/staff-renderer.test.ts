/**
 * Staff-renderer spike tests. Asserts that the bespoke SVG carries all four
 * hard criteria (forced stems, grey turning-pitch noteheads, red crossing
 * boxes, dual Cyrillic/IPA underlay), the `#` phonation break, and a
 * `data-event-id` per note. String assertions over the SVG output, which is
 * a pure function — no browser needed.
 */

import { describe, expect, it } from 'vitest';
import { analyzeScore, type VowelResolver } from './overlay-engine';
import { renderAnalyzedStaff } from './staff-renderer';
import type { Fraction, NoteBase, ParsedScore, Pitch, VocalLineEvent } from './types';
import type { VoiceProfileSnapshot } from './analysis-types';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
function frac(n: number, d: number): Fraction {
  return { numerator: n, denominator: d };
}
function note(id: string, pitch: Pitch, base: NoteBase, verses: [string, string]): VocalLineEvent {
  const dur: Record<NoteBase, Fraction> = {
    breve: frac(2, 1), whole: frac(1, 1), half: frac(1, 2), quarter: frac(1, 4), eighth: frac(1, 8),
    '16th': frac(1, 16), '32nd': frac(1, 32), '64th': frac(1, 64), '128th': frac(1, 128),
  };
  return {
    id,
    type: 'note',
    measureIndex: 0,
    rhythmicPosition: { fraction: frac(0, 1) },
    duration: { base, dots: 0, fraction: dur[base] },
    pitch,
    syllable: { id: `s-${id}`, text: verses[0], type: 'whole', verseNumber: 1, wordContext: verses[0], verses },
  };
}

const profile: VoiceProfileSnapshot = {
  fR1: { a: 650, o: 450, u: 350, i: 300, e: 400, ɛ: 500 },
  range: { lowest: P('C', 2), highest: P('E', 4) },
  tessitura: { low: P('F', 2), high: P('C', 3) },
  passaggio: { primo: P('A', 2), secondo: P('D', 3) },
  label: 'bass',
};

const vowelById: Record<string, string> = { n1: 'a', n2: 'o', n3: 'u', n4: 'i', n5: 'i' };
const resolver: VowelResolver = (e) => vowelById[e.id];

function demoScore(): ParsedScore {
  const events = [
    note('n1', P('F', 2), 'quarter', ['Ты', 'tɨ']),
    note('n2', P('A', 2), 'quarter', ['по', 'po']),
    note('n3', P('D', 3), 'quarter', ['гру', 'gru']),
    note('n4', P('A', 3), 'quarter', ['зи', 'zi']),
    note('n5', P('D', 4), 'half', ['сь', 'sʲ']),
  ];
  return {
    source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
    vocalPart: { partId: 'P1', partName: 'Voice' },
    measures: [{ index: 0, number: '1', timeSignature: { beats: 4, beatType: 4 }, keySignature: { fifths: -1 }, expectedDuration: frac(1, 1) }],
    keySignatures: [{ measureIndex: 0, signature: { fifths: -1 } }],
    timeSignatures: [{ measureIndex: 0, signature: { beats: 4, beatType: 4 } }],
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

describe('staff renderer: the four hard criteria', () => {
  const svg = renderDemo();

  it('is a well-formed standalone SVG', () => {
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
  });

  it('1. carries forced stems in both directions (open down, close up)', () => {
    // Open notes (n1–n3, low) get down-stems; close notes (n4–n5, high) get up-stems.
    const stems = svg.match(/stroke-width="1\.5"/g) ?? [];
    expect(stems.length).toBeGreaterThan(1);
  });

  it('2. draws grey stemless turning-pitch noteheads', () => {
    expect(svg.includes('fill="#9a968f"')).toBe(true);
  });

  it('3. draws a red squircle at the fR1/fo crossing (n5)', () => {
    expect(svg.includes('stroke="#b23b3b"')).toBe(true);
  });

  it('4. draws the dual Cyrillic / IPA underlay', () => {
    expect(svg.includes('>Ты<')).toBe(true); // verse 1, Cyrillic
    expect(svg.includes('>tɨ<')).toBe(true); // verse 2, IPA
  });

  it('draws the # phonation break on n2', () => {
    expect(svg.includes('>#<')).toBe(true);
  });

  it('binds every note by data-event-id for the correction UI', () => {
    for (const id of ['n1', 'n2', 'n3', 'n4', 'n5']) {
      expect(svg.includes(`data-event-id="${id}"`)).toBe(true);
    }
  });
});
