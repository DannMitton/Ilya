/**
 * N.203 lane 59 Step 6: finish early. The state comes from the chart's own resolution (Fable's review, amendment 10), so each case below is one the count of
 * recorded vowels alone would get wrong. And the ratified counted forms and consent captions, in both languages, for every count.
 */
import { describe, expect, it } from 'vitest';
import { finishEarlyState, finishEarlyText, numberWord, vowelList } from './finish-early';
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
/** The screen's own "recorded": a stored reading that is not an estimate, with a positive fR1 (`VowelCapture.svelte` `sungSet`). */
const recordedOf = (p: Partial<Record<Vowel, CalibratedFormant>>) => new Set(VOWELS.filter((v) => p[v] && p[v]!.reading !== 'estimated' && p[v]!.f1 > 0));
const state = (p: Partial<Record<Vowel, CalibratedFormant>>, voiceType: string | undefined = 'bass') => finishEarlyState(p, voiceType, recordedOf(p));

describe('the state of the control', () => {
	it('after the seven in Ilya’s order: work out the other three, [ɪ], [ɨ], [ʌ], in VOWELS order', () => {
		expect(state(profileOf(TOUR_SEVEN))).toEqual({ kind: 'workOut', m: 3, vowels: ['ɪ', 'ɨ', 'ʌ'] });
	});

	it('is absent with nothing recorded and with all ten', () => {
		expect(state({})).toBeNull();
		expect(state(profileOf(VOWELS))).toBeNull();
	});

	it('with [o] unrecorded: use what I have recorded (it cannot be worked out)', () => {
		const s = state(profileOf(['i', 'e', 'ɛ', 'a', 'ɑ', 'u']));
		expect(s).toEqual({ kind: 'useRecorded', m: 4, anySung: true });
	});

	it('an anchor recorded without fR2 is not enough: use what I have recorded', () => {
		const p = profileOf(TOUR_SEVEN, { i: R(300, undefined) });
		expect(state(p)?.kind).toBe('useRecorded');
	});

	it('an anchor with an absent fR2 quality is not enough, though its fR2 is a positive number', () => {
		const p = profileOf(TOUR_SEVEN, { i: R(300, 2200, { f2Quality: 'absent' }) });
		expect(state(p)?.kind).toBe('useRecorded');
	});

	it('[o] recorded but implausible and not kept takes a stand-in: use what I have recorded', () => {
		const p = profileOf(TOUR_SEVEN, { o: R(1063, 900, { plausibility: 'implausible' }) });
		expect(state(p)?.kind).toBe('useRecorded');
	});

	it('"Not sure" with three recorded: use what I have recorded', () => {
		const s = state(profileOf(['i', 'e', 'u']), 'not-sure');
		expect(s).toEqual({ kind: 'useRecorded', m: 7, anySung: true });
	});

	it('one recorded vowel, implausible and not kept: the button stands, and says nothing was usable', () => {
		const p = profileOf([], { i: R(1063, 2200, { plausibility: 'implausible' }) });
		expect(state(p)).toEqual({ kind: 'useRecorded', m: 9, anySung: false });
	});

	it('a kept implausible reading counts again', () => {
		const p = profileOf(TOUR_SEVEN, { o: R(1063, 900, { plausibility: 'implausible', plausibilityOverride: true } as Partial<CalibratedFormant>) });
		expect(state(p)?.kind).toBe('workOut');
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
		const s = { kind: 'workOut', m: 3, vowels: ['ɪ', 'ɨ', 'ʌ'] } as const;
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
		expect(finishEarlyText({ kind: 'workOut', m: 2, vowels: ['ɪ', 'ʌ'] }, 'en').link).toBe('Let Ilya work out the other two');
		expect(finishEarlyText({ kind: 'workOut', m: 2, vowels: ['ɪ', 'ʌ'] }, 'fr').link).toBe('Laisser Ilya déduire les deux autres');
		const one = { kind: 'workOut', m: 1, vowels: ['ʌ'] } as const;
		expect(finishEarlyText(one, 'en')).toEqual({ link: 'Let Ilya work out the last one', caption: 'You have recorded the vowels Ilya needs. If you wish, it can work out the last one from them: [ʌ].' });
		expect(finishEarlyText(one, 'fr')).toEqual({
			link: 'Laisser Ilya déduire la dernière',
			caption: 'Vous avez capté les voyelles dont Ilya a besoin. Si vous le souhaitez, il peut en déduire la dernière : [ʌ].'
		});
	});

	it('use what I have recorded: the link, and the caption by count, or none when nothing was usable', () => {
		expect(finishEarlyText({ kind: 'useRecorded', m: 4, anySung: true }, 'en')).toEqual({
			link: 'Use what I’ve recorded',
			caption: 'If you wish, you can stop here: Ilya fills the other four from what you have recorded so far.'
		});
		expect(finishEarlyText({ kind: 'useRecorded', m: 4, anySung: true }, 'fr')).toEqual({
			link: 'Utiliser ce que j’ai capté',
			caption: 'Si vous le souhaitez, vous pouvez vous arrêter ici : Ilya complète les quatre autres à partir de ce que vous avez capté jusqu’ici.'
		});
		expect(finishEarlyText({ kind: 'useRecorded', m: 1, anySung: true }, 'en').caption).toBe('If you wish, you can stop here: Ilya fills the last one from what you have recorded so far.');
		expect(finishEarlyText({ kind: 'useRecorded', m: 1, anySung: true }, 'fr').caption).toBe('Si vous le souhaitez, vous pouvez vous arrêter ici : Ilya complète la dernière à partir de ce que vous avez capté jusqu’ici.');
		expect(finishEarlyText({ kind: 'useRecorded', m: 9, anySung: false }, 'en')).toEqual({ link: 'Use what I’ve recorded', caption: null });
	});

	it('{m} and the head’s count add to ten', () => {
		for (const n of [1, 3, 5, 9]) {
			const p = profileOf(VOWELS.slice(0, n));
			const s = state(p);
			expect(s!.m + n).toBe(10);
		}
	});
});
