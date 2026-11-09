/**
 * ROW 172 step 3: the quiet line above TEXT's sheet names the witness INPUT's pill chose, in capitals
 * (Dann 2026-11-01 13:26), as text and not as a control, and does not print (`CONTRACT.md` §8).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from 'svelte/server';
import TextSourceLine from './TextSourceLine.svelte';

const body = (witness: 'poem' | 'lyrics', language: 'en' | 'fr' = 'en') => render(TextSourceLine, { props: { language, witness } }).body;

describe('TextSourceLine', () => {
	it('names the source: From LYRICS or From POEM', () => {
		expect(body('lyrics')).toContain('From LYRICS');
		expect(body('poem')).toContain('From POEM');
	});
	/* French ratified by Dann 2026-11-05 08:10. Checks the words and U+2019 (not a straight apostrophe): a wrong one reaches the singer's TEXT page. */
	it('names the source in French: D’après PAROLES or D’après POÈME', () => {
		expect(body('lyrics', 'fr')).toContain('D’après PAROLES');
		expect(body('poem', 'fr')).toContain('D’après POÈME');
	});
	it('is one paragraph with the id the end-to-end tests read, and carries no control', () => {
		const h = body('poem');
		expect(h).toContain('id="text-source"');
		expect(h).not.toMatch(/<button|role="tab"|onclick/);
	});
	it('does not print', () => {
		const src = readFileSync(join(__dirname, 'TextSourceLine.svelte'), 'utf8');
		expect(src).toMatch(/@media print\s*\{\s*\.text-source\s*\{\s*display:\s*none;/);
	});
});
