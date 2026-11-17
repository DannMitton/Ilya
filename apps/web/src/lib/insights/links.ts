/**
 * THE LINKS FROM THE INSIGHTS PAGE TO THE REST OF THE APP (N.203 lane 61, Steps 3 and 4; Dann 2026-11-15 20:20: "I like the practice of
 * linking parts of the complex app to one another"). One object, so the pane's Props and the notes block take one line each. The page
 * builds it; a link is absent (undefined) where it would open nothing, so the block draws it only when it is there.
 *
 * `shares`: L1, "What INSIGHTS shares, and how", which opens that station. Not given when no voice is saved: the stations do not exist then.
 */
export interface InsightsLinks {
	shares?: () => void;
}
