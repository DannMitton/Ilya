/**
 * Whether a word's provenance frame has an icon to draw (row 148; Dann 2026-10-20
 * 03:33, on the enclitic «ж» in Text: "why is this empty sigil circle assigned to
 * this enclitic?").
 *
 * The frame is a circle that holds one of four icons. It drew whenever a source
 * was not a dictionary's, so a source with no icon (a clitic with no stress data,
 * which the pipeline marks `'inferred'`, or `'yo-normalized'`) drew the frame
 * empty. The frame now draws only where an icon applies. An inferred word that
 * is not a clitic keeps its own verify treatment (`WordStack.svelte`'s
 * `is-inferred`); this does not touch it.
 */

/** The four sources the frame has an icon for, one SVG each in `WordStack.svelte`. */
export const ICONED_SOURCES: ReadonlySet<string> = new Set(['user-dictionary', 'user-composer', 'user-override', 'yo-restored']);

export function hasProvenanceIcon(stressSource: string | undefined): boolean {
	return stressSource !== undefined && ICONED_SOURCES.has(stressSource);
}
