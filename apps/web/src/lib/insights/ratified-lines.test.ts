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
		// The plural, under an observation with a second paragraph of other approaches: RATIFIED by Dann 2026-11-04 09:34.
		expect(t('insights.r2.teacherA.many', 'en')).toBe('Discuss these approaches with your voice teacher.');
		expect(t('insights.r2.teacherA.many', 'fr')).toBe('Discutez de ces approches lors de vos cours de chant.');
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
   these pins read GuideContent.svelte as source, as retired-names.test.ts does for the Guide's Fit check.
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
		'intake.view.poem': ['POEM', 'POÈME'],
		'intake.view.lyrics': ['LYRICS', 'PAROLES'],
		'intake.view.poemLine': [
			'Edits here change the published poem. The sung words come from your score; edit them in LYRICS.',
			'Les modifications faites ici changent le poème publié. Les paroles chantées viennent de votre partition; modifiez-les dans le champ PAROLES.',
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
			'Your score supplied the words in LYRICS. Add the whole published poem here to see where the song departs from it.',
			'Votre partition a fourni les paroles du champ PAROLES. Ajoutez ici le poème publié en entier pour voir où la mise en musique s\u2019en écarte.',
		],
		'intake.view.landedPoem': [
			'This page read as a poem and is in POEM. The sung words in LYRICS may differ from it.',
			'Cette page a été lue comme un poème; elle est dans le champ POÈME. Les paroles chantées, dans le champ PAROLES, peuvent en différer.',
		],
		'input.watermarkLyrics': ['lyrics', 'paroles'],
		'intake.placeholderLyrics': [
			'Your score\'s sung words appear here. You can also paste or type them.',
			'Les paroles chantées de votre partition s\u2019affichent ici. Vous pouvez aussi les coller ou les saisir.',
		],
		'intake.poemReplace.title': ['Replace the poem?', 'Remplacer le poème?'],
		'intake.poemReplace.body': [
			'This page was read as a poem, and POEM already holds one. Ilya cannot undo its replacement.',
			'Cette page a été lue comme un poème, et le champ POÈME en contient déjà un. Ilya ne peut pas annuler le remplacement de celui-ci.',
		],
		'intake.poemReplace.replace': ['Replace the poem', 'Remplacer le poème'],
		'intake.poemReplace.keep': ['Keep the poem', 'Conserver le poème'],
		'intake.placeholder': ['Paste, type, or drop the published poem here.', 'Collez, saisissez ou déposez le poème publié ici.'],
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
	/* ROW 172, ratified by Dann 2026-11-05 08:10 (he changed "shows" / « affiche » to "transcribes" / « transcrit »): the last
	   two sentences of the same paragraph. They check the words and the characters (the no-break space before the French
	   colon, U+00A0, the OQLF rule). If the Guide drifts back to the old pair (« l’onglet Texte ») the singer is told to
	   use a control the app no longer has. They relate to `text.source.*` (the line above TEXT) the sentence names. */
	it('English: the poem is reviewed through INPUT, and TEXT transcribes it', () => {
		expect(en).toContain(
			'To review the authoritative poem itself anytime, choose POEM in INPUT: TEXT then transcribes the whole poem as published, including any words the composer has left out, and says so in a line above the page. Choose LYRICS in INPUT to return.',
		);
	});
	it('French: the same, with a no-break space before the colon', () => {
		expect(fr).toContain(
			'Pour consulter à tout moment le poème qui fait autorité, choisissez POÈME dans ENTRÉE : TEXTE transcrit alors le poème entier tel que publié, y compris les mots que le compositeur a laissés de côté, et le signale par une ligne au-dessus de la page. Choisissez PAROLES dans ENTRÉE pour revenir.',
		);
		expect(fr).not.toContain('l’onglet Texte');
	});
});

/* QUEUE row 159. The Guide's HEIC licence and patent sentences, ratified by Dann 2026-10-28 15:28 (`docs/sessions/ratified-guide-heic-licences_2026-10-28.md`),
   in the Software paragraph of the Licences section, after the onnxruntime-web and OpenCV.js sentence and before the Svelte sentence.
   They check the words, the U+2019 apostrophes, and the placement (between those two sentences). If the Guide drifts, a singer reads
   an attribution or a patent notice Dann did not ratify, which is a licence failure and not a style one. Both languages are in the one file,
   so this pin reads the file whole and finds each sentence by what surrounds it. It relates to the Guide's other ratified lines above (row 123). */
