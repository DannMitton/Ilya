/**
 * Lane 64 Step 5: the plausibility band stops demoting (Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1270`: the status is the measurement's own, and a
 * neighbourhood never demotes). `withPlausibility` lives inside `CalibrationWizard.svelte`, which has no component test, so this test takes that one function's
 * source out of the file, removes its type annotations, and runs it with the real `checkPlausibility`. If the function is renamed or its shape changes so that the
 * extraction fails, the test fails loudly rather than passing on nothing.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkPlausibility, buildPlausibilityEvent } from './engine/plausibility';

const src = readFileSync(join(__dirname, 'CalibrationWizard.svelte'), 'utf8');
const start = src.indexOf('function withPlausibility(');
if (start < 0) throw new Error('withPlausibility not found in CalibrationWizard.svelte');
let depth = 0, end = -1;
for (let i = src.indexOf('{', start); i < src.length; i++) {
	if (src[i] === '{') depth++;
	if (src[i] === '}' && --depth === 0) { end = i + 1; break; }
}
const body = src.slice(start, end)
	.replace('(vowel: Vowel, formant: CalibratedFormant): CalibratedFormant', '(vowel, formant)')
	.replace('const out: CalibratedFormant =', 'const out =');

function build(voiceType: string) {
	const info = vi.fn();
	const make = new Function('checkPlausibility', 'anchorF1sFor', 'profile', 'voiceType', 'buildPlausibilityEvent', 'guardSessionId', 'console', `${body}; return withPlausibility;`);
	const fn = make(checkPlausibility, () => undefined, {}, voiceType, buildPlausibilityEvent, 'session', { info }) as (v: string, f: Record<string, unknown>) => Record<string, unknown>;
	return { fn, info };
}
const reading = (f1: number, over: Record<string, unknown> = {}) => ({ f1, f2: 1700, confidence: 'high', reading: 'captured', source: 'measured-user', ...over });

describe('withPlausibility describes and never demotes', () => {
	it('an implausible reading stays Captured and carries plausibility "implausible"', () => {
		const { fn, info } = build('bass');
		const out = fn('i', reading(90));
		expect(out.plausibility).toBe('implausible');
		expect(out.reading).toBe('captured');
		expect(out.confidence).toBe('high');
		expect(info).toHaveBeenCalledTimes(1);
	});
	it('a plausible reading is Captured with plausibility "plausible", and a Provisional one is left Provisional', () => {
		const { fn } = build('bass');
		expect(fn('i', reading(296))).toMatchObject({ plausibility: 'plausible', reading: 'captured' });
		expect(fn('i', reading(90, { reading: 'provisional', confidence: 'low' }))).toMatchObject({ plausibility: 'implausible', reading: 'provisional' });
	});
	it('a stand-in reading is returned as it came', () => {
		const { fn, info } = build('bass');
		const stand = { f1: 90, reading: 'captured', source: 'stand-in' };
		expect(fn('i', stand)).toBe(stand);
		expect(info).not.toHaveBeenCalled();
	});
	it('the function no longer sets a reading at all', () => {
		expect(body).not.toMatch(/\.reading\s*=/);
		expect(body).not.toMatch(/'provisional'/);
	});
});
