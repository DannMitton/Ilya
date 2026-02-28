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

	// Compute reconActive for a given word key using the same bidirectional XOR
	// as WordStack and InspectorPanel: spot inverts the global setting.
	function isReconActiveForKey(wordKey: string): boolean {
		const isSpot = spotReconstitution?.has(wordKey) ?? false;
		return isSpot ? !notationPrefs.reconstitution : notationPrefs.reconstitution;
	}

	// For each host word, determine whether any adjacent clitic has reconstitution
	// active. When a clitic is reconstituted, it displays its own IPA instead of
	// merging into the host — so the host must show demerged IPA (its own form only).
	const cliticReconMap = $derived.by((): Map<string, boolean> => {
		const result = new Map<string, boolean>();
		for (let i = 0; i < displayWords.length; i++) {
			const word = displayWords[i];
			if (word.isProclitic || word.isEnclitic) continue;

			let hasRecon = false;

			// Check preceding proclitics
			for (let j = i - 1; j >= 0 && displayWords[j].isProclitic; j--) {
				const cKey = `${displayWords[j].lineIndex}-${displayWords[j].wordIndex}`;
				if (isReconActiveForKey(cKey)) { hasRecon = true; break; }
			}

			// Check following enclitics
			if (!hasRecon) {
				for (let j = i + 1; j < displayWords.length && displayWords[j].isEnclitic; j++) {
					const cKey = `${displayWords[j].lineIndex}-${displayWords[j].wordIndex}`;
					if (isReconActiveForKey(cKey)) { hasRecon = true; break; }
				}
			}

			if (hasRecon) {
				const wKey = `${word.lineIndex}-${word.wordIndex}`;
				result.set(wKey, true);
			}
		}
		return result;
	});
</script>

<div class="verse-line">
	{#each displayWords as word (word.wordIndex)}
		{@const wordKey = `${word.lineIndex}-${word.wordIndex}`}
		<WordStack
			{word}
			{notationPrefs}
			{showStressDiacritics}
			{language}
			spotReconstituted={spotReconstitution?.has(wordKey) ?? false}
			adjacentCliticReconstituted={cliticReconMap.has(wordKey)}
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
