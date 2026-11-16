/**
 * The capture screen opens at the top (N.203 lane 59 follow-up, fixes 5; the browser run found a takeover that kept the summary's scroll). Every scrollable
 * ancestor is reset, not the first one found: a sheet inside a page can both be scrolled. An element is scrollable when its overflow-y is `auto` or `scroll`
 * (`overflowOf` reads it, so a test can pass plain objects).
 */
export interface Scrollable {
	parentElement: Scrollable | null;
	scrollTop: number;
}

export function resetScrollAncestors(start: Scrollable | null, overflowOf: (el: Scrollable) => string = (el) => getComputedStyle(el as unknown as Element).overflowY): void {
	for (let el = start; el; el = el.parentElement) {
		if (['auto', 'scroll'].includes(overflowOf(el)) && el.scrollTop > 0) el.scrollTop = 0;
	}
}
