/**
 * N.161b, on the engraved Sunless no. 1, the fixture `score-seat.test.ts` and
 * `clitic-seat.test.ts` read. The map a waiting seat is spent on is the one
 * `applyArrival` leaves behind: the clitic fold applied to an empty map.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { processText } from '$lib/pipeline';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';
import { findCliticFolds, seatCliticFolds } from './clitic-seat';
import { buildSlotQueue, type PairingMap } from './pairings';
import { seatScoreWords } from './score-seat';
import { seatWaitingScore } from './waiting-seat';
import type { LineData } from '$lib/types';

const xml = readFileSync(
	fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)),
	'utf8',
);

async function parse(): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	return res.score;
}

function poemLines(score: ParsedScore): LineData[] {
	return processText(scoreWordsText(collectScoreWords(score, 1)), { language: 'en' });
}

const key = (o: { lineIndex: number; wordIndex: number; slotIndex: number }) =>
	`${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`;

/** What `seatFilledPoem` did to a waiting seat before N.161b. */
function oldSpend(score: ParsedScore, map: PairingMap, lines: LineData[]): PairingMap {
	return seatCliticFolds(score, seatScoreWords(score, map, lines).map);
}

/**
 * The arrival map, plus the singer's hand: the fold's second syllable placed
 * on the clitic's own note, which is the walk reproduced in the browser.
 */
async function handPlaced() {
	const score = await parse();
	const lines = poemLines(score);
	const [fold] = findCliticFolds(score, 1);
	const arrival = seatCliticFolds(score, {});
	const clitic = fold.cliticEventId;
	const hand: PairingMap = { ...arrival, [clitic]: { ...arrival[fold.seat[1].eventId] } };
	return { score, lines, fold, arrival, clitic, hand };
}

describe('N.161b seatWaitingScore', () => {
	it('on an untouched arrival map, seats exactly what the old spend seated, every slot once', async () => {
		const { score, lines, arrival } = await handPlaced();
		const next = seatWaitingScore(score, arrival, lines);
		expect(next).toEqual(oldSpend(score, arrival, lines));
		const keys = Object.values(next).flatMap((p) => (p.kind === 'syllable' ? [key(p.origin)] : []));
		expect(new Set(keys).size).toBe(keys.length);
		expect(buildSlotQueue(lines).filter((s) => keys.includes(key(s.origin)))).toHaveLength(96);
	});

	it('keeps a hand placement on the clitic note, and still seats the notes before the run', async () => {
		const { score, lines, hand, clitic } = await handPlaced();
		const next = seatWaitingScore(score, hand, lines);
		expect(next[clitic]).toEqual(hand[clitic]);
		const [first] = score.vocalLine.filter((ev) => ev.type !== 'rest');
		expect(hand[first.id]).toBeUndefined();
		expect(next[first.id]).toMatchObject({ kind: 'syllable', cyrillic: 'Ком' });
	});

	it('control: the old spend rewrites that same hand placement with the fused seat', async () => {
		const { score, lines, hand, clitic, fold } = await handPlaced();
		const old = oldSpend(score, hand, lines)[clitic];
		expect(old).toMatchObject({ kind: 'syllable', cyrillic: fold.seat[0].cyrillic });
		expect(old).not.toEqual(hand[clitic]);
	});

	it('on a map with no syllable, folds first and then seats, as the arrival does', async () => {
		const score = await parse();
		const lines = poemLines(score);
		const arrive = seatScoreWords(score, seatCliticFolds(score, {}), lines).map;
		expect(seatWaitingScore(score, {}, lines)).toEqual(arrive);
	});
});
