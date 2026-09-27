/**
 * N.164: "No thanks" on Insights' range offer, remembered.
 *
 * RULED BY DANN 2026-09-25 (`docs/memory/OPEN.md` §N.164): the decline hides
 * the offer on every song. DESK DEFAULT, 13:21: it survives a reload, because
 * a line that returns on every reload is the harassment he ruled out. One
 * `localStorage` key, following the install prompt's decline
 * (`InstallPrompt.svelte`, `mayAsk` and `recordDecline`).
 *
 * UNLIKE THE INSTALL PROMPT'S, IT DOES NOT EXPIRE. His words: "those who click
 * no thanks will not be harassed by it." Typing a range makes the offer moot.
 *
 * The store is passed in rather than read from `window`, because `apps/web`
 * has no DOM under vitest (`install-decline.ts` gives the same reason). Every
 * call is wrapped: a private-mode Safari throws on write, and on a throw the
 * offer behaves as though nothing was stored.
 */

/** `ilya:` prefixed, following the tree's convention for a saved preference. */
export const RANGE_OFFER_DECLINE_KEY = 'ilya:rangeOfferDeclined';

/** The part of `Storage` this file uses. */
export interface KeyStore {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

/** The browser's `localStorage`, or null where reaching it throws. */
export function browserStore(): KeyStore | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

/** Has this device declined the range offer? */
export function rangeOfferDeclined(store: KeyStore | null): boolean {
	if (!store) return false;
	try {
		return store.getItem(RANGE_OFFER_DECLINE_KEY) !== null;
	} catch {
		return false;
	}
}

/** Record the decline. The value is the moment, for a reader; only presence counts. */
export function recordRangeOfferDecline(store: KeyStore | null, now: Date = new Date()): void {
	if (!store) return;
	try {
		store.setItem(RANGE_OFFER_DECLINE_KEY, now.toISOString());
	} catch {
		// localStorage unavailable (private browsing)
	}
}
