/**
 * Approval (golden-master) test for the text-to-IPA pipeline
 * (`processText`, `pipeline.ts`, 1,064 lines) end to end through the real
 * `GraysonEngine` (`@ilya/phonology`) with the REAL, full dictionary
 * injected, not the inference-mode fallback most of this app's other
 * tests run under.
 *
 * WHY A REAL DICTIONARY, LOADED HERE. Every other `apps/web` test calling
 * `processText` runs with no dictionary injected (grep
 * `setStressDictionary(` under `apps/web/src` outside this file and
 * `loader.ts`/`ocr-guard.ts` turns up nothing), which `reading-aid.test.ts`'s
 * own header says explicitly: those tests "hold whether or not the
 * dictionary is loaded". A stress/IPA approval with no dictionary would be
 * pinning the engine's bare-inference fallback, not the tool singers
 * actually use. The audit brief also asks for the loaded dictionary's
 * entry count IN the approved output "so a partial dictionary cannot pass
 * silently", which only means something if the real dictionary is loaded.
 *
 * WHY THIS FILE DOES NOT CALL `$lib/loader.ts`'s `loadDictionary`.
 * `loadDictionary` is browser-only: it calls `fetch()` against
 * `/data/...`, IndexedDB, and `requestIdleCallback`, none of which exist
 * under vitest's node environment (no server is running to serve
 * `/data/` either). No existing test in this repository calls it (same
 * grep as above). The dictionary FILES it would have fetched are
 * committed as static assets at `apps/web/static/data/` (real, ~47 MB
 * NDJSON shards, per `dictionary-manifest.json`), so this file reads them
 * directly off disk with `node:fs` and performs the same key mapping
 * `loadDictionary`'s private `mapSingleEntry` does (loader.ts:301-311:
 * compress `e`/`f` into a `g: {en, fr}` bilingual gloss), reproduced
 * inline below because `mapSingleEntry` is not exported. The lazy gloss
 * tier (full E/F glosses) and the homograph tier are NOT loaded: neither
 * feeds `GraysonEngine.lookupStress`'s stress result or `processText`'s
 * IPA, only the full-gloss and homograph-alternate display, which this
 * corpus does not exercise or assert on.
 *
 * Timing: reading and parsing both dictionary shards (943,106 entries)
 * took 3.6s in a plain `node -e` measurement outside vitest (see the
 * memo's two-run proof for the in-suite figure); this is added to the
 * suite ONCE via `beforeAll`, not per test.
 *
 * THE CORPUS. About 40 lines from four public-domain poets (Pushkin,
 * Lermontov, Tyutchev, Fet), chosen to exercise stress, ё-restoration,
 * clitics, voicing assimilation, palatalization, and vowel reduction
 * across a real range of Russian art-song text. The Pushkin "Я вас
 * любил..." lines are the ones already used by
 * `apps/web/src/lib/reading-aid.test.ts:88-95` (this app's own test
 * text); the rest is added per the audit brief's citation rule. NOT
 * ESTABLISHED: the exact orthography (dashes, ellipses, capitalization)
 * of the added stanzas was not checked against a critical edition; these
 * are transcribed from the standard, widely reprinted text of each poem
 * as commonly known, not copied from a source file in this repository.
 * This test records the engine's output on the text given, whatever that
 * text's provenance; it makes no claim of philological accuracy for the
 * Russian itself.
 *
 * Determinism: `processText` and `GraysonEngine.lookupStress` are pure
 * functions of their inputs and the injected dictionary; the dictionary
 * is loaded from the same committed files every run, so the corpus's IPA
 * output is stable across runs and machines (proved by running the suite
 * twice; see the memo).
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';

const DATA_DIR = join(__dirname, '../../../static/data');
const DICTIONARY_FILES = ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json'];

let entryCount = 0;

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const file of DICTIONARY_FILES) {
		const text = readFileSync(join(DATA_DIR, file), 'utf8');
		for (const line of text.split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				// Mirrors loader.ts:301-311 (`mapSingleEntry`), not exported there.
				if (entry.e !== undefined || entry.f !== undefined) {
					entry.g = { en: entry.e || '', fr: entry.f || '' };
				}
				dictionary[word] = entry;
			} catch {
				// Skip malformed lines silently, exactly as loader.ts:mergeNDJSON does.
			}
		}
	}
	entryCount = Object.keys(dictionary).length;
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);

	const supplement = JSON.parse(readFileSync(join(DATA_DIR, 'singer-supplement.json'), 'utf8'));
	setSingerSupplement(supplement);
}, 30_000);

// ── The corpus ────────────────────────────────────────────────────

interface Poem {
	title: string;
	author: string;
	lines: string[];
}

const CORPUS: Poem[] = [
	{
		title: 'Я вас любил',
		author: 'Pushkin',
		lines: [
			'Я вас любил: любовь ещё, быть может,',
			'В душе моей угасла не совсем;',
			'Но пусть она вас больше не тревожит;',
			'Я не хочу печалить вас ничем.',
			'Я вас любил безмолвно, безнадежно,',
			'То робостью, то ревностью томим;',
			'Я вас любил так искренно, так нежно,',
			'Как дай вам Бог любимой быть другим.',
		],
	},
	{
		title: 'Я помню чудное мгновенье (К***)',
		author: 'Pushkin',
		lines: [
			'Я помню чудное мгновенье:',
			'Передо мной явилась ты,',
			'Как мимолетное виденье,',
			'Как гений чистой красоты.',
			'В томленьях грусти безнадежной,',
			'В тревогах шумной суеты,',
			'Звучал мне долго голос нежный',
			'И снились милые черты.',
		],
	},
	{
		title: 'Парус',
		author: 'Lermontov',
		lines: [
			'Белеет парус одинокий',
			'В тумане моря голубом!..',
			'Что ищет он в стране далекой?',
			'Что кинул он в краю родном?..',
			'Играют волны, ветер свищет,',
			'И мачта гнется и скрыпит...',
			'Увы, он счастия не ищет',
			'И не от счастия бежит!',
			'Под ним струя светлей лазури,',
			'Над ним луч солнца золотой...',
			'А он, мятежный, просит бури,',
			'Как будто в бурях есть покой!',
		],
	},
	{
		title: 'Умом Россию не понять',
		author: 'Tyutchev',
		lines: [
			'Умом Россию не понять,',
			'Аршином общим не измерить:',
			'У ней особенная стать —',
			'В Россию можно только верить.',
		],
	},
	{
		title: 'Есть в осени первоначальной',
		author: 'Tyutchev',
		lines: [
			'Есть в осени первоначальной',
			'Короткая, но дивная пора —',
			'Весь день стоит как бы хрустальный,',
			'И лучезарны вечера...',
		],
	},
	{
		title: 'Шёпот, робкое дыханье',
		author: 'Fet',
		lines: [
			'Шёпот, робкое дыханье,',
			'Трели соловья,',
			'Серебро и колыханье',
			'Сонного ручья,',
		],
	},
];

function renderCorpus(): string {
	const out: string[] = [];
	out.push(`Dictionary entries loaded: ${entryCount}`);
	out.push('');
	for (const poem of CORPUS) {
		out.push(`── ${poem.title} (${poem.author}) ──`);
		for (const line of poem.lines) {
			const [transcribed] = processText(line);
			const ipa = (transcribed?.words ?? []).map((w) => w.ipaDisplay).join(' ');
			out.push(line);
			out.push(`  ${ipa}`);
		}
		out.push('');
	}
	return out.join('\n') + '\n';
}

describe('processText approval: 40-line public-domain art-song corpus', () => {
	it('loaded the real dictionary, not the inference-mode fallback', () => {
		expect(entryCount).toBeGreaterThan(900_000);
	});

	it('produces the approved IPA for every line', async () => {
		await expect(renderCorpus()).toMatchFileSnapshot('./__approved__/ipa-corpus.txt');
	});
});
