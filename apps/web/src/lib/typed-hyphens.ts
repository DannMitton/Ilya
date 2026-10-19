/**
 * A TYPED HYPHEN INSIDE A WORD IS A SYLLABLE BREAK (QUEUE row 106; ruling
 * default 12 of N.135 stage 3). A singer types Lyrics divided as the score
 * divides them: «ве-ли-кий», «про-гляд-на-я», «бы-ли». Brief:
 * `docs/sessions/brief-code-row106-typed-hyphens_r2_2026-10-19.md`.
 *
 * WHAT THIS MODULE OWNS, and nothing else in the app does:
 *
 * - which characters are a syllable hyphen: `-`, U+2010, U+2011 (the set
 *   `text/poem-compare.ts` already folds). `–` and `—` inside a token keep
 *   today's behaviour: they are dropped from the letters and break nothing.
 * - THE RESOLUTION. A hyphenated token is tried as typed, then joined, then
 *   with some hyphens kept, fewest kept first; the first form the dictionary
 *   holds wins. The joined form is the default reading (every typed hyphen is a
 *   syllable break), so a form that keeps a hyphen as part of the spelling
 *   (кто-то) is the exception, tried first only because a singer who types the
 *   dictionary's own spelling has given the strongest evidence there is.
 *   Nothing resolves: every typed hyphen is a break and the spelling is joined.
 * - THE PARTICLE TEST. A trailing ли, ль, бы, б, же, ж splits off only when the
 *   whole token resolves to no word (`велит-ли`, `места-б`), so «бы-ли» is one.
 * - THE BREAKS, as offsets into the word's letters (`cleanWord` coordinates),
 *   how a part without a vowel is joined to its neighbour, and the cut of the
 *   engine's own syllables along them.
 *
 * The dictionary is reached through `known`, which `pipeline.ts` passes in,
 * because `pipeline.ts` is the one file in the app that imports the engine
 * (the `ne-join.ts` pattern). Nothing here is cached: the dictionary can load
 * after the first call.
 *
 * A resolved word never writes a lexical hyphen into `cleanWord`: that is the
 * identity `wordGrid`, `origin.word`, and a stored gloss's anchor turn on.
 */
import type { SyllableData } from '@ilya/phonology';
import { applySyllableOverride } from './syllable-utils';

/** The characters a singer types as a syllable hyphen. */
const SYLLABLE_HYPHEN = /[-‐‑]/;
const ANY_HYPHEN = /[-‐‑–—]/;
const LETTER = /\p{L}/u;
/** Past this many inner hyphens only the two ends (as typed, joined) are tried: 2^k forms is not a cost worth paying. */
const MAX_PARTIAL_HYPHENS = 10;

