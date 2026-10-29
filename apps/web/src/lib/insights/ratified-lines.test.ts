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

/* N.135 STAGE 3. Input's two views: the strings Dann ratified 2026-10-16 01:18
   (`OPEN.md`, "N.135 STAGE 3", item 14) and the rest of them between 19:54 and
   20:11 the same day (the Lyrics placeholder, the French of three lines, the
   replace question), in both languages, pinned character for character so a
   later edit cannot move them unseen. The French colon carries the file's
   no-break space; the apostrophe in « s’affichent » is U+2019. */
describe('ratified Input view lines (N.135 stage 3)', () => {
	const LINES: Record<string, [string, string]> = {
		'intake.view.poem': ['Poem', 'Poème'],
		'intake.view.lyrics': ['Lyrics', 'Paroles'],
		'intake.view.poemLine': [
			'Edits here change the published poem. The sung words come from your score; edit them in Lyrics.',
			'Les modifications faites ici changent le poème publié. Les paroles chantées viennent de votre partition; modifiez-les dans le champ Paroles.',
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
			'Les paroles chantées de votre partition sont dans le champ Paroles. Collez ou saisissez ici le poème publié, en entier.',
		],
		'intake.view.landedPoem': [
			'This page read as a poem and is in Poem. The sung words in Lyrics may differ from it.',
			'Cette page a été lue comme un poème; elle est dans le champ Poème. Les paroles chantées, dans le champ Paroles, peuvent en différer.',
		],
		'input.watermarkLyrics': ['lyrics', 'paroles'],
		'intake.placeholderLyrics': [
			'Your score\'s sung words appear here. You can also paste or type them.',
			'Les paroles chantées de votre partition s\u2019affichent ici. Vous pouvez aussi les coller ou les saisir.',
		],
		'intake.poemReplace.title': ['Replace the poem?', 'Remplacer le poème?'],
		'intake.poemReplace.body': [
			'This page was read as a poem, and Poem already holds one. Ilya cannot undo its replacement.',
			'Cette page a été lue comme un poème, et le champ Poème en contient déjà un. Ilya ne peut pas annuler le remplacement de celui-ci.',
		],
		'intake.poemReplace.replace': ['Replace the poem', 'Remplacer le poème'],
		'intake.poemReplace.keep': ['Keep the poem', 'Conserver le poème'],
		'intake.placeholder': ['Paste, type, or drop your poem here.', 'Collez, saisissez ou déposez votre poème ici.'],
	};
	for (const [key, [en, fr]] of Object.entries(LINES)) {
		it(`${key}, both languages`, () => {
			expect(t(key, 'en')).toBe(en);
			expect(t(key, 'fr')).toBe(fr);
		});
	}
	it('tIfPresent and tOrEnglish still fall back for a key that lacks a language, and read the French where it exists', () => {
		expect(tIfPresent('intake.placeholderLyrics', 'fr')).toBe(t('intake.placeholderLyrics', 'fr'));
		expect(tOrEnglish('intake.poemReplace.title', 'fr')).toBe('Remplacer le poème?');
		expect(tIfPresent('no.such.key', 'fr')).toBe('');
		expect(tOrEnglish('no.such.key', 'fr')).toBe('[MISSING: no.such.key]');
	});
});

/* QUEUE row 123. Two sentences in the Guide's `guide-witnesses` paragraph, ratified by Dann
   2026-10-19 21:09 (both languages). The pins are written with escapes so a copy that loses a
   character fails them:   is the no-break space before the French colon, and ɡ is the
   IPA script g in [ɡ] (U+0261, the character the engine writes), not the Latin g (U+0067). */
