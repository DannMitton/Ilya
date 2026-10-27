/**
 * N.194 r5, step 4: the Loupe's break button. What the pill reads, and what a press does.
 *
 * Everything the press needs arrives as an argument, so the page receives wiring lines only (`+page.svelte`
 * builds `BreakInput` from its own state and hands the hooks in). The state is ONE source of truth, the
 * engine's verdict on the unit's last word, with no second copy of any punctuation pattern:
 *
 * - `'off'`    no note selected; the note carries a melisma or an empty mark, or no pairing, or is a tie's
 *              continuation (not a syllable target); `lines` is empty (Lyrics holds no transcribed text and the
 *              queue is the score's own, so a `#` written into an empty Lyrics would seat the song from new
 *              text); or the unit's last word is already `hard` from a source the singer did not set
 *              (punctuation, a line's end, a rest the score places), which also sets `implied`.
 * - `'remove'` the unit's last word is the singer's boundary (`boundarySource === 'user'`), whether the singer
 *              typed it, this button wrote it, or a score brought it (Dann 2026-10-25 23:52 (a)).
 * - `'insert'` otherwise. A spaced dash is not a hard boundary, so the pill is on before one (Dann 23:53).
 *
 * A PRESS (amendment 1) pushes one undo entry BEFORE it writes, carrying the Lyrics text, then writes the next
 * text through the one path that transcribes, and only afterwards moves the selection to the note that carries
 * the unit's terminal syllable. Never `doc.inputText = ...`: nothing re-runs the pipeline on that assignment.
 */
import type { BreakControl } from '$lib/score/placement-scope';
import type { PairingMap, Slot, SlotOrigin } from '$lib/score/pairings';
import type { UndoNote } from '$lib/score/undo-history.svelte';
import type { LineData } from '$lib/types';
import { insertBreak, removeBreak, unitStart } from './break-text';
import { breakTarget } from './syntactic-break-unit';
import { unitWordsFromStacks } from './syntactic-break-adapters';

/** What the press reads of the page. */
export interface BreakInput {
	/** The Lyrics text (`doc.inputText`). */
	text: string;
	/** The transcription of that text (`lines`), not the score's own queue. */
	lines: readonly LineData[];
	/** The slot queue the Loupe draws (`slotQueue`): the jump reads this, not a second walk of the words. */
	slots: readonly Slot[];
	/** `doc.pairings`. */
	pairings: PairingMap;
	selectedEventId: string | null;
	/** The notes that may carry a syllable (`syllableTargetIds`); a tie's continuation is not one. */
	targetIds: readonly string[];
}

/** What the press does to the page. */
export interface BreakHooks {
	/** The Undo's `push`, with the Lyrics text asked for. */
	push: (note: UndoNote, options: { inputText: true }) => void;
	/** `handleInput(text, 'paste')`: the one write that transcribes. */
	write: (text: string) => void;
	/** `doc.pairings` as it stands NOW, after the transcription has run. */
	pairings: () => PairingMap;
	/** Move the Loupe's selection to a note. */
	select: (eventId: string) => void;
}

interface Resolved {
	state: 'insert' | 'remove' | 'off';
	implied: boolean;
	lineIndex: number;
	first: number;
	end: number;
	landing: SlotOrigin;
}

/** The unit the selected note's syllable belongs to, and what the pill reads there. Null where the pill is off for a cause that shows no reason. */
function resolve(input: BreakInput): Resolved | null {
	const { selectedEventId, lines, slots, pairings } = input;
	if (selectedEventId === null || lines.length === 0) return null;
	if (!input.targetIds.includes(selectedEventId)) return null;
	const pairing = pairings[selectedEventId];
	if (pairing?.kind !== 'syllable') return null;
	const o = pairing.origin;
	const tapped = slots.findIndex(
		(s) => s.origin.lineIndex === o.lineIndex && s.origin.wordIndex === o.wordIndex && s.origin.slotIndex === o.slotIndex && s.origin.word === o.word,
	);
	if (tapped === -1) return null;
	const units = lines.map((line) => unitWordsFromStacks(line.words));
	const target = breakTarget(units, slots, tapped);
	if (!target) return null;
	const word = lines[target.lineIndex].words[target.wordIndex];
	const first = unitStart(units[target.lineIndex], target.wordIndex);
	const landing = slots[target.slotIndex].origin;
	const base = { lineIndex: target.lineIndex, first, end: target.wordIndex, landing };
	if (word.boundarySource === 'user') return { ...base, state: 'remove', implied: false };
	if (word.rightBoundary === 'hard') return { ...base, state: 'off', implied: true };
	return { ...base, state: 'insert', implied: false };
}

/** The note whose pairing carries a slot's origin, or null where that syllable is not placed on a note. */
export function noteOfOrigin(pairings: PairingMap, origin: SlotOrigin): string | null {
	for (const [id, p] of Object.entries(pairings)) {
		if (p.kind !== 'syllable') continue;
		const q = p.origin;
		if (q.lineIndex === origin.lineIndex && q.wordIndex === origin.wordIndex && q.slotIndex === origin.slotIndex && q.word === origin.word) return id;
	}
	return null;
}

/** What the pill reads, without the press. */
export function breakState(input: BreakInput): Pick<BreakControl, 'state' | 'implied'> {
	const r = resolve(input);
	return { state: r?.state ?? 'off', implied: r?.implied ?? false };
}

/**
 * The text the press would write and the sentence its undo entry reads, or null where the pill is off.
 * Exposed so a test can ask what a press does without a page.
 */
export function planBreak(input: BreakInput): { text: string; note: UndoNote; landing: SlotOrigin } | null {
	const r = resolve(input);
	if (!r || r.state === 'off') return null;
	const text = r.state === 'insert' ? insertBreak(input.text, r.lineIndex, r.end) : removeBreak(input.text, r.lineIndex, r.first, r.end);
	if (text === null) return null;
	return { text, note: { kind: 'text', key: r.state === 'insert' ? 'loupe.undo.breakPlaced' : 'loupe.undo.breakRemoved' }, landing: r.landing };
}

/**
 * The third pill's entry for `PlacementControls`. A press pushes the undo entry, writes the text through the
 * path that transcribes, and then moves the selection to the note carrying the unit's last syllable. If that
 * syllable is not placed on a note, the selection stays and the `#` is still written.
 */
export function breakControl(input: BreakInput, hooks: BreakHooks): BreakControl {
	return {
		...breakState(input),
		onbreak: () => {
			const plan = planBreak(input);
			if (!plan) return;
			hooks.push(plan.note, { inputText: true });
			hooks.write(plan.text);
			const note = noteOfOrigin(hooks.pairings(), plan.landing);
			if (note) hooks.select(note);
		},
	};
}
