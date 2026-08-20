/**
 * The reading aid's verse arithmetic (N.73 portrait C, ruled by Dann
 * 2026-08-18, ruling 5: "line rules at poem breaks, an end-of-verse mark").
 *
 * Plain TypeScript rather than a rune, for the reason the library door's
 * decisions are: runes are inert under vitest, so a rule written inside a
 * component is a rule no gate can reach.
 *
 * WHERE A POEM BREAKS. Nothing in the tree recorded it before this item.
 * `processText` drops blank lines at its first step, so by the time the
 * document exists as `LineData[]` the singer's stanza breaks are gone. The
 * pipeline now carries one flag across, `endsStanza`, set from the singer's
 * own blank lines and from nothing else. This groups on that flag.
 */
import type { LineData } from './types';

/**
 * Group a document's lines into verses at the singer's blank lines.
 *
 * A document with no blank lines is one verse, which is why every document
 * closes with an end mark. A trailing blank line adds no empty verse: the
 * flag on the last line has nothing after it to open.
 */
export function groupIntoVerses(lines: LineData[]): LineData[][] {
	const verses: LineData[][] = [];
	let current: LineData[] = [];

	for (const line of lines) {
		current.push(line);
		if (line.endsStanza) {
			verses.push(current);
			current = [];
		}
	}

	if (current.length > 0) verses.push(current);

	return verses;
}
