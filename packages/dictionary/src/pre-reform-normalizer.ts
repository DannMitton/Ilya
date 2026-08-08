/**
 * @ilya/dictionary – Pre-1918 orthography normaliser (item N.12)
 *
 * The Russian orthographic reform of 1917-1918 abolished THREE letters by
 * decree, yat, fita, and decimal i, and dropped the hard sign at the end of
 * words and of the parts of compound words. A fourth letter, izhitsa, is
 * mapped here as well, but on the authority of PRACTICE and not of the decree.
 * The reform documents said nothing about it: "В документах орфографической
 * реформы 1917-1918 годов ничего не говорилось о судьбе... буквы Ѵ (ижица); на
 * практике после реформы она окончательно исчезла." The mapping stands because
 * the Slavic Cataloging Manual, whose business is converting pre-reform
 * orthography systematically, still gives сѵнодъ → синод. The reform arrived
 * AFTER the golden era of Russian art-song publication, so a great deal of the
 * repertoire a singer brings to Ilya is printed in the pre-reform
 * orthography. Grayson 2012, in the hard-sign
 * section of his Cyrillic chapter: "Because this latter reform occurred after
 * the golden era of Russian art music publication (mostly in the 1800s),
 * today, there is still a great quantity of Russian vocal music that uses [ъ]
 * in the pre-reform fashion."
 *
 * WHY IT MATTERS, and it is not cosmetic. Ilya's dictionary holds modern forms
 * only. A pre-reform spelling therefore misses every lookup, and
 * `apps/web/src/lib/pipeline.ts` falls through to `stress = -2` with
 * `stressSource = 'inferred'`. Its own comment at that branch reads "no stress
 * mark displayed". So today a pre-reform word prints on Ilya's page with NO
 * STRESS MARK AT ALL, and the singer is given no reason why. That is the
 * defect this module closes.
 *
 * DANN'S RULING, 2026-07-16, and it governs every line here:
 *   - build it;
 *   - SILENT: no LOUD provenance mark. Read against his own wording on ё in the
 *     same document, "it resolves silently toward Ilya's restored ё, carrying
 *     the quiet ё-sigla provenance", silent here means resolves without asking,
 *     carrying quiet provenance. It does not mean leaves no trace.
 *   - RUN PRE-DICTIONARY: the normaliser runs before the dictionary query. This
 *     is a statement about ORDER. It says nothing about what the page prints,
 *     and an earlier version of this header claimed otherwise. See the
 *     ATTRIBUTION note below.
 *   - NEVER TOUCH ь. The letter the reform dropped word-finally is the hard
 *     sign ъ. The soft sign ь is a live letter of modern Russian and marks
 *     palatalisation; removing one for the other changes what a word means.
 *     Grayson, same section: the singer "must simply ignore [ъ] when it is the
 *     final symbol of a word but recognize that it usually has some
 *     significance when used internally." Hence word-final only, never medial.
 *
 * MODERNISE AT INTAKE. Dann ruled this on 2026-08-08: the modernised form is
 * what Ilya displays, transcribes, AND looks up. One string, four jobs, each of
 * them correct. The engraver wrote дѣти and Ilya prints дети.
 *
 * BUT THE DICTIONARY STILL DISPOSES. Dann ruled, the same day, that the caller
 * adopts this module's output only when the modernised form is a word Ilya knows.
 * What this function returns is a PROPOSAL for the page as much as for the query.
 * Ungated, the words needing the morphological endings would print a form that
 * never existed: большія → большия, однѣхъ → однех. So a caller that puts this on
 * the page must check it against the dictionary first, as `pipeline.ts` does.
 *
 * Three of Ilya's own artefacts already said so, and only the code did not:
 *   - `GuideContent.svelte:291`, its published description: "It automatically
 *     updates and normalises spelling."
 *   - `LearnContent.svelte:2124-2127`, its Learn table, on each abolished
 *     letter: "Substitute its modern counterpart."
 *   - `reconciliation/taxonomy.ts:15` and `:20`, where `'orthographic-trivia'`
 *     is `'auto-reconciled'`, "auto-reconciled toward Ilya, quiet provenance".
 *
 * And the measured reason it cannot be otherwise: `GraysonEngine.transcribe`
 * reads the printed spelling, and its grapheme inventory (`engine.ts:232-233`)
 * holds no pre-reform letter and silently DELETES what it does not recognise.
 * Measured in E.33: дѣти as printed transcribes to `ˈttʲi`, because dropping ѣ
 * leaves д beside т and the д assimilates; as дети it is `ˈdʲetʲi`.
 *
 * WHAT IS RETAINED, NOT DISCARDED. `pipeline.ts` keeps the pre-reform spelling
 * in `PreTranscribeWord.preReformSource`. It is the score's witness and it is a
 * homograph disambiguator: the reform collapsed миръ and міръ into мир, so the
 * old spelling knows something the new one does not. Consuming it for the
 * homograph pick is NOT built yet and is named as owed.
 *
 * ATTRIBUTION, recorded because it cost a session. An earlier version of this
 * header read "NORMALISE FOR LOOKUP, NEVER FOR DISPLAY" in exactly those capitals
 * and cited A14. Dann never ruled it. It was a re-reading of his "run
 * pre-dictionary" above, written into this comment, then attributed to him in
 * `e32-session-record` §1.2, then restated as a standing prohibition in the E.33
 * opener in his own voice. He caught it by ear from the capitals. Traced in
 * `claude/e33-a-rule-dann-never-made_2026-08-08.md`. Before restating a ruling as
 * standing, read the document that recorded it, not the document that cited it.
 *
 * SCOPE, and it is deliberately partial. The reform also rewrote grammatical
 * ENDINGS: -аго → -ого and -яго → -его (with -аго → -его after ж, ц, ч, ш, щ),
 * plural -ыя/-ія → -ые/-ие, онѣ → они, and ея → ее. Those are morphological
 * rather than orthographic, and a character map cannot reach them: новаго
 * survives this module unchanged, because а, г, and о are all modern letters,
 * and so it still misses the dictionary and still prints unmarked. The ending
 * rules were RULED IN by Dann on 2026-08-08 ("let's aim for completeness") as
 * N.12 increment 2, which is blocked on his ruling on the rhyme conflict:
 * Pushkin rhymes онѣ with женѣ and Tyutchev rhymes моя with нея, so a
 * normalised lookup can return an IPA that contradicts the rhyme the composer
 * set. They are NOT built here, and when they are, the irregular pronouns need
 * a closed TABLE rather than a rule, because ѣ→е turns онѣ into оне, which is
 * wrong. This module closes the letter-substitution and hard-sign half only.
 *
 * COMPOSITION with the poetic normaliser, which is no longer a composition.
 * Because this module now runs at INTAKE, `pipeline.ts` has already modernised
 * the word before it reaches the dictionary fallback chain, so a pre-reform
 * candidate can never differ from the word being looked up. `normalizePoetic`
 * runs there alone.
 *
 * The asymmetry is the reason they are no longer siblings. A poetic contraction
 * is a spelling modern Russian actually uses, so the engine can read it and the
 * printed form must be kept: восстанье transcribes to `vɑssˈtɑɲjɪ`, correct for
 * what is printed, and only the LOOKUP needs восстание. A pre-reform letter is a
 * spelling Russian abandoned, and the engine has never heard of it. Only the
 * second needs its display changed.
 *
 * Sources for the reform inventory: Grayson 2012 (the hard sign, and the
 * abolished-letter table); Mitton 2020 §4 (the abolished-letter table, and his
 * own note that any such list "is incomplete without fita ⟨Ѳ ѳ⟩"); and
 * https://en.wikipedia.org/wiki/Reforms_of_Russian_orthography for the full
 * reform inventory including the ending changes named above.
 */

