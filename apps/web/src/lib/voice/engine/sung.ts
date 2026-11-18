import type { CalibratedFormant, Vowel } from './types';

/**
 * THE ONE TEST OF "SUNG" (lane 66, Step 5). A stored reading counts as sung when it holds a number above zero, is not an estimate, and is not one the singer set aside
 * with "Use Ilya's estimate for now" (`useEstimate`, lane 67: [ɨ] only; the reading stays stored). It is the whole of
 * the test: the plausibility verdict, the singer's Keep, the signal-quality status, and the quality of the second resonance take no part in it. What a
 * singer sings is what Ilya uses (Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1273`: a neighbourhood "never demotes, discards, or blocks a reading").
 *
 * Read by the count the VOICE pane and its doors print (`voice/profileStore.ts`, `usableReadingCount`), by the vowels INSIGHTS calls measured
 * (`insights/InsightsPane.svelte`), by the resolution of values for MELODY, INSIGHTS, and the chart (`voice/engine/resolve-values.ts`, `derivations.ts`),
 * and by the chart's own dots and the capture screen's "recorded" (`voice/chart/zones.ts`, `finish-early.ts`). Before this lane four sites held four
 * tests, and `analyze.ts:175` can set `f1: 0`; `runCapture` refuses such a take (`:216`), so only data stored by other means can hold one, and two of the four tests counted it.
 */
export const isSung = (f: CalibratedFormant | undefined): f is CalibratedFormant =>
	!!f && f.reading !== 'estimated' && f.useEstimate !== true && typeof f.f1 === 'number' && f.f1 > 0;

/** The six core vowels, Bozeman's six and Dann's "core six" (2026-11-17 23:31): the ones a singer can reliably make on command. */
export const CORE_VOWELS: readonly Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];

/**
 * THE STABLE CORE VOWELS (lane 68; Dann 2026-11-18 13:57 and 14:00: "at least 5 stable fry samples"): the core vowels, in `CORE_VOWELS` order, that are sung (`isSung`) and
 * stable: `confidence !== 'low'`, or a reading the singer kept (`plausibilityOverride === true`, "Keep it" or "Keep them"), whatever its confidence. An unstable take is
 * still used for its own vowel by every site that reads values (`resolve-values.ts`); it only does not count toward the five that complete the profile. A hard vowel
 * ([ɨ], [ɪ], [ʌ], [a]) is not counted.
 */
export const stableCore = (formants: Partial<Record<Vowel, CalibratedFormant>>): Vowel[] =>
	CORE_VOWELS.filter((v) => {
		const f = formants[v];
		return isSung(f) && (f.confidence !== 'low' || f.plausibilityOverride === true);
	});

/** How many of the six core vowels are stable (`stableCore`). */
export const coreCount = (formants: Partial<Record<Vowel, CalibratedFormant>>): number => stableCore(formants).length;

/**
 * THE THRESHOLD (lane 67; Dann 2026-11-17 23:31, `docs/memory/OPEN.md`, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK"; lane 68, Dann 2026-11-18 13:42 to 14:00): five stable
 * core vowels (`stableCore`) complete the singer's own profile. Below five, every sampled vowel is still used as sampled, and the vowels not yet sampled take the declared
 * type's placeholder values unscaled (`stand-ins.ts`). The one test; every site calls it.
 */
export const PERSONAL_CORE_MIN = 5;
export const isPersonal = (formants: Partial<Record<Vowel, CalibratedFormant>>): boolean => coreCount(formants) >= PERSONAL_CORE_MIN;
