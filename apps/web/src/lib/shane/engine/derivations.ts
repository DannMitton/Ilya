import type { CalibratedFormant, Vowel } from './types';

export const DERIV_SOURCE: Record<string, CalibratedFormant['source']> = {
	ɨ: 'derived-retracted-i', ɪ: 'derived-interpolated', ʌ: 'derived-interpolated', a: 'derived-interpolated',
};

/** The four synthesis derivations (pacifier v11 §9.2). cap holds captured anchors. */
export function derive(vowel: Vowel, cap: Record<string, { f1: number; f2: number }>): CalibratedFormant | null {
	let f1: number, f2: number;
	if (vowel === 'ɨ') { const { i, u } = cap; f1 = 1.365 * i.f1; f2 = i.f2 - 0.67 * (i.f2 - u.f2); }
	else if (vowel === 'ɪ') { const { e, i } = cap; f1 = e.f1; f2 = e.f2 + 0.39 * (i.f2 - e.f2); }
	else if (vowel === 'ʌ') { const ad = cap['ɑ'], eps = cap['ɛ']; f1 = ad.f1; f2 = ad.f2 + 0.52 * (eps.f2 - ad.f2); }
	else if (vowel === 'a') { const ad = cap['ɑ']; f1 = 1.15 * ad.f1; f2 = 1.10 * ad.f2; }
	else return null;
	return { f1: Math.round(f1 * 10) / 10, f2: Math.round(f2 * 10) / 10, confidence: 'medium', reading: 'estimated', source: DERIV_SOURCE[vowel] };
}
