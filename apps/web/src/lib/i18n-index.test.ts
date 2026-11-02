/**
 * THE KEY INDEX AT THE HEAD OF `i18n.ts` TELLS THE TRUTH ABOUT WHAT IT COUNTS (consistency batch 2, step 5).
 *
 * The index is written by hand: its glosses ("the drawer's band names") and its choice of files are a person's,
 * and a script that read `i18n.ts` as text would start five keys short, because five entries do not fit one-line
 * parsing. This test keeps its numbers honest by reading the real key list, which only vitest can import.
 * It reads `i18n.ts` as source, takes the lines between "THE KEY PREFIXES ARE THE FEATURE INDEX" and
 * "THREE LEGACY KEYS", and fails when:
 *
 * - a prefix in `stringKeys()` has no line, or a line names a prefix that has no keys;
 * - a line's count differs from the prefix's count in `stringKeys()`;
 * - the total the header states ("This file holds N keys.") differs from `stringKeys().length`;
 * - a path named on a line does not exist under `apps/web/src/`.
 *
 * Consistency batch 3 renames folders and re-runs this test unchanged; nothing in it names a folder.
 */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { stringKeys } from './i18n';

const source = readFileSync(new URL('./i18n.ts', import.meta.url), 'utf8');
const START = 'THE KEY PREFIXES ARE THE FEATURE INDEX';
const END = 'THREE LEGACY KEYS';
const block = source.slice(source.indexOf(START), source.indexOf(END));

const lines = [...block.matchAll(/^\s+(\w+)\.\s+(\d+)\s+(\S.*)$/gm)].map((m) => ({ prefix: m[1], count: Number(m[2]), gloss: m[3] }));

const actual = new Map<string, number>();
for (const k of stringKeys()) {
	const p = k.split('.')[0];
	actual.set(p, (actual.get(p) ?? 0) + 1);
}

describe('the key index at the head of i18n.ts', () => {
	it('is found, and is not vacuous', () => {
		expect(block.length).toBeGreaterThan(2000);
		expect(lines.length).toBeGreaterThan(40);
	});

	it('has a line for every prefix that has keys, and none for a prefix without', () => {
		const listed = lines.map((l) => l.prefix);
		expect(new Set(listed).size, 'a prefix is listed twice').toBe(listed.length);
		expect([...actual.keys()].filter((p) => !listed.includes(p)), 'prefixes with keys and no line').toEqual([]);
		expect(listed.filter((p) => !actual.has(p)), 'lines for a prefix with no keys').toEqual([]);
	});

	it('states each prefix\'s count as it is in the file', () => {
		const wrong = lines.filter((l) => actual.get(l.prefix) !== l.count).map((l) => `${l.prefix}: stated ${l.count}, actual ${actual.get(l.prefix) ?? 0}`);
		expect(wrong).toEqual([]);
	});

	it('states the total as it is in the file', () => {
		const stated = block.match(/This file holds ([\d,]+) keys\./);
		expect(stated, 'the header states a total as "This file holds N keys."').not.toBeNull();
		expect(Number(stated![1].replace(/,/g, ''))).toBe(stringKeys().length);
		expect(lines.reduce((n, l) => n + l.count, 0)).toBe(stringKeys().length);
	});

	it('names only paths that exist under apps/web/src/', () => {
		const paths = new Set([...block.matchAll(/\b((?:lib|routes)\/[\w./+-]+\.(?:svelte|ts))\b/g)].map((m) => m[1]));
		expect(paths.size).toBeGreaterThan(40);
		const missing = [...paths].filter((p) => !existsSync(new URL(`../${p}`, import.meta.url)));
		expect(missing).toEqual([]);
	});
});
