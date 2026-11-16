/**
 * N.202 (D6): the repository's `CITATION.cff` names the version the app names, and the licence the repository declares.
 * No YAML parser is a dependency, so the file is read by pattern. `date-released` is the desk's, added on the day `main`
 * moves; no abstract stands until Dann ratifies words for one.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ILYA_VERSION } from './version';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');
const cff = readFileSync(resolve(ROOT, 'CITATION.cff'), 'utf8');
const field = (name: string) => cff.match(new RegExp(`^${name}:\\s*"([^"]*)"\\s*$`, 'm'))?.[1];

describe('CITATION.cff', () => {
	it('names the version the app names', () => {
		expect(field('version')).toBe(ILYA_VERSION);
	});
	it('names the licence of the root package.json', () => {
		const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
		expect(typeof pkg.license).toBe('string');
		expect(field('license')).toBe(pkg.license);
	});
	it('names the name, the author, the site, and the repository', () => {
		expect(cff).toMatch(/^cff-version: 1\.2\.0$/m);
		expect(field('title')).toBe('Ilya');
		expect(cff).toMatch(/^type: software$/m);
		expect(cff).toMatch(/family-names: "Mitton"\n\s+given-names: "Dann"/);
		expect(field('url')).toBe('https://ilya.dannmitton.com');
		expect(field('repository-code')).toBe('https://github.com/DannMitton/Ilya');
	});
	it('carries no date-released and no abstract until the desk adds them', () => {
		expect(cff).not.toMatch(/^date-released:/m);
		expect(cff).not.toMatch(/^abstract:/m);
	});
});
