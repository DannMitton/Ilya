<script lang="ts">
	import type { LineData, WordStackData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import VerseLine from './VerseLine.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		onwordclick?: (word: WordStackData) => void;
	}

	let { lines, notationPrefs, onwordclick }: Props = $props();

	const hasTranscription = $derived(lines.length > 0);
</script>

<div class="paper" role="region" aria-label="Transcription">
	{#if hasTranscription}
		{#each lines as line (line.lineNumber)}
			<VerseLine words={line.words} {notationPrefs} {onwordclick} />
		{/each}
	{:else}
		<p class="empty-state">Paste Russian text and click Transcribe to begin.</p>
	{/if}
</div>

<style>
	.paper {
		max-width: 65ch;
		width: 100%;
		margin: 0 auto;
		padding: 3rem 2rem;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		border-radius: 2px;
		min-height: 12rem;
	}

	.empty-state {
		text-align: center;
		color: #9ca3af;
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
