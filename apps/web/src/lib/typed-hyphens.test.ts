/**
 * QUEUE row 106: a typed hyphen inside a word is a syllable break. Each test is
 * named for the letter of the brief's section 6 it holds
 * (`docs/sessions/brief-code-row106-typed-hyphens_r2_2026-10-19.md`).
 *
 * The real dictionary is loaded, as `old-spelling.test.ts` loads it, because the
 * resolution is a proposal the dictionary disposes of.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { processText, wordGrid } from '$lib/pipeline';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { buildUnderlayResolvers, collectScoreWords, scoreWordsText } from '$lib/score/vowel-resolver';
import { seatCliticFolds } from '$lib/score/clitic-seat';
import { seatScoreWords } from '$lib/score/score-seat';
import { buildSlotQueue, drawPairings, refreshPairings, type PairingMap } from '$lib/score/pairings';
import { comparePoem } from '$lib/text/poem-compare';
import { openSyllabify } from '$lib/syllable-utils';
import type { LineData, WordStackData, YoToggle } from '$lib/types';

const DATA = join(__dirname, '../../static/data');
const FIXTURES = join(__dirname, 'score/ingestion/fixtures');

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const f of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json'])
		for (const line of readFileSync(join(DATA, f), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [w, e] = JSON.parse(line);
				if (e.e !== undefined || e.f !== undefined) e.g = { en: e.e || '', fr: e.f || '' };
				dictionary[w] = e;
			} catch {
				/* a malformed line is skipped, as the loader skips it */
			}
		}
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA, 'singer-supplement.json'), 'utf8')));
}, 60_000);

const words = (text: string): WordStackData[] => processText(text).flatMap((l) => l.words);
const word = (text: string): WordStackData => words(text)[0];
const syl = (w: WordStackData): string => w.syllables.map((s) => s.cyrillic).join('|');
/** IPA with the spaces between syllables and the stress marks out: the letters alone. */
const letters = (w: WordStackData): string => w.ipaDisplay.replace(/[\sˈ]/g, '');

describe('a. a word typed in the score’s division is still the dictionary’s word', () => {
	it.each([
		['ве-ли-кий', 'великий'],
		['до-ро-га,', 'дорога'],
		['о-ди-но-ка-я', 'одинокая'],
	])('«%s» has %s’s stress and gloss, divides as typed, and its cleanWord is the whole word', (typed, whole) => {
		const t = word(typed);
		const w = word(whole);
		expect(t.cleanWord).toBe(whole);
		expect(t.stressIndex).toBe(w.stressIndex);
		expect(t.stressIndex).toBeGreaterThanOrEqual(0);
		expect(t.stressSource).toBe('dictionary');
		expect(t.gloss).toBe(w.gloss);
		expect(t.gloss).not.toBe('');
		expect(syl(t)).toBe(typed.replace(/,/g, '').split('-').join('|'));
		expect(t.syllables).toHaveLength(w.syllables.length);
	});
});

describe('b. a typed break wins, and the IPA letters do not move', () => {
	it('«прог-ляд-на-я» and «про-гляд-на-я» divide as typed, with one stress and the same IPA letters', () => {
		const a = word('прог-ляд-на-я');
		const b = word('про-гляд-на-я');
		const whole = word('проглядная');
		expect(syl(a)).toBe('прог|ляд|на|я');
		expect(syl(b)).toBe('про|гляд|на|я');
		expect(a.stressIndex).toBe(b.stressIndex);
		expect(a.stressIndex).toBe(whole.stressIndex);
		expect(letters(a)).toBe(letters(b));
		expect(letters(a)).toBe(letters(whole));
		// the log follows the cut: each letter’s entry points at the syllable that holds it
		const owner = (w: WordStackData) => w.result.transcriptionLog.filter((e) => e.features?.type === 'vowel').map((e) => e.syllableIndex);
		expect(owner(b)).toEqual([0, 1, 2, 3]);
		expect(b.result.syllables).toBe(b.syllables);
	});

	it('the per-letter IPA adds up to the syllables’ IPA in every word of both fixtures, typed and not (the independence the brief could not establish)', async () => {
		const all: string[] = [];
		for (const f of ['sunless-01-engraved.musicxml', 'tchaikovsky-op38-3-voice.musicxml']) {
			const score = await load(f);
			all.push(...collectScoreWords(score, 1).map(typedOf));
		}
		const typed = words(all.join(' '));
		const flat = words(all.map((w) => w.replace(/-/g, '')).join(' '));
		expect(typed).toHaveLength(flat.length);
		const wrongIpa = typed.filter((w, i) => letters(w) !== letters(flat[i]));
		expect(wrongIpa.map((w) => w.cyrillic)).toEqual([]);
		// every word of two or more typed parts was in fact cut
		const edges = (w: WordStackData) => w.syllables.map((s) => s.cyrillic.length).map((n, i, a) => a.slice(0, i + 1).reduce((x, y) => x + y, 0));
		const uncut = typed.filter((w) => !(w.typedBreaks ?? []).every((b) => edges(w).includes(b)));
		expect(uncut.map((w) => w.cyrillic)).toEqual([]);
	});
});

