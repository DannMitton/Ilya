/**
 * poem-offer.svelte.ts: Ilya fills Poem from its own library on a confident match
 * (poem library, build 1, step 4; brief
 * `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`).
 *
 * THE SINGER'S WALK GOVERNS; THIS SERVES IT. She drops a scan, or pastes her
 * Lyrics, and Poem fills from the library when the match is confident. She keeps
 * it, declines it (Poem empties and Lyrics returns exactly as it was, with an
 * Undo), ignores it (the card is there on her next visit), or edits it (it is hers,
 * and its source still shows). Her own poem always wins, and nothing she did not
 * ask for happens later: no fill on typing, none when she reopens a stored song,
 * none over a Poem she filled, none for a cycle of several songs.
 *
 * WHERE IT HOOKS. `routes/+page.svelte` calls this at the arrival sites of Lyrics
 * (the file and scan fill, and a Lyrics paste into an empty field) and at the
 * Poem field's own edits, its Clear, and a poem page. It is NEVER called from
 * `handleInput`, which a keystroke reaches with `how` defaulting to `'paste'`
 * (review amendment 11). `+page.svelte` is held to its size ratchet, so this file
 * holds the logic and the page holds one short call at each site.
 *
 * THE STATE. What outlives the session is `doc.poemSource` (stored, additive;
 * `library/types.ts`). What does not is here: the declines of this session (per
 * song and work, review amendment 5: nothing about a decline is stored in build
 * 1), the Lyrics as they were before the fill (so a decline restores them byte
 * for byte, amendment 3), and the "Poem removed" line's undo. A decline made
 * after a reload has no memory of the earlier Lyrics: Poem empties and Lyrics
 * stays as stored (the fill only ever changes Lyrics' line breaks, `relining.ts`).
 */
import type { PoemSource } from '$lib/library/types';
import type { LoadedPoemLibrary } from './poem-library';
import { foldLetters, matchPoem } from './poem-match';
import { edited, heldForGuard, kept, replacesLibraryPoem, resolveSource, cutFor, type ResolvedSource } from './poem-source';

/** The part of the open song this reads and writes. `SongDocument` has all of it. */
export interface OfferDoc {
	readonly id: string;
	readonly readOnly: boolean;
	inputText: string;
	publishedPoem: string;
	poemSource: PoemSource | null;
}

/** What the page lends: the open song, the library, and the three things only the page can do. */
export interface OfferDeps {
	/** The song open now. It can be replaced (a song switch), so it is asked for each time. */
	doc: () => OfferDoc;
	library: Promise<LoadedPoemLibrary | null>;
	/** Put text in Poem by the path a pasted poem takes (`handlePoemEdit(text, 'paste')`), so differences and omissions work unchanged. */
	put: (text: string) => void;
	/** Set Lyrics whole, as an edit (`handleInput(text, 'paste')`). Not an arrival: nothing matches on it. */
	setLyrics: (text: string) => void;
	/** `lastLaid` in the page: the witness that Lyrics' line breaks are Ilya's. */
	laid: { get: () => string; set: (value: string) => void };
}

/** Lyrics as they were before the fill. */
interface Memory {
	inputText: string;
	laid: string;
}

/** What "Not this poem" removed, for the one Undo. */
interface Removed {
	songId: string;
	key: string;
	source: PoemSource;
	poem: string;
	/** Lyrics at the tap (as filled), restored by Undo. */
	inputText: string;
	/** Lyrics once the decline had restored them: the line stands only while they still are. */
	restored: string;
	laid: string;
}

const keyOf = (songId: string, work: string): string => `${songId}|${work}`;

export class PoemOffer {
	/** The library, once the loader has it; null before, and where it failed. The card reads it. */
	library = $state<LoadedPoemLibrary | null>(null);
	/** The last decline, for Undo; reactive, so a view that reads `removedFor` updates when one is made or undone. */
	#removed = $state<Removed | null>(null);
	#declined = new Set<string>();
	#memory = new Map<string, Memory>();
	#deps: OfferDeps | null = null;

	attach(deps: OfferDeps): void {
		this.#deps = deps;
		void deps.library.then((library) => (this.library = library));
	}

