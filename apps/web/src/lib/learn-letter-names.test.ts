/**
 * LEARN's glyph table (row 11 onward): the IPA printed after each letter's name is Ilya's own engine's output for that name.
 *
 * It checks, for every row of the table in both copies of `LearnContent.svelte` (French and English), that the IPA in
 * the third column equals what `processText`, the pipeline the app uses for TEXT, gives for the name in the same row.
 * WHY: the table was hand-written, and a hand-written IPA drifted: «и краткое» lost its first word, «гэ» carried an
 * ASCII g where the inventory has ɡ (U+0261), «ща» and the hard and soft signs differed from the engine. A table that
 * teaches a singer how a name is said must say what Ilya says. WHEN IT FAILS: a printed form differs from the engine's
 * output, so either the table was edited by hand or the engine changed; change the table to the engine's output (never
 * hand-write IPA), or, if the engine is wrong, fix the engine and let this test show the table follow.
 *
 * ONE CONVENTION, DESK DEFAULT: the engine marks the stress of every one-word name of one syllable («а» gives [ˈɑ]); the
 * table prints such a name bare, as Grayson's letter-name list does, so the comparison removes that one leading ˈ and
 * nothing else. «у» is exempt: the engine reads a lone «у» as a clitic and gives no IPA (it is merged into its neighbour).
 * It relates to `pipeline.ts` (`processText`) and to `LearnContent.svelte`, the only two files it reads.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';

const DATA_DIR = join(__dirname, '../../static/data');
beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const file of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json']) {
		for (const line of readFileSync(join(DATA_DIR, file), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				if (entry.e !== undefined || entry.f !== undefined) entry.g = { en: entry.e || '', fr: entry.f || '' };
				dictionary[word] = entry;
			} catch {
				// A malformed line is skipped, as loader.ts does.
			}
		}
	}
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA_DIR, 'singer-supplement.json'), 'utf8')));
}, 30_000);

const engine = (name: string): string => {
	const [t] = processText(name);
	return (t?.words ?? []).map((w) => w.ipaDisplay).filter((d) => d !== '→' && d !== '←').join(' ');
};
const NUCLEUS = /[ɑaeɛiɪɨouʌ]/g;
/** The table's form of the engine's output: a one-word name of one syllable loses its leading stress mark. */
const asPrinted = (ipa: string): string => (!ipa.includes(' ') && (ipa.match(NUCLEUS) ?? []).length === 1 ? ipa.replace(/^ˈ/, '') : ipa);

const source = readFileSync(join(__dirname, 'components/Reading/LearnContent.svelte'), 'utf8').split('\n');
const ROW = /<tr><td>(\d+|—)<\/td><td><strong>([^<]*)<\/strong><\/td><td>([^<]*?) <code>\[([^\]]*)\]<\/code><\/td>/;
const rows = source.flatMap((l, i) => {
	const m = l.match(ROW);
	return m ? [{ line: i + 1, n: m[1], letter: m[2], name: m[3], printed: m[4] }] : [];
});
const french = rows.filter((r) => r.line < 1000);
const english = rows.filter((r) => r.line >= 1000);

describe('LEARN glyph table: the IPA of each letter name is the engine’s', () => {
	it('has the same 37 rows in French and in English', () => {
		expect(french).toHaveLength(37);
		expect(english).toHaveLength(37);
		expect(english.map((r) => r.name)).toEqual(french.map((r) => r.name));
	});
	it('prints the same IPA in both languages', () => {
		expect(english.map((r) => r.printed)).toEqual(french.map((r) => r.printed));
	});
	for (const [label, set] of [['French', french], ['English', english]] as const) {
		it.each(set.filter((r) => r.name !== 'у').map((r) => [r.line, r.letter, r.name, r.printed] as const))(
			`${label}, line %i, %s «%s»: [%s] is the engine’s`,
			(_line, _letter, name, printed) => {
				expect(printed).toBe(asPrinted(engine(name)));
			},
		);
	}
	it('exempts only «у», whose lone engine reading is empty (a clitic)', () => {
		expect(engine('у')).toBe('');
	});
});
