/**
 * Which vowel comes next (N.199 Step 1; ruling 11, Dann 2026-11-12 22:39 and 22:43). Ilya's linear order stays: the seven
 * the tour has always asked, [i e ɛ a ɑ o u], then the three hardest for a new singer to produce on demand, [ɨ ɪ ʌ]
 * (`CalibrationWizard.svelte`'s `DEFAULT_VOWELS` and `CHALLENGING_VOWELS`). After a manual pick Ilya carries on from
 * the singer's lead: round the seven from the vowel just sung, wrapping, and only then the three. It never starts a
 * take; the screen moves its selection and waits.
 */
import type { Vowel } from '../engine/types';

export const TOUR_SEVEN: readonly Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u'];
export const TOUR_HARDEST: readonly Vowel[] = ['ɨ', 'ɪ', 'ʌ'];
export const TOUR_ORDER: readonly Vowel[] = [...TOUR_SEVEN, ...TOUR_HARDEST];

/**
 * @param sung the vowels with a stored reading, including the one just captured.
 * @param last the vowel just sung or picked, or null at the start.
 * @param pass an optional list to walk instead (a re-take from the summary, the review's "pass"): the vowel after `last`
 *   in it, the first when `last` is not in it, then null. `sung` is ignored for a pass, because a re-take is of a vowel
 *   already sung.
 * @returns the next vowel, or null when none is left.
 */
export function nextVowel(sung: Iterable<Vowel>, last: Vowel | null, pass?: readonly Vowel[]): Vowel | null {
	if (pass) {
		const at = last === null ? -1 : pass.indexOf(last);
		return pass[at + 1] ?? null;
	}
	const done = new Set<Vowel>(sung);
	const n = TOUR_ORDER.length;
	const at = last === null ? -1 : TOUR_ORDER.indexOf(last);
	// Round the seven from the singer's last vowel, wrapping.
	for (let q = 1; q <= n; q++) {
		const k = TOUR_ORDER[(((at < 0 ? -1 : at) + q) % n + n) % n];
		if (!done.has(k) && TOUR_SEVEN.includes(k)) return k;
	}
	// Then the three hardest, in their order.
	for (const k of TOUR_HARDEST) if (!done.has(k)) return k;
	return null;
}
