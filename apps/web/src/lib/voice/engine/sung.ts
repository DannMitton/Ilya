import type { CalibratedFormant, Vowel } from './types';

/**
 * THE ONE TEST OF "SUNG" (lane 66, Step 5). A stored reading counts as sung when it holds a number above zero and is not an estimate. It is the whole of
 * the test: the plausibility verdict, the singer's Keep, the signal-quality status, and the quality of the second resonance take no part in it. What a
 * singer sings is what Ilya uses (Dann 2026-11-13, `docs/memory/PRODUCT.md:1269-1273`: a neighbourhood "never demotes, discards, or blocks a reading").
 *
 * Read by the count the VOICE pane and its doors print (`voice/profileStore.ts`, `usableReadingCount`), by the vowels INSIGHTS calls measured
 * (`insights/InsightsPane.svelte`), by the resolution of values for MELODY, INSIGHTS, and the chart (`voice/engine/resolve-values.ts`, `derivations.ts`),
 * and by the chart's own dots and the capture screen's "recorded" (`voice/chart/zones.ts`, `finish-early.ts`). Before this lane four sites held four
 * tests, and `analyze.ts:175` can set `f1: 0`; `runCapture` refuses such a take (`:216`), so only data stored by other means can hold one, and two of the four tests counted it.
 */
export const isSung = (f: CalibratedFormant | undefined): f is CalibratedFormant => !!f && f.reading !== 'estimated' && typeof f.f1 === 'number' && f.f1 > 0;

/** The six core vowels, Bozeman's six and Dann's "core six" (2026-11-17 23:31): the ones a singer can reliably make on command. */
export const CORE_VOWELS: readonly Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];

/**
 * How many of the six core vowels the singer has sung (`isSung`). An unstable reading counts: the flag invites a re-take and blocks nothing (DESK DEFAULT on
 * Dann's word "proper", from `docs/memory/PRODUCT.md:1269-1270`, a status never blocks a reading). A hard vowel ([ɨ], [ɪ], [ʌ], [a]) is not counted.
 */
export const coreCount = (formants: Partial<Record<Vowel, CalibratedFormant>>): number => CORE_VOWELS.filter((v) => isSung(formants[v])).length;

/**
 * THE THRESHOLD (lane 67; Dann 2026-11-17 23:31, `docs/memory/OPEN.md`, "VOICE: HOW ILYA MEETS A VOICE, AND A BREAK"): five of the six core vowels sung unlock the
 * singer's own profile. Below five, what is recorded stays stored and shown in the VOICE pane and the chart, and unlocks nothing personal: every site that reads
 * values treats the voice as one with nothing recorded. The one test; every site calls it.
 */
export const PERSONAL_CORE_MIN = 5;
export const isPersonal = (formants: Partial<Record<Vowel, CalibratedFormant>>): boolean => coreCount(formants) >= PERSONAL_CORE_MIN;
