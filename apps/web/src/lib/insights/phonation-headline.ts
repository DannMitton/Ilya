/**
 * phonation-headline.ts — the sentence that opens the phonation section.
 *
 * MOVED OUT OF `InsightsPane.svelte` (`headlineOf`) by row 48, 2026-10-15, so
 * its branches can be tested as a pure function, and because the pane is near
 * its size ceiling. Four sentences, by where the tempo came from:
 *
 *   encoded    `headline`            a printed metronome mark, one figure
 *   inferred   `headlineInferred`    a printed tempo WORD, a range
 *   user       `headlineYours`       the singer's own tempo, one figure
 *   estimated  `estimatedMetre`      no tempo printed; Ilya's band from the
 *              `estimatedWalking`    metre, or from a walking pace where the
 *                                    score states no metre either
 *
 * THE "NO TEMPO" BRANCH IS GONE. `resolveTempo` no longer abstains (row 48),
 * so `timing` is never `'none'`; `insights.phonation.noTempo` stays in
 * `i18n.ts`, dated, and is drawn by nothing (Dann, 2026-10-14: "We must not
 * declare indefensible statements with confidence"). No interim line of any
 * kind stands in its place (Dann, 2026-10-14 23:31).
 *
 * `{beat}` is the metronome note in the notation face (`beat-glyph.ts`); the
 * page sets the private-use characters in Finale Maestro (`richParts`).
 */
import type { Language } from '$lib/i18n';
import { beatGlyph } from '$lib/tempo/beat-glyph';
import type { PhonationSection } from './insights';

export interface HeadlineDeps {
	language: Language;
	/** A string from the table, in the language in force. */
	T: (key: string) => string;
	fill: (s: string, vars: Record<string, string | number>) => string;
	formatSeconds: (seconds: number) => string;
	/** `♩ = 72` as text, for the printed-mark sentences. */
	formatTempo: (tempo: NonNullable<PhonationSection['tempo']>, language: Language) => string;
}

/** The sentence, or the empty string where there is nothing to say (nothing sung, no price). */
export function phonationHeadline(ph: PhonationSection, d: HeadlineDeps): string {
	const { T, fill, formatSeconds } = d;
	if (!ph.phonation || !ph.tempo) return '';
	const tempo = ph.tempo;
	const number = (n: number) => new Intl.NumberFormat(d.language === 'fr' ? 'fr-CA' : 'en-CA', { maximumFractionDigits: 1 }).format(n);

	if (ph.phonation.kind === 'range') {
		if (tempo.provenance === 'estimated') {
			const [low, high] = tempo.range ?? [tempo.bpm, tempo.bpm];
			const metre = tempo.estimateMetre;
			return fill(T(metre ? 'insights.phonation.estimatedMetre' : 'insights.phonation.estimatedWalking'), {
				beat: beatGlyph(tempo.beatUnit, tempo.beatUnitDots),
				low: number(low),
				high: number(high),
				metre: metre ? `${metre.beats}/${metre.beatType}` : '',
				t1: formatSeconds(ph.phonation.low),
				t2: formatSeconds(ph.phonation.high),
			});
		}
		return fill(T('insights.phonation.headlineInferred'), {
			low: formatSeconds(ph.phonation.low),
			high: formatSeconds(ph.phonation.high),
			tempoWord: tempo.printedText ?? tempo.term ?? '',
		});
	}
	if (tempo.provenance === 'user') {
		return fill(T('insights.phonation.headlineYours'), {
			phonation: formatSeconds(ph.phonation.seconds),
			length: formatSeconds(ph.length ?? ph.phonation.seconds),
			tempo: `${beatGlyph(tempo.beatUnit, tempo.beatUnitDots)} = ${number(tempo.bpm)}`,
		});
	}
	return fill(T('insights.phonation.headline'), {
		phonation: formatSeconds(ph.phonation.seconds),
		length: formatSeconds(ph.length ?? ph.phonation.seconds),
		tempo: d.formatTempo(tempo, d.language),
	});
}
