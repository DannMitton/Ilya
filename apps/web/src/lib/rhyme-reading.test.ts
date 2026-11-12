/**
 * The -кий rhyme reading (`rhyme-reading.ts`), on the real dictionary and the real engine. The fixtures are constructed
 * two-line texts, not verse (Fable r1, 2026-11-10, finding 13): they test the mechanism. The word data are what the pipeline
 * holds after the dictionary lookup (stress, source, homograph flag, part of speech); a word with ё takes its stress from the
 * ё, as `buildResolvedWord` does. The full path through `processText` is tested with step 3.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { GraysonEngine } from '@ilya/phonology';
import { loadRealDictionary } from './score/row108.support';
import { rhymeReading, rhymeTail, stampRhymePartner, type RhymeLine, type RhymeProbe, type RhymeWord } from './rhyme-reading';

beforeAll(() => loadRealDictionary());

const VOWELS = /[аеёиоуыэюя]/g;

function wordOf(spelling: string, over: Partial<RhymeWord> = {}): RhymeWord {
	const cleanWord = spelling;
	const yo = cleanWord.indexOf('ё');
	const lookup = GraysonEngine.lookupStress(cleanWord);
	let stress = -2;
	let stressSource = 'inferred';
	if (yo >= 0) {
		stress = (cleanWord.slice(0, yo + 1).match(VOWELS) ?? []).length - 1;
		stressSource = 'dictionary';
	} else if (lookup && lookup.stress != null && lookup.stress >= 0) {
		stress = lookup.stress;
		stressSource = lookup.source ?? 'dictionary';
	}
	return { cleanWord, stress, stressSource, isHomograph: lookup?.isHomograph ?? false, pos: lookup?.pos ?? '', ...over };
}

const probe: RhymeProbe = (w, adjectival) =>
	GraysonEngine.transcribe(w.cleanWord, w.stress, false, null, { adjectival }).ipa;

/** Lines separated by '\n'; a blank line ends a stanza. Each word is looked up as the page would. */
function read(text: string, over: Record<string, Partial<RhymeWord>> = {}): Map<string, string> {
	const raw = text.split('\n');
	const lines: RhymeLine[] = [];
	raw.forEach((l, i) => {
		if (l.trim() === '') return;
		lines.push({
			words: l.trim().split(/\s+/).map((w) => wordOf(w, over[w])),
			endsStanza: raw[i + 1] !== undefined && raw[i + 1].trim() === '',
		});
	});
	return rhymeReading(lines, probe);
}

describe('rhyme-reading: the tail', () => {
	it('runs from the stressed vowel to the end, with stressed [ɨ] as [i]', () => {
		expect(rhymeTail('ɡɫuˈbokʌj')).toBe('okʌj');
		expect(rhymeTail('ˈzɨpkʌj')).toBe('ipkʌj');
		expect(rhymeTail('ˈɡʲipkʌj')).toBe('ipkʌj');
		expect(rhymeTail('ɡɫuboj')).toBeNull();
	});
});

