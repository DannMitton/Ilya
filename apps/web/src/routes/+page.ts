/**
 * +page.ts — the library is opened here, before the page renders.
 *
 * N.67 step 1. Step 0 could read six localStorage keys synchronously at
 * component init; IndexedDB cannot be read synchronously, so the load has to
 * happen somewhere that can await. This is that place.
 *
 * WHY HERE AND NOT IN `onMount`. The document's whole guarantee is that it is
 * constructed FROM data that has already been read, so no effect can ever
 * observe an unrestored default (socket §4.4). A load function runs before the
 * component exists, which keeps that guarantee exactly as it was, and keeps
 * the page free of the `{#if doc}` branching the addendum expected.
 *
 * `ssr = false` is set in `+layout.ts`, so this runs in the browser only and
 * its return value is never serialized. The `browser` guard is belt beside
 * braces for the prerender pass.
 *
 * `openLibrary()` never rejects and never hangs (it races the open against a
 * timeout), because a rejection here is a blank page.
 */
import { browser } from '$app/environment';
import { openLibrary, type OpenedLibrary } from '$lib/library';

export const load = async (): Promise<{ opened: OpenedLibrary | null }> => {
	if (!browser) return { opened: null };
	return { opened: await openLibrary() };
};
