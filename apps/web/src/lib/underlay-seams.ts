/**
 * The dictionary and the engine, for the underlay reader (N.135 stage 2b).
 *
 * `omr/` imports neither (stage 2a review, amendment 4): the dictionary's test
 * and the engine's cut come in as functions (`Seams` in `omr/underlay-page.ts`).
 * This file is where the app supplies them. `isKnownWord` is the pipeline's own
 * first lookup (`pipeline.ts`); the modern form of a pre-reform word is tried
 * after the word as read, as the stage 1 harness did (decision 1 of 4.3), with
 * `modernisePreReform`; the cut is `GraysonEngine.syllabify`.
 *
 * `pipeline.ts` names itself the only importer of `@ilya/dictionary`, and it is
 * not (`old-spelling.ts`, `text/poem-compare.ts`, `loader.ts`, and others import
 * it too); this file imports `modernisePreReform` for the same reason they do.
 * It is a seam at the top of `lib/`, not a file in `omr/`.
 *
 * The dictionary loads after the page starts (`loader.ts`), and before it has
 * loaded every word looks unknown: `loadSeams` waits for it, and rejects after
 * `READY_MS` so that a page whose dictionary never loads answers null and not
 * "not Russian".
 */
import { GraysonEngine } from '@ilya/phonology';
import { modernisePreReform } from '@ilya/dictionary';
import { isKnownWord, processText } from './pipeline';
import type { CliticCall } from './omr/underlay-clitics';
import type { Seams } from './omr/underlay-page';

/** How long to wait for the dictionary, and how often to ask. */
export const READY_MS = 20_000;
const POLL_MS = 200;
/** A word every dictionary holds, to ask whether it has loaded. */
const PROBE = 'мама';

/** The seams over a lookup, an engine cut, and a modern form: pure, so each branch is a test. */
export function makeSeams(known: (word: string) => boolean, cut: (word: string) => string[], modern: (word: string) => string | null, clitics?: (words: string[]) => CliticCall[]): Seams {
	return {
		isWord: (word) => known(word) || ((m) => m !== null && m !== word && known(m))(modern(word)),
		cut,
		...(clitics ? { clitics } : {}),
	};
}

const lettersOf = (s: string): string => s.replace(/[^\p{L}]/gu, '').toLowerCase();

/**
 * The transcription's call for each word of a row: the row goes through
 * `processText` as one line, and each word takes the `isProclitic` or
 * `isEnclitic` of the next transcribed word with the same letters, in order. The
 * transcription writes the modern spelling («в» for a printed «въ»), so a word
 * matches a transcribed word whose letters equal its own OR those of its modern
 * form (`modern`, the conversion the factory passes to `makeSeams`: where it
 * gives null, only the word's own letters). Both, because the pipeline keeps a
 * pre-reform spelling it cannot resolve (`pipeline.ts`, `modernisedForm` null
 * when the modern form is unknown). No «ъ» is stripped by hand. A word the
 * transcription does not return (it drops a mark that is no word, and may split
 * a hyphenated particle) is called null, so it is never folded.
 */
export function cliticCalls(
	words: string[],
	transcribe: (line: string) => { cleanWord: string; isProclitic: boolean; isEnclitic: boolean }[] = (line) => processText(line, { language: 'en' }).flatMap((l) => l.words),
	modern?: (word: string) => string | null,
): CliticCall[] {
	const heard = transcribe(words.join(' '));
	let at = 0;
	return words.map((w) => {
		const own = lettersOf(w);
		const m = modern ? modern(w) : null;
		const alt = m !== null && m !== undefined ? lettersOf(m) : null;
		const found = own === '' ? -1 : heard.findIndex((h, k) => k >= at && (lettersOf(h.cleanWord) === own || (alt !== null && alt !== '' && lettersOf(h.cleanWord) === alt)));
		if (found < 0) return null;
		at = found + 1;
		return heard[found].isProclitic ? 'proclitic' : heard[found].isEnclitic ? 'enclitic' : null;
	});
}

/** The seams of this page, once the dictionary has loaded. */
export async function loadSeams(ready: () => boolean = () => isKnownWord(PROBE), wait: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms))): Promise<Seams> {
	for (let waited = 0; !ready(); waited += POLL_MS) {
		if (waited >= READY_MS) throw new Error('the dictionary did not load');
		await wait(POLL_MS);
	}
	return makeSeams(isKnownWord, (word) => GraysonEngine.syllabify(word), (word) => modernisePreReform(word), (words) => cliticCalls(words, undefined, (word) => modernisePreReform(word)));
}
