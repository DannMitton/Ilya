/**
 * N.164: "No thanks" on Insights' range offer is remembered across reloads.
 *
 * `apps/web` has no DOM under vitest, so the store is a Map standing in for
 * `localStorage`, and "a remount" is a second, fresh read of the same store:
 * that read is all `InsightsPane.svelte` does when it mounts.
 */

import { describe, expect, it } from 'vitest';
import {
	RANGE_OFFER_DECLINE_KEY,
	rangeOfferDeclined,
	recordRangeOfferDecline,
	type KeyStore,
} from './range-offer-decline';
import { verdictLine } from './insights';

function mapStore(): KeyStore & { map: Map<string, string> } {
	const map = new Map<string, string>();
	return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) };
}

const throwing: KeyStore = {
	getItem: () => {
		throw new Error('SecurityError');
	},
	setItem: () => {
		throw new Error('QuotaExceededError');
	},
};

const cannotSay = { verdict: 'cannot-say' as const, range: { measured: null, reference: null, flag: null } };

describe('N.164 the range offer decline', () => {
	it('offers the range on a device that never declined', () => {
		const store = mapStore();
		expect(rangeOfferDeclined(store)).toBe(false);
		expect(verdictLine(cannotSay, rangeOfferDeclined(store))).toEqual({ kind: 'offer' });
	});

	it('hides the offer once declined, and a fresh read still finds the decline', () => {
		const store = mapStore();
		recordRangeOfferDecline(store, new Date('2026-09-25T13:25:00Z'));
		expect(store.map.get(RANGE_OFFER_DECLINE_KEY)).toBe('2026-09-25T13:25:00.000Z');
		// The remount: nothing carried over but the store.
		const declinedOnRemount = rangeOfferDeclined(store);
		expect(declinedOnRemount).toBe(true);
		expect(verdictLine(cannotSay, declinedOnRemount)).toEqual({ kind: 'nothing' });
	});

	it('uses one key, in the tree\'s `ilya:` convention', () => {
		expect(RANGE_OFFER_DECLINE_KEY).toBe('ilya:rangeOfferDeclined');
	});

	it('behaves as though nothing is stored when storage throws or is missing', () => {
		expect(() => recordRangeOfferDecline(throwing)).not.toThrow();
		expect(rangeOfferDeclined(throwing)).toBe(false);
		expect(() => recordRangeOfferDecline(null)).not.toThrow();
		expect(rangeOfferDeclined(null)).toBe(false);
	});
});
