/**
 * The count and the melisma evidence (`underlay-count.ts`; item 3 of the arrival seam, cloud-lane-88). Hand-built scores for the
 * gate, and the three kept fixtures through the real parser for the numbers the brief names: the Finale copy has 97 sung notes
 * against the engraved copy's 96, so it carries damage this lane cannot repair; the engraved copy comes out even with nothing left over.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, foldDictionMarks, type ParsedScore, type SyllableInfo, type VocalLineEvent } from '@ilya/score-parser';
import { parseXml } from './mini-dom';
import { foldVowelessSyllables } from './vowelless-fold';
import { countUnderlay } from './underlay-count';

const syl = (text: string): SyllableInfo => ({ id: `s-${text}`, text, type: 'whole', verseNumber: 1, wordContext: text }) as SyllableInfo;
const note = (id: string, text?: string, extra: Partial<VocalLineEvent> = {}): VocalLineEvent =>
	({ id, type: 'note', ...(text ? { syllable: syl(text) } : {}), ...extra }) as unknown as VocalLineEvent;
const scoreOf = (...events: VocalLineEvent[]): ParsedScore => ({ vocalLine: events }) as unknown as ParsedScore;
const count = (score: ParsedScore, extenders: string[] = []) => countUnderlay(foldVowelessSyllables(score), new Set(extenders));

describe('countUnderlay: hand-built', () => {
	it('is equal where one syllable sits on each sung note: nothing to record', () => {
		const c = count(scoreOf(note('a', 'ты'), note('b', 'мой'), note('c', 'дом')));
		expect(c.verses[0]).toMatchObject({ sung: 3, syllables: 3, agrees: true, evidenced: [], unexplained: [] });
		expect(c.damaged).toBe(false);
	});

	it('a note tied into the one before it is not a sung note, so a tie is evidence by construction', () => {
		const c = count(scoreOf(note('a', 'ты', { tied: { type: 'start' } } as Partial<VocalLineEvent>), note('b', undefined, { tied: { type: 'stop' } } as Partial<VocalLineEvent>), note('c', 'дом')));
		expect(c.verses[0]).toMatchObject({ sung: 2, syllables: 2, agrees: true });
	});

	it('an extender sustains the notes the parser named: they are evidence, and the count comes out even', () => {
		const c = count(scoreOf(note('a', 'ты'), note('b'), note('c', 'дом')), ['b']);
		expect(c.verses[0]).toMatchObject({ sung: 3, syllables: 2, evidenced: ['b'], unexplained: [], agrees: true });
		expect(c.damaged).toBe(false);
	});

	it('a note with no text and no evidence is NOT a melisma Ilya may claim: it is counted, and the count disagrees', () => {
		const c = count(scoreOf(note('a', 'ты'), note('b'), note('c', 'дом')));
		expect(c.verses[0]).toMatchObject({ sung: 3, syllables: 2, evidenced: [], unexplained: ['b'], agrees: false });
		expect(c.damaged).toBe(true);
	});

	it('a slur under the gate is evidence: the syllables come out even once its continuations are taken off', () => {
		const slurred = scoreOf(note('a', 'ты', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }), note('b', undefined, { slurs: [{ type: 'stop', number: 1 }] }), note('c', 'дом'));
		const c = count(slurred);
		expect(c.slursRead).toBe(true);
		expect(c.verses[0]).toMatchObject({ slurGate: 'passed', evidenced: ['b'], unexplained: [], agrees: true });
	});

	it('a slur NOT under the gate is a phrasing mark: no evidence, and the note is counted', () => {
		const slurred = scoreOf(note('a', 'ты', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }), note('b', 'мой', { slurs: [{ type: 'stop', number: 1 }] }), note('c', 'дом'));
		const c = count(slurred);
		expect(c.verses[0]).toMatchObject({ slurGate: 'failed', evidenced: [], agrees: true });
	});

	it('says plainly where no slur could be read (an MNX file has none): slursRead is false, so zero slurs is not agreement', () => {
		expect(count(scoreOf(note('a', 'ты'), note('b'))).slursRead).toBe(false);
	});

	it('counts text with no note and a fragment with no host as damage, in either direction', () => {
		const over = count(scoreOf(note('a', 'тени'), note('b', 'я')));
		expect(over.verses[0].overflow.map((p) => p.text)).toEqual(['я']);
		expect(over.damaged).toBe(true);
		const orphan = count(scoreOf(note('a', 'ж'), note('b', 'мир')));
		expect(orphan.verses[0].orphans).toHaveLength(1);
		expect(orphan.damaged).toBe(true);
	});

	it('runs on a Cyrillic verse only: an IPA verse is not counted', () => {
		expect(count(scoreOf(note('a', 'ˈko'), note('b', 'mnɑ'))).verses).toEqual([]);
	});
});

describe('countUnderlay: the kept fixtures, through the real parser', () => {
	const here = (name: string) => fileURLToPath(new URL(name, import.meta.url));
	const counted = async (path: string) => {
		const result = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(readFileSync(path, 'utf8')) as unknown as Document, sourcePath: 'x.musicxml' } as never);
		const extenders = new Set(result.warnings.find((w) => w.code === 'extender-notes')?.eventIds ?? []);
		return countUnderlay(foldVowelessSyllables(foldDictionMarks(result.score).score), extenders);
	};

	it('the Finale copy as Finale printed it: 97 sung notes, 96 syllables, damage this lane cannot repair, the last note recorded', async () => {
		const c = await counted(here('./fixtures/sunless-01-finale-lone-v.musicxml'));
		expect(c.verses).toHaveLength(1);
		expect(c.verses[0]).toMatchObject({ verse: 1, sung: 97, syllables: 96, agrees: false });
		expect(c.verses[0].vacated.map((p) => p.text)).toEqual(['я.']);
		expect(c.verses[0].overflow).toEqual([]);
		expect(c.damaged).toBe(true);
	});

	it('the engraved copy against Dann\'s print: 96 syllables on 96 notes, nothing divided, nothing fused, nothing recorded', async () => {
		const c = await counted(here('./fixtures/sunless-01-engraved.musicxml'));
		expect(c.verses[0]).toMatchObject({ sung: 96, syllables: 96, agrees: true, divided: 0, vacated: [], overflow: [], orphans: [], undivided: [], evidenced: [], unexplained: [] });
		expect(c.damaged).toBe(false);
	});

	it('the engraved copy leaves the score BY REFERENCE: dividing and fusing do not touch a correct file', async () => {
		const result = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(readFileSync(here('./fixtures/sunless-01-engraved.musicxml'), 'utf8')) as unknown as Document, sourcePath: 'x.musicxml' } as never);
		const marked = foldDictionMarks(result.score).score;
		expect(foldVowelessSyllables(marked).score).toBe(marked);
	});
});
