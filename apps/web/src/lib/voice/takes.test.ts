import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CalibratedFormant } from './engine/types';
import { MAX_TAKES_PER_VOWEL, addTake, appendTake, failedTake, readingTake, type TakeRecord } from './takes';
import { saveStore, type ProfileStore, type StoredVoice } from './profileStore';
import { profileSave } from './profile-save.svelte';

const NOW = new Date('2026-11-13T12:00:00Z');
const f = (extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1: 296, f2: 1705, confidence: 'high', f2Quality: 'clear', reading: 'captured', source: 'measured-user', plausibility: 'plausible', ...extra }) as CalibratedFormant;
const ctx = { vowel: 'i' as const, voiceType: 'bass', visible: 'zone' as const, now: NOW };

describe('a take that ended with a reading', () => {
	it('keeps the engine’s raw reading with confidence and f2Quality, the type, and what was visible, and nothing the guard added', () => {
		expect(readingTake(ctx, f())).toEqual({
			at: '2026-11-13T12:00:00.000Z', vowel: 'i', outcome: 'captured',
			raw: { f1: 296, f2: 1705, confidence: 'high', f2Quality: 'clear' }, voiceType: 'bass', visible: 'zone'
		});
		expect(JSON.stringify(readingTake(ctx, f()))).not.toContain('plausib');
	});
	it('is provisional by the engine’s own reading, rolled back when asked, and omits an absent f2', () => {
		expect(readingTake(ctx, f({ reading: 'provisional', confidence: 'low' })).outcome).toBe('provisional');
		expect(readingTake(ctx, f({ reading: 'provisional' }), true).outcome).toBe('rolled-back');
		const none = readingTake({ ...ctx, voiceType: undefined, visible: 'hidden' }, f({ f2: undefined, f2Quality: 'absent' }));
		expect(none.raw).toEqual({ f1: 296, confidence: 'high', f2Quality: 'absent' });
		expect(none.voiceType).toBeNull();
		expect(none.visible).toBe('hidden');
	});
});

describe('a take that ended without one', () => {
	it('carries no numbers; a cancel has no code, a failure has the session’s', () => {
		expect(failedTake(ctx, { code: 'CANCELLED', message: 'x' })).toEqual({ at: '2026-11-13T12:00:00.000Z', vowel: 'i', outcome: 'cancelled', voiceType: 'bass', visible: 'zone' });
		const bad = failedTake(ctx, { code: 'NO_AUDIO_INPUT', message: 'x' });
		expect(bad).toMatchObject({ outcome: 'failed', errorCode: 'NO_AUDIO_INPUT' });
		expect(bad.raw).toBeUndefined();
	});
});

describe('fifty a vowel, oldest dropped', () => {
	const take = (vowel: 'i' | 'e', n: number): TakeRecord => ({ ...readingTake({ ...ctx, vowel, now: new Date(2026, 10, 13, 12, 0, n) }, f()) });
	it('keeps the newest fifty of a vowel and leaves another vowel alone', () => {
		let takes: TakeRecord[] = [take('e', 0)];
		for (let n = 1; n <= 60; n++) takes = appendTake(takes, take('i', n));
		const is = takes.filter((t) => t.vowel === 'i');
		expect(MAX_TAKES_PER_VOWEL).toBe(50);
		expect(is).toHaveLength(50);
		expect(is[0].at).toBe(take('i', 11).at);
		expect(is[49].at).toBe(take('i', 60).at);
		expect(takes.filter((t) => t.vowel === 'e')).toHaveLength(1);
	});
	it('does not mutate what it is given, and addTake writes in place', () => {
		const before: TakeRecord[] = [take('i', 1)];
		appendTake(before, take('i', 2));
		expect(before).toHaveLength(1);
		const voice: { takes?: TakeRecord[] } = {};
		addTake(voice, take('i', 1));
		addTake(voice, take('i', 2));
		expect(voice.takes).toHaveLength(2);
	});
});

describe('a full store drops the record before it refuses the profile', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		profileSave.failure = null;
	});
	const voice = (takes?: TakeRecord[]): StoredVoice => ({ id: 'v', name: 'Dann', createdAt: 'a', updatedAt: 'a', formants: { i: f() }, ...(takes ? { takes } : {}) });
	it('writes again without the takes after a quota failure, and the profile lands', () => {
		const writes: string[] = [];
		vi.stubGlobal('window', {
			localStorage: {
				getItem: () => null,
				removeItem: () => {},
				setItem: (_k: string, v: string) => {
					if (v.includes('"takes"')) throw new DOMException('full', 'QuotaExceededError');
					writes.push(v);
				}
			}
		});
		const store: ProfileStore = { version: 2, activeId: 'v', voices: [voice([readingTake(ctx, f())])] };
		expect(saveStore(store)).toEqual({ ok: true });
		expect(writes).toHaveLength(1);
		expect(writes[0]).toContain('"formants"');
		expect(store.voices[0].takes).toBeUndefined();
		expect(profileSave.failure).toBeNull();
	});
	it('still refuses the profile when it is the profile that does not fit', () => {
		vi.stubGlobal('window', { localStorage: { getItem: () => null, removeItem: () => {}, setItem: () => { throw new DOMException('full', 'QuotaExceededError'); } } });
		const store: ProfileStore = { version: 2, activeId: 'v', voices: [voice([readingTake(ctx, f())])] };
		expect(saveStore(store)).toEqual({ ok: false, reason: 'quota-exceeded' });
		expect(profileSave.failure).toBe('quota-exceeded');
	});
	it('does not touch the store when there is no record, or when the failure is not a full store', () => {
		vi.stubGlobal('window', { localStorage: { getItem: () => null, removeItem: () => {}, setItem: () => { throw new DOMException('no', 'QuotaExceededError'); } } });
		const store: ProfileStore = { version: 2, activeId: 'v', voices: [voice()] };
		expect(saveStore(store).ok).toBe(false);
		let calls = 0;
		vi.stubGlobal('window', { localStorage: { getItem: () => null, removeItem: () => {}, setItem: () => { calls++; throw new Error('other'); } } });
		const keep: ProfileStore = { version: 2, activeId: 'v', voices: [voice([readingTake(ctx, f())])] };
		expect(saveStore(keep)).toEqual({ ok: false, reason: 'write-failed' });
		expect(calls).toBe(1);
		expect(keep.voices[0].takes).toHaveLength(1);
	});
});
