/**
 * undo-history.svelte.ts — the named Undo and Redo of the Correction Station.
 *
 * MOVED OUT OF `+page.svelte` by the audit's phase 4, slice 1, 2026-09-27
 * (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`).
 * A move, not a change: the stack, the snapshot, and the order of every
 * write are the ones the page held at `f5d0dd4` (`+page.svelte:915-1016`).
 *
 * THE SEAM IS A CLASS WITH `$state` FIELDS, the Svelte docs' shape for
 * shared reactive state. The page reads `undoStack` and `redoStack` inside
 * `$derived` (the pills' labels), so the stacks have to stay reactive, and
 * the class keeps them so without the page holding them. What the class does
 * NOT hold is the state it saves: that belongs to the song document and the
 * cursor, so the page hands in `read` and `write` and the class never learns
 * what a correction is. Under vitest the runes are inert (`document.svelte.ts`
 * explains why), which leaves this a plain class there and fully testable.
 *
 * IN MEMORY ONLY, AND THAT IS THE RULE RATHER THAN AN OMISSION. N.27
 * stands: corrections stay the one stored diff, and this ship adds NO SAVE
 * SITE. A reload therefore arrives with the corrections and with an empty
 * stack, which is the honest state: the singer's corrections survived and
 * the session's history did not.
 *
 * A SNAPSHOT, NOT AN INVERSE. `withCorrection`, `clearCorrection`, and the
 * two shift functions all return NEW maps, so holding the previous
 * reference is a complete, cheap record of the state before the verb, and
 * there is no per-verb inverse to get wrong.
 *
 * THE PILL'S SENTENCE IS COMPOSED AT RENDER, not at push, so a singer who
 * changes language mid-session reads the pill in the language they are
 * now in.
 *
 * EVERY CORRECTION VERB PUSHES, wherever it was pressed. The dock and the
 * desktop drawer call the same handlers, so one stack cannot disagree with
 * another. Nothing renders the pill outside the dock, so the desk is
 * unchanged.
 */
import type { CorrectionMap } from './correction';
import type { PairingMap } from './pairings';

export type UndoNote = { kind: 'text'; key: string } | { kind: 'change'; from: string; to: string };

/** The state one entry saves and restores. */
export interface UndoState {
	corrections: CorrectionMap;
	pairings: PairingMap;
	/* THE WHOLE CURSOR, not half of it. N.92 slice 3 gave the bar a second
	   place to stand, and an undo that restored only `selected` set it to
	   null while leaving `gapAfter` alone, which is no cursor at all: the
	   effect that keeps the loupe standing then took it down. MEASURED on
	   the walk: undoing an entry made in a gap dismissed the loupe, because
	   every entry is pushed from a gap and every gap pushes a null
	   selection. */
	/* N.147: THIS FIELD IS NOW WHAT UNDOES A PLACEMENT'S ADVANCE TOO. A
	   placement moves the SELECTION to the next open note
	   (`placeSyllableOnSelected`), where before N.147 it advanced a
	   separate `pairingCursor` that this entry carried on its own. One
	   field now does both jobs, because the selection was always the one a
	   placement's undo had to restore for the OTHER reason above; retiring
	   `pairingCursor` with the note-tap-places gesture cost this entry
	   nothing. */
	selected: string | null;
	gapAfter: string | null | undefined;
	/* N.160 step 3. The text these pairings describe. The stack outlives a
	   text edit, so an undo can bring back seats made against an older
	   poem, and the seated text has to come back with them or the next
	   transcription would diff from the wrong text and freeze them. */
	seatedText: string;
}

export interface UndoEntry extends UndoState {
	note: UndoNote;
}

export class UndoHistory {
	undoStack = $state<UndoEntry[]>([]);
	/* THE OTHER HALF, N.111-3b. RULED BY DANN 2026-09-07: "we do not include an
	   Undo/Redo button on the Loupe. We need one."

	   ONE STACK EXTENDED, NOT A SECOND ONE ADDED. Redo is the same snapshot in
	   the other direction: undo restores the entry's state and hands the state
	   it replaced to this stack, redo does the mirror. Nothing here knows what
	   a verb DOES, which is the property that let one stack cover nine verbs
	   and now covers placement too.

	   A NEW ACTION DROPS THE FUTURE. `push` clears this, so the redo pill
	   can never offer to restore a state that branched away. */
	redoStack = $state<UndoEntry[]>([]);

	readonly #read: () => UndoState;
	readonly #write: (state: UndoState) => void;

	/**
	 * `read` returns the state as it stands right now, which is what both
	 * directions save; `write` puts a saved state back.
	 */
	constructor(read: () => UndoState, write: (state: UndoState) => void) {
		this.#read = read;
		this.#write = write;
	}

	#snapshot(note: UndoNote): UndoEntry {
		return { note, ...this.#read() };
	}

	/* The three verbs are arrow fields so the page can hand them to a
	   component as they are, without a wrapper to keep `this`. */

	push = (note: UndoNote): void => {
		this.undoStack = [...this.undoStack, this.#snapshot(note)];
		this.redoStack = [];
	};

	undo = (): void => {
		const top = this.undoStack[this.undoStack.length - 1];
		if (!top) return;
		this.redoStack = [...this.redoStack, this.#snapshot(top.note)];
		this.#write(top);
		this.undoStack = this.undoStack.slice(0, -1);
	};

	redo = (): void => {
		const top = this.redoStack[this.redoStack.length - 1];
		if (!top) return;
		this.undoStack = [...this.undoStack, this.#snapshot(top.note)];
		this.#write(top);
		this.redoStack = this.redoStack.slice(0, -1);
	};
}

/* THE PILL'S SENTENCE IS COMPOSED AT RENDER, and both pills name the SAME
   action: the thing undo would take back, and the thing redo would put
   back. One reader, two stacks. `translate` is the page's `t` in the
   language the singer is in now. */
export function stackLabel(stack: UndoEntry[], translate: (key: string) => string): string | null {
	const top = stack[stack.length - 1];
	if (!top) return null;
	return top.note.kind === 'text' ? translate(top.note.key) : `${top.note.from} → ${top.note.to}`;
}
