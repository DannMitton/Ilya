/**
 * WHETHER THE PRIMARY POINTER IS COARSE, and told again when it changes.
 *
 * Ruled by Dann 2026-08-10 (E.36, ruling 4's sixth clause, adopted from
 * Opus's wording): "Control geometry answers to input modality, not to form
 * factor or brand." The hook is `(pointer: coarse)`, not a width: an iPad in
 * landscape and a touchscreen laptop are coarse, and a narrow desktop window
 * is not (`docs/memory/OPEN.md`, §RULINGS HOMED, PART 3). First reader: the
 * camera glyph in the Input field, QUEUE row 2k, 2026-09-30.
 *
 * `matchMedia` is passed in so a test can stand in for the browser. Where
 * there is none (prerender), the pointer reads fine and nothing is watched.
 */
export const COARSE_POINTER = '(pointer: coarse)';

type MatchMedia = (query: string) => Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'>;

export function watchCoarsePointer(
	onChange: (coarse: boolean) => void,
	matchMedia: MatchMedia | undefined = typeof window !== 'undefined' ? window.matchMedia?.bind(window) : undefined,
): () => void {
	if (!matchMedia) {
		onChange(false);
		return () => {};
	}
	const list = matchMedia(COARSE_POINTER);
	const listener = (e: MediaQueryListEvent) => onChange(e.matches);
	onChange(list.matches);
	list.addEventListener('change', listener);
	return () => list.removeEventListener('change', listener);
}
