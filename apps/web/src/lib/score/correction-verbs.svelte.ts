/**
 * correction-verbs.svelte.ts — the Correction Station's verbs, and the
 * readings of the taken entry they act on.
 *
 * MOVED OUT OF `+page.svelte` by the audit's phase 4, slice 5, 2026-10-15
 * (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`,
 * `code-audit-correction-station-map_r1_2026-09-27.md` §4). A move, not a
 * change: every verb, every reading, and every undo sentence are the ones
 * the page held at `14e2ff8` (`+page.svelte:787-854` and `:890-1120`).
 *
 * THE SEAM IS A CLASS, as `UndoHistory` and `CorrectionCursor` are. The only
 * state it owns is the armed duration (`armedBase`, `armedDots`), which is
 * `$state` so the DURATION row stays lit as it was. Everything else belongs
 * to the song document, the cursor, or the score, so the page hands in
 * closures over it and the class never learns where it lives. Under vitest
 * the runes are inert (`document.svelte.ts` records why), so the class is
 * tested as a plain class with a fake `doc`.
 *
 * THE READINGS ARE GETTERS, NOT `$derived` FIELDS, for the reason the cursor
 * gives: a getter reads the same answer under vitest and in the browser,
 * where reading `$state` through it is tracked. The page wraps each one the
 * page itself reads in its own `$derived`, so what depends on them re-runs
 * exactly when it did before the move.
 *
 * `pitchLabel` and the language switch come in as closures (`label`, `word`)
 * because `score/` may not import `voice/` or the page's language state.
 */
import type { NoteBase, Pitch, SpellingContext, VocalLineEvent } from '@ilya/score-parser';
import {
	clearCorrection,
	currentDuration,
	currentPitch,
	DIGIT_BASE,
	flatPitch,
	naturalPitch,
	neighbourId,
	octavePitch,
	semitonePitch,
	sharpPitch,
	stepAllowed,
	stepPitch,
	withCorrection,
	type CorrectionMap,
} from './correction';
import {
	arrivalPitch,
	canTie,
	currentTie,
	currentType,
	enterEntry,
	isEnteredId,
	middleLine,
	previousEntry,
	toggleRest,
	toggleTie,
	type Cursor,
} from './entry';
import type { UndoNote } from './undo-history.svelte';

/** The clef in force, as `arrivalPitch` and `middleLine` read it. */
type Clef = { sign: 'G' | 'F' | 'C'; octaveChange?: number };

export interface CorrectionVerbsDeps {
	corrections: () => CorrectionMap;
	setCorrections: (next: CorrectionMap) => void;
	/** The line as the page draws it, corrections applied. */
	line: () => VocalLineEvent[];
	/** The line as the reader read it, before any hand correction. */
	readLine: () => VocalLineEvent[];
	cursor: () => Cursor | null;
	inGap: () => boolean;
	selectedEventId: () => string | null;
	setCursor: (next: Cursor | null) => void;
	/** Moves the selection off a deleted note (`CorrectionCursor.selectedEventId`). */
	selectEntry: (id: string | null) => void;
	/** The key in force in one measure, from the parsers' per-measure snapshot. */
	keyOf: (measureIndex: number) => SpellingContext['key'];
	clef: () => Clef | undefined;
	label: (p: Pitch) => string;
	/** A string from the table, in the language in force. */
	word: (key: string) => string;
	pushUndo: (note: UndoNote) => void;
}

/** The seven duration words the surface ships, by base (the 32nd and 64th since N.183). */
const DURATION_KEY: Partial<Record<NoteBase, string>> = {
	'64th': 'correct.len64th', '32nd': 'correct.len32nd',
	'16th': 'correct.len16th',
	eighth: 'correct.len8th',
	quarter: 'correct.lenQuarter',
	half: 'correct.lenHalf',
	whole: 'correct.lenWhole',
};

export class CorrectionVerbs {
	/* THE ARMED DURATION, which is what a gap has instead of a selection.
	   Speedy arms a value and types it; the brief asks for a rest "of the lit
	   duration", so something has to be lit when no entry is taken. Tapping a
	   value both arms it and enters it, so the armed value is always the last
	   one the singer used and the row is never lit at nothing. */
	armedBase = $state<NoteBase>('quarter');
	armedDots = $state(0);

