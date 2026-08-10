/**
 * Homograph tier installation tests (N.14).
 *
 * The shards hold exactly one entry per headword, so a spelling with two
 * stress positions can only ship one of them. data/homographs.json supplies
 * the rest, and installHomographEntries puts them into the live dictionary
 * that @ilya/phonology and @ilya/dictionary both hold by reference.
 *
 * What is pinned down here is the plumbing that could silently lie rather
 * than throw:
 *
 *  - the raw payload needs mapSingleEntry's composed `g`, or lookupStress
 *    reads an undefined gloss and every printed gloss for these 6,763 words
 *    goes blank;
 *  - element 0 must remain the entry the shards shipped, because
 *    lookupStress returns entry[0] and nothing a singer has transcribed may
 *    move;
 *  - mergeGlossTier must write E/F onto element 0 rather than onto the array
 *    object, where nothing reads it and the full gloss vanishes with no
 *    error;
 *  - the two tiers land on an idle callback each and may arrive in either
 *    order.
 *
 * The fixtures use горе, whose four readings are the case that prompted the
 * item. Glosses are copied from the payload the build produces.
 */

import { describe, it, expect } from 'vitest';
import { installHomographEntries, mergeGlossTier } from './loader';

/** As the shards ship it: the locative of гора, one entry, mapped on parse. */
function shippedGore() {
	return { s: 1, e: 'mountain', f: 'peine, chagrin', p: 'noun', l: 'гора', g: { en: 'mountain', fr: 'peine, chagrin' } };
}

/** As data/homographs.json holds it: raw, unmapped, shipped entry first. */
function payloadGore() {
	return {
		горе: [
			{ s: 1, e: 'mountain', f: 'peine, chagrin', p: 'noun', l: 'гора' },
			{ s: 1, e: 'up', p: 'adv', l: 'горе' },
			{ s: 0, e: 'grief, distress, sadness', p: 'noun', l: 'горе' },
		],
	};
}

describe('installHomographEntries (N.14)', () => {
	it('replaces the scalar entry with the array', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		const installed = installHomographEntries(dict, payloadGore());
		expect(installed).toBe(1);
		expect(Array.isArray(dict.горе)).toBe(true);
		expect(dict.горе).toHaveLength(3);
	});

	it('leaves element 0 as the reading the shards shipped', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		installHomographEntries(dict, payloadGore());
		// lookupStress returns entry[0]. If this moves, every existing score moves.
		expect(dict.горе[0].s).toBe(1);
		expect(dict.горе[0].l).toBe('гора');
	});

	it('composes g on every entry, not only the first', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		installHomographEntries(dict, payloadGore());
		// normalizeEntry reads `gloss ?? g`. Without this the page goes blank.
		expect(dict.горе[0].g).toEqual({ en: 'mountain', fr: 'peine, chagrin' });
		expect(dict.горе[1].g).toEqual({ en: 'up', fr: '' });
		expect(dict.горе[2].g).toEqual({ en: 'grief, distress, sadness', fr: '' });
	});

	it('skips a word the shards never shipped', () => {
		const dict: Record<string, any> = {};
		expect(installHomographEntries(dict, payloadGore())).toBe(0);
		expect(dict.горе).toBeUndefined();
	});

	it('is a no-op on a second run', () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		expect(installHomographEntries(dict, payloadGore())).toBe(1);
		expect(installHomographEntries(dict, payloadGore())).toBe(0);
		expect(dict.горе).toHaveLength(3);
	});

	it('ignores a payload value that is not a real alternative', () => {
		const dict: Record<string, any> = { горе: shippedGore(), мука: { s: 1, e: 'flour', p: 'noun', l: 'мука' } };
		installHomographEntries(dict, { горе: [{ s: 1, e: 'mountain', p: 'noun', l: 'гора' }], мука: [] } as any);
		expect(Array.isArray(dict.горе)).toBe(false);
		expect(Array.isArray(dict.мука)).toBe(false);
	});
});

describe('mergeGlossTier across an array-valued entry (N.14)', () => {
	const line = (word: string, E: string) => JSON.stringify([word, { E }]);

	it('writes the full gloss onto element 0, not onto the array', async () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		installHomographEntries(dict, payloadGore());
		await mergeGlossTier([line('горе', 'grief; the mountain word')], dict);
		expect(dict.горе[0].E).toBe('grief; the mountain word');
		// The control that makes this test able to fail: before N.14 the property
		// landed here, where resolveFullGloss never looks.
		expect((dict.горе as any).E).toBeUndefined();
	});

	it('still writes onto a scalar entry', async () => {
		const dict: Record<string, any> = { гора: { s: 1, e: 'mountain', p: 'noun', l: 'гора' } };
		await mergeGlossTier([line('гора', 'a mountain')], dict);
		expect(dict.гора.E).toBe('a mountain');
	});

	it('survives the gloss tier arriving first', async () => {
		const dict: Record<string, any> = { горе: shippedGore() };
		await mergeGlossTier([line('горе', 'arrived first')], dict);
		installHomographEntries(dict, payloadGore());
		expect(dict.горе[0].E).toBe('arrived first');
	});
});
