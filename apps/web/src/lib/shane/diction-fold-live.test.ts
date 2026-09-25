/**
 * N.171's proof on the live path: the `#` fold runs at arrival
 * (`ingestScoreFile`), and what every surface reads afterwards is the repaired
 * underlay.
 *
 * Two scores. The first is Dann's own engraving of Sunless no. 1, the app's
 * existing fixture, whose two marks sit in verse 2 (his IPA line) and never in
 * the sung Cyrillic verse. The second is the Sunless no. 4 shape quoted in
 * `packages/score-parser/src/diction-marks.ts:25-30`, notes 69 to 73, written
 * as a small MusicXML file with the mark in the SUNG verse, which is the case
 * the fold exists to repair.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps } from './ingestion/ingest';
import type { ScoreReader } from './engine/score-reader';
import { buildUnderlayResolvers, collectScoreWords } from './vowel-resolver';
import { scoreMetrics } from './score-metrics';

const sunless01 = readFileSync(
	fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
	'utf8',
);

/** The real MusicXML parser, fed through the sandbox's DOM (it has no `DOMParser`). */
const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) =>
		new MusicXmlScoreParser().parse({
			...input,
			data: parseXml(input.data as string) as unknown as Document,
		}),
};

const inertReader: ScoreReader = {
	convert: async () => {
		throw new Error('not reached');
	},
	dispose: () => {},
};

const deps: IngestDeps = { scoreReader: inertReader, musicxmlParser };

async function ingest(name: string, text: string): Promise<ParsedScore> {
	const out = await ingestScoreFile(new File([text], name), deps);
	if (!out.ok) throw new Error(`ingest failed: ${JSON.stringify(out.error)}`);
	return out.ingested.result.score;
}

async function parseUnfolded(text: string): Promise<ParsedScore> {
	return (await musicxmlParser.parse({ format: 'musicxml', data: text, sourcePath: 'x.musicxml' })).score;
}

const verseText = (score: ParsedScore, id: string, verse: number): string | undefined => {
	const syl = score.vocalLine.find((e) => e.id === id)?.syllable;
	if (!syl) return undefined;
	if (syl.versesInfo?.length) return syl.versesInfo.find((v) => v.verseNumber === verse)?.text;
	return syl.verseNumber === verse ? syl.text : undefined;
};

describe('N.171 the fold at arrival, on the engraved Sunless no. 1', () => {
	it('folds both marks in verse 2 onto the syllable before them', async () => {
		const score = await ingest('sunless-01-engraved.musicxml', sunless01);
		expect(score.dictionMarks?.breaks).toHaveLength(2);
		expect(score.dictionMarks?.breaks.every((b) => b.verseNumber === 2)).toBe(true);
		for (const b of score.dictionMarks!.breaks) {
			// Read off the file: each mark follows IPA `jɑ` (for «я,») in verse 2's
			// own sequence. The fold works in underlay order, not page order
			// (`diction-marks.test.ts`, "closes by exactly one note per mark"), and
			// this file's verse 2 fuses «в бью» into one syllable at bar 7, so the
			// second anchor is not the «я,» note. Only verse 2 is affected by that.
			expect(verseText(score, b.afterEventId!, 2)).toBe('jɑ#');
		}
		const marks = score.vocalLine.filter((e) => e.syllable?.versesInfo?.some((v) => v.text === '#'));
		expect(marks).toHaveLength(0);
	});

	it('leaves the sung verse exactly as the file prints it', async () => {
		const folded = await ingest('sunless-01-engraved.musicxml', sunless01);
		const raw = await parseUnfolded(sunless01);
		expect(collectScoreWords(folded, 1)).toEqual(collectScoreWords(raw, 1));
		expect(folded.vocalLine.map((e) => e.syllable?.text)).toEqual(raw.vocalLine.map((e) => e.syllable?.text));
	});
});

/** One quarter note in octave 3 with a verse-1 lyric (or none). Distinct pitches, so a vowel moved between notes shows. */
const note = (step: string, text?: string, syllabic = 'single') =>
	`<note><pitch><step>${step}</step><octave>3</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>${
		text === undefined ? '' : `<lyric number="1"><syllabic>${syllabic}</syllabic><text>${text}</text></lyric>`
	}</note>`;

/**
 * Sunless no. 4, «я на правду», with the mark in the sung verse: я, #, на,
 * прав-ду, and the note the verse then no longer reaches. Five notes in one
 * 5/4 bar, standing for notes 69 to 73.
 */