/**
 * The abolished letters, mapped to their modern replacements. Three of the
 * four were abolished by decree; izhitsa is here on the authority of practice,
 * as the header explains. Both cases are carried because Russian poetic texts capitalise
 * line-initial words, and a line may legitimately open on any of them.
 *
 * The pairs are homophonous by the reform's own logic: it removed "pairs of
 * completely homophonous graphemes from the Russian alphabet", so each
 * substitution below changes spelling and never pronunciation. That is why
 * this module is safe to run silently, and why it can never alter the IPA
 * Ilya prints.
 *
 * Codepoints are named explicitly because three of these four are visually
 * confusable with letters that must NOT be touched.
 */
const ABOLISHED_LETTERS: ReadonlyMap<string, string> = new Map([
	['ѣ', 'е'], // ѣ yat        U+0463 → е
	['Ѣ', 'Е'], // Ѣ Yat        U+0462 → Е
	['ѳ', 'ф'], // ѳ fita       U+0473 → ф
	['Ѳ', 'Ф'], // Ѳ Fita       U+0472 → Ф
	['і', 'и'], // і decimal i  U+0456 → и
	['І', 'И'], // І Decimal I  U+0406 → И
	['ѵ', 'и'], // ѵ izhitsa    U+0475 → и
	['Ѵ', 'И'], // Ѵ Izhitsa    U+0474 → И
]);

