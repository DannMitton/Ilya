/**
 * input-views.svelte.ts: which of Input's two views is showing, and the line
 * that says where a drop landed. N.135 STAGE 3, RULED BY DANN 2026-10-16
 * 00:32 to 00:51 (`OPEN.md`, "N.135 STAGE 3", defaults 1, 3, 6, 9).
 *
 * THE VIEW IS A FACT ABOUT THIS SESSION, NOT ABOUT THE SONG. Which view opens
 * is the one last used for this song, Lyrics the first time; where Lyrics is
 * empty and Poem is not, Poem opens, because the populated view takes focus
 * (Dann 00:36). The ruling does not ask the last view to survive a reload, and
 * a field for it is more record than the slice needs, so the memory is a map
 * in this module and nothing is stored (DESK DEFAULT, the brief's section 4
 * item 3; `CONTRACT.md` §8, store nothing derived).
 *
 * The reactive pair is held in a class and read through one exported instance,
 * as `tempo-ui.svelte.ts` does, so the panel and the page see one answer
 * without the page carrying any of it. Runes are inert under vitest
 * (`document.svelte.ts`), so the tests read plain fields.
 */

export type InputView = 'poem' | 'lyrics';

/**
 * The view a song opens on the first time. ROW 109, REVISING ROW 104 (Dann
 * 2026-10-16 21:06, "dropped text should always land in Poem", Poem is entered
 * by the singer): a song whose Lyrics holds no text opens Input on Poem, where
 * the singer enters or drops it; a song whose Lyrics holds text opens on
 * Lyrics. `lyrics` is what the field shows, so a score's derived words count as
 * Lyrics' text. Row 104 opened on Poem only where Lyrics was empty AND the Poem
 * was not.
 */
export function initialView(lyrics: string, _poem: string): InputView {
	return lyrics.trim() === '' ? 'poem' : 'lyrics';
}

class InputViews {
	/** The view showing now. */
	view = $state<InputView>('lyrics');
	/** Where the last dropped file went, until the next edit or view change; null otherwise. */
	landed = $state<InputView | null>(null);
	/**
	 * ROW 110: WHICH WITNESS TEXT TRANSCRIBES, per song, for the session, never
	 * stored (review r2, amendment 10; `OPEN.md` N.186: "the choice is remembered
	 * per song for the session and not stored"). Lyrics until the singer chooses.
	 */
	witnessChoice = $state<Record<string, InputView>>({});
	#memory = new Map<string, InputView>();
	#song = '';

	/**
	 * A song has opened (or its texts have loaded). The first call for a song
	 * chooses the view; later calls for the same song change nothing, so a
	 * re-render never moves the singer.
	 */
	open(songId: string, lyrics: string, poem: string): void {
		if (songId === this.#song) return;
		this.#song = songId;
		this.view = this.#memory.get(songId) ?? initialView(lyrics, poem);
		this.landed = null;
	}

	/** The singer chose a view. Remembered for this song, for this session. */
	show(view: InputView, keepLanding = false): void {
		this.view = view;
		this.#memory.set(this.#song, view);
		if (!keepLanding) this.landed = null;
	}

	/** The singer chose which witness Text transcribes for this song. */
	chooseWitness(songId: string, witness: InputView): void {
		this.witnessChoice = { ...this.witnessChoice, [songId]: witness };
	}

	/** The singer edited a text: the line goes back to saying what the view is. */
	edited(): void {
		this.landed = null;
	}

	/** A file's content went to one of the views. */
	land(where: InputView): void {
		this.landed = where;
	}
}

export const inputViews = new InputViews();
export type { InputViews };
