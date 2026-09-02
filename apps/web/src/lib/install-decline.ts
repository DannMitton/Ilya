/**
 * How long a declined install prompt stays declined (N.105, numbered by Dann
 * 2026-09-01, `docs/memory/INBOX.md:56`).
 *
 * WHAT THIS REPLACES. `InstallPrompt.svelte` used to guard its only write
 * behind `if (isIos)`, and that write went to `sessionStorage`, which dies
 * with the tab. So "Not now" lasted one page view on iOS and none at all
 * anywhere else, and every load of the stable URL asked again. Dann was asked
 * ten times in one hour on the 2026-09-01 walk of `510a280`.
 *
 * PLAIN TYPESCRIPT RATHER THAN A RUNE, for the reason the reading aid's
 * arithmetic is: runes are inert under vitest, so a rule written inside a
 * component is a rule no gate can reach. `apps/web` has no DOM environment
 * under vitest, so nothing here touches `localStorage`; the component reads
 * and writes, and this file only rules on what it read.
 */

/**
 * The stored key. `ilya:` prefixed, following the tree's own convention for
 * a saved preference (`+page.svelte:1751` activeTab, `:1766` notationPrefs,
 * `:2600` language).
 */
export const DECLINE_KEY = 'ilya:installDeclinedAt';

/**
 * The `sessionStorage` key the iOS path used before this item. Dead, and
 * removed on first run so no device carries it forward.
 */
export const DEAD_IOS_KEY = 'ilya-ios-hint-shown';

/**
 * DESK DEFAULT, 2026-09-02, Dann's to wave off: a decline lasts thirty days.
 * After that Ilya may ask once more, and a second "Not now" starts a new
 * thirty.
 */
export const DECLINE_DAYS = 30;

const DECLINE_MS = DECLINE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Is a stored decline still in force?
 *
 * `stored` is whatever came out of storage, so it is `null` when nothing was
 * written and an arbitrary string when something else wrote there. Anything
 * that does not parse as a date is not a decline, and the banner may rise.
 *
 * The boundary is exclusive: at exactly `DECLINE_DAYS` the decline has run
 * out. That is the only reading under which "a decline lasts thirty days"
 * means thirty and not thirty-plus-a-tick.
 *
 * A timestamp in the future reads as fresh. It can only ever hold the banner
 * down, never raise one early, and a device with a fast clock is not a reason
 * to start asking again.
 */
export function declineIsFresh(stored: string | null, now: Date): boolean {
	if (stored === null) return false;

	const declinedAt = new Date(stored).getTime();
	if (Number.isNaN(declinedAt)) return false;

	return now.getTime() - declinedAt < DECLINE_MS;
}
