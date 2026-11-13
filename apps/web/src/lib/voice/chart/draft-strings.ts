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
	// The capture screen (Step 4), brief r5 section 7. `{v}` is the bracketed symbol for the eye, `{n}` and `{count}` numbers.
	'capture.title': 'Your resonances',
	'capture.count': '{n} of 10',
	'capture.explain': 'Each dot is one of your vowels: the higher your tongue, the higher the dot; the further forward, the nearer the front edge.',
	'capture.cue.ready': 'Ready for {v}.',
	'capture.cue.isCaptured': '{v} is captured.',
	'capture.cue.allTen': 'All ten captured. This is your vowel space.',
	'capture.start': 'Start {v}',
	'capture.retake': 'Re-take {v}',
	'capture.inProgress': '{v} in progress',
	'capture.done': 'Done',
	'capture.stop': 'Stop',
	'capture.clearAll': 'Clear all',
	'capture.hide': 'Hide the chart and numbers while I sing',
	'capture.hidden': 'The chart and the numbers are hidden while you sing. They return when this vowel is captured.',
	'capture.hint.first': 'Start follows Ilya’s order. Or tap any vowel to sing that one now.',
	'capture.hint.active': 'Stop, or a second tap on {v}, ends this take. Nothing is saved from it.',
	'capture.hint.retake': 'A re-take replaces {v} only if the new reading is as clear.',
	'capture.hint.placed.typed': 'Ilya has placed {v} from your voice type for now. Its placeholder moves as you sing.',
	'capture.hint.placed.untyped': 'Ilya has placed {v} from typical voices for now. Its placeholder moves as you sing.',
	'capture.hint.toGo': '{count} to go, in any order. Ilya keeps a placeholder for each until you sing it.',
	'capture.hint.finished': 'Tap any vowel to sing it again.',
	'capture.hint.confirmClear': 'Tap Clear all to clear every reading for this voice.',
	'capture.uncertain': '{v} is noted, though this take was less clear. A re-take can replace it.',
	'capture.button.sung': 'sung',
	'capture.button.placed': 'placeholder',
	'capture.button.selected': 'selected',
	'capture.bar': 'Progress of this take',
	'capture.chartAlt': 'Chart of the vowel zones. It moves in on the vowel being measured, and a dot shows the reading.',
	'capture.drawingAlt': 'Side view of the mouth and throat for {name}',
	// Words the brief's tables do not list, PROPOSED BY THE BUILD and flagged in the step reports for Dann: the sheet's print control
	// and the chart's accessible name (Step 2); the ten buttons' group name, and the sentence the first-time explanation joins (Step 4b).
	'capture.vowels': 'The ten vowels',
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
