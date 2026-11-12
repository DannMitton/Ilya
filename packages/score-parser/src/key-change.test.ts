/**
 * N.192 step 3: a key that changes inside the piece is drawn as printed.
 *
 * The fixture is `fixtures/key-changes.musicxml`: D major, F major from bar 5
 * (mid-system), D major again from bar 9 (a system break), A major in 3/4 from
 * bar 11 (key and meter together). Tests call `renderSystemSlice` and
 * `sliceWidth` with explicit measure ranges, never a page width chosen to
 * force a break.
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { prepareSmuflFont } from './smufl-metadata';
import { renderAnalyzedStaff, tacetRuns } from './staff-renderer';
import { renderSystemSlice, sliceScore, sliceWidth } from './page-layout';
import { keyChangeGlyphs } from './key-change';
import { accidentalStateAtEndOf, keyDeclaredAt, keyInForce, outgoingKeyAfter } from './accidental-carry';
import { doubleAccidentalsDrawn, engraveInKey } from './transposition';
import type { ParsedScore } from './types';

const fonts = new URL('../../../apps/web/static/fonts/', import.meta.url);
const readJson = (p: string): unknown => JSON.parse(readFileSync(new URL(p, fonts), 'utf8'));
const maestro = prepareSmuflFont(readJson('finale-maestro/FinaleMaestro.json'), prepareSmuflFont(readJson('bravura/bravura_metadata.json')));
const OPTS = { font: maestro, fontFamily: 'Finale Maestro', lineGap: 12, staffMidY: 60 };

async function parse(path: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(path, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const analyse = (s: ParsedScore) => analyzeScore(s, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
const fixture = (): Promise<ParsedScore> => parse('./fixtures/key-changes.musicxml');
const keyChanges = (svg: string): string[] => [...svg.matchAll(/data-key-change="([^"]*)"/g)].map((m) => m[1]);
const glyphsIn = (svg: string): string[] => [...svg.matchAll(/<g data-key-change="[^"]*">(.*?)<\/g>/g)].flatMap((g) => [...g[1].matchAll(/>([^<]+)<\/text>/g)].map((m) => m[1]));
/** An accidental drawn on a note: SMuFL `accidental*` text carrying `data-of-event`. */
const markedNotes = (svg: string): string[] => [...svg.matchAll(/data-of-event="([^"]+)"[^>]*>[^<]*<\/text>/g)].map((m) => m[1]);
const widthOf = (svg: string): number => Number(svg.match(/viewBox="0 [\d.-]+ ([\d.]+) /)![1]);

describe('which glyphs a change draws', () => {
	const shape = (from: number, to: number): string => keyChangeGlyphs(from, to).map((g) => `${g.kind[0]}${g.step}`).join(' ');
	it('cancels the old key\'s sharps and flats that the new key does not keep, then draws the new key in full', () => {
		expect(shape(2, -1)).toBe('nF nC fB');
		expect(shape(-1, 2)).toBe('nB sF sC');
		expect(shape(3, 2)).toBe('nG sF sC');
		expect(shape(-3, -1)).toBe('nE nA fB');
	});
	it('cancels nothing for a key of the same kind with as many or more accidentals', () => {
		expect(shape(2, 3)).toBe('sF sC sG');
		expect(shape(-1, -4)).toBe('fB fE fA fD');
	});
	it('draws only naturals to no accidentals, only the signature from none, and nothing for the same key', () => {
		expect(shape(2, 0)).toBe('nF nC');
		expect(shape(0, -2)).toBe('fB fE');
		expect(shape(1, 1)).toBe('');
	});
	it('puts each natural where the sharp or flat it cancels stood', () => {
		expect(keyChangeGlyphs(2, -1).map((g) => g.table)).toEqual(['sharps', 'sharps', 'flats']);
		expect(keyChangeGlyphs(-1, 2).map((g) => g.table)).toEqual(['flats', 'sharps', 'sharps']);
	});
});

describe('the key in force, per bar', () => {
	it('declares a key where a bar differs from the one before, and never on the first bar of a slice', async () => {
		const score = await fixture();
		expect([4, 8, 10].map((m) => keyDeclaredAt(score, m))).toEqual([{ from: 2, to: -1 }, { from: -1, to: 2 }, { from: 2, to: 3 }]);
		expect([0, 1, 5, 9].map((m) => keyDeclaredAt(score, m))).toEqual([undefined, undefined, undefined, undefined]);
		expect(keyDeclaredAt(sliceScore(score, 4, 7), 0)).toBeUndefined();
		expect([0, 4, 8, 11].map((m) => keyInForce(score, m))).toEqual([2, -1, 2, 3]);
	});
	it('names the key after a system only where it differs from the system\'s last bar', async () => {
		const score = await fixture();
		expect(outgoingKeyAfter(score, 7)).toBe(2);
		expect(outgoingKeyAfter(score, 8)).toBeUndefined();
		expect(outgoingKeyAfter(score, 11)).toBeUndefined();
	});
	it('carries nothing across a change, and judges each bar against its own key', async () => {
		const score = await fixture();
		// bar 5 (index 4) ends with an F natural and B flat stated by the key; bar 6's end state is the B natural alone.
		expect(accidentalStateAtEndOf(score, 5, 2)).toEqual({ B4: 0 });
		// bar 9 (index 8) opens in D major: nothing from F major reaches it.
		expect(accidentalStateAtEndOf(score, 8, 2)).toEqual({});
	});
});

describe('a system that changes key inside it (bars 1 to 8)', () => {
	it('draws the new signature once, after the barline, with its naturals, in a group that is not the Loupe\'s head handle', async () => {
		const score = await fixture();
		const svg = renderSystemSlice(score, analyse(score), OPTS, 0, 6, { finalBarline: false });
		expect(keyChanges(svg)).toEqual(['2>-1']);
		expect(glyphsIn(svg)).toHaveLength(3); // two naturals, one flat
		expect(svg.match(/data-key-signature/g)).toHaveLength(2); // the head's two sharps, and no more
		expect((svg.match(/<line [^>]*y1="[^"]*"[^>]*\/>/g) ?? []).length).toBeGreaterThan(0);
	});
	it('draws no accidental on a note the key in force already gives it, and one where the key does not', async () => {
		const score = await fixture();
		const svg = renderSystemSlice(score, analyse(score), OPTS, 0, 7, { finalBarline: false });
		const marked = markedNotes(svg);
		// bar 5: F natural and B flat sit in F major (no sign); bar 6: B natural needs one.
		expect(marked).not.toContain('m4-0-1');
		expect(marked).not.toContain('m4-1-4');
		expect(marked).toContain('m5-1-2');
		// bars 1 to 4 carry F sharp in D major (no sign).
		expect(marked).not.toContain('m0-1-2');
	});
	it('closes with a light double barline and a courtesy signature at a break, inside the system\'s width', async () => {
		const score = await fixture();
		const svg = renderSystemSlice(score, analyse(score), OPTS, 0, 7, { finalBarline: false });
		expect(keyChanges(svg)).toEqual(['2>-1', '-1>2'] as string[]);
		expect(glyphsIn(svg)).toHaveLength(3 + 3); // the courtesy: a natural, two sharps
	});
	it('gives the same width from sliceWidth as the drawing has, with and without a courtesy', async () => {
		const score = await fixture();
		const analyzed = analyse(score);
		for (const [from, to, last] of [[0, 3, false], [0, 7, false], [4, 7, false], [8, 11, true], [10, 11, true], [8, 9, false]] as const) {
			const svg = renderSystemSlice(score, analyzed, OPTS, from, to, { finalBarline: last });
			expect(widthOf(svg)).toBeCloseTo(sliceWidth(score, from, to, OPTS, analyzed), 1);
		}
	});
	it('keeps the courtesy inside a justified width, and keeps a system that ends before an unchanged key as it was', async () => {
		const score = await fixture();
		const analyzed = analyse(score);
		const withCourtesy = renderSystemSlice(score, analyzed, OPTS, 0, 7, { finalBarline: false, targetWidth: 2600 });
		expect(widthOf(withCourtesy)).toBeCloseTo(2600, 0);
		expect(keyChanges(renderSystemSlice(score, analyzed, OPTS, 0, 2, { finalBarline: false }))).toEqual([]);
		// a system that ends just before bar 5 closes with a courtesy for it, and one that ends inside F major with none.
		expect(keyChanges(renderSystemSlice(score, analyzed, OPTS, 0, 3, { finalBarline: false }))).toEqual(['2>-1']);
		expect(keyChanges(renderSystemSlice(score, analyzed, OPTS, 4, 6, { finalBarline: false }))).toEqual([]);
	});
	it('draws no courtesy where the caller says the bar is held alone (the Loupe)', async () => {
		const score = await fixture();
		const svg = renderSystemSlice(score, analyse(score), OPTS, 7, 7, { finalBarline: false, courtesy: false });
		expect(keyChanges(svg)).toEqual([]);
		const withIt = renderSystemSlice(score, analyse(score), OPTS, 7, 7, { finalBarline: false });
		expect(keyChanges(withIt)).toEqual(['-1>2']);
	});
});

describe('a system that opens on a change (bars 9 to 12)', () => {
	it('shows the new key in its head, inherits no accidental, and draws key and meter together at bar 11 in the head\'s order', async () => {
		const score = await fixture();
		const svg = renderSystemSlice(score, analyse(score), OPTS, 8, 11, { finalBarline: true });
		expect(svg.match(/data-key-signature/g)).toHaveLength(2); // D major's head
		expect(keyChanges(svg)).toEqual(['2>3']); // bar 11, mid-system
		expect(glyphsIn(svg)).toHaveLength(3);
		const keyAt = svg.indexOf('data-key-change');
		const meterAt = svg.indexOf('data-meter="3/4"');
		expect(keyAt).toBeGreaterThan(0);
		expect(meterAt).toBeGreaterThan(keyAt);
		// F sharp at bar 9 is in the restored key (no sign); F natural at bar 10 needs one.
		const marked = markedNotes(svg);
		expect(marked).not.toContain('m8-0-1');
		expect(marked).toContain('m9-0-1');
	});
	it('a held bar (the Loupe\'s one-bar slice) shows the key in force at that bar in its head and draws no change of its own', async () => {
		const score = await fixture();
		const six = renderSystemSlice(score, analyse(score), OPTS, 5, 5, { finalBarline: false, courtesy: false });
		expect(six.match(/data-key-signature/g)).toHaveLength(1); // one flat
		expect(keyChanges(six)).toEqual([]);
		const two = renderSystemSlice(score, analyse(score), OPTS, 1, 1, { finalBarline: false, courtesy: false });
		expect(two.match(/data-key-signature/g)).toHaveLength(2);
	});
});

describe('a run of rests', () => {
	it('breaks at a change of key, so the change draws at its own barline', async () => {
		const score = await fixture();
		const silent: ParsedScore = { ...score, vocalLine: score.vocalLine.filter((e) => e.measureIndex < 3 || e.measureIndex > 6) };
		expect(tacetRuns(silent).map((r) => [r.fromMeasure, r.toMeasure])).toEqual([[3, 3], [4, 6]]);
	});
});

describe('transposition moves every signature', () => {
	it('moves a later key by the same displacement and judges each bar against its own key', async () => {
		const score = await fixture();
		const up = engraveInKey(score, { semitones: 2, fifths: 4 }); // D to E major
		expect(up.measures.map((m) => m.keySignature.fifths)).toEqual([4, 4, 4, 4, 1, 1, 1, 1, 4, 4, 5, 5]);
		expect(doubleAccidentalsDrawn(up)).toEqual({ flats: 0, sharps: 0 });
	});
});

describe('a song with no key change renders as it did before this lane', () => {
	// md5 of every system of each file, sliced three bars at a time, at natural width and justified, plus
	// `sliceWidth` of each slice, taken on `b1234cf4` (the cut) with the same script and then on this tree.
	const BASELINE: Record<string, string> = {
		'./fixtures/n188-markings.musicxml': 'b7369110ea82f72129a694d360f096a0',
		'./fixtures/row126-song1-bars-9-10.musicxml': 'eed12f3f9c6c60c2a1efb504d7143015',
		'../../../apps/web/src/lib/omr/fixtures/tch-1.musicxml': '3e523ca9bb240e13b9f3feb5682a793c',
		'../../../apps/web/src/lib/omr/fixtures/tch-2.musicxml': '09fa63801004d7396d57bd08161d33bf',
		'../../../apps/web/src/lib/omr/fixtures/barline-clean-4-4.musicxml': 'cb185997556cb0a3cd58f89cd78e3bef',
		'../../../apps/web/src/lib/omr/fixtures/sun3-2.musicxml': 'f416ffd70af742d1115703acd1f63844',
	};
	for (const [path, expected] of Object.entries(BASELINE)) {
		it(`${path.split('/').pop()} is byte-identical`, async () => {
			const score = await parse(path);
			const analyzed = analyse(score);
			const n = score.measures.length;
			let all = '';
			for (let from = 0; from < n; from += 3) {
				const to = Math.min(n - 1, from + 2);
				all += renderSystemSlice(score, analyzed, OPTS, from, to, { finalBarline: to === n - 1, targetWidth: 800 });
				all += renderSystemSlice(score, analyzed, OPTS, from, to, { finalBarline: to === n - 1 });
				all += `|w${sliceWidth(score, from, to, OPTS, analyzed)}`;
			}
			expect(createHash('md5').update(all).digest('hex')).toBe(expected);
		});
	}
	it('renders a whole score with one key unchanged by the unsliced path too', async () => {
		const score = await parse('./fixtures/n188-markings.musicxml');
		expect(keyChanges(renderAnalyzedStaff(score, analyse(score), OPTS))).toEqual([]);
	});
});
