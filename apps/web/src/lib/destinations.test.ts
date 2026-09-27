/**
 * The document ids, N.174 slice D.1 (2026-09-27). `transcription` became
 * `text` and `shane` became `markup`; `restoreSurface` still reads the old
 * two, so a singer's stored destination survives the rename. This runs with
 * the repository's `.env`, which opens the Markup and Insights gate.
 */
import { describe, it, expect } from 'vitest';
import {
	DEFAULT_SURFACE,
	restoreSurface,
	surfaceFor,
	tabIdFor,
	type TabId,
} from './destinations';

describe('restoreSurface migrates the ids written before N.174', () => {
	it('reads transcription as text', () => {
		expect(restoreSurface('transcription')).toEqual(restoreSurface('text'));
	});

	it('reads shane as markup', () => {
		expect(restoreSurface('shane')).toEqual(restoreSurface('markup'));
	});
});

describe('each new id round-trips', () => {
	const ids: TabId[] = ['text', 'markup'];
	for (const id of ids) {
		it(id, () => {
			expect(tabIdFor(surfaceFor(id))).toBe(id);
		});
	}
});

describe('nothing readable gives the default', () => {
	it('null', () => {
		expect(restoreSurface(null)).toEqual(DEFAULT_SURFACE);
	});

	it('an unknown string', () => {
		expect(restoreSurface('fit')).toEqual(DEFAULT_SURFACE);
	});
});
