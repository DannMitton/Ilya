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

/** One run of a page sentence: italic, IPA, an accidental, or the subscript of fR1. */
export interface RichPart {
	text: string;
	em?: boolean;
	ipa?: boolean;
	acc?: boolean;
	sub?: boolean;
}

/**
 * A sentence of the round 2 page (QUEUE row 66), split once for every face it
 * sets: `*…*` in italics (`$lib/italics`), IPA in brackets, ♭ and ♯ in the sans,
 * and "fR1" as f with a subscript R1, as the comments print it. Drawn as text
 * nodes, never as markup.
 */
export function richParts(text: string): RichPart[] {
	const out: RichPart[] = [];
	for (const piece of text.split(/(\*[^*]+\*)/)) {
		if (!piece) continue;
		const em = piece.length > 2 && piece.startsWith('*') && piece.endsWith('*');
		const body = em ? piece.slice(1, -1) : piece;
		for (const p of body.split(/(\[[^\]]+\]|[♭♯]+|fR1)/)) {
			if (!p) continue;
			const run: RichPart = { text: p, ...(em ? { em } : {}) };
			if (p === 'fR1') out.push({ ...run, text: 'f' }, { ...run, text: 'R1', sub: true });
			else if (p.startsWith('[')) out.push({ ...run, ipa: true });
			else if (/^[♭♯]+$/.test(p)) out.push({ ...run, acc: true });
			else out.push(run);
		}
	}
	return out;
}
