/**
 * text-parts.ts — how Insights splits a line so its IPA and its accidentals
 * set in their own faces, and how it quotes a finding's word. Moved out of
 * `InsightsPane.svelte` unchanged in behaviour (N.94 slice 2 and its
 * addendum), because the pane sits at its size ceiling (`ARCHITECTURE.md`
 * invariant 12). Pure.
 */

/* The word as the score prints it, less the punctuation the engraver set
   against it: `collectScoreWords` keeps the raw cell, comma and all. */
export function wordOf(f: { word?: string }): string {
	return (f.word ?? '').replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, '');
}

/** IPA in brackets sets in the IPA face; ♭ and ♯ set in the sans, as the fit table's do. */
export function textParts(text: string): Array<{ text: string; ipa?: boolean; acc?: boolean }> {
	return text
		.split(/(\[[^\]]+\]|[♭♯]+)/)
		.filter((p) => p.length > 0)
		.map((p) => (p.startsWith('[') ? { text: p, ipa: true } : /^[♭♯]+$/.test(p) ? { text: p, acc: true } : { text: p }));
}

/* THE FIT TABLE'S ACCIDENTALS SET IN THE SANS. Walk finding 2026-09-24:
   no face of `--font-serif` (`app.css:23`) carries ♭ with a tight
   advance, so the browser's fallback drew it a full em wide, "E ♭ 4",
   while ♯ took half an em. The sans draws both tight, as the
   tessituragram's own labels already do. Measured, not inferred. */
export function accidentalParts(text: string): Array<{ text: string; acc: boolean }> {
	return text
		.split(/([♭♯]+)/)
		.filter((p) => p.length > 0)
		.map((part) => ({ text: part, acc: /^[♭♯]+$/.test(part) }));
}
