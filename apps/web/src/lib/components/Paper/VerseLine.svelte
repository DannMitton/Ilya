<script lang="ts">
	import type { ResolvedGloss } from '$lib/text/gloss-edit';
	import type { WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import WordStack from './WordStack.svelte';
	import { adjacentCliticReconFlags as adjacentReconFlags, displayedWords } from './shown-ipa';

	interface Props {
		words: WordStackData[];
		notationPrefs: NotationPreferences;
		showStressDiacritics?: boolean;
		language?: Language;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, ResolvedGloss>;
		mutedWords?: ReadonlySet<string>;
		onwordclick?: (word: WordStackData) => void;
		/** N.201: the tapped word's `"lineIndex-wordIndex"`; its stack draws the screen-only mark. */
		selectedKey?: string | null;
		/** The page-fit probe's copy of the line: its stacks carry no identity (`WordStack.svelte`). */
		probe?: boolean;
	}

	let { words, notationPrefs, showStressDiacritics = false, language = 'en', spotReconstitution, glossOverrides, mutedWords, onwordclick, selectedKey = null, probe = false }: Props = $props();

	// Render words containing Cyrillic, and Latin words (`latin.ts`), which keep
	// their place in the line. A punctuation-only token never becomes a word
	// (`splitIntoPreLines`), and this filter would drop one if it did.
	const displayWords = $derived(displayedWords(words));

	// For each host word, whether an adjacent clitic has reconstitution active.
	// N.201: the rule moved to `shown-ipa.ts`, which the closed ANALYSIS line
	// also reads, so the stack and the line cannot disagree. A derived, so it
	// updates when `spotReconstitution` or `notationPrefs` change.
	const adjacentCliticReconFlags = $derived(
		adjacentReconFlags(displayWords, notationPrefs, spotReconstitution)
	);
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
			glossOverride={glossOverrides?.get(wordKey)?.text}
			muted={mutedWords?.has(wordKey) ?? false}
			{onwordclick}
			selected={selectedKey === wordKey}
			{probe}
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
