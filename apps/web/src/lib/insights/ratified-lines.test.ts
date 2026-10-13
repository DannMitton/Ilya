/**
 * ratified-lines.test.ts: Insights lines Dann rewrote on 2026-10-11 (`OPEN.md`,
 * 21:21 to 21:52), pinned character for character in both languages, the
 * apostrophes typographic (QUEUE row 78a).
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

describe('ratified Insights lines (row 78a)', () => {
	it('the frame line, English (21:21)', () => {
		expect(t('insights.r2.frame', 'en')).toBe(
			'Ilya’s advice, from technique building to transposition options, is drawn from the intersection of your voice as you calibrate and describe it, and the demands of the music you are investigating. Citations connect Ilya’s findings to specific voice pedagogy literature. Since a computer program cannot experience your actual singing, discuss anything Ilya suggests with your voice teacher.',
		);
	});
	it('the frame line, French (21:27)', () => {
		expect(t('insights.r2.frame', 'fr')).toBe(
			'Les conseils d’Ilya, du travail technique aux options de transposition, sont tirés de la rencontre entre votre voix, telle que vous la calibrez et la décrivez, et les exigences de la musique que vous étudiez. Des citations relient les constats d’Ilya à des passages précis de la littérature en pédagogie du chant. Comme un logiciel ne peut pas percevoir votre chant réel, discutez des suggestions d’Ilya avec votre professeure ou professeur de chant.',
		);
	});
	it('the teacher lines A (21:32) and C (21:34)', () => {
		expect(t('insights.r2.teacherA', 'en')).toBe('Discuss this approach with your voice teacher.');
		expect(t('insights.r2.teacherA', 'fr')).toBe('Discutez de cette approche lors de vos cours de chant.');
		expect(t('insights.r2.teacherC', 'en')).toBe('Review these sources with your voice teacher, who can weigh in on which of them actually apply to your voice.');
		expect(t('insights.r2.teacherC', 'fr')).toBe(
			'Passez ces sources en revue avec votre professeure ou professeur de chant, qui pourra donner son avis sur celles qui s’appliquent effectivement à votre voix.',
		);
	});
	it('the sources heading (21:40 and 21:51) and the cycles line (21:52)', () => {
		expect(t('comment.tap', 'en')).toBe('Further reading');
		expect(t('comment.tap', 'fr')).toBe('Lectures complémentaires');
		expect(t('insights.r2.cycles', 'en')).toBe('Your vocal folds contact about {n} times as you sing this piece.');
		expect(t('insights.r2.cycles', 'fr')).toBe('Vos plis vocaux entrent en contact environ {n} fois pendant que vous chantez cette pièce.');
	});
});
