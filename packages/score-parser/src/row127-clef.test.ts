/**
 * Row 127: a line read an octave lower keeps the print's notes under treble with an 8 below.
 *
 * The fixture is `demoScore()` (bass, no sharps) made into a printed-treble line: G2 clef,
 * three sharps, and its pitches spread over C4 to A5. (a) is the line as written in plain
 * treble; (b) the same line read an octave lower and drawn `treble-8vb`; (c) read lower
 * and drawn in bass clef. Every notehead and every key-signature accidental of (b) must
 * stand where (a) puts it: the print is the same, only the sounding pitch differs.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { demoProfile, demoResolver, demoScore } from './demo-fixture';
import { analyzeScore } from './overlay-engine';
import { prepareSmuflFont } from './smufl-metadata';
import { renderAnalyzedStaff } from './staff-renderer';
import { shiftVocalOctave } from './vocal-octave';
import type { ParsedScore, Pitch } from './types';

const fonts = new URL('../../../apps/web/static/fonts/', import.meta.url);
const readJson = (p: string): unknown => JSON.parse(readFileSync(new URL(p, fonts), 'utf8'));
const maestro = prepareSmuflFont(readJson('finale-maestro/FinaleMaestro.json'), prepareSmuflFont(readJson('bravura/bravura_metadata.json')));

/** C4 to A5, a diatonic ladder, cycled over the pitched events. */
const LADDER: Pitch[] = [
	['C', 4], ['D', 4], ['E', 4], ['F', 4], ['G', 4], ['A', 4], ['B', 4], ['C', 5], ['D', 5], ['E', 5], ['F', 5], ['G', 5], ['A', 5],
].map(([step, octave]) => ({ step: step as Pitch['step'], octave: octave as number, alter: 0 }));

function printedTreble(): ParsedScore {
	const base = demoScore();
	let i = 0;
	return {
		...base,
		clefs: [{ measureIndex: 0, clef: { sign: 'G', line: 2 } }],
		keySignatures: [{ measureIndex: 0, signature: { fifths: 3 } }],
		measures: base.measures.map((m) => ({ ...m, keySignature: { fifths: 3 } })),
		vocalLine: base.vocalLine.map((e) => (e.pitch ? { ...e, pitch: { ...LADDER[i++ % LADDER.length] } } : e)),
	};
}

const render = (parsed: ParsedScore, clef: 'treble' | 'treble-8vb' | 'bass'): string =>
	renderAnalyzedStaff(parsed, analyzeScore(parsed, demoProfile, demoResolver, { generatedAt: '2026-10-20T00:00:00.000Z' }), { font: maestro, fontFamily: 'Finale Maestro', lineGap: 12, staffMidY: 60, clef });
/** The sung notehead of each note: the first plain glyph of its event group (the turning layer's carry `data-analysis`). */
const headYs = (svg: string): number[] =>
	svg.split('<g data-event-id="').slice(1).map((chunk) => Number(chunk.match(/<text x="[^"]*" y="([^"]*)" font-size="48px"/)?.[1])).filter((y) => Number.isFinite(y));
const keyYs = (svg: string): number[] => [...svg.matchAll(/<text data-key-signature="" x="[^"]*" y="([^"]*)"/g)].map((m) => Number(m[1]));

describe('row 127: treble with an 8 below keeps the print', () => {
	const written = printedTreble();
	const lowered = shiftVocalOctave(written, -1);
	const a = render(written, 'treble');
	const b = render(lowered, 'treble-8vb');
	const c = render(lowered, 'bass');

	it('every notehead stands where the print puts it', () => {
		expect(headYs(a).length).toBeGreaterThan(10);
		expect(headYs(b)).toEqual(headYs(a));
	});

	it('every key-signature accidental stands where the print puts it (three sharps)', () => {
		expect(keyYs(a)).toHaveLength(3);
		expect(keyYs(b)).toEqual(keyYs(a));
	});

	it('draws the 8-below clef, and bass draws the bass clef with the heads at their bass places', () => {
		expect(b).toContain('data-clef="treble-8vb"');
		expect(b).toContain(maestro.glyph('gClef8vb').char);
		expect(c).toContain('data-clef="bass"');
		expect(c).toContain(maestro.glyph('fClef').char);
		expect(headYs(c)).not.toEqual(headYs(a));
	});
});