	readonly #d: CorrectionVerbsDeps;

	constructor(deps: CorrectionVerbsDeps) {
		this.#d = deps;
	}

	/* ── THE READINGS ─────────────────────────────────────────────────── */

	get selectedEvent(): VocalLineEvent | undefined {
		const id = this.#d.selectedEventId();
		return id ? this.#d.line().find((ev) => ev.id === id) : undefined;
	}

	/** The pitch a note entered at the bar would arrive at. */
	get arrival(): Pitch {
		const cursor = this.#d.cursor();
		return cursor
			? arrivalPitch(this.#d.line(), cursor, this.#d.clef())
			: middleLine(this.#d.clef());
	}

	/** The entry the bar follows, which the gap sentence and PITCH label name. */
	get gapAnchor(): VocalLineEvent | null {
		const cursor = this.#d.cursor();
		return cursor ? previousEntry(this.#d.line(), cursor) : null;
	}

	get selectedLabel(): string | null {
		const ev = this.selectedEvent;
		if (!ev) return null;
		const p = currentPitch(ev, this.#d.corrections());
		return p ? this.#d.label(p) : null;
	}

	get selectedBase(): NoteBase | null {
		const ev = this.selectedEvent;
		return ev ? currentDuration(ev, this.#d.corrections()).base : null;
	}

	get selectedDots(): number {
		const ev = this.selectedEvent;
		return ev ? currentDuration(ev, this.#d.corrections()).dots : 0;
	}

	get selectedDotted(): boolean {
		return this.selectedDots > 0;
	}

	/* THE PER-NOTE RESTORE, back by Dann's ruling of 2026-08-27 and re-homed
	   into the shared surface, so both containers carry it. It clears every
	   correction on ONE note at once, which the named Undo pill cannot do: the
	   pill reverses the LAST verb, and this reverses all of them on one entry.

	   IT IS OFFERED ONLY WHERE THERE IS SOMETHING TO RESTORE TO. A hand-entered
	   entry's record IS the entry, so clearing it would delete the note rather
	   than restore it, and Delete is the verb for that and says so. The test is
	   therefore a correction on an entry the READ still carries. */
	get restoreAvailable(): boolean {
		const id = this.#d.selectedEventId();
		return !this.#d.inGap() && !!id && id in this.#d.corrections() && !isEnteredId(id);
	}

	/** Whether the taken entry may start a tie: Gould's conditions, in code. */
	get tieAvailable(): boolean {
		const id = this.#d.selectedEventId();
		return !this.#d.inGap() && !!id && canTie(this.#d.line(), this.#d.corrections(), id);
	}

	get selectedIsRest(): boolean {
		const ev = this.selectedEvent;
		return ev ? currentType(ev, this.#d.corrections()) === 'rest' : false;
	}

	get selectedTied(): boolean {
		const ev = this.selectedEvent;
		return ev ? currentTie(ev, this.#d.corrections()) : false;
	}

	durationWord = (base: NoteBase): string => {
		const key = DURATION_KEY[base];
		return key ? this.#d.word(key) : base;
	};

	/* ── THE VERBS. Arrow fields, so the page can hand them to a component
	   as they are, without a wrapper to keep `this`. ───────────────────── */

	#correct(change: Parameters<typeof withCorrection>[2]): void {
		const id = this.#d.selectedEventId();
		if (!id) return;
		this.#d.setCorrections(withCorrection(this.#d.corrections(), id, change));
	}

	handleStep = (direction: 1 | -1): void => {
		const ev = this.selectedEvent;
		const p = ev && currentPitch(ev, this.#d.corrections());
		const next = p && stepPitch(p, direction);
		if (!p || !next || !stepAllowed(p, next)) return;
		this.#d.pushUndo({ kind: 'change', from: this.#d.label(p), to: this.#d.label(next) });
		this.#correct({ pitch: next });
	};

	handleOctave = (direction: 1 | -1): void => {
		const ev = this.selectedEvent;
		const p = ev && currentPitch(ev, this.#d.corrections());
		const next = p && octavePitch(p, direction);
		if (!p || !next || !stepAllowed(p, next)) return;
		this.#d.pushUndo({ kind: 'change', from: this.#d.label(p), to: this.#d.label(next) });
		this.#correct({ pitch: next });
	};

	/* N.92 slice 2. The context the spelling policy reads: the key in force in
	   this note's own measure, and the note before it in the line.

	   THE KEY COMES FROM THE MEASURE, not from the score's first key
	   signature, so a mid-score change of key spells the notes after it
	   correctly. `Measure.keySignature` is snapshotted per measure by the
	   parsers, which is what makes that a lookup rather than a scan.

	   The previous note is read by the policy ONLY where a score carries no key
	   at all. It is passed anyway, because working it out here costs one
	   lookup and leaves the policy with everything its own fallback needs. */
	#spellingContextFor(ev: VocalLineEvent): SpellingContext {
		const key = this.#d.keyOf(ev.measureIndex);
		const readLine = this.#d.readLine();
		const previousId = neighbourId(readLine, this.#d.corrections(), ev.id, -1);
		const previousEvent = previousId ? readLine.find((e) => e.id === previousId) : undefined;
		const previous = previousEvent ? currentPitch(previousEvent, this.#d.corrections()) : undefined;
		return { ...(key ? { key } : {}), ...(previous ? { previous } : {}) };
	}

	handleSemitone = (direction: 1 | -1): void => {
		const ev = this.selectedEvent;
		const p = ev && currentPitch(ev, this.#d.corrections());
		const next = p && ev && semitonePitch(p, direction, this.#spellingContextFor(ev));
		if (!p || !next || !stepAllowed(p, next)) return;
		this.#d.pushUndo({ kind: 'change', from: this.#d.label(p), to: this.#d.label(next) });
		this.#correct({ pitch: next });
	};

	/* The accidental verbs. Cumulative, capped at doubles, and the policy is
	   NOT consulted: a spelling the singer chose by hand is the answer, and
	   nothing re-spells it afterwards. */
	handleAccidental = (kind: 'flat' | 'natural' | 'sharp'): void => {
		const ev = this.selectedEvent;
		const p = ev && currentPitch(ev, this.#d.corrections());
		if (!p) return;
		const next =
			kind === 'flat' ? flatPitch(p) : kind === 'sharp' ? sharpPitch(p) : naturalPitch(p);
		// A capped click returns the same pitch, so the map is left alone and no
		// correction is recorded for a decision that changed nothing. The stack
		// stays out of it for the same reason: a pill offering to reverse a
		// change that never happened would be a lie.
		if (next === p) return;
		this.#d.pushUndo({ kind: 'change', from: this.#d.label(p), to: this.#d.label(next) });
		this.#correct({ pitch: next });
	};

	handleBase = (base: (typeof DIGIT_BASE)[string]): void => {
		const ev = this.selectedEvent;
		const from = ev ? currentDuration(ev, this.#d.corrections()).base : null;
		if (from && from !== base) {
			this.#d.pushUndo({ kind: 'change', from: this.durationWord(from), to: this.durationWord(base) });
		}
		this.#correct({ base });
	};

	handleDot = (): void => {
		const ev = this.selectedEvent;
		if (!ev) return;
		const on = currentDuration(ev, this.#d.corrections()).dots > 0;
		this.#d.pushUndo({ kind: 'text', key: on ? 'loupe.undo.dotOff' : 'loupe.undo.dotOn' });
		this.#correct({ dots: on ? 0 : 1 });
	};

	handleDeleteNote = (): void => {
		const id = this.#d.selectedEventId();
		if (!id) return;
		// Move the selection off the note before removing it, so the singer is
		// left somewhere rather than nowhere. Forward first, then back, because
		// a run of false positives is usually deleted left to right.
		const readLine = this.#d.readLine();
		const next =
			neighbourId(readLine, this.#d.corrections(), id, 1) ??
			neighbourId(readLine, this.#d.corrections(), id, -1);
		this.#d.pushUndo({ kind: 'text', key: 'loupe.undo.deleted' });
		this.#d.setCorrections(withCorrection(this.#d.corrections(), id, { deleted: true }));
		this.#d.selectEntry(next);
	};

	handleRestoreNote = (): void => {
		const id = this.#d.selectedEventId();
		if (!id || !this.restoreAvailable) return;
		this.#d.pushUndo({ kind: 'text', key: 'loupe.undo.restored' });
		this.#d.setCorrections(clearCorrection(this.#d.corrections(), id));
	};

	/* ── THE ENTRY GRAMMAR (N.92 slice 3) ────────────────────────────────
	   Speedy under touch. Every one of these acts through `entry.ts`, which is
	   pure and tested, so what this file holds is the wiring and the undo
	   sentence and nothing else. */

	/**
	 * A duration cell. In a gap it ENTERS an entry; on one it re-times it.
	 *
	 * THE ARRIVAL PITCH IS THE RULING, Dann 2026-08-25: a fresh note takes the
	 * previous entry's pitch and the pitch verbs finish it, and where the part
	 * has no previous entry it arrives on the staff's middle line.
	 *
	 * THIS DEPARTS FROM THE SCHEMATIC'S §4 ON PURPOSE. That section reads
	 * Speedy strictly, where a duration typed in a gap with no pitch enters a
	 * REST. The brief of 2026-08-26 rules the other way for this surface: a
	 * duration enters a NOTE at the arrival pitch, and Rest is the cell that
	 * enters a rest. The brief is the later instruction and it is the one
	 * built; the divergence is named in the memo rather than buried.
	 */
	handleDurationCell = (base: NoteBase): void => {
		this.armedBase = base;
		const c = this.#d.cursor();
		if (!c || !this.#d.inGap()) {
			this.handleBase(base);
			return;
		}
		const { map, id } = enterEntry(this.#d.corrections(), c, {
			base,
			dots: this.armedDots,
			pitch: this.arrival,
		});
		this.#d.pushUndo({ kind: 'text', key: 'loupe.undo.entered' });
		this.#d.setCorrections(map);
		this.#d.setCursor({ kind: 'entry', id });
	};

	/**
	 * The dot, CUMULATIVE, ruled by Dann 2026-08-27: dot, double dot, none, the
	 * accidental verbs' own grammar. It is an action rather than a state, which
	 * is why it carries no `aria-pressed` reading of "on"; what the entry shows
	 * is on the readout, spelled out.
	 *
	 * IN A GAP IT ARMS the same three states, so the value a fresh entry takes
	 * is the value the row is lit at.
	 */
	handleDotCell = (): void => {
		if (this.#d.inGap()) {
			this.armedDots = (this.armedDots + 1) % 3;
			return;
		}
		const ev = this.selectedEvent;
		if (!ev) return;
		const now = currentDuration(ev, this.#d.corrections()).dots;
		const next = (now + 1) % 3;
		this.#d.pushUndo({
			kind: 'text',
			key: next === 1 ? 'loupe.undo.dotOn' : next === 2 ? 'loupe.undo.dotDouble' : 'loupe.undo.dotOff',
		});
		this.#correct({ dots: next });
	};

	/**
	 * Rest. In a gap it enters one; on an entry it converts, both ways.
	 *
	 * ONE VERB, BOTH DIRECTIONS, because the singer's question is the same in
	 * both: is there a sound here. A rest converted back returns the note that
	 * was there rather than the arrival guess, which `entry.ts` remembers.
	 */
	handleRest = (): void => {
		const c = this.#d.cursor();
		if (!c) return;
		if (c.kind === 'gap') {
			const { map, id } = enterEntry(this.#d.corrections(), c, {
				base: this.armedBase,
				dots: this.armedDots,
			});
			this.#d.pushUndo({ kind: 'text', key: 'loupe.undo.rest' });
			this.#d.setCorrections(map);
			this.#d.setCursor({ kind: 'entry', id });
			return;
		}
		this.#d.pushUndo({ kind: 'text', key: 'loupe.undo.rest' });
		this.#d.setCorrections(toggleRest(this.#d.corrections(), this.#d.line(), c.id, this.arrival));
	};

	/** Tie, on a note whose neighbour can legally take one. */
	handleTie = (): void => {
		const ev = this.selectedEvent;
		if (!ev || !this.tieAvailable) return;
		this.#d.pushUndo({ kind: 'text', key: 'loupe.undo.tie' });
		this.#d.setCorrections(toggleTie(this.#d.corrections(), ev));
	};
}
