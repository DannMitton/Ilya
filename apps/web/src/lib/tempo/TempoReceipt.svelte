<script lang="ts">
	/**
	 * THE TEMPO RECEIPT (QUEUE row 48, ruled by Dann 2026-10-08 01:40): one row
	 * in the Input band under the SCORE receipt that reads the tempo and where
	 * it came from, in the ratified words `printed`, `estimated`, and `your
	 * tempo`, with a way into the control.
	 *
	 * ITS OWN COMPONENT, not a row inside `IntakePanel.svelte`: that file stood
	 * one line under the 1,000-line limit for a file with no ceiling
	 * (`scripts/ratchets.json:3`), so a row built inside it fails gate 8.
	 * Svelte scopes a rule to the file that writes the markup, so the receipt's
	 * look is `IntakePanel`'s `.intake-receipt` values written out again here, as
	 * that file says of its button family: change one and change both.
	 *
	 * SIGILS (`provenance.ts`): a printed tempo shows none (normal operation); the
	 * singer's tempo wears the torso (`user-override`); Ilya's estimate wears ≈,
	 * a text character like `ё`, decoded by `legend.tempo-estimated` as its title
	 * here, because no printed page carries this receipt.
	 *
	 * The change link is the ratified `tempo.change`; the receipt buttons are
	 * Clear and Replace, and neither says Change, so the control's own words
	 * stand in (the desk's default, row 48 review amendment 8).
	 */
	import { t, type Language } from '$lib/i18n';
	import { beatGlyph, beatName } from './beat-glyph';
	import { tempoSource } from './singer-tempo';
	import { tempoUi } from './tempo-ui.svelte';

	let { language }: { language: Language } = $props();

	const r = $derived(tempoUi.current);
	const source = $derived(r ? tempoSource(r) : null);
	const figure = $derived(
		r ? (r.provenance === 'estimated' && r.range ? `${r.range[0]}–${r.range[1]}` : String(Math.round(r.bpm))) : '',
	);
	const label = $derived(r ? `${beatName(r.beatUnit, r.beatUnitDots, language)} = ${figure}` : '');
</script>

{#if r && source}
	<div class="intake-receipt receipt-tempo">
		<span class="tag">{t('intake.tempo.label', language)}</span>
		<span class="line" aria-label={label}>
			<span class="mus" aria-hidden="true">{beatGlyph(r.beatUnit, r.beatUnitDots)}</span><span aria-hidden="true">{` = ${figure}`}</span>
			<span class="source">
				{#if source === 'estimated'}<span class="sigil" title={t('legend.tempo-estimated', language)} data-sigil="estimated">{'≈'}</span>
				{:else if source === 'yours'}<svg class="sigil torso" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-sigil="torso"><title>{t('legend.user-override', language)}</title><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z" /></svg>{/if}
				{t(`intake.tempo.${source}`, language)}
			</span>
		</span>
		<button type="button" class="receipt-btn" onclick={tempoUi.openControl}>{t('tempo.change', language)}</button>
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

	.intake-receipt .line {
		flex: 1;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mus {
		font-family: 'Finale Maestro', serif;
		font-size: 1.2em;
		vertical-align: -0.1em;
	}

	.source {
		margin-left: 0.4rem;
		font-size: 12px;
		font-style: italic;
		color: var(--ink-tertiary);
	}

	.sigil {
		font-style: normal;
		margin-right: 0.15rem;
	}

	.torso {
		width: 11px;
		height: 11px;
		vertical-align: -1px;
		margin-right: 0.2rem;
	}

	.receipt-btn {
		flex: none;
		min-height: 44px;
		padding: 0 8px;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--stone-500);
		cursor: pointer;
	}

	.receipt-btn:hover {
		color: var(--ink-primary);
	}
</style>
