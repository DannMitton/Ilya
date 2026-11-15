/**
 * THE WELCOME SHEET'S STRINGS, pinned character for character (lane `cloud-lane-57`, brief r2 item 4). Ratified by Dann 2026-11-15 01:30 (English and
 * design) and 01:38 (French): `docs/memory/OPEN.md`, "THE WELCOME SHEET, EN AND FR, RATIFIED". Each pair below was taken by a script from the two
 * prototypes he ratified (`docs/sessions/welcome-sheet/ilya-welcome-draft-17.html` and `-17-fr.html`), not typed. Ratification is approval at a moment
 * (CONTRACT 11a): when Dann changes one, change it here in the same breath.
 *
 * THE ENGLISH LICENCE LINE IS NOT THE PROTOTYPE'S. Ruled by Dann 2026-11-15 13:20: it carries the copyright as the French line does, and is the first two
 * sentences of the GUIDE's ratified English paragraph (`GuideContent.svelte:579`) with both "Ilya" in italics and the prototype's no-break space before the 3. It supersedes
 * the OPEN.md bullet that says to copy the licence line from the prototype, for English only. The French line is still the prototype's.
 *
 * The only other difference from the prototype's markup is one attribute: each link opens in a new tab (`target="_blank" rel="noopener"`), as
 * `footer.attribution`'s do, so a singer who follows one does not leave the sheet. The words, the tags, and the entities are the prototype's.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { stringKeys, t } from './i18n';

const PAIRS: ReadonlyArray<readonly [string, string, string]> = [
	['welcome.band', "WELCOME", "BIENVENUE"],
	['welcome.title', "Sung Russian made easier.", "Le russe chanté, simplifié."],
	['welcome.lead', "<em>Ilya</em> can make mistakes.", "<em>Ilya</em> peut se tromper."],
	['welcome.body', "<em>Ilya</em> bundles a live IPA transcription engine, an onboard Russian dictionary with English and French glosses, optical music recognition (OMR) that reads scores by machine, and an acoustic module that estimates your resonances using the microphone in your own device. Any of these steps can go wrong. So treat what <em>Ilya</em> shares as an early consultation within a much longer process of studying your song or aria, and <strong>confirm anything <em>Ilya</em> tells you with your teacher or coach before you rely on it.</strong>", "<em>Ilya</em> réunit un moteur de transcription en API en direct, un dictionnaire russe intégré avec des gloses anglaises et françaises, une reconnaissance optique de la musique qui lit les partitions par machine, et un module acoustique qui estime vos résonances au moyen du microphone de votre propre appareil. Chacune de ces étapes peut faillir. Considérez donc ce qu’<em>Ilya</em> vous présente comme une première consultation dans un processus bien plus long d’étude de votre chant ou de votre air, et <strong>vérifiez tout ce qu’<em>Ilya</em> vous indique auprès de votre professeure ou professeur de chant, ou de votre coach, avant de vous y fier.</strong>"],
	['welcome.method', "The method is Craig Grayson’s: <a target=\"_blank\" rel=\"noopener\" href=\"https://hdl.handle.net/1773/20548\"><em>Russian Lyric Diction</em></a> (University of Washington, 2012).", "La méthode est celle de Craig Grayson : <a target=\"_blank\" rel=\"noopener\" href=\"https://hdl.handle.net/1773/20548\"><em>Russian Lyric Diction</em></a> (University of Washington, 2012)."],
	['welcome.maker', "Made by Dann Mitton, voice teacher and researcher, <a target=\"_blank\" rel=\"noopener\" href=\"https://dannmitton.com\">dannmitton.com</a>. His doctoral research, <a target=\"_blank\" rel=\"noopener\" href=\"https://hdl.handle.net/1807/100864\"><em>Sung Russian for the Low Male Voice Classical Singer</em></a> (University of Toronto, 2020), is the argument behind <em>Ilya</em>; <a target=\"_blank\" rel=\"noopener\" href=\"https://ilya.dannmitton.com\">ilya.dannmitton.com</a> is its home.", "Créé par Dann Mitton, professeur de chant et chercheur, <a target=\"_blank\" rel=\"noopener\" href=\"https://dannmitton.com\">dannmitton.com</a>. Ses recherches doctorales, <a target=\"_blank\" rel=\"noopener\" href=\"https://hdl.handle.net/1807/100864\"><em>Sung Russian for the Low Male Voice Classical Singer</em></a> (University of Toronto, 2020), en fournissent l’argumentaire; <em>Ilya</em> vit à <a target=\"_blank\" rel=\"noopener\" href=\"https://ilya.dannmitton.com\">ilya.dannmitton.com</a>."],
	['welcome.madeIn', "Made with love in Canada, in English and French", "Fait avec cœur au Canada, en anglais et en français"],
	['welcome.licence', "<em>Ilya</em> is free and open source, © 2026 Dann Mitton, and released under the GNU Affero General Public License, version\u00a03. The name <em>Ilya</em> and its icon are not licensed under it.", "<em>Ilya</em> est gratuit et à code ouvert, © 2026 Dann Mitton, et publié selon les termes de la licence publique générale GNU Affero, version 3. Le nom <em>Ilya</em> et son icône ne sont pas visés par cette licence."],
];

describe('the welcome sheet strings (OPEN.md, "THE WELCOME SHEET, EN AND FR, RATIFIED")', () => {
	for (const [key, en, fr] of PAIRS) {
		it(`${key} says what Dann ratified, in both languages`, () => {
			expect(t(key, 'en')).toBe(en);
			expect(t(key, 'fr')).toBe(fr);
		});
	}

	it('holds exactly these eight keys under `welcome.`, and Begin is the calibration wizard\'s existing key', () => {
		expect(stringKeys().filter((k) => k.startsWith('welcome.')).sort()).toEqual(PAIRS.map((p) => p[0]).sort());
		expect(t('calib.welcome.beginButton', 'en')).toBe('Begin');
		expect(t('calib.welcome.beginButton', 'fr')).toBe('Commencer');
	});

	it('reuses the three station labels the tabs carry', () => {
		expect([t('tab.text', 'en'), t('tab.markedScore', 'en'), t('tab.insights', 'en')]).toEqual(['TEXT', 'MELODY', 'INSIGHTS']);
		expect([t('tab.text', 'fr'), t('tab.markedScore', 'fr'), t('tab.insights', 'fr')]).toEqual(['TEXTE', 'CHANT', 'APERÇUS']);
	});

	it('carries the copyright in both languages: the English is the GUIDE\'s opening (Dann 2026-11-15 13:20), the French is the prototype\'s', () => {
		expect(t('welcome.licence', 'en')).toContain('\u00a9 2026 Dann Mitton');
		expect(t('welcome.licence', 'fr')).toContain('\u00a9 2026 Dann Mitton');
		expect(t('welcome.licence', 'en').startsWith('<em>Ilya</em> is free and open source, ')).toBe(true);
		expect(t('welcome.licence', 'en').match(/<em>Ilya<\/em>/g)).toHaveLength(2);
		expect(t('welcome.licence', 'en')).toContain('version\u00a03.');
	});

	it('the English licence line is the first two sentences of the GUIDE\'s English paragraph, character for character, but for the no-break space before the 3', () => {
		const guide = readFileSync(new URL('./components/Reading/GuideContent.svelte', import.meta.url), 'utf8');
		const para = guide.match(/<p>(<em>Ilya<\/em> is free and open source, [^<]*(?:<em>Ilya<\/em>[^<]*)+)<\/p>/)![1];
		const twoSentences = para.slice(0, para.indexOf(' It stands on the generosity'));
		expect(twoSentences).toContain('version 3. The name');
		expect(t('welcome.licence', 'en')).toBe(twoSentences.replace('version 3.', 'version\u00a03.'));
	});
});

describe('the welcome strings are copied from the two ratified prototypes', () => {
	const decode = (s: string) =>
		s
			.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
			.replace(/<a href=/g, '<a target="_blank" rel="noopener" href=');
	const read = (name: string) => readFileSync(new URL(`../../../../docs/sessions/welcome-sheet/${name}`, import.meta.url), 'utf8').replace(/base64,[A-Za-z0-9+/=]{200,}/g, 'base64,');
	for (const [lang, file] of [['en', 'ilya-welcome-draft-17.html'], ['fr', 'ilya-welcome-draft-17-fr.html']] as const) {
		it(`${lang}: every string (the English licence line excepted) is in ${file}`, () => {
			const html = read(file);
			const licence = decode(html.match(/<p class="fine">\s*([^<]*(?:<em>Ilya<\/em>[^<]*)+)<\/p><\/div>\s*<button/)![1]).trim();
			// The English licence line was changed by Dann's ruling of 2026-11-15 13:20 and is no longer the prototype's; the French one is.
			if (lang === 'fr') expect(t('welcome.licence', lang)).toBe(licence);
			for (const [key, en, fr] of PAIRS) {
				if (key === 'welcome.licence' && lang === 'en') continue;
				const want = lang === 'en' ? en : fr;
				const raw = want.replace(/<a target="_blank" rel="noopener" href=/g, '<a href=');
				const plain = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
				expect(plain(html), key).toContain(raw);
			}
		});
	}
});