/**
 * A hard sign (ъ U+044A, Ъ U+042A) that ends a word or ends a part of a compound
 * word, with a modern Cyrillic letter before it and none after it.
 *
 * The decree's wording is "на конце слов и частей сложных слов", the end of words
 * AND of the parts of compound words, so контръ-адмиралъ → контр-адмирал (the
 * Slavic Cataloging Manual's worked example) and изъ-подъ → из-под.
 *
 * The lookahead asks whether a modern Cyrillic letter FOLLOWS, which covers the
 * end of the string, a hyphen, a comma, and a closing guillemet in one test. That
 * matters now that this module runs at intake, where the token still carries its
 * punctuation: an earlier version tested only for end-of-string or a hyphen, so
 * мараѳонъ, kept its hard sign and missed the dictionary.
 *
 * ORDER IS LOAD-BEARING. This runs on the letter-MAPPED string, never on the raw
 * one, because a pre-reform letter is not a modern Cyrillic letter and would fail
 * the lookahead. On the raw form объѣхать would lose its separator; mapped to
 * объехать, the е protects the ъ. The guard is the test named "KEEPS a medial hard
 * sign that a pre-reform letter follows (объѣхать → объехать)", and the call site
 * in `modernisePreReform` carries the same warning where the reordering would
 * happen.
 *
 * The captured preceding letter, rather than a lookbehind, is what stops the
 * pattern matching a bare "ъ" or a compound part that is nothing but "ъ".
 * Reducing either to the empty string would match nothing and could not be told
 * from an honest miss.
 *
 * A MEDIAL hard sign, with letters on both sides, is never touched. It is a live
 * separator in modern Russian (объять, съесть) and carries meaning. Grayson:
 * ignore ъ word-finally, "but recognize that it usually has some significance
 * when used internally."
 */
const PART_FINAL_HARD_SIGN = /([а-яА-ЯёЁ])[ъЪ](?![а-яА-ЯёЁ])/g;

/**
 * Attempt to normalise a pre-1918 spelling to its modern dictionary form.
 *
 * Returns an array of candidate modern forms, matching `normalizePoetic`'s
 * contract so the caller can run one loop over both. The array holds at most
 * one entry, because every rule here is deterministic: ѣ is always е, and a
 * word-final or part-final ъ always goes. It is EMPTY when the token carries no pre-reform
 * feature at all, which is the overwhelmingly common case and is how a modern
 * text pays nothing for this module's existence.
 *
 * A token consisting only of a hard sign is returned unchanged (as an empty
 * candidate list) rather than reduced to the empty string.
 *
 * @param token - Cyrillic word. Punctuation, guillemets, and a trailing hyphen
 *                may be present, because the intake caller has not stripped them
 *                yet; the hard-sign rule accounts for that. Any case is handled,
 *                so a line-initial capital is not silently skipped.
 * @returns At most one candidate modern form; empty if nothing pre-reform was found.
 */
