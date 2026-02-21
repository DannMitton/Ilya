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
