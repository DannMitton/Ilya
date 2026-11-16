/**
 * N.202 (D2): the sigil is [Ilya] and nothing else, in the app bar and at the head of a page. "The sigil" is
 * Dann's word for that device (2026-11-15 13:31, `docs/memory/PRODUCT.md`, item 2). `apps/web` runs vitest with no DOM,
 * so the components are read as source, as `footer-credit.test.ts` reads its own.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const VERSION_PATTERN = /(?<![A-Za-z0-9])20\d\d[a-z](?![A-Za-z0-9])/;

function walk(dir: string, out: string[] = []): string[] {
	for (const n of readdirSync(dir)) {
		const p = join(dir, n);
		if (statSync(p).isDirectory()) walk(p, out);
		else out.push(p);
	}
	return out;
}

describe('the sigil carries the name alone', () => {
	it('holds no version in the app bar: the label is "Ilya", and the markup has no year and letter', () => {
		const src = read('./HeaderBar.svelte');
		expect(src).toContain('<div class="sigil" aria-label="Ilya">');
		expect(src).not.toMatch(VERSION_PATTERN);
		expect(src).not.toContain('sigil-version');
	});

	it('holds no version at the head of a page, and the page takes no version colour', () => {
		const src = read('./Paper/TitleHeader.svelte');
		expect(src).not.toMatch(VERSION_PATTERN);
		expect(src).not.toContain('logo-version');
		expect(src).toContain('<span class="logo-bracket">]</span>\n');
	});

	it('names a version-colour prop nowhere under apps/web/src', () => {
		// The needle is built in two parts so this file does not hold it whole.
		const needle = 'version' + 'Accent';
		const hits = walk(SRC)
			.filter((f) => /\.(ts|js|svelte|css|html)$/.test(f))
			.filter((f) => readFileSync(f, 'utf8').includes(needle));
		expect(hits.map((f) => f.replace(SRC + '/', ''))).toEqual([]);
	});
});