const CYRILLIC_VOWEL = /[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/;

/** One typed syllable hyphen: it falls before the letter at `at`, and `ch` is the character the singer typed. */
export interface TypedBreak {
	at: number;
	ch: string;
}

export interface TypedResolution {
	/** The token with its syllable hyphens out and its lexical hyphens (as `-`) in. */
	spelling: string;
	/** Every typed syllable hyphen, in the letter coordinates of `toClean(spelling)`. */
	breaks: TypedBreak[];
	/** False where no candidate was a word and the joined form stands. */
	found: boolean;
}

/** Whether a form is a word Ilya knows, with N.12 and row 25 applied to it. Supplied by `pipeline.ts`. */
export type KnownForm = (form: string) => boolean;

/** Strips what `cleanWord` strips: punctuation and every dash. Supplied by `pipeline.ts`. */
export type ToClean = (s: string) => string;

/** Indices of the hyphens that sit between two letters. */
function innerHyphens(token: string): number[] {
	const chars = Array.from(token);
	const out: number[] = [];
	chars.forEach((c, i) => {
		if (SYLLABLE_HYPHEN.test(c) && i > 0 && i < chars.length - 1 && LETTER.test(chars[i - 1]) && LETTER.test(chars[i + 1])) out.push(i);
	});
	return out;
}

/**
 * Resolves a token's inner hyphens. A token with none is returned as it is.
 * `known` is asked about whole forms (with their punctuation), as typed.
 */
export function resolveTypedHyphens(token: string, known: KnownForm, toClean: ToClean): TypedResolution {
	const chars = Array.from(token);
	const hyphens = innerHyphens(token);
	if (hyphens.length === 0) return { spelling: token, breaks: [], found: true };

	/** The token with the hyphens in `keep` as `-` and every other inner hyphen out. */
	const build = (keep: ReadonlySet<number>): string =>
		chars.map((c, i) => (!hyphens.includes(i) ? c : keep.has(i) ? '-' : '')).join('');

	const k = hyphens.length;
	const tried = new Set<string>();
	const candidates: Array<ReadonlySet<number>> = [new Set(hyphens), new Set()];
	if (k <= MAX_PARTIAL_HYPHENS) {
		const masks: number[] = [];
		for (let m = 1; m < (1 << k) - 1; m++) masks.push(m);
		const bits = (m: number) => hyphens.filter((_, b) => m & (1 << b)).length;
		masks.sort((a, b) => bits(a) - bits(b) || a - b);
		for (const m of masks) candidates.push(new Set(hyphens.filter((_, b) => m & (1 << b))));
	}

	let kept: ReadonlySet<number> | null = null;
	for (const c of candidates) {
		const form = build(c);
		if (tried.has(form)) continue;
		tried.add(form);
		if (known(form)) {
			kept = c;
			break;
		}
	}

	const keep = kept ?? new Set<number>();
	const breaks: TypedBreak[] = [];
	let spelling = '';
	chars.forEach((c, i) => {
		if (!hyphens.includes(i)) spelling += c;
		else if (keep.has(i)) spelling += '-';
		else breaks.push({ at: toClean(spelling).length, ch: c });
	});
	return { spelling, breaks, found: kept !== null };
}

/** Does the whole token resolve to a word through its inner hyphens? False for a token with none. */
export function resolvesToWord(token: string, known: KnownForm, toClean: ToClean): boolean {
	return innerHyphens(token).length > 0 && resolveTypedHyphens(token, known, toClean).found;
}

/**
 * Hyphenated enclitic particles split from their host for independent lookup
 * and enclitic treatment. Lowercase; matching is case-insensitive.
 */
const HYPHENATED_PARTICLES = new Set(['ли', 'ль', 'бы', 'б', 'же', 'ж']);
const TRAILING_PUNCT = /[.,!?;:"""''\-‐‑–—]+$/;

/**
 * Expand hyphenated particles into separate tokens, but only where the whole
 * token is no word of the dictionary's (`resolves`):
 *
 * "велит-ли" → ["велит-", "ли"]  (hyphen preserved on host for display)
 * "места-б," → ["места-", "б,"]  (trailing punct stays on particle)
 * "бы-ли"    → ["бы-ли"]         (a word: resolved joined as были)
 * "кое-что"  → ["кое-что"]       (unchanged: "что" is not a particle)
 *
 * Splits on the LAST hyphen only. The hyphen character stays on the host word
 * as trailing punctuation so the Paper faithfully renders the source text.
 */
export function expandHyphenatedParticles(tokens: string[], resolves: (token: string) => boolean): string[] {
	const result: string[] = [];
	for (const token of tokens) {
		const chars = Array.from(token);
		let last = -1;
		chars.forEach((c, i) => ANY_HYPHEN.test(c) && (last = i));
		if (last > 0 && last < chars.length - 1) {
			const after = chars.slice(last + 1).join('');
			const afterClean = after.replace(TRAILING_PUNCT, '').toLowerCase();
			if (HYPHENATED_PARTICLES.has(afterClean) && !resolves(token)) {
				result.push(chars.slice(0, last + 1).join(''), after);
				continue;
			}
		}
		result.push(token);
	}
	return result;
}

/**
 * The score's syllables respelled letter by letter in `modern`, a word's modern
 * spelling, lowercased and letters only. The old spelling maps one letter to one
 * letter (ѣ → е, і → и, -аго → -ого) except a hard sign that ends a word or a
 * part of one, which the modern word drops; punctuation, case, and the score's
 * own division are kept. Null if the letters do not line up, and the score's
 * text then stands.
 *
 * Lives here rather than in `score/vowel-resolver.ts` so the pipeline can carry
 * a typed division across an old spelling without importing the score module,
 * which imports the pipeline. `vowel-resolver.ts` re-exports it.
 */
export function modernSyllables(texts: readonly string[], modern: string): string[] | null {
	const m = [...modern];
	let p = 0;
	const out = texts.map((text) =>
		[...text.normalize('NFC')]
			.map((c) => {
				if (!/[\p{L}\p{M}]/u.test(c)) return c;
				if ((c === 'ъ' || c === 'Ъ') && m[p] !== 'ъ') return '';
				const next = m[p++] ?? '';
				return c !== c.toLowerCase() ? next.toUpperCase() : next;
			})
			.join(''),
	);
	return p === m.length ? out : null;
}

/**
 * Carries breaks from the resolved spelling's letters to the letters the word
 * finally reads (N.12 and row 25 can change a letter, or drop a hard sign).
 * Same count of letters: the offsets stand. Otherwise `modernSyllables` carries
 * them, and on null there are none (Ilya's rule then divides the whole word).
 */
export function carryBreaks(breaks: readonly TypedBreak[], spellingLetters: string, finalLetters: string): TypedBreak[] {
	if (breaks.length === 0 || spellingLetters.length === finalLetters.length) return [...breaks];
	const letters = Array.from(spellingLetters);
	const cuts = [0, ...breaks.map((b) => b.at), letters.length];
	const pieces = cuts.slice(0, -1).map((c, i) => letters.slice(c, cuts[i + 1]).join(''));
	const out = modernSyllables(pieces, finalLetters.toLowerCase());
	if (!out) return [];
	let at = 0;
	const carried: TypedBreak[] = [];
	out.slice(0, -1).forEach((p, i) => {
		at += Array.from(p).length;
		carried.push({ at, ch: breaks[i].ch });
	});
	return carried;
}

/**
 * The typed breaks that cut syllables. A part with no vowel is not a syllable:
 * it joins the part before it («серд-ц-е» divides сердц|е), and a vowelless
 * first part joins the part after it, as the score's own words do
 * (`score/vowel-resolver.ts`, `close`). `dropped` names the breaks that go.
 */
export function settleBreaks(letters: string, breaks: readonly TypedBreak[]): { kept: number[]; dropped: TypedBreak[] } {
	const chars = Array.from(letters);
	const sorted = [...breaks].filter((b) => b.at > 0 && b.at < chars.length).sort((a, b) => a.at - b.at);
	const cuts = [0, ...sorted.map((b) => b.at), chars.length];
	const parts = cuts.slice(0, -1).map((c, i) => ({ from: c, to: cuts[i + 1], brk: i > 0 ? sorted[i - 1] : null }));
	const hasVowel = (p: { from: number; to: number }) => CYRILLIC_VOWEL.test(chars.slice(p.from, p.to).join(''));
	const dropped: TypedBreak[] = [];
	const merged: typeof parts = [];
	for (const p of parts) {
		const prev = merged[merged.length - 1];
		if (prev && !hasVowel(p)) {
			prev.to = p.to;
			if (p.brk) dropped.push(p.brk);
		} else if (prev && !hasVowel(prev)) {
			// A vowelless first part joins the part after it.
			prev.to = p.to;
			if (p.brk) dropped.push(p.brk);
		} else merged.push({ ...p });
	}
	return { kept: merged.slice(1).map((p) => p.from), dropped };
}

/**
 * Prints the typed hyphens back into a displayed word: each goes before the
 * letter at its offset, where a letter is a character `toClean` keeps.
 */
export function reinsertBreaks(display: string, breaks: readonly TypedBreak[], toClean: ToClean): string {
	if (breaks.length === 0) return display;
	let letter = 0;
	let out = '';
	for (const c of Array.from(display)) {
		if (toClean(c) !== '') {
			for (const b of breaks) if (b.at === letter) out += b.ch;
			letter++;
		}
		out += c;
	}
	return out;
}

/**
 * Cuts the engine's own syllables along the typed breaks, in place, so
 * `result.syllables` stays the one array every reader holds. Each stretch
 * between typed breaks is divided by Ilya's rule (`syllabify`), so the word
 * keeps one vowel to a syllable and the stress index stands. Returns false and
 * leaves the engine's division where the cut cannot be made (the syllable count
 * would change, or the per-letter IPA does not add up to the syllables' IPA).
 *
 * `charIpas` is the per-letter IPA of the word (the display log's, one entry
 * per letter), as `applySyllableOverride` takes it.
 */
export function cutAlongTypedBreaks(
	result: { syllables: SyllableData[]; transcriptionLog: Array<{ syllableIndex: number; position: number }> },
	kept: readonly number[],
	charIpas: string[],
	syllabify: (part: string) => string[],
): boolean {
	if (kept.length === 0 || result.syllables.length <= 1) return false;
	const letters = result.syllables.map((s) => s.cyrillic ?? '').join('');
	const cuts = [0, ...kept, letters.length];
	const boundaries: number[] = [];
	for (let i = 0; i < cuts.length - 1; i++) {
		const part = letters.slice(cuts[i], cuts[i + 1]);
		let at = cuts[i];
		const syls = syllabify(part);
		syls.slice(0, -1).forEach((s) => boundaries.push((at += s.length) - 1));
		if (i < cuts.length - 2) boundaries.push(cuts[i + 1] - 1);
	}
	if (boundaries.length + 1 !== result.syllables.length) return false;
	if (charIpas.join('') !== result.syllables.map((s) => s.ipa).join('')) return false;

	const cut = applySyllableOverride(result.syllables, charIpas, { boundaries });
	if (cut.length !== result.syllables.length || cut.some((s, i) => s.isStressed !== result.syllables[i].isStressed)) return false;
	result.syllables.splice(0, result.syllables.length, ...cut);
	const sylOfChar: number[] = [];
	cut.forEach((s, si) => Array.from(s.cyrillic).forEach(() => sylOfChar.push(si)));
	for (const e of result.transcriptionLog) e.syllableIndex = sylOfChar[Math.ceil(e.position)] ?? e.syllableIndex;
	return true;
}
