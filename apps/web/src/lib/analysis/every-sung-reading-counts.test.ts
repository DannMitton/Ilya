/**
 * Lane 66, Step 5: every sung reading counts, as a kept reading counts. The "Done when" sentence of the brief
 * (`docs/sessions/brief-code-lane66-follow-ups_r3_2026-11-17.md`): for a reading judged outside and not kept, MELODY, INSIGHTS, the VOICE pane, and the chart give
 * exactly what they give for the same reading kept. The only things that tell the two apart are the summary's note and the "Beyond Ilya's reference values" mark.
 * The ruling: Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1273`.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { VOWELS } from '$lib/voice/engine/types';
import { judgeUnchecked, resolveVowelValues } from '$lib/voice/engine/resolve-values';
import { keepReading } from '$lib/voice/engine/plausibility';
import { computeZones } from '$lib/voice/chart/zones';
import { finishEarlyState } from '$lib/voice/chart/finish-early';
import { summaryRows } from '$lib/voice/chart/readings';
import { outsideVowels } from '$lib/voice/outside';
import { usableReadingCount } from '$lib/voice/profileStore';
import { isSung } from '$lib/voice/engine/sung';
import { buildVoiceProfileSnapshot } from './analyze-score-adapter';
import { SETS, TYPES, f, pick } from './adapter-grid';

type Profile = Partial<Record<Vowel, CalibratedFormant>>;
const clone = (p: Profile): Profile => JSON.parse(JSON.stringify(p));
/** The vowels a profile has outside the union window and not kept: what the adapter judges (`judgeUnchecked`, no type). */
const outsideOf = (p: Profile): Vowel[] => outsideVowels(judgeUnchecked(p), VOWELS);
/** The same profile with those readings kept, as the singer's Keep leaves them. */
const keptTwin = (p: Profile, vowels: readonly Vowel[]): Profile => {
	const out = clone(p);
	for (const v of vowels) out[v] = keepReading(out[v]!);
	return out;
};

describe('every sung reading counts: the adapter golden\'s grid', () => {
	const withOutside = Object.entries(SETS).filter(([, p]) => outsideOf(p).length > 0);

	it('the grid holds a profile with a reading outside, so the test below is not empty', () => {
		expect(withOutside.map(([name]) => name)).toContain('bad i (1063), no override');
	});

	it('for each profile with a reading judged outside and not kept, the snapshot equals the snapshot of the same profile with that reading kept, under every type', () => {
		for (const [name, p] of withOutside) {
			const twin = keptTwin(p, outsideOf(p));
			for (const type of TYPES) {
				const plain = buildVoiceProfileSnapshot(clone(p), undefined, 'golden', undefined, type);
				const kept = buildVoiceProfileSnapshot(clone(twin), undefined, 'golden', undefined, type);
				expect(plain, `${type ?? '(undefined)'} | ${name}`).toEqual(kept);
			}
		}
	});

	it('the resolution (the chart\'s and INSIGHTS\'s values), the chart\'s zones and dots, the finish-early state, and the pane\'s count agree as well', () => {
		for (const [name, p] of withOutside) {
			const twin = keptTwin(p, outsideOf(p));
			for (const type of TYPES) {
				const a = resolveVowelValues(clone(p), type, { placeholders: 'always' }), b = resolveVowelValues(clone(twin), type, { placeholders: 'always' });
				const strip = (r: ReturnType<typeof resolveVowelValues>) => ({ fR1: r.fR1, fR2: r.fR2, fR1Source: r.fR1Source, fR2Source: r.fR2Source, anySung: r.anySung, generic: r.generic, standIns: r.standIns });
				expect(strip(a), `${type} | ${name}`).toEqual(strip(b));
				expect(computeZones(clone(p), type), `${type} | ${name}`).toEqual(computeZones(clone(twin), type));
				expect(finishEarlyState(clone(p), type)).toEqual(finishEarlyState(clone(twin), type));
			}
			expect(usableReadingCount(clone(p))).toBe(usableReadingCount(clone(twin)));
		}
	});

	it('nothing is left out as "implausible": the retake list holds only the fit\'s own off-shape readings', () => {
		for (const [, p] of Object.entries(SETS)) {
			for (const type of TYPES) {
				const r = resolveVowelValues(clone(p), type, { placeholders: 'always' });
				expect(Object.keys(r)).not.toContain('implausible');
				expect(r.standIns?.retake.every((x) => x.reason === 'off-shape') ?? true).toBe(true);
			}
		}
	});
});

