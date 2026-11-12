<script module lang="ts">
	/** What the two grace note cells need (`CorrectionVerbs.graceCells`). */
	export interface GraceCellsModel {
		/** What the Grace note cell does now: add one in a gap, make the taken note a grace note, make a taken grace note a full note again. */
		mode: 'gap' | 'note' | 'grace';
		/** The Slash cell shows only on a lone, flagged grace note. */
		slashable: boolean;
		slashed: boolean;
		ongrace: () => void;
		onslash: () => void;
	}
</script>

<script lang="ts">
	/*
	 * N.187: the Grace note cell and the Slash cell, in the ACCIDENTAL · ENTRY station beside Rest and Tie. The Rest cell is the
	 * precedent (Fable's amendment 8): in a gap it adds, on a full note it converts, on a grace note it converts back, so one cell
	 * covers all three; its accessible name says which. Strings are PENDING DANN (the English drafts stand; no French is invented).
	 * The look is the surface's own `.cell`, which it shares with this component as `.cell-g`.
	 */
	import { t, type Language } from '$lib/i18n';
	interface Props {
		cells: GraceCellsModel;
		language: Language;
	}
	let { cells, language }: Props = $props();
	const T = (key: string) => t(key, language);
	const name = $derived(T(cells.mode === 'gap' ? 'correct.graceAdd' : cells.mode === 'grace' ? 'correct.graceFull' : 'correct.graceMake'));
</script>

<button type="button" class="cell-g" class:engaged={cells.mode === 'grace'} data-grace-cell={cells.mode} aria-pressed={cells.mode === 'grace'} aria-label={name} onclick={cells.ongrace}>{T('loupe.grace')}</button>
{#if cells.slashable}
	<button type="button" class="cell-g" class:engaged={cells.slashed} data-grace-slash-cell aria-pressed={cells.slashed} aria-label={T('correct.graceSlash')} onclick={cells.onslash}>{T('loupe.graceSlash')}</button>
{/if}