	/**
	 * Lyrics have arrived whole (a file, a scan, a paste into an empty Lyrics). Matches them against the library
	 * and, if the match is confident, fills Poem. Returns when it has finished or decided not to; the page does not wait.
	 *
	 * It awaits the library, then re-checks everything it checked before, because the singer can have switched songs,
	 * filled Poem herself, or changed the Lyrics in the meantime (review amendment on the arrival sites).
	 */
	async offer(text: string): Promise<void> {
		const deps = this.#deps;
		if (!deps) return;
		const songId = deps.doc().id;
		if (!this.#mayFill(deps.doc(), songId)) return;
		const library = await deps.library;
		if (!library) return;
		const match = matchPoem(text, library);
		if (!match) return;

		const doc = deps.doc();
		if (!this.#mayFill(doc, songId)) return;
		if (this.#declined.has(keyOf(songId, match.work))) return;
		// The Lyrics that were matched must still be the Lyrics. Line breaks may differ; the letters may not.
		if (foldLetters(doc.inputText) !== foldLetters(text)) return;

		const cut = cutFor(match);
		const memory: Memory = { inputText: doc.inputText, laid: deps.laid.get() };
		// `poemSource` is null while `put` runs, so the page's Poem-edit hook reads this fill as nothing: it is not the
		// singer's edit. The source is written after, and a test pins that order.
		deps.put(cut.text);
		this.#memory.set(songId, memory);
		doc.poemSource = { id: match.entry.id, work: match.work, poemHash: library.hash, start: cut.start, end: cut.end, answered: false, edited: false };
	}

	/** The song is this one, can be written, and holds no Poem and no source: nothing of hers stands in the way. */
	#mayFill(doc: OfferDoc, songId: string): boolean {
		return doc.id === songId && !doc.readOnly && doc.publishedPoem.trim() === '' && doc.poemSource === null;
	}

	/* ── What the singer does to Poem ──────────────────────────────── */

	/**
	 * The Poem field's text changed by the singer (`handlePoemEdit`, after it wrote `doc.publishedPoem`). An edit makes the
	 * poem hers: `edited` and `answered`. Emptying it, or pasting a poem that is not this one, ends the source.
	 */
	onPoemEdit(previous: string, next: string, how: 'boot' | 'paste' | 'typing'): void {
		const doc = this.#deps?.doc();
		if (!doc?.poemSource) return;
		if (next.trim() === '' || (how === 'paste' && replacesLibraryPoem(previous, next, foldLetters))) this.#end(doc);
		else {
			doc.poemSource = edited(doc.poemSource);
			this.#memory.delete(doc.id);
		}
	}

	/** Poem's Clear. */
	onClear(): void {
		const doc = this.#deps?.doc();
		if (doc?.poemSource) this.#end(doc);
	}

	/** A poem page is about to replace the Poem: the library poem is no longer there. */
	onReplace(): void {
		this.onClear();
	}

	/** What the replace guard is told Poem holds: nothing, over an unedited library poem. */
	heldForGuard(held: string): string {
		return heldForGuard(this.#deps?.doc().poemSource ?? null, held);
	}

	#end(doc: OfferDoc): void {
		doc.poemSource = null;
		this.#memory.delete(doc.id);
	}

	/* ── What the singer answers on the card ───────────────────────── */

	/** "Keep this poem". */
	keep(): void {
		const doc = this.#deps?.doc();
		if (!doc?.poemSource || doc.poemSource.answered) return;
		doc.poemSource = kept(doc.poemSource);
		this.#memory.delete(doc.id);
	}

	/**
	 * "Not this poem". Poem empties, Lyrics return exactly as they were before the poem arrived (where this session
	 * remembers them), the poem is not offered for this song again this session, and the line "Poem removed." offers Undo.
	 */
	decline(): void {
		const deps = this.#deps;
		const doc = deps?.doc();
		if (!deps || !doc?.poemSource || doc.poemSource.answered) return;
		const source = doc.poemSource;
		const memory = this.#memory.get(doc.id);
		const removed: Removed = { songId: doc.id, key: keyOf(doc.id, source.work), source, poem: doc.publishedPoem, inputText: doc.inputText, restored: doc.inputText, laid: deps.laid.get() };
		this.#declined.add(removed.key);
		doc.poemSource = null;
		doc.publishedPoem = '';
		if (memory) {
			if (doc.inputText !== memory.inputText) deps.setLyrics(memory.inputText);
			deps.laid.set(memory.laid);
			removed.restored = memory.inputText;
		}
		this.#removed = removed;
	}

	/** Undo of "Not this poem": the poem, the source, Lyrics as filled, and the card if it was unanswered. */
	undo(): void {
		const deps = this.#deps;
		const doc = deps?.doc();
		const removed = this.removedFor(doc?.id ?? '');
		if (!deps || !doc || !removed) return;
		this.#declined.delete(removed.key);
		doc.publishedPoem = removed.poem;
		doc.poemSource = removed.source;
		if (doc.inputText !== removed.inputText) deps.setLyrics(removed.inputText);
		deps.laid.set(removed.laid);
		this.#removed = null;
	}

	/**
	 * The open song is `songId`. Called from the Input views when a song opens (as `inputViews.open` is), so the
	 * "Poem removed" line, which stands until she leaves the song, is gone once she has.
	 */
	visit(songId: string): void {
		if (this.#removed && this.#removed.songId !== songId) this.#removed = null;
	}

	/**
	 * The decline Undo can still reverse on this song, or null. It stands until she leaves the song, and only while nothing
	 * has changed under it: Poem still empty and Lyrics still as the decline left them. Typing into either ends it, so
	 * Undo can never overwrite her words.
	 */
	removedFor(songId: string): Removed | null {
		const removed = this.#removed;
		const doc = this.#deps?.doc();
		if (!removed || !doc || removed.songId !== songId || doc.id !== songId) return null;
		if (doc.publishedPoem !== '' || doc.poemSource !== null || doc.inputText !== removed.restored) return null;
		return removed;
	}

	/* ── What the views read ───────────────────────────────────────── */

	/** The source on the open song, found again in the library; null where there is none, or the library has no entry for its work. */
	current(): { source: PoemSource; resolved: ResolvedSource } | null {
		const source = this.#deps?.doc().poemSource ?? null;
		if (!source || !this.library) return null;
		const resolved = resolveSource(source, this.library);
		return resolved ? { source, resolved } : null;
	}
}

export const poemOffer = new PoemOffer();
export type { Removed };
