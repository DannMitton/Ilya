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
		onwordclick?: (word: WordStackData) => void;
	}

	let { words, notationPrefs, showStressDiacritics = false, language = 'en', onwordclick }: Props = $props();

	// Filter out punctuation-only tokens: only render words containing Cyrillic
	const displayWords = $derived(
		words.filter(w => /[А-Яа-яЁё]/.test(w.cyrillic || ''))
	);
</script>

<div class="verse-line">
	{#each displayWords as word (word.wordIndex)}
		<WordStack {word} {notationPrefs} {showStressDiacritics} {language} {onwordclick} />
	{/each}
</div>

<style>
	.verse-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.4rem;
		align-items: flex-end;
	}
</style>
