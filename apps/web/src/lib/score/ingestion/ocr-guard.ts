/**
 * ocr-guard — N.146 step 2. Ilya judges its own OCR reading before it
 * becomes a poem, and refuses one that is mostly not Russian words.
 *
 * Dann's ruling, 2026-09-17: a photo of a printed poem, tilted and grained,
 * OCR'd to garble (`ОАК ИИ ае ОЕ`...), and the garble filled the input field
 * and named a song, because `decidePoemOrScore` treated any non-empty OCR
 * text as a poem. This is the guard that stands between OCR and that outcome.
 *
 * THE SIGNAL, from the step 2 memo's step 0 measurement: the share of the
 * reading's own "word tokens" -- maximal runs of Cyrillic letters, at least
 * `MIN_TOKEN_LENGTH` long -- that `isKnownWord` cannot find. Tokens shorter
 * than that are counted for nothing, in neither direction: many of the 33
 * Cyrillic letters are themselves real one- or two-letter Russian words (о,
 * и, а, к, же...), so at that length a dictionary hit is often the
 * alphabet's own letter frequency showing through garble, not a sign of real
 * Russian text. The step 0 memo measured this directly: on the walk's own
 * garble, counting every token gave the "mostly unknown" cutoff below only
 * an 8-point margin; counting only tokens of 3 letters or more gave it 28.
 *
 * THE CUTOFF is Dann's own word for the ruling: "mostly not Russian words."
 * Refused only on a STRICT MAJORITY unknown -- not a tie. A reading exactly
 * half known and half not is not "mostly" anything, and passes.
 *
 * `isKnownWord` is the one thing this file does not supply: a pure function
 * takes no dictionary along for the ride, and testing it needs no dictionary
 * either. The one caller that matters, `ScoreUploader.svelte`, binds it to
 * `GraysonEngine.lookupStress(word) !== null` -- the same first lookup
 * `pipeline.ts` itself makes before its own poetic-forms retry, which this
 * guard does not replicate: neither walk fixture needed it, and reaching
 * into `@ilya/dictionary`'s poetic normaliser from here would be a second
 * package this file has no other reason to know about.
 */

/** Below this length, a Cyrillic run is not counted as a word token in
 *  either direction. See the file header for why. */
const MIN_TOKEN_LENGTH = 3;

/** A reading is refused only past a strict majority unknown -- Dann's own
 *  "mostly," not a tie. */
const MAX_UNKNOWN_SHARE = 0.5;

/** Every maximal run of Cyrillic letters in the text, at least
 *  `MIN_TOKEN_LENGTH` long. Anything else in the text -- punctuation,
 *  digits, Latin noise, a lone letter or pair -- is not a word token at all
 *  for this guard's purposes. */
function wordTokens(text: string): string[] {
	const matches = text.normalize('NFC').match(/[а-яёА-ЯЁ]+/g) ?? [];
	return matches.filter((token) => token.length >= MIN_TOKEN_LENGTH);
}

/**
 * The share (0..1) of `text`'s word tokens `isKnownWord` cannot find.
 * `null` where there is nothing to check -- no token reaches
 * `MIN_TOKEN_LENGTH` at all -- which `passesRussianGuard` treats as failing:
 * a reading with not even one checkable word is not evidence of Russian
 * text, it is the absence of any.
 */
export function unknownWordShare(text: string, isKnownWord: (token: string) => boolean): number | null {
	const tokens = wordTokens(text);
	if (tokens.length === 0) return null;
	const unknown = tokens.filter((token) => !isKnownWord(token.toLowerCase())).length;
	return unknown / tokens.length;
}

/**
 * Dann's ruling, 2026-09-17: does this OCR reading pass as Russian, or is it
 * "mostly not Russian words"? `false` refuses the reading; `decidePoemOrScore`
 * turns that into `unreadable`, coining nothing new.
 */
export function passesRussianGuard(text: string, isKnownWord: (token: string) => boolean): boolean {
	const share = unknownWordShare(text, isKnownWord);
	if (share === null) return false;
	return share <= MAX_UNKNOWN_SHARE;
}

/**
 * N.146 step 2b. Every `isKnownWord` call is `GraysonEngine.lookupStress`,
 * and that reads a dictionary the app injects asynchronously
 * (`loader.ts`'s `setStressDictionary`) -- BEFORE it has loaded, every word
 * looks unknown, and a real Russian poem dropped during that window would
 * read as garble. This is not a hypothetical: the desk found it live in the
 * tree (`loader.ts:655`, `+page.svelte:2882-2887`) the same day step 2
 * shipped.
 *
 * `state` is kept structural, matching `loader.ts`'s own `LoaderState`
 * shape field for field, rather than importing that type: this file has no
 * other reason to know about the loader, and the three fields it reads are
 * the whole of what the decision needs.
 *
 * - Still loading (`isLoading`): `'wait'`. The reading must not be judged
 *   yet -- `ScoreUploader.svelte` holds the busy state it is already
 *   showing and asks again once `state` changes.
 * - Finished, at least one entry (`entryCount > 0`): `'judge'`. The real
 *   guard, unchanged from step 2.
 * - Finished, but failed (`error` set): `'skip'`. DESK DEFAULT (N.146 step
 *   2b): a failed load is not evidence that the page is garble, so the
 *   reading passes exactly as it did before step 2 existed.
 */
export type DictionaryGuardMode = 'wait' | 'skip' | 'judge';

export function dictionaryGuardMode(state: {
	isLoading: boolean;
	error: string | null;
	entryCount: number;
}): DictionaryGuardMode {
	if (!state.isLoading && state.entryCount > 0) return 'judge';
	if (!state.isLoading && state.error !== null) return 'skip';
	return 'wait';
}

/**
 * The `isKnownWord` `decidePoemOrScore` should actually be called with, for
 * a given `mode`. `'judge'` is the real dictionary, unchanged. `'skip'`
 * (a failed load) is a stub that knows everything, so the guard always
 * passes -- the DESK DEFAULT above, made concrete.
 *
 * `'wait'` ALSO maps to the always-true stub, and this is a belt beside the
 * suspender at the call site, not the mechanism the brief asked for: a
 * correct caller never reaches `decidePoemOrScore` while `mode` is
 * `'wait'` at all -- it awaits the dictionary first (`ScoreUploader.svelte`).
 * But mapping `'wait'` to "guard passes" rather than "guard refuses" here
 * too means the pure decision can never manufacture `unreadable` out of a
 * dictionary that merely has not loaded yet, independent of whether the
 * caller's own wait was wired correctly -- which is the pure, callerless
 * property `ocr-guard.test.ts` pins.
 */
export function isKnownWordForGuard(
	mode: DictionaryGuardMode,
	isKnownWord: (token: string) => boolean
): (token: string) => boolean {
	return mode === 'judge' ? isKnownWord : () => true;
}
