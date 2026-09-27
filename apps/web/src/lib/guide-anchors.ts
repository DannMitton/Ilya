/**
 * The Guide's section anchors that N.174 D.3 (2026-09-27) renamed, and the
 * old id each one replaced. A singer may have saved a link carrying an old
 * anchor, so `+page.svelte`'s `handleHashNavigation` reads the old id through
 * `currentGuideAnchor` before it scrolls, and writes the new one to the
 * address bar. The same rule as `restoreSurface`: a stored id changes only
 * with a migration that reads both (ARCHITECTURE.md, invariant 10).
 */
const RENAMED: Readonly<Record<string, string>> = {
	'guide-fit-forecast': 'guide-markup-forecast',
	'guide-fit-characteristics': 'guide-markup-characteristics',
	'guide-fit-notation': 'guide-markup-notation',
};

/** The id to scroll to for an anchor read from the address. */
export function currentGuideAnchor(id: string): string {
	return RENAMED[id] ?? id;
}
