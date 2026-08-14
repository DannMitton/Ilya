<!--
  SyllableStation.svelte

  N.55b R4: Finale's Lyrics window, in Ilya's drawer.

  Updated 2026-08-14 to the shape RULED by Dann, 2026-08-13 (STATE.md,
  "N.55b's station shape"): the lyric runs as ONE piece of readable text,
  hyphenated at slot boundaries, not a wrapped grid of chips. No IPA row —
  the station reorients you in the poem as source text; IPA reappears under
  the note once the correspondence exists. One moving highlight marks the
  cursor. The whole verse is present; this component sets no height and no
  overflow of its own, so the drawer's own scroll (`Drawer.svelte`'s
  `.drawer-content`) carries it and there is never a second, nested scroll.
  The 44 px touch floor sits on the cursor alone, not on every syllable;
  direct tapping of any syllable stays available regardless of its size.

  Finale puts the text in one window and the notes in another: you place the
  cursor at a syllable, then click notes in the score. Neither gesture is
  overloaded and there is no mode. Transcribe is the Lyrics window, but it is
  a separate tab, so the CURSOR needs a home on the score surface. It lives
  here, because drawer manipulates and page displays and prints (E.27's
  binding paradigm, which Fable lists among the rulings that may not be
  re-decided). A strip beside the stave would put a control on the paper.

  READ-ONLY, and that is not a shortcut: Transcribe owns every text
  operation. This shows the syllables and where you are in them. It never
  edits one.

  NOTHING IS CONSUMED. Placing a syllable does not remove it from the queue,
  exactly as Finale's Lyrics window keeps its text. The queue is derived from
  the transcription on every render, so a syllable you have not placed is
  still here, and one you place twice is still here.

  The placed count is a numeral pair rather than a sentence, so it needs no
  translation and no plural agreement.

  THE DRIFT LINE is the one string here that does need translating, and its
  wording was ratified by Dann on 2026-08-14: it agrees with `texte`, not
  with the count, so one string covers every number in both languages. It is
  drawn ONLY when the count is above zero, so it is not a mark that appears
  on everything and therefore says nothing. It is set in the same muted grey
  as the placed count and takes no alarm colour: a re-transcription is a
  thing the singer did on purpose, not a fault.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { Slot, PairingMap } from '$lib/shane/pairings';

	interface Props {
		slots: readonly Slot[];
		pairings: PairingMap;
		/** Index into `slots` of the syllable the next note click will place. */
		cursor: number;
		/** Pairings whose stored text the current transcription no longer
		    produces. Counted by `reconcilePairings` (pairings.ts:318). */
		drift?: number;
		language: Language;
		oncursor: (index: number) => void;
	}
	let { slots, pairings, cursor, language, oncursor, drift = 0 }: Props = $props();

	const keyOf = (s: Slot) => `${s.origin.lineIndex}-${s.origin.wordIndex}-${s.origin.slotIndex}`;

	// A slot counts as placed when SOME note carries a pairing that came from
	// it. Keyed by origin rather than by text, so two identical syllables in
	// one line are still two slots.
	const placed = $derived.by(() => {
		const s = new Set<string>();
		for (const p of Object.values(pairings)) {
			if (p.kind === 'syllable') {
				s.add(`${p.origin.lineIndex}-${p.origin.wordIndex}-${p.origin.slotIndex}`);
			}
		}
		return s;
	});
	const placedCount = $derived(slots.filter((s) => placed.has(keyOf(s))).length);

	// The reading order for the running text: a new line at a line boundary,
	// a space at a word boundary, a hyphen (kept inside the PRECEDING
	// syllable's own button, not a separate element) at a boundary within one
	// word. `buildSlotQueue` (pairings.ts:187) already walks slots in that
	// document order, so this only has to look at neighbours.
	type Lead = 'line' | 'space' | null;
	const items = $derived.by(() => {
		return slots.map((s, i) => {
			const prev = i > 0 ? slots[i - 1] : undefined;
			const next = i < slots.length - 1 ? slots[i + 1] : undefined;
			let lead: Lead = null;
			if (prev) {
				lead =
					prev.origin.lineIndex !== s.origin.lineIndex
						? 'line'
						: prev.origin.wordIndex !== s.origin.wordIndex
							? 'space'
							: null;
			}
			const trailingHyphen =
				next !== undefined &&
				next.origin.lineIndex === s.origin.lineIndex &&
				next.origin.wordIndex === s.origin.wordIndex;
			return { slot: s, index: i, lead, trailingHyphen };
		});
	});
</script>

{#if slots.length > 0}
	<section class="syllable-station">
		<div class="station-head">
			<h3>{t('station.syllables', language)}</h3>
			<span class="station-count">{placedCount}&thinsp;/&thinsp;{slots.length}</span>
		</div>
		{#if drift > 0}
			<p class="station-drift">
				<span>{t('station.textChanged', language)}</span>
				<span class="station-count">{drift}</span>
			</p>
		{/if}
		<p class="station-text">
			{#each items as it (keyOf(it.slot))}{#if it.lead === 'line'}<br />{:else if it.lead === 'space'}{' '}{/if}<button
					type="button"
					class="slot"
					class:is-placed={placed.has(keyOf(it.slot))}
					class:is-cursor={it.index === cursor}
					aria-current={it.index === cursor ? 'true' : undefined}
					onclick={() => oncursor(it.index)}
				>{it.slot.cyrillic}{it.trailingHyphen ? '-' : ''}</button>{/each}
		</p>
	</section>
{/if}

<style>
	.syllable-station {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.station-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	.station-head h3 {
		margin: 0;
		font-size: 0.6875rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #6a655f;
		font-weight: 600;
	}
	/* Mirrors .station-head so the numeral sits in the same column. */
	.station-drift {
		margin: 0;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #6a655f;
	}
	.station-count {
		font-size: 0.75rem;
		color: #6a655f;
		font-variant-numeric: tabular-nums;
	}
	/* The whole verse as one piece of readable text, hyphenated at slot
	   boundaries. No height and no overflow here: the drawer's own scroll
	   carries it (`Drawer.svelte`'s `.drawer-content`, overflow-y: auto).
	   A second overflow on this element would be the nested-scroll failure
	   mode the ruling names. */
	.station-text {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: #1a1612;
	}
	/* Plain inline text, not a chip: only the cursor (below) gets a visible
	   box and the 44 px floor. Every other syllable is a same-size word in
	   the sentence, still a real button, still directly tappable. */
	.slot {
		display: inline;
		border: none;
		background: none;
		margin: 0;
		padding: 0;
		border-radius: 2px;
		cursor: pointer;
		color: inherit;
		font: inherit;
	}
	.slot.is-placed {
		color: #9a948c;
	}
	/* The one moving highlight (STATE.md, "N.55b's station shape"). This is
	   the sole surface that spends the 44 px touch floor; every other
	   syllable stays plain text, per the same ruling. */
	.slot.is-cursor {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		min-width: 44px;
		padding: 2px 6px;
		color: #1a1612;
		background: #FFFFFF;
		border: 1px solid #8E7E9B;
		vertical-align: middle;
	}
	.slot:focus-visible {
		outline: 2px solid #8E7E9B;
		outline-offset: 1px;
	}
</style>
