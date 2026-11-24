/**
 * Item 4 of the arrival seam (cloud-lane-88): what is left over is RECORDED, never covered. The record rides on the score as
 * the `#` fold's does (`dictionMarks.vacatedTailEventIds`), so the resolver abstains on it instead of sustaining the last
 * vowel across a note that has no syllable; and it travels as an `underlay-count` warning with its bars and its note ids.
 * No string a singer reads is added here.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore, type ParseWarning, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from './mini-dom';
import { ingestScoreFile, type IngestDeps } from './ingest';
import type { ScoreReader } from '$lib/reader/score-reader';
import { buildUnderlayResolvers } from '$lib/score/vowel-resolver';

const fixture = (name: string): string => readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url)), 'utf8');
const parserFixture = (name: string): string => readFileSync(fileURLToPath(new URL(`../../../../../../packages/score-parser/src/fixtures/${name}`, import.meta.url)), 'utf8');

const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const inertReader: ScoreReader = { convert: async () => { throw new Error('not reached'); }, dispose: () => {} };
const deps: IngestDeps = { scoreReader: inertReader, musicxmlParser };

async function arrive(name: string, text: string): Promise<{ score: ParsedScore; warnings: ParseWarning[] }> {
	const out = await ingestScoreFile(new File([text], name), deps);
	if (!out.ok) throw new Error(`ingest failed: ${JSON.stringify(out.error)}`);
	return { score: out.ingested.result.score, warnings: out.ingested.result.warnings };
}

describe('the leftover is recorded (item 4)', () => {
	it('the Finale copy: 97 sung notes against 96 syllables is damage Ilya does not repair, recorded with its bar and its note', async () => {
		const { score, warnings } = await arrive('finale.musicxml', fixture('sunless-01-finale-lone-v.musicxml'));
		const w = warnings.find((x) => x.code === 'underlay-count');
		expect(w).toBeDefined();
		expect(w?.message).toMatch(/97 sung note\(s\), 96 syllable\(s\)/);
		expect(w?.eventIds).toEqual(['m17-5-8']);
		// Fix 1 (round 2): a vacated note is also a textless one, and is counted once.
		expect(w?.message).toMatch(/; 1 note\(s\) with no syllable in bar\(s\) 18\./);
		// The song's own bar number: the event id counts bars from 0 (`m17`), the print's number is 18.
		expect(score.measures[17].number).toBe('18');
		expect(w?.bars).toEqual([[18, 18]]);
		expect(score.dictionMarks?.vacatedTailEventIds).toContainEqual({ eventId: 'm17-5-8', verseNumber: 1 });
		// The `#` fold is untouched: its two marks are in the IPA verse, folded by `foldDictionMarks`, and the record keeps them.
		expect(score.dictionMarks?.breaks).toHaveLength(2);
		expect(score.dictionMarks?.breaks.every((b) => b.verseNumber === 2)).toBe(true);
	});

	it('the resolver returns NO vowel on the leftover note, and would sustain one there without the record', async () => {
		const { score } = await arrive('finale.musicxml', fixture('sunless-01-finale-lone-v.musicxml'));
		const leftover = score.vocalLine.find((e) => e.id === 'm17-5-8')!;
		// The note holds no verse-1 text (it may still hold the IPA verse's).
		expect(leftover.syllable?.versesInfo?.some((v) => v.verseNumber === 1) ?? leftover.syllable?.verseNumber === 1).toBe(false);
		expect(buildUnderlayResolvers(score, 1).vowel(leftover)).toBeUndefined();
		// Control: the same score with the verse-1 entry of the record taken off. The resolver then reads the empty note as a melisma.
		const bare = { ...score, dictionMarks: { breaks: score.dictionMarks!.breaks, vacatedTailEventIds: score.dictionMarks!.vacatedTailEventIds.filter((t) => t.verseNumber !== 1) } };
		expect(buildUnderlayResolvers(bare, 1).vowel(leftover)).toBeDefined();
	});

	it('the engraved copy: 96 syllables on 96 notes, nothing recorded, no warning, no record on the score', async () => {
		const { score, warnings } = await arrive('engraved.musicxml', fixture('sunless-01-engraved.musicxml'));
		expect(warnings.some((x) => x.code === 'underlay-count')).toBe(false);
		expect(score.dictionMarks?.vacatedTailEventIds.filter((t) => t.verseNumber === 1) ?? []).toEqual([]);
	});

	it('n188-markings: «жи» + «знь» sing «жизнь» on «жи»\'s note, and the leftover at the end is recorded with the notes the slurs did not account for', async () => {
		const { score, warnings } = await arrive('n188.musicxml', parserFixture('n188-markings.musicxml'));
		const texts = score.vocalLine.map((e) => e.syllable?.text ?? null);
		expect(texts).toContain('жизнь');
		expect(texts).not.toContain('знь');
		const w = warnings.find((x) => x.code === 'underlay-count');
		expect(w?.eventIds?.length).toBeGreaterThan(0);
		for (const id of w!.eventIds!) {
			const ev = score.vocalLine.find((e) => e.id === id)!;
			expect(buildUnderlayResolvers(score, 1).vowel(ev)).toBeUndefined();
		}
	});

	it('a file whose notes have gaps the print does not explain (underlay-gap.musicxml) is counted and recorded, not repaired and not read as a melisma', async () => {
		const { score, warnings } = await arrive('gap.musicxml', parserFixture('underlay-gap.musicxml'));
		const w = warnings.find((x) => x.code === 'underlay-count');
		expect(w?.eventIds?.length).toBe(2);
		for (const id of w!.eventIds!) expect(buildUnderlayResolvers(score, 1).vowel(score.vocalLine.find((e) => e.id === id)!)).toBeUndefined();
	});
});
