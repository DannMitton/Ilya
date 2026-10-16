/**
 * poem-compare.test.ts: N.135 stage 3. The comparison that colours Lyrics and
 * greys Poem, and the helper that lets four equality sites ignore line breaks.
 */
import { describe, it, expect } from 'vitest';
import { comparePoem, fold, layOutLikePoem, lyricsSegments, poemSegments, tokenize } from './poem-compare';
import { sameWords } from './same-words';

const POEM = 'Средь шумного бала,\nСлучайно, в тревоге мирской суеты,\nТебя я увидел.';

function differing(lyrics: string, poem = POEM): string[] {
	const cmp = comparePoem(lyrics, poem);
	if (!cmp) throw new Error('no comparison');
	return cmp.lyrics.filter((_, i) => !cmp.lyricsMatched[i]).map((t) => lyrics.slice(t.start, t.end));
}

function omitted(lyrics: string, poem = POEM): string[] {
	const cmp = comparePoem(lyrics, poem);
	if (!cmp) throw new Error('no comparison');
	return cmp.poem.filter((_, i) => !cmp.poemMatched[i]).map((t) => poem.slice(t.start, t.end));
}

describe('fold', () => {
	it('folds case, edge punctuation, ё, and an inner hyphen', () => {
		expect(fold('Тебя,')).toBe('тебя');
		expect(fold('«Тебя»')).toBe('тебя');
		expect(fold('те-бя')).toBe('тебя');
		expect(fold('Всё')).toBe('все');
	});

	it('reads the old spelling in the modern, so a print and a poem agree', () => {
		expect(fold('безъ')).toBe(fold('без'));
	});

	it('gives punctuation alone an empty fold', () => {
		expect(fold('—')).toBe('');
		expect(fold('...')).toBe('');
	});
});

describe('comparePoem', () => {
	it('colours nothing when the sung text is the poem', () => {
		const cmp = comparePoem(POEM.replace(/\n/g, ' '), POEM)!;
		expect(cmp.differing).toBe(0);
		expect(cmp.omitted).toBe(0);
	});

	it('is null while the Poem is empty, so nothing is coloured', () => {
		expect(comparePoem('Тебя я увидел', '')).toBeNull();
		expect(comparePoem('Тебя я увидел', '  \n ')).toBeNull();
	});

	it('is null while the Lyrics are empty', () => {
		expect(comparePoem('', POEM)).toBeNull();
	});

	it('colours a composer\'s repeat, the extra copy and not the first', () => {
		const lyrics = 'Тебя я увидел, тебя я увидел';
		expect(differing(lyrics, 'Тебя я увидел')).toEqual(['тебя', 'я', 'увидел']);
		const cmp = comparePoem(lyrics, 'Тебя я увидел')!;
		expect(cmp.lyricsMatched.slice(0, 3)).toEqual([true, true, true]);
	});

	it('colours a repeat in the middle of the text', () => {
		const lyrics = 'Средь шумного бала, шумного бала Случайно в тревоге мирской суеты Тебя я увидел';
		expect(differing(lyrics)).toEqual(['шумного', 'бала']);
	});

	it('greys a poem word the composer left out', () => {
		const lyrics = 'Средь шумного бала Случайно мирской суеты Тебя я увидел';
		expect(omitted(lyrics)).toEqual(['в', 'тревоге']);
		expect(differing(lyrics)).toEqual([]);
	});

	it('shows an altered word on both sides', () => {
		const lyrics = 'Средь шумного бала Случайно в тревоге мирской суеты Тебя я увидал';
		expect(differing(lyrics)).toEqual(['увидал']);
		expect(omitted(lyrics)).toEqual(['увидел.']);
	});

	it('matches an old-spelling print to the modern poem', () => {
		const lyrics = 'Средь шумнаго бала Случайно в тревоге мирской суеты Тебя я увидел';
		expect(differing(lyrics)).toEqual([]);
	});

	it('matches a modern poem to an old-spelling one', () => {
		expect(comparePoem('Тебя я увидел', 'Тебя я увидѣлъ')).not.toBeNull();
	});

	it('never counts a syllable hyphen as a difference (Dann 00:40)', () => {
		const lyrics = 'Средь шум-но-го ба-ла Слу-чай-но в тре-во-ге мир-ской су-е-ты Те-бя я у-ви-дел';
		expect(differing(lyrics)).toEqual([]);
	});

	it('does not count a dash standing alone as a word', () => {
		const cmp = comparePoem('Тебя — я увидел', 'Тебя я увидел')!;
		expect(cmp.differing).toBe(0);
		expect(cmp.lyricsMatched[1]).toBe(true);
	});

	it('shows a reordered passage as both a colour and a grey', () => {
		const poem = 'один два три четыре';
		const lyrics = 'три четыре один два';
		const cmp = comparePoem(lyrics, poem)!;
		expect(cmp.differing).toBeGreaterThan(0);
		expect(cmp.omitted).toBeGreaterThan(0);
		expect(cmp.differing).toBe(cmp.omitted);
	});

	it('declines past the table cap rather than colour wrongly', () => {
		const big = Array.from({ length: 2100 }, (_, i) => `слово${i}`).join(' ');
		const other = Array.from({ length: 2100 }, (_, i) => `иное${i}`).join(' ');
		expect(comparePoem(big, other)).toBeNull();
	});
});