describe('ratified Guide lines (row 159, HEIC licences and patents)', () => {
	const guide = readFileSync(new URL('../components/Reading/GuideContent.svelte', import.meta.url), 'utf8');
	it('English: libheif, libde265, libheif-js, LGPL 3, and the HEVC patent pools, between the OpenCV.js and Svelte sentences', () => {
		expect(guide).toContain(
			'OpenCV.js (Apache License 2.0). A photograph in Apple’s HEIC format is opened by libheif (© 2017–2020 struktur AG; © 2017–2025 Dirk Farin), with the libde265 HEVC decoder (© 2013–2014 struktur AG, Dirk Farin, and the openHEVC contributors), in Kiril Vatev’s libheif-js build; all are released under the GNU Lesser General Public License, version 3. HEVC, the compression inside a HEIC photograph, is covered by patents that their holders license through patent pools, among them Access Advance’s HEVC Advance pool; <em>Ilya</em> uses HEVC only to decode a photograph the singer chooses, and holds no licence from these pools. The interface is built',
		);
	});
	it('French: the same, between the OpenCV.js and Svelte sentences', () => {
		expect(guide).toContain(
			'OpenCV.js (licence Apache 2.0). Une photographie au format HEIC d’Apple est ouverte par libheif (© 2017–2020 struktur AG; © 2017–2025 Dirk Farin), avec le décodeur HEVC libde265 (© 2013–2014 struktur AG, Dirk Farin, et les contributrices et contributeurs d’openHEVC), dans la compilation libheif-js de Kiril Vatev; tous sont publiés sous la licence publique générale limitée GNU, version 3. Le HEVC, la compression contenue dans une photographie HEIC, est couvert par des brevets que leurs titulaires concèdent sous licence par l’intermédiaire de groupements de brevets, dont le groupement HEVC Advance d’Access Advance; <em>Ilya</em> n’utilise le HEVC que pour décoder une photographie choisie par la chanteuse ou le chanteur, et ne détient aucune licence de ces groupements. L’interface est construite',
		);
	});
});

/* INTEGRATION STEP 8b (strings ratified by Dann 2026-11-09 14:19 to 14:24, when scan words shipped to colleagues as a preview). The two scan
   banners that said Ilya does not read printed words are replaced: `upload.banner.reader` (a scan's synthesis, to check) and
   `upload.banner.noLyricsScan` (no words read at all). They check all four texts character by character: U+2019 apostrophes, no
   space before the French semicolon. WHEN THEY FAIL: a singer is told again that Ilya does not read printed words, or reads text
   Dann did not ratify. They relate to `no-lyrics-notice.test.ts` (which pins the same strings from the banner's side) and to the
   partly-read strings, which stay as ratified and are pinned in `scan-notice.test.ts`. */
describe('ratified scan banners (step 8b)', () => {
	it('upload.banner.reader, English and French', () => {
		expect(t('upload.banner.reader', 'en')).toBe(
			'This score is Ilya’s synthesis from an image (scan or photograph). The optical recognition of musical notes and printed text is imperfect, so you should check Ilya’s reading against your original source. You may rectify any errors through the Loupe’s CORRECTIONS pane.',
		);
		expect(t('upload.banner.reader', 'fr')).toBe(
			'Cette partition est la synthèse qu’Ilya a faite à partir d’une image (numérisation ou photographie). La reconnaissance optique des notes de musique et du texte imprimé est imparfaite; vérifiez donc la lecture d’Ilya sur votre source originale. Vous pouvez corriger toute erreur dans le volet CORRECTIONS de la loupe.',
		);
	});
	it('upload.banner.noLyricsScan, English and French', () => {
		expect(t('upload.banner.noLyricsScan', 'en')).toBe(
			'Ilya could not read any words from this image. You can add lyrics through the LYRICS pane and seat them under the right notes using the Loupe’s SYLLABLES controls.',
		);
		expect(t('upload.banner.noLyricsScan', 'fr')).toBe(
			'Ilya n’a pu lire aucune parole dans cette image. Vous pouvez ajouter les paroles dans le champ PAROLES, puis les placer sous les bonnes notes à l’aide des commandes SYLLABES de la loupe.',
		);
	});
	it('has no space before a French semicolon, and uses U+2019', () => {
		for (const key of ['upload.banner.reader', 'upload.banner.noLyricsScan'] as const) {
			expect(t(key, 'fr')).not.toMatch(/[\u00a0 ];/);
			expect(t(key, 'fr')).not.toContain("'");
			expect(t(key, 'en')).not.toContain("'");
		}
	});
});

