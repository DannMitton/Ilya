/**
 * ratified-strings.test.ts: the calibration screen's and the sheet's strings, ratified by Dann 2026-11-13 (`OPEN.md` section N.199: 01:05, 10:30 to
 * 10:50, 11:52, 12:01), pinned character for character in both languages, as `insights/ratified-lines.test.ts` pins its own. The French has U+2019
 * apostrophes and U+00A0 before « : ». These are literals, not read from `i18n.ts`, so a change to a ratified line fails here and is a decision, not
 * an accident; ratification is approval at that moment, never fossilization (`CONTRACT.md` section 1, 11a), and the desk changes the text and its pin
 * together. The English changed after brief r5 in `OPEN.md` only: `capture.hide` and `capture.hidden` say "the readout"; `sheet.legend.hull` says
 * "surrounds"; `sheet.legend.zones` is the 12:01 text; `sheet.provenance` is corrected. The English here has house typography (U+2019 apostrophes, curly
 * double quotes), where `OPEN.md` writes them straight.
 *
 * `capture.hint.toGo` takes a digit in both languages (Dann 11:52): "7 to go, in any order." « Il en reste 7, dans l’ordre de votre choix. »
 */
import { describe, expect, it } from 'vitest';
import { hasString, stringKeys, t, tv } from '$lib/i18n';

