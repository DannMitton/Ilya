/**
 * Step 1 of the key change and grace note lane (N.192, N.187): the two hand
 * written fixtures parse as the brief says, and today's parser reads them the
 * way it always has (every grace note is left out of the vocal line).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import type { ParseResult } from './types';

async function parseFixture(name: string): Promise<ParseResult> {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never);
}

describe('key-changes.musicxml', () => {
	it('is D major, then F major at bar 5, D major at bar 9, A major in 3/4 at bar 11', async () => {
		const { score, errors } = await parseFixture('key-changes.musicxml');
		expect(errors.filter((e) => e.fatal)).toEqual([]);
		expect(score.measures).toHaveLength(12);
		expect(score.keySignatures.map((k) => [k.measureIndex, k.signature.fifths])).toEqual([[0, 2], [4, -1], [8, 2], [10, 3]]);
		const fifths = score.measures.map((m) => m.keySignature.fifths);
		expect(fifths).toEqual([2, 2, 2, 2, -1, -1, -1, -1, 2, 2, 3, 3]);
		expect(score.measures[10].timeSignature).toMatchObject({ beats: 3, beatType: 4 });
		expect(score.vocalLine).toHaveLength(41);
		expect(score.vocalLine.every((e) => e.type === 'note' && e.syllable !== undefined)).toBe(true);
	});
});

describe('grace-notes.musicxml', () => {
	it('parses with the grace notes still left out of the vocal line, as before step 2', async () => {
		const { score, errors, warnings } = await parseFixture('grace-notes.musicxml');
		expect(errors.filter((e) => e.fatal)).toEqual([]);
		expect(score.measures).toHaveLength(10);
		expect(score.vocalLine).toHaveLength(27);
		expect(warnings.filter((w) => w.message.startsWith('grace note skipped'))).toHaveLength(11);
		// no bar is reported short or over: a grace note takes no time.
		expect(warnings.filter((w) => w.code === 'measure-duration-mismatch')).toEqual([]);
	});
});
