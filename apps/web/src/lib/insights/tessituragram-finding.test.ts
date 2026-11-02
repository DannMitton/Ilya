/**
 * Row 165 step 8 (Dann 2026-11-01 22:47): a bar with a finding has the same --rose-jewel fill as every other bar
 * and a light --rose-wash outline drawn wholly inside it; shade alone carries no meaning (WCAG 2.2, 1.4.1).
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Pitch } from '@ilya/score-parser';
import type { TessituragramModel } from './insights';
import Tessituragram from './Tessituragram.svelte';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const figure: TessituragramModel = {
	clef: 'bass',
	rows: [
		{ midi: 50, spellings: [P('D', 3)], quavers: 40, tags: [] },
		{ midi: 52, spellings: [P('E', 3)], quavers: 60, tags: [{ measure: '9', vowel: 'a' }] },
		{ midi: 55, spellings: [P('G', 3)], quavers: 30, tags: [] },
	],
	compass: { low: P('D', 3), high: P('G', 3) },
	longest: { midi: 52, quavers: 60, share: 0.46, seconds: null },
	scale: 'quavers',
	quiet: false,
	tessitura: null,
	passaggio: null,
	zones: null,
	halfMass: null,
	centre: null,
	cycles: null,
};

describe('the tessituragram finding cue', () => {
	const html = render(Tessituragram, { props: { figure, language: 'en' } }).body;
	const rects = [...html.matchAll(/<rect [^>]*>/g)].map((m) => m[0]);
	const bars = rects.filter((r) => r.includes('fill="var(--rose-jewel)"'));
	const outlines = rects.filter((r) => r.includes('finding-outline'));

	it('draws every bar in --rose-jewel, the finding bar included, and none in --rose-ink', () => {
		expect(bars).toHaveLength(3);
		expect(html).not.toMatch(/<rect [^>]*fill="var\(--rose-ink\)"/);
	});
	it('gives the one finding bar a --rose-wash outline, and the others none', () => {
		expect(outlines).toHaveLength(1);
		expect(outlines[0]).toContain('stroke="var(--rose-wash)"');
		expect(outlines[0]).toContain('fill="none"');
		expect(outlines[0]).toContain('stroke-width="1.5"');
	});
	it('draws the outline wholly inside its bar, so the bar\'s outer size does not change', () => {
		const n = (r: string, a: string) => Number(new RegExp(` ${a}="([-\\d.]+)"`).exec(r)![1]);
		const bar = bars.find((b) => Math.abs(n(b, 'width') - n(outlines[0], 'width') - 1.5) < 1e-6 && Math.abs(n(b, 'x') + 0.75 - n(outlines[0], 'x')) < 1e-6)!;
		expect(bar).toBeDefined();
		const [bx, by, bw, bh] = ['x', 'y', 'width', 'height'].map((a) => n(bar, a));
		const [ox, oy, ow, oh] = ['x', 'y', 'width', 'height'].map((a) => n(outlines[0], a));
		expect(ox - 0.75).toBeGreaterThanOrEqual(bx - 1e-6);
		expect(ox + ow + 0.75).toBeLessThanOrEqual(bx + bw + 1e-6);
		expect(oy - 0.75).toBeGreaterThanOrEqual(by - 1e-6);
		expect(oy + oh + 0.75).toBeLessThanOrEqual(by + bh + 1e-6);
	});
});
