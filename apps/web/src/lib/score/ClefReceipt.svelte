<script lang="ts">
	/**
	 * THE CLEF RECEIPT (QUEUE row 127, ruled by Dann 2026-10-19 22:49 and 22:50; row 144,
	 * 2026-10-20 03:15 and 03:44): one row in the Input band under the TEMPO receipt, a
	 * native select, as text. It is the permanent home of the choice; the chip on
	 * Markup's page 1 speaks once and the drawn clef brings the same choices back
	 * (`ClefControls.svelte`). It shows on every song with a voice line, and offers the
	 * choices `clefUi.menu` names for this song's printed clef. Every string is a
	 * ratified one (`upload.ask.clef*`, `octave.*`).
	 *
	 * ITS OWN COMPONENT for the reason `TempoReceipt.svelte` gives: `IntakePanel.svelte`
	 * stands near the 1,000-line limit. Svelte scopes a rule to the file that writes the
	 * markup, so the receipt's look is `IntakePanel`'s `.intake-receipt` values written
	 * out again here, as that file says of its button family: change one and change both.
	 */
	import { t, type Language } from '$lib/i18n';
	import type { ClefChoice } from './clef-choice';
	import { CLEF_CHOICE_KEY, clefUi } from './clef-ui.svelte';

	let { language }: { language: Language } = $props();
</script>

{#if clefUi.shown}
	<div class="intake-receipt receipt-clef">
		<label class="tag" for="clef-select">{t('upload.ask.clef', language)}</label>
		<select id="clef-select" class="clef-select" value={clefUi.menu.current} onchange={(e) => clefUi.choose((e.currentTarget as HTMLSelectElement).value as ClefChoice)}>
			{#each clefUi.menu.options as value (value)}
				<option {value}>{t(CLEF_CHOICE_KEY[value], language)}</option>
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
