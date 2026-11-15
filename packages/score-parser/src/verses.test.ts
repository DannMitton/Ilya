import { describe, expect, it } from 'vitest';
import type { ParsedScore, SyllableInfo, VerseSyllable, VocalLineEvent } from './types';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { sungVerseNumbers, verseGapBars, verseView } from './verses';

// ── Synthetic-score helpers (shape mirrors the parser fixtures) ─────

function note(
	id: string,
	syllable?: {
		text: string;
		type: SyllableInfo['type'];
		verse?: number;
		versesInfo?: VerseSyllable[];
	}
): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: { step: 'C', octave: 4, alter: 0 },
		...(syllable
			? {
					syllable: {
						id: `s-${id}`,
						text: syllable.text,
						type: syllable.type,
						verseNumber: syllable.verse ?? 1,
						wordContext: syllable.text,
						...(syllable.versesInfo ? { versesInfo: syllable.versesInfo } : {})
					}
				}
			: {})
	};
}

function rest(id: string): VocalLineEvent {
	return {
		id,
		type: 'rest',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } }
	};
}

function scoreOf(events: VocalLineEvent[]): ParsedScore {
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: [],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events
	};
}

describe('sungVerseNumbers', () => {
	it('returns [] for a score with no lyrics', () => {
		expect(sungVerseNumbers(scoreOf([note('a1'), rest('r1'), note('a2')]))).toEqual([]);
	});

	it('returns [1] for a single-verse score (derived from the notes, not defaulted)', () => {
		const s = scoreOf([
			note('n1', { text: 'вас', type: 'whole' }),
			note('n2', { text: 'нет', type: 'whole' })
		]);
		expect(sungVerseNumbers(s)).toEqual([1]);
	});

	it('collects every verse present in versesInfo, ascending and deduped', () => {
		const s = scoreOf([
			note('m1', {
				text: 'вас',
				type: 'whole',
				versesInfo: [
					{ verseNumber: 1, text: 'вас', type: 'whole' },
					{ verseNumber: 3, text: 'дом', type: 'whole' },
					{ verseNumber: 2, text: 'сад', type: 'whole' }
				]
			})
		]);
		expect(sungVerseNumbers(s)).toEqual([1, 2, 3]);
	});

	it('unions a sparse verse carried only by a single-verse primary on some notes', () => {
		// m1: verses 1 and 2 sing (versesInfo present). m2: only verse 2 sings,
		// stored as the primary with no versesInfo (the §A.98 sparse case). The
		// union is [1, 2], and m2's fallback path is what recovers verse 2 there.
		const s = scoreOf([
			note('m1', {
				text: 'вас',
				type: 'whole',
				versesInfo: [
					{ verseNumber: 1, text: 'вас', type: 'whole' },
					{ verseNumber: 2, text: 'го', type: 'start' }
				]
			}),
			note('m2', { text: 'ре', type: 'end', verse: 2 })
		]);
		expect(sungVerseNumbers(s)).toEqual([1, 2]);
	});

	it('ignores rests and note-less melisma continuations', () => {
		const s = scoreOf([
			rest('r1'),
			note('n1', { text: 'вас', type: 'whole' }),
			note('n2') // melisma continuation, no syllable
		]);
		expect(sungVerseNumbers(s)).toEqual([1]);
	});
});

describe('sungVerseNumbers: a line with no Cyrillic letter is not a verse (strophic lane A, D1)', () => {
	const both = (text2: string) =>
		scoreOf([
			note('n1', { text: 'вас', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'вас', type: 'whole' }, { verseNumber: 2, text: text2, type: 'whole' }] }),
			note('n2', { text: 'нет', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'нет', type: 'whole' }, { verseNumber: 2, text: text2, type: 'whole' }] })
		]);
	it('leaves out a line of IPA', () => {
		expect(sungVerseNumbers(both('vas'))).toEqual([1]);
	});
	it('keeps a line of Cyrillic', () => {
		expect(sungVerseNumbers(both('сад'))).toEqual([1, 2]);
	});
	it('with words on lines 1 and 3 and IPA on line 2, the verses are 1 and 3', () => {
		const s = scoreOf([
			note('n1', {
				text: 'вас',
				type: 'whole',
				versesInfo: [
					{ verseNumber: 1, text: 'вас', type: 'whole' },
					{ verseNumber: 2, text: 'vas', type: 'whole' },
					{ verseNumber: 3, text: 'сад', type: 'whole' }
				]
			})
		]);
		expect(sungVerseNumbers(s)).toEqual([1, 3]);
	});
	it('with no Cyrillic anywhere, every line counts as before', () => {
		expect(sungVerseNumbers(scoreOf([note('n1', { text: 'a', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'a', type: 'whole' }, { verseNumber: 2, text: 'b', type: 'whole' }] })]))).toEqual([1, 2]);
	});
});

