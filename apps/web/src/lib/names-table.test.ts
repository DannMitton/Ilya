/**
 * THE NAMES TABLES AGREE WITH THE RECORD (consistency batch 2, step 3).
 *
 * `names.ts` is the record of Ilya's named parts. Two human tables summarise
 * it, and two tables that drift from a record are what the consistency plan
 * forbids. This test reads both as source, as `ratified-lines.test.ts` reads
 * the GUIDE:
 *
 * 1. `ARCHITECTURE.md`, under `## Names`: one row per record, in record order,
 *    with exactly the columns `| id | key | EN | FR | code today | folder today |
 *    retired |`. Every cell must equal what the record gives. Fails if a record
 *    has no row, a row has no record, or any cell differs.
 * 2. `docs/house-style/interface-text.md`, section 2: for each row whose `key`
 *    cell names exactly one key and a record has that key as its `nameKey`,
 *    the English and French cells must equal `t(key, lang)`. Rows with no
 *    record (the LOUPE, the stations) are not checked here.
 *
 * Only what `t()` returns is compared for English and French, never a copy.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from './i18n';
import { CONCEPTS, type Concept } from './names';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');
const ARCHITECTURE = read('../../../../ARCHITECTURE.md');
const INTERFACE_TEXT = read('../../../../docs/house-style/interface-text.md');

/** The cells of a markdown table row, outer pipes dropped, each trimmed. */
const cells = (row: string) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

/** The table rows (header, rule, body) that follow `heading`, up to the first blank line after the table starts. */
function tableAfter(source: string, heading: string): string[][] {
	const at = source.indexOf(heading);
	if (at < 0) return [];
	const lines = source.slice(at + heading.length).split('\n');
	const rows: string[] = [];
	for (const line of lines) {
		if (line.startsWith('|')) rows.push(line);
		else if (rows.length > 0) break;
	}
	return rows.map(cells);
}

const code = (items: readonly string[]) => items.map((i) => `\`${i}\``).join(', ');
const expectedRow = (c: Concept) => [
	c.id,
	`\`${c.nameKey}\``,
	t(c.nameKey, 'en'),
	t(c.nameKey, 'fr'),
	code(c.identifiers.map((i) => i.today)),
	c.folder ? `\`${c.folder.today}\`` : '',
	code(c.retired.map((r) => r.pattern)),
];

describe('the Names table in ARCHITECTURE.md', () => {
	const table = tableAfter(ARCHITECTURE, '\n## Names\n');
	const header = table[0] ?? [];
	const body = table.slice(2);

	it('has the fixed columns', () => {
		expect(header).toEqual(['id', 'key', 'EN', 'FR', 'code today', 'folder today', 'retired']);
		expect(table[1]?.every((c) => /^-+$/.test(c))).toBe(true);
	});

	it('has a row for every record, and no row without one', () => {
		expect(body.map((r) => r[0])).toEqual(CONCEPTS.map((c) => c.id));
	});

	it.each(CONCEPTS.map((c) => [c.id, c] as const))('row %s equals its record, cell by cell', (_id, concept) => {
		const row = body.find((r) => r[0] === concept.id);
		expect(row).toEqual(expectedRow(concept));
	});
});

describe('the table in docs/house-style/interface-text.md, section 2', () => {
	const table = tableAfter(INTERFACE_TEXT, '\n**The record.**');
	const body = table.slice(2);
	const checkable = body
		.map((r) => ({ row: r, keys: [...r[1].replace(/\([^)]*\)/g, '').matchAll(/`([^`*]+)`/g)].map((m) => m[1]), star: r[1].includes('*') }))
		.filter(({ keys, star }) => keys.length === 1 && !star)
		.map(({ row, keys }) => ({ row, key: keys[0], concept: CONCEPTS.find((c) => c.nameKey === keys[0]) }))
		.filter((x): x is { row: string[]; key: string; concept: Concept } => x.concept !== undefined);

	it('has the expected columns', () => {
		expect(table[0]?.slice(0, 4)).toEqual(['concept', 'key', 'English', 'French']);
	});

	it('is not vacuous: it checks the five documents and more', () => {
		const keys = checkable.map((x) => x.key);
		for (const k of ['tab.text', 'tab.markedScore', 'tab.insights', 'tab.learn', 'tab.guide']) expect(keys).toContain(k);
		expect(checkable.length).toBeGreaterThanOrEqual(10);
	});

	it.each(['en', 'fr'] as const)('every checkable row says what t() says in %s', (lang) => {
		const i = lang === 'en' ? 2 : 3;
		const wrong = checkable.filter((x) => x.row[i] !== t(x.key, lang)).map((x) => `${x.key}: table "${x.row[i]}", t() "${t(x.key, lang)}"`);
		expect(wrong).toEqual([]);
	});
});
