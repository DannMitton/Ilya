/**
 * The Stage reading box (rhyme lane 49, ruled 2026-11-11 23:05): its two labels, pinned, and where the Inspector hands
 * the slot its boxes. The rendered capture is `e2e/rhyme-set-aside.test.ts`.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

describe('the Stage reading box', () => {
	it('is labelled "Stage reading" and « Prononciation scénique »', () => {
		expect(t('inspector.rhyme.stage', 'en')).toBe('Stage reading');
		expect(t('inspector.rhyme.stage', 'fr')).toBe('Prononciation scénique');
	});

	it('is drawn on the match, not on the reading in force: the Inspector tests `word.rhymePartner`, and spot comes first', () => {
		const src = read('./InspectorPanel.svelte');
		expect(src).toContain("word.rhymePartner !== undefined ? [{ id: 'rhyme'");
		expect(src.indexOf("id: 'spot'")).toBeLessThan(src.indexOf("id: 'rhyme'"));
		expect(src).toContain('<ReadingBoxes boxes={readingBoxes} />');
	});

	it('keeps the spot box\'s own class, so the saved-marks test still finds it, and gives the rhyme box another', () => {
		const slot = read('./ReadingBoxes.svelte');
		expect(slot).toContain('{box.id}-checkbox');
		expect(read('../../../../e2e/word-marks-saved.test.ts')).toContain(".spot-checkbox");
	});
});
