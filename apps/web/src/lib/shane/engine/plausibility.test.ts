/**
 * Plausibility-guard test deliverables (engine-spec amendment §7, LOCKED
 * 2026-07-11). Windows source: bozeman-kvp2-fr1-transcription_2026-07-11.md.
 */
import { describe, it, expect } from 'vitest';
import {
	checkPlausibility,
	buildPlausibilityEvent,
	bucketFor,
	BAND_SOURCES,
	FLOOR_MARGIN_SEMITONES,
	CEILING_MARGIN_SEMITONES
} from './plausibility';

const FLOOR = Math.pow(2, FLOOR_MARGIN_SEMITONES / 12);
const CEILING = Math.pow(2, CEILING_MARGIN_SEMITONES / 12);

describe('bucketFor', () => {
	it('routes declared types and defaults to union', () => {
		expect(bucketFor('Soprano')).toBe('soprano');
		expect(bucketFor('mezzo-soprano')).toBe('tenor-mezzo');
		expect(bucketFor('tenor')).toBe('tenor-mezzo');
		expect(bucketFor('BARITONE')).toBe('baritone');
		expect(bucketFor('bass')).toBe('bass');
		expect(bucketFor(undefined)).toBe('union');
		expect(bucketFor('countertenor')).toBe('union'); // unknown: never a guess
	});
});

describe('guard windows: band centres, edges, margins, outliers', () => {
	it('accepts band centres per voice type', () => {
		// Soprano [i] core E4–A4 = 329.63–440.
		expect(checkPlausibility(380, 'i', 'soprano').plausibility).toBe('plausible');
		// Bass [i] core D4–E4 = 293.66–329.63.
		expect(checkPlausibility(310, 'i', 'bass').plausibility).toBe('plausible');
		// Baritone [ɑ] core C5–F5.
		expect(checkPlausibility(600, 'ɑ', 'baritone').plausibility).toBe('plausible');
	});

	it('accepts exact core edges (they sit inside the margin)', () => {
		expect(checkPlausibility(329.63, 'i', 'soprano').plausibility).toBe('plausible');
		expect(checkPlausibility(440.0, 'i', 'soprano').plausibility).toBe('plausible');
	});

	it('accepts within the asymmetric margins and rejects just beyond them', () => {
		const hi = 440.0; // soprano [i] ceiling: +2 st
		expect(checkPlausibility(hi * CEILING * 0.999, 'i', 'soprano').plausibility).toBe('plausible');
		expect(checkPlausibility(hi * CEILING * 1.01, 'i', 'soprano').plausibility).toBe('implausible');
		const lo = 329.63; // soprano [i] floor: −3 st (darker-voices room, 2026-07-11)
		expect(checkPlausibility((lo / FLOOR) * 1.001, 'i', 'soprano').plausibility).toBe('plausible');
		expect(checkPlausibility((lo / FLOOR) * 0.99, 'i', 'soprano').plausibility).toBe('implausible');
	});

	it('union bands span the widest per-type extremes, margin applied after union', () => {
		// Union [i] core = 293.66–440 (bass floor to soprano ceiling);
		// guarded floor = 293.66 / 2^(3/12) ≈ 246.9.
		const r = checkPlausibility(300, 'i');
		expect(r.voiceTypeBucket).toBe('union');
		expect(r.plausibility).toBe('plausible');
		expect(checkPlausibility(248, 'i').plausibility).toBe('plausible');
		expect(checkPlausibility(244, 'i').plausibility).toBe('implausible');
	});

	it('field evidence 2026-07-11: a dark bass [u] at 255 Hz is plausible (floor 3 st)', () => {
		// Dann's own Captured [u], 0.44 st below the old ±2 st floor — the
		// false-alarm case the asymmetric floor exists to prevent.
		expect(checkPlausibility(255, 'u', 'bass').plausibility).toBe('plausible');
		expect(checkPlausibility(255, 'u').plausibility).toBe('plausible');
	});
});