/**
 * Does this token still carry a letter the reform abolished?
 *
 * Lives here, beside ABOLISHED_LETTERS, so no caller has to mirror the inventory.
 *
 * WHY A CALLER NEEDS THIS. Dann ruled on 2026-08-08 that when the dictionary gate
 * declines a modernised form, and the printed form therefore keeps its pre-reform
 * spelling, Ilya must ABSTAIN on stress rather than trust the pre-reform
 * dictionary entry. большіе's own entry gives stress 0 where большие gives 1
 * (census, 2026-08-08), and `GraysonEngine`'s inventory (`engine.ts:232-233`)
 * silently deletes the і, so the IPA is corrupt as well. A confident stress mark
 * over a corrupted transcription is worse than an honest VERIFY box.
 *
 * The terminal hard sign is deliberately NOT one of these letters. It is silent to
 * the engine (measured: Іисусъ gives `iˈsus`), and the census found terminal-ъ-only
 * entries mostly agree with their modern twin on stress, so a word whose only
 * pre-reform feature is a hard sign needs no abstention.
 *
 * ѳ fita counts even though it is a consonant, because the engine drops it too:
 * мараѳонъ transcribes to `mʌrɑˈon`, with the ф simply gone.
 *
 * @param token - Cyrillic word, any case, punctuation permitted.
 * @returns true if any of ѣ Ѣ ѳ Ѳ і І ѵ Ѵ is present.
 */
export function hasAbolishedLetter(token: string): boolean {
	for (const ch of Array.from(token.normalize('NFC'))) {
		if (ABOLISHED_LETTERS.has(ch)) return true;
	}
	return false;
}

export function modernisePreReform(token: string): string | null {
	if (!token) return null;

	const out: string[] = [];
	let changed = false;

	for (const ch of Array.from(token.normalize('NFC'))) {
		const modern = ABOLISHED_LETTERS.get(ch);
		if (modern !== undefined) {
			out.push(modern);
			changed = true;
		} else {
			out.push(ch);
		}
	}

	// ══ ORDER IS LOAD-BEARING. Do not move this above the loop. ══
	//
	// The hard-sign rule must run AFTER the character map, never before it and
	// never on the raw token. Its lookahead asks whether a modern Cyrillic letter
	// follows the ъ, and a pre-reform letter is not a modern Cyrillic letter. So on
	// the raw form объѣхать the ъ reads as part-final and is DELETED, giving обѣхать
	// and then обехать, which is not a word and misses the dictionary. Mapped first
	// it is объехать, where the е protects the separator, and объехать is what the
	// dictionary holds.
	//
	// This is not a theoretical hazard: medial hard signs are common in exactly the
	// prefixed verbs a nineteenth-century text is full of, and the failure is
	// silent, because a wrong candidate simply misses the lookup.
	//
	// The test that fails if you reverse it is named for it:
	//   "KEEPS a medial hard sign that a pre-reform letter follows
	//    (объѣхать → объехать)"
	// in `tests/pre-reform-normalizer.test.ts`. If you are reading this because that
	// test went red, the order is the reason.
	const mapped = out.join('');
	const dropped = mapped.replace(PART_FINAL_HARD_SIGN, '$1');
	if (dropped !== mapped) {
		changed = true;
	}

	return changed ? dropped : null;
}

/**
 * The candidate-list form of `modernisePreReform`, kept for callers that loop
 * over `normalizePoetic`'s contract. There is one implementation and this
 * delegates to it, so the two can never drift apart.
 *
 * @param token - as `modernisePreReform`.
 * @returns At most one candidate modern form; empty if nothing pre-reform was found.
 */
export function normalizePreReform(token: string): string[] {
	const modern = modernisePreReform(token);
	return modern === null ? [] : [modern];
}