describe('c. Ilya fills the rest', () => {
	it('«ве-ликий» divides ве|ли|кий with великий’s stress 1 and gloss', () => {
		const w = word('ве-ликий');
		expect(syl(w)).toBe('ве|ли|кий');
		expect(w.stressIndex).toBe(1);
		expect(w.stressSource).toBe('dictionary');
		expect(w.gloss).toBe(word('великий').gloss);
	});
	it('«прог-лядная» keeps the typed break and divides the rest by Ilya’s rule', () => {
		expect(syl(word('прог-лядная'))).toBe('прог|ляд|на|я');
		expect(syl(word('про-глядная'))).toBe('про|гляд|на|я');
	});
});

describe('d. a part without a vowel is not a syllable', () => {
	it('«серд-ц-е» is сердце, divided сердц|е, stress 0 from the dictionary', () => {
		const w = word('серд-ц-е');
		expect(w.cleanWord).toBe('сердце');
		expect(syl(w)).toBe('сердц|е');
		expect(w.stressIndex).toBe(0);
		expect(w.stressSource).toBe('dictionary');
		expect(w.typedBreaks).toEqual([5]);
		// what was typed is what Text prints
		expect(w.cyrillic).toBe('серд-ц-е');
	});
	it('a vowelless FIRST part joins the part after it', () => {
		const w = word('в-ечер');
		expect(w.cleanWord).toBe('вечер');
		expect(w.typedBreaks).toEqual([]);
		expect(syl(w)).toBe(syl(word('вечер')));
	});
});

describe('d′. the other two syllable hyphens', () => {
	it.each([['ве‐ли‐кий', 'U+2010'], ['ве‑ли‑кий', 'U+2011']])('«%s» (%s) reads exactly as «ве-ли-кий»', (typed) => {
		const t = word(typed);
		const h = word('ве-ли-кий');
		expect(t.cleanWord).toBe('великий');
		expect(t.stressIndex).toBe(h.stressIndex);
		expect(t.gloss).toBe(h.gloss);
		expect(syl(t)).toBe('ве|ли|кий');
		expect(t.ipaDisplay).toBe(h.ipaDisplay);
		expect(t.cyrillic).toBe(typed);
	});
});

describe('e. a hyphen in the spelling still reads as that word, typed either way', () => {
	it.each([
		['кто-то', 'ктото', 0, 'somebody, someone'],
		['по-русски', 'порусски', 1, 'in Russian'],
		['какой-нибудь', 'какойнибудь', 1, 'some, any'],
	])('«%s» is found as it was', (typed, clean, stress, gloss) => {
		const w = word(typed);
		expect(w.cleanWord).toBe(clean);
		expect(w.stressIndex).toBe(stress);
		expect(w.gloss).toBe(gloss);
		expect(w.typedBreaks).toEqual([]);
	});
	it('«по-рус-ски» and «ка-кой-ни-будь» resolve to по-русски and какой-нибудь, with their stress and gloss', () => {
		const a = word('по-рус-ски');
		expect([a.stressIndex, a.gloss, a.cleanWord]).toEqual([1, 'in Russian', 'порусски']);
		expect(syl(a)).toBe('по|рус|ски');
		const b = word('ка-кой-ни-будь');
		expect([b.stressIndex, b.gloss]).toEqual([1, 'some, any']);
		expect(syl(b)).toBe('ка|кой|ни|будь');
	});
	it('кто-то’s Dictionary panel entry is filled (empty before this row)', () => {
		const w = word('кто-то');
		expect(w.fullGlossEn).not.toBe('');
		expect(w.allDictEntries?.length).toBeGreaterThan(0);
		expect(word('ве-ли-кий').fullGlossEn).toBe(word('великий').fullGlossEn);
	});
});

