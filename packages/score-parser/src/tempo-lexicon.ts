/**
 * Five-language tempo lexicon: English, French, German, Italian, Russian.
 *
 * Dann, 2026-07-31: *"We should consider adding French and German tempo
 * expressions... I'm thinking at most maybe 200 terms for all five languages?"*
 * That estimate was the right order. This table is roughly 90 head-term aliases
 * plus abbreviations, which at ~100 bytes each is about 20 KB — against a 96 MB
 * dictionary, not a payload question.
 *
 * ── What this module does, and deliberately does NOT do ───────────────
 *
 * It maps a foreign tempo word onto the **Italian head term** that
 * `tempo-terms.ts` already classifies. It assigns no tiers and no bpm of its own.
 * That matters: the tier membership is SOURCED from Quantz via Schilling, and a
 * translation table that invented its own tiers would quietly detach the numbers
 * from their source. Every entry here is a claim about *language*, not about
 * *speed*, and the speed continues to come from one sourced place.
 *
 * ── Why the matching is Unicode-aware ─────────────────────────────────
 *
 * MEASURED 2026-07-31: JavaScript's `\b` is ASCII-only, so `/\bочень\b/` and
 * `/\btrès\b/` never match. A five-language table cannot use `\b` at all — the
 * bug would have made every Russian and every accented entry silently invisible,
 * and it would have looked like the words simply weren't in the table.
 *
 * ── Scope, stated in both directions ──────────────────────────────────
 *
 * Dann, 2026-07-31: *"most Russian composers use Italian tempo markings. Those
 * who don't often see their scores published in editorial versions where Italian
 * is offered. We can't do all the work for the user."* So the Russian entries
 * will fire rarely; they are here for Prokofiev, Shostakovich, and Sviridov, who
 * do mark in Russian. The high-frequency win is the Italian modifiers, which are
 * handled in `tempo-seam.ts` and fire on nearly every marking.
 *
 * NOT covered: expression marks (cantabile, con dolore, sordo), which state
 * character rather than speed. MEASURED on the six-song corpus: 5 of 31 printed
 * directions are expression marks, and no tempo lexicon of any size should
 * resolve them.
 */

/** ISO-ish language tags, for reporting which language a marking was read in. */
export type TempoLanguage = 'it' | 'de' | 'fr' | 'en' | 'ru';

interface LexEntry {
	/** The Italian head term `tempo-terms.ts` already knows. */
	head: string;
	lang: TempoLanguage;
	/** Surface forms, lowercase. Matched whole-word, Unicode-aware. */
	forms: string[];
}

/**
 * Foreign surface forms → Italian head term.
 *
 * JUDGEMENT throughout: these are translation equivalences, and translation
 * between tempo vocabularies is approximate by nature. German *mäßig* is not
 * exactly *moderato*, but it is far closer to it than to anything else in the
 * table, and mapping it there is better than abstaining on a marking the singer
 * can plainly read.
 */
const LEXICON: LexEntry[] = [
	// ── slow ──
	{ head: 'grave', lang: 'de', forms: ['schwer', 'gewichtig'] },
	{ head: 'grave', lang: 'fr', forms: ['grave', 'pesant'] },
	{ head: 'largo', lang: 'de', forms: ['breit'] },
	{ head: 'largo', lang: 'fr', forms: ['large'] },
	{ head: 'largo', lang: 'en', forms: ['broad', 'broadly'] },
	{ head: 'largo', lang: 'ru', forms: ['широко'] },
	{ head: 'lento', lang: 'de', forms: ['langsam'] },
	{ head: 'lento', lang: 'fr', forms: ['lent', 'lentement'] },
	{ head: 'lento', lang: 'en', forms: ['slow', 'slowly'] },
	{ head: 'lento', lang: 'ru', forms: ['медленно', 'протяжно'] },
	{ head: 'adagio', lang: 'de', forms: ['sehr langsam', 'getragen'] },
	{ head: 'adagio', lang: 'fr', forms: ['très lent'] },
	{ head: 'adagio', lang: 'en', forms: ['very slow'] },
	{ head: 'adagio', lang: 'ru', forms: ['очень медленно'] },
	{ head: 'larghetto', lang: 'de', forms: ['etwas langsam'] },
	{ head: 'larghetto', lang: 'fr', forms: ['un peu lent'] },

	// ── moderate ──
	{ head: 'andante', lang: 'de', forms: ['gehend', 'schreitend'] },
	{ head: 'andante', lang: 'fr', forms: ['allant'] },
	{ head: 'andante', lang: 'en', forms: ['walking', 'flowing'] },
	{ head: 'andante', lang: 'ru', forms: ['не спеша', 'спокойно'] },
	{ head: 'moderato', lang: 'de', forms: ['mäßig', 'massig', 'mässig', 'gemäßigt'] },
	{ head: 'moderato', lang: 'fr', forms: ['modéré', 'modere', 'modérément'] },
	{ head: 'moderato', lang: 'en', forms: ['moderate', 'moderately'] },
	{ head: 'moderato', lang: 'ru', forms: ['умеренно'] },
	{ head: 'allegretto', lang: 'de', forms: ['etwas lebhaft'] },
	{ head: 'allegretto', lang: 'fr', forms: ['un peu animé'] },
	{ head: 'maestoso', lang: 'de', forms: ['majestätisch', 'majestatisch'] },
	{ head: 'maestoso', lang: 'fr', forms: ['majestueux'] },
	{ head: 'maestoso', lang: 'ru', forms: ['величественно'] },

	// ── fast ──
	{ head: 'allegro', lang: 'de', forms: ['schnell', 'lebhaft', 'munter'] },
	{ head: 'allegro', lang: 'fr', forms: ['vite', 'animé', 'anime', 'gai'] },
	{ head: 'allegro', lang: 'en', forms: ['fast', 'quick', 'quickly', 'lively', 'brisk'] },
	{ head: 'allegro', lang: 'ru', forms: ['скоро', 'быстро', 'живо', 'оживлённо', 'оживленно'] },
	{ head: 'vivace', lang: 'de', forms: ['sehr lebhaft', 'bewegt'] },
	{ head: 'vivace', lang: 'fr', forms: ['vif', 'vivement'] },
	{ head: 'vivace', lang: 'en', forms: ['vivacious'] },
	{ head: 'vivace', lang: 'ru', forms: ['подвижно'] },
	{ head: 'presto', lang: 'de', forms: ['sehr schnell', 'eilig', 'geschwind'] },
	{ head: 'presto', lang: 'fr', forms: ['très vite', 'tres vite'] },
	{ head: 'presto', lang: 'en', forms: ['very fast'] },
	{ head: 'presto', lang: 'ru', forms: ['очень быстро'] },
	{ head: 'prestissimo', lang: 'de', forms: ['äußerst schnell'] },
];

