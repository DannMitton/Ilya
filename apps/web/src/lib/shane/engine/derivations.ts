import type { CalibratedFormant, Vowel } from './types';

export const DERIV_SOURCE: Record<string, CalibratedFormant['source']> = {
	ɨ: 'derived-retracted-i', ɪ: 'derived-interpolated', ʌ: 'derived-interpolated', a: 'derived-interpolated',
};

/**
 * The fR1 component of the four derivations, exported separately so the
 * plausibility guard (plausibility.ts, engine-spec amendment 2026-07-11)
 * can compute anchor-derived window centres without requiring fR2 on the
 * anchors (fR2 is often absent on real captures; the guard is fR1-only in
 * v1). Single source of truth: these ratios are the same ones `derive`
 * uses below — change them in one place only.
 *
 * The ɪ f1 ratio (1.0315 = 393 / 381) reconciles the derivation with the
 * measured Table 5.3 anchor; it previously read e.f1 directly, a 12 Hz
 * (≈3.15%) gap flagged by the Sonnet provenance check (2026-07-17).
 */
export function expectedF1(vowel: Vowel, f1s: Partial<Record<Vowel, number>>): number | null {
	if (vowel === 'ɨ') return f1s.i !== undefined ? 1.365 * f1s.i : null;
	if (vowel === 'ɪ') return f1s.e !== undefined ? 1.0315 * f1s.e : null;
	if (vowel === 'ʌ') return f1s['ɑ'] ?? null;
	if (vowel === 'a') return f1s['ɑ'] !== undefined ? 1.15 * f1s['ɑ'] : null;
	return null;
}

/** The four synthesis derivations (pacifier v11 §9.2). cap holds captured anchors. */
export function derive(vowel: Vowel, cap: Record<string, { f1: number; f2: number }>): CalibratedFormant | null {
	let f1: number, f2: number;
	if (vowel === 'ɨ') { const { i, u } = cap; f1 = 1.365 * i.f1; f2 = i.f2 - 0.67 * (i.f2 - u.f2); }
	else if (vowel === 'ɪ') { const { e, i } = cap; f1 = 1.0315 * e.f1; f2 = e.f2 + 0.39 * (i.f2 - e.f2); }
	else if (vowel === 'ʌ') { const ad = cap['ɑ'], eps = cap['ɛ']; f1 = ad.f1; f2 = ad.f2 + 0.52 * (eps.f2 - ad.f2); }
	else if (vowel === 'a') { const ad = cap['ɑ']; f1 = 1.15 * ad.f1; f2 = 1.10 * ad.f2; }
	else return null;
	return { f1: Math.round(f1 * 10) / 10, f2: Math.round(f2 * 10) / 10, confidence: 'medium', reading: 'estimated', source: DERIV_SOURCE[vowel] };
}

/**
 * The anchors each derivable vowel needs, keyed to `derive` above. One table,
 * two readers: the wizard's roster preview (CalibrationWizard.svelte) and the
 * analysis adapter's forecast (analyze-score-adapter.ts), so the roster and
 * the forecast cannot disagree about what is derivable (N.109). It lived in
 * the wizard until then, which is why the roster showed an Estimated value the
 * forecast silently dropped.
 *
 * Keys match DERIV_SOURCE exactly. [a] needs only [ɑ]; the other three need
 * two anchors each. No anchor is itself derivable, so nothing chains.
 */
export const DERIVE_ANCHORS: Partial<Record<Vowel, Vowel[]>> = {
	ɨ: ['i', 'u'],
	ɪ: ['e', 'i'],
	ʌ: ['ɑ', 'ɛ'],
	a: ['ɑ'],
};

/**
 * Usable as a derivation anchor: both resonances present as positive numbers,
 * and not judged implausible.
 *
 * A Provisional anchor still derives (Dann, 2026-07-11): a greyed synthetic
 * value beats an empty cell, and the derivation math needs numbers, not
 * confidence labels. The earlier not-Provisional gate blocked every derivation
 * whenever a session ran Provisional-heavy, which is exactly when the singer
 * most wants the full picture. `reading` and `confidence` are signal-quality
 * verdicts, and neither speaks to whether the number can be the vowel.
 *
 * `plausibility` does speak to that, and it is the one gate here (N.109,
 * carrying §B.4's rule inward). Fit will not build a derived value on an
 * anchor the guard has already decided cannot be that vowel. `unchecked` and
 * absent both mean the guard never ran, which is not a verdict, so both pass.
 *
 * The locked anchor rule (a Provisional [i]/[u] resolves [ɨ] to Provisional)
 * belongs to the engine's resolution pass (`applyIghDivergence`, not yet
 * wired). Until that pass takes over, a derived value stays labelled
 * Estimated on the roster and unlabelled in the forecast.
 */
export function usableAnchor(f: CalibratedFormant | undefined): f is CalibratedFormant & { f2: number } {
	return (
		!!f &&
		typeof f.f1 === 'number' &&
		f.f1 > 0 &&
		typeof f.f2 === 'number' &&
		f.f2 > 0 &&
		f.plausibility !== 'implausible'
	);
}

/**
 * The derived reading for `vowel`, or undefined when any anchor it needs is
 * missing or unusable. The single entry point both readers use, so the anchor
 * table, the usability gate, and `derive` are applied identically at both
 * sites. Reads only what was sampled; it never derives from a derived value.
 */
export function deriveFrom(
	vowel: Vowel,
	sampled: Partial<Record<Vowel, CalibratedFormant>>,
): CalibratedFormant | undefined {
	const need = DERIVE_ANCHORS[vowel];
	if (!need) return undefined;
	const cap: Record<string, { f1: number; f2: number }> = {};
	for (const a of need) {
		const f = sampled[a];
		if (!usableAnchor(f)) return undefined;
		cap[a] = { f1: f.f1, f2: f.f2 };
	}
	return derive(vowel, cap) ?? undefined;
}
