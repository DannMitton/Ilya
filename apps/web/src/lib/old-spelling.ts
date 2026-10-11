/**
 * THE OLD SPELLING'S ENDINGS (N.12, increment 2; QUEUE row 25). Ruled in by
 * Dann 2026-08-08 ("let's aim for completeness"); the brief is
 * `docs/sessions/brief-code-old-spelling-endings-and-the-notes_r1_2026-10-02.md`.
 *
 * Two kinds of change, both under "the rule proposes, the dictionary
 * disposes" (`pipeline.ts`, N.12): a form is adopted only when the dictionary
 * knows it AND its lemma agrees with the printed word's.
 *
 * - THE GENITIVE ENDINGS change for everything, the page, the transcription,
 *   and the lookup, as the abolished letters do: «шумнаго» is «шумного», so
 *   Ilya's own rule for г in -ого (`engine.ts:669`) gives it [v]. Dann,
 *   2026-10-02 19:40, on bar 9 of the Tchaikovsky song: "why Ilya isn't
 *   transcribing the suffix as [vo] instead of [go]".
 * - -ыя, -ія, онѣ, однѣ and its forms, ея and нея change for THE LOOKUP ONLY
 *   (DESK DEFAULT in the brief: how they are sung is Dann's to say, and he has
 *   not been asked). The stress and the gloss come from the modern twin; the
 *   page and the transcription keep the word as the letter map leaves it.
 *
 * WHY THE LEMMA, measured on the dictionary 2026-10-11: of 284 headwords in
 * -аго the rule finds a known form for 273, and 3 of those are another word's
 * («большаго» → «большего», lemma «больший»; «самаго» → «самого», lemma
 * «сам»); of 225 in -ыя, 4 («данныя» → «данные», lemma «данные»). The lemma
 * check rejects all seven and keeps every one that agrees.
 */
import { GraysonEngine, type StressLookupResult } from '@ilya/phonology';
import { hasAbolishedLetter, lookupOnlyTwin, modernisePreReform, oldEndingCandidates } from '@ilya/dictionary';

/** The probe `pipeline.ts` already uses: guillemets and a trailing dash go, as `bareWord` strips them. */
export const stripForLookup = (s: string): string => s.replace(/[«»]/g, '').replace(/[-–—]+$/, '');

/** Every lemma an entry names, in modern spelling and lowercase, so «нашъ» and «наш» agree. */
function lemmasOf(r: StressLookupResult | null): string[] {
	if (!r) return [];
	const all = [r.lemma, ...(r.allEntries ?? []).map((e: { l?: string; lemma?: string }) => e.l ?? e.lemma ?? '')];
	return all.filter(Boolean).map((l) => (modernisePreReform(l) ?? l).toLowerCase());
}

/** Parts of speech whose genitive or plural takes the adjectival endings these rules rewrite. */
const ADJECTIVAL_POS = new Set(['adj', 'det', 'pron', 'num', 'participle']);

/**
 * Does the twin belong to the printed word? Where the printed word is itself in
 * the dictionary, their lemmas must agree. Where it is not, there is no lemma
 * to compare, and the twin must at least decline like an adjective, a
 * pronoun, or a participle, the only words these endings belong to (DESK
 * DEFAULT).
 */
export function lemmaAgrees(printed: StressLookupResult | null, twin: StressLookupResult): boolean {
	if (printed) {
		const theirs = lemmasOf(twin);
		return lemmasOf(printed).some((l) => theirs.includes(l));
	}
	const entries: Array<{ p?: string; pos?: string; l?: string; lemma?: string }> = twin.allEntries ?? [{ p: twin.pos, l: twin.lemma }];
	return entries.some((e) => ADJECTIVAL_POS.has(e.p ?? e.pos ?? '') || /(ый|ий|ой|ое|ее)$/.test(e.l ?? e.lemma ?? ''));
}

/**
 * The modern form of an old genitive ending, or null. `probe` is the token after
 * the letter map (or as printed, when it has no abolished letter); `raw` is the
 * token as printed, looked up too, because the dictionary holds old spellings
 * under their own letters.
 */
export function adoptOldEnding(probe: string, raw: string): string | null {
	const candidates = oldEndingCandidates(probe);
	if (candidates.length === 0) return null;
	const printed = GraysonEngine.lookupStress(stripForLookup(probe)) ?? GraysonEngine.lookupStress(stripForLookup(raw));
	for (const c of candidates) {
		const twin = GraysonEngine.lookupStress(stripForLookup(c));
		if (twin && lemmaAgrees(printed, twin)) return c;
	}
	return null;
}

/**
 * A lookup-only twin for a printed word, with the letters the transcription
 * should read: for a word still carrying an abolished letter («большія»), the
 * letter-mapped form («большия»), because the engine deletes a letter it does
 * not know (`engine.ts:232-233`) and the reform made each pair a homophone;
 * otherwise null, and the transcription reads the word as it already does.
 */
export function lookupOnlyTwinFor(
	raw: string,
	current: StressLookupResult | null,
): { lookup: StressLookupResult; letters: string | null } | null {
	const twinWord = lookupOnlyTwin(raw);
	if (!twinWord) return null;
	const twin = GraysonEngine.lookupStress(twinWord);
	if (!twin) return null;
	const bare = raw.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}]/gu, '');
	const closedTable = !/(ыя|ія)$/.test(bare);
	const printed = GraysonEngine.lookupStress(stripForLookup(raw)) ?? current;
	if (!closedTable && !lemmaAgrees(printed, twin)) return null;
	return { lookup: twin, letters: hasAbolishedLetter(raw) ? (modernisePreReform(raw) ?? null) : null };
}