const RATIFIED: Array<[string, string, string]> = [
	['sheet.title', 'Your vowel space', 'Votre espace vocalique'],
	['sheet.subtitle', 'The ten vowels of sung Russian, as your voice shapes them', 'Les dix voyelles du russe chanté, telles que votre voix les façonne'],
	['sheet.readings', 'Your readings', 'Vos lectures'],
	['sheet.col.vowel', 'Vowel', 'Voyelle'],
	['sheet.col.fr1', 'Hz and note', 'Hz et note'],
	['sheet.col.fr2', 'Hz and note', 'Hz et note'],
	['sheet.legend.sung', 'A vowel you sang, measured in vocal fry.', 'Une voyelle que vous avez chantée, mesurée en friture vocale.'],
	['sheet.legend.placeholder', 'A placeholder: where Ilya expects a vowel you have not sung yet.', 'Une valeur par défaut : là où Ilya attend une voyelle que vous n’avez pas encore chantée.'],
	['sheet.legend.zones', 'Each colour is the neighbourhood Ilya draws on for one of the outer vowels, for a voice of your type. Lavender marks the inner vowels, which Ilya can work out from the outer ones if you choose not to offer samples yourself. Where zones cross, the colours blend.', 'Chaque couleur est le voisinage sur lequel Ilya s’appuie pour l’une des voyelles extérieures, pour une voix de votre type. Le lavande marque les voyelles intérieures, qu’Ilya peut déduire des voyelles extérieures si vous choisissez de ne pas fournir vous-même d’échantillons. Là où les zones se croisent, les couleurs se fondent.'],
	['sheet.legend.hull', 'The outline surrounds your sung vowels. It is dashed until all ten are sung.', 'Le contour entoure vos voyelles chantées. Il reste en pointillé jusqu’à ce que les dix soient chantées.'],
	['sheet.axis.front', 'tongue forward', 'langue avancée'],
	['sheet.axis.back', 'tongue back', 'langue reculée'],
	['sheet.axis.open', 'mouth more open', 'bouche plus ouverte'],
	['sheet.provenance', 'Zones along the first resonance: Bozeman, *Kinesthetic Voice Pedagogy*, 2nd ed. (2021), Figs. 8 to 10; for baritones, Bozeman, “Levels of Acoustic Registration” (kenbozeman.com). The second resonance’s range: Bozeman, *Practical Vocal Acoustics*, 2nd ed. (2025), p. 35. Placeholder values: the centre of each zone for the first resonance, and Mitton (2020), Table 5.3, scaled to your voice type, for the second. Each zone’s width along the second resonance is Ilya’s own estimate.', 'Zones le long de la première résonance : Bozeman, *Kinesthetic Voice Pedagogy*, 2e éd. (2021), fig. 8 à 10; pour les barytons, Bozeman, “Levels of Acoustic Registration” (kenbozeman.com). Étendue de la deuxième résonance : Bozeman, *Practical Vocal Acoustics*, 2e éd. (2025), p. 35. Valeurs par défaut : le centre de chaque zone pour la première résonance, et Mitton (2020), tableau 5.3, ajusté à votre type de voix, pour la deuxième. La largeur de chaque zone le long de la deuxième résonance est une estimation d’Ilya.'],
	['capture.title', 'Your resonances', 'Vos résonances'],
	['capture.count', '{n} of 10', '{n} sur 10'],
	['capture.explain', 'Each dot is one of your vowels: the higher your tongue, the higher the dot; the further forward, the nearer the front edge.', 'Chaque point est l’une de vos voyelles : plus votre langue est haute, plus le point est haut; plus elle est avancée, plus il s’approche du bord avant.'],
	['capture.cue.ready', 'Ready for {v}.', 'Au tour de {v}.'],
	['capture.cue.isCaptured', '{v} is captured.', 'Capture de {v} effectuée.'],
	['capture.cue.allTen', 'All ten captured. This is your vowel space.', 'Les dix voyelles sont captées. Voici votre espace vocalique.'],
	['capture.start', 'Start {v}', 'Commencer {v}'],
	['capture.retake', 'Re-take {v}', 'Reprendre {v}'],
	['capture.inProgress', '{v} in progress', '{v} en cours'],
	['capture.done', 'Done', 'Terminé'],
	['capture.stop', 'Stop', 'Arrêter'],
	['capture.clearAll', 'Clear all', 'Tout effacer'],
	['capture.hide', 'Hide the chart and the readout while I sing', 'Masquer le graphique et l’affichage pendant que je chante'],
	['capture.hidden', 'The chart and the readout are hidden while you sing. They return when this vowel is captured.', 'Le graphique et l’affichage sont masqués pendant que vous chantez. Ils réapparaissent quand cette voyelle est captée.'],
	['capture.hint.first', 'Start follows Ilya’s order. Or tap any vowel to sing that one now.', 'Commencer suit l’ordre d’Ilya. Ou touchez une voyelle pour la chanter tout de suite.'],
	['capture.hint.active', 'Stop, or a second tap on {v}, ends this take. Nothing is saved from it.', 'Touchez {v} de nouveau, ou Arrêter, pour mettre fin à cette prise. Rien n’en est conservé.'],
	['capture.hint.retake', 'A re-take replaces {v} only if the new reading is as clear.', 'Une reprise ne remplace {v} que si la nouvelle lecture est aussi nette.'],
	['capture.hint.placed.typed', 'Ilya has placed {v} from your voice type for now. Its placeholder moves as you sing.', 'Ilya a placé {v} d’après votre type de voix, pour l’instant. Sa valeur par défaut évolue à mesure que vous chantez.'],
	['capture.hint.placed.untyped', 'Ilya has placed {v} from typical voices for now. Its placeholder moves as you sing.', 'Ilya a placé {v} d’après des voix typiques, pour l’instant. Sa valeur par défaut évolue à mesure que vous chantez.'],
	['capture.hint.toGo', '{count} to go, in any order. Ilya keeps a placeholder for each until you sing it.', 'Il en reste {count}, dans l’ordre de votre choix. Ilya garde une valeur par défaut pour chaque voyelle jusqu’à ce que vous la chantiez.'],
	['capture.hint.finished', 'Tap any vowel to sing it again.', 'Touchez une voyelle pour la chanter de nouveau.'],
	['capture.hint.confirmClear', 'Tap Clear all to clear every reading for this voice.', 'Touchez Tout effacer pour effacer toutes les lectures de cette voix.'],
	['capture.uncertain', '{v} is noted, though this take was less clear. A re-take can replace it.', '{v} est noté, même si cette prise était moins nette. Une reprise peut le remplacer.'],
	['capture.button.sung', 'sung', 'chantée'],
	['capture.button.placed', 'placeholder', 'valeur par défaut'],
	['capture.button.selected', 'selected', 'sélectionnée'],
	['capture.bar', 'Progress of this take', 'Progression de cette prise'],
	['capture.chartAlt', 'Chart of the vowel zones. It moves in on the vowel being measured, and a dot shows the reading.', 'Graphique des zones des voyelles. Il se rapproche de la voyelle mesurée, et un point en montre la lecture.'],
	['capture.drawingAlt', 'Side view of the mouth and throat for {name}', 'Vue de profil de la bouche et de la gorge pour {name}'],
	['capture.vowels', 'The ten vowels', 'Les dix voyelles'],
	['sheet.print', 'Print this sheet', 'Imprimer cette feuille'],
	['sheet.chartAlt', 'Chart of your vowel space. Each vowel is a coloured zone, a filled dot where you sang it, or a hollow dot where Ilya has placed it for now.', 'Graphique de votre espace vocalique. Chaque voyelle est une zone colorée, un point plein là où vous l’avez chantée, ou un point creux là où Ilya l’a placée pour l’instant.'],
];

