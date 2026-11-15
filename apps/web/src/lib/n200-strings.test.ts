/**
 * N.200 Step 7: the ratified strings and sources that ride with the extractor change, pinned character for character. Each pair was
 * copied from `docs/memory/OPEN.md` (the line is named at each test) by a script, not typed. Ratification is approval at a moment
 * (CONTRACT 11a): when Dann changes one, change it here in the same breath.
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { t } from './i18n';

const guide = readFileSync(new URL('./components/Reading/GuideContent.svelte', import.meta.url), 'utf8');

describe('the four "Resonance profile" strings (OPEN.md line 3791, ratified 2026-11-14 21:22)', () => {
	it('say "resonance profile" and « profil de résonances », and nothing else changed', () => {
		expect(t('calib.welcome.lede', 'en')).toContain('to build a resonance profile, which is a map of your voice\'s resonances');
		expect(t('calib.welcome.lede', 'fr')).toContain('afin de constituer un profil de résonances, c\u2019est-à-dire une carte des résonances de votre voix');
		expect(t('profile.subtitleNamed', 'en')).toBe('Resonance profile: a map of {voice}\u2019s resonances');
		expect(t('profile.subtitleNamed', 'fr')).toBe('Profil de résonances\u00a0: une carte des résonances de la voix \u00ab\u00a0{voice}\u00a0\u00bb');
		expect(t('profile.subtitleYours', 'en')).toBe('Resonance profile: a map of your voice\u2019s resonances');
		expect(t('profile.subtitleYours', 'fr')).toBe('Profil de résonances\u00a0: une carte des résonances de votre voix');
		expect(t('profile.subtitlePlaceholder', 'en')).toBe('Resonance profile: placeholder values for a generic {voiceType}, not yet your own resonances.');
		expect(t('profile.subtitlePlaceholder', 'fr')).toBe('Profil de résonances\u00a0: valeurs par défaut pour une voix type de {voiceType}, pas encore vos propres résonances.');
	});
	it('leaves no "formant profile" in any of the four', () => {
		for (const k of ['calib.welcome.lede', 'profile.subtitleNamed', 'profile.subtitleYours', 'profile.subtitlePlaceholder'] as const)
			for (const l of ['en', 'fr'] as const) expect(t(k, l)).not.toMatch(/formant profile|profil de formants/i);
	});
});

describe('« Reprendre » for the summary\'s re-take (OPEN.md line 3796, ruled 2026-11-14 21:28)', () => {
	it('is the key\'s French, and « Réessayer » stays on tryAgain', () => {
		expect(t('calib.common.retake', 'en')).toBe('Re-take');
		expect(t('calib.common.retake', 'fr')).toBe('Reprendre');
		expect(t('calib.roster.tryAgain', 'fr')).toBe('Réessayer');
	});
});

describe('the fRn and Fn sentence in the Guide (OPEN.md line 3792, ratified 2026-11-14 21:26)', () => {
	const EN = "Strictly, the values Ilya reads from fry are formants (<em>F</em><sub>1</sub>, <em>F</em><sub>2</sub>), the peaks that your vocal tract imprints in the sound, that trace your resonances (<em>f</em><sub>R1</sub>, <em>f</em><sub>R2</sub>). Ilya follows most singing voice literature in treating the two as functionally equivalent (Titze, Maxfield, and Walker 2017; Bozeman 2013, p. 11, n. 7).";
	const FR = "À strictement parler, les valeurs qu’<em>Ilya</em> lit dans la friture vocale sont des formants (<em>F</em><sub>1</sub>, <em>F</em><sub>2</sub>), les pics que votre conduit vocal imprime dans le son, et qui retracent vos résonances (<em>f</em><sub>R1</sub>, <em>f</em><sub>R2</sub>). Comme la plupart des écrits sur la voix chantée, <em>Ilya</em> traite les deux comme fonctionnellement équivalents (Titze, Maxfield et Walker 2017; Bozeman 2013, p. 11, n. 7).";
	it('stands in English and in French, after the first sentence of "What Insights forecasts"', () => {
		expect(guide).toContain('where the range gets demanding. ' + EN + ' Your voice may align');
		expect(guide).toContain('où l’ambitus devient exigeant. ' + FR + ' Votre voix');
	});
	it('sets F and f in italics with upright subscripts, and « qu’Ilya » with U+2019', () => {
		for (const s of [EN, FR]) {
			expect(s).toContain('<em>F</em><sub>1</sub>');
			expect(s).toContain('<em>f</em><sub>R2</sub>');
		}
		expect(FR).toContain('qu\u2019<em>Ilya</em>');
		expect(FR).not.toContain("qu'");
	});
});

describe('the far-off [ɨ] message (OPEN.md line 3800, ratified 2026-11-13 15:29)', () => {
	it('is seated in both languages under calib.summary.outsideIgh', () => {
		expect(t('calib.summary.outsideIgh', 'en')).toBe("Your current [ɨ] sits away from where your [i] and [u] would likely place it. For now, Ilya has an estimate ready, built from your own [i] and [u], so you can carry on. You can offer new vowel samples anytime.");
		expect(t('calib.summary.outsideIgh', 'fr')).toBe("Votre [ɨ] actuel ne se trouve pas tout à fait là où vos [i] et [u] le placeraient probablement. Pour l’instant, Ilya a une estimation prête, calculée à partir de vos propres [i] et [u] : vous pouvez donc continuer. Vous pouvez fournir de nouveaux échantillons de voyelles à tout moment.");
	});
});
