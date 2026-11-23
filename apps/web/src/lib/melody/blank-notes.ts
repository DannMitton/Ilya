/**
 * MELODY's blank state: what it asks, and what its NOTES say (lane 78, brief `docs/sessions/brief-code-lane78-blank-states_r3_2026-11-21.md`,
 * step 2). PURE: the voice's state and a language in, runs out, so the state table is tested without a browser.
 *
 * THE TABLE (the lane's contract; `MarkupPane.svelte` reads `adapted.completeness.formants` and `adapted.generic`, and adds no fourth test):
 *
 * | Voice state                                  | Ask          | NOTES                                                              |
 * | none (`!completeness.formants`)              | both missing | none                                                               |
 * | a type chosen, nothing sung (`generic`)      | score        | none: the title line already says whose values (`profile.subtitlePlaceholder`) |
 * | sung, not yet complete (`!isPersonal`)       | score        | `calib.pane.belowCore` through `statusLineFor`, then the provisional sentence |
 * | complete                                     | score        | the status line, then the provisional sentence                     |
 *
 * The provisional sentence on an incomplete profile is a DESK DEFAULT: MELODY drew it at any count before this lane, and dropping it would stop
 * telling a singer with three vowels that one of them is provisional. The sentence names VOICE and no direction, and VOICE is a link
 * (`components/Paper/blank-state.ts`).
 */
import type { Language } from '$lib/i18n';
import type { Vowel } from '$lib/voice/engine/types';
import { spokenName } from '$lib/voice/vowel-names';
import { linkParts, type BlankAsk, type BlankPart } from '$lib/components/Paper/blank-state';
import { listSep, provisionalPartsFor, statusLineFor } from './profile-status';

/** MELODY with no score asks for the voice too when it has none, because marking is what MELODY is for (Dann 2026-11-19 09:35). */
export function melodyAsk(voiceMissing: boolean): BlankAsk {
	return voiceMissing ? 'both' : 'score';
}

export interface MelodyNotesInput {
	generic: boolean;
	sampledCount: number;
	personal: boolean;
	core: readonly Vowel[];
	/** The sung vowels whose reading is provisional, in the roster's order. */
	provisional: readonly Vowel[];
	language: Language;
}

/** The provisional sentence as runs: the template split around `{vowels}`, each vowel an IPA glyph and its informal name, VOICE a link. */
export function provisionalRuns(vowels: readonly Vowel[], language: Language): BlankPart[] {
	const [before, after = ''] = provisionalPartsFor(vowels.length, language);
	const out: BlankPart[] = [...linkParts(before, language, ['voice'])];
	vowels.forEach((g, i) => {
		const sep = listSep(i, vowels.length, language);
		if (sep) out.push({ kind: 'text', text: sep });
		out.push({ kind: 'ipa', text: `[${g}]` }, { kind: 'text', text: spokenName(g, language) });
	});
	out.push(...linkParts(after, language, ['voice']));
	return out;
}

/** MELODY's NOTES, as paragraphs of runs. An empty list draws no NOTES heading. */
export function melodyNotes(o: MelodyNotesInput): BlankPart[][] {
	if (o.generic) return [];
	const status = statusLineFor({ sampledCount: o.sampledCount, personal: o.personal, core: o.core }, o.language);
	const out: BlankPart[][] = [linkParts(status, o.language, ['voice'])];
	if (o.provisional.length > 0) out.push(provisionalRuns(o.provisional, o.language));
	return out;
}