async function fixture(name: string) {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const wordsIn = (s: ParsedScore, bar: number) => s.vocalLine.filter((e) => e.measureIndex === bar && e.type === 'note').map((e) => e.syllable?.text ?? null);

describe('verseView on strophic-repeat.musicxml (strophic lane A, D2)', () => {
	it('gives three verses', async () => {
		expect(sungVerseNumbers(await fixture('strophic-repeat.musicxml'))).toEqual([1, 2, 3]);
	});

	it('in verses 2 and 3, the refrain bars (7 and 8) carry verse 1\'s syllables', async () => {
		const s = await fixture('strophic-repeat.musicxml');
		for (const v of [2, 3]) {
			const view = verseView(s, v);
			for (const bar of [6, 7]) expect(wordsIn(view, bar)).toEqual(wordsIn(s, bar));
			expect(wordsIn(view, 6).every((w) => w !== null)).toBe(true);
		}
	});

	it('in verse 2, bar 4\'s second note has no syllable and bar 5\'s two notes each have one', async () => {
		const view = verseView(await fixture('strophic-repeat.musicxml'), 2);
		expect(wordsIn(view, 3).slice(0, 2)).toEqual(['Лес', null]);
		expect(wordsIn(view, 4).slice(0, 2)).toEqual(['зо', 'лот']);
		const v1 = verseView(await fixture('strophic-repeat.musicxml'), 1);
		expect(wordsIn(v1, 3).slice(0, 2)).toEqual(['ре', 'кой']);
		expect(wordsIn(v1, 4).slice(0, 2)).toEqual(['Свет', null]);
	});

	it('no sung note in any view lacks a syllable except the continuations the file has', async () => {
		const s = await fixture('strophic-repeat.musicxml');
		// printed bar 4 (index 3) note 2 in verses 2 and 3, bar 5 (index 4) note 2 in verse 1, bar 6 (index 5) note 2 in every verse (the slur).
		const allowed: Record<number, Array<[number, number]>> = { 1: [[4, 1], [5, 1]], 2: [[3, 1], [5, 1]], 3: [[3, 1], [5, 1]] };
		for (const v of [1, 2, 3]) {
			const view = verseView(s, v);
			const bare: Array<[number, number]> = [];
			for (const bar of new Set(view.vocalLine.map((e) => e.measureIndex))) {
				view.vocalLine.filter((e) => e.measureIndex === bar && e.type === 'note').forEach((e, i) => {
					if (!e.syllable && bar >= 2 && bar <= 9) bare.push([bar, i]);
				});
			}
			expect(bare, `verse ${v}`).toEqual(allowed[v]);
			expect(verseGapBars(s, v)).toEqual([]);
		}
	});

	it('renumbers every syllable of a view to verse 1, with no versesInfo, and leaves ids, bars, and pitches alone', async () => {
		const s = await fixture('strophic-repeat.musicxml');
		const view = verseView(s, 3);
		expect(view.vocalLine.map((e) => e.id)).toEqual(s.vocalLine.map((e) => e.id));
		expect(view.measures).toBe(s.measures);
		for (const e of view.vocalLine) {
			if (e.syllable) {
				expect(e.syllable.verseNumber).toBe(1);
				expect(e.syllable.versesInfo).toBeUndefined();
				expect(e.syllable.verses).toBeUndefined();
			}
		}
		expect(sungVerseNumbers(view)).toEqual([1]);
	});

	it('does not touch the score it is given', async () => {
		const s = await fixture('strophic-repeat.musicxml');
		const before = JSON.stringify(s);
		verseView(s, 2);
		expect(JSON.stringify(s)).toBe(before);
	});
});

describe('verseView: the rest of D2', () => {
	it('holds a one-line bar at the base verse for every verse', () => {
		const s = scoreOf([note('r1', { text: 'ай', type: 'whole' })]);
		s.vocalLine.push(note('r2', { text: 'вас', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'вас', type: 'whole' }, { verseNumber: 2, text: 'сад', type: 'whole' }] }));
		s.vocalLine[1] = { ...s.vocalLine[1], measureIndex: 1 };
		expect(verseView(s, 2).vocalLine[0].syllable?.text).toBe('ай');
		expect(verseView(s, 2).vocalLine[1].syllable?.text).toBe('сад');
	});

	it('names the bars where some verse has words and the verse asked for has none', () => {
		const ev = (id: string, bar: number, syl: Parameters<typeof note>[1]) => ({ ...note(id, syl), measureIndex: bar });
		const s = scoreOf([
			ev('a', 0, { text: 'вас', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'вас', type: 'whole' }, { verseNumber: 2, text: 'сад', type: 'whole' }, { verseNumber: 3, text: 'лес', type: 'whole' }] }),
			ev('b', 1, { text: 'вас', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'вас', type: 'whole' }, { verseNumber: 2, text: 'сад', type: 'whole' }] }),
			ev('c', 2, { text: 'ай', type: 'whole' })
		]);
		expect(verseGapBars(s, 3)).toEqual([1]);
		expect(verseGapBars(s, 2)).toEqual([]);
		expect(verseView(s, 3).vocalLine[1].syllable).toBeUndefined();
	});

	it('keeps the elision segments of a note\'s primary syllable and renumbers marks to verse 1', () => {
		const s = scoreOf([{ ...note('e', { text: 'а‿б', type: 'whole', verse: 2 }), measureIndex: 0 }]);
		s.vocalLine[0].syllable = { ...s.vocalLine[0].syllable!, segments: [{ text: 'а', type: 'whole' }, { text: 'б', type: 'whole' }] as never, parseFlag: 'elided' };
		s.vocalLine.push({ ...note('f', { text: 'вас', type: 'whole', versesInfo: [{ verseNumber: 1, text: 'вас', type: 'whole' }, { verseNumber: 2, text: 'сад', type: 'whole' }] }), measureIndex: 0 });
		s.dictionMarks = {
			breaks: [{ vacatedEventId: 'e', verseNumber: 2 }, { vacatedEventId: 'f', verseNumber: 1 }],
			vacatedTailEventIds: [{ eventId: 'e', verseNumber: 2 }, { eventId: 'f', verseNumber: 1 }]
		};
		const view = verseView(s, 2);
		expect(view.vocalLine[0].syllable?.parseFlag).toBe('elided');
		expect(view.vocalLine[0].syllable?.verseNumber).toBe(1);
		expect(view.dictionMarks).toEqual({ breaks: [{ vacatedEventId: 'e', verseNumber: 1 }], vacatedTailEventIds: [{ eventId: 'e', verseNumber: 1 }] });
	});
});
