/**
 * spot-choice.ts: WHAT A SAVED SPOT MARK MEANS ON SCREEN. ROW 184 (WORD MARKS), RULED BY DANN 2026-11-09 22:20 (option 2).
 *
 * A mark records the singer's choice for the word (`true` reconstituted, `false` reduced). Every surface that draws a
 * word (`WordStack`, `VerseLine`, `drawPairings`, the legend, the Inspector's checkbox) was written to read "this word
 * is the opposite of the setting", as `map.has(key)`. So the page hands them this: a map of just the words whose
 * choice differs from the setting now, which they read as they always did. A choice that equals the setting draws
 * as the setting does, and is kept, so it still holds when the setting changes.
 */
export function spotInversions(spot: ReadonlyMap<string, boolean>, reconstitution: boolean): Map<string, boolean> {
	const out = new Map<string, boolean>();
	for (const [key, choice] of spot) if (choice !== reconstitution) out.set(key, true);
	return out;
}