/** Italian abbreviations, which appear constantly in engraved parts. */
const ABBREVIATIONS: Record<string, string> = {
	'allo': 'allegro',
	'allto': 'allegretto',
	'andte': 'andante',
	'andno': 'andantino',
	'modto': 'moderato',
	'lgo': 'largo',
	'adgo': 'adagio',
	'presto.': 'presto',
};

// `\b` is ASCII-only; a five-language table must not use it. See the header.
const NOT_LETTER_BEFORE = '(?<!\\p{L})';
const NOT_LETTER_AFTER = '(?!\\p{L})';

function wholeWord(form: string): RegExp {
	// Escape regex metacharacters, then allow flexible internal whitespace.
	const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
	return new RegExp(`${NOT_LETTER_BEFORE}(?:${escaped})${NOT_LETTER_AFTER}`, 'iu');
}

interface CompiledEntry {
	re: RegExp;
	head: string;
	lang: TempoLanguage;
	/** Longer surface forms are tried first: "sehr langsam" must beat "langsam". */
	length: number;
}

const COMPILED: CompiledEntry[] = LEXICON.flatMap((e) =>
	e.forms.map((f) => ({ re: wholeWord(f), head: e.head, lang: e.lang, length: f.length })),
).sort((a, b) => b.length - a.length);

const COMPILED_ABBREV: CompiledEntry[] = Object.entries(ABBREVIATIONS)
	.map(([form, head]) => ({ re: wholeWord(form), head, lang: 'it' as TempoLanguage, length: form.length }))
	.sort((a, b) => b.length - a.length);

export interface LexiconHit {
	/** The Italian head term to hand to `resolveTempoTerm`. */
	head: string;
	/** Which language the marking was read in. */
	language: TempoLanguage;
}

/**
 * Read a printed marking in any of the five languages and return the Italian
 * head term it corresponds to, or `undefined` when nothing matches.
 *
 * Longest surface form wins, so "sehr langsam" resolves to *adagio* rather than
 * being caught by "langsam" as *lento*. That ordering is load-bearing: without
 * it a two-word German marking silently degrades to its weaker half.
 */
export function lookupTempoLexicon(text: string): LexiconHit | undefined {
	if (typeof text !== 'string' || text.length === 0) return undefined;
	for (const e of COMPILED) {
		if (e.re.test(text)) return { head: e.head, language: e.lang };
	}
	for (const e of COMPILED_ABBREV) {
		if (e.re.test(text)) return { head: e.head, language: e.lang };
	}
	return undefined;
}

/** Every head term the lexicon can produce, for a coverage test. */
export function lexiconHeadTerms(): string[] {
	return [...new Set([...LEXICON.map((e) => e.head), ...Object.values(ABBREVIATIONS)])].sort();
}

/** How many surface forms the lexicon carries, for the payload claim. */
export function lexiconSize(): { forms: number; heads: number; languages: number } {
	const forms = LEXICON.reduce((n, e) => n + e.forms.length, 0) + Object.keys(ABBREVIATIONS).length;
	return { forms, heads: lexiconHeadTerms().length, languages: new Set(LEXICON.map((e) => e.lang)).size + 1 };
}