/* INTEGRATION STEP 11c (Dann 2026-11-09 20:12). The Inspector's line for the г of мягк-, лёгк-, легк-: `lexical-gk:г` in `data/blurb-composer.json`,
   Grayson 2012 p. 240 alone. It checks the data file's two sentences character by character (U+2019 apostrophes, U+00A0 before the French
   colon, «л» U+043B) and the citation. WHEN IT FAILS: the Inspector says something Dann did not ratify. It relates to the blurb package's own
   `lexical-gk.test.ts`, which pins what the composer prints. */
describe('ratified blurb line for мягк-, лёгк- (step 11c)', () => {
	const data = JSON.parse(readFileSync(new URL('../../../../../data/blurb-composer.json', import.meta.url), 'utf8'));
	const p = data.processes['lexical-gk:г'];
	it('English and French, exactly', () => {
		expect(p.en.template).toBe('Within a word, ⟨г⟩ before ⟨к⟩ is read [x], or [xʲ] before a soft [kʲ]: Grayson’s мягко/мягкий rule, found in a few very common words such as мягкий and лёгкий.');
		expect(p.fr.template).toBe('À l’intérieur d’un mot, ⟨г⟩ devant ⟨к⟩ se prononce [x], ou [xʲ] devant un [kʲ] palatalisé\u00a0: c’est la règle мягко/мягкий de Grayson, propre à quelques mots très courants comme мягкий et лёгкий.');
	});
	it('cites p. 240 alone, and the Cyrillic is Cyrillic', () => {
		expect(p.en.citation).toBe('p. 240');
		expect(p.fr.citation).toBe('p. 240');
		expect('\u043b').toBe('л');
		for (const w of ['мягко', 'мягкий', 'лёгкий']) for (const c of w) expect(c.charCodeAt(0)).toBeGreaterThanOrEqual(0x400);
		expect(p.en.template).toContain('л\u0451гкий'.replace('\u0451', 'ё'));
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

/* ROW 181 step 6: the middle sentence was replaced by Dann's ratification of 2026-11-04 14:33 and 14:34 (strings-row181_r1_2026-11-04.md, items 9 and 10); the first and last sentences stand as ratified below.
   N.135 stage 2b, brief r5 step 2. The banner for a scan whose printed words were read on some
   systems and not others, ratified by Dann 2026-10-28 23:12 (ranges, EN and FR) and 2026-10-29 00:00
   (the single bar; the first sentence's end only). The slots are {bars} and {bar}; the words in them
   are `barsText` (lib/score/ingestion/ingest.ts), pinned in score/scan-notice.test.ts. The apostrophes
   are U+2019, as in the rest of i18n.ts (DESK DEFAULT; the ratified file wrote U+0027). */
describe('ratified banner for a scan read in part (brief r5 step 2)', () => {
	it('ranges, English', () => {
		expect(t('upload.banner.wordsPartlyRead', 'en')).toBe(
			'Ilya’s reading of printed words is still imperfect; it could not read the words in bars {bars}. Choose a bar to see your score’s print there and fill the missing words. Check every word against your score.',
		);
	});
	it('ranges, French', () => {
		expect(t('upload.banner.wordsPartlyRead', 'fr')).toBe(
			'Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles des mesures {bars}. Choisissez une mesure pour voir l’imprimé de votre partition et compléter les paroles manquantes. Vérifiez chaque mot sur votre partition.',
		);
	});
	it('one bar, English', () => {
		expect(t('upload.banner.wordsPartlyReadOne', 'en')).toBe(
			'Ilya’s reading of printed words is still imperfect; it could not read the words in bar {bar}. Choose the bar to see your score’s print there and fill the missing words. Check every word against your score.',
		);
	});
	it('one bar, French', () => {
		expect(t('upload.banner.wordsPartlyReadOne', 'fr')).toBe(
			'Ilya lit encore imparfaitement les paroles imprimées et n’a pas pu lire celles de la mesure {bar}. Choisissez la mesure pour voir l’imprimé de votre partition et compléter les paroles manquantes. Vérifiez chaque mot sur votre partition.',
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

/* ROW 97, moved here by consistency batch 2, step 4 from the retired-name guard (which now reads names.ts
   and keeps its own file for that). The three ratified passages A, B, and C of the Guide and the forecast
   heading are pinned from source, as the rows above pin the other Guide lines. A ratified string changes
   with its pin (CONTRACT.md section 1 item 11a): row 171 changes the forecast heading and this pin together. */
const guideSource = readFileSync(new URL('../components/Reading/GuideContent.svelte', import.meta.url), 'utf8');
const guideFrStart = guideSource.indexOf("{#if language === 'fr'}");
const guideFrEnd = guideSource.indexOf('{:else}', guideFrStart);
const branches = {
	fr: guideSource.slice(guideFrStart, guideFrEnd),
	en: guideSource.slice(0, guideFrStart) + guideSource.slice(guideFrEnd),
};

describe('row 97: the forecast heading', () => {
	it('the Guide heading for the forecast reads as ruled, in both languages, and keeps its id', () => {
		expect(branches.en).toContain('<h4 id="guide-markup-forecast">What Insights forecasts</h4>');
		expect(branches.fr).toContain('<h4 id="guide-markup-forecast">Ce que prévoient les Aperçus</h4>');
		expect(guideSource).not.toContain('it does not declare');
		expect(guideSource).not.toContain('ils ne déclarent pas');
	});
});

/* The three ratified passages (docs/sessions/ratified-guide-abc_2026-10-14.md,
   ratified by Dann 2026-10-14 21:40), pinned by their opening and closing words
   as the Guide writes them: U+2019 apostrophes, U+00A0 before French colons. */
describe('row 97: the three ratified Guide passages are seated', () => {
	const pins: Array<[string, 'en' | 'fr', string]> = [
		['A', 'en', 'From a handful of fry samples on a consumer mic, <em>Ilya</em> measures your resonances, and Insights forecasts how a piece of repertoire is likely to meet your voice'],
		['A', 'en', 'equipping you with specific challenges to bring to your teacher.</p>'],
		['A', 'fr', 'À partir d’une poignée d’échantillons en friture vocale sur un micro grand public, <em>Ilya</em> mesure vos résonances, et les Aperçus prévoient comment'],
		['A', 'fr', 'le rapport de la pièce à votre <em>zona di passaggio</em>'],
		['A', 'fr', 'des défis précis à aborder avec votre professeure ou professeur.</p>'],
		['B', 'en', 'MELODY draws its notation conventions from Mitton (2020, Appendices B and C).'],
		['B', 'en', 'The text underlay offers the same IPA values imported from TEXT that correspond with the Cyrillic lyrics.</p>'],
		['B', 'fr', 'Le CHANT tire ses conventions de notation de Mitton (2020, annexes B et C).'],
		['B', 'fr', 'Sous la portée, le texte reprend les mêmes valeurs API, importées du TEXTE, en regard des paroles cyrilliques.</p>'],
		['C', 'en', '<em>Ilya</em>’s main phonological authority, used with Grayson’s generous consent. MELODY and INSIGHTS implement an open and close timbre markup'],
		['C', 'en', 'an <em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub> crossing analysis, and sung-vowel modification advice.</p>'],
		['C', 'fr', 'principale autorité phonologique d’<em>Ilya</em>, utilisée avec le généreux consentement de Grayson. Le CHANT et les APERÇUS mettent en œuvre'],
		['C', 'fr', 'des croisements <em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub> et des conseils de modification vocalique.</p>']
	];
	it.each(pins)('passage %s (%s) carries %#', (_p, lang, text) => {
		expect(branches[lang]).toContain(text);
	});
	it('the French colons in A and B take U+00A0 before them', () => {
		expect(branches.fr).toContain('susceptible de solliciter votre voix\u00A0: où le timbre');
		expect(branches.fr).toContain('est sémantique\u00A0: hampe vers le bas');
		expect(branches.fr).toContain('chaque voyelle chantée\u00A0: pleines lorsque');
	});
	it('the struck attribution is gone from C', () => {
		for (const lang of ['en', 'fr'] as const) {
			const para = branches[lang].match(/<p><strong>(?:Scholarship|Recherche savante)\.<\/strong>[^\n]*<\/p>/)?.[0] ?? '';
			expect(para.length, lang).toBeGreaterThan(200);
			expect(para, lang).not.toContain('Sung Russian');
		}
	});
});

/* QUEUE row 166. The strings Dann ratified 2026-11-10, 12:54 to 12:59 (the lede was cut to its first sentence at 12:56). Every French colon is
   preceded by a no-break space (U+00A0), and the apostrophes are typographic where one occurs. */
describe('row 166: the six ratified placeholder strings', () => {
	it('the lede: its first sentence only, EN and FR', () => {
		expect(t('insights.generic.lede', 'en')).toBe('These findings use placeholder values for a generic {voiceType}, not your specific voice.');
		expect(t('insights.generic.lede', 'fr')).toBe('Ces constats reposent sur des valeurs par défaut pour une voix type de {voiceType}, et non sur votre voix en particulier.');
	});
	it('the MELODY subtitle for a placeholder voice', () => {
		expect(t('profile.subtitlePlaceholder', 'en')).toBe('Resonance profile: placeholder values for a generic {voiceType}, not yet your own resonances.');
		expect(t('profile.subtitlePlaceholder', 'fr')).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de {voiceType}, pas encore vos propres résonances.');
	});
	it('the vowel chart\u2019s caption for a placeholder page, EN and FR (closing polish lane, step 2; Dann 2026-11-11 13:23)', () => {
		expect(t('insights.r2.vowels.against.generic', 'en')).toBe('against where each vowel turns in a generic {voiceType}');
		expect(t('insights.r2.vowels.against.generic', 'fr')).toBe('selon la hauteur où chaque voyelle change de timbre pour une voix type de {voiceType}');
	});
	it('the no-score page: the ratified sentence, and the three method lines (N.203 sheet lines 27 to 29 and the new line, RATIFIED 2026-11-16)', () => {
		expect(t('insights.silence.noScore', 'en')).toBe('INSIGHTS measures a piece from its score, and connects it to your voice. Add a score in the INPUT pane to begin.');
		expect(t('insights.silence.noScore', 'fr')).toBe('Les APERÇUS mesurent une pièce à partir de sa partition, et la relient à votre voix. Ajoutez une partition dans le volet ENTRÉE pour commencer.');
		expect(t('insights.method.noScore.samples', 'en')).toBe('Method: from your resonance profile, measured in VOICE.');
		expect(t('insights.method.noScore.samples', 'fr')).toBe('Méthode\u00a0: à partir de votre profil de résonances, mesuré dans VOIX.');
		// RATIFIED by Dann 2026-11-19 12:01 (QUEUE row 167): it no longer says "your voice type", since a contralto's placeholders are a mezzo-soprano's.
		expect(t('insights.method.noScore.generic', 'en')).toBe('Method: from placeholder values, until you record your own vowels.');
		expect(t('insights.method.noScore.generic', 'fr')).toBe('Méthode\u00a0: à partir de valeurs par défaut, jusqu’à ce que vous captiez vos propres voyelles.');
		expect(t('insights.method.noScore.none', 'en')).toBe('Method: record your vowels in VOICE, and this page computes from your voice.');
		expect(t('insights.method.noScore.none', 'fr')).toBe('Méthode\u00a0: captez vos voyelles dans VOIX, et cette page calcule à partir de votre voix.');
	});
	it('the method lines: the two placeholder forms, and "including repeats" in the two calibrated forms (French unchanged)', () => {
		// RATIFIED by Dann 2026-11-19 12:01 (QUEUE row 167): "for your voice type" is out of all four.
		expect(t('insights.method.generic.typed', 'en')).toBe('Method: computed from placeholder values, the voice characteristics you typed, and the score as sung, including repeats.');
		expect(t('insights.method.generic.untyped', 'en')).toBe('Method: computed from placeholder values and the score as sung, including repeats.');
		expect(t('insights.method.generic.typed', 'fr')).toBe('Méthode\u00a0: calculé à partir de valeurs par défaut, des caractéristiques vocales que vous avez indiquées et de la partition telle que chantée, reprises comprises.');
		expect(t('insights.method.generic.untyped', 'fr')).toBe('Méthode\u00a0: calculé à partir de valeurs par défaut et de la partition telle que chantée, reprises comprises.');
		expect(t('insights.method.typed', 'en')).toBe('Method: computed from your calibration of {date}, the voice characteristics you typed, and the score as sung, including repeats.');
		expect(t('insights.method.untyped', 'en')).toBe('Method: computed from your calibration of {date} and the score as sung, including repeats.');
		expect(t('insights.method.typed', 'fr')).toContain('reprises comprises.');
	});
	it('the broad note for a placeholder voice', () => {
		// RATIFIED by Dann 2026-11-19 12:01 (QUEUE row 167): the closing sentence no longer says "for your voice type".
		expect(t('analysis.broad.body.generic', 'en')).toBe('Broad analysis: this score is shown without {items}, because the matching voice characteristics were left blank. The forecast uses placeholder values.');
		expect(t('analysis.broad.body.generic', 'fr')).toBe('Analyse large\u00a0: cette partition est présentée sans {items}, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision repose sur des valeurs par défaut.');
	});
});

/* QUEUE row 167 (lane 71). The strings Dann ratified 2026-11-19 (`docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md`): the borrowing line and the three staff labels (09:43 English, 09:52
   French), the Guide passage (09:42, redrafted; French 09:52), `calib.pane.notSure` (11:59), and the Method strings, the broad note, the sheet's sources note, and the capture hint (12:01). Every
   French colon is preceded by U+00A0 and every apostrophe is U+2019. `sheet.provenance` and `capture.hint.placed.typed` are pinned in `voice/chart/ratified-strings.test.ts` with the rest of the
   sheet; the Method strings and the broad note are pinned in the row 166 block above, where they now read as 12:01 ruled them. */
describe('row 167: the borrowing strings (Dann 2026-11-19)', () => {
	it('the borrowing line, EN 09:43 and FR 09:52', () => {
		expect(t('placeholder.borrowing', 'en')).toBe('The field has not yet published resonance values for a {type}, so Ilya is using its {borrowed} values until you sample your own vowels in VOICE.');
		expect(t('placeholder.borrowing', 'fr')).toBe('La recherche n’a pas encore publié de valeurs de résonance pour un {type}. Ilya utilise donc ses valeurs de {borrowed} jusqu’à ce que vous échantillonniez vos propres voyelles dans VOIX.');
	});
	it('the three staff labels, EN 09:43 and FR 09:52', () => {
		expect([t('voiceType.staff.mezzo-soprano', 'en'), t('voiceType.staff.bass', 'en'), t('voiceType.staff.mezzo-tenor', 'en')]).toEqual(['mezzo-soprano', 'bass', 'mezzo and tenor']);
		expect([t('voiceType.staff.mezzo-soprano', 'fr'), t('voiceType.staff.bass', 'fr'), t('voiceType.staff.mezzo-tenor', 'fr')]).toEqual(['mezzo-soprano', 'basse', 'mezzo et ténor']);
	});
	it('the "Not sure" sentence of the VOICE pane, EN and FR (11:59), and the unused "typed, none" string with its ratified French', () => {
		expect(t('calib.pane.notSure', 'en')).toBe('Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya starts from published values for it.');
		expect(t('calib.pane.notSure', 'fr')).toBe('Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci.');
		expect(t('calib.pane.typedNone', 'en')).toBe('Ilya has no generic values for a {voiceType} voice yet, so it works from your own vowels. Record them to begin.');
		expect(t('calib.pane.typedNone', 'fr')).toBe('Ilya n\u2019a pas encore de valeurs par défaut pour une voix de {voiceType}; il travaille donc à partir de vos propres voyelles. Captez-les pour commencer.');
	});
	it('the six sentences ratified 2026-11-19 10:08 keep their words, and fill with the staff (the subtitle and the lede)', () => {
		expect(t('profile.subtitlePlaceholder', 'en')).toBe('Resonance profile: placeholder values for a generic {voiceType}, not yet your own resonances.');
		expect(t('insights.generic.lede', 'en')).toBe('These findings use placeholder values for a generic {voiceType}, not your specific voice.');
	});
});

describe('row 167: the Guide passage is seated whole, EN (09:42) and FR (09:52)', () => {
	const EN = 'When Ilya has not yet heard your voice, it starts from published resonance values for your voice type. For contralto, countertenor, and bass-baritone there are none. Nineteen sources were read in full, and none gives them. Ilya will not invent them. It borrows instead from the nearest voice it can defend, and says so on the page every time: mezzo-soprano for a contralto, bass for a bass-baritone, and the mezzo and tenor staff for a countertenor, because resonance follows the length of the tract rather than the range sung. If you have not named a type, Ilya starts from the middle of its five staves. These are working concessions, not findings. Every borrowed value is marked as a stand-in, every one is replaced the moment you sample that vowel yourself, and each will give way to measured values when peer-reviewed ones are published.';
	const FR = 'Tant qu’Ilya n’a pas entendu votre voix, il part des valeurs de résonance publiées pour votre type de voix. Pour le contralto, le contre-ténor et le baryton-basse, il n’en existe aucune. Dix-neuf sources ont été lues intégralement, et aucune ne les donne. Ilya ne les inventera pas. Il emprunte plutôt à la voix la plus proche qu’il puisse défendre, et le dit sur la page chaque fois : mezzo-soprano pour un contralto, basse pour un baryton-basse, et la portée mezzo et ténor pour un contre-ténor, car la résonance suit la longueur du tractus vocal plutôt que l’étendue chantée. Si vous n’avez indiqué aucun type, Ilya part du milieu de ses cinq portées. Ce sont des concessions de travail, et non des constats. Chaque valeur empruntée est signalée comme valeur par défaut, chacune est remplacée dès que vous échantillonnez vous-même la voyelle, et toutes céderont la place à des valeurs mesurées lorsque des valeurs évaluées par les pairs seront publiées.';
	const passage = (lang: 'en' | 'fr') => {
		const m = branches[lang].match(/<p id="guide-markup-stand-ins">([\s\S]*?)<\/p>/);
		return m ? m[1].replace(/<\/?em>/g, '') : '';
	};
	it('English: the passage, nothing struck, the sentence about the middle of the five staves included', () => {
		expect(passage('en')).toBe(EN);
		expect(passage('en')).toContain('If you have not named a type, Ilya starts from the middle of its five staves.');
	});
	it('French: the passage, nothing struck, with U+2019 apostrophes and U+00A0 before the colon', () => {
		expect(passage('fr')).toBe(FR);
		expect(passage('fr')).toContain('Si vous n’avez indiqué aucun type, Ilya part du milieu de ses cinq portées.');
		expect(passage('fr')).toContain('chaque fois\u00a0: mezzo-soprano');
	});
	it('carries its anchor in both languages, and the id is the one the link will point at', () => {
		expect(branches.en).toContain('id="guide-markup-stand-ins"');
		expect(branches.fr).toContain('id="guide-markup-stand-ins"');
	});
});


describe('ratified grace note and key signature lines (N.187, N.192; ratified by Dann on 2026-11-12 at 12:54)', () => {
	it('pins all 18 pairs, English as built and the ratified French, character for character, the apostrophes typographic', () => {
		const pairs: Record<string, { en: string; fr: string }> = {
			'loupe.grace': { en: "Grace note", fr: "Petite note" },
			'correct.graceAdd': { en: "Add a grace note before the note that follows", fr: "Ajouter une petite note avant la note qui suit" },
			'correct.graceMake': { en: "Make this a grace note", fr: "Transformer cette note en petite note" },
			'correct.graceFull': { en: "Make this a full note again", fr: "Redonner à cette note sa pleine valeur" },
			'loupe.graceSlash': { en: "Slash", fr: "Barre oblique" },
			'correct.graceSlash': { en: "Add or remove the slash on this grace note", fr: "Ajouter ou retirer la barre oblique de cette petite note" },
			'loupe.undo.graceAdded': { en: "grace note added", fr: "petite note ajoutée" },
			'loupe.undo.grace': { en: "grace note changed", fr: "petite note modifiée" },
			'loupe.undo.graceSlash': { en: "slash changed", fr: "barre oblique modifiée" },
			'loupe.keySignature': { en: "Key signature", fr: "Armure" },
			'correct.keyChange': { en: "Change the key from this bar", fr: "Changer l’armure à partir de cette mesure" },
			'correct.keyToNext': { en: "To the next key change", fr: "Jusqu’au prochain changement d’armure" },
			'correct.keyToEnd': { en: "To the end of the song", fr: "Jusqu’à la fin du chant" },
			'correct.keyFollow': { en: "The notes follow the new key", fr: "Les notes suivent la nouvelle armure" },
			'correct.keyFollowHelp': { en: "A note with no accidental of its own takes the new key’s sharp or flat. Turn this off to keep every pitch as it is.", fr: "Une note sans altération propre prend le dièse ou le bémol de la nouvelle armure. Désactivez cette option pour garder chaque hauteur telle quelle." },
			'correct.keyRemove': { en: "Remove this key change", fr: "Supprimer ce changement d’armure" },
			'loupe.undo.keyChanged': { en: "key changed", fr: "armure modifiée" },
			'loupe.undo.keyRemoved': { en: "key change removed", fr: "changement d’armure supprimé" },
		};
		expect(Object.keys(pairs)).toHaveLength(18);
		for (const [key, v] of Object.entries(pairs)) {
			expect(t(key, 'en'), key).toBe(v.en);
			expect(t(key, 'fr'), key).toBe(v.fr);
		}
	});
	it('no French string of the block carries a straight apostrophe', () => {
		for (const key of ['correct.keyChange', 'correct.keyToNext', 'correct.keyToEnd', 'correct.keyRemove', 'loupe.undo.keyRemoved']) expect(t(key, 'fr')).not.toContain("'");
	});
});

describe('ratified strophic verse strings (strophic lane A, 2026-11-12 12:58)', () => {
	it('the label above a later pass, in both languages', () => {
		expect(t('markup.verseLabel', 'en').replace('%s', '2')).toBe('Verse 2');
		expect(t('markup.verseLabel', 'fr').replace('%s', '2')).toBe('Couplet 2');
	});
	it('the tag on the bar number, in both languages: the full word, a middle dot between spaces', () => {
		expect(t('markup.verseTag', 'en').replace('%m', '12').replace('%v', '2')).toBe('12 \u00b7 verse 2');
		expect(t('markup.verseTag', 'fr').replace('%m', '12').replace('%v', '2')).toBe('12 \u00b7 couplet 2');
	});
});

/* N.202 Step 4: the GUIDE's two entries, RATIFIED by Dann 2026-11-15 14:18 in both languages, as drafted
   (`docs/memory/OPEN.md`, N.202, "THE GUIDE'S TWO ENTRIES"). The words are typed here from that entry, not read back
   out of the Guide. The version, the year, and the build are placeholders in the markup and come from `lib/version.ts`;
   no year is typed in the entries. U+2019 apostrophes, U+00A0 before each French colon. */
describe('N.202: the Guide says which Ilya this is, and how to cite it', () => {
	const NB = '\u00a0';
	const pins: Array<['en' | 'fr', string]> = [
		['en', '<h4 id="guide-version">Which Ilya is this?</h4>'],
		['en', '<p>This is <em>Ilya</em> {ILYA_VERSION}. The letter advances with each public release. The footer of every page you print carries the same name, so a page can be traced to the release that made it. If you report a problem, include the build as well: {ILYA_BUILD}.</p>'],
		['en', '<h4 id="guide-cite">How do I cite Ilya?</h4>'],
		['en', '<p>Name the release that the footer of your page prints: Mitton, Dann. <em>Ilya</em> {ILYA_VERSION}. {ILYA_VERSION_YEAR}. https://ilya.dannmitton.com.</p>'],
		['fr', '<h4 id="guide-version">De quelle version d’Ilya s’agit-il?</h4>'],
		['fr', `<p>Vous utilisez <em>Ilya</em> {ILYA_VERSION}. La lettre avance à chaque nouvelle version publique. Le pied de chaque page que vous imprimez porte le même nom${NB}: une page peut ainsi être rattachée à la version qui l’a produite. Si vous signalez un problème, indiquez aussi la compilation${NB}: {ILYA_BUILD}.</p>`],
		['fr', '<h4 id="guide-cite">Comment citer Ilya?</h4>'],
		['fr', `<p>Nommez la version qu’imprime le pied de votre page${NB}: MITTON, Dann. <em>Ilya</em> {ILYA_VERSION}, {ILYA_VERSION_YEAR}. https://ilya.dannmitton.com.</p>`],
	];
	for (const [lang, text] of pins) {
		it(`${lang}: ${text.slice(0, 48)}…`, () => {
			expect(branches[lang]).toContain(text);
		});
	}
	it('seats both entries directly after the future entry and before the forecast, in both languages', () => {
		for (const lang of ['en', 'fr'] as const) {
			const b = branches[lang];
			const order = ['id="guide-future"', 'id="guide-version"', 'id="guide-cite"', 'id="guide-markup-forecast"'].map((k) => b.indexOf(k));
			expect(order.every((i) => i > 0), lang).toBe(true);
			expect([...order].sort((a, c) => a - c), lang).toEqual(order);
		}
	});
	it('reads the version, the year, and the build from the one module, and types none of them', () => {
		expect(guideSource).toContain("import { ILYA_VERSION, ILYA_BUILD, ILYA_VERSION_YEAR } from '$lib/version';");
		for (const lang of ['en', 'fr'] as const) {
			const entries = branches[lang].slice(branches[lang].indexOf('id="guide-version"'), branches[lang].indexOf('<!-- The forecast philosophy'));
			expect(entries, lang).not.toMatch(/(?<![A-Za-z0-9])20\d\d/);
		}
	});
	it('the French half holds no {:else} of its own, because three tests cut it at the first one', () => {
		expect(guideSource.slice(guideFrStart, guideFrEnd)).not.toContain('{:else}');
	});
});
