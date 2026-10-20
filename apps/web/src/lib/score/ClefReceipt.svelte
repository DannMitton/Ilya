<script lang="ts">
	/**
	 * THE CLEF RECEIPT (QUEUE row 127, ruled by Dann 2026-10-19 22:49 and 22:50): one
	 * row in the Input band under the TEMPO receipt, a native select with the three
	 * ratified choices, shown only where a line printed in treble is read an octave
	 * lower. The row's strings are `upload.ask.clef*`, ratified earlier; none is new.
	 *
	 * ITS OWN COMPONENT for the reason `TempoReceipt.svelte` gives: `IntakePanel.svelte`
	 * stands near the 1,000-line limit. Svelte scopes a rule to the file that writes the
	 * markup, so the receipt's look is `IntakePanel`'s `.intake-receipt` values written
	 * out again here, as that file says of its button family: change one and change both.
	 */
	import { t, type Language } from '$lib/i18n';
	import type { ClefChoice } from './clef-choice';
	import { clefUi } from './clef-ui.svelte';

	let { language }: { language: Language } = $props();

	const options: Array<[ClefChoice, 'upload.ask.clefTrebleOttava' | 'upload.ask.clefBass' | 'upload.ask.clefTreble']> = [
		['ottava', 'upload.ask.clefTrebleOttava'],
		['bass', 'upload.ask.clefBass'],
		['as-written', 'upload.ask.clefTreble'],
	];
</script>

{#if clefUi.shown}
	<div class="intake-receipt receipt-clef">
		<label class="tag" for="clef-select">{t('upload.ask.clef', language)}</label>
		<select id="clef-select" class="clef-select" value={clefUi.choice} onchange={(e) => clefUi.choose((e.currentTarget as HTMLSelectElement).value as ClefChoice)}>
			{#each options as [value, key] (value)}
				<option {value}>{t(key, language)}</option>
			{/each}
		</select>
	</div>
{/if}

<style>
	.intake-receipt {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		border-bottom: 1px solid rgba(26, 22, 18, 0.08);
	}

	.intake-receipt .tag {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-tertiary);
		flex: none;
		min-width: 62px;
	}

	.clef-select {
		flex: 1;
		min-width: 0;
		min-height: 44px;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-primary);
		cursor: pointer;
	}
</style>
