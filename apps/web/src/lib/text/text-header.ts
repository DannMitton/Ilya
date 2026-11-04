/**
 * text-header.ts: the tab name on Text's pages names the text the page prints (poem library build 1, step 7, part 2;
 * brief `docs/sessions/brief-code-poem-library-build1-step7_r4_2026-11-03.md`; Dann 2026-11-03 20:17 to 20:19: "they
 * must correspond"; strings ratified 20:21).
 *
 * THE ONE SWITCH IS `shown`, `+page.svelte`'s own: `shownWitness` (`text/witness-lines.ts`) decides which text Text
 * transcribes, `textLines` branches on it, and `effectiveLines` feeds `Paper`. The label is driven from that value and
 * from nothing else: never from INPUT's view (the pill that can disagree with the page) and never from
 * `inputViews.witnessChoice`, which `shownWitness` has already weighed against whether the two texts differ.
 *
 * The states, from `shownWitness`: Lyrics only prints LYRICS; Poem only prints POEM even with INPUT on LYRICS; both and
 * the same prints LYRICS (a singer who kept a library poem identical to her lyrics reads TEXT: LYRICS, which is correct
 * by this rule); both and different prints what the TEXT pair is on; a POEM view with an empty POEM prints LYRICS; and
 * with no lines at all the page prints no text, so it reads the bare tab name (DESK DEFAULT, reversible: a label naming
 * a text for a page that prints none would be wrong, and the empty directive is hidden in print).
 */
import type { InputView } from './input-views.svelte';

/** The string key for the running head's tab name. */
export type TextTabKey = 'tab.text' | 'paper.headerPoem' | 'paper.headerLyrics';

/** `witness` is `shown`; `hasLines` is whether the page prints any line at all. */
export function textTabKey(witness: InputView, hasLines: boolean): TextTabKey {
	if (!hasLines) return 'tab.text';
	return witness === 'poem' ? 'paper.headerPoem' : 'paper.headerLyrics';
}
