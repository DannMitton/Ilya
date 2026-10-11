/**
 * QUEUE row 25, N.12 increment 2: the old spelling's endings, and the old
 * spelling under the notes. Each test is named for the brief's section 6 item
 * it holds (`docs/sessions/brief-code-old-spelling-endings-and-the-notes_r1_2026-10-02.md`).
 *
 * The real dictionary is loaded, as `approval/ipa-corpus.approval.test.ts`
 * loads it, because every rule here is a proposal the dictionary disposes of.
 * The pinned outputs for the words that must not move were recorded on the
 * tree before this row (`cloud-lane` at `18b3b760`, the row 50 commit).
 *
 * The score is Tchaikovsky's op. 38 no. 3 with A. K. Tolstoy's words as
 * Jurgenson printed them in 1878 (public domain), the file of the brief's
 * section 1, kept as a fixture.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { MusicXmlScoreParser, type ParsedScore, type ScoreParser } from '@ilya/score-parser';
import { processText } from '$lib/pipeline';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps } from '$lib/score/ingestion/ingest';
import { buildUnderlayResolvers, collectScoreWords } from '$lib/score/vowel-resolver';
import type { WordStackData } from '$lib/types';

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

const word = (text: string): WordStackData => processText(text)[0].words[0];

describe('the old genitive endings', () => {
	it('1. «шумнаго» reads as «шумного»: no VERIFY box, the dictionary’s stress, and exactly «шумного»’s IPA', () => {
		const old = word('шумнаго');
		const modern = word('шумного');
		expect(old.cyrillic).toBe('шумного');
		expect(old.stressSource).toBe('dictionary');
		expect(old.stressIndex).toBe(modern.stressIndex);
		expect(old.ipaDisplay).toBe(modern.ipaDisplay);
		expect(old.ipaDisplay).toBe('ˈʃum nʌ vʌ');
		expect(old.preReformSource).toBe('шумнаго');
	});

	it('2. -яго reads as -его, and -аго after a hushing consonant as -его or -ого, whichever lemma agrees', () => {
		expect(word('синяго').cyrillic).toBe('синего');
		expect(word('синяго').ipaDisplay).toBe(word('синего').ipaDisplay);
		expect(word('хорошаго').cyrillic).toBe('хорошего');
		expect(word('хорошаго').ipaDisplay).toBe(word('хорошего').ipaDisplay);
		// «большего» is «больший»'s; «большаго» is «большой»'s, so it reads «большого».
		expect(word('большаго').cyrillic).toBe('большого');
	});

	it('3. a modern word ending in -аго or -яго gives today’s result, to the byte', () => {
		const pinned: Record<string, [string, number, string, string]> = {
			благо: ['благо', 0, 'dictionary', 'ˈbɫɑ ɡʌ'],
			саго: ['саго', 0, 'dictionary', 'ˈsɑ ɡʌ'],
			Чикаго: ['Чикаго', 1, 'dictionary', 'tʃʲi ˈkɑ ɡʌ'],
			Сантьяго: ['Сантьяго', 1, 'dictionary', 'sɑɲ ˈtʲjɑ ɡʌ'],
			имаго: ['имаго', 1, 'dictionary', 'i ˈmɑ ɡʌ'],
		};
		for (const [w, [cyrillic, stress, source, ipa]] of Object.entries(pinned)) {
			const x = word(w);
			expect([x.cyrillic, x.stressIndex, x.stressSource, x.ipaDisplay, x.preReformSource ?? null], w).toEqual([cyrillic, stress, source, ipa, null]);
		}
	});

	it('leaves a form whose lemma disagrees exactly as it was («самаго», «данныя»)', () => {
		expect(word('самаго').cyrillic).toBe('самаго');
		expect(word('данныя').cyrillic).toBe('данныя');
	});
});

describe('the lookup-only twins', () => {
	it('4. «печальныя» takes stress and gloss from «печальные», and keeps its own letters on the page and in the IPA', () => {
		const old = word('печальныя');
		const twin = word('печальные');
		expect(old.cyrillic).toBe('печальныя');
		expect(old.stressIndex).toBe(twin.stressIndex);
		expect(old.stressSource).toBe('dictionary');
		expect(old.gloss).toEqual(twin.gloss);
		// Before this row: 'pʲe tʃʲalʲ nɨ jɑ', stress inferred.
		expect(old.ipaDisplay).toBe('pʲi ˈtʃʲalʲ nɨ jɪ');
	});

	it('4. «большія» takes its stress from «большие», keeps its spelling, and is transcribed from the letter-mapped «большия»', () => {
		const old = word('большія');
		expect(old.cyrillic).toBe('большія');
		expect(old.stressIndex).toBe(word('большие').stressIndex);
		// Before this row: 'bolʲʃ ɑ', the і deleted by the engine and no stress.
		expect(old.ipaDisplay).toBe('bɑlʲ ˈʃɨ jɑ');
	});
});

describe('the old spelling under the notes', () => {
	const parser: ScoreParser = {
		canParse: () => true,
		parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
	};
	const deps: IngestDeps = {
		scoreReader: { convert: async () => { throw new Error('not reached'); }, dispose: () => {} } as never,
		musicxmlParser: parser,
	};
	const load = async (file: string): Promise<ParsedScore> => {
		const out = await ingestScoreFile(new File([readFileSync(join(FIXTURES, file), 'utf8')], file), deps);
		if (!out.ok) throw new Error('ingest failed');
		return out.ingested.result.score;
	};

	it('5. every note of the Tchaikovsky song carries IPA, and «шум-на-го» prints «шум-но-го» over test 1’s IPA', async () => {
		const parsed = await load('tchaikovsky-op38-3-voice.musicxml');
		const r = buildUnderlayResolvers(parsed, 1, {});
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		const words = collectScoreWords(parsed, 1);
		const withheld = words.filter((w) => w.slots.some((s) => s.length && r.withheld(byId.get(s[0])!)));
		expect(withheld.map((w) => w.raw)).toEqual([]);
		const shum = words.find((w) => w.raw === 'шумнаго')!;
		const onsets = shum.slots.map((s) => byId.get(s[0])!);
		expect(onsets.map((e) => r.cyrillic?.(e) ?? e.syllable?.text)).toEqual(['шум', 'но', 'го']);
		expect(onsets.map((e) => r.ipa(e)).join(' ')).toBe('ˈʃum nʌ vʌ');
	});

	it('6. a song in modern spelling is unchanged: nothing respelled, nothing withheld', async () => {
		const parsed = await load('sunless-01-engraved.musicxml');
		const r = buildUnderlayResolvers(parsed, 1, {});
		expect(parsed.vocalLine.filter((e) => r.cyrillic?.(e) !== undefined)).toEqual([]);
		expect(parsed.vocalLine.filter((e) => r.withheld(e))).toEqual([]);
	});
});
