/**
 * N.199 Step 4a: the chart, rendered on the server. What it draws for a model and a view; the pixels are Step 6's.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import VowelChart from './VowelChart.svelte';
import { buildChartModel } from './model';
import { zoomTarget } from './geometry';

const f = (f1: number, f2?: number): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311),
	a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804)
};
const pick = (...vs: Vowel[]) => Object.fromEntries(vs.map((v) => [v, BASS[v]])) as Partial<Record<Vowel, CalibratedFormant>>;
const html = (profile: Partial<Record<Vowel, CalibratedFormant>>, extra: Record<string, unknown> = {}) => {
	const model = buildChartModel(profile, 'bass');
	return render(VowelChart, { props: { model, view: model.full, language: 'en', ...extra } as never }).body;
};
const count = (h: string, re: RegExp) => (h.match(re) ?? []).length;
const zoneTag = (h: string, v: string) => h.match(new RegExp(`<ellipse[^>]*data-zone="${v}"[^>]*>`))![0];

describe('the chart', () => {
	it('draws ten zones, the grid, and a placeholder with a symbol for each vowel not sung', () => {
		const h = html(pick('i'));
		expect(count(h, /data-zone=/g)).toBe(10);
		expect(count(h, /data-placeholder=/g)).toBe(9);
		expect(count(h, /data-sung=/g)).toBe(1);
		expect(h).toMatch(/class="grid[ "]/);
		// Every vowel has its symbol somewhere: no zone is told apart by colour alone.
		for (const v of VOWELS) expect(h).toContain(`>${v}</text>`);
	});

	it('draws the zones with no outline: a fill, a fill opacity, and no stroke', () => {
		const h = html({});
		for (const v of VOWELS) {
			const tag = zoneTag(h, v);
			expect(tag).toContain('fill: var(--zone-');
			expect(tag).toContain('fill-opacity');
			expect(tag).not.toMatch(/stroke/);
		}
	});

	it('draws the grid after the zones, so it shows over the fills', () => {
		const h = html({});
		expect(h.search(/class="zones[ "]/)).toBeGreaterThan(-1);
		expect(h.search(/class="zones[ "]/)).toBeLessThan(h.search(/class="grid[ "]/));
	});

	it('gives the active zone a deeper saturation and the rest their own', () => {
		const calm = html({}, { active: null });
		const lit = html({}, { active: 'ɑ' });
		expect(zoneTag(lit, 'ɑ')).toContain('fill-opacity: 0.5');
		expect(zoneTag(calm, 'ɑ')).not.toContain('fill-opacity: 0.5');
		expect(zoneTag(lit, 'i')).toBe(zoneTag(calm, 'i'));
	});

	it('draws a bar for a reading with no fR2, at its fR1 across its zone, and no dot', () => {
		const h = html({ e: f(381) });
		expect(count(h, /class="bar[ "]/g)).toBe(1);
		expect(count(h, /data-sung=/g)).toBe(0);
		expect(h).toContain('>e</text>');
	});

	it('moves with the view it is handed: a zoomed view draws the same zone larger', () => {
		const model = buildChartModel({}, 'bass');
		const zone = model.zones.find((z) => z.vowel === 'ɑ')!;
		const wide = render(VowelChart, { props: { model, view: model.full, language: 'en' } as never }).body;
		const near = render(VowelChart, { props: { model, view: zoomTarget(model.full, zone), language: 'en' } as never }).body;
		const rx = (h: string) => +zoneTag(h, 'ɑ').match(/rx="([\d.]+)"/)![1];
		expect(rx(near)).toBeGreaterThan(rx(wide) * 1.3);
	});

	it('dashes the hull until all ten, and draws it whole at ten', () => {
		expect(html(pick('i', 'e', 'u'))).toMatch(/class="[^"]*hull[^"]*dashed/);
		const ten = html(BASS);
		expect(ten).toMatch(/class="[^"]*hull/);
		expect(ten).not.toMatch(/class="[^"]*hull[^"]*dashed/);
	});

	it('is a labelled image and says nothing about a goal', () => {
		const h = html({}).replace(/&#39;/g, "'");
		expect(h).toContain('role="img"');
		expect(h).toContain('aria-label="Chart of the vowel zones.');
		expect(h.replace(/<[^>]*>/g, ' ').toLowerCase()).not.toMatch(/goal|target/);
	});
});
