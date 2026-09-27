/**
 * The Guide anchors renamed by N.174 D.3 (2026-09-27): a link saved with an
 * old anchor lands on the renamed section, and every other id passes through.
 */
import { describe, it, expect } from 'vitest';
import { currentGuideAnchor } from './guide-anchors';

describe('currentGuideAnchor', () => {
	it('maps each old anchor to its new one', () => {
		expect(currentGuideAnchor('guide-fit-forecast')).toBe('guide-markup-forecast');
		expect(currentGuideAnchor('guide-fit-characteristics')).toBe('guide-markup-characteristics');
		expect(currentGuideAnchor('guide-fit-notation')).toBe('guide-markup-notation');
	});

	it('passes a current anchor through unchanged', () => {
		expect(currentGuideAnchor('guide-markup-forecast')).toBe('guide-markup-forecast');
		expect(currentGuideAnchor('guide-what')).toBe('guide-what');
	});
});
