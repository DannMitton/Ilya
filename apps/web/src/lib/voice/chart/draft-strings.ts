/**
 * THE DRAFT WORDS (N.199, brief r5 section 7). Until Step 7 the new components take their English from this file and
 * never from `i18n.ts`, so no unratified string enters the dictionary and nothing prints `[MISSING: key]`. With the switch
 * on in French the draft English shows; that is a development state and never a singer's. Step 7 moves the ratified table,
 * English and French, into `i18n.ts` and deletes this file.
 *
 * PROPOSED, not ratified by Dann. Keys are the brief's proposed keys. `{v}` is the bracketed symbol for the eye, `{n}` and
 * `{count}` numbers, `{name}` a vowel's spoken name. Strings the brief says it ADOPTS from the tree (`vowel.name.*`,
 * `vowel.spoken`, `calib.common.hz`, `calib.roster.tryAgain`, and the ritual's `pacifier.*`) are not here: they stay in
 * `i18n.ts` and are read through `t()`. Canadian spelling, the Oxford comma, no em dashes, agentless, never "goal" or
 * "target", "sustain" never "held".
 */
export const DRAFT = {
	// The sheet (Step 2).
	'sheet.title': 'Your vowel space',
	'sheet.subtitle': 'The ten vowels of sung Russian, as your voice shapes them',
	'sheet.readings': 'Your readings',
	'sheet.col.vowel': 'Vowel',
	'sheet.col.fr1': 'Hz and note',
	'sheet.col.fr2': 'Hz and note',
	'sheet.legend.sung': 'A vowel you sang, measured in vocal fry.',
	'sheet.legend.placeholder': 'A placeholder: where Ilya expects a vowel you have not sung yet.',
	'sheet.legend.zones': 'Each colour is the neighbourhood Ilya draws on for one vowel, for a voice of your type. Where they cross, the colours mix.',
	'sheet.legend.hull': 'The outline joins your sung vowels. It is dashed until all ten are sung.',
	'sheet.axis.front': 'tongue forward',
	'sheet.axis.back': 'tongue back',
	'sheet.axis.open': 'mouth more open',
	'sheet.provenance':
		'Zones along the first resonance: Bozeman, Kinesthetic Voice Pedagogy, 2nd ed. (2021), Figs. 8 to 10. The second resonance’s range: Bozeman, Practical Vocal Acoustics, 2nd ed. (2025), p. 35. Placeholder values: Mitton (2020), Table 5.3. Each zone’s width along the second resonance is Ilya’s own estimate.',
	// The sheet's own words that the brief's table does not list (Step 2): the print control and the chart's accessible name.
	// PROPOSED BY THE BUILD, flagged in the Step 2 report for Dann.
	'sheet.print': 'Print this sheet',
	'sheet.chartAlt': 'Chart of your vowel space. Each vowel is a coloured zone, a filled dot where you sang it, or a hollow dot where Ilya has placed it for now.'
} as const;

export type DraftKey = keyof typeof DRAFT;

/** The draft string for a key, with `{name}` placeholders filled. */
export function ds(key: DraftKey, vars: Record<string, string | number> = {}): string {
	let s: string = DRAFT[key];
	for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
	return s;
}
