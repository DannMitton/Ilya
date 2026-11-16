/**
 * THE WELCOME SHEET'S MOTION, as numbers and one pure planner (brief r2 item 6). The numbers are the ratified prototype's
 * (`docs/sessions/welcome-sheet/ilya-welcome-draft-17.html`, its script, lines 102-122): six images, five turns, the plate stays where it is and each
 * image arrives under the same 30-degree edge sweeping top to bottom, then rests long enough to be seen whole. Run once. NOTHING IS HIDDEN, so
 * the reader can begin the paragraph on the first frame and Begin works from the first frame; the plate is an ornament that runs and rests.
 *
 * Kept as plain TypeScript so a test can pin the schedule and the reduced-motion rule (runes are inert under vitest).
 */

/** One wipe, ms. */
export const WIPE_MS = 720;
/** The rest after a wipe, ms, long enough to see the image whole. */
export const HOLD_MS = 380;
/** The first turn's delay after the sheet is on screen, ms (the prototype's 250 ms after load, plus its own 700). */
export const FIRST_MS = 700;
export const START_DELAY_MS = 250;
/** The wipe's easing. */
export const WIPE_EASE = 'cubic-bezier(.45, 0, .25, 1)';
/** A station's label lights this fraction of the way into the wipe that brings its image. */
export const STATION_AT = 0.45;
/**
 * Leaving: Begin fades the scrim out in 260 ms and the sheet in 180 ms, ease-out, opacity and (for the sheet) transform only, as the prototype has them
 * (`ilya-welcome-draft-17.html`, lines 24 and 27). The sheet is the app's own `--motion` (180 ms ease-out). The desk's amendment of 2026-11-16, item 4, moved the
 * scrim from 180 to 260 ms; `LEAVE_MS` is the longer of the two, so it is also how long the sheet stays mounted after Begin.
 */
export const LEAVE_MS = 260;
/** The sheet's own fade and rise on leaving, ms. */
export const SHEET_LEAVE_MS = 180;

/** Six images (0 to 5). Image 0 is on the plate from the first frame; images 1 to 5 arrive by a turn each. */
export const IMAGE_COUNT = 6;
export const LAST_IMAGE = IMAGE_COUNT - 1;

/**
 * The station each image belongs to: 0 TEXT, 1 MELODY, 2 INSIGHTS, -1 none. The three labels are the app's own (`tab.text`, `tab.markedScore`,
 * `tab.insights`). я and [ɑ] are TEXT; the note on a staff is MELODY; the [ɑ] zone and the vowel space are INSIGHTS; the icon rests all three.
 */
export const STATION_OF_IMAGE: readonly number[] = [0, 0, 1, 2, 2, -1];

export interface Turn {
	/** The image this turn brings, 1 to 5. */
	image: number;
	/** When the wipe starts, ms after the sheet is on screen. */
	startMs: number;
	/** When the station label changes, ms after the sheet is on screen. */
	stationMs: number;
}

/** The five turns in order. */
export function turns(): Turn[] {
	const out: Turn[] = [];
	for (let k = 1; k <= LAST_IMAGE; k++) {
		const startMs = START_DELAY_MS + FIRST_MS + (k - 1) * (WIPE_MS + HOLD_MS);
		out.push({ image: k, startMs, stationMs: startMs + Math.round(WIPE_MS * STATION_AT) });
	}
	return out;
}

/** When the last wipe ends, ms: the whole motion's length. */
export function totalMs(): number {
	const last = turns()[LAST_IMAGE - 1];
	return last.startMs + WIPE_MS;
}

/** The state a viewer sees at rest: every image turned, all three labels resting (`STATION_OF_IMAGE[5]`). */
export const FINAL = { turned: LAST_IMAGE, station: STATION_OF_IMAGE[LAST_IMAGE] } as const;

/** The state before any turn. */
export const FIRST_FRAME = { turned: 0, station: STATION_OF_IMAGE[0] } as const;

/**
 * What to run. `prefers-reduced-motion` shows the final state at once, with no wipe, no timer, and no station change.
 * Otherwise the plan is the five turns.
 */
export function plan(reducedMotion: boolean): { animate: false; state: typeof FINAL } | { animate: true; turns: Turn[] } {
	if (reducedMotion) return { animate: false, state: FINAL };
	return { animate: true, turns: turns() };
}
