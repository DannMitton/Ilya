/**
 * poem-page.ts: where a page read as a poem goes. N.135 STAGE 3, ruling
 * default 9 (Dann 2026-10-16 00:43, "yes"): a dropped file routes by what it
 * is, whichever view shows. A page with no staves, and a PDF whose text layer
 * yields text, are a poem, and a poem goes to the Poem field, never to the
 * sung text. THIS IS THE ONE CHANGE OF DESTINATION in the slice: before it,
 * `ScoreUploader`'s `onpoem` landed in `doc.inputText`.
 *
 * Pure of the page: the page hands in what it holds and the three things it
 * can do, so a test can drive the routing without a component. Where the Poem
 * already holds text, the page's one replace dialog is asked first, safe
 * answer last (`askToReplace`, `+page.svelte`).
 */
import type { InputView } from './input-views.svelte';

export interface PoemPageDeps {
	/** The text the Poem field holds now. */
	held: string;
	/** Put the page's text in the Poem field and do what follows a Poem change. */
	put: (text: string) => void;
	/** Ask before replacing, and call `replace` only on the destructive answer. */
	ask: (replace: () => void) => void;
	/** Say where the content went. */
	land: (where: InputView) => void;
}

export function routePoemPage(text: string, deps: PoemPageDeps): void {
	const replace = () => {
		deps.put(text);
		deps.land('poem');
	};
	if (deps.held.trim() === '') replace();
	else deps.ask(replace);
}
