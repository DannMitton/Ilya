/**
 * Tests for how long a declined install prompt stays declined (N.105).
 *
 * WHY THESE EXIST AS A GATE RATHER THAN AS A WALK. The walk can show that one
 * "Not now" survives one reload. It cannot show the thirty-day edge without
 * moving a clock, and the failure this item fixes was silent: the banner
 * simply came back, and nothing on screen said a decline had been dropped. A
 * freshness rule that quietly stopped expiring, or quietly stopped holding,
 * would look identical on any single walk.
 *
 * NO DOM HERE. `apps/web` runs vitest with no DOM environment, so these pass
 * a string and a `Date` and read a boolean. Storage is the component's.
 */

import { describe, expect, it } from 'vitest';
import { DECLINE_DAYS, declineIsFresh } from './install-decline';

/** A date `days` before `NOW`, as the ISO string the component writes. */
const NOW = new Date('2026-09-02T12:00:00.000Z');
function daysAgo(days: number): string {
	return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe('declineIsFresh', () => {
	it('treats nothing stored as no decline', () => {
		expect(declineIsFresh(null, NOW)).toBe(false);
	});

	it('holds a decline made 29 days ago', () => {
		expect(declineIsFresh(daysAgo(29), NOW)).toBe(true);
	});

	it('lets go of a decline made 31 days ago', () => {
		expect(declineIsFresh(daysAgo(31), NOW)).toBe(false);
	});

	it('lets go at exactly the boundary, so thirty days means thirty', () => {
		expect(declineIsFresh(daysAgo(DECLINE_DAYS), NOW)).toBe(false);
		expect(declineIsFresh(daysAgo(DECLINE_DAYS - 0.001), NOW)).toBe(true);
	});

	it('treats an unparseable value as no decline', () => {
		expect(declineIsFresh('not a date', NOW)).toBe(false);
		expect(declineIsFresh('', NOW)).toBe(false);
	});

	it('holds a timestamp in the future, which can only keep the banner down', () => {
		expect(declineIsFresh(daysAgo(-1), NOW)).toBe(true);
	});
});