describe('segments', () => {
	it('cut the Lyrics into pieces that join back to the text exactly', () => {
		const lyrics = '  Тебя я  увидел,\n тебя я увидел ';
		const cmp = comparePoem(lyrics, 'Тебя я увидел');
		const segs = lyricsSegments(lyrics, cmp);
		expect(segs.map((s) => s.text).join('')).toBe(lyrics);
		expect(segs.filter((s) => s.kind === 'differs').map((s) => s.text)).toEqual(['тебя', 'я', 'увидел']);
	});

	it('cut the Poem into pieces that join back, and mark the omitted words', () => {
		const lyrics = 'Средь шумного бала Тебя я увидел';
		const segs = poemSegments(POEM, comparePoem(lyrics, POEM));
		expect(segs.map((s) => s.text).join('')).toBe(POEM);
		expect(segs.filter((s) => s.kind === 'omitted').map((s) => s.text)).toEqual(['Случайно,', 'в', 'тревоге', 'мирской', 'суеты,']);
	});

	it('are one plain piece when there is no comparison', () => {
		expect(lyricsSegments('слово', null)).toEqual([{ text: 'слово', kind: 'plain' }]);
		expect(poemSegments('', null)).toEqual([{ text: '', kind: 'plain' }]);
	});

	it('tokenize records the line each word stands on', () => {
		expect(tokenize('а б\nв').map((t) => t.line)).toEqual([0, 0, 1]);
	});
});

describe('layOutLikePoem', () => {
	const oneLine = 'Средь шумного бала, Случайно, в тревоге мирской суеты, Тебя я увидел.';

	it('adopts the poem\'s line ends', () => {
		expect(layOutLikePoem(oneLine, POEM)).toBe(POEM);
	});

	it('keeps the words\' own capitals, punctuation, and hyphens', () => {
		const lyrics = 'Средь шум-но-го ба-ла, Слу-чай-но, в тре-во-ге мир-ской су-е-ты, Те-бя я у-ви-дел.';
		expect(layOutLikePoem(lyrics, POEM)).toBe(
			'Средь шум-но-го ба-ла,\nСлу-чай-но, в тре-во-ге мир-ской су-е-ты,\nТе-бя я у-ви-дел.',
		);
	});

	it('puts a repeated passage on a line of its own', () => {
		const lyrics = `${oneLine} Тебя я увидел.`;
		expect(layOutLikePoem(lyrics, POEM)).toBe(`${POEM}\nТебя я увидел.`);
	});

	it('puts a repeat between two lines on its own line', () => {
		const lyrics = 'Средь шумного бала, шумного бала, Случайно, в тревоге мирской суеты, Тебя я увидел.';
		expect(layOutLikePoem(lyrics, POEM)).toBe(
			'Средь шумного бала,\nшумного бала,\nСлучайно, в тревоге мирской суеты,\nТебя я увидел.',
		);
	});

	it('keeps an altered word inline on its line', () => {
		const lyrics = 'Средь шумного бала, Случайно, в тревоге мирской суеты, Тебя я увидал.';
		expect(layOutLikePoem(lyrics, POEM)).toBe('Средь шумного бала,\nСлучайно, в тревоге мирской суеты,\nТебя я увидал.');
	});

	it('leaves an omitted passage out and breaks where the poem breaks', () => {
		const lyrics = 'Средь шумного бала, Тебя я увидел.';
		expect(layOutLikePoem(lyrics, POEM)).toBe('Средь шумного бала,\nТебя я увидел.');
	});

	it('is null with no Poem, and with no word in common', () => {
		expect(layOutLikePoem(oneLine, '')).toBeNull();
		expect(layOutLikePoem('раз два', 'три четыре')).toBeNull();
	});

	it('changes only whitespace: the words, joined, are the Lyrics\' own', () => {
		const out = layOutLikePoem(oneLine, POEM)!;
		expect(sameWords(out, oneLine)).toBe(true);
	});
});

describe('sameWords', () => {
	it('ignores line breaks and runs of whitespace', () => {
		expect(sameWords('а б в', 'а\nб  в\n')).toBe(true);
		expect(sameWords('а б в', ' а\r\nб\tв')).toBe(true);
	});

	it('still tells a changed word, a capital, and a missing word', () => {
		expect(sameWords('а б в', 'а б г')).toBe(false);
		expect(sameWords('а б в', 'А б в')).toBe(false);
		expect(sameWords('а б в', 'а б')).toBe(false);
	});

	it('treats two empty texts as the same', () => {
		expect(sameWords('', ' \n ')).toBe(true);
	});
});
