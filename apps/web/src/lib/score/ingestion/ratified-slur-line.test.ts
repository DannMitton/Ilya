/**
 * The line a verse carries when its slur gate fails (cloud-lane-88, round 3), RATIFIED by Dann 2026-11-24 21:43 in both languages
 * and pinned character for character, as `insights/ratified-lines.test.ts` pins its own. The key is `upload.banner.slurEvidenceUnchecked`.
 * `{n}` is the verse's syllables and `{m}` its sung notes: the two counts a singer can make on her own page, never a derived figure.
 * The French apostrophes are U+2019.
 */
import { describe, expect, it } from 'vitest';
import type { ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { t } from '$lib/i18n';
import { slurUnchecked } from './ingest';
import { foldVowelessSyllables } from './vowelless-fold';
import { countUnderlay } from './underlay-count';

describe('ratified line: a verse whose slurs could not be checked against its syllable count', () => {
	it('English (21:43)', () => {
		expect(t('upload.banner.slurEvidenceUnchecked', 'en')).toBe(
			'This verse has {n} syllables for {m} sung notes, and its slurs do not account for the difference. Ilya has left the words where your score prints them rather than choose which notes carry a melisma. Check the melismas here.',
		);
	});
	it('French (21:43), U+2019 apostrophes', () => {
		const fr = t('upload.banner.slurEvidenceUnchecked', 'fr');
		expect(fr).toBe(
			'Ce couplet compte {n} syllabes pour {m} notes chantées, et ses liaisons de phrasé n’expliquent pas l’écart. Ilya laisse donc les paroles telles qu’imprimées dans votre partition, plutôt que de choisir quelles notes portent un mélisme. Vérifiez les mélismes ici.',
		);
		expect(fr).not.toContain("'");
	});
	it('{m} is every sung note in the verse, pinned ones included: a mark alone is still a notehead she counts (Dann, 2026-11-25)', () => {
		const note = (id: string, text?: string, extra: Record<string, unknown> = {}) => ({ id, type: 'note', measureIndex: 0, ...(text ? { syllable: { id: `s-${id}`, text, type: 'whole', verseNumber: 1, wordContext: text } } : {}), ...extra }) as unknown as VocalLineEvent;
		// Five noteheads: «ты» under a slur, its continuation, a mark alone, and «мой» «дом». The mark comes off the gate, never off {m}.
		const score = { vocalLine: [note('a', 'ты', { slurs: [{ type: 'start', number: 1, partnerEventId: 'b' }] }), note('b', undefined, { slurs: [{ type: 'stop', number: 1 }] }), note('c', '—'), note('d', 'мой'), note('e', 'дом'), note('f')] } as unknown as ParsedScore;
		const v = countUnderlay(foldVowelessSyllables(score)).verses[0];
		expect(v.slurGate).toBe('failed');
		expect(v.sung).toBe(5);
		expect(v.notes).toBe(6);
		const w = slurUnchecked({ verse: v.verse, syllables: v.syllables, notes: v.notes });
		expect(w.counts).toEqual([3, 6]);
		expect(w.message).toContain('3 syllables for 6 sung notes');
	});
	it('both carry the two counts and no third', () => {
		for (const l of ['en', 'fr'] as const) expect([...t('upload.banner.slurEvidenceUnchecked', l).matchAll(/\{(\w+)\}/g)].map((m) => m[1])).toEqual(['n', 'm']);
	});
});
