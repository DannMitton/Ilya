/** The wait for the reader: the fill, the line, and the colours. Expected values are written out by hand from the brief. */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { advanceWait, completeWait, readingLine, waitColours, waitLine, WAIT_START } from './wait';
import type { OmrProgress } from './homr-reader';

const p = (page: number, pages: number, stage: string, done: number, total: number) =>
	({ page, pages, stage, done, total }) as OmrProgress;

describe('the fill', () => {
	it('stays empty and preparing while the models load', () => {
		expect(advanceWait(WAIT_START, p(1, 3, 'models', 2, 9))).toEqual(WAIT_START);
	});

	it('is pages done over pages, advanced inside a page by done over total', () => {
		let s = advanceWait(WAIT_START, p(1, 4, 'staff', 0, 4));
		expect(s).toMatchObject({ phase: 'reading', page: 1, pages: 4, fill: 0 });
		s = advanceWait(s, p(1, 4, 'staff', 2, 4));
		expect(s.fill).toBeCloseTo(0.125);
		s = advanceWait(s, p(3, 4, 'staff', 0, 4));
		expect(s).toMatchObject({ page: 3, fill: 0.5 });
	});

	it('never goes backwards when the second pass restarts at page 1', () => {
		let s = advanceWait(WAIT_START, p(3, 3, 'staff', 4, 4));
		expect(s.fill).toBe(1);
		s = advanceWait(s, p(1, 3, 'models', 0, 9));
		s = advanceWait(s, p(1, 3, 'staff', 1, 4));
		expect(s).toMatchObject({ page: 3, pages: 3, fill: 1 });
		let t = advanceWait(WAIT_START, p(2, 3, 'staff', 2, 4));
		t = advanceWait(t, p(1, 3, 'segment', 0, 4));
		expect(t.fill).toBeCloseTo(0.5);
		expect(t.page).toBe(2);
	});

	it('tolerates a total of zero and completes to one', () => {
		const s = advanceWait(WAIT_START, p(1, 2, 'staff', 0, 0));
		expect(s.fill).toBe(0);
		expect(completeWait(s).fill).toBe(1);
	});
});

describe('the line follows the language (N.167)', () => {
	const s = advanceWait(WAIT_START, p(2, 3, 'staff', 0, 4));
	it('is the reading line once a page has started, in each language, from the same state', () => {
		expect(readingLine(s, 'en')).toBe('Reading your score · page 2 of 3');
		expect(readingLine(s, 'fr')).toBe('Lecture de votre partition · page 2 sur 3');
	});
	it('is the preparing text before the first page, in each language', () => {
		expect(readingLine(WAIT_START, 'en')).toBeNull();
		expect(waitLine(WAIT_START, 'en')).toMatch(/^Ilya is reading the notes/);
		expect(waitLine(WAIT_START, 'fr')).toMatch(/^Ilya lit les notes/);
	});
});

describe('the colours', () => {
	it('are each document\'s own desk tint and label ink', () => {
		expect(waitColours('text')).toEqual({ fill: 'var(--sage-wash)', ink: 'var(--sage-ink)' });
		expect(waitColours('markup')).toEqual({ fill: 'var(--lavender-wash)', ink: 'var(--lavender-ink)' });
		expect(waitColours('insights')).toEqual({ fill: 'var(--rose-wash)', ink: 'var(--rose-ink)' });
	});
	it('draw nothing on Learn or Guide', () => {
		expect(waitColours('learn')).toBeNull();
		expect(waitColours('guide')).toBeNull();
	});
});

describe('the wait squircle\'s wash (QUEUE row 46)', () => {
	const css = readFileSync(new URL('../../app.css', import.meta.url), 'utf8');
	const token = (name: string) => css.match(new RegExp(`--${name}:\\s*#([0-9A-Fa-f]{6})`))![1].toUpperCase();
	const overWhite = (hex: string, share: number) =>
		[0, 2, 4].map((i) => Math.round(share * parseInt(hex.slice(i, i + 2), 16) + (1 - share) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();

	it('is each family\'s band at 20 percent over white, computed as the desk tokens are (40 percent)', () => {
		for (const family of ['sage', 'lavender', 'rose']) {
			expect(token(`${family}-wash`)).toBe(overWhite(token(family), 0.2));
			expect(token(`${family}-desk`)).toBe(overWhite(token(family), 0.4));
		}
		expect(['sage', 'lavender', 'rose'].map((f) => token(`${f}-wash`))).toEqual(['E6E9E3', 'EAE7EC', 'EEE5E5']);
	});
});
