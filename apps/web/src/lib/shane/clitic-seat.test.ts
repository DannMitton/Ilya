/**
 * N.111's proof, on the file that numbered the item.
 *
 * The fixture is Dann's own engraving of Musorgsky's *Without Sun* no. 1,
 * copied verbatim from `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls
 * (engraved).musicxml` into the app's existing fixture directory. It is not a
 * synthetic case: bar 8 seats «в» alone on the E quarter because Finale needs a
 * note per syllable, and every syllable after it is one note late.
 *
 * Every expectation here is read off the PRINTED score (photo,
 * `docs/sessions/n111-sunless-01-p63_2026-09-03.jpg`, and the brief's §2, which
 * quotes it), not off this mechanism's own output. That is the standing
 * condition on an acceptance test in this repository.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { findCliticFolds, applyCliticSeat } from './clitic-seat';
import { collectScoreWords } from './vowel-resolver';

const NBSP = '\u00A0';

const xml = readFileSync(
	fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
	'utf8',
);

async function parse(source: string): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(source) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	return res.score;
}

/** The verse-1 cells in vocal-line order: what the FILE prints under each note. */
function cellsOf(score: ParsedScore): Array<{ eventId: string; text: string }> {
	return collectScoreWords(score, 1).flatMap((w) => w.cells);
}

/** The text each note carries once `map` is laid over the file's own cells. */
function shown(score: ParsedScore, map: Record<string, { kind: string; cyrillic?: string }>) {
	return cellsOf(score).map((c) => {
		const p = map[c.eventId];
		return p && p.kind === 'syllable' ? (p.cyrillic ?? '') : c.text;
	});
}

