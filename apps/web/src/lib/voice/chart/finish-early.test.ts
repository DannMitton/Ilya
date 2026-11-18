/**
 * N.203 lane 59 Step 6: finish early. The state comes from the chart's own resolution (Fable's review, amendment 10), so each case below is one the count of
 * recorded vowels alone would get wrong. And the ratified counted forms and consent captions, in both languages, for every count.
 */
import { describe, expect, it } from 'vitest';
import { finishEarlyState, finishEarlyText, numberWord, vowelList, type FinishEarly } from './finish-early';
import { TOUR_SEVEN } from './tour';
import { VOWELS, type CalibratedFormant, type Vowel } from '../engine/types';

const R = (f1: number, f2: number | undefined, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, f2, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible', ...extra }) as CalibratedFormant;
const VALUES: Record<Vowel, [number, number]> = {
	i: [300, 2200], e: [450, 2000], ɪ: [400, 1900], ɨ: [350, 1400], ɛ: [550, 1800], a: [700, 1400], ɑ: [650, 1100], ʌ: [600, 1200], o: [450, 900], u: [350, 800]
};
const profileOf = (vowels: readonly Vowel[], over: Partial<Record<Vowel, CalibratedFormant>> = {}) => {
	const p: Partial<Record<Vowel, CalibratedFormant>> = {};
	for (const v of vowels) p[v] = R(VALUES[v][0], VALUES[v][1]);
	return { ...p, ...over };
};
const state = (p: Partial<Record<Vowel, CalibratedFormant>>, voiceType: string | undefined = 'bass') => finishEarlyState(p, voiceType);

describe('the state of the control', () => {
	it('after the seven in Ilya’s order: work out the other three, [ɪ], [ɨ], [ʌ], in VOWELS order', () => {
		expect(state(profileOf(TOUR_SEVEN))).toEqual({ kind: 'work-out', remaining: ['ɪ', 'ɨ', 'ʌ'], anyUsable: true });
	});

	it('with nothing recorded: all ten remain, use-recorded, nothing usable; with all ten: none remain', () => {
		expect(state({})).toEqual({ kind: 'use-recorded', remaining: [...VOWELS], anyUsable: false });
		expect(state(profileOf(VOWELS))).toEqual({ kind: 'use-recorded', remaining: [], anyUsable: true });
	});

	it('is pure: the same profile gives the same answer, and the profile is not changed', () => {
		const p = profileOf(TOUR_SEVEN);
		const before = JSON.stringify(p);
		expect(state(p)).toEqual(state(p));
		expect(JSON.stringify(p)).toBe(before);
	});

	it('with [o] unrecorded: use what I have recorded (it cannot be worked out)', () => {
		const s = state(profileOf(['i', 'e', 'ɛ', 'a', 'ɑ', 'u']));
		expect(s).toEqual({ kind: 'use-recorded', remaining: ['ɪ', 'ɨ', 'ʌ', 'o'], anyUsable: true });
	});

	it('an anchor recorded without fR2 is not enough: use what I have recorded', () => {
		const p = profileOf(TOUR_SEVEN, { i: R(300, undefined) });
		expect(state(p)?.kind).toBe('use-recorded');
	});

	it('an anchor with an absent fR2 quality is not enough, though its fR2 is a positive number', () => {
		const p = profileOf(TOUR_SEVEN, { i: R(300, 2200, { f2Quality: 'absent' }) });
		expect(state(p)?.kind).toBe('use-recorded');
	});

	it('[o] recorded but implausible and not kept counts as a kept one does (lane 66, Step 5): the rest is worked out', () => {
		const p = profileOf(TOUR_SEVEN, { o: R(1063, 900, { plausibility: 'implausible' }) });
		expect(state(p)?.kind).toBe('work-out');
		expect(state(p)).toEqual(state(profileOf(TOUR_SEVEN, { o: R(1063, 900, { plausibility: 'implausible', plausibilityOverride: true } as Partial<CalibratedFormant>) })));
	});

	it('"Not sure" with five core vowels recorded: use what I have recorded (the sixth is a stand-in)', () => {
		const s = state(profileOf(['i', 'e', 'ɛ', 'ɑ', 'o']), 'not-sure');
		expect(s).toEqual({ kind: 'use-recorded', remaining: ['ɪ', 'ɨ', 'a', 'ʌ', 'u'], anyUsable: true });
	});

	it('below five stable core vowels what is recorded is usable, and the rest is a placeholder, so nothing is worked out (lane 68)', () => {
		for (const vs of [['i'], ['i', 'e', 'u'], ['i', 'e', 'ɛ', 'ɑ']] as Vowel[][]) {
			const s = state(profileOf(vs), 'not-sure');
			expect(s.anyUsable, vs.join()).toBe(true);
			expect(s.kind, vs.join()).toBe('use-recorded');
		}
		expect(state(profileOf(['u', 'ɨ'])).anyUsable).toBe(true);
		expect(state(profileOf([])).anyUsable).toBe(false);
	});

	it('a reading implausible and not kept is usable, as a kept one is (lane 66, Step 5), at five core vowels', () => {
		const five = ['e', 'ɛ', 'ɑ', 'o', 'u'] as Vowel[];
		const p = profileOf(five, { i: R(1063, 2200, { plausibility: 'implausible' }) });
		expect(state(p)).toEqual({ kind: 'work-out', remaining: ['ɪ', 'ɨ', 'a', 'ʌ'], anyUsable: true });
		expect(state(p)).toEqual(state(profileOf(five, { i: R(1063, 2200, { plausibility: 'implausible', plausibilityOverride: true } as Partial<CalibratedFormant>) })));
	});

	it('a kept implausible reading counts, and so does one not kept', () => {
		const p = profileOf(TOUR_SEVEN, { o: R(1063, 900, { plausibility: 'implausible', plausibilityOverride: true } as Partial<CalibratedFormant>) });
		expect(state(p)?.kind).toBe('work-out');
	});
});

describe('the ratified words', () => {
	it('lists the vowels in brackets: an Oxford comma in English, none in French', () => {
		expect(vowelList(['ɪ', 'ɨ', 'ʌ'], 'en')).toBe('[ɪ], [ɨ], and [ʌ]');
		expect(vowelList(['ɪ', 'ʌ'], 'en')).toBe('[ɪ] and [ʌ]');
		expect(vowelList(['ɪ'], 'en')).toBe('[ɪ]');
		expect(vowelList(['ɪ', 'ɨ', 'ʌ'], 'fr')).toBe('[ɪ], [ɨ] et [ʌ]');
		expect(vowelList(['ɪ', 'ʌ'], 'fr')).toBe('[ɪ] et [ʌ]');
	});

	it('names the numbers two to nine', () => {
		expect([2, 3, 4, 5, 6, 7, 8, 9].map((n) => numberWord(n, 'en'))).toEqual(['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']);
		expect([2, 3, 4, 5, 6, 7, 8, 9].map((n) => numberWord(n, 'fr'))).toEqual(['deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']);
	});

	it('work out, three left: the link and the consent caption, both languages', () => {
		const s: FinishEarly = { kind: 'work-out', remaining: ['ɪ', 'ɨ', 'ʌ'], anyUsable: true };
		expect(finishEarlyText(s, 'en')).toEqual({
			link: 'Let Ilya work out the other three',
			caption: 'You have recorded the vowels Ilya needs. If you wish, it can work out the other three from them: [ɪ], [ɨ], and [ʌ].'
		});
		expect(finishEarlyText(s, 'fr')).toEqual({
			link: 'Laisser Ilya déduire les trois autres',
			caption: 'Vous avez capté les voyelles dont Ilya a besoin. Si vous le souhaitez, il peut en déduire les trois autres : [ɪ], [ɨ] et [ʌ].'
		});
	});

	it('work out, two and one left', () => {
		expect(finishEarlyText({ kind: 'work-out', remaining: ['ɪ', 'ʌ'], anyUsable: true }, 'en').link).toBe('Let Ilya work out the other two');
		expect(finishEarlyText({ kind: 'work-out', remaining: ['ɪ', 'ʌ'], anyUsable: true }, 'fr').link).toBe('Laisser Ilya déduire les deux autres');
		const one: FinishEarly = { kind: 'work-out', remaining: ['ʌ'], anyUsable: true };
		expect(finishEarlyText(one, 'en')).toEqual({ link: 'Let Ilya work out the last one', caption: 'You have recorded the vowels Ilya needs. If you wish, it can work out the last one from them: [ʌ].' });
		expect(finishEarlyText(one, 'fr')).toEqual({
			link: 'Laisser Ilya déduire la dernière',
			caption: 'Vous avez capté les voyelles dont Ilya a besoin. Si vous le souhaitez, il peut en déduire la dernière : [ʌ].'
		});
	});

	it('use what I have recorded: the link, and the caption by count, or none when nothing was usable', () => {
		expect(finishEarlyText({ kind: 'use-recorded', remaining: ['ɪ', 'ɨ', 'a', 'ʌ'], anyUsable: true }, 'en')).toEqual({
			link: 'Use what I’ve recorded',
			caption: 'If you wish, you can stop here: Ilya fills the other four from what you have recorded so far.'
		});
		expect(finishEarlyText({ kind: 'use-recorded', remaining: ['ɪ', 'ɨ', 'a', 'ʌ'], anyUsable: true }, 'fr')).toEqual({
			link: 'Utiliser ce que j’ai capté',
			caption: 'Si vous le souhaitez, vous pouvez vous arrêter ici : Ilya complète les quatre autres à partir de ce que vous avez capté jusqu’ici.'
		});
		expect(finishEarlyText({ kind: 'use-recorded', remaining: ['o'], anyUsable: true }, 'en').caption).toBe('If you wish, you can stop here: Ilya fills the last one from what you have recorded so far.');
		expect(finishEarlyText({ kind: 'use-recorded', remaining: ['o'], anyUsable: true }, 'fr').caption).toBe('Si vous le souhaitez, vous pouvez vous arrêter ici : Ilya complète la dernière à partir de ce que vous avez capté jusqu’ici.');
		expect(finishEarlyText({ kind: 'use-recorded', remaining: VOWELS.filter((v) => v !== 'i'), anyUsable: false }, 'en')).toEqual({ link: 'Use what I’ve recorded', caption: null });
	});

	it('{m} and the head’s count add to ten', () => {
		for (const n of [1, 3, 5, 9]) {
			const p = profileOf(VOWELS.slice(0, n));
			const s = state(p);
			expect(s.remaining.length + n).toBe(10);
		}
	});
});
