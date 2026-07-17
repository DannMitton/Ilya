import { describe, it, expect } from 'vitest';
import { resolveTempoTerm, TEMPO_TIER_BANDS } from './tempo-terms';

describe('resolveTempoTerm', () => {
	it('classifies Quantz-list terms to the sourced tier', () => {
		expect(resolveTempoTerm('Adagio')).toMatchObject({ tier: 'slow', tierSource: 'quantz' });
		expect(resolveTempoTerm('Andante')).toMatchObject({ tier: 'moderate', tierSource: 'quantz' });
		expect(resolveTempoTerm('Presto')).toMatchObject({ tier: 'fast', tierSource: 'quantz' });
	});

	it('returns the per-term representative bpm, the tier band, and inferred provenance', () => {
		const r = resolveTempoTerm('andante');
		expect(r?.bpm).toBe(72);
		expect(r?.range).toEqual(TEMPO_TIER_BANDS.moderate);
		expect(r?.provenance).toBe('inferred');
	});

	it('marks terms outside the Quantz list as judgement tier', () => {
		expect(resolveTempoTerm('Maestoso')).toMatchObject({ tier: 'moderate', tierSource: 'judgement' });
		expect(resolveTempoTerm('Larghissimo')).toMatchObject({ tier: 'slow', tierSource: 'judgement' });
	});

	it('gives Presto and Allegro different starts within the one fast tier', () => {
		expect(resolveTempoTerm('allegro')?.bpm).toBe(132);
		expect(resolveTempoTerm('presto')?.bpm).toBe(184);
		expect(resolveTempoTerm('allegro')?.tier).toBe('fast');
		expect(resolveTempoTerm('presto')?.tier).toBe('fast');
	});

	it('resolves multilingual aliases', () => {
		expect(resolveTempoTerm('Langsam')?.tier).toBe('slow');
		expect(resolveTempoTerm('Schnell')?.tier).toBe('fast');
		expect(resolveTempoTerm('très vite')?.tier).toBe('fast');
		expect(resolveTempoTerm('modéré')?.tier).toBe('moderate');
	});

	it('prefers a full compound term over its head token', () => {
		expect(resolveTempoTerm('Allegro moderato')?.bpm).toBe(116); // not 132
	});

	it('falls back to the head term for modified markings', () => {
		expect(resolveTempoTerm('Allegro con brio')).toMatchObject({ term: 'allegro', tier: 'fast' });
		expect(resolveTempoTerm('poco adagio')).toMatchObject({ term: 'adagio', tier: 'slow' });
	});

	it('tolerates one or two OCR errors via fuzzy match', () => {
		expect(resolveTempoTerm('allgro')?.term).toBe('allegro'); // distance 1
		expect(resolveTempoTerm('andnate')?.term).toBe('andante'); // distance 2
	});

	it('returns null on unrecognized or garbled input, never a guess', () => {
		expect(resolveTempoTerm('xqzzy')).toBeNull();
		expect(resolveTempoTerm('72')).toBeNull();
		expect(resolveTempoTerm('')).toBeNull();
	});

	it('normalizes case, whitespace, and trailing punctuation', () => {
		expect(resolveTempoTerm('  ADAGIO. ')?.term).toBe('adagio');
	});

	it('strips diacritics to match an accented spelling', () => {
		expect(resolveTempoTerm('àdagio')?.term).toBe('adagio');
	});
});
