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
import { resolveVowelValues } from '$lib/voice/engine/resolve-values';
import { checkPlausibility, keepReading } from '$lib/voice/engine/plausibility';
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
/** The vowels a profile has beyond the union window (no type): the readings the guard would judge implausible. They count like any other (lane 66); only the guard's verdict, stored beside them, tells them apart. */
const outsideOf = (p: Profile): Vowel[] => VOWELS.filter((v) => !!p[v] && isSung(p[v]) && checkPlausibility(p[v]!.f1, v).plausibility === 'implausible' && !p[v]!.plausibilityOverride);
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

	it('nothing is left out as "implausible", and no sung vowel is set aside: every sung core vowel of a personal voice keeps its own number (lane 67)', () => {
		for (const [, p] of Object.entries(SETS)) {
			for (const type of TYPES) {
				const r = resolveVowelValues(clone(p), type, { placeholders: 'always' });
				expect(Object.keys(r)).not.toContain('implausible');
				expect(Object.keys(r.standIns ?? {}).every((k) => k === 'bucket' || k === 'steps')).toBe(true);
				if (r.anySung) for (const v of VOWELS) if (isSung(p[v])) expect(r.fR1Source[v], `${type} ${v}`).toBe('sung');
			}
		}
	});
});

describe('what the summary\'s note does (lane 67): it follows the take\'s own steadiness, never the reference values', () => {
	const five = pick(['e', 'ɛ', 'ɑ', 'o', 'u']);
	const bad: Profile = { ...five, i: f(1063, 2250) };
	const shaky: Profile = { ...five, i: f(300, 1700, { confidence: 'low', reading: 'provisional' }) };

	it('a steady reading far beyond the reference values is not named, and counts exactly as the same reading kept', () => {
		expect(outsideVowels(bad, VOWELS)).toEqual([]);
		const kept = keptTwin(bad, ['i']);
		expect(outsideVowels(kept, VOWELS)).toEqual([]);
		expect(buildVoiceProfileSnapshot(clone(bad), undefined)).toEqual(buildVoiceProfileSnapshot(clone(kept), undefined));
	});

	it('an unstable reading is named, Keep quiets it, and Keep changes no number', () => {
		expect(outsideVowels(shaky, VOWELS)).toEqual(['i']);
		const kept = keptTwin(shaky, ['i']);
		expect(outsideVowels(kept, VOWELS)).toEqual([]);
		expect(buildVoiceProfileSnapshot(clone(shaky), undefined)).toEqual(buildVoiceProfileSnapshot(clone(kept), undefined));
	});

	it('the wizard hands the note the stored profile as it is: no verdict is computed for it', () => {
		const src = readFileSync(join(__dirname, '../voice/CalibrationWizard.svelte'), 'utf8');
		expect(src).toContain('outsideVowels(profile, ALL_VOWELS)');
		expect(src).not.toContain('judgeUnchecked');
	});

	it('the "Beyond Ilya\'s reference values" mark is retired: a kept reading carries no mark of its own', () => {
		const rows = summaryRows(keptTwin(bad, ['i']), [], 'en').filter((r) => r.kind === 'sung');
		for (const r of rows) expect(Object.keys(r.marks).sort()).toEqual(['noiseFloorUnmeasured', 'provisional']);
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
