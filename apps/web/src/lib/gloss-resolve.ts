/**
 * Full-gloss resolution with bilateral cross-language fallback (decision E,
 * ratified 2026-06-12).
 *
 * Principle: as a Canadian resource, Ilya treats its two official languages
 * as equals. When the interface language lacks a full gloss for an entry but
 * the other language has one, the other language's gloss is shown, visibly
 * marked with a small-caps language chip (option A). Each language inherits
 * the other's coverage on equal terms; neither is a default.
 *
 * The marker signals language substitution only. Machine-translation origin
 * (the future T siglum) is a separate fact carried by a separate mark.
 */

export type GlossLanguage = 'en' | 'fr';

export interface ResolvedFullGloss {
	/** The gloss text to display. */
	text: string;
	/** The language the text is actually in. */
	source: GlossLanguage;
	/** True when source differs from the interface language. */
	fallback: boolean;
}

/**
 * Resolve the full gloss for an entry in the given interface language.
 * Prefers the interface language's own gloss; falls back to the other
 * language's gloss when the preferred one is absent; returns null when
 * neither exists (caller shows the unavailable message).
 * Pure function; exported for tests.
 */
export function resolveFullGloss(
	entry: { E?: string; F?: string },
	lang: GlossLanguage
): ResolvedFullGloss | null {
	const own = lang === 'fr' ? entry.F : entry.E;
	const other = lang === 'fr' ? entry.E : entry.F;
	if (own) {
		return { text: own, source: lang, fallback: false };
	}
	if (other) {
		return { text: other, source: lang === 'fr' ? 'en' : 'fr', fallback: true };
	}
	return null;
}
