/**
 * N.203 lane 59 Step 3: the take line's arithmetic, and the component rendered on the server for what a singer would read (four named parts, one
 * progressbar for the whole take, the current part as its value text, a distinct hold, every label whole in both languages).
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import TakeLine from './TakeLine.svelte';
import { overallPercent, partFills, TAKE_PART_IDS, TAKE_WEIGHTS, type TakePart } from './take-line';
import { tv } from '$lib/i18n';

const parts = (language: 'en' | 'fr'): TakePart[] => TAKE_PART_IDS.map((id) => ({ id, label: tv(`capture.part.${id}`, language), weight: TAKE_WEIGHTS[id] }));
const html = (props: Partial<{ current: string | null; within: number; holding: boolean; reducedMotion: boolean; language: 'en' | 'fr' }> = {}) =>
	render(TakeLine, {
		props: { parts: parts(props.language ?? 'en'), current: props.current ?? null, within: props.within ?? 0, holding: props.holding, reducedMotion: props.reducedMotion, label: 'Progress of this take' }
	}).body;

describe('the take line arithmetic', () => {
	const P = parts('en');
	it('has four parts in the proportion 2, 4, 2, 4', () => {
		expect(P.map((p) => [p.id, p.weight])).toEqual([['breathe', 2], ['sing', 4], ['shape', 2], ['fry', 4]]);
	});
	it('fills the parts before the current one, a fraction of it, and none after', () => {
		expect(partFills(P, 'sing', 0.5)).toEqual([1, 0.5, 0, 0]);
		expect(partFills(P, 'fry', 1)).toEqual([1, 1, 1, 1]);
		expect(partFills(P, null, 0.7)).toEqual([0, 0, 0, 0]);
		expect(partFills(P, 'breathe', 3)).toEqual([1, 0, 0, 0]); // clamped
	});
	it('reports the whole take as a percentage by weight', () => {
		expect(overallPercent(P, 'breathe', 0)).toBe(0);
		expect(overallPercent(P, 'sing', 0)).toBe(17); // 2 of 12
		expect(overallPercent(P, 'shape', 0)).toBe(50); // 6 of 12
		expect(overallPercent(P, 'fry', 0)).toBe(67); // 8 of 12
		expect(overallPercent(P, 'fry', 1)).toBe(100);
	});
	it('takes any parts: three for the test fry', () => {
		const three: TakePart[] = [{ id: 'quiet', label: 'Quiet', weight: 1 }, { id: 'breathe', label: 'Breathe', weight: 1 }, { id: 'fry', label: 'Fry', weight: 3 }];
		expect(overallPercent(three, 'fry', 0)).toBe(40);
	});
});

describe('the take line, as rendered', () => {
	it('names the four parts, in order, in English', () => {
		const h = html();
		const names = [...h.matchAll(/class="name[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1]);
		expect(names).toEqual(['Breathe', 'Sing', 'Shape', 'Fry']);
	});
	it('names them whole in French: Respiration, Chant, Forme, Friture', () => {
		const names = [...html({ language: 'fr' }).matchAll(/class="name[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1]);
		expect(names).toEqual(['Respiration', 'Chant', 'Forme', 'Friture']);
	});
	it('is one progressbar for the whole take, its value text the current part', () => {
		const h = html({ current: 'shape', within: 0.5 });
		expect(h.match(/role="progressbar"/g)).toHaveLength(1);
		expect(h).toContain('aria-valuenow="58"');
		expect(h).toContain('aria-valuetext="Shape"');
		expect(h).toContain('aria-label="Progress of this take"');
	});
	it('gives each part a column at least as wide as its own word, in the proportion of its weight', () => {
		expect(html()).toContain('grid-template-columns: minmax(min-content, 2fr) minmax(min-content, 4fr) minmax(min-content, 2fr) minmax(min-content, 4fr)');
	});
	it('marks the hold, and the reduced-motion form of it', () => {
		expect(html({ current: 'fry', within: 0.25, holding: true })).toMatch(/class="take-line[^"]*holding/);
		expect(html({ current: 'fry', within: 0.25, holding: true, reducedMotion: true })).toMatch(/class="take-line[^"]*holding[^"]*reduced|class="take-line[^"]*reduced[^"]*holding/);
		expect(html({ current: 'fry', within: 0.25 })).not.toMatch(/class="take-line[^"]*holding/);
	});
});