describe('f. a particle splits only where the whole token is no word', () => {
	it.each([['бы-ли', 'были'], ['зна-ли', 'знали'], ['у-же', 'уже'], ['что-б', 'чтоб']])('«%s» is one word, %s', (typed, whole) => {
		const ws = words(typed);
		expect(ws).toHaveLength(1);
		expect(ws[0].cleanWord).toBe(whole);
		expect(ws[0].isEnclitic).toBe(false);
	});
	it('«велит-ли» and «места-б,» split as they did', () => {
		expect(words('велит-ли').map((w) => w.cyrillic)).toEqual(['велит-', 'ли']);
		expect(words('места-б,').map((w) => w.cyrillic)).toEqual(['места-', 'б,']);
	});
	it('«так-же» reads as также: the cost, pinned so a change is seen', () => {
		const ws = words('так-же');
		expect(ws).toHaveLength(1);
		expect(ws[0].cleanWord).toBe('также');
	});
});

describe('f′. the old spelling meets the particle test', () => {
	it('«гля-дѣ-ли» is one word, глядели, with глядели’s stress', () => {
		const ws = words('гля-дѣ-ли');
		expect(ws).toHaveLength(1);
		expect(ws[0].cleanWord).toBe('глядели');
		expect(ws[0].stressIndex).toBe(word('глядели').stressIndex);
		expect(ws[0].stressSource).toBe('dictionary');
		expect(syl(ws[0])).toBe('гля|де|ли');
	});
});

describe('g. the old spelling', () => {
	it('«дѣ-ти» is modernised to дети with its stress and two syllables', () => {
		const w = word('дѣ-ти');
		expect(w.cleanWord).toBe('дети');
		expect(w.cyrillic).toBe('де-ти');
		expect(w.preReformSource).toBe('дѣти');
		expect(w.stressIndex).toBe(word('дети').stressIndex);
		expect(syl(w)).toBe('де|ти');
	});
	it('«шум-на-го» takes row 25’s шумного, and the break is carried across the changed letter', () => {
		const w = word('шум-на-го');
		expect(w.cleanWord).toBe('шумного');
		expect(w.cyrillic).toBe('шум-но-го');
		expect(w.stressSource).toBe('dictionary');
		expect(syl(w)).toBe('шум|но|го');
		expect(w.ipaDisplay).toBe(word('шумного').ipaDisplay);
	});
});

describe('g′. a lookup-only twin does not vouch for a hyphenated form', () => {
	it('«пе-чаль-ны-я» is печальныя divided as typed, not read as a spelling that keeps its hyphens', () => {
		const w = word('пе-чаль-ны-я');
		expect(w.cleanWord).toBe('печальныя');
		expect(w.typedBreaks).toEqual([2, 6, 8]);
		expect(w.stressIndex).toBe(word('печальныя').stressIndex);
	});
});

describe('h. ё', () => {
	it('«тя-же-лый» restores тяжёлый, stress 1, yo-restored', () => {
		const w = word('тя-же-лый');
		expect(w.cleanWord).toBe('тяжёлый');
		expect(w.stressIndex).toBe(1);
		expect(w.stressSource).toBe('yo-restored');
		expect(w.cyrillic).toBe('тя-жё-лый');
		expect(syl(w)).toBe('тя|жё|лый');
	});
	it('a ё toggle lands on the same letter as on the joined word, and the word still divides as typed', () => {
		const toggles = new Map<string, YoToggle>([['0-0-1', { source: 'user-dictionary' }]]);
		const joined = processText('великий', { yoToggles: toggles })[0].words[0];
		const typed = processText('ве-ли-кий', { yoToggles: toggles })[0].words[0];
		expect(joined.cleanWord).toBe('вёликий');
		expect(typed.cleanWord).toBe('вёликий');
		expect(typed.cyrillic).toBe('вё-ли-кий');
		expect(syl(typed)).toBe('вё|ли|кий');
	});
	it('…and where the typed division is not Ilya’s own, the toggled word keeps the typed one («пер-е-ход»)', () => {
		const toggles = new Map<string, YoToggle>([['0-0-1', { source: 'user-dictionary' }]]);
		const w = processText('пер-е-ход', { yoToggles: toggles })[0].words[0];
		expect(w.cleanWord).toBe('пёреход');
		expect(w.cyrillic).toBe('пёр-е-ход');
		expect(syl(w)).toBe('пёр|е|ход');
		expect(syl(word('пер-е-ход'))).toBe('пер|е|ход');
	});
});

/* ── the fixtures ───────────────────────────────────────────────── */

