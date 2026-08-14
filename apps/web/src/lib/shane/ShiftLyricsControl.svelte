<!--
  ShiftLyricsControl.svelte

  N.55b §8: two of Finale's three Shift Lyrics scopes ("to the End of the
  Lyric", "to the Next Open Note"). Rotate syllables is RULED but PARKED,
  dropped from active scope 2026-08-14: it needs a genuine range selection
  and nothing in the tree builds one. Do not add a third row here without
  first building that.

  PRESENTATION ONLY. Owns no state and touches no `PairingMap` itself; it
  reports which scope and which direction, and the caller (`+page.svelte`)
  does the shifting. This mirrors `SyllableStation.svelte`'s own split:
  the pane displays and reports, `+page.svelte` decides.

  `disabled` covers both rows at once, by design, not by economy. Both
  scopes anchor on the SAME note: the one currently holding the syllable
  under the station cursor (`+page.svelte`'s own reverse lookup through
  `pairings`, confirmed by Dann 2026-08-14). If that anchor does not exist
  — the cursor's syllable is not yet placed on any note — neither scope
  means anything, so neither offers itself.

  Direction is two arrows, never text. Nothing here is visible French or
  English; `shiftLyrics.forwardAria` / `shiftLyrics.backAria` exist only
  for a screen reader.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { ShiftDirection } from '$lib/shane/pairings';

	interface Props {
		language: Language;
		/** True when the station cursor's syllable is not currently placed on
		    any note, so there is nothing to shift from. */
		disabled: boolean;
		onshift: (scope: 'end' | 'nextOpen', direction: ShiftDirection) => void;
	}
	let { language, disabled, onshift }: Props = $props();
</script>

<section class="shift-lyrics">
	<h3>{t('shiftLyrics.title', language)}</h3>
	<div class="shift-row">
		<span class="shift-label">{t('shiftLyrics.toEndOfLyric', language)}</span>
		<div class="shift-arrows">
			<button
				type="button"
				class="arrow"
				{disabled}
				aria-label={t('shiftLyrics.backAria', language)}
				onclick={() => onshift('end', 'back')}
			>&larr;</button>
			<button
				type="button"
				class="arrow"
				{disabled}
				aria-label={t('shiftLyrics.forwardAria', language)}
				onclick={() => onshift('end', 'forward')}
			>&rarr;</button>
		</div>
	</div>
	<div class="shift-row">
		<span class="shift-label">{t('shiftLyrics.toNextOpenNote', language)}</span>
		<div class="shift-arrows">
			<button
				type="button"
				class="arrow"
				{disabled}
				aria-label={t('shiftLyrics.backAria', language)}
				onclick={() => onshift('nextOpen', 'back')}
			>&larr;</button>
			<button
				type="button"
				class="arrow"
				{disabled}
				aria-label={t('shiftLyrics.forwardAria', language)}
				onclick={() => onshift('nextOpen', 'forward')}
			>&rarr;</button>
		</div>
	</div>
</section>

<style>
	.shift-lyrics {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.shift-lyrics h3 {
		margin: 0;
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #6a655f;
		font-weight: 600;
	}
	.shift-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.shift-label {
		font-size: 0.75rem;
		color: #1a1612;
	}
	.shift-arrows {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}
	/* The 44 px floor: these are real controls, not running text, so they
	   take it plainly, the same as any other button on the page. */
	.arrow {
		min-height: 44px;
		min-width: 44px;
		border: 1px solid #d8d2c6;
		border-radius: 3px;
		background: #F5F1E8;
		color: #1a1612;
		font-size: 1rem;
		cursor: pointer;
	}
	.arrow:disabled {
		color: #b8b2a8;
		cursor: default;
	}
	.arrow:not(:disabled):hover {
		border-color: #8E7E9B;
	}
	.arrow:focus-visible {
		outline: 2px solid #8E7E9B;
		outline-offset: 1px;
	}
</style>
