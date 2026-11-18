/**
 * Lane 68: the strings of the brief's section 5, RATIFIED by Dann 2026-11-18 13:53 to 14:00, pinned character for character, English and French.
 * French: U+00A0 before each colon (OQLF) and the typographic apostrophe, as the table writes them.
 */
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

const A = '\u2019';
const NB = '\u00a0';
const INS_EN = (more: string, dash: string) => `To complete your personal vowel space, Ilya needs you to sample at least 5 of these 6 core vowels: [i], [e], [\u025b], [\u0251], [o], and [u]. You have sampled {n} so far ({vowels}). Until you provide ${more} more, unsampled vowels are assigned placeholder values. Findings that rest on a placeholder are drawn ${dash}. You can add new fry samples anytime through the DRAWER on the left.`;
const INS_FR = (more: string, dash: string) => `Pour compl\u00e9ter votre espace vocalique personnel, Ilya a besoin que vous \u00e9chantillonniez au moins 5 de ces 6 voyelles de base${NB}: [i], [e], [\u025b], [\u0251], [o] et [u]. Vous en avez \u00e9chantillonn\u00e9 {n} jusqu${A}ici ({vowels}). D${A}ici \u00e0 ce que vous en fournissiez ${more} de plus, les voyelles non \u00e9chantillonn\u00e9es re\u00e7oivent des valeurs par d\u00e9faut. Les constats qui en d\u00e9pendent sont trac\u00e9s ${dash}. Vous pouvez ajouter de nouveaux \u00e9chantillons en friture vocale \u00e0 tout moment depuis le TIROIR de gauche.`;
const PANE_EN = (more: string) => `You have sampled {n} of the 6 core vowels so far ({vowels}). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide ${more} more, unsampled vowels are assigned placeholder values.`;
const PANE_FR = (more: string) => `Vous avez \u00e9chantillonn\u00e9 {n} des 6 voyelles de base jusqu${A}ici ({vowels}). Pour compl\u00e9ter votre espace vocalique personnel, Ilya a besoin d${A}au moins 5 \u00e9chantillons stables en friture vocale. D${A}ici \u00e0 ce que vous en fournissiez ${more} de plus, les voyelles non \u00e9chantillonn\u00e9es re\u00e7oivent des valeurs par d\u00e9faut.`;

const PINS: [string, string, string][] = [
	['placeholder.line.belowCore', INS_EN('{m}', 'dashed'), INS_FR('{m}', 'en pointill\u00e9')],
	['placeholder.line.belowCoreOne', INS_EN('1', 'dashed'), INS_FR('une', 'en pointill\u00e9')],
	['placeholder.line.markup.belowCore', INS_EN('{m}', 'hollow or dashed'), INS_FR('{m}', '\u00e9vid\u00e9s ou en pointill\u00e9')],
	['placeholder.line.markup.belowCoreOne', INS_EN('1', 'hollow or dashed'), INS_FR('une', '\u00e9vid\u00e9s ou en pointill\u00e9')],
	['calib.pane.belowCore', PANE_EN('{m}'), PANE_FR('{m}')],
	['calib.pane.belowCoreOne', PANE_EN('1'), PANE_FR('une')],
	['calib.summary.unstableOne', 'This reading was unstable: {vowels}. Another try may help.', `Cette lecture \u00e9tait instable${NB}: {vowels}. Une reprise pourrait aider.`]
];

describe('the ratified strings of lane 68', () => {
	for (const [key, en, fr] of PINS) {
		it(key, () => {
			expect(t(key, 'en')).toBe(en);
			expect(t(key, 'fr')).toBe(fr);
		});
	}
});
