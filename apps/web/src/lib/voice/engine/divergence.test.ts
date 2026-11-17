/**
 * The [ɨ] divergence pass (`divergence.ts`), after lane 64 Step 5: it describes, it never demotes (Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1270`:
 * the status is the measurement's own, and a neighbourhood never demotes). `isDivergent` is null when [i] or [u] is not usable, true or false otherwise.
 * Expected values are worked by hand from the pass's own rule (`e1 = 1.365 × [i] fR1`, `e2 = [i] fR2 − 0.67 × ([i] fR2 − [u] fR2)`, tolerances 50 and 100 Hz).
 */
import { describe, it, expect } from 'vitest';
import { applyIghDivergence, type IghReading } from './divergence';

const reading = (f1: number, f2: number | undefined, over: Partial<IghReading> = {}): IghReading =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), confidence: 'high', reading: 'captured', source: 'measured-user', ...over }) as IghReading;
// [i] 300 / 2200 and [u] 350 / 800 expect [ɨ] near 300 × 1.365 = 409.5 and 2200 − 0.67 × 1400 = 1262.
const I = reading(300, 2200), U = reading(350, 800);

describe('the [ɨ] divergence pass describes and never demotes', () => {
	it('an [ɨ] with [u] missing stays as its own evidence left it, and isDivergent is null', () => {
		const captured = applyIghDivergence({ i: { ...I }, ɨ: reading(410, 1262) }).ɨ!;
		expect(captured.reading).toBe('captured');
		expect(captured.isDivergent).toBeNull();
		const provisional = applyIghDivergence({ i: { ...I }, ɨ: reading(410, 1262, { reading: 'provisional', confidence: 'low' }) }).ɨ!;
		expect(provisional.reading).toBe('provisional');
		expect(provisional.isDivergent).toBeNull();
	});
	it('an [ɨ] with [i] missing, or with [i] or [u] Provisional, or without an fR2 in [i] or [u], stays as it was and isDivergent is null', () => {
		for (const p of [
			{ u: { ...U }, ɨ: reading(410, 1262) },
			{ i: { ...I, reading: 'provisional' as const }, u: { ...U }, ɨ: reading(410, 1262) },
			{ i: { ...I }, u: { ...U, reading: 'provisional' as const }, ɨ: reading(410, 1262) },
			{ i: { ...I }, u: reading(350, undefined), ɨ: reading(410, 1262) },
			{ i: reading(300, undefined), u: { ...U }, ɨ: reading(410, 1262) },
		]) {
			const out = applyIghDivergence(p).ɨ!;
			expect(out.reading).toBe('captured');
			expect(out.isDivergent).toBeNull();
		}
	});
	it('a divergent [ɨ] stays Captured with isDivergent true: fR1 59.5 Hz from 409.5, then fR2 more than 100 Hz from 1262', () => {
		const byF1 = applyIghDivergence({ i: { ...I }, u: { ...U }, ɨ: reading(350, 1262) }).ɨ!;
		expect(byF1).toMatchObject({ reading: 'captured', isDivergent: true });
		const byF2 = applyIghDivergence({ i: { ...I }, u: { ...U }, ɨ: reading(410, 1400) }).ɨ!;
		expect(byF2).toMatchObject({ reading: 'captured', isDivergent: true });
	});
	it('a divergent [ɨ] that was Provisional on its own evidence stays Provisional: the pass promotes nothing either', () => {
		const out = applyIghDivergence({ i: { ...I }, u: { ...U }, ɨ: reading(350, 1262, { reading: 'provisional', confidence: 'low' }) }).ɨ!;
		expect(out).toMatchObject({ reading: 'provisional', isDivergent: true });
	});
	it('an [ɨ] near the expectation has isDivergent false and stays Captured', () => {
		const out = applyIghDivergence({ i: { ...I }, u: { ...U }, ɨ: reading(410, 1262) }).ɨ!;
		expect(out).toMatchObject({ reading: 'captured', isDivergent: false });
	});
	it('with no [ɨ] the profile is returned untouched', () => {
		const p = { i: { ...I }, u: { ...U } };
		expect(applyIghDivergence(p)).toBe(p);
	});
});
