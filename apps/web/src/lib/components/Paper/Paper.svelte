<script lang="ts">
	import type { LineData } from '$lib/types';

	interface Props {
		lines: LineData[];
	}

	let { lines }: Props = $props();

	const hasTranscription = $derived(lines.length > 0);
</script>

<div class="paper" role="region" aria-label="Transcription">
	{#if hasTranscription}
		{#each lines as line}
			<div class="verse-line">
				{#each line.words as word}
					<div
						class="word-stack"
						class:proclitic={word.isProclitic}
						class:enclitic={word.isEnclitic}
						class:unknown-stress={word.stressSource === 'inferred' || word.stressSource === 'unknown'}
						data-word-index="{word.lineIndex}-{word.wordIndex}"
					>
						<span class="ipa">{word.ipaDisplay}</span>
						<span class="cyrillic">
							{word.stressedCyrillic}<span class="punct">{word.punctuation}</span>
						</span>
					</div>
				{/each}
			</div>
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

	/* ── Empty state ──────────────────────────────────────────── */

	.empty-state {
		text-align: center;
		color: #9ca3af;
		font-style: italic;
		padding: 4rem 1rem;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	/* ── Verse lines ──────────────────────────────────────────── */

	.verse-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin-bottom: 1.5rem;
		align-items: flex-start;
	}

	.verse-line:last-child {
		margin-bottom: 0;
	}

	/* ── Word stacks ──────────────────────────────────────────── */

	.word-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		min-width: 2.5rem;
	}

	.word-stack.proclitic,
	.word-stack.enclitic {
		opacity: 0.6;
	}

	.word-stack.unknown-stress {
		border-bottom: 2px dashed #e2a500;
		padding-bottom: 0.15rem;
	}

	.ipa {
		font-size: 1.1rem;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.cyrillic {
		font-size: 0.85rem;
		color: #374151;
	}

	.punct {
		color: #9ca3af;
	}

	/* ── Responsive ───────────────────────────────────────────── */

	@media (max-width: 740px) {
		.paper {
			padding: 2rem 1rem;
		}
	}
</style>
