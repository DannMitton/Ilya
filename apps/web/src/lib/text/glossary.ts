/**
 * ROW 179, STEP 2: THE PERSONAL GLOSSARY, the pure half.
 *
 * Brief: `docs/sessions/brief-code-gloss-language-and-reuse_r3_2026-11-03.md`.
 * What a singer typed for a word in one song, kept for the same word in her
 * other songs. It lives in this browser's `localStorage` and nowhere else:
 * never in a song record, never in a binder, never on the network (brief,
 * amendment 10). DESK DEFAULT: one glossary per device, not per named voice.
 *
 * KEYED by (lemma, language), with the word form (`glossAnchorForm`) standing
 * in where the dictionary found no lemma. A lemma-keyed entry therefore reads
 * on every inflected form of the word, including one the singer did not write
 * it for; it fills a gloss only where the dictionary's own is empty
 * (`glossFor`, `gloss-edit.ts`) and never replaces one.
 *
 * THE STORE follows `voice/profileStore.ts`: a versioned key, a save that
 * returns an `Outcome` and never throws, and an empty glossary where storage
 * is refused. The copy of the failure test is deliberate, as that file's is.
 */
import type { Language } from '$lib/i18n';
import type { Outcome } from '$lib/library/types';
import { glossAnchorForm } from './gloss-survival';

export const GLOSSARY_KEY = 'ilya.glossary.v1';

/** The stored shape: a version and the entries, each `[kind, word, language, gloss]`. */
interface StoredGlossary {
	version: 1;
	entries: [kind: 'lemma' | 'form', word: string, language: Language, gloss: string][];
}

/**
 * THE ONE LEMMA THE DICTIONARY OVERUSES. Measured 2026-11-10 on the shipped
 * dictionary (`dictionary.86d83340-a.json` and `-b`): every personal pronoun
 * (ты, он, она, мы, вы, они, меня, тебя, нас, вас, его, ей, им, and the rest of
 * the table) carries the lemma `я`. Keyed by that lemma, a French "vous" typed
 * for вас would fill "я", "ты", "он", and every other pronoun form. So a word
 * whose lemma is `я` is keyed by its own form. DESK DEFAULT; the cost is that a
 * pronoun's gloss does not travel to its other cases. Other lemmas measured
 * sound (дому, дома, домах read дом).
 */
const OVERUSED_LEMMA = 'я';

/** The map key for a word in a language: its lemma where the dictionary has a sound one, else its form. */
export function glossaryKey(lemma: string, form: string, language: Language): string {
	const l = glossAnchorForm(lemma.trim());
	return l !== '' && l !== OVERUSED_LEMMA ? `${language}|lemma|${l}` : `${language}|form|${glossAnchorForm(form)}`;
}

/** The glossary as a map of key to gloss. Anything unreadable is an empty glossary, never an error. */
export function parseGlossary(raw: string | null): Map<string, string> {
	const out = new Map<string, string>();
	if (!raw) return out;
	try {
		const stored = JSON.parse(raw) as Partial<StoredGlossary>;
		if (stored?.version !== 1 || !Array.isArray(stored.entries)) return out;
		for (const row of stored.entries) {
			if (!Array.isArray(row)) continue;
			const [kind, word, language, gloss] = row;
			if ((kind !== 'lemma' && kind !== 'form') || typeof word !== 'string' || word === '') continue;
			if ((language !== 'en' && language !== 'fr') || typeof gloss !== 'string' || gloss === '') continue;
			out.set(`${language}|${kind}|${word}`, gloss);
		}
	} catch {
		// A damaged entry costs her the glossary on this device, not the page.
	}
	return out;
}

export function serializeGlossary(entries: ReadonlyMap<string, string>): string {
	const rows: StoredGlossary['entries'] = [];
	for (const [key, gloss] of entries) {
		const [language, kind, ...word] = key.split('|') as [Language, 'lemma' | 'form', ...string[]];
		rows.push([kind, word.join('|'), language, gloss]);
	}
	return JSON.stringify({ version: 1, entries: rows } satisfies StoredGlossary);
}

/** `localStorage`, or nothing where the browser refuses even to hand it over (some privacy settings). */
export function deviceStorage(): Storage | undefined {
	try {
		return typeof window === 'undefined' ? undefined : window.localStorage;
	} catch {
		return undefined;
	}
}

export function readGlossary(storage: Pick<Storage, 'getItem'> | undefined): Map<string, string> {
	if (!storage) return new Map();
	try {
		return parseGlossary(storage.getItem(GLOSSARY_KEY));
	} catch {
		return new Map();
	}
}

/** Write the whole glossary. Never throws: the reason says why the device refused. */
export function writeGlossary(storage: Pick<Storage, 'setItem'> | undefined, entries: ReadonlyMap<string, string>): Outcome {
	if (!storage) return { ok: false, reason: 'no-storage' };
	try {
		storage.setItem(GLOSSARY_KEY, serializeGlossary(entries));
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			reason: err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22) ? 'quota-exceeded' : 'write-failed',
		};
	}
}