describe('the motivating case: 1063 Hz [i]', () => {
	it('is implausible for every voice type and the union', () => {
		for (const t of ['soprano', 'mezzo', 'tenor', 'baritone', 'bass', undefined]) {
			const r = checkPlausibility(1063, 'i', t);
			expect(r.plausibility).toBe('implausible');
			expect(r.distanceToEdgeSemitones!).toBeGreaterThan(0);
		}
	});
});

describe('anchor-derived windows ([ɨ] [ɪ] [a] [ʌ])', () => {
	const anchors = { i: 296, e: 381, ɑ: 617, u: 305 };
	it('derives centres from the singer’s own anchors (±2 st around centre)', () => {
		// [ɨ] centre = 1.365 × 296 = 404.04.
		const inside = checkPlausibility(404, 'ɨ', undefined, anchors);
		expect(inside.plausibility).toBe('plausible');
		expect(inside.anchorSource).toBe('anchors-derived');
		expect(checkPlausibility(404 * CEILING * 1.02, 'ɨ', undefined, anchors).plausibility).toBe(
			'implausible'
		);
		// [ɪ] centre = e.f1; [ʌ] centre = ɑ.f1; [a] centre = 1.15 × ɑ.f1.
		expect(checkPlausibility(381, 'ɪ', undefined, anchors).plausibility).toBe('plausible');
		expect(checkPlausibility(617, 'ʌ', undefined, anchors).plausibility).toBe('plausible');
		expect(checkPlausibility(709.6, 'a', undefined, anchors).plausibility).toBe('plausible');
	});

	it('reports unchecked when the required anchors are missing (valid outcome, not an error)', () => {
		const r = checkPlausibility(404, 'ɨ', undefined, {});
		expect(r.plausibility).toBe('unchecked');
		expect(r.anchorSource).toBeNull();
		expect(r.windowLow).toBeUndefined();
		expect(checkPlausibility(400, 'ɪ', undefined, { i: 296 }).plausibility).toBe('unchecked');
	});
});

describe('distance-to-edge (logged for every extraction, ruled)', () => {
	it('is negative inside the window and positive outside', () => {
		expect(checkPlausibility(380, 'i', 'soprano').distanceToEdgeSemitones!).toBeLessThan(0);
		expect(checkPlausibility(1063, 'i', 'soprano').distanceToEdgeSemitones!).toBeGreaterThan(0);
	});
	it('measures ~semitones past the edge for the motivating case', () => {
		// Union guarded ceiling for [i] = 440 × 2^(2/12) ≈ 493.9;
		// 12·log2(1063/493.9) ≈ 13.3 st.
		const r = checkPlausibility(1063, 'i');
		expect(r.distanceToEdgeSemitones!).toBeGreaterThan(13);
		expect(r.distanceToEdgeSemitones!).toBeLessThan(14);
	});
});

describe('no-block invariant and event schema', () => {
	it('the check is pure: it returns a verdict, never throws, never alters inputs', () => {
		const r = checkPlausibility(1063, 'i', 'soprano');
		expect(r.plausibility).toBe('implausible');
		// The guard has no opinion on confidence or reading; those belong to
		// the wizard boundary (orthogonality ruling).
		expect('confidence' in r).toBe(false);
		expect('reading' in r).toBe(false);
	});
	it('builds the ruled console event with every field', () => {
		const res = checkPlausibility(1063, 'i', 'soprano');
		const ev = buildPlausibilityEvent('i', 1063, res, true, 'test-session', 'soprano');
		expect(ev).toMatchObject({
			vowel: 'i',
			declaredVoiceType: 'soprano',
			extractedFR1: 1063,
			plausibility: 'implausible',
			rePromptShown: true,
			anchorSource: 'bozeman',
			sessionId: 'test-session'
		});
		expect(typeof ev.windowLow).toBe('number');
		expect(typeof ev.windowHigh).toBe('number');
		expect(typeof ev.distanceToEdgeSemitones).toBe('number');
	});
});

describe('citation integrity', () => {
	it('every band table carries a non-empty source attribution', () => {
		for (const src of Object.values(BAND_SOURCES)) {
			expect(src).toMatch(/Bozeman/);
			expect(src.length).toBeGreaterThan(20);
		}
	});
});