const load = async (file: string): Promise<ParsedScore> => {
	const xml = readFileSync(join(FIXTURES, file), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: file })).score;
};
/** A score word typed in the file’s own division: its cells joined by `-`. */
const typedOf = (w: { cells: Array<{ text: string }> }): string => w.cells.map((c) => c.text).join('-');
const fileDivision = (score: ParsedScore): string => collectScoreWords(score, 1).map(typedOf).join(' ');
const oneLine = (score: ParsedScore): string => scoreWordsText(collectScoreWords(score, 1));
const unknown = (ws: WordStackData[]) => ws.filter((w) => w.stressSource === 'inferred' && w.stressIndex === -2);
const key = (o: { lineIndex: number; wordIndex: number; slotIndex: number }) => `${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`;
const arrive = (score: ParsedScore, lines: LineData[]): PairingMap => seatScoreWords(score, seatCliticFolds(score, {}), lines).map;

describe('i. the diff and the seats', () => {
	it('wordGrid of the fixture’s one-line text and of the same text in the file’s division are equal', async () => {
		const score = await load('sunless-01-finale-lone-v.musicxml');
		expect(wordGrid(fileDivision(score))).toEqual(wordGrid(oneLine(score)));
		expect(wordGrid(fileDivision(score)).flat()).toHaveLength(39);
	});

	it('96 seats before and after, on the same notes, and the re-divided words’ seats carry the typed syllables', async () => {
		const score = await load('sunless-01-finale-lone-v.musicxml');
		const flat = processText(oneLine(score));
		const typed = processText(fileDivision(score));
		const before = arrive(score, flat);
		expect(buildSlotQueue(flat)).toHaveLength(96);
		expect(buildSlotQueue(typed)).toHaveLength(96);
		const after = refreshPairings(before, buildSlotQueue(typed));
		expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
		const origin = (m: PairingMap) => Object.fromEntries(Object.entries(m).map(([id, p]) => [id, p.kind === 'syllable' ? key(p.origin) : p.kind]));
		expect(origin(after)).toEqual(origin(before));
		const seatsOf = (m: PairingMap, w: string) => Object.values(m).flatMap((p) => (p.kind === 'syllable' && p.origin.word === w ? [p.cyrillic.replace(/[.,;]/g, '')] : []));
		expect(seatsOf(before, 'проглядная')).toEqual(['прог', 'ляд', 'на', 'я']);
		expect(seatsOf(after, 'проглядная')).toEqual(['про', 'гляд', 'на', 'я']);
		expect(seatsOf(before, 'счастье')).toEqual(['счас', 'тье']);
		expect(seatsOf(after, 'счастье')).toEqual(['сча', 'стье']);
	});
});

describe('j. the open-syllables switch leaves a typed break alone', () => {
	it('on Text’s resliced syllables: «прог-ляд-на-я» stays прог|ляд|на|я, and an untyped Ilya boundary still opens', () => {
		const typed = word('прог-ляд-на-я');
		expect(openSyllabify(typed.syllables, typed.typedBreaks).map((s) => s.cyrillic)).toEqual(['прог', 'ляд', 'на', 'я']);
		// the untyped switch, for contrast: it opens the same word
		expect(openSyllabify(typed.syllables).map((s) => s.cyrillic)).toEqual(['про', 'гля', 'дна', 'я']);
		const part = word('прог-лядная');
		expect(openSyllabify(part.syllables, part.typedBreaks).map((s) => s.cyrillic)).toEqual(['прог', 'ля', 'дна', 'я']);
	});

	it('in drawPairings and in buildUnderlayResolvers, on the score', async () => {
		const score = await load('sunless-01-finale-lone-v.musicxml');
		// the file divides «проглядная» про-гляд; here the singer types Ilya’s own прог-ляд, which the switch would open
		const typed = processText(fileDivision(score).replace('про-гляд', 'прог-ляд'));
		const untyped = processText(oneLine(score));
		const map = arrive(score, untyped);
		const seated = refreshPairings(map, buildSlotQueue(typed));
		const idsOf = (w: string) => Object.entries(seated).filter(([, p]) => p.kind === 'syllable' && p.origin.word === w).map(([id]) => id);
		const bare = (s: string | undefined) => s?.replace(/ˈ/g, '');

		const drawn = drawPairings(seated, typed, { openSyllabification: true, reconstitution: false });
		expect(idsOf('проглядная').map((id) => bare(drawn[id].ipa))).toEqual(['prɑɡ', 'lʲɑd', 'nɑ', 'jɑ']);
		const drawnUntyped = drawPairings(seated, untyped, { openSyllabification: true, reconstitution: false });
		expect(idsOf('проглядная').map((id) => bare(drawnUntyped[id].ipa))).toEqual(['prɑ', 'ɡlʲɑ', 'dnɑ', 'jɑ']);

		const byId = new Map(score.vocalLine.map((e) => [e.id, e]));
		const r = buildUnderlayResolvers(score, 1, { openSyllabification: true, transcribedLines: typed });
		expect(idsOf('проглядная').map((id) => bare(r.ipa(byId.get(id)!)))).toEqual(['prɑɡ', 'lʲɑd', 'nɑ', 'jɑ']);
		const r2 = buildUnderlayResolvers(score, 1, { openSyllabification: true, transcribedLines: untyped });
		expect(idsOf('проглядная').map((id) => bare(r2.ipa(byId.get(id)!)))).toEqual(['prɑ', 'ɡlʲɑ', 'dnɑ', 'jɑ']);
	});
});

