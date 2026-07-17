import { describe, it, expect } from 'vitest';
import { summarise, treatmentFor } from './taxonomy';
import type { DisparityClass, Divergence, Reconciliation } from './types';

function div(cls: DisparityClass, id: string): Divergence {
	return { id, class: cls, treatment: treatmentFor(cls), location: { measure: 1 } };
}

function recon(divergences: Divergence[]): Reconciliation {
	return { divergences, analysedVerse: 1, totalVerses: 1 };
}

describe('treatmentFor', () => {
	it('routes each class to its fixed treatment', () => {
		expect(treatmentFor('orthographic-trivia')).toBe('auto-reconciled');
		expect(treatmentFor('probable-error')).toBe('flagged');
		expect(treatmentFor('intentional-variance')).toBe('witnessed');
	});

	it('routes every class to a valid treatment (exhaustive)', () => {
		const classes: DisparityClass[] = [
			'orthographic-trivia',
			'probable-error',
			'intentional-variance'
		];
		for (const c of classes) {
			expect(['auto-reconciled', 'flagged', 'witnessed']).toContain(treatmentFor(c));
		}
	});
});

describe('summarise', () => {
	it('undefined is not-assessed, and never collapses to agree (§A.56)', () => {
		expect(summarise(undefined)).toEqual({ kind: 'not-assessed' });
	});

	it('an empty pass is agree, distinct from not-assessed', () => {
		expect(summarise(recon([]))).toEqual({ kind: 'agree' });
	});

	it('one divergence is diverge with count 1', () => {
		expect(summarise(recon([div('probable-error', 'd1')]))).toEqual({
			kind: 'diverge',
			count: 1
		});
	});

	it('counts only surfaced divergences, excluding auto-reconciled trivia', () => {
		const ds = [
			div('orthographic-trivia', 'a'),
			div('probable-error', 'b'),
			div('intentional-variance', 'c')
		];
		expect(summarise(recon(ds))).toEqual({ kind: 'diverge', count: 2 });
	});

	it('is agree when every divergence is auto-reconciled trivia (the ё convention)', () => {
		const ds = [div('orthographic-trivia', 'a'), div('orthographic-trivia', 'b')];
		expect(summarise(recon(ds))).toEqual({ kind: 'agree' });
	});
});
