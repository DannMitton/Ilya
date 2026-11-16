/**
 * THE WELCOME SHEET'S FLAG (lane `cloud-lane-57`, brief r2 item 2). The sheet stands over the app once per browser: it is shown until the
 * singer chooses Begin, and Begin writes this flag. A returning browser never sees it.
 *
 * PLAIN TYPESCRIPT, for the reason `install-decline.ts` gives: `apps/web` has no DOM environment under vitest, so the rule lives here, takes
 * its storage as an argument, and the test hands it a store that throws. The component passes `() => localStorage`.
 *
 * THE STORE IS REACHED INSIDE THE `try`. Reading the name `localStorage` can itself throw (a blocked-storage `SecurityError`), so the
 * accessor is a function that the `try` calls, not a value the caller has already fetched.
 *
 * WHEN STORAGE THROWS the sheet is shown and nothing crashes: a read that throws reads as "not seen", and a write that throws is dropped, so
 * a browser that cannot store sees the sheet on every visit. That is the brief's rule, and the honest one: Ilya cannot know it was seen.
 */

/** The stored key, `ilya:` prefixed after the tree's own (`ilya:activeTab`, `ilya:language`, `ilya:notationPrefs`, `ilya:showStressDiacritics`). */
export const WELCOME_SEEN_KEY = 'ilya:welcomeSeen';

/** The stored value. Anything else under the key (another script's write, an empty string) is not the flag. */
export const WELCOME_SEEN_VALUE = '1';

/** The two methods used, so a test can hand in a plain object. */
export interface WelcomeStore {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

/** Has this browser chosen Begin before? `false` when nothing was written, when something else was, and when storage throws. */
export function hasSeenWelcome(getStore: () => WelcomeStore): boolean {
	try {
		return getStore().getItem(WELCOME_SEEN_KEY) === WELCOME_SEEN_VALUE;
	} catch {
		return false;
	}
}

/** Record that Begin was chosen. Returns whether the write took, which the sheet ignores: it closes either way. */
export function markWelcomeSeen(getStore: () => WelcomeStore): boolean {
	try {
		getStore().setItem(WELCOME_SEEN_KEY, WELCOME_SEEN_VALUE);
		return true;
	} catch {
		return false;
	}
}
