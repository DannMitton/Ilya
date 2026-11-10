/**
 * ROW 179, STEP 2: THE PERSONAL GLOSSARY, the reactive half (`glossary.ts` is the pure one).
 *
 * `get` reads the page's `$state`, so a word's gloss, and the offer under the
 * Inspector's field, follow a change at once. A change is committed to memory
 * only after the device has kept it: where storage refuses, the entry is not
 * made, the `Outcome` says why, and the offer stays open (brief, step 3).
 */
import type { Language } from '$lib/i18n';
import type { Outcome } from '$lib/library/types';
import type { GlossaryLookup } from './gloss-edit';
import { deviceStorage, glossaryKey, readGlossary, writeGlossary } from './glossary';

export class GlossaryStore implements GlossaryLookup {
	private entries = $state<ReadonlyMap<string, string>>(new Map());
	private readonly storage: Storage | undefined;

	constructor(storage: Storage | undefined = deviceStorage()) {
		this.storage = storage;
		this.entries = readGlossary(storage);
	}

	get(lemma: string, form: string, language: Language): string | undefined {
		return this.entries.get(glossaryKey(lemma, form, language));
	}

	/** Keep `gloss` for this word in `language`. An empty gloss is not a glossary entry. */
	set(lemma: string, form: string, language: Language, gloss: string): Outcome {
		if (gloss === '') return this.remove(lemma, form, language);
		const next = new Map(this.entries);
		next.set(glossaryKey(lemma, form, language), gloss);
		return this.commit(next);
	}

	/** Forget this word in `language`, leaving every song as it is. */
	remove(lemma: string, form: string, language: Language): Outcome {
		const key = glossaryKey(lemma, form, language);
		if (!this.entries.has(key)) return { ok: true };
		const next = new Map(this.entries);
		next.delete(key);
		return this.commit(next);
	}

	private commit(next: Map<string, string>): Outcome {
		const outcome = writeGlossary(this.storage, next);
		if (outcome.ok) this.entries = next;
		return outcome;
	}
}