describe('rhyme-reading: the case table (Fable r1, finding 13)', () => {
	it('-кой then -кий, adjacent: literary, naming the partner', () => {
		expect([...read('глубокой\nвысокий')]).toEqual([['1-0', 'глубокой']]);
	});

	it('-кий then -кой, the other way round', () => {
		expect([...read('высокий\nглубокой')]).toEqual([['0-0', 'глубокой']]);
	});

	it('the six-line run: далёкий, four lines from глубокой, is matched through the chain', () => {
		const m = read('дней\nглубокой\nречей\nвысокий\nлюдей\nдалёкий');
		expect(m.get('3-0')).toBe('глубокой');
		expect(m.get('5-0')).toBe('глубокой');
		expect(m.size).toBe(2);
	});

	it('сладкий / краткой: the sounds agree though the letters differ', () => {
		expect([...read('сладкий\nкраткой')]).toEqual([['0-0', 'краткой']]);
	});

	it('гибкий / зыбкой: и and ы are one stressed vowel', () => {
		expect([...read('гибкий\nзыбкой')]).toEqual([['0-0', 'зыбкой']]);
	});

	it('зыбкий / улыбкой (a noun partner, ruling 2026-11-09 21:11): literary', () => {
		expect([...read('зыбкий\nулыбкой')]).toEqual([['0-0', 'улыбкой']]);
	});

	it('a stressed partner (рекой / недалёкий): default', () => {
		expect(read('рекой\nнедалёкий').size).toBe(0);
	});

	it('non-velar (синий / длинной): default', () => {
		expect(read('синий\nдлинной').size).toBe(0);
	});

	it('the pair on one line, no break: default', () => {
		expect(read('глубокой высокий').size).toBe(0);
		expect(read('высокий глубокой').size).toBe(0);
	});

	it('a blank line between the pair: default', () => {
		expect(read('глубокой\n\nвысокий').size).toBe(0);
	});

	it('four unrelated lines between the pair: default; three keep it', () => {
		expect(read('глубокой\nдней\nречей\nлюдей\nвысокий').size).toBe(0);
		expect(read('глубокой\nдней\nречей\nвысокий').size).toBe(1);
	});

	it('далекий without ё has no stress and does not match; with ё it does', () => {
		expect(read('глубокой\nдалекий').size).toBe(0);
		expect(read('глубокой\nдалёкий').size).toBe(1);
	});

	it('a homograph partner not yet resolved: default; literary once the singer sets the stress', () => {
		expect(read('убогий\nдорогой', { дорогой: { isHomograph: true } }).size).toBe(0);
		expect([...read('убогий\nдорогой', { дорогой: { isHomograph: true, stressSource: 'user-override' } })]).toEqual([['0-0', 'дорогой']]);
	});

	it('a homograph trigger not yet resolved: default', () => {
		expect(read('убогий\nдорогой', { убогий: { isHomograph: true } }).size).toBe(0);
	});

	it('тонкий / звонкий: two triggers and no partner, default on both', () => {
		expect(read('тонкий\nзвонкий').size).toBe(0);
	});

	it('русский / узкой: русский keeps its lexical reading, so no tail matches', () => {
		expect(read('русский\nузкой').size).toBe(0);
	});

	it('a trigger followed by an enclitic («высокий ли»): the line-final word is «ли», default', () => {
		expect(read('глубокой\nвысокий ли').size).toBe(0);
	});
});

describe('rhyme-reading: the rule', () => {
	it('only the line-final word is read: the same word earlier in the line is not a key', () => {
		const m = read('далёкий далёкий\nглубокой');
		expect([...m.keys()]).toEqual(['0-1']);
	});

	it('a trigger with no stress mark in the probe never matches (no tail to compare)', () => {
		const lines: RhymeLine[] = [
			{ words: [wordOf('глубокой')], endsStanza: false },
			{ words: [wordOf('высокий')], endsStanza: false },
		];
		expect(rhymeReading(lines, () => 'vɨsokʌj').size).toBe(0);
	});

	it('a «name» partner (Волгой) is not a partner', () => {
		const lines: RhymeLine[] = [
			{ words: [wordOf('Волгой', { stress: 0, stressSource: 'dictionary', pos: 'name' })], endsStanza: false },
			{ words: [wordOf('недолгий', { stress: 1, stressSource: 'dictionary', pos: 'adj' })], endsStanza: false },
		];
		expect(rhymeReading(lines, probe).size).toBe(0);
	});

	it('names the nearest partner, the earlier line on a tie', () => {
		const m = read('глубокой\nречей\nвысокий\nречей\nглубокой');
		expect(m.get('2-0')).toBe('глубокой');
		const far = read('глубокой\nдней\nвысокий\nречей\nглубокой');
		expect(far.get('2-0')).toBe('глубокой');
		expect(far.size).toBe(1);
	});

	it('a stanza break ends the chain, and each stanza is read on its own', () => {
		const m = read('глубокой\nвысокий\n\nвысокий\nречей');
		expect([...m.keys()]).toEqual(['1-0']);
	});

	it('a refrain: each copy finds its own partner', () => {
		const m = read('глубокой\nвысокий\n\nглубокой\nвысокий');
		expect([...m.keys()].sort()).toEqual(['1-0', '3-0']);
	});
});

describe('rhyme-reading: the partner on the entry', () => {
	it('is stamped on the ⟨и⟩ entry only, and drops <, >, and & (the Inspector prints the note as HTML)', () => {
		const log = [
			{ features: { type: 'vowel', exception: 'velar-adjectival-rhyme' } },
			{ features: { type: 'vowel', exception: 'velar-adjectival' } },
		];
		stampRhymePartner(log, 'глу<b>бокой&');
		expect(log[0].features).toMatchObject({ word: 'глуbбокой' });
		expect(log[1].features).not.toHaveProperty('word');
	});
});
