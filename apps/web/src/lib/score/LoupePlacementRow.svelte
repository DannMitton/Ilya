<!--
  LoupePlacementRow.svelte

  N.179 (QUEUE row 14; Dann 2026-10-01 02:42 and 02:43): the two verbs that
  replace the retired Start placement over. DESK DEFAULT PLACEMENT, reversible,
  for Dann's walk (the brief, item 4): a quiet row under the tray, a
  `Clear placements` pill that opens its three scopes in place, and a
  `Place from here` pill. Rounded ends, per the 2026-09-03 button ruling.

  It decides nothing: the page owns the presses (`+page.svelte`,
  `handleClearPlacements` and `handlePlaceFromHere`), pushes the undo entry,
  and writes. What a scope covers is `placement-scope.ts`'s.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import { CLEAR_SCOPES, type PlacementControls } from '$lib/score/placement-scope';

	let { placement, language }: { placement: PlacementControls; language: Language } = $props();

	let scopesOpen = $state(false);

	function clear(scope: (typeof CLEAR_SCOPES)[number]): void {
		scopesOpen = false;
		placement.onclear(scope);
	}
</script>

<div class="loupe-place-row" role="group" aria-label={t('loupe.place.clear', language)}>
	<button
		type="button"
		class="loupe-place-pill"
		aria-expanded={scopesOpen}
		disabled={!placement.canClear}
		onclick={() => (scopesOpen = !scopesOpen)}>{t('loupe.place.clear', language)}</button
	>
	{#if scopesOpen && placement.canClear}
		{#each CLEAR_SCOPES as scope (scope)}
			<button
				type="button"
				class="loupe-place-pill is-scope"
				disabled={scope !== 'all' && !placement.hasSelection}
				onclick={() => clear(scope)}>{t(`loupe.place.scope.${scope}`, language)}</button
			>
		{/each}
	{/if}
	<button type="button" class="loupe-place-pill" disabled={!placement.canFromHere} onclick={placement.onfromhere}
		>{t('loupe.place.fromHere', language)}</button
	>
</div>

<style>
	.loupe-place-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;
	}
	.loupe-place-pill {
		border: 1px solid rgba(74, 69, 64, 0.35);
		border-radius: 999px;
		background: transparent;
		color: #4a4540;
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 12px;
		line-height: 1;
		padding: 7px 12px;
		cursor: pointer;
	}
	.loupe-place-pill.is-scope {
		border-style: dashed;
	}
	.loupe-place-pill[aria-expanded='true'] {
		border-color: var(--lavender, #9585a2);
	}
	.loupe-place-pill:disabled {
		opacity: 0.4;
		cursor: default;
	}
	.loupe-place-pill:focus-visible {
		outline: 2px solid var(--lavender, #9585a2);
		outline-offset: 1px;
	}
	/* The touch floor, as the syllable strip keeps it. */
	@media (pointer: coarse) {
		.loupe-place-pill {
			min-height: 44px;
			padding: 0 16px;
		}
	}
	@media print {
		.loupe-place-row {
			display: none !important;
		}
	}
</style>