const sunless04Shape = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
<part id="P1"><measure number="1"><attributes><divisions>1</divisions><time><beats>5</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
${note('C', 'я')}${note('D', '#')}${note('E', 'на')}${note('F', 'прав', 'begin')}${note('G', 'ду', 'end')}
</measure></part></score-partwise>`;

describe('N.171 the fold at arrival, on the Sunless no. 4 shape in the sung verse', () => {
	it('puts на, прав, and ду each on its own note, and the mark after я', async () => {
		const score = await ingest('sunless-04-shape.musicxml', sunless04Shape);
		const texts = score.vocalLine.map((e) => e.syllable?.text);
		expect(texts).toEqual(['я#', 'на', 'прав', 'ду', undefined]);
		const cells = collectScoreWords(score, 1).flatMap((w) => w.cells);
		expect(cells.map((c) => c.text)).toEqual(['я#', 'на', 'прав', 'ду']);
		expect(cells.map((c) => c.eventId)).toEqual(score.vocalLine.slice(0, 4).map((e) => e.id));
	});

	it('abstains on the vacated note instead of sustaining ду across it', async () => {
		const score = await ingest('sunless-04-shape.musicxml', sunless04Shape);
		const [ya, na, prav, du, vacated] = score.vocalLine;
		expect(score.dictionMarks?.vacatedTailEventIds).toEqual([{ eventId: vacated.id, verseNumber: 1 }]);
		const { vowel, ipa } = buildUnderlayResolvers(score, 1);
		for (const ev of [ya, na, prav, du]) expect(vowel(ev)).toBeDefined();
		expect(vowel(du)).toBe('u');
		expect(vowel(vacated)).toBeUndefined();
		expect(ipa(vacated)).toBeUndefined();
	});

	it('before the fold, the same file put every syllable after the mark one note late', async () => {
		const raw = await parseUnfolded(sunless04Shape);
		expect(raw.vocalLine.map((e) => e.syllable?.text)).toEqual(['я', '#', 'на', 'прав', 'ду']);
	});
});

/**
 * Dann, 2026-09-24 21:59: "Just be sure that the newly situated octothorpes
 * have zero effect on correct duration counts or other calculations."
 *
 * Everything `scoreMetrics` returns, computed on the file as parsed and on the
 * file as it arrives folded, each with its own vowel resolver, then compared
 * whole. Only the per-vowel attribution may differ: `byVowel`,
 * `byPitchByVowel`, and the two coverage counts that say how many notes got a
 * vowel. A tempo override is set so `seconds` and `foldCycles` are computed
 * rather than absent, and the comparison is also made with the score's own
 * tempo.
 */
describe('N.171 the mark carries no duration and changes no calculation', () => {
	const withoutVowels = (score: ParsedScore, tempo?: { overrideBpm: number }) => {
		const m = scoreMetrics(score, { vowelForEvent: buildUnderlayResolvers(score, 1).vowel, ...(tempo ? { tempo } : {}) });
		const { byVowel: _v, byPitchByVowel: _pv, coverage, ...phonation } = m.phonation;
		const { notesWithVowel: _w, notesWithoutVowel: _wo, ...counts } = coverage;
		return { ...m, phonation: { ...phonation, coverage: counts } };
	};
	const notes = (score: ParsedScore) =>
		score.vocalLine.map((e) => ({ id: e.id, type: e.type, pitch: e.pitch, duration: e.duration, tied: e.tied, at: e.rhythmicPosition }));

	it('POSITIVE CONTROL: the per-vowel attribution does move where the mark sat in the sung verse', async () => {
		const perVowel = (score: ParsedScore) =>
			scoreMetrics(score, { vowelForEvent: buildUnderlayResolvers(score, 1).vowel }).phonation.byPitchByVowel;
		const before = perVowel(await parseUnfolded(sunless04Shape));
		const after = perVowel(await ingest('sunless-04-shape.musicxml', sunless04Shape));
		expect(after).not.toEqual(before);
	});

	for (const [name, text] of [
		['sunless-01-engraved.musicxml', sunless01],
		['sunless-04-shape.musicxml', sunless04Shape],
	] as const) {
		it(`${name}: same notes, same durations, same totals`, async () => {
			const raw = await parseUnfolded(text);
			const folded = await ingest(name, text);
			expect(folded.dictionMarks?.breaks.length).toBeGreaterThan(0); // the fold did run
			expect(notes(folded)).toEqual(notes(raw));
			for (const tempo of [undefined, { overrideBpm: 60 }]) {
				const before = withoutVowels(raw, tempo);
				const after = withoutVowels(folded, tempo);
				expect(after).toEqual(before);
				if (tempo) {
					expect(after.seconds).toBeDefined();
					expect(after.foldCycles).toBeDefined();
				}
				expect(after.tessitura).toBeDefined();
			}
		});
	}
});
