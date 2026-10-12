/**
 * ENTER, OR LEAVING THE FIELD, SETTLES A ONE-LINE FIELD (QUEUE row 62).
 *
 * Dann, 2026-10-09 13:10, in his voice characteristics: he typed into the
 * field beside "Other", pressed Enter, and nothing happened. "Hard returns are
 * unspoken grammar for the user... The user wants to be confident that their
 * input has been registered." The field had saved on every keystroke and said
 * nothing. Ruled 13:11, design 1 of the desk's three: pressing Enter, or
 * leaving the field, settles it; the caret leaves, and a quiet "Saved" stands
 * beside it for about two seconds, announced to screen readers.
 *
 * The field still saves as the singer types; this adds only the settling.
 * Enter never submits a form or moves the page.
 *
 * Two pieces, so the unit suite (which has no DOM and no runes) can test both:
 * `settle`, a Svelte action on the input, and `savedFlag`, the two-second note.
 */

/** How long "Saved" stands beside the field. */
export const SAVED_MS = 2000;

export interface SettleOptions {
	/** Called when the field settles with a value it had not settled with before. */
	onsettle: () => void;
}

/** The parts of an input the action reads, so a test can hand it a stand-in. */
type FieldLike = Pick<HTMLInputElement, 'value' | 'blur' | 'addEventListener' | 'removeEventListener'>;

/**
 * `use:settle={{ onsettle }}` on a one-line field. Enter blurs it (and is not
 * passed on); blur settles it. A settle whose value equals the last settled
 * one, or the value the field opened with, calls nothing.
 */
export function settle(node: FieldLike, options: SettleOptions) {
	let opts = options;
	let settledAs = node.value;
	const onKey = (e: Event) => {
		const k = e as KeyboardEvent;
		if (k.key !== 'Enter' || k.isComposing) return;
		k.preventDefault();
		node.blur();
	};
	const onBlur = () => {
		if (node.value === settledAs) return;
		settledAs = node.value;
		opts.onsettle();
	};
	node.addEventListener('keydown', onKey);
	node.addEventListener('blur', onBlur);
	return {
		update(next: SettleOptions) {
			opts = next;
		},
		destroy() {
			node.removeEventListener('keydown', onKey);
			node.removeEventListener('blur', onBlur);
		},
	};
}

/**
 * The note's on and off: `show()` turns it on and off again after `ms`; a
 * second `show()` restarts the count. `set` receives each change.
 */
export function savedFlag(set: (shown: boolean) => void, ms = SAVED_MS, timers: Pick<typeof globalThis, 'setTimeout' | 'clearTimeout'> = globalThis) {
	let handle: ReturnType<typeof setTimeout> | undefined;
	return {
		show() {
			if (handle !== undefined) timers.clearTimeout(handle);
			set(true);
			handle = timers.setTimeout(() => {
				handle = undefined;
				set(false);
			}, ms);
		},
		dispose() {
			if (handle !== undefined) timers.clearTimeout(handle);
			handle = undefined;
		},
	};
}
