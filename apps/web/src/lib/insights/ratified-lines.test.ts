/**
 * ratified-lines.test.ts: Insights lines Dann rewrote on 2026-10-11 (`OPEN.md`,
 * 21:21 to 21:52), pinned character for character in both languages, the
 * apostrophes typographic (QUEUE row 78a).
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { hasString, t, tIfPresent, tOrEnglish } from '$lib/i18n';

describe('ratified Insights lines (row 78a)', () => {
	it('the frame line, English (21:21; the clause « from technique building to transposition options » dropped 2026-10-12 20:55, row 90)', () => {
		expect(t('insights.r2.frame', 'en')).toBe(
			'Ilya’s advice is drawn from the intersection of your voice as you calibrate and describe it, and the demands of the music you are investigating. Citations connect Ilya’s findings to specific voice pedagogy literature. Since a computer program cannot experience your actual singing, discuss anything Ilya suggests with your voice teacher.',
		);
	});
	it('the frame line, French (21:27; the clause « du travail technique aux options de transposition » dropped 2026-10-12 20:55, row 90)', () => {
		expect(t('insights.r2.frame', 'fr')).toBe(
			'Les conseils d’Ilya sont tirés de la rencontre entre votre voix, telle que vous la calibrez et la décrivez, et les exigences de la musique que vous étudiez. Des citations relient les constats d’Ilya à des passages précis de la littérature en pédagogie du chant. Comme un logiciel ne peut pas percevoir votre chant réel, discutez des suggestions d’Ilya avec votre professeure ou professeur de chant.',
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

/* QUEUE rows 90 and 94. The Guide keeps its prose in markup, not in i18n.ts, so
   these pins read GuideContent.svelte as source, as no-fit-name.test.ts does.
   Row 90 (a): two lines in the French conventions list, ratified 2026-10-12
   20:30. Row 94: the teacher-as-intermediary paragraph, ratified 2026-10-13
   23:11 (English) and 23:14 (French). U+2019 apostrophes, U+00A0 before French
   colons (written `&#160;` in the markup). */
describe('ratified Guide lines (rows 90 and 94)', () => {
	const guide = readFileSync(new URL('../components/Reading/GuideContent.svelte', import.meta.url), 'utf8');
	const a = guide.indexOf("{#if language === 'fr'}");
	const b = guide.indexOf('{:else}', a);
	const fr = guide.slice(a, b);
	const en = guide.slice(0, a) + guide.slice(b);
	const OQLF1 = 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23991/';
	const OQLF3 = 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23245/';

	it('row 90 (a), item 1: « le féminin en premier » and its source, in the Noms de personnes item', () => {
		expect(fr).toContain(
			`Le féminin en premier&#160;: l’<a href="${OQLF1}" target="_blank" rel="noopener">OQLF</a> laisse l’ordre libre et recommande de placer le masculin le plus près de l’adjectif qui s’accorde; <em>Ilya</em> place donc le féminin en premier.</li>`,
		);
		// Seated inside the existing item, after its own text.
		const li = fr.slice(fr.indexOf('<strong>Noms de personnes.</strong>'), fr.indexOf('</li>', fr.indexOf('<strong>Noms de personnes.</strong>')));
		expect(li).toContain('une formulation neutre le remplace. Le féminin en premier');
	});
	it('row 90 (a), item 3: Références, linked to the OQLF bibliographic notice, after Plis vocaux', () => {
		const line = `<li><strong>Références</strong>&#160;: selon la <a href="${OQLF3}" target="_blank" rel="noopener">notice bibliographique de l’OQLF</a> (lieu, éditeur, année).</li>`;
		expect(fr).toContain(line);
		expect(fr.indexOf('<strong>Plis vocaux.</strong>')).toBeLessThan(fr.indexOf(line));
		expect(fr.indexOf(line)).toBeLessThan(fr.indexOf('</ul>', fr.indexOf(line)));
	});
	it('row 90 (a) adds no English: the English Guide has no OQLF doublet link', () => {
		expect(en).not.toContain(OQLF1);
		expect(en).not.toContain(OQLF3);
	});
	it('row 94, English: the teacher paragraph sits directly after paragraph A', () => {
		const para =
			'<p><em>Ilya</em>’s advice gathers what a wide range of established singing voice pedagogy literature says about the conditions it finds in a piece and in your voice. Without a teacher in the conversation, that advice can mislead you, or not suit your voice. Bring anything <em>Ilya</em> offers about technique to your voice teacher. <em>Ilya</em> is made to work in partnership with a teacher’s informed ear.</p>';
		expect(en).toContain(para);
		const at = en.indexOf('equipping you with specific challenges to bring to your teacher.</p>');
		expect(at).toBeGreaterThan(0);
		expect(en.slice(at).replace(/\s+/g, ' ')).toContain('</p> ' + para);
	});
	it('row 94, French: the teacher paragraph sits directly after paragraph A', () => {
		const para =
			'<p>Les conseils d’<em>Ilya</em> rassemblent ce qu’un large éventail de la littérature établie en pédagogie du chant dit des conditions qu’il relève dans une pièce et dans votre voix. Sans professeure ou professeur de chant dans la conversation, ces conseils peuvent vous induire en erreur, ou ne pas convenir à votre voix. Discutez de tout ce qu’<em>Ilya</em> propose sur la technique avec votre professeure ou professeur de chant. <em>Ilya</em> est conçu pour travailler en partenariat avec l’oreille avertie d’une professeure ou d’un professeur.</p>';
		expect(fr).toContain(para);
		const at = fr.indexOf('des défis précis à aborder avec votre professeure ou professeur.</p>');
		expect(at).toBeGreaterThan(0);
		expect(fr.slice(at).replace(/\s+/g, ' ')).toContain('</p> ' + para);
	});
});

