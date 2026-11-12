/**
 * key-signature-ui.svelte.ts: the key signature card's state (N.192, step 6b), the sibling of `time-signature-ui.svelte.ts`: the Loupe's cell and the
 * card sit below the page, and `+page.svelte`, `Loupe.svelte`, and `CorrectionSurface.svelte` are at their line ceilings, so the page attaches once.
 * The fields are held until applied, so a change is one Undo step ("key changed", or "key change removed"). Under vitest the runes are inert.
 */
import type { HeldKey, KeySpec } from './key-signature';

export interface KeySignatureUiDeps {
	/** The bar the held entry sits in with its key; null where nothing is held. */
	held(id?: string): HeldKey | null;
	/** Write the change, or remove the one the bar opens: one Undo step. */
	commit(spec: KeySpec | 'remove', id?: string): void;
}

class KeySignatureUi {
	#deps: KeySignatureUiDeps | null = null;
	open = $state(false);
	fifths = $state(0);
	through = $state<'next' | 'end'>('next');
	/** "The notes follow the new key": on by default (the scan's case); off is "keep the pitches". */
	follow = $state(true);
	opener: HTMLElement | null = null;
	#id: string | undefined;

	attach(deps: KeySignatureUiDeps): void {
		this.#deps = deps;
	}

	get held(): HeldKey | null {
		return this.#deps?.held() ?? null;
	}

	/** Open on the held bar, with the key in force and the scope last chosen in it. */
	show(from: HTMLElement | null = null, id?: string): void {
		const h = this.#deps?.held(id) ?? null;
		if (!h) return;
		this.#id = id;
		this.opener = from;
		this.fifths = h.fifths;
		this.through = h.mine && h.mine !== 'remove' ? h.mine.through : 'next';
		this.follow = h.mine && h.mine !== 'remove' ? h.mine.notes === 'follow' : true;
		this.open = true;
	}

	/** Whether "Remove this key change" is offered on the bar the card is open on. */
	get canRemove(): boolean {
		return (this.#deps?.held(this.#id) ?? null)?.canRemove ?? false;
	}

	close(): void {
		this.open = false;
		const el = this.opener;
		this.opener = null;
		if (el && typeof el.focus === 'function' && el.isConnected) el.focus();
	}

	apply(): void {
		this.#deps?.commit({ fifths: Number(this.fifths), through: this.through, notes: this.follow ? 'follow' : 'keep' }, this.#id);
		this.close();
	}

	remove(): void {
		this.#deps?.commit('remove', this.#id);
		this.close();
	}
}

export const keyUi = new KeySignatureUi();
