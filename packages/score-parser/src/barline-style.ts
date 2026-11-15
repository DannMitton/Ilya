/**
 * Which barlines the source prints as a light-light double (N.192, ruled by Dann 2026-11-12 01:05 and 13:21; Gould p. 92: "A double barline
 * precedes the new key signature only if the key change coincides with a new musical section"). A key change takes the barline the source
 * prints: a double only where the MusicXML marks one (`<bar-style>light-light</bar-style>`), else a single.
 */
import type { Measure } from './types';

interface XmlEl {
	readonly tagName: string;
	getAttribute(name: string): string | null;
	readonly children: ArrayLike<XmlEl>;
	readonly textContent: string | null;
}
const kids = (el: XmlEl, tag: string): XmlEl[] => Array.from(el.children).filter((c) => c.tagName === tag);

/**
 * Mark `doubleBarBefore` on each measure whose opening barline is a light-light double: the previous measure's right barline (the default
 * location), or its own left one. `measureEls` are the vocal part's `<measure>` elements, in the order `measures` has them.
 */
export function markDoubleBars(measureEls: readonly XmlEl[], measures: Measure[]): void {
	measureEls.forEach((el, i) => {
		for (const b of kids(el, 'barline')) {
			if (!kids(b, 'bar-style').some((s) => s.textContent?.trim() === 'light-light')) continue;
			const target = b.getAttribute('location') === 'left' ? i : i + 1;
			if (measures[target]) measures[target].doubleBarBefore = true;
		}
	});
}