describe('what still tells a reading beyond the reference values from a kept one', () => {
	const bad: Profile = { i: f(1063, 2250), u: f(330, 800), ɑ: f(640, 1050) };

	it('the summary\'s note names it, and Keep quiets it, without changing a number', () => {
		const judged = judgeUnchecked(bad);
		expect(outsideVowels(judged, VOWELS)).toEqual(['i']);
		const kept = keptTwin(bad, ['i']);
		expect(outsideVowels(judgeUnchecked(kept), VOWELS)).toEqual([]);
		expect(buildVoiceProfileSnapshot(clone(bad), undefined)).toEqual(buildVoiceProfileSnapshot(clone(kept), undefined));
	});

	it('the note names a reading stored with no verdict, because the wizard passes the judged copy; the stored profile alone names nothing', () => {
		expect(outsideVowels(bad, VOWELS)).toEqual([]);
		expect(outsideVowels(judgeUnchecked(bad), VOWELS)).toEqual(['i']);
		const src = readFileSync(join(__dirname, '../voice/CalibrationWizard.svelte'), 'utf8');
		expect(src).toContain('outsideVowels(judgeUnchecked(profile), ALL_VOWELS)');
	});

	it('the "Beyond Ilya\'s reference values" mark follows the override alone', () => {
		const rows = (p: Profile) => summaryRows(p, [], 'en').filter((r) => r.kind === 'sung').map((r) => [r.vowel, r.marks.beyond]);
		expect(rows(bad).every(([, beyond]) => beyond === false)).toBe(true);
		expect(rows(keptTwin(bad, ['i'])).find(([v]) => v === 'i')![1]).toBe(true);
	});

	it('the judged copy is a copy: nothing is written to the stored profile', () => {
		const before = JSON.stringify(bad);
		judgeUnchecked(bad);
		expect(JSON.stringify(bad)).toBe(before);
	});
});

describe('one test of "sung"', () => {
	const x = f(300, 1500);
	it('a number above zero that is not an estimate, whatever the verdict says', () => {
		expect(isSung(x)).toBe(true);
		expect(isSung({ ...x, plausibility: 'implausible' })).toBe(true);
		expect(isSung({ ...x, f1: 0 })).toBe(false);
		expect(isSung({ ...x, reading: 'estimated' })).toBe(false);
		expect(isSung(undefined)).toBe(false);
	});
	it('the count the pane and its doors read, the values INSIGHTS and MELODY read, and the chart all use it: a take that placed no first resonance is counted by none', () => {
		const p: Profile = pick(['e', 'ɛ', 'ɑ', 'o', 'u'], { i: { ...f(0, 1700) } }); // five core vowels sung: personal (lane 67)
		expect(usableReadingCount(p)).toBe(5);
		expect(resolveVowelValues(p, 'bass', { placeholders: 'always' }).fR1Source.i).not.toBe('sung');
		expect(resolveVowelValues(p, 'bass', { placeholders: 'always' }).fR1Source.e).toBe('sung');
		expect(finishEarlyState(p, 'bass').remaining).toContain('i');
	});
	it('no source file but the predicate tests the verdict to decide use: `isUsable` is gone, and so is the `implausible` list', () => {
		const files: string[] = [];
		const walk = (d: string) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (n !== 'node_modules') walk(p); } else if (/\.(ts|svelte)$/.test(n) && !/\.test\.ts$/.test(n)) files.push(p); } };
		walk(join(__dirname, '..'));
		walk(join(__dirname, '../../routes'));
		for (const p of files) {
			const src = readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
			expect(src, p).not.toMatch(/\bisUsable\b/);
			expect(src, p).not.toMatch(/reason:\s*'implausible'/);
		}
	});
});
