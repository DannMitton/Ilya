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
 * key never lands in Lyrics' maps. THE SONG DOCUMENT OWNS THE TWO INSTANCES
 * (`doc.lyricsMarks`, `doc.poemMarks`) and saves them as rows with the song
 * (`SongRecord.wordMarks`), so they survive a switch, a reload, and a binder
 * (row 184 (word marks), ruled by Dann 2026-11-09 20:44, reversing the session-only form
 * of review r2, amendment 5). The poem join's scan-repair marks are not here
 * and stay session-only. The bodies are the page's own, moved unchanged.
 */
import type { SyllableOverride, UserStressOverride, YoToggle } from '$lib/types';
import { rekeyByWord, rekeyByWordChar, type TextDiff } from '$lib/text-diff';
import type { MarkMaps } from '$lib/library/word-mark-rows';

export class WordMarks {
	/** Keyed by `"lineIndex-wordIndex"`. Saved with the song. */
	stress = $state<Map<string, UserStressOverride>>(new Map());
	/** Keyed by `"lineIndex-wordIndex-charIndex"`. */
	yo = $state<Map<string, YoToggle>>(new Map());
	/** Per-word syllable boundaries; cleared (and saved as cleared) when the global open-syllabification toggle changes. */
	syllables = $state<Map<string, SyllableOverride>>(new Map());
	/**
	 * The singer's CHOICE for a word, saved with the song: true reconstituted, false reduced (Dann, 2026-11-09 22:20,
	 * option 2), not an inversion of the device-wide Reconstitution setting. A word with no entry follows the setting.
	 * What a surface draws is `spotInversions` (`spot-choice.ts`), the words whose choice differs from the setting.
	 */
	spot = $state<Map<string, boolean>>(new Map());

	/** Replace all four from a loaded song, and the same four back out as plain maps for the save. */
	load(maps: MarkMaps): void {
		this.stress = new Map(maps.stress);
		this.yo = new Map(maps.yo);
		this.syllables = new Map(maps.syllables);
		this.spot = new Map(maps.spot);
	}
	maps(): MarkMaps {
		return { stress: this.stress, yo: this.yo, syllables: this.syllables, spot: this.spot };
	}

	/** Everything a Clear drops. */
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

	/**
	 * The checkbox beside the word offers the opposite of the setting. A word already read the opposite way is put back
	 * to following the setting (its mark is removed); any other word is set to the opposite of the setting, as a saved choice.
	 */
	toggleSpot(key: string, reconstitution: boolean): void {
		const next = new Map(this.spot);
		const choice = next.get(key);
		if (choice !== undefined && choice !== reconstitution) next.delete(key);
		else next.set(key, !reconstitution);
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