describe('ratified Guide lines (row 123)', () => {
	const guide = readFileSync(new URL('../components/Reading/GuideContent.svelte', import.meta.url), 'utf8');
	const a = guide.indexOf("{#if language === 'fr'}");
	const b = guide.indexOf('{:else}', a);
	const decode = (s: string): string => s.replace(/&#160;/g, ' ');
	const fr = decode(guide.slice(a, b));
	const en = decode(guide.slice(0, a) + guide.slice(b));

	it('English: why a rest keeps «так» sounding [k], between the two sentences it follows and precedes', () => {
		expect(en).toContain(
			'and the sound of a sung word depends on the words beside it. Grayson (p. 248) holds that punctuation and the implied phrase, a place where a speaker could pause, are boundaries that no assimilation crosses, not even voicing. <em>Ilya</em> treats a rest in the vocal line as such a pause: where a score sets a rest between <em>так</em> and <em>засыпаю</em>, <em>так</em> keeps its [k]; sung straight on, it takes [ɡ] before the [z]. To review the authoritative poem',
		);
	});
	it('French: the same, with U+2019 apostrophes and a no-break space before the colon', () => {
		expect(fr).toContain(
			'et le son d’un mot chanté dépend des mots qui l’entourent. Selon Grayson (p. 248), la ponctuation et la phrase implicite, là où l’on pourrait marquer une pause, sont des frontières que ne franchit aucune assimilation, pas même celle du voisement. <em>Ilya</em> traite un silence dans la ligne vocale comme une telle pause : là où une partition place un silence entre <em>так</em> et <em>засыпаю</em>, <em>так</em> garde son [k]; chanté sans interruption, il prend [ɡ] devant le [z]. Pour consulter à tout moment',
		);
	});
});

/* N.194 (QUEUE row 152), the Loupe's break button. The expected strings are copied from the brief
   (`brief-code-n194-loupe-break-button_r5_2026-10-25.md`), not read back out of `i18n.ts`: the pill's labels,
   ruled by Dann 2026-10-21 13:42; the undo sentences, ratified 2026-10-21 20:30; the reason under an off pill,
   ruled 2026-10-26 14:56 and ratified 14:57. */
describe('ratified break-button lines (N.194)', () => {
	it('the pill, English and French', () => {
		expect(t('loupe.place.breakAfter', 'en')).toBe('Break after this word');
		expect(t('loupe.place.breakAfter', 'fr')).toBe('Frontière après ce mot');
		expect(t('loupe.place.breakRemove', 'en')).toBe('Remove break');
		expect(t('loupe.place.breakRemove', 'fr')).toBe('Retirer la frontière');
	});
	it('the undo sentences, English and French', () => {
		expect(t('loupe.undo.breakPlaced', 'en')).toBe('break placed');
		expect(t('loupe.undo.breakPlaced', 'fr')).toBe('frontière placée');
		expect(t('loupe.undo.breakRemoved', 'en')).toBe('break removed');
		expect(t('loupe.undo.breakRemoved', 'fr')).toBe('frontière retirée');
	});
	it('the reason under an off pill, English and French', () => {
		expect(t('loupe.place.breakImplied', 'en')).toBe('A break is already implied here.');
		expect(t('loupe.place.breakImplied', 'fr')).toBe('Une frontière est déjà implicite ici.');
	});
	it('all five are present in both languages, and the French differs from the English', () => {
		for (const key of ['loupe.place.breakAfter', 'loupe.place.breakRemove', 'loupe.place.breakImplied', 'loupe.undo.breakPlaced', 'loupe.undo.breakRemoved']) {
			expect([hasString(key, 'en'), hasString(key, 'fr')], key).toEqual([true, true]);
			expect(t(key, 'fr'), key).not.toContain('[MISSING');
			expect(t(key, 'fr'), key).not.toBe(t(key, 'en'));
		}
	});
});

/* QUEUE row 113. The HEIC refusal, ratified by Dann 2026-10-27 23:30. It fires only where the HEIC
   decoder fails (a damaged file, a shape it does not know, or its files could not be fetched). The
   French apostrophes are U+2019. */
describe('ratified HEIC refusal (row 113)', () => {
	it('English', () => {
		expect(t('upload.err.imageHeic', 'en')).toBe(
			'Ilya could not open this iPhone photo. On a Mac, open the photo in Preview and choose File, then Export, then JPEG, and try again.',
		);
	});
	it('French, with the typographic apostrophe by code point', () => {
		const fr = t('upload.err.imageHeic', 'fr');
		expect(fr).toBe(
			'Ilya n\u2019a pas pu ouvrir cette photo d\u2019iPhone. Sur un Mac, ouvrez la photo dans Aperçu et choisissez Fichier, puis Exporter, puis JPEG, et réessayez.',
		);
		expect([...fr].filter((c) => c === '\u2019')).toHaveLength(2);
		expect(fr).not.toContain("'");
	});
});

/* N.135 stage 2b, brief r5 step 2. The banner for a scan whose printed words were read on some
   systems and not others, ratified by Dann 2026-10-28 23:12 (ranges, EN and FR) and 2026-10-29 00:00
   (the single bar; the first sentence's end only). The slots are {bars} and {bar}; the words in them
   are `barsText` (lib/score/ingestion/ingest.ts), pinned in score/scan-notice.test.ts. The apostrophes
   are U+2019, as in the rest of i18n.ts (DESK DEFAULT; the ratified file wrote U+0027). */
describe('ratified banner for a scan read in part (brief r5 step 2)', () => {
	it('ranges, English', () => {
		expect(t('upload.banner.wordsPartlyRead', 'en')).toBe(
			'Ilya’s reading of printed words is still imperfect; it could not read the words in bars {bars}. Type the missing words into Lyrics exactly where they fall in the song. Check every word against your score.',
		);
	});
	it('ranges, French', () => {
		expect(t('upload.banner.wordsPartlyRead', 'fr')).toBe(
			'Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles des mesures {bars}. Saisissez les paroles manquantes dans Paroles, exactement à leur place dans le chant. Vérifiez chaque mot sur votre partition.',
		);
	});
	it('one bar, English', () => {
		expect(t('upload.banner.wordsPartlyReadOne', 'en')).toBe(
			'Ilya’s reading of printed words is still imperfect; it could not read the words in bar {bar}. Type the missing words into Lyrics exactly where they fall in the song. Check every word against your score.',
		);
	});
	it('one bar, French', () => {
		expect(t('upload.banner.wordsPartlyReadOne', 'fr')).toBe(
			'Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles de la mesure {bar}. Saisissez les paroles manquantes dans Paroles, exactement à leur place dans le chant. Vérifiez chaque mot sur votre partition.',
		);
	});
	it('writes every apostrophe as U+2019 and no em-dash', () => {
		for (const key of ['upload.banner.wordsPartlyRead', 'upload.banner.wordsPartlyReadOne']) {
			for (const lang of ['en', 'fr'] as const) {
				expect(t(key, lang), `${key} ${lang}`).not.toContain("'");
				expect(t(key, lang), `${key} ${lang}`).not.toContain('—');
			}
		}
	});
});
