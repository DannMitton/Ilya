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
import { isKnownWord } from './pipeline';
import type { Seams } from './omr/underlay-page';

/** How long to wait for the dictionary, and how often to ask. */
export const READY_MS = 20_000;
const POLL_MS = 200;
/** A word every dictionary holds, to ask whether it has loaded. */
const PROBE = 'мама';

/** The seams over a lookup, an engine cut, and a modern form: pure, so each branch is a test. */
export function makeSeams(known: (word: string) => boolean, cut: (word: string) => string[], modern: (word: string) => string | null): Seams {
	return {
		isWord: (word) => known(word) || ((m) => m !== null && m !== word && known(m))(modern(word)),
		cut,
	};
}

/** The seams of this page, once the dictionary has loaded. */
export async function loadSeams(ready: () => boolean = () => isKnownWord(PROBE), wait: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms))): Promise<Seams> {
	for (let waited = 0; !ready(); waited += POLL_MS) {
		if (waited >= READY_MS) throw new Error('the dictionary did not load');
		await wait(POLL_MS);
	}
	return makeSeams(isKnownWord, (word) => GraysonEngine.syllabify(word), (word) => modernisePreReform(word));
}
