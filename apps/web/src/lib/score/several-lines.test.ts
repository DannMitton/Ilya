/**
 * QUEUE row 108 A: seating takes several lines. Tests l, m, and n of the brief
 * (`docs/sessions/brief-code-row108-lyrics-lines_r3_2026-10-19.md`); test k is
 * `text/lay-out-seat.test.ts`.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { processText } from '$lib/pipeline';
import { drawPairings, drawnSeatCount, type PairingMap } from './pairings';
import { seatCliticFolds } from './clitic-seat';
import { seatWaitingScore } from './waiting-seat';
import { reseatOnReplace } from './replace-seat';
import { rekeySeatsToLines, seatScoreWords } from './score-seat';
import { inLines, loadFixture, loadRealDictionary, oneLine, SUNLESS, TCHAIKOVSKY } from './row108.support';

beforeAll(loadRealDictionary, 60_000);

const syllables = (m: PairingMap) => Object.values(m).filter((p) => p.kind === 'syllable');
const switches = { openSyllabification: false, reconstitution: false };

/** The arrival's seat on a Lyrics of several lines: the fold, the word seat, the fold again, then the re-key (`seatFilledPoem`). */
function arrive(score: Awaited<ReturnType<typeof loadFixture>>, lines: ReturnType<typeof processText>): PairingMap {
	const folded = seatCliticFolds(score, {});
	const seated = seatScoreWords(score, folded, lines).map;
	return rekeySeatsToLines(seatCliticFolds(score, seated), lines).map;
}

describe('l. the arrival on six lines', () => {
	it('gives 96 seats, no note carrying a second copy of a slot, and every seat drawn from the live poem', async () => {
		const score = await loadFixture(SUNLESS);
		const laid = inLines(oneLine(score));
		const lines = processText(laid);
		expect(lines).toHaveLength(6);
		const map = arrive(score, lines);
		expect(syllables(map)).toHaveLength(96);
		const slots = syllables(map).map((p) => (p.kind === 'syllable' ? `${p.origin.lineIndex}-${p.origin.wordIndex}-${p.origin.slotIndex}` : ''));
		expect(new Set(slots).size).toBe(96);
		expect(drawnSeatCount(drawPairings(map, lines, switches))).toEqual({ live: 96, stored: 0 });
		// on the same notes as the one-line arrival
		const one = arrive(score, processText(oneLine(score)));
		expect(Object.keys(map).sort()).toEqual(Object.keys(one).sort());
	});

	it('without the re-key, the fold’s 60 seats would draw from their stored text (the cost the brief measured)', async () => {
		const score = await loadFixture(SUNLESS);
		const lines = processText(inLines(oneLine(score)));
		const seated = seatScoreWords(score, seatCliticFolds(score, {}), lines).map;
		const raw = seatCliticFolds(score, seated);
		const { live, stored } = drawnSeatCount(drawPairings(raw, lines, switches));
		expect(stored).toBeGreaterThan(0);
		expect(live + stored).toBe(96);
	});
});

describe('m. Place from here on a six-line Lyrics', () => {
	it('takes the score’s mapping, and the fold’s seats carry six-line coordinates after it', async () => {
		const score = await loadFixture(SUNLESS);
		const lines = processText(inLines(oneLine(score)));
		const seated = seatScoreWords(score, {}, lines);
		expect(seated.seated).toBe(96);
		const { map, unmatched } = rekeySeatsToLines(seatCliticFolds(score, seated.map), lines);
		expect(unmatched).toBe(0);
		for (const p of syllables(map)) {
			if (p.kind !== 'syllable') continue;
			expect(lines[p.origin.lineIndex].words[p.origin.wordIndex].cleanWord).toBe(p.origin.word);
		}
	});

	it('leaves a seat it cannot place exactly as stored, and counts it', async () => {
		const score = await loadFixture(SUNLESS);
		const lines = processText(inLines(oneLine(score)));
		const stray: PairingMap = { x: { kind: 'syllable', cyrillic: 'я', ipa: 'jɑ', vowel: 'ɑ', origin: { lineIndex: 0, wordIndex: 3, slotIndex: 0, word: 'нет-такого' } } };
		const r = rekeySeatsToLines(stray, lines);
		expect(r.unmatched).toBe(1);
		expect(r.map.x).toBe(stray.x);
	});
});

describe('n. the waiting seat and the N.157 replacement', () => {
	it('each seat 96 on the six-line text', async () => {
		const score = await loadFixture(SUNLESS);
		const lines = processText(inLines(oneLine(score)));
		const waiting = seatWaitingScore(score, {}, lines);
		expect(syllables(waiting)).toHaveLength(96);
		expect(drawnSeatCount(drawPairings(waiting, lines, switches))).toEqual({ live: 96, stored: 0 });
		const replaced = reseatOnReplace({}, score, lines);
		expect(replaced.seated).toBe(96);
		expect(syllables(replaced.map)).toHaveLength(96);
	});
});

describe('Part A on the old-spelling score', () => {
	it('Tchaikovsky in lines of seven seats 172 of 172, on the one-line seat’s notes', async () => {
		const score = await loadFixture(TCHAIKOVSKY);
		const text = oneLine(score);
		const one = seatScoreWords(score, {}, processText(text));
		const laid = seatScoreWords(score, {}, processText(inLines(text)));
		expect(one.seated).toBe(172);
		expect(laid.seated).toBe(172);
		expect(Object.keys(laid.map).sort()).toEqual(Object.keys(one.map).sort());
	});
});
