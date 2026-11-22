/**
 * THE LINKS FROM THE INSIGHTS PAGE TO THE REST OF THE APP (N.203 lane 61, Steps 3 and 4; Dann 2026-11-15 20:20: "I like the practice of
 * linking parts of the complex app to one another"). One object, so the pane's Props and the notes block take one line each. The page
 * builds it; a link is absent (undefined) where it would open nothing, so the block draws it only when it is there.
 *
 * `shares`: L1, "What INSIGHTS shares, and how", which opens that station. Not given when no voice is saved: the stations do not exist then.
 * `record` and `recordKey`: L4, a link to record vowels, drawn where the Method line says the findings rest on placeholder values. Its words are
 * the VOICE pane's own door for the voice's state (`recordDoorKey`: "Record your vowels", "Carry on recording", "Record a vowel again"), so the
 * page and the pane name the same door alike; the page passes the key because it holds the usable count.
 * `input` and `voice`: L6, and lane 78's VOICE link: the words INPUT and VOICE in the blank page's squircle (`components/Paper/BlankState.svelte`), which open
 * those two bands in the Drawer. They were the sentence's INPUT alone, found by an exact-string test in `SingerBlock.svelte`; `BlankState` finds every section
 * name in a sentence by position instead (`components/Paper/blank-state.ts`), so a sentence may carry both.
 */
export interface InsightsLinks {
	shares?: () => void;
	record?: () => void;
	recordKey?: string;
	input?: () => void;
	voice?: () => void;
}
