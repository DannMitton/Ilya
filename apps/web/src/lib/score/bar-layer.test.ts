import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { withCorrection, type CorrectionMap } from './correction';
import { BarLayer } from './bar-layer';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../omr/fixtures/${name}.musicxml`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: `${name}.musicxml` })).score;
}

describe('BarLayer', () => {
	it('with no marks it is the corrected line over the read, and the identity map', async () => {
		const score = await load('barline-fused');
		const layer = new BarLayer({ score: () => score, corrections: () => ({}) });
		expect(layer.line).toBe(score.vocalLine);
		expect(layer.score).toBe(score);
		expect(layer.bars.identity).toBe(true);
		expect(layer.labelOf(3)).toBe('4');
		expect(layer.readingLabelOf(3)).toBe('4');
	});
	it('with a barline mark the song has one more bar and the strip is keyed to the reading bar', async () => {
		const score = await load('barline-fused');
		const opener = score.vocalLine.filter((e) => e.measureIndex === 3)[4];
		const map: CorrectionMap = withCorrection({}, opener.id, { barline: 'before' });
		const layer = new BarLayer({ score: () => score, corrections: () => map });
		expect(layer.score?.measures).toHaveLength(8);
		expect(layer.line.find((e) => e.id === opener.id)?.measureIndex).toBe(4);
		expect(layer.preLine.find((e) => e.id === opener.id)?.measureIndex).toBe(3);
		expect(layer.measureAt(4)?.number).toBe('5');
		// both halves of the divided bar show the one strip: reading bar 4
		expect(layer.readingLabelOf(3)).toBe('4');
		expect(layer.readingLabelOf(4)).toBe('4');
		expect(layer.readingLabelOf(5)).toBe('5');
	});
	it('memoises on the identity of its inputs', async () => {
		const score = await load('barline-fused');
		const opener = score.vocalLine.filter((e) => e.measureIndex === 3)[4];
		const map = withCorrection({}, opener.id, { barline: 'before' });
		const layer = new BarLayer({ score: () => score, corrections: () => map });
		expect(layer.line).toBe(layer.line);
	});
	it('with no score it still shows an entered entry, as the page did', () => {
		const map: CorrectionMap = { 'hand:1': { entered: { after: null }, base: 'quarter', dots: 0, type: 'rest' } };
		const layer = new BarLayer({ score: () => null, corrections: () => map });
		expect(layer.line).toHaveLength(1);
		expect(layer.score).toBeNull();
	});
});

describe('BarLayer, the page\'s bar arithmetic on the fused fixture (QUEUE row 138, B2)', () => {
	it('one barline gives the bar count the print has, the banner\'s list and MELODY\'s numbers agree, and both halves show one strip', async () => {
		const score = await load('barline-fused');
		const opener = score.vocalLine.filter((e) => e.measureIndex === 3)[4];
		const layer = new BarLayer({ score: () => score, corrections: () => withCorrection({}, opener.id, { barline: 'before' }) });
		// the print has 8 bars (the fused bar is two printed ones): the song now has 8 too, each a song bar
		expect(layer.score?.measures.map((m) => m.number)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
		// the Loupe's label by number, for the strip
		expect(layer.readingLabelOfLabel('4')).toBe('4');
		expect(layer.readingLabelOfLabel('5')).toBe('4');
		expect(layer.readingLabelOfLabel('6')).toBe('5');
		expect(layer.readingLabelOfLabel('8')).toBe('7');
		// the held bar's number is the layer's own
		expect(layer.labelOf(4)).toBe('5');
	});
	it('with no mark every label is itself', async () => {
		const score = await load('barline-fused');
		const layer = new BarLayer({ score: () => score, corrections: () => ({}) });
		expect(layer.readingLabelOfLabel('5')).toBe('5');
	});
});
