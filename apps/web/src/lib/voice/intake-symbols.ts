/**
 * THE ACOUSTICS QUESTION'S SYMBOLS (N.199, the Titze alignment of 2026-11-13). The stem of `voiceIntake.acoustics` names four terms with their symbols in
 * parentheses, "fundamental (fo), harmonic (nfo), resonance (fR1), and formant (F1)", which Dann wrote on Titze et al. (2015), Table I (`i18n.ts`, ruled
 * 2026-09-29). Table I sets each as an italic letter with an upright subscript: fo (italic f, subscript o), nfo (n, italic f, subscript o), fR1 (italic f,
 * subscript R1, the R a full capital), F1 (italic F, subscript 1). This splits a stem into text and those four symbols so `InsightsIntake.svelte`, which
 * draws a stem as markup (a stem may carry `<em>`), can set them. The string's words are not changed, in either language.
 *
 * It lives beside the component that uses it because `lib/voice` may not import `lib/insights` (`scripts/ratchets.mjs`), where `richParts` is.
 */
export type StemSymbol = 'fo' | 'nfo' | 'fR1' | 'F1';
export type StemPart = { kind: 'html'; text: string } | { kind: 'symbol'; symbol: StemSymbol };

/** A symbol only counts inside parentheses, as the stems write them, so a word that happens to contain "fo" is never touched. */
const SYMBOL = /\((nfo|fo|fR1|F1)\)/g;

export function stemParts(stem: string): StemPart[] {
	const out: StemPart[] = [];
	let last = 0;
	for (const m of stem.matchAll(SYMBOL)) {
		const at = m.index!;
		if (at > last) out.push({ kind: 'html', text: stem.slice(last, at) });
		out.push({ kind: 'html', text: '(' }, { kind: 'symbol', symbol: m[1] as StemSymbol }, { kind: 'html', text: ')' });
		last = at + m[0].length;
	}
	if (last < stem.length) out.push({ kind: 'html', text: stem.slice(last) });
	return out;
}

/** What each symbol is made of: its letters, which are italic, and its subscript. */
export const SYMBOL_PARTS: Record<StemSymbol, { before: string; italic: string; sub: string }> = {
	fo: { before: '', italic: 'f', sub: 'o' },
	nfo: { before: 'n', italic: 'f', sub: 'o' },
	fR1: { before: '', italic: 'f', sub: 'R1' },
	F1: { before: '', italic: 'F', sub: '1' }
};
