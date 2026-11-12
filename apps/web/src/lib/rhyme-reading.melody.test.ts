/**
 * Text and MELODY agree on a seated song (rhyme lane, step 3; Fable r1, finding 6). MELODY and INSIGHTS do not run the
 * pipeline on the line breaks: they transcribe the score's words as one line, and take Lyrics' own transcription word by
 * word where the words align (`underlay-donor.ts`, `vowel-resolver.ts`). So the rhyme reading, found in Lyrics, reaches the
 * notes through the donor, and where no transcription is passed the notes keep the stage reading.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './score/ingestion/mini-dom';
import { buildUnderlayResolvers, vowelOfSyllable } from './score/vowel-resolver';
import { loadRealDictionary } from './score/row108.support';
import { processText } from '$lib/pipeline';

beforeAll(() => loadRealDictionary());

type Syl = [text: string, syllabic: 'single' | 'begin' | 'middle' | 'end'];

/** A one-part score, one syllable per quarter note, lyric verse 1 with the syllabic marks that join the syllables into words. */
async function seat(syllables: Syl[]): Promise<ParsedScore> {
	const notes = syllables.map(([text, syllabic]) => `<note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type><lyric number="1"><syllabic>${syllabic}</syllabic><text>${text}</text></lyric></note>`);
	const measures = Array.from({ length: Math.ceil(notes.length / 4) }, (_, i) => {
		const attrs = i === 0 ? '<attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>' : '';
		return `<measure number="${i + 1}">${attrs}${notes.slice(i * 4, i * 4 + 4).join('')}</measure>`;
	}).join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${measures}</part></score-partwise>`;
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'rhyme.musicxml' })).score;
}

const SONG: Syl[] = [['глу', 'begin'], ['бо', 'middle'], ['кой', 'end'], ['вы', 'begin'], ['со', 'middle'], ['кий', 'end']];
const POEM = 'глубокой\nвысокий';

/** The syllable IPA under each note, in order, as MELODY prints it. */
function underlay(score: ParsedScore, transcribedLines?: ReturnType<typeof processText>): string[] {
	const r = buildUnderlayResolvers(score, 1, transcribedLines ? { transcribedLines } : {});
	return score.vocalLine.map((e) => r.ipa(e)).filter((s): s is string => s !== undefined);
}

describe('the rhyme reading in MELODY', () => {
	it('with Lyrics\' transcription, the last note of «высокий» reads [kʌj], as Text does', async () => {
		const lines = processText(POEM);
		const text = lines[1].words[0].syllables.map((s) => s.ipa);
		expect(text[2]).toBe('kʌj');
		const melody = underlay(await seat(SONG), lines);
		expect(melody).toHaveLength(6);
		expect(melody[5]).toBe(text[2]);
		expect(melody[2]).toBe(lines[0].words[0].syllables[2].ipa);
	});

	it('the vowel INSIGHTS tallies for that note is [ʌ], where the stage reading counted [ɨ]', () => {
		expect(vowelOfSyllable(processText(POEM)[1].words[0], 2)).toBe('ʌ');
		expect(vowelOfSyllable(processText('глубокой высокий')[0].words[1], 2)).toBe('ɨ');
	});

	it('with no transcription passed, the score\'s own one-line run keeps the stage reading', async () => {
		const melody = underlay(await seat(SONG));
		expect(melody[5]).toBe('kɨj');
	});

	it('the pair typed on one line in Lyrics keeps the stage reading in MELODY too', async () => {
		const melody = underlay(await seat(SONG), processText('глубокой высокий'));
		expect(melody[5]).toBe('kɨj');
	});
});
