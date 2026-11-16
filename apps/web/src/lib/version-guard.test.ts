/**
 * N.202 (D5): a guard. The version is typed in one place, `lib/version.ts`. This test fails if a year and a letter
 * stand as a version anywhere a singer could read it: in the string table (both languages, by value), or in any other
 * non-test file under `apps/web/src`. It matches any year and letter, not the current constant alone, so a stale "2026a"
 * is caught after the letter moves.
 *
 * What the source scan cannot see, and the sweep by value can: a string written with an escape. `i18n.ts` wrote the
 * footer as ` 2026a`, and the character before the year in that source is the `0` of the escape, so the pattern's
 * lookbehind refuses it. The table is therefore swept as values, where the escape has become a no-break space.
 *
 * A hit that is a true citation with a letter would be allowed by name in ALLOWED, with its reason. None is today.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { stringKeys, t } from './i18n';

const SRC = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const PATTERN = /(?<![A-Za-z0-9])20\d\d[a-z](?![A-Za-z0-9])/;

/** `path relative to apps/web/src` mapped to the reason that file may hold a year and a letter. */
const ALLOWED: Record<string, string> = {};

function walk(dir: string, out: string[] = []): string[] {
	for (const n of readdirSync(dir)) {
		const p = join(dir, n);
		if (statSync(p).isDirectory()) walk(p, out);
		else out.push(p);
	}
	return out;
}

describe('the version guard: the pattern catches what it is for (positive controls)', () => {
	it('catches the attribute form', () => {
		expect('<div class="sigil" aria-label="Ilya 2026a">').toMatch(PATTERN);
	});
	it("catches the footer's string, where a no-break space stands before the year", () => {
		expect('Free and open source, <em>Ilya</em> 2026a operationalizes Craig Grayson').toMatch(PATTERN);
	});
	it('catches the bare span', () => {
		expect('<span class="sigil-version">2026a</span>').toMatch(PATTERN);
	});
	it('catches any year and letter, not the current constant alone', () => {
		expect('Ilya 2027c').toMatch(PATTERN);
		expect('Ilya 2026z').toMatch(PATTERN);
	});
	it('does not catch a bare year, a longer token, or a date', () => {
		for (const s of ['Ilya 2026', 'v2026a', '2026ab', '2026a1', 'A2026a', '(University of Washington, 2012).', '2026-11-15']) {
			expect(s, s).not.toMatch(PATTERN);
		}
	});
	it('does not see an escape in source, which is why the string table is swept by value', () => {
		expect('<em>Ilya</em>\\u00a02026a').not.toMatch(PATTERN);
	});
});

describe('the version guard: nothing a singer reads types a version', () => {
	it('the string table holds none, in either language', () => {
		const hits: string[] = [];
		for (const key of stringKeys()) {
			for (const lang of ['en', 'fr'] as const) {
				if (PATTERN.test(t(key, lang))) hits.push(`${key} (${lang})`);
			}
		}
		expect(hits).toEqual([]);
	});

	it('no other non-test file under apps/web/src holds one, version.ts aside', () => {
		const hits: string[] = [];
		for (const f of walk(SRC)) {
			if (!/\.(ts|js|svelte|css|html|json|svg|md)$/.test(f)) continue;
			if (/\.(test|spec)\.[tj]s$/.test(f)) continue;
			const rel = relative(SRC, f);
			if (rel === join('lib', 'version.ts') || rel in ALLOWED) continue;
			const lines = readFileSync(f, 'utf8').split('\n');
			lines.forEach((line, i) => {
				if (PATTERN.test(line)) hits.push(`${rel}:${i + 1}`);
			});
		}
		expect(hits).toEqual([]);
	});
});