describe('N.111 the clitic seat, on the engraved Sunless no. 1', () => {
	it('finds exactly one fold, and it is «в» before «бью» in bar 8', async () => {
		const score = await parse(xml);
		const folds = findCliticFolds(score);
		expect(folds).toHaveLength(1);
		const fold = folds[0];
		expect(fold.cliticText).toBe('в');
		expect(fold.hostText).toBe('бью');
		expect(fold.fusedText).toBe('в' + NBSP + 'бью');
		// The E quarter after the rest in bar 8. Read off the file: the event id
		// is the parser's own positional key, so naming it pins the note rather
		// than the ordinal.
		expect(fold.cliticEventId).toBe('m7-0-1');
	});

	it('leaves the fourteen cells before it alone, and the notes it moves are the tail', async () => {
		const score = await parse(xml);
		const cells = cellsOf(score);
		const fold = findCliticFolds(score)[0];
		const at = cells.findIndex((c) => c.eventId === fold.cliticEventId);
		// Everything up to the clitic already agrees with the queue, so nothing
		// before it is in the run.
		expect(at).toBe(36);
		expect(fold.seat[0].eventId).toBe(fold.cliticEventId);
		// 96 cells, 95 slots: the run covers the clitic and every note after it
		// except the last, which the queue cannot reach.
		expect(cells).toHaveLength(96);
		expect(fold.seat).toHaveLength(59);
		expect(fold.seat.at(-1)!.eventId).toBe(cells[94].eventId);
	});

	it('seats «в бью» on the E and closes the tail up, exactly as the print does', async () => {
		const score = await parse(xml);
		const fold = findCliticFolds(score)[0];
		const before = shown(score, {});
		// The file as it stands: «в» alone, and every syllable one note late.
		expect(before.slice(36, 43)).toEqual(['в', 'бью', 'щем', 'ся', 'серд', 'це', 'на']);

		const after = shown(score, applyCliticSeat({}, fold));
		// The printed score, bar 8: «в бью» on the first quarter, then щем · ся ·
		// серд on the other three, це on the D eighth, на of надежда on the C
		// eighth.
		expect(after.slice(36, 43)).toEqual([
			'в' + NBSP + 'бью',
			'щем',
			'ся',
			'серд',
			'це',
			'на',
			'деж',
		]);
	});

	it('touches nothing before the fold', async () => {
		const score = await parse(xml);
		const fold = findCliticFolds(score)[0];
		const map = applyCliticSeat({}, fold);
		for (const cell of cellsOf(score).slice(0, 36)) {
			expect(map[cell.eventId]).toBeUndefined();
		}
	});

	it('leaves the last note UNDECIDED rather than empty', async () => {
		const score = await parse(xml);
		const cells = cellsOf(score);
		const fold = findCliticFolds(score)[0];
		const map = applyCliticSeat({}, fold);
		expect(map[cells[95].eventId]).toBeUndefined();
		expect(Object.values(map).some((p) => p.kind === 'empty')).toBe(false);
		expect(Object.values(map).some((p) => p.kind === 'melisma')).toBe(false);
	});

	it('carries the fused IPA and the host vowel onto the clitic’s note', async () => {
		const score = await parse(xml);
		const fold = findCliticFolds(score)[0];
		const seated = applyCliticSeat({}, fold)[fold.cliticEventId];
		expect(seated.kind).toBe('syllable');
		if (seated.kind !== 'syllable') return;
		// The clitic's own consonant leads the host's syllable, with no space:
		// the IPA line fuses where the Cyrillic line keeps a hard space.
		expect(seated.ipa.startsWith('v')).toBe(true);
		expect(seated.ipa).not.toContain(NBSP);
		expect(seated.vowel).toBe('u');
	});

	it('mutates nothing', async () => {
		const score = await parse(xml);
		const fold = findCliticFolds(score)[0];
		const start = {};
		const next = applyCliticSeat(start, fold);
		expect(start).toEqual({});
		expect(next).not.toBe(start);
	});

	// ── The negative controls ────────────────────────────────────────
	//
	// A vowel-bearing proclitic on its own note is NOT a fold. The same file
	// carries three of them, за, на and без, each on a note of its own, and each
	// one must come through this untouched.

	it('does not touch a vowel-bearing proclitic on its own note', async () => {
		const score = await parse(xml);
		const fold = findCliticFolds(score)[0];
		const cells = cellsOf(score);
		const map = applyCliticSeat({}, fold);
		for (const bare of ['за', 'на', 'без']) {
			const cell = cells.find((c) => c.text === bare);
			expect(cell, bare).toBeDefined();
		}
		// None of them is proposed as a fold: there is exactly one fold and it is
		// «в». The seat still rewrites the notes after it, which is the point, so
		// the control is on the PROPOSAL, not on the map.
		expect(findCliticFolds(score).map((f) => f.cliticText)).toEqual(['в']);
		expect(map[cells[36].eventId]).toBeDefined();
	});

	it('proposes nothing on a score with no lyrics', async () => {
		const stripped = xml.replace(/<lyric[\s\S]*?<\/lyric>/g, '');
		const score = await parse(stripped);
		expect(collectScoreWords(score, 1)).toHaveLength(0);
		expect(findCliticFolds(score)).toEqual([]);
	});

	it('proposes nothing where the engraver already folded the clitic in', async () => {
		// A CORRECT engraving of the same bar: «в бью» in ONE cell, which is what
		// the print does. The clitic's own note is gone from the underlay, so 95
		// cells face 95 slots and nothing is left to seat. This is the control
		// that matters, because it is the file Ilya should leave alone.
		const repaired = xml
			// The `в` note gives up its verse-1 cell entirely.
			.replace(
				'<lyric name="verse" number="1">\n          <syllabic>single</syllabic>\n          <text>в</text>\n        </lyric>\n        ',
				'',
			)
			// and its text joins the host's.
			.replace(
				'<syllabic>begin</syllabic>\n          <text>бью</text>',
				'<syllabic>begin</syllabic>\n          <text>в' + NBSP + 'бью</text>',
			);
		// THE POSITIVE CONTROL ON THE CONTROL. Both substitutions must bite, or a
		// clean result would only prove the fixture was not edited.
		expect(repaired).not.toBe(xml);
		expect(repaired).toContain('<text>в' + NBSP + 'бью</text>');
		expect(repaired).not.toContain('<text>в</text>');
		const score = await parse(repaired);
		// The reconstruction now reads 38 words where the pipeline still reads 39,
		// because «в бьющемся» came out of one cell run. The join rule is what
		// keeps the walk in sync across that, and without it this file would be
		// refused outright rather than passed clean.
		expect(collectScoreWords(score, 1)).toHaveLength(38);
		expect(findCliticFolds(score)).toEqual([]);
	});
});
