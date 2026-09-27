/**
 * Fit reconciliation shell: the "Textual witnesses" drawer view-model (piece 3 of 4).
 *
 * Pure derivation for the drawer section. TextualWitnesses.svelte renders this. There
 * is no component-render test harness in apps/web (logic lives in .ts and is tested;
 * presentation lives in .svelte and is reviewed and gated in the browser), so every
 * derivable state lives here where it can be unit-tested.
 *
 * Scope is exactly the shell's drawer definition: the collapsed section, one quiet
 * summary line, and rows carrying measure numbers and navigation links. The richer
 * per-class affordances Kimi describes (the amber probable-error indicator, the
 * "Keep score text" dismissal, the recurrence comparison panel) are a later beat: they
 * need dispositions wired and the engine's classified output, neither of which the
 * shell has.
 */

import type { Divergence, Reconciliation } from './types';
import { summarise, type ReconciliationSummary } from './taxonomy';

/** The strophic scope note (Kimi Q5); present only when more than one verse is banked. */
export interface VerseNote {
	analysed: number;
	total: number;
}

/** Everything the drawer section needs, derived from one reconciliation pass. */
export interface WitnessesModel {
	summary: ReconciliationSummary;
	/** Surfaced divergences in reading order (by measure, then id) for the expanded list. Auto-reconciled trivia is excluded, as it is from the count. */
	rows: Divergence[];
	/** Present only when totalVerses > 1. */
	verseNote: VerseNote | null;
}

/**
 * Derive the drawer model. When no pass has run the model is not-assessed with no
 * rows and no verse note, so the section renders nothing (§A.56, honest absence).
 */
export function witnessesModel(recon?: Reconciliation): WitnessesModel {
	const summary = summarise(recon);
	if (!recon) return { summary, rows: [], verseNote: null };
	const rows = recon.divergences
		.filter((d) => d.treatment !== 'auto-reconciled')
		.sort((a, b) => a.location.measure - b.location.measure || a.id.localeCompare(b.id));
	const verseNote =
		recon.totalVerses > 1 ? { analysed: recon.analysedVerse, total: recon.totalVerses } : null;
	return { summary, rows, verseNote };
}
