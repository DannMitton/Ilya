<script lang="ts">
	import type { WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import WordStack from './WordStack.svelte';

	interface Props {
		words: WordStackData[];
		notationPrefs: NotationPreferences;
		printMode?: boolean;
		onwordclick?: (word: WordStackData) => void;
	}

	let { words, notationPrefs, printMode = false, onwordclick }: Props = $props();
</script>

<div class="verse-line">
	{#each words as word (word.wordIndex)}
		<WordStack {word} {notationPrefs} {printMode} onclick={onwordclick} />
	{/each}
</div>

<style>
	.verse-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.5rem;
		margin-bottom: 1.5rem;
		align-items: flex-start;
	}

	.verse-line:last-child {
		margin-bottom: 0;
	}
</style>
