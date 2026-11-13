/**
 * The development switch for N.199's new Calibrate screen: the address carries `?calibrate=new`. Off by default, read
 * the way `omr/underlay-switch.ts` reads its own measure switches (`new URLSearchParams(search).get(...)`, the search
 * string a parameter so a test can pass one). Everything N.199 builds before Step 8 is seen only with it on; without
 * it the app behaves exactly as it did. Step 8a removes this file with the switch.
 */
const here = (): string => (typeof location === 'undefined' ? '' : location.search);

/** The query that turns the new screen on: `?calibrate=new`. */
export const CALIBRATE_QUERY = 'calibrate';

export function calibrateNewOn(search: string = here()): boolean {
	return new URLSearchParams(search).get(CALIBRATE_QUERY) === 'new';
}
