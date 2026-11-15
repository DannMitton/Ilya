/**
 * The resonance symbol in Insights lines follows Titze et al. (2015), Table I, ruled by Dann 2026-11-13 15:44: the f of fR1 is always italic, and the
 * subscript R1 is upright whatever the line's emphasis (`text-parts.ts`; `SingerBlock.svelte`).
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { richParts } from './text-parts';

describe('fR1 in a line', () => {
	it('is an italic f and an upright subscript R1', () => {
		expect(richParts('above fR1 here')).toEqual([{ text: 'above ' }, { text: 'f', em: true }, { text: 'R1', sub: true }, { text: ' here' }]);
	});
	it('stays so inside *…*: the f italic, the subscript carries no emphasis', () => {
		const parts = richParts('*the fR1 of it*');
		const sub = parts.find((p) => p.sub)!;
		expect(sub).toEqual({ text: 'R1', sub: true });
		expect(parts.find((p) => p.text === 'f')).toEqual({ text: 'f', em: true });
		expect(parts.filter((p) => p.text === 'the ' || p.text === ' of it').every((p) => p.em)).toBe(true);
	});
	it('the Singer block draws a subscript with no emphasis class', () => {
		const src = readFileSync(new URL('./SingerBlock.svelte', import.meta.url), 'utf8');
		expect(src).toContain('{#if p.sub}<sub>{p.text}</sub>');
		expect(src).not.toMatch(/<sub class:em/);
	});
});
