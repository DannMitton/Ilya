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
 * The view a song opens on the first time: Lyrics, unless Lyrics is empty and
 * the Poem is not (ruling default 3 and Dann 00:36: "if Lyrics is the only
 * populated option, it should take focus over the blank Poem field" and, the
 * mirror, a song with only a poem opens on the poem).
 */
export function initialView(lyrics: string, poem: string): InputView {
	return lyrics.trim() === '' && poem.trim() !== '' ? 'poem' : 'lyrics';
}

class InputViews {
	/** The view showing now. */
	view = $state<InputView>('lyrics');
	/** Where the last dropped file went, until the next edit or view change; null otherwise. */
	landed = $state<InputView | null>(null);
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