describe('the ratified calibration and sheet strings', () => {
	it('pins all forty-six, in both languages', () => {
		expect(RATIFIED).toHaveLength(46);
		for (const [key, en, fr] of RATIFIED) {
			expect(t(key, 'en'), `${key} en`).toBe(en);
			expect(t(key, 'fr'), `${key} fr`).toBe(fr);
		}
	});

	it('is every key under capture. and sheet., and no other', () => {
		const live = stringKeys().filter((k) => k.startsWith('capture.') || k.startsWith('sheet.')).sort();
		expect(live).toEqual(RATIFIED.map((r) => r[0]).sort());
	});

	it('pins the pause line (EN 2026-11-13 01:05, FR 10:30)', () => {
		expect(t('pacifier.pause', 'en')).toBe('Stop singing, but maintain the shape of your vocal tract for that vowel.');
		expect(t('pacifier.pause', 'fr')).toBe('Arrêtez de chanter, mais gardez la forme de votre conduit vocal pour cette voyelle.');
	});

	it('fills its placeholders with `tv` and leaves an unfilled one showing', () => {
		expect(tv('capture.hint.toGo', 'en', { count: 7 })).toBe('7 to go, in any order. Ilya keeps a placeholder for each until you sing it.');
		expect(tv('capture.hint.toGo', 'fr', { count: 7 })).toBe('Il en reste 7, dans l’ordre de votre choix. Ilya garde une valeur par défaut pour chaque voyelle jusqu’à ce que vous la chantiez.');
		expect(tv('capture.count', 'fr', { n: 3 })).toBe('3 sur 10');
		expect(tv('capture.start', 'en', { v: '[ɨ]' })).toBe('Start [ɨ]');
		expect(tv('capture.drawingAlt', 'en', { name: 'velar-i' })).toBe('Side view of the mouth and throat for velar-i');
		expect(tv('capture.start', 'en')).toBe('Start {v}');
	});

	it('follows the copy rules in both languages: no em dash, no "goal", "target", or "held", Canadian spelling', () => {
		for (const [key, en, fr] of RATIFIED) {
			for (const [lang, s] of [['en', en], ['fr', fr]] as const) {
				expect(s, `${key} ${lang}`).not.toContain('\u2014');
				expect(s.toLowerCase(), `${key} ${lang}`).not.toMatch(/\bgoals?\b|\btargets?\b|\bheld\b/);
			}
			expect(en, key).not.toMatch(/neighborhood|\bcolor\b|\bcenter\b/);
		}
	});

	it('writes French with U+2019 apostrophes and U+00A0 before every colon, and leaves nothing missing', () => {
		for (const [key, , fr] of RATIFIED) {
			expect(fr, key).not.toContain("'");
			expect(fr, key).not.toMatch(/[^\u00a0]:/);
			expect(hasString(key, 'fr'), key).toBe(true);
		}
	});
});
