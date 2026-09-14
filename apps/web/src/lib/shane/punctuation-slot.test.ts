/**
 * N.118: punctuation travels in the slot.
 *
 * RULED 2026-09-09 (numbered by Dann, design ruled the same day): the word's
 * LAST syllable carries its trailing punctuation inside `buildSlotQueue`, so
 * every placement, shift, and re-seat carries it. Dann, 2026-09-14, holding
 * N.134's ship on it: commas and full stops carry semantic weight and cannot
 * be stripped.
 *
 * Driven through `processText` on purpose, unlike `pairings.test.ts`: the rule
 * under test is what the queue takes from the pipeline's words, so a
 * hand-built slot would test nothing.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { processText, wordGrid } from '$lib/pipeline';
import { diffWordGrid } from '$lib/text-diff';
import {
	buildSlotQueue,
	firstPass,
	melismaIds,
	pairedCyrillic,
	pairedSyllableType,
	refreshPairings,
	shiftToEndOfLyric,
	toggleMelisma,
	type PairingMap,
} from './pairings';
import { reseatByDiff } from './reseat';
import { align, findCliticFolds, isCliticSeated, type CliticFold } from './clitic-seat';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';

const NBSP = ' ';

const queueOf = (text: string) => buildSlotQueue(processText(text, { language: 'en' }));
const texts = (text: string) => queueOf(text).map((s) => s.cyrillic);

async function sunless(): Promise<ParsedScore> {
	const xml = readFileSync(
		fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
		'utf8',
	);
	const res = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	return res.score;
}

describe('N.118 the slot carries its word’s trailing punctuation', () => {
	it('on the last syllable only', () => {
		expect(texts('Комнатка тесная, тихая, милая;')).toEqual([
			'Ком', 'нат', 'ка', 'тес', 'на', 'я,', 'ти', 'ха', 'я,', 'ми', 'ла', 'я;',
		]);
	});

	it('on a one-syllable word, which is its own last syllable', () => {
		expect(texts('Вот она, ночь моя, ночь.')).toEqual(['Вот', 'о', 'на,', 'ночь', 'мо', 'я,', 'ночь.']);
	});

	it('agrees with every punctuated cell the engraved Sunless no. 1 prints', async () => {
		const score = await sunless();
		const words = collectScoreWords(score, 1);
		const lines = processText(scoreWordsText(words), { language: 'en' });
		const queue = buildSlotQueue(lines);
		const rows = align(words, lines[0].words, queue);
		expect(rows).not.toBeNull();
		const differ: string[] = [];
		let punctuated = 0;
		for (const row of rows!) {
			if (row.firstSlot < 0) continue;
			const nuclei = row.word.cells.filter((c) => /[аеёиоуыэюя]/iu.test(c.text));
			for (let k = 0; k <= row.lastSlot - row.firstSlot; k++) {
				const slot = queue[row.firstSlot + k];
				if (/[,.;]$/.test(slot.cyrillic)) {
					punctuated++;
					// Word-final, never anywhere else.
					expect(row.firstSlot + k).toBe(row.lastSlot);
				}
				if (slot.cyrillic !== nuclei[k].text) differ.push(`${slot.cyrillic}|${nuclei[k].text}`);
			}
		}
		expect(punctuated).toBe(14);
		// What still differs is the engraver's division against Ilya's, and the
		// clitic the file seated alone. No punctuation is left on the list.
		expect(differ).toEqual(['прог|про', 'ляд|гляд', 'в' + NBSP + 'бью|бью', 'счас|сча', 'тье|стье']);
	});
});

describe('N.118 the vowelless clitics', () => {
	it('an enclitic’s own punctuation ends the slot it joins', () => {
		expect(texts('Когда б, я пришёл')).toEqual(['Ког', 'да' + NBSP + 'б,', 'я', 'при', 'шёл']);
	});

	it('a host’s punctuation stays ahead of a clitic the queue attaches after it', () => {
		expect(texts('Когда, б я')).toEqual(['Ког', 'да,' + NBSP + 'б', 'я']);
	});

	it('a hyphenated particle joins its host with the hyphen and no space', () => {
		expect(texts('места-б, мне')).toEqual(['мес', 'та-б,', 'мне']);
	});

	it('a proclitic’s own punctuation stays with it, in the order it was written', () => {
		expect(texts('В, бью')).toEqual(['В,' + NBSP + 'бью']);
	});

	it('a clitic seat stored before N.118 still reads as seated', () => {
		const slot = queueOf('в ночь,')[0];
		const fold = {
			cliticEventId: 'n0',
			seat: [{ eventId: 'n0', slot, cyrillic: 'в' + NBSP + 'ночь,' }],
		} as unknown as CliticFold;
		const stored: PairingMap = {
			n0: { kind: 'syllable', cyrillic: 'в' + NBSP + 'ночь', ipa: slot.ipa, vowel: slot.vowel, origin: slot.origin },
		};
		expect(isCliticSeated(stored, fold)).toBe(true);
	});
});

describe('N.118 placement, shift, and re-seat all carry it', () => {
	const IDS = Array.from({ length: 12 }, (_, i) => `n${i}`);
	const cyr = (map: PairingMap, id: string) => {
		const p = map[id];
		return p?.kind === 'syllable' ? p.cyrillic : null;
	};

	it('survives a placement, then a shift, then a re-seat', () => {
		const before = 'Комнатка тесная, тихая';
		const placed = firstPass(IDS, queueOf(before));
		expect(cyr(placed, 'n5')).toBe('я,');

		const shifted = shiftToEndOfLyric(placed, IDS, 0, 'forward').map;
		expect(cyr(shifted, 'n6')).toBe('я,');

		const after = 'Милая комнатка тесная, тихая';
		const diff = diffWordGrid(wordGrid(before), wordGrid(after));
		const reseated = reseatByDiff(shifted, IDS, queueOf(after), diff, wordGrid(before)).map;
		expect(cyr(reseated, 'n6')).toBe('я,');
	});

	it('reaches a seat stored before N.118 through the refresh, on the page', () => {
		const queue = queueOf('Комнатка тесная, тихая');
		const old = queue[5];
		const stored: PairingMap = {
			n5: { kind: 'syllable', cyrillic: 'я', ipa: old.ipa, vowel: old.vowel, origin: old.origin },
		};
		expect(cyr(refreshPairings(stored, queue), 'n5')).toBe('я,');
	});

	it('never brings back a cell a melisma emptied', () => {
		const placed = firstPass(IDS, queueOf('Комнатка тесная, тихая'));
		const { map } = toggleMelisma(placed, IDS, 'n6');
		const drawn = pairedCyrillic(map, melismaIds(map));
		expect(drawn?.n6).toBe('');
		expect(drawn?.n5).toBe('я,');
	});

	it('leaves the word position every hyphen and extender reads exactly as it was', () => {
		const placed = firstPass(IDS, queueOf('Комнатка тесная, тихая, милая; тень'));
		const stripped: PairingMap = {};
		for (const [id, p] of Object.entries(placed)) {
			stripped[id] = p.kind === 'syllable' ? { ...p, cyrillic: p.cyrillic.replace(/[,;.]$/, '') } : p;
		}
		expect(Object.values(placed).some((p) => p.kind === 'syllable' && /[,;]$/.test(p.cyrillic))).toBe(true);
		expect(pairedSyllableType(placed)).toEqual(pairedSyllableType(stripped));
	});
});

describe('N.118 on the fixture’s clitic run', () => {
	it('the fold carries the punctuation once, never twice', async () => {
		const fold = findCliticFolds(await sunless())[0];
		for (const { cyrillic } of fold.seat) expect(cyrillic).not.toMatch(/[,.;]{2}$/);
		expect(fold.seat.filter((s) => /[,.;]$/.test(s.cyrillic)).map((s) => s.cyrillic)).toEqual([
			'я,', 'я;', 'е;', 'я,', 'я.', 'на,', 'я,',
		]);
	});
});
