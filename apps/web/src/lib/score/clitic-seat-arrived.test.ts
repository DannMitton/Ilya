/**
 * Step 0 of the arrival seam (cloud-lane-88), measured: once the vowel test has dealt a file on arrival, `findCliticFolds` has
 * nothing left to find in it, because its first condition (`clitic-seat.ts`, `foldAt`: one cell, no vowel) is a lone vowelless
 * cell and the re-deal leaves none. Its reach on the file AS FINALE PRINTED IT (unarrived) is what the control below pins, so the
 * zero is a result and not an accident. Nothing in `clitic-seat.ts` is deleted by this lane; that is a later tier 1 lane.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { ingestScoreFile } from './ingestion/ingest';
import { findCliticFolds } from './clitic-seat';

const text = readFileSync(fileURLToPath(new URL('./ingestion/fixtures/sunless-01-finale-lone-v.musicxml', import.meta.url)), 'utf8');
const musicxmlParser: ScoreParser = { canParse: () => true, parse: (i) => new MusicXmlScoreParser().parse({ ...i, data: parseXml(i.data as string) as unknown as Document }) };

describe('findCliticFolds, before and after arrival', () => {
	it('finds the lone «в» in the file as Finale printed it, and finds nothing in the file after arrival', async () => {
		const raw = (await musicxmlParser.parse({ format: 'musicxml', data: text, sourcePath: 'x.musicxml' })).score;
		expect(findCliticFolds(raw, 1).length).toBeGreaterThan(0);
		const out = await ingestScoreFile(new File([text], 'f.musicxml'), { scoreReader: { convert: async () => '', dispose: () => {} } as never, musicxmlParser });
		if (!out.ok) throw new Error('ingest failed');
		expect(findCliticFolds(out.ingested.result.score, 1)).toEqual([]);
	});
});
