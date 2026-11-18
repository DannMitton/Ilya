/**
 * Lane 67, Step 7: the far-off [ɨ] choice. A sung [ɨ] far from where the singer's [i] and [u] place it gets its own note at the summary (ruled 2026-11-13 15:13, message
 * ratified 15:29): Keep it, Re-take, or "Use Ilya's estimate for now". For a personal voice only; one note per vowel.
 */
import { describe, expect, it } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { t } from '$lib/i18n';
import type { CalibratedFormant, Vowel } from './engine/types';
import { keepReading } from './engine/plausibility';
import { isSung } from './engine/sung';
import { resolveVowelValues } from './engine/resolve-values';
import { usableReadingCount } from './profileStore';
import { farOffIgh, markUseEstimate, outsideNote, outsideVowels } from './outside';
import OutsideNote from './OutsideNote.svelte';

const r = (f1: number, f2: number, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;
const ORDER: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'];
// A bass's six core vowels (Mitton 2020, Table 5.3). [ɨ] built from [i] and [u]: 1.365 x 296 = 404 Hz in fR1, and 1705 - 0.67 x (1705 - 804) = 1101 Hz in fR2.
const SIX: Partial<Record<Vowel, CalibratedFormant>> = { i: r(296, 1705), e: r(381, 1532), ɛ: r(577, 1311), ɑ: r(617, 1013), o: r(489, 826), u: r(346, 804) };
const NEAR = r(404, 1101);
const FAR = r(407 + 150, 1246 + 300); // far off in both resonances (Dann's own 407/1246 against 364/1110 was far enough: `OPEN.md:3800`)

describe('when the note shows: a personal voice, a sung [ɨ] far from [i] and [u]', () => {
	it('shows for a far-off [ɨ], not for a near one', () => {
		expect(farOffIgh({ ...SIX, ɨ: FAR })).toBe(true);
		expect(farOffIgh({ ...SIX, ɨ: NEAR })).toBe(false);
		expect(farOffIgh({ ...SIX, ɨ: r(404 + 40, 1101 + 90) })).toBe(false); // inside 50 Hz and 100 Hz
		expect(farOffIgh({ ...SIX, ɨ: r(404 + 60, 1101) })).toBe(true);
	});
	it('does not show with no [ɨ] sung, or when [i] or [u] cannot place it', () => {
		expect(farOffIgh(SIX)).toBe(false);
		expect(farOffIgh({ ...SIX, ɨ: FAR, i: r(296, 1705, { reading: 'provisional', confidence: 'low' }) })).toBe(false);
	});
	it('does not show for a sung [ɨ] with no usable second resonance: the pass would read it as 0 and call a missing number far-off (lane 68, Fix 2)', () => {
		const noF2 = { f1: FAR.f1, f2Quality: 'absent', confidence: 'high', reading: 'captured', source: 'measured-user' } as CalibratedFormant;
		expect(farOffIgh({ ...SIX, ɨ: noF2 })).toBe(false);
		expect(farOffIgh({ ...SIX, ɨ: { ...FAR, f2: 0 } })).toBe(false);
		expect(farOffIgh({ ...SIX, ɨ: { ...FAR, f2Quality: 'absent' } })).toBe(false);
		expect(farOffIgh({ ...SIX, ɨ: FAR })).toBe(true);
	});
	it('does not show below five core vowels: Ilya then uses no value built from the singer\'s [i] and [u]', () => {
		const four = { i: SIX.i, e: SIX.e, ɛ: SIX.ɛ, u: SIX.u, ɨ: FAR };
		expect(farOffIgh(four)).toBe(false);
		expect(farOffIgh({ ...four, ɑ: SIX.ɑ })).toBe(true); // five
		expect(farOffIgh({ ɨ: FAR })).toBe(false);
	});
	it('is pure: the stored profile is untouched', () => {
		const p = { ...SIX, ɨ: FAR };
		const before = JSON.stringify(p);
		farOffIgh(p);
		expect(JSON.stringify(p)).toBe(before);
		expect('isDivergent' in p.ɨ).toBe(false);
	});
});

describe('what quiets it', () => {
	it('Keep (plausibilityOverride)', () => {
		expect(farOffIgh({ ...SIX, ɨ: keepReading(FAR) })).toBe(false);
	});
	it('the mark (useEstimate), because the reading is then not sung', () => {
		const marked = markUseEstimate({ ...SIX, ɨ: FAR });
		expect(marked.ɨ?.useEstimate).toBe(true);
		expect(farOffIgh(marked)).toBe(false);
	});
	it('a fresh take, which replaces the reading object and so carries no mark; a less clear re-take does not replace, so the mark stays', () => {
		const marked = markUseEstimate({ ...SIX, ɨ: FAR });
		const fresh = { ...marked, ɨ: r(404, 1101) }; // the wizard replaces the object (`commitReading`)
		expect(fresh.ɨ.useEstimate).toBeUndefined();
		expect(isSung(fresh.ɨ)).toBe(true);
		const lessClear = marked; // not replaced
		expect(lessClear.ɨ?.useEstimate).toBe(true);
		expect(isSung(lessClear.ɨ)).toBe(false);
	});
});

describe('the mark: every site shows Ilya\'s estimate, and the reading stays stored', () => {
	it('isSung is false for a marked [ɨ], and the count drops by one', () => {
		const p = { ...SIX, ɨ: FAR };
		expect(usableReadingCount(p)).toBe(7);
		const marked = markUseEstimate(p);
		expect(isSung(marked.ɨ)).toBe(false);
		expect(usableReadingCount(marked)).toBe(6);
		expect(marked.ɨ?.f1).toBe(FAR.f1); // stored
	});
	it('the resolution derives [ɨ] from [i] and [u] instead of using the sung value', () => {
		const sung = resolveVowelValues({ ...SIX, ɨ: FAR }, 'bass', { placeholders: 'always' });
		expect(sung.fR1Source['ɨ']).toBe('sung');
		expect(sung.fR1['ɨ']).toBe(FAR.f1);
		const est = resolveVowelValues(markUseEstimate({ ...SIX, ɨ: FAR }), 'bass', { placeholders: 'always' });
		expect(est.fR1Source['ɨ']).toBe('derived');
		expect(est.fR1['ɨ']).toBeCloseTo(1.365 * 296, 0);
	});
	it('a profile with no [ɨ] is returned as it is', () => {
		const p = { ...SIX };
		expect(markUseEstimate(p)).toBe(p);
	});
});

describe('one note per vowel', () => {
	it('an [ɨ] both unstable and far-off is in the [ɨ] note only', () => {
		const both = { ...SIX, ɨ: { ...FAR, confidence: 'low' as const, reading: 'provisional' as const } };
		expect(farOffIgh(both)).toBe(true);
		expect(outsideVowels(both, ORDER)).toEqual([]);
	});
	it('an unstable [ɨ] that is near is in the unstable note, and an unstable [u] stays there beside a far-off [ɨ]', () => {
		expect(outsideVowels({ ...SIX, ɨ: { ...NEAR, confidence: 'low' as const } }, ORDER)).toEqual(['ɨ']);
		const p = { ...SIX, u: { ...SIX.u!, confidence: 'low' as const }, ɨ: FAR };
		expect(outsideVowels(p, ORDER)).toEqual(['u']);
		expect(farOffIgh(p)).toBe(true);
	});
});

describe('the note', () => {
	const tag = createRawSnippet((g: () => Vowel) => ({ render: () => `<span class="tag">[${g()}]</span>` }));
	const html = (props: Record<string, unknown>) => render(OutsideNote, { props: { vowels: ['ɨ'], language: 'en', tag, onkeep: () => {}, onretake: () => {}, ...props } as never }).body.replace(/&#39;|&#x27;/g, "'");
	const buttons = (h: string) => [...h.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map((m) => m[1]);
	it('is the ratified sentence with three buttons: Keep it, Re-take, and Use Ilya\'s estimate for now', () => {
		const h = html({ kind: 'igh', onuseestimate: () => {} });
		expect(h).toContain(t('calib.summary.outsideIgh', 'en'));
		expect(buttons(h)).toEqual(['Keep it', t('calib.common.retake', 'en'), 'Use Ilya\'s estimate for now']);
		expect(h).not.toContain('class="tag"');
	});
	it('in French', () => {
		const h = html({ kind: 'igh', language: 'fr', onuseestimate: () => {} });
		expect(buttons(h)).toEqual(['Le garder', t('calib.common.retake', 'fr'), 'Utiliser l’estimation d’Ilya pour l’instant']);
	});
	it('the unstable note keeps its two buttons and names its vowels', () => {
		const h = html({ vowels: ['i', 'u'] });
		expect(buttons(h)).toEqual(['Keep them', t('calib.common.retake', 'en')]);
		expect(h).toContain('These readings were unstable:');
		expect((h.match(/class="tag"/g) ?? []).length).toBe(2);
	});
	it('uses the ratified key and no other string for the far-off note', () => {
		expect(outsideNote('igh').key).toBe('calib.summary.outsideIgh');
		expect(outsideNote('unstable').key).toBe('calib.summary.unstable');
	});
});