/* N.135 STAGE 3. Input's two views, the strings Dann ratified 2026-10-16 01:18
   in both languages (`OPEN.md`, "N.135 STAGE 3", item 14), pinned character for
   character so a later edit cannot move them unseen. The French colon carries
   the file's no-break space. The Lyrics placeholder is the exception: its
   English is the review's proposal for Dann (amendment 1) and its French is
   owed, so it is pinned EMPTY and a ruling has to change this test. */
describe('ratified Input view lines (N.135 stage 3)', () => {
	const LINES: Record<string, [string, string]> = {
		'intake.view.poem': ['Poem', 'Poème'],
		'intake.view.lyrics': ['Lyrics', 'Paroles'],
		'intake.view.poemLine': [
			'Edits here change the published poem. The sung words come from your score; edit them in Lyrics.',
			'Les modifications faites ici changent le poème publié. Les paroles chantées viennent de votre partition; modifiez-les dans Paroles.',
		],
		'intake.view.lyricsLine': [
			'The words as sung, as the score sets them. Coloured words differ from the poem: a repeat, a change, or an addition.',
			'Les paroles telles que chantées, comme la partition les place. Les mots en couleur diffèrent du poème : une reprise, un changement ou un ajout.',
		],
		'intake.view.omittedLine': [
			'Greyed words are those left out of the song by the composer.',
			'Les mots grisés sont ceux que le compositeur a laissés de côté dans ce chant.',
		],
		'intake.view.landedLyrics': [
			'Your score\'s sung words are in Lyrics. Paste or type the published poem here, whole.',
			'Les paroles chantées de votre partition sont dans Paroles. Collez ou saisissez ici le poème publié, en entier.',
		],
		'intake.view.landedPoem': [
			'This page read as a poem and is in Poem. The sung words in Lyrics may differ from it.',
			'Cette page a été lue comme un poème; elle est dans Poème. Les paroles chantées, dans Paroles, peuvent en différer.',
		],
		'input.watermarkLyrics': ['lyrics', 'paroles'],
		'intake.placeholder': ['Paste, type, or drop your poem here.', 'Collez, saisissez ou déposez votre poème ici.'],
	};
	for (const [key, [en, fr]] of Object.entries(LINES)) {
		it(`${key}, both languages`, () => {
			expect(t(key, 'en')).toBe(en);
			expect(t(key, 'fr')).toBe(fr);
		});
	}
	it('the Lyrics placeholder: the review\'s English, and no French until Dann rules (amendment 1)', () => {
		expect(t('intake.placeholderLyrics', 'en')).toBe('Your score\'s sung words appear here. You can also paste or type them.');
		expect(hasString('intake.placeholderLyrics', 'fr')).toBe(false);
		expect(tIfPresent('intake.placeholderLyrics', 'fr')).toBe('');
		expect(tIfPresent('intake.placeholderLyrics', 'en')).toBe(t('intake.placeholderLyrics', 'en'));
	});
	it('the replace question is a desk draft in English with its French owed, and the dialog falls back to English', () => {
		for (const key of ['intake.poemReplace.title', 'intake.poemReplace.body', 'intake.poemReplace.replace', 'intake.poemReplace.keep']) {
			expect(hasString(key, 'en'), key).toBe(true);
			expect(hasString(key, 'fr'), key).toBe(false);
			expect(tOrEnglish(key, 'fr'), key).toBe(t(key, 'en'));
		}
		expect(tOrEnglish('intake.view.poem', 'fr')).toBe('Poème');
	});
});
