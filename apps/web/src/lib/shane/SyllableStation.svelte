<!--
  SyllableStation.svelte

  N.55b R4: Finale's Lyrics window, in Ilya's drawer.

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

  The count is a numeral pair rather than a sentence, so it needs no
  translation and no plural agreement.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { Slot, PairingMap } from '$lib/shane/pairings';

	interface Props {
		slots: readonly Slot[];
		pairings: PairingMap;
		/** Index into `slots` of the syllable the next note click will place. */
		cursor: number;
		language: Language;
		oncursor: (index: number) => void;
	}
	let { slots, pairings, cursor, language, oncursor }: Props = $props();

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
</script>

{#if slots.length > 0}
	<section class="syllable-station">
		<div class="station-head">
			<h3>{t('station.syllables', language)}</h3>
			<span class="station-count">{placedCount}&thinsp;/&thinsp;{slots.length}</span>
		</div>
		<ol class="slot-row">
			{#each slots as s, i (keyOf(s))}
				<li>
					<button
						type="button"
						class="slot"
						class:is-placed={placed.has(keyOf(s))}
						class:is-cursor={i === cursor}
						aria-current={i === cursor ? 'true' : undefined}
						onclick={() => oncursor(i)}
					>
						<span class="slot-ipa">{s.ipa}</span>
						<span class="slot-cyr">{s.cyrillic}</span>
					</button>
				</li>
			{/each}
		</ol>
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
	.station-count {
		font-size: 0.75rem;
		color: #6a655f;
		font-variant-numeric: tabular-nums;
	}
	.slot-row {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	/* The ruled touch floor is 44 by 44 with two exemptions and no third
	   (E.36 §1.5). A syllable chip is not a third exemption: it takes the
	   floor. */
	.slot {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1px;
		min-height: 44px;
		min-width: 44px;
		padding: 4px 8px;
		border: 1px solid transparent;
		border-radius: 3px;
		background: #F5F1E8;
		cursor: pointer;
		color: #1a1612;
		font: inherit;
	}
	/* IPA above Cyrillic, matching the page and Transcribe's word stack, so
	   the reading order is learned once (`staff-renderer.ts:1231-1234`). */
	.slot-ipa {
		font-size: 0.75rem;
		color: #6a655f;
		font-family: 'Lato IPA', sans-serif;
		line-height: 1.1;
	}
	.slot-cyr {
		font-size: 0.8125rem;
		line-height: 1.1;
	}
	.slot.is-placed {
		background: transparent;
	}
	.slot.is-placed .slot-cyr,
	.slot.is-placed .slot-ipa {
		color: #9a948c;
	}
	.slot.is-cursor {
		border-color: #8E7E9B;
		background: #FFFFFF;
	}
	.slot:focus-visible {
		outline: 2px solid #8E7E9B;
		outline-offset: 1px;
	}
</style>
