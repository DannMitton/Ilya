<script lang="ts">
	/**
	 * THE PIECE BAND'S KEY LINE (N.94 slices 1 and 2). Drawing r4, plates 1 and 3,
	 * accepted by Dann 2026-09-28. The key is a fact about the whole song, so
	 * it sits with the song's other facts: one quiet line and one ghost pill.
	 *
	 * As printed it reads "Key: D major, as printed" with "Try another key",
	 * which opens the ruler over the Markup page. Transposed it reads "Key: B
	 * major, transposed" with "As printed", which returns in one tap.
	 *
	 * ON A PHONE the same pill opens the ruler docked at the bottom edge
	 * (plate 4, slice 2), so the line is the same on both.
	 */
	import { t, type Language } from '$lib/i18n';
	import { bandLine } from './transposition-ruler';
	import type { TranspositionRulerState } from './transposition-ruler-state.svelte';

	interface Props {
		keyRuler: TranspositionRulerState;
		language: Language;
	}

	let { keyRuler, language }: Props = $props();

	const line = $derived(keyRuler.printed && bandLine(keyRuler.choice, keyRuler.printed, language));
</script>

{#if line}
	<div class="piece-key">
		<span>{line.before}<b>{line.key}</b>{line.after}</span>
		{#if line.transposed}
			<button type="button" class="piece-key-pill" onclick={() => keyRuler.use(null)}>{t('key.band.backToPrinted', language)}</button>
		{:else}
			<button type="button" class="piece-key-pill" onclick={() => keyRuler.tryAnother()}>{t('key.band.try', language)}</button>
		{/if}
	</div>
{/if}

<style>
	/* Drawing r4, plate 1: a hairline above, the line and the pill on one row.
	   The pill is the house recipe (`RootPanel.svelte`'s `.action-btn`, ruled
	   2026-09-03), ghost. */
	.piece-key {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		padding-top: 10px;
		border-top: 1px solid var(--stone-200, #e7e5e4);
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		color: var(--ink-primary);
	}

	b {
		font-weight: 600;
	}

	.piece-key-pill {
		flex: 0 0 auto;
		padding: 0.3rem 0.75rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ink-primary);
		background: #fff;
		border: 1px solid var(--ink-primary);
		border-radius: 999px;
		white-space: nowrap;
		cursor: pointer;
	}

	.piece-key-pill:hover {
		opacity: 0.85;
	}
</style>
