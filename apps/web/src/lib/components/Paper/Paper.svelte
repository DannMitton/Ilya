<script lang="ts">
	import type { LineData, WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';
	import VerseLine from './VerseLine.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language?: Language;
		printMode?: boolean;
		onwordclick?: (word: WordStackData) => void;
	}

	let { lines, notationPrefs, language = 'en', printMode = false, onwordclick }: Props = $props();

	const hasTranscription = $derived(lines.length > 0);
</script>

<div class="paper" class:print-mode={printMode} role="region" aria-label="Transcription">
	{#if hasTranscription}
		{#each lines as line (line.lineNumber)}
			<VerseLine words={line.words} {notationPrefs} {printMode} {onwordclick} />
		{/each}
	{:else}
		<p class="empty-state">{t('paper.empty', language)}</p>
	{/if}
</div>

<style>
	.paper {
		max-width: 65ch;
		width: 100%;
		margin: 0 auto;
		padding: 3rem 2rem;
		background: var(--paper-cream);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
		border-radius: 2px;
		min-height: 12rem;
	}

	.paper.print-mode {
		box-shadow: none;
		border-radius: 0;
		padding: 0;
		max-width: none;
	}

	.empty-state {
		text-align: center;
		color: var(--ink-tertiary);
		font-family: var(--font-serif);
		font-style: italic;
		padding: 4rem 1rem;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	@media (max-width: 740px) {
		.paper {
			padding: 2rem 1rem;
		}
	}
</style>
