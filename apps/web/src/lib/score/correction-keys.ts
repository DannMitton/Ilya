/**
 * correction-keys.ts — the Correction Station's keyboard.
 *
 * MOVED OUT OF `+page.svelte` by the audit's phase 4, slice 6, 2026-10-15
 * (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`,
 * `code-audit-correction-station-map_r1_2026-09-27.md` §4). A move, not a
 * change: the handler, the order of its guards, and every key it claims are
 * the ones the page held at `14e2ff8` (`+page.svelte:1193-1283`).
 *
 * LAST, BECAUSE IT CALLS EVERY OTHER SLICE. It holds no state of its own, so
 * it is a plain module: `createCorrectionKeys` is handed what to read and
 * what to call, and returns the one handler the window listens with. The
 * page wires the pieces slices 1 to 5 left it.
 */
import type { NoteBase } from '@ilya/score-parser';
import { DIGIT_BASE } from './correction';
import type { Cursor } from './entry';
import { keyOwnedElsewhere } from './loupe-panel.svelte';

export interface CorrectionKeysDeps {
	cursor: () => Cursor | null;
	inGap: () => boolean;
	/** `LoupePanel.musicKeys`: false in Syllables mode, where only the moves act. */
	musicKeys: () => boolean;
	canUndo: () => boolean;
	canRedo: () => boolean;
	undo: () => void;
	redo: () => void;
	step: (direction: 1 | -1) => void;
	octave: (direction: 1 | -1) => void;
	semitone: (direction: 1 | -1) => void;
	move: (direction: 1 | -1) => void;
	dotCell: () => void;
	deleteNote: () => void;
	durationCell: (base: NoteBase) => void;
	dismiss: () => void;
}

/* THE KEYBOARD, active wherever the insertion bar stands. Finale's own digit
   mapping, kept because Dann knows it in his fingers.

   IT WAS GATED ON A SELECTED NOTE and is gated on a CURSOR now, which is
   slice 4 finishing what slice 3 started: the bar can stand in a gap, and a
   keyboard that went dead there would be a second grammar to learn.

   EVERY KEY GOES THROUGH THE SURFACE'S OWN HANDLER, not past it. The digits
   call `handleDurationCell` and the dot calls `handleDotCell`, which is
   what the DURATION cells call, so a digit in a gap enters an entry exactly
   as a tap on the cell does and a digit on a note re-times it. One grammar,
   two ways in.

   THE VERBS THAT NEED A NOTE STAND DOWN IN A GAP, the same ones the surface
   greys: pitch, and delete.

   ESCAPE DISMISSES THE LOUPE, ruled by Dann 2026-08-27, rather than merely
   dropping the selection: on a fine pointer it is the chevron's twin, and
   the surfaces leave together as they do by every other route.

   It stands down inside a text field. A singer typing a title or a poem
   must not have `5` swallowed by the score, and `closest` covers the
   contenteditable case as well as inputs. */
export function createCorrectionKeys(d: CorrectionKeysDeps): (e: KeyboardEvent) => void {
	return function handleCorrectionKey(e: KeyboardEvent): void {
		/* THE FIELD GUARD COMES FIRST, ahead of every branch below it. It used
		   to sit under the cursor test, which was harmless while the only keys
		   this function claimed were bare ones. N.113a's Undo and Redo run with
		   no cursor, so the guard has to be the first thing that happens. */
		if (keyOwnedElsewhere(e.target)) return; // fields, and since calm-loupe slice 6 a tablist

		/* ── N.113a. UNDO AND REDO AS HOTKEYS ─────────────────────────────
		   RULED BY DANN 2026-09-07: *"on the desk, Cmd-Z (macOS) / Ctrl-Z
		   executes Undo as a hotkey."* Shift-Cmd-Z and Ctrl-Y for Redo are the
		   DESK DEFAULT that came with it, and so is the field rule: neither
		   fires while a text field has focus, so the poem keeps the browser's
		   own undo and a singer typing into the intake is never surprised.

		   THE SAME STACK THE PILLS USE. `handleUndo` and `handleRedo` are the
		   functions the loupe dock and the Corrections station already call,
		   so a hotkey and a press cannot diverge (N.111-3b: one stack extended,
		   never a second one added).

		   IT RUNS WITH NO LOUPE OPEN, which is why it sits above the `cursor`
		   test rather than inside the switch. The Undo pill in the drawer has
		   never needed a taken note and neither does this.

		   AN EMPTY STACK IS NOT CLAIMED. With nothing to undo the event is left
		   alone rather than swallowed, so anything else on the page that wants
		   Cmd-Z still gets it. */
		if ((e.metaKey || e.ctrlKey) && !e.altKey) {
			const k = e.key.toLowerCase();
			const redo = (k === 'z' && e.shiftKey) || (k === 'y' && !e.shiftKey);
			const undo = k === 'z' && !e.shiftKey;
			if (redo && d.canRedo()) {
				d.redo();
				e.preventDefault();
				return;
			}
			if (undo && d.canUndo()) {
				d.undo();
				e.preventDefault();
				return;
			}
		}

		if (!d.cursor()) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;
		/* Calm-loupe slice 1: in Syllables mode only the moves act (`LoupePanel.musicKeys`). */
		if (!d.musicKeys() && !['ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) return;

		switch (e.key) {
			case 'ArrowUp':
				if (d.inGap()) return;
				e.shiftKey ? d.octave(1) : d.step(1);
				break;
			case 'ArrowDown':
				if (d.inGap()) return;
				e.shiftKey ? d.octave(-1) : d.step(-1);
				break;
			case '+':
			case '=':
				if (d.inGap()) return;
				d.semitone(1);
				break;
			case '-':
			case '_':
				if (d.inGap()) return;
				d.semitone(-1);
				break;
			case 'ArrowLeft':
				d.move(-1);
				break;
			case 'ArrowRight':
				d.move(1);
				break;
			case '.':
				d.dotCell();
				break;
			case 'Delete':
			case 'Backspace':
				if (d.inGap()) return;
				d.deleteNote();
				break;
			case 'Escape':
				d.dismiss();
				break;
			default:
				if (DIGIT_BASE[e.key]) d.durationCell(DIGIT_BASE[e.key]);
				else return;
		}
		// Reached only where a branch above acted, so a key this surface does
		// not claim still reaches the rest of the app.
		e.preventDefault();
	};
}
