/**
 * time-signature-ui.svelte.ts — the time signature card's state (QUEUE row 138, T1).
 *
 * THE SAME SHAPE AS `clef-ui.svelte.ts` AND `barline-ui.ts`, for the same reason: the Loupe's button and the card sit two components below
 * the page, and `+page.svelte`, `Loupe.svelte`, and `CorrectionSurface.svelte` are at their line ceilings. The page attaches once, with two
 * closures over the verbs (`CorrectionVerbs.heldBar`, `.handleTimeSignature`); everything else is here and in the card.
 *
 * THE FIELDS ARE TEXT until applied: a singer typing a 6 for "Number of beats" and then an 8 for "Beat duration" passes through states that are
 * not time signatures, and nothing is written until she presses the card's one button, so a change is one Undo step ("time signature changed")
 * and never a run of them. Under vitest the runes are inert (`document.svelte.ts` records why).
 */
import { BEAT_TYPES, validSignature, type HeldBar, type Through } from './time-signature';

export interface TimeSignatureUiDeps {
	/** The bar the held entry sits in, with the signatures in play; null where nothing is held. */
	held(id?: string): HeldBar | null;
	/** Write the change: one Undo step. `id` names an entry of the bar when the card was opened from the score, with no note held. */
	commit(sig: { beats: number; beatType: number }, through: Through, id?: string, rebar?: boolean): void;
}

class TimeSignatureUi {
	#deps: TimeSignatureUiDeps | null = null;
	/** The card is up. */
	open = $state(false);
	/** A number input's `bind:value` writes a number, and an empty one writes null: the fields hold what the input gives. */
	beats = $state<number | string | null>('4');
	beatType = $state<number | string | null>('4');
	through = $state<Through>('next');
	/** "Rebar the notes": off by default, and off every time the card opens (Finale's Rebar Music is its own act). */
	rebar = $state(false);
	/** The element that opened the card, so Escape and Cancel give focus back to it. */
	opener: HTMLElement | null = null;

	attach(deps: TimeSignatureUiDeps): void {
		this.#deps = deps;
	}

	/** The entry the card was opened on from the score; null where it was opened on the note held. */
	#id: string | undefined;

	/** The bar the card would change, or null. */
	get held(): HeldBar | null {
		return this.#deps?.held() ?? null;
	}

	/** Open on the held bar, or on the bar of entry `id` (a tap on the time signature drawn on the score), with the signature in force and the scope she last chose in it. */
	show(from: HTMLElement | null = null, id?: string): void {
		const h = this.#deps?.held(id) ?? null;
		if (!h) return;
		this.#id = id;
		this.opener = from;
		this.beats = String(h.signature.beats);
		this.beatType = String(h.signature.beatType);
		this.through = h.mine?.through ?? 'next';
		this.rebar = false;
		this.open = true;
	}

	/** Fill both fields from one of the listed signatures. */
	choose(beats: number, beatType: number): void {
		this.beats = beats;
		this.beatType = beatType;
	}

	get parsed(): { beats: number; beatType: number } {
		return { beats: Number(this.beats), beatType: Number(this.beatType) };
	}

	/** The two fields hold a time signature a bar can be counted in. */
	get valid(): boolean {
		return validSignature(this.parsed.beats, this.parsed.beatType);
	}

	/** The beat durations offered as the typed field's suggestions. */
	readonly beatTypes = BEAT_TYPES;

	close(): void {
		this.open = false;
		const el = this.opener;
		this.opener = null;
		if (el && typeof el.focus === 'function' && el.isConnected) el.focus();
	}

	/** Press the card's one button. */
	apply(): void {
		if (!this.valid) return;
		this.#deps?.commit(this.parsed, this.through, this.#id, this.rebar);
		this.close();
	}
}

export const tsUi = new TimeSignatureUi();
