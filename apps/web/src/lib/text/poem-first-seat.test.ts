/**
 * poem-first-seat.test.ts: row 109 B, test f. A score with NO words onto an
 * empty Lyrics, with a Poem: Lyrics takes the poem's text and the no-lyrics
 * seat (N.55b's `firstPass`, reached through `mergeOnUpload`) runs on it. The
 * fixture is built here with the shape of `no-lyrics-control.musicxml`
 * (C4 D4 E4 F4 quarters, G4 half, a half rest; «Я тебя любил»), since the cloud
 * session cannot read `~/Downloads`.
 */
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { buildSlotQueue, mergeOnUpload, syllableTargetIds } from '$lib/score/pairings';
import { shouldSeatFirstTranscription } from '$lib/score/first-seat';
import { lyricsTakesPoem } from './witness-lines';

const note = (step: string, type: string, duration: number) =>
	`<note><pitch><step>${step}</step><octave>4</octave></pitch><duration>${duration}</duration><type>${type}</type></note>`;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
<part id="P1"><measure number="1"><attributes><divisions>2</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
${note('C', 'quarter', 2)}${note('D', 'quarter', 2)}${note('E', 'quarter', 2)}${note('F', 'quarter', 2)}</measure>
<measure number="2">${note('G', 'half', 4)}<note><rest/><duration>4</duration><type>half</type></note></measure></part></score-partwise>`;

async function score() {
	return (
		await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'no-lyrics-control.musicxml' })
	).score;
}

describe('a wordless score onto an empty Lyrics with a Poem', () => {
	it('Lyrics takes the poem, and 5 of 5 notes seat', async () => {
		const parsed = await score();
		const poem = 'Я тебя любил';
		expect(lyricsTakesPoem(true, '', poem, 0)).toBe(true);
		const lines = processText(poem, { language: 'en' });
		const ids = parsed.vocalLine.filter((e) => e.type !== 'rest').map((e) => e.id);
		const merged = mergeOnUpload({}, ids, syllableTargetIds(parsed.vocalLine), buildSlotQueue(lines), true);
		expect(ids).toHaveLength(5);
		expect(Object.values(merged.map).filter((p) => p.kind === 'syllable')).toHaveLength(5);
	});

	it('with the dictionary still loading nothing seats at arrival, and the first transcription seats all 5', async () => {
		const parsed = await score();
		const ids = parsed.vocalLine.filter((e) => e.type !== 'rest').map((e) => e.id);
		const targets = syllableTargetIds(parsed.vocalLine);
		const early = mergeOnUpload({}, ids, targets, buildSlotQueue([]), true);
		expect(Object.keys(early.map)).toHaveLength(0);
		expect(shouldSeatFirstTranscription(early.map, true)).toBe(true);
		const later = mergeOnUpload(early.map, ids, targets, buildSlotQueue(processText('Я тебя любил', { language: 'en' })), true);
		expect(Object.values(later.map).filter((p) => p.kind === 'syllable')).toHaveLength(5);
	});

	it('does not take the poem onto Lyrics the singer wrote, or onto a score that has words', async () => {
		expect(lyricsTakesPoem(true, 'Мои слова', 'Я тебя любил', 0)).toBe(false);
		expect(lyricsTakesPoem(false, '', 'Я тебя любил', 0)).toBe(false);
	});
});
