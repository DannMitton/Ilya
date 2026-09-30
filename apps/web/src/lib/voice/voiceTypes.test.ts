/**
 * Voice type slice A (2026-09-30): the data module, the routing it feeds, the
 * print rule, and a voice saved before the slice still loading.
 *
 * `apps/web` has no DOM under vitest, so `window.localStorage` is a Map
 * stubbed onto the global, as `range-offer-decline.test.ts` stands one in.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bucketFor } from './engine/plausibility';
import { OTHER, TIER1, TIER2, voiceTypePrint, withTier1 } from './voiceTypes';
import { assignToVoice, loadStore, type StoredVoice } from './profileStore';
import { t } from '$lib/i18n';

describe('voice type slice A: the tiers', () => {
	it('has nine Tier 1 ids and 29 Tier 2 ids, each with one parent', () => {
		expect(TIER1).toHaveLength(9);
		const all = Object.values(TIER2).flat();
		expect(all).toHaveLength(29);
		expect(TIER2['not-sure']).toEqual([]);
	});

	it('has a string in both languages for every id', () => {
		for (const lang of ['en', 'fr'] as const) {
			for (const id of TIER1) expect(t(`voiceType.type.${id}`, lang)).not.toMatch(/MISSING/);
			for (const id of Object.values(TIER2).flat())
				expect(t(`voiceType.specific.${id}`, lang)).not.toMatch(/MISSING/);
		}
	});
});

describe('voice type slice A: bucketFor routes every Tier 1 id', () => {
	it.each([
		['soprano', 'soprano'],
		['mezzo-soprano', 'tenor-mezzo'],
		['contralto', 'tenor-mezzo'],
		['tenor', 'tenor-mezzo'],
		['baritone', 'baritone'],
		['bass-baritone', 'bass'],
		['bass', 'bass'],
		['countertenor', 'union'],
		['not-sure', 'union']
	])('%s routes to %s', (id, bucket) => {
		expect(bucketFor(id)).toBe(bucket);
	});

	it('still accepts the strings it accepted before', () => {
		expect(bucketFor('mezzo')).toBe('tenor-mezzo');
		expect(bucketFor('mezzo soprano')).toBe('tenor-mezzo');
		expect(bucketFor(undefined)).toBe('union');
	});
});

describe('voice type slice A: changing Tier 1', () => {
	it('clears a Tier 2 label that no longer belongs', () => {
		expect(withTier1({ voiceType: 'bass', voiceTypeSpecific: 'basso-cantante' }, 'tenor')).toEqual({
			voiceType: 'tenor',
			voiceTypeSpecific: undefined,
			voiceTypeOther: undefined
		});
	});

	it('keeps a Tier 2 label that still belongs', () => {
		expect(withTier1({ voiceType: 'bass', voiceTypeSpecific: 'octavist' }, 'bass').voiceTypeSpecific).toBe('octavist');
	});

	it("keeps Other and its text", () => {
		const next = withTier1({ voiceType: 'bass', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian bass' }, 'baritone');
		expect(next).toEqual({ voiceType: 'baritone', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian bass' });
	});
});

describe('voice type slice A: the printed label', () => {
	it('prints Other, then Tier 2, then Tier 1, lower case mid-line', () => {
		expect(voiceTypePrint({ voiceType: 'bass', voiceTypeSpecific: OTHER, voiceTypeOther: ' Russian Bass ' }, 'en')).toBe('Russian Bass');
		expect(voiceTypePrint({ voiceType: 'bass', voiceTypeSpecific: 'basso-cantante' }, 'en')).toBe('basso cantante');
		expect(voiceTypePrint({ voiceType: 'bass', voiceTypeSpecific: 'basso-cantante' }, 'fr')).toBe('basse chantante');
		expect(voiceTypePrint({ voiceType: 'bass-baritone' }, 'en')).toBe('bass-baritone');
		expect(voiceTypePrint({ voiceType: 'bass-baritone' }, 'fr')).toBe('baryton-basse');
	});

	it("keeps the capitals a name carries", () => {
		expect(voiceTypePrint({ voiceType: 'baritone', voiceTypeSpecific: 'baryton-martin' }, 'en')).toBe('Baryton Martin');
		expect(voiceTypePrint({ voiceType: 'baritone', voiceTypeSpecific: 'baryton-martin' }, 'fr')).toBe('baryton Martin');
		expect(voiceTypePrint({ voiceType: 'tenor', voiceTypeSpecific: 'heldentenor' }, 'fr')).toBe('Heldentenor');
		expect(voiceTypePrint({ voiceType: 'baritone', voiceTypeSpecific: 'heldenbariton' }, 'en')).toBe('Heldenbariton');
	});

	it('falls back to Tier 1 when Other has no text', () => {
		expect(voiceTypePrint({ voiceType: 'tenor', voiceTypeSpecific: OTHER }, 'fr')).toBe('ténor');
	});

	it('prints nothing for Not sure, nothing chosen, or an unknown id', () => {
		expect(voiceTypePrint({ voiceType: 'not-sure' }, 'en')).toBeUndefined();
		expect(voiceTypePrint(undefined, 'en')).toBeUndefined();
		expect(voiceTypePrint({}, 'fr')).toBeUndefined();
		expect(voiceTypePrint({ voiceType: 'treble' }, 'en')).toBeUndefined();
	});
});

describe('voice type: Other under Not sure (desk default, 2026-09-30 10:46)', () => {
	it('keeps Other and its text on moving to Not sure, and still routes union', () => {
		const next = withTier1({ voiceType: 'bass', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian bass' }, 'not-sure');
		expect(next).toEqual({ voiceType: 'not-sure', voiceTypeSpecific: OTHER, voiceTypeOther: 'Russian bass' });
		expect(bucketFor(next.voiceType)).toBe('union');
	});

	it('clears a finer label on moving to Not sure', () => {
		expect(withTier1({ voiceType: 'bass', voiceTypeSpecific: 'octavist' }, 'not-sure').voiceTypeSpecific).toBeUndefined();
	});

	it("prints Other's text as typed, and nothing when Other is empty", () => {
		const own = { voiceType: 'not-sure', voiceTypeSpecific: OTHER, voiceTypeOther: ' Russian Bass ' };
		expect(voiceTypePrint(own, 'en')).toBe('Russian Bass');
		expect(voiceTypePrint(own, 'fr')).toBe('Russian Bass');
		expect(voiceTypePrint({ voiceType: 'not-sure', voiceTypeSpecific: OTHER }, 'en')).toBeUndefined();
		expect(voiceTypePrint({ voiceType: 'not-sure', voiceTypeSpecific: OTHER, voiceTypeOther: '   ' }, 'fr')).toBeUndefined();
	});
});

describe('voice type slice A: storage', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('loads a voice saved before this change, with no voice type', () => {
		const map = new Map<string, string>();
		const before: StoredVoice = {
			id: 'v1',
			name: 'Dann',
			createdAt: '2026-09-12T10:00:00.000Z',
			updatedAt: '2026-09-12T10:00:00.000Z',
			formants: {}
		};
		map.set('shane.profiles.v2', JSON.stringify({ version: 2, activeId: 'v1', voices: [before] }));
		vi.stubGlobal('window', {
			localStorage: { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v), removeItem: (k: string) => void map.delete(k) }
		});
		const store = loadStore('Voice 1');
		expect(store.voices).toHaveLength(1);
		expect(store.voices[0]).toEqual(before);
		expect(voiceTypePrint(store.voices[0], 'en')).toBeUndefined();
	});

	it('removes a field given as undefined', () => {
		const v: StoredVoice = { id: 'v', name: 'Dann', createdAt: '', updatedAt: '', formants: {}, voiceType: 'bass', voiceTypeSpecific: 'octavist' };
		assignToVoice(v, { voiceType: 'tenor', voiceTypeSpecific: undefined });
		expect(v.voiceType).toBe('tenor');
		expect('voiceTypeSpecific' in v).toBe(false);
		expect(v.updatedAt).not.toBe('');
	});

	it('keeps an older voice\'s calibration date when a voice type is declared', () => {
		const v: StoredVoice = { id: 'v', name: 'Dann', createdAt: '', updatedAt: '2026-09-12T10:00:00.000Z', formants: {} };
		assignToVoice(v, { voiceType: 'bass' });
		expect(v.calibratedAt).toBe('2026-09-12T10:00:00.000Z');
		expect(v.updatedAt).not.toBe('2026-09-12T10:00:00.000Z');
		assignToVoice(v, { voiceTypeSpecific: 'octavist' });
		expect(v.calibratedAt).toBe('2026-09-12T10:00:00.000Z');
	});
});
