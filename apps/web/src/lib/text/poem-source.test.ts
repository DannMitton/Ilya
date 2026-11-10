/**
 * What fills Poem and how the stored source changes (poem library, build 1, step 4),
 * on the real library and the real fixtures where they can be.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { PoemSource } from '$lib/library/types';
import type { LoadedPoemLibrary, PoemEntry } from './poem-library';
import { foldLetters, matchPoem } from './poem-match';
import { bodyStanzas, cardLine, cutFor, edited, LONG_POEM_RATIO, PASSAGE_COVERAGE, passageLine, showsLine, heldForGuard, kept, lineAt, replacesLibraryPoem, resolveSource, RUN, stanzaCut, stanzas } from './poem-source';

const ROOT = join(__dirname, '../../../../..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/dictionary-manifest.json'), 'utf8'));
const library: LoadedPoemLibrary = { ...JSON.parse(readFileSync(join(ROOT, 'data', manifest.poemFiles[0]), 'utf8')), hash: manifest.poemHash };
const fixture = (name: string): string => readFileSync(join(ROOT, 'tools/poems/fixtures', `${name}.lyrics.txt`), 'utf8');
const entry = (title: string): PoemEntry => library.entries.find((e) => e.title === title)!;

const POEM = 'Один раз\nДва раза\n\nТри раза\nЧетыре раза\n\nПять раз\nШесть раз\n\nСемь раз\nВосемь раз';
// stanzas: [0,17) [19,39) [41,59) [61,79) -- see the first test

describe('stanzas: blank-line blocks as offsets', () => {
	it('finds each block from its first letter to its last', () => {
		const blocks = stanzas(POEM);
		expect(blocks).toHaveLength(4);
		expect(blocks.map((b) => POEM.slice(b.start, b.end))).toEqual(['Один раз\nДва раза', 'Три раза\nЧетыре раза', 'Пять раз\nШесть раз', 'Семь раз\nВосемь раз']);
	});

	it('takes lines of spaces for blank, and ignores blanks at the ends', () => {
		const t = '\n\n  Первая строка  \nВторая\n   \n\n\nТретья\n\n';
		expect(stanzas(t).map((b) => t.slice(b.start, b.end))).toEqual(['Первая строка  \nВторая', 'Третья']);
	});

	it('is empty for no text', () => {
		expect(stanzas('')).toEqual([]);
		expect(stanzas('\n \n')).toEqual([]);
	});
});

describe('stanzaCut: the whole stanzas that hold the stretch', () => {
	const at = (needle: string) => POEM.indexOf(needle);

	it('cuts to the stanzas holding the stretch, when it covers less than the poem', () => {
		const cut = stanzaCut(POEM, at('Четыре'), at('Шесть') + 'Шесть'.length);
		expect(cut.whole).toBe(false);
		expect(cut.text).toBe('Три раза\nЧетыре раза\n\nПять раз\nШесть раз');
		expect(POEM.slice(cut.start, cut.end)).toBe(cut.text);
	});

	it('takes a stanza whole when the stretch begins or ends inside it', () => {
		const cut = stanzaCut(POEM, at('раза\n\nТри') + 2, at('Три') + 2);
		expect(cut.text).toBe('Один раз\nДва раза\n\nТри раза\nЧетыре раза');
	});

	it('is the whole poem, verbatim, when the stretch reaches the first and the last stanza', () => {
		const cut = stanzaCut(POEM, 3, POEM.length - 2);
		expect(cut).toEqual({ text: POEM, start: 0, end: POEM.length, whole: true });
	});

	it('is one stanza when the stretch lies in one', () => {
		const cut = stanzaCut(POEM, at('Пять'), at('Пять') + 4);
		expect(cut.text).toBe('Пять раз\nШесть раз');
	});

	it('is the whole poem for a poem of one stanza, or a stretch that names nothing', () => {
		expect(stanzaCut('Одна\nстрофа', 2, 5).whole).toBe(true);
		expect(stanzaCut('', 0, 0).whole).toBe(true);
		expect(stanzaCut(POEM, 500, 600).whole).toBe(true);
	});

	it('does not count a closing dating line as a stanza the song left out', () => {
		const dated = 'Первая\nстрофа\n\nВторая\nстрофа\n\n1830';
		expect(bodyStanzas(dated)).toHaveLength(2);
		const cut = stanzaCut(dated, 0, dated.indexOf('1830') - 3);
		expect(cut.whole).toBe(true);
		expect(cut.text).toBe('Первая\nстрофа\n\nВторая\nстрофа'); // the body verbatim; the dating line is never filled (part 3)
		expect(cut.end).toBe(dated.indexOf('\n\n1830'));
		expect(cut.text).not.toContain('1830');
		// ... and a stretch in the first stanza alone is still a passage
		expect(stanzaCut(dated, 0, 5).whole).toBe(false);
		// the date forms in the library
		for (const closing of ['Февраль 1837', '8 декабря 1840Москва']) {
			const t = `А\nБ\n\nВ\nГ\n\n${closing}`;
			const c = stanzaCut(t, 0, t.indexOf(closing) - 3);
			expect(c.whole, closing).toBe(true);
			expect(c.text, closing).toBe('А\nБ\n\nВ\nГ');
		}
		// but a closing stanza that is verse is a stanza
		const verse = 'А\nБ\n\nВ\nГ\n\nДа здравствует год 1830 и все, кто в нём';
		expect(stanzaCut(verse, 0, 3).whole).toBe(false);
	});
});

describe('stanzaCut on the real fixtures', () => {
	const cutOf = (name: string) => {
		const m = matchPoem(fixture(name), library)!;
		return { m, cut: stanzaCut(m.entry.textModern, m.start, m.end) };
	};

	it('row 114 song 2 sets the whole of «Весёлый час»: the whole poem, no passage', () => {
		const { m, cut } = cutOf('r114-song2');
		expect(m.entry.title).toBe('Весёлый час');
		expect(cut.whole).toBe(true);
		// the body of the poem, without its dating line («1830»), which the library keeps and POEM does not
		expect(cut.text).toBe(m.entry.textModern.replace(/\n\n1830$/, ''));
		expect(cut.text).not.toContain('1830');
		expect(cut.text.endsWith('Видит заря!')).toBe(true);
		expect(m.entry.textModern.endsWith('1830')).toBe(true); // the library's record keeps it
	});

	it('no poem in the library fills its dating line, and each still ends on its last verse (part 3)', () => {
		const ends: Record<string, string> = {
			'Весёлый час': 'Видит заря!',
			'Русская песня': 'Сам с собою грущу…',
		};
		for (const e of library.entries) {
			const cut = stanzaCut(e.textModern, 0, e.textModern.length);
			expect(cut.whole, e.title).toBe(true);
			expect(cut.text, e.title).not.toMatch(/(^|\n)\s*(\d{1,2}\s+[а-я]+\s+)?\d{4}[А-Яа-я]*\s*$/);
			expect(cut.text, e.title).not.toMatch(/Февраль 1837/);
			if (ends[e.title]) expect(cut.text.endsWith(ends[e.title]), e.title).toBe(true);
			// an entry with no dating line fills exactly its text
			if (!/\d{4}/.test(e.textModern.split('\n\n').pop()!)) expect(cut.text, e.title).toBe(e.textModern.trimEnd());
		}
		const modernHymn = library.entries.find((e) => e.id === '6b51c54db7')!;
		expect(modernHymn.textModern.endsWith('Февраль 1837')).toBe(true);
		expect(stanzaCut(modernHymn.textModern, 0, modernHymn.textModern.length).text.endsWith('Лучшего ангела душу прекрасную.')).toBe(true);
	});

	it('fixture S sets the fish’s song: a cut of a few stanzas of «Мцыри», starting on a stanza', () => {
		const { m, cut } = cutOf('S');
		expect(m.entry.title).toBe('Мцыри');
		expect(cut.whole).toBe(false);
		expect(cut.text).toContain('Останься здесь со мной');
		expect(cut.text).not.toContain('Немного лет тому назад');
		expect(cut.text.length).toBeLessThan(m.entry.textModern.length / 20);
		expect(cut.start).toBeLessThanOrEqual(m.start);
		expect(cut.end).toBeGreaterThanOrEqual(m.end);
		// it begins at the start of a stanza and ends at the end of one
		expect(m.entry.textModern[cut.start - 1] === '\n' || cut.start === 0).toBe(true);
		expect(m.entry.textModern[cut.end] === '\n' || cut.end === m.entry.textModern.length).toBe(true);
	});

	it('every filling fixture cuts to stanzas: no cut begins or ends inside a line', () => {
		for (const name of ['P', 'S', 'T', 'U1', 'U6', 'r114-song2', 'r114-song3', 'r114-song4', 'r114-song5']) {
			const { m, cut } = cutOf(name);
			const t = m.entry.textModern;
			expect(cut.start === 0 || t[cut.start - 1] === '\n', name).toBe(true);
			expect(cut.end === t.length || t[cut.end] === '\n', name).toBe(true);
		}
	});
});

describe('lineAt', () => {
	it('gives the line that holds an offset, trimmed', () => {
		const t = 'Первая строка\n  Вторая строка  \nТретья';
		expect(lineAt(t, 0)).toBe('Первая строка');
		expect(lineAt(t, 20)).toBe('Вторая строка');
		expect(lineAt(t, t.length - 1)).toBe('Третья');
		expect(lineAt(t, -1)).toBe('');
		expect(lineAt(t, t.length)).toBe('');
	});
});

describe('resolveSource: a stored source found again in the library', () => {
	const koltsov = entry('Весёлый час');
	const source = (over: Partial<PoemSource> = {}): PoemSource => ({ id: koltsov.id, work: koltsov.work, poemHash: library.hash, start: 0, end: koltsov.textModern.length, answered: false, edited: false, ...over });

	it('finds the entry, its first line, and says whole', () => {
		const r = resolveSource(source(), library)!;
		expect(r.entry.id).toBe(koltsov.id);
		expect(r.firstLine).toBe('Дайте бокалы!');
		expect(r.passage).toBe(false);
		expect(r.entry.author).toBe('Алексей Васильевич Кольцов');
	});

	it('says passage, with the cut’s first line, for a part of a poem', () => {
		const m = matchPoem(fixture('S'), library)!;
		const cut = stanzaCut(m.entry.textModern, m.start, m.end);
		const r = resolveSource({ id: m.entry.id, work: m.work, poemHash: library.hash, start: cut.start, end: cut.end, answered: false, edited: false }, library)!;
		expect(r.passage).toBe(true);
		// D4: the first lines joined until four words, the closing punctuation dropped, the later line lowered
		expect(r.firstLine).toBe('Дитя моё, останься здесь со мной');
		expect(r.entry.title).toBe('Мцыри');
	});

	it('does not trust offsets cut from another file: it falls back to the incipit, whole', () => {
		const r = resolveSource(source({ poemHash: 'olderhash', start: 40, end: 90 }), library)!;
		expect(r.firstLine).toBe(koltsov.incipit);
		expect(r.passage).toBe(false);
	});

	it('follows the work when a later library has dropped the id: the modern entry', () => {
		const dropped = { ...library, entries: library.entries.filter((e) => e.id !== '298e556367') };
		const r = resolveSource({ id: '298e556367', work: 'f1a88510', poemHash: library.hash, start: 0, end: 50, answered: true, edited: false }, dropped)!;
		expect(r.entry.work).toBe('f1a88510');
		expect(r.entry.spelling).toBe('modern');
		expect(r.firstLine).toBe(r.entry.incipit); // the id is gone: the offsets belong to an entry that is not this one
	});

	it('row 182: never names another aria of the opera when the stored aria\'s id is gone, but still finds an aria by its id', () => {
		const opera = { composer: 'Tchaikovsky, Pyotr', operaRu: 'Пиковая дама', operaEn: 'Pique Dame', characterRu: 'Герман', characterEn: 'Hermann', number: "Hermann's arioso", voice: 'tenor', librettists: 'Модест Ильич Чайковский', literarySource: 'Pushkin, Пиковая дама' };
		const aria = (id: string, title: string): PoemEntry => ({ ...koltsov, id, work: 'opera001', title, incipit: title, kind: 'libretto', opera });
		const lib = { ...library, entries: [...library.entries, aria('aria000001', 'Я имени её не знаю'), aria('aria000002', 'Прости, прелестное создание')] };
		const gone = { id: 'aria00gone', work: 'opera001', poemHash: library.hash, start: 0, end: 20, answered: true, edited: false };
		expect(resolveSource(gone, lib)).toBeNull(); // the caller falls back as it does for a work the library no longer has
		expect(resolveSource({ ...gone, id: 'aria000002' }, lib)!.entry.title).toBe('Прости, прелестное создание');
		// a poem's work still follows (the test above): only a libretto is exempt
	});

	it('is null when the library has no entry of the work (the caller falls back to the ordinary line)', () => {
		expect(resolveSource(source({ work: 'gone', id: 'gone' }), library)).toBeNull();
		expect(resolveSource(source(), { entries: [], hash: library.hash })).toBeNull();
	});
});

describe('the record’s transitions', () => {
	const base: PoemSource = { id: 'i', work: 'w', poemHash: 'h', start: 0, end: 5, answered: false, edited: false };

	it('keeping answers the card and nothing else', () => {
		expect(kept(base)).toEqual({ ...base, answered: true });
		expect(base.answered).toBe(false); // the argument is not changed
	});

	it('an edit sets both flags, and the source stays', () => {
		expect(edited(base)).toEqual({ ...base, edited: true, answered: true });
		expect(edited(kept(base))).toEqual({ ...base, edited: true, answered: true });
	});

	it('the replace guard asks over an edited or a singer’s poem, never over an unedited library one', () => {
		expect(heldForGuard(base, 'text')).toBe('');
		expect(heldForGuard(kept(base), 'text')).toBe('');
		expect(heldForGuard(edited(base), 'text')).toBe('text');
		expect(heldForGuard(null, 'text')).toBe('text');
		expect(heldForGuard(null, '')).toBe('');
	});
});

describe('replacesLibraryPoem: a paste into Poem that is another poem, or an edit of this one', () => {
	const text = entry('Спящая княжна').textModern;
	const f = foldLetters;

	it('is an edit when the text still holds a run of the poem: a typo, an added line, a deleted line, a variant word', () => {
		expect(replacesLibraryPoem(text, text.replace('глухом', 'глухомь'), f)).toBe(false);
		expect(replacesLibraryPoem(text, text + '\nЕщё одна строка', f)).toBe(false);
		expect(replacesLibraryPoem(text, text.split('\n').slice(2).join('\n'), f)).toBe(false);
		expect(replacesLibraryPoem(text, text.replace('Спит', 'Спи'), f)).toBe(false);
	});

	it('is a replacement when nothing of the poem is left in it', () => {
		expect(replacesLibraryPoem(text, entry('Могила').textModern, f)).toBe(true);
		expect(replacesLibraryPoem(text, 'Совсем другие слова, которых здесь нет и в помине', f)).toBe(true);
	});

	it('is a replacement when the text is emptied', () => {
		expect(replacesLibraryPoem(text, '', f)).toBe(true);
		expect(replacesLibraryPoem(text, '  \n ', f)).toBe(true);
	});

	it('the run is 20 letters', () => {
		expect(RUN).toBe(20);
		const a = 'абвгдежзиклмнопрстуфхцчшщыэюя'; // 29 letters, none repeated
		expect(replacesLibraryPoem(a, a.slice(0, 19) + 'ь' + a.slice(20), f)).toBe(true); // a run of 19 left
		expect(replacesLibraryPoem(a, a.slice(0, 20) + 'ь' + a.slice(21), f)).toBe(false); // a run of 20 left
	});
});

describe('cardLine: a first line as the card quotes it', () => {
	it('drops the data’s own quote marks and a trailing comma, so «» are not doubled', () => {
		expect(cardLine('«Дитя моё,')).toBe('Дитя моё');
		expect(cardLine('— Дитя моё, останься здесь со мной:')).toBe('Дитя моё, останься здесь со мной');
		expect(cardLine('  «Дайте бокалы!»  ')).toBe('Дайте бокалы!');
		expect(cardLine('"Quoted;"')).toBe('Quoted');
	});
	it('keeps the marks that end a line: an exclamation, a question, a full stop, an ellipsis', () => {
		expect(cardLine('Дайте бокалы!')).toBe('Дайте бокалы!');
		expect(cardLine('Куда ты?')).toBe('Куда ты?');
		expect(cardLine('Спит княжна…')).toBe('Спит княжна…');
		expect(cardLine('Всё.')).toBe('Всё.');
	});
	it('is empty for a line of nothing', () => {
		expect(cardLine('')).toBe('');
		expect(cardLine('«»')).toBe('');
	});
});

describe('passageLine: the wording of a passage (D4, ratified oracle «Дитя моё, останься здесь со мной»)', () => {
	it('joins lines with a space until the words reach four, drops the closing punctuation, lowers each later line’s first letter', () => {
		expect(passageLine('«Дитя моё,\nОстанься здесь со мной:\nВ воде привольное житье', 0)).toBe('Дитя моё, останься здесь со мной');
	});
	it('keeps a capital after a line that ends a sentence (. ! ? …), and lowers it after a comma or nothing (part 6)', () => {
		expect(passageLine('Весело на пашне.\nНу, тащися, сивка', 0)).toBe('Весело на пашне. Ну, тащися, сивка');
		expect(passageLine('Дайте бокалы!\nДайте вина', 0)).toBe('Дайте бокалы! Дайте вина');
		expect(passageLine('Куда ты?\nСпроси меня…\nЕщё раз', 0)).toBe('Куда ты? Спроси меня'); // four words reached; the closing … is dropped
		expect(passageLine('Дитя моё,\nОстанься здесь со мной:', 0)).toBe('Дитя моё, останься здесь со мной');
		expect(passageLine('Раз\nДва, три\nЧетыре', 0)).toBe('Раз два, три четыре');
	});
	it('stops at the first line when it already holds four words', () => {
		expect(passageLine('Спит. Спит в лесу глухом,\nСпит княжна во сне', 0)).toBe('Спит. Спит в лесу глухом');
	});
	it('takes the lines of one stanza only, and starts where it is told', () => {
		const t = 'Один\nДва\n\nТри\nЧетыре\nПять\nШесть';
		expect(passageLine(t, 0)).toBe('Один два'); // two words, and the stanza ends: it does not run on into the next
		expect(passageLine(t, t.indexOf('Три'))).toBe('Три четыре пять шесть');
	});
	it('drops every kind of closing punctuation and quote, and a leading mark or dash', () => {
		expect(passageLine('— Куда ты идёшь?\nСпроси у меня…»', 0)).toBe('Куда ты идёшь? Спроси у меня'); // a capital stays after the ?
		expect(passageLine('Раз два три четыре!', 0)).toBe('Раз два три четыре');
	});
	it('is empty where there is nothing at the offset', () => {
		expect(passageLine('', 0)).toBe('');
		expect(passageLine('\n\n', 0)).toBe('');
	});

	it('every stanza start of every library entry: no joined line begins with a proper noun (the list the desk reviewed is pinned)', () => {
		// The stanza starts of 14 entries (a dating block is not one: it is never a passage's start); some joined lines begin with a capital. Each is an ordinary word at the start of a verse
		// line. If the library grows and a new one appears, this fails so that it is read, not lowered by habit.
		const firsts = new Set<string>();
		let starts = 0;
		for (const e of library.entries) {
			for (const b of bodyStanzas(e.textModern)) {
				starts++;
				const lines: string[] = [];
				let words = 0;
				for (const raw of e.textModern.slice(b.start).split('\n')) {
					const l = raw.trim();
					if (l === '') break;
					lines.push(l);
					words += l.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
					if (words >= 4) break;
				}
				for (const l of lines.slice(1)) {
					const w = l.replace(/^[^\p{L}]+/u, '').split(/\s+/)[0].replace(/[^\p{L}-]/gu, '');
					if (/^\p{Lu}/u.test(w)) firsts.add(w);
				}
			}
		}
		expect(starts).toBe(77);
		expect([...firsts].sort()).toEqual(['Борону', 'В', 'Дайте', 'Из', 'Мать-земля', 'Много', 'На', 'Накормлю', 'Ночью', 'Ну', 'Останься', 'Пашней', 'С', 'Я']);
	});
});

describe('cutFor: the whole poem she sings, unless she sings a passage of a long one (step 8, part 2)', () => {
	// Fable's measured table (as-built review, 2026-11-04): coverage of the one alignment, poem letters over Lyrics letters, and the rule's answer.
	const TABLE: [string, number, number, 'whole' | 'cut'][] = [
		['P', 0.331, 3.4, 'whole'],
		['S', 0.942, 58.4, 'cut'],
		['T', 0.915, 1.23, 'whole'],
		['U1', 1, 1.0, 'whole'],
		['U6', 1, 1.1, 'whole'],
		['r114-song2', 0.614, 0.69, 'whole'],
		['r114-song3', 0.558, 1.3, 'whole'],
		['r114-song4', 0.73, 1.09, 'whole'],
		['r114-song5', 0.935, 2.14, 'whole'],
	];
	for (const [name, coverage, ratio, answer] of TABLE) {
		it(`${name}: coverage ${coverage}, ratio ${ratio}, ${answer}`, () => {
			const m = matchPoem(fixture(name), library)!;
			expect(m.coverage, 'coverage').toBeCloseTo(coverage, 2);
			expect(m.entry.letters.length / m.queryLetters, 'ratio').toBeCloseTo(ratio, 1);
			const cut = cutFor(m);
			const body = stanzaCut(m.entry.textModern, 0, m.entry.textModern.length);
			if (answer === 'whole') {
				expect(cut.whole).toBe(true);
				expect(cut.text).toBe(body.text);
			} else {
				expect(cut.whole).toBe(false);
				expect(cut.text.length).toBeLessThan(m.entry.textModern.length / 20);
			}
		});
	}

	it('P and the two row 114 songs that stanzaCut cut short now fill whole (5, 5 and 4 body stanzas; «Русская песня» has a sixth block, its dating line)', () => {
		for (const [name, stanzaCount] of [['P', 5], ['r114-song4', 5], ['r114-song5', 4]] as const) {
			const m = matchPoem(fixture(name), library)!;
			const cut = cutFor(m);
			expect(bodyStanzas(cut.text).length, name).toBe(stanzaCount);
			expect(stanzaCut(m.entry.textModern, m.start, m.end).whole, `${name}: the old rule cut it`).toBe(false);
		}
	});

	it('a poor scan of the fish’s song (coverage well under 0.8) still cuts, because «Мцыри» is more than ten times it', () => {
		const words = fixture('S').split(/\s+/);
		const noisy = words.map((w, i) => (i % 3 === 0 ? 'ааааа' : w)).join(' ');
		const m = matchPoem(noisy, library)!;
		expect(m, 'the noisy scan still matches').not.toBeNull();
		expect(m.entry.title).toBe('Мцыри');
		expect(m.coverage).toBeLessThan(PASSAGE_COVERAGE + 0.15);
		expect(m.entry.letters.length / m.queryLetters).toBeGreaterThan(LONG_POEM_RATIO);
		expect(cutFor(m).whole).toBe(false);
		expect(cutFor(m).text.length).toBeLessThan(m.entry.textModern.length / 20);
	});

	it('the two clauses: a long poem at high coverage cuts; at low coverage and a ratio between 3 and 10 it fills whole', () => {
		const entry = library.entries.find((e) => e.title === 'Спящая княжна')!;
		const base = { entry, work: entry.work, score: 1, second: 0, margin: 1, letterStart: 0, letterEnd: 10, start: 0, end: 60 };
		const mk = (queryLetters: number, coverage: number) => ({ ...base, queryLetters, coverage });
		const n = entry.letters.length;
		expect(cutFor(mk(Math.floor(n / 5), 0.9)).whole).toBe(false); // ratio 5, coverage 0.9: a passage
		expect(cutFor(mk(Math.floor(n / 5), 0.5)).whole).toBe(true); // ratio 5, coverage 0.5: whole
		expect(cutFor(mk(Math.floor(n / 2), 0.9)).whole).toBe(true); // ratio 2: whole whatever the coverage
		expect(cutFor(mk(Math.floor(n / 11), 0.2)).whole).toBe(false); // ratio 11: a passage whatever the coverage
	});
});

describe('showsLine: the title is not printed twice (step 8, part 5)', () => {
	const titled = library.entries.find((e) => e.id === '21568f1c1e')!;
	const koltsov = library.entries.find((e) => e.id === '0127a63ffe')!;
	it('a poem titled by its first line: no line for the whole poem, a line for a passage', () => {
		expect(cardLine(titled.title)).toBe(cardLine(titled.incipit)); // «Средь шумного бала, случайно» both
		expect(showsLine(titled.title, titled.incipit, false)).toBe(false);
		expect(showsLine(titled.title, titled.incipit, true)).toBe(true);
	});
	it('a poem with a title of its own shows its first line', () => {
		expect(showsLine(koltsov.title, koltsov.incipit, false)).toBe(true);
		expect(showsLine(koltsov.title, koltsov.incipit, true)).toBe(true);
	});
	it('the first line the card would print is found as the resolver finds it, on the shipped entry', () => {
		const r = resolveSource({ id: titled.id, work: titled.work, poemHash: library.hash, start: 0, end: titled.textModern.length, answered: false, edited: false }, library)!;
		expect(showsLine(r.entry.title, r.firstLine, r.passage)).toBe(false);
	});
	it('the card omits the paragraph, not just empties it', () => {
		const card = readFileSync(join(ROOT, 'apps/web/src/lib/components/Drawer/PoemLibraryCard.svelte'), 'utf8');
		expect(card).toContain('{#if naming.line}<p class="line">{naming.line}</p>{/if}');
	});
});
