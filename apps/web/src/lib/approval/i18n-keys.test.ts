/**
 * Every literal key the application passes to `t()` or `T()` exists in the
 * string table, in both languages. `t` takes a plain string, so a mistyped key
 * compiles and ships as "[MISSING: key]" on the singer's screen; this test
 * catches it before it ships. Added on the audit branch, 2026-09-26, from the
 * newcomer review's recommendation 6.
 *
 * Keys built at runtime (template strings, concatenation) are not literal and
 * are not checked here.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { hasString } from '$lib/i18n';

const SRC = fileURLToPath(new URL('../../', import.meta.url));
const KEY_t = /\bt\(\s*'([a-zA-Z0-9_.-]+)'/g;
const KEY_T = /\bT\(\s*'([a-zA-Z0-9_.-]+)'/g;
/** The house shorthand. A file that defines `T` some other way (comment-text.ts
 *  builds register-qualified keys) is not read for `T(` calls. */
const HOUSE_T = /const T = \(key: string\) => t\(key, language\)/;

function sources(dir: string, out: string[] = []): string[] {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) sources(path, out);
		else if (/\.(ts|svelte)$/.test(name) && !/\.(test|spec)\.ts$/.test(name)) out.push(path);
	}
	return out;
}

describe('the string table', () => {
	const uses = new Map<string, string>();
	for (const file of sources(SRC)) {
		const text = readFileSync(file, 'utf8');
		const found = [...text.matchAll(KEY_t), ...(HOUSE_T.test(text) ? text.matchAll(KEY_T) : [])];
		for (const m of found) {
			if (!uses.has(m[1])) uses.set(m[1], relative(SRC, file));
		}
	}

	it('finds the literal keys it is meant to check', () => {
		expect(uses.size).toBeGreaterThan(100);
	});

	it('holds every literal key in English and in French', () => {
		const missing = [...uses].filter(([key]) => !hasString(key, 'en') || !hasString(key, 'fr'));
		expect(missing.map(([key, file]) => `${key} (${file})`)).toEqual([]);
	});

	it('would catch a missing key (positive control)', () => {
		expect(hasString('audit.no-such-key', 'en')).toBe(false);
	});
});
