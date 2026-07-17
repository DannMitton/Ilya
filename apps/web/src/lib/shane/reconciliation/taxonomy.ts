/**
 * Fit reconciliation shell: the disparity taxonomy (piece 2 of 4).
 *
 * Two pure pieces, no detection. Detecting a divergence, or classifying a raw
 * pair (dictionary membership, edit distance, alignment), is the alignment
 * engine, and that waits for the research pass (handover §A.38). Here we only
 * route an already-classified divergence to its treatment, and derive the
 * summary state from a completed pass.
 */

import type { DisparityClass, Reconciliation, Treatment } from './types';

/**
 * The fixed class-to-treatment routing (brief §3; Kimi Q1-Q6, binding):
 *   - orthographic-trivia -> auto-reconciled toward Ilya, quiet provenance
 *   - probable-error      -> flagged, navigate-only, never auto-corrected (Q3)
 *   - intentional-variance -> witnessed, the score stands, apparatus record (Q4)
 */
const TREATMENT_BY_CLASS: Record<DisparityClass, Treatment> = {
	'orthographic-trivia': 'auto-reconciled',
	'probable-error': 'flagged',
	'intentional-variance': 'witnessed'
};

/** Route a disparity class to its fixed treatment. */
export function treatmentFor(cls: DisparityClass): Treatment {
	return TREATMENT_BY_CLASS[cls];
}

/**
 * The derived state of a reconciliation pass, for the drawer summary line.
 *
 * A discriminated union so the not-assessed state can never collapse into
 * "agree" or any other settled status (§A.56). Consumers switch on `kind`;
 * there is no way to read a count off a pass that never ran.
 */
export type ReconciliationSummary =
	| { kind: 'not-assessed' }
	| { kind: 'agree' }
	| { kind: 'diverge'; count: number };

/**
 * Derive the summary from a reconciliation pass, or its absence:
 *   - undefined            -> not-assessed (the drawer renders nothing)
 *   - no surfaced items    -> agree ("Score and poem agree")
 *   - n surfaced items     -> diverge, count n ("Score and poem diverge in n places")
 *
 * Surfaced means treatment is not 'auto-reconciled'. Auto-reconciled trivia, the
 * ё-for-е convention above all, is quiet-provenance only and is never counted; a
 * Russian song that differs from the poem only by that convention reads "agree",
 * not "diverge in forty places" (Dann, 2026-07-16). The count is derived here at
 * the point of use, by filtering on treatment, never stored (§A.56, §A.57).
 */
export function summarise(recon?: Reconciliation): ReconciliationSummary {
	if (!recon) return { kind: 'not-assessed' };
	const count = recon.divergences.filter((d) => d.treatment !== 'auto-reconciled').length;
	return count === 0 ? { kind: 'agree' } : { kind: 'diverge', count };
}