describe('k. each fixture whole, in the file’s division', () => {
	it('«Within Four Walls»: 0 unknown words, the one-line text’s stress on all 39, 96 seats', async () => {
		const score = await load('sunless-01-finale-lone-v.musicxml');
		const flat = words(oneLine(score));
		const typed = words(fileDivision(score));
		expect(flat).toHaveLength(39);
		expect(typed).toHaveLength(39);
		expect(unknown(typed)).toHaveLength(unknown(flat).length);
		expect(unknown(typed).map((w) => w.cleanWord)).toEqual(unknown(flat).map((w) => w.cleanWord));
		expect(typed.map((w) => [w.stressIndex, w.stressSource])).toEqual(flat.map((w) => [w.stressIndex, w.stressSource]));
		expect(typed.map((w) => w.gloss)).toEqual(flat.map((w) => w.gloss));
		expect(buildSlotQueue(processText(fileDivision(score)))).toHaveLength(96);
		// every hyphen the file’s division holds is a syllable break, and none is dropped
		expect(typed.reduce((n, w) => n + w.typedBreaks!.length, 0)).toBe(fileDivision(score).split('-').length - 1);
	});

	it('Tchaikovsky op. 38 no. 3: 0 unknown tokens, 95 tokens, 172 slots', async () => {
		const score = await load('tchaikovsky-op38-3-voice.musicxml');
		const flat = words(oneLine(score));
		const typed = words(fileDivision(score));
		expect(unknown(flat)).toHaveLength(0);
		expect(unknown(typed)).toHaveLength(0);
		expect(typed).toHaveLength(95);
		expect(flat).toHaveLength(95);
		expect(typed.reduce((n, w) => n + w.typedBreaks!.length, 0)).toBe(fileDivision(score).split('-').length - 1);
		expect(buildSlotQueue(processText(fileDivision(score)))).toHaveLength(172);
		expect(typed.map((w) => [w.cleanWord, w.stressIndex, w.stressSource])).toEqual(flat.map((w) => [w.cleanWord, w.stressIndex, w.stressSource]));
	});
});

describe('l. Lyrics’ colour', () => {
	it('the fixture in the file’s division against the one-line text as a poem: 0 differing', async () => {
		const score = await load('sunless-01-finale-lone-v.musicxml');
		const cmp = comparePoem(fileDivision(score), oneLine(score))!;
		expect(cmp.differing).toBe(0);
	});
});

describe('m. Text prints what was typed', () => {
	it('«ве-ли-кий» and «кто-то» print as typed while the stress and gloss are великий’s and кто-то’s', () => {
		const a = word('ве-ли-кий');
		expect(a.cyrillic).toBe('ве-ли-кий');
		expect([a.stressIndex, a.gloss]).toEqual([1, word('великий').gloss]);
		const b = word('кто-то');
		expect(b.cyrillic).toBe('кто-то');
		expect([b.stressIndex, b.gloss]).toEqual([0, 'somebody, someone']);
	});
});

describe('n. a stored gloss survives the retyping', () => {
	// `+page.svelte`’s `glossAnchorForm`, which cannot be imported (it is a closure in the page).
	const anchorForm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');
	it('a gloss anchored on «великий» survives retyping «ве-ли-кий»; one anchored on «ктото» survives «кто-то»', () => {
		expect(anchorForm(word('ве-ли-кий').cleanWord)).toBe(anchorForm('великий'));
		expect(anchorForm(word('кто-то').cleanWord)).toBe(anchorForm('ктото'));
	});
});
