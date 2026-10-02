/**
 * Italics in a plain-text string: `*…*` is italic, the mark `comment-text.ts`
 * already reads (`toRuns`). It is how a French string that renders as a text
 * node sets an Italian musical term in italics (QUEUE row 15, ruled by Dann
 * 2026-10-01 02:58: Roberge's GDRM for Italian musical terms).
 *
 * Never `{@html}`: the runs are drawn as text nodes and `<em>`, so a string
 * that carries user data cannot inject markup through it.
 */

import type { Run } from '$lib/sources';

/** `a *b* c` → "a ", italic "b", " c". A lone asterisk stays a character. */
export function italicRuns(text: string): Run[] {
	const out: Run[] = [];
	for (const part of text.split(/(\*[^*]+\*)/)) {
		if (!part) continue;
		if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) out.push({ text: part.slice(1, -1), title: true });
		else out.push({ text: part });
	}
	return out;
}

/** The same string with the marks removed, for an attribute or a width that cannot be italic. */
export const withoutItalics = (text: string): string => italicRuns(text).map((r) => r.text).join('');
