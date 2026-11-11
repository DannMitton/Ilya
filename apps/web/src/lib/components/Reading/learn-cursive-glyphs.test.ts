/**
 * LEARN's Glyph Table draws Dann's cursive letters (brief `docs/sessions/brief-code-learn-cursive-glyphs_r2_2026-11-10.md`, step 4).
 * Counts are read from the files, never typed.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import LearnContent from './LearnContent.svelte';

const APP_DIR = new URL('./cursive/', import.meta.url);
const SOURCE_DIR = new URL('../../../../../../tools/cursive/r4/svg/', import.meta.url);

const files = readdirSync(APP_DIR).filter((f) => f.endsWith('.svg')).sort();
const read = (dir: URL, f: string) => readFileSync(new URL(f, dir), 'utf8');
const parts = (f: string) => {
	const m = /^(\d\d)-(.)-(upper|lower)\.svg$/u.exec(f);
	expect(m, f).not.toBeNull();
	return { capital: m![2], kase: m![3] as 'upper' | 'lower' };
};
const html = (language: 'en' | 'fr') => render(LearnContent, { props: { language } }).body.replace(/<!--.*?-->/gs, '');

/** The capitals Dann left blank: a capital file is absent where a lower one is present. */
const lowers = new Set(files.filter((f) => f.includes('-lower')).map((f) => parts(f).capital));
const uppers = new Set(files.filter((f) => f.includes('-upper')).map((f) => parts(f).capital));
const noCapital = [...lowers].filter((c) => !uppers.has(c));

describe('the files', () => {
	it('are present, and the app copy lists the same names as the source record', () => {
		expect(files.length).toBeGreaterThan(0);
		expect(files).toEqual(readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.svg')).sort());
	});

	it('the app copy and tools/cursive/r4/svg are byte-identical', () => {
		for (const f of files) expect(read(APP_DIR, f), f).toBe(read(SOURCE_DIR, f));
	});

	it.each(files)('%s: viewBox y = -3 and height 72, one path with fill="currentColor"', (f) => {
		const s = read(APP_DIR, f);
		const m = /viewBox="(\S+) (\S+) (\S+) (\S+)"/.exec(s);
		expect(m, 'viewBox').not.toBeNull();
		expect(Number(m![2])).toBe(-3);
		expect(Number(m![4])).toBe(72);
		expect(s.match(/<path\b[^>]*>/g)).toHaveLength(1);
		expect(s.match(/<path\b[^>]*>/)![0]).toContain('fill="currentColor"');
	});

	it.each(files)('%s: role="img" and an aria-label that is its letter in the right case', (f) => {
		const { capital, kase } = parts(f);
		const s = read(APP_DIR, f);
		expect(s).toContain('role="img"');
		expect(/aria-label="([^"]*)"/.exec(s)?.[1]).toBe(kase === 'upper' ? capital : capital.toLowerCase());
	});

	it.each(files)('%s: one <svg>, one <path>, and no script, event handler, href, or style', (f) => {
		const s = read(APP_DIR, f);
		expect(s.match(/<svg\b/g)).toHaveLength(1);
		expect(s.match(/<path\b/g)).toHaveLength(1);
		expect(s).not.toMatch(/<script/i);
		expect(s).not.toMatch(/\son\w+\s*=/i);
		expect(s).not.toMatch(/href/i);
		expect(s).not.toMatch(/style/i);
	});

	it('leave out exactly the capitals Dann left blank', () => {
		expect(noCapital.length).toBeGreaterThan(0);
		expect(files.length).toBe(lowers.size + uppers.size);
	});
});

describe.each(['en', 'fr'] as const)('the Glyph Table in %s', (language) => {
	const h = html(language);

	it('prints no placeholder', () => {
		expect(h).not.toMatch(/>SVG</);
	});

	it('draws one <svg> per file', () => {
		expect(h.match(/<svg\b/g)).toHaveLength(files.length);
	});

	it('shows the null mark in the cursive cell of each capital that has no file', () => {
		const rows = h.split(/<tr\b/).filter((r) => r.includes('gt-sans-obl'));
		for (const capital of noCapital) {
			const row = rows.find((r) => r.includes(`<td class="gt-cell gt-sans-obl">${capital}</td>`));
			expect(row, capital).toBeDefined();
			const cursive = row!.match(/<td class="gt-cell gt-cursive[^"]*">.*?<\/td>/gs)!;
			expect(cursive).toHaveLength(2);
			expect(cursive[0], `capital ${capital}`).toContain('gt-null');
			expect(cursive[0]).toContain('—');
			expect(cursive[1], `small ${capital.toLowerCase()}`).not.toContain('gt-null');
			expect(cursive[1]).toContain('<svg');
		}
	});

	it('draws every other cursive cell, each announced by its own letter', () => {
		const rows = h.split(/<tr\b/).filter((r) => r.includes('gt-cursive') && r.includes('<svg'));
		const labels = rows.flatMap((r) => [...r.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]));
		const expected = files.map((f) => {
			const { capital, kase } = parts(f);
			return kase === 'upper' ? capital : capital.toLowerCase();
		});
		expect(labels.sort()).toEqual(expected.sort());
	});
});
