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
import { t } from '$lib/i18n';

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

	it('n188-markings: «жи» + «знь» sing «жизнь» on «жи»\'s note; its slur gate fails, so it carries ONE record, and a per-note abstention only for the two notes Ilya emptied (round 3 ruling, round 4 step 2)', async () => {
		const { score, warnings } = await arrive('n188.musicxml', parserFixture('n188-markings.musicxml'));
		const texts = score.vocalLine.map((e) => e.syllable?.text ?? null);
		expect(texts).toContain('жизнь');
		expect(texts).not.toContain('знь');
		expect(warnings.filter((x) => x.code === 'slur-evidence-unchecked')).toHaveLength(1);
		const unchecked = warnings.find((x) => x.code === 'slur-evidence-unchecked')!;
		expect(unchecked.verse).toBe(1);
		expect(unchecked.message).toBe(t('upload.banner.slurEvidenceUnchecked', 'en').replace('{n}', String(unchecked.counts![0])).replace('{m}', String(unchecked.counts![1])));
		// Round 4, step 2: the notes Ilya itself emptied keep their abstention; the unexplained ones (the print's own empty notes) do not.
		expect(score.dictionMarks?.vacatedTailEventIds ?? []).toEqual([{ eventId: 'm7-0-1', verseNumber: 1 }, { eventId: 'm7-1-2', verseNumber: 1 }]);
		expect(warnings.find((x) => x.code === 'underlay-count')?.eventIds).toEqual(['m7-0-1', 'm7-1-2']);
	});

	it('round 4, step 2: in a failed verse the note Ilya emptied takes no sustained vowel, and the print\'s own empty note still does (a fused «жи» + «знь», joined by U+00A0, no rest before the tail)', async () => {
		const note = (step: string, word: string | null, slur?: string) => `<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type>${slur ? `<notations><slur type="${slur}" number="1"/></notations>` : ''}${word ? `<lyric number="1"><syllabic>single</syllabic><text>${word}</text></lyric>` : ''}</note>`;
		const xml = `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1"><measure number="1"><attributes><divisions>2</divisions><key><fifths>0</fifths></key><time><beats>5</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${note('C', 'жи', 'start')}${note('D', 'знь', 'stop')}${note('E', 'мо', 'start')}${note('F', 'ря', 'stop')}${note('G', 'дом')}</measure></part></score-partwise>`;
		const { score, warnings } = await arrive('b2.musicxml', xml);
		expect(score.vocalLine.map((e) => e.syllable?.text ?? null)).toEqual(['жи\u00a0знь', 'мо', 'ря', 'дом', null]);
		expect(warnings.filter((x) => x.code === 'slur-evidence-unchecked')).toHaveLength(1);
		const emptied = score.vocalLine[4];
		expect(score.dictionMarks?.vacatedTailEventIds).toEqual([{ eventId: emptied.id, verseNumber: 1 }]);
		expect(buildUnderlayResolvers(score, 1).vowel(emptied)).toBeUndefined();
		// Control: the same score with the record taken off sustains «о» from «дом» onto the note Ilya emptied.
		const bare = { ...score, dictionMarks: { breaks: [], vacatedTailEventIds: [] } };
		expect(buildUnderlayResolvers(bare, 1).vowel(emptied)).toBeDefined();
	});

	it('a file whose notes have gaps the print does not explain (underlay-gap.musicxml) is counted and recorded, not repaired and not read as a melisma', async () => {
		const { score, warnings } = await arrive('gap.musicxml', parserFixture('underlay-gap.musicxml'));
		const w = warnings.find((x) => x.code === 'underlay-count');
		expect(w?.eventIds?.length).toBe(2);
		for (const id of w!.eventIds!) expect(buildUnderlayResolvers(score, 1).vowel(score.vocalLine.find((e) => e.id === id)!)).toBeUndefined();
	});
});
