import { describe, it, expect } from 'vitest';
import { witnessesModel } from './witnesses';
import type { Divergence, Reconciliation } from './types';

function div(id: string, measure: number): Divergence {
	return { id, class: 'intentional-variance', treatment: 'witnessed', location: { measure } };
}

function trivia(id: string, measure: number): Divergence {
	return { id, class: 'orthographic-trivia', treatment: 'auto-reconciled', location: { measure } };
}

function recon(divergences: Divergence[], analysedVerse = 1, totalVerses = 1): Reconciliation {
	return { divergences, analysedVerse, totalVerses };
}

describe('witnessesModel', () => {
	it('is not-assessed, with no rows and no verse note, before any pass runs', () => {
		const m = witnessesModel(undefined);
		expect(m.summary).toEqual({ kind: 'not-assessed' });
		expect(m.rows).toEqual([]);
		expect(m.verseNote).toBeNull();
	});

	it('agrees, with no rows and no verse note, for a single-verse empty pass', () => {
		const m = witnessesModel(recon([]));
		expect(m.summary).toEqual({ kind: 'agree' });
		expect(m.rows).toEqual([]);
		expect(m.verseNote).toBeNull();
	});

	it('orders rows by measure, then by id', () => {
		const m = witnessesModel(recon([div('b', 5), div('a', 5), div('c', 2)]));
		expect(m.rows.map((r) => r.id)).toEqual(['c', 'a', 'b']);
		expect(m.summary).toEqual({ kind: 'diverge', count: 3 });
	});

	it('excludes auto-reconciled trivia from the rows and the count', () => {
		const m = witnessesModel(recon([div('a', 5), trivia('t', 1), div('b', 2)]));
		expect(m.rows.map((r) => r.id)).toEqual(['b', 'a']);
		expect(m.summary).toEqual({ kind: 'diverge', count: 2 });
	});

	it('carries a verse note only when more than one verse is banked (Kimi Q5)', () => {
		expect(witnessesModel(recon([], 1, 1)).verseNote).toBeNull();
		expect(witnessesModel(recon([], 1, 3)).verseNote).toEqual({ analysed: 1, total: 3 });
	});
});
