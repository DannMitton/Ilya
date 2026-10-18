/**
 * word-marks.svelte.ts: ONE WITNESS'S WORD MARKS. ROWS 109 AND 110 (N.186),
 * review r2 amendment 1, on the `input-views.svelte.ts` class pattern.
 *
 * A song has two texts Text can transcribe, Lyrics and Poem, and each keeps its
 * own marks: the stress marks and ё toggles (inputs to `processText`), the
 * syllable boundaries and spot reconstitutions (display-time). They were four
 * `$state` maps and their handlers in `+page.svelte`, all keyed
 * `"lineIndex-wordIndex"` (the ё toggles with `-charIndex`), which are the
 * words of ONE text. Held here, the page owns two instances (`lyricsMarks`,
 * `poemMarks`) and every tool works on the shown witness's, so a poem word's
 * key never lands in Lyrics' maps. These marks are session state and are never
 * stored, as Lyrics' have always been (review r2, amendment 5); only glosses
 * are on the song. The bodies are the page's own, moved unchanged.
 */
import type { SyllableOverride, UserStressOverride, YoToggle } from '$lib/types';
import { rekeyByWord, rekeyByWordChar, type TextDiff } from '$lib/text-diff';

export class WordMarks {
	/** Keyed by `"lineIndex-wordIndex"`. Cleared on a fresh transcription of an unrelated text. */
	stress = $state<Map<string, UserStressOverride>>(new Map());
	/** Keyed by `"lineIndex-wordIndex-charIndex"`. */
	yo = $state<Map<string, YoToggle>>(new Map());
	/** Per-word syllable boundaries; cleared when the global open-syllabification toggle changes. */
	syllables = $state<Map<string, SyllableOverride>>(new Map());
	/** Ephemeral per-word reconstitutions. */
	spot = $state<Map<string, boolean>>(new Map());

	/** Everything a Clear or a song switch drops. */
	clear(): void {
		this.spot = new Map();
		this.stress = new Map();
		this.yo = new Map();
		this.syllables = new Map();
	}

	/** The marks follow their words across a text edit (`text-diff.ts`, N.112). */
	carry(diff: TextDiff): void {
		if (diff.unchanged) return;
		this.spot = rekeyByWord(this.spot, diff);
		this.stress = rekeyByWord(this.stress, diff);
		this.syllables = rekeyByWord(this.syllables, diff);
		this.yo = rekeyByWordChar(this.yo, diff);
	}

	toggleSpot(key: string): void {
		const next = new Map(this.spot);
		if (next.has(key)) next.delete(key);
		else next.set(key, true);
		this.spot = next;
	}

	assignStress(key: string, word: { isProclitic?: boolean; isEnclitic?: boolean }, syllableIndex: number, source: string): void {
		const existing = this.stress.get(key);
		const isClitic = word.isProclitic || word.isEnclitic || existing?.promotedFromClitic;
		const next = new Map(this.stress);
		next.set(key, {
			stressIndex: syllableIndex,
			stressSource: source as UserStressOverride['stressSource'],
			...(isClitic ? { promotedFromClitic: true } : {}),
		});
		this.stress = next;
	}

	revertStress(key: string): void {
		const next = new Map(this.stress);
		next.delete(key);
		this.stress = next;
	}

	/** A null source reverts the toggle. */
	toggleYo(key: string, source: string | null): void {
		const next = new Map(this.yo);
		if (source === null) next.delete(key);
		else next.set(key, { source: source as YoToggle['source'] });
		this.yo = next;
	}

	setSyllable(key: string, override: SyllableOverride | null): void {
		const next = new Map(this.syllables);
		if (override === null) next.delete(key);
		else next.set(key, override);
		this.syllables = next;
	}
}
