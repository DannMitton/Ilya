<script lang="ts">
	import type { WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import WordStack from './WordStack.svelte';

	interface Props {
		words: WordStackData[];
		notationPrefs: NotationPreferences;
		showStressDiacritics?: boolean;
		language?: Language;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, string>;
		onwordclick?: (word: WordStackData) => void;
	}

	let { words, notationPrefs, showStressDiacritics = false, language = 'en', spotReconstitution, glossOverrides, onwordclick }: Props = $props();

	// Filter out punctuation-only tokens: only render words containing Cyrillic
	const displayWords = $derived(
		words.filter(w => /[А-Яа-яЁё]/.test(w.cyrillic || ''))
	);

	// Check if reconstitution is active for a given word index in displayWords.
	// Bidirectional XOR: spot inverts global, matching WordStack/InspectorPanel.
	function isReconActiveAt(idx: number): boolean {
		const w = displayWords[idx];
		const key = `${w.lineIndex}-${w.wordIndex}`;
		const isSpot = spotReconstitution?.has(key) ?? false;
		return isSpot ? !notationPrefs.reconstitution : notationPrefs.reconstitution;
	}

	// For each host word, check if any adjacent clitic has reconstitution active.
	// Computed as a derived so it updates when spotReconstitution or notationPrefs change.
	const adjacentCliticReconFlags = $derived.by((): boolean[] => {
		// Read spotReconstitution directly to ensure Svelte tracks the dependency
		const spotMap = spotReconstitution;
		const globalRecon = notationPrefs.reconstitution;

		return displayWords.map((word, i) => {
			if (word.isProclitic || word.isEnclitic) return false;

			// Check preceding proclitics
			for (let j = i - 1; j >= 0 && displayWords[j].isProclitic; j--) {
				const cw = displayWords[j];
				const cKey = `${cw.lineIndex}-${cw.wordIndex}`;
				const isSpot = spotMap?.has(cKey) ?? false;
				const reconActive = isSpot ? !globalRecon : globalRecon;
				if (reconActive) return true;
			}

			// Check following enclitics
			for (let j = i + 1; j < displayWords.length && displayWords[j].isEnclitic; j++) {
				const cw = displayWords[j];
				const cKey = `${cw.lineIndex}-${cw.wordIndex}`;
				const isSpot = spotMap?.has(cKey) ?? false;
				const reconActive = isSpot ? !globalRecon : globalRecon;
				if (reconActive) return true;
			}

			return false;
		});
	});
</script>

<div class="verse-line">
	{#each displayWords as word, i (word.wordIndex)}
		{@const wordKey = `${word.lineIndex}-${word.wordIndex}`}
		<WordStack
			{word}
			{notationPrefs}
			{showStressDiacritics}
			{language}
			spotReconstituted={spotReconstitution?.has(wordKey) ?? false}
			adjacentCliticReconstituted={adjacentCliticReconFlags[i] ?? false}
			glossOverride={glossOverrides?.get(wordKey)}
			{onwordclick}
		/>
	{/each}
</div>

<style>
	.verse-line {
		display: flex;
		flex-wrap: wrap;
		gap: var(--row-gap, 20px) 0.4rem;
		align-items: center;
		padding-left: 28px;
	}

	/* Hanging indent: first word pulls back to the left edge.
	   Wrapped lines start at the 28px padding (indented). */
	.verse-line > :global(:first-child) {
		margin-left: -28px;
	}
</style>
