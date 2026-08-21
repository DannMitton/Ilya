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
	import StationHeader from '$lib/components/Drawer/StationHeader.svelte';
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
	<!-- LAVENDER, AND IT IS DANN EXTENDING HIS OWN RULING, 2026-08-20 on his
	     walk of the silhouette ship. "Lavender marks the marked score" was
	     ruled 2026-08-19 for the BANNER and the DESK
	     (`claude/ruling-lavender-marks-the-marked-score_2026-08-19.md`);
	     this carries it into a drawer STATION. So the drawer now reads sage
	     for transcription work and lavender for score work, which is the
	     same hue-names-place rule that already puts a sage border on the
	     text intake and a lavender one on the score intake.

	     THE TOKEN IS `--deeper-lavender`, the one the marked score already
	     uses: it is the app bar's `.header-bar.tab-shane` fill and the score
	     intake's own border. `--surround-marked` is that hue at 60 percent
	     toward white, which is a DESK tint and far too light to set type in,
	     so it is not this. No new token enters the palette.

	     `StationHeader` RATHER THAN THIS FILE'S OWN `<h3>`, so that only the
	     colour differs from every other station label, which is what Dann
	     ruled. The old rule here was 0.6875rem at 0.08em in `#6a655f`,
	     against the drawer recipe's 0.7rem at 0.12em; keeping it and only
	     repainting it would have left this label the one that is a
	     different size and a different tracking from all its neighbours. -->
	<StationHeader label={t('shiftLyrics.title', language)} accent="var(--deeper-lavender)" />
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
	/* THE STATION RULE, RULED BY DANN 2026-08-20 on his walk of the
	   silhouette ship: a horizontal divider above this header, in the weight
	   every other station rule uses, in lavender rather than sage.

	   2px is that weight, `RootPanel`'s `.section` recipe. The 6px of top
	   padding comes with it and is not a separate decision: the recipe puts
	   6px between a rule and the label it names, and a rule dropped in
	   without it would sit hard against the type. The recipe's 12px below
	   the body is NOT applied, because Dann ruled a divider above the header
	   and nothing about the space beneath. */
	.shift-lyrics {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-top: 2px solid var(--deeper-lavender);
		padding-top: 6px;
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
