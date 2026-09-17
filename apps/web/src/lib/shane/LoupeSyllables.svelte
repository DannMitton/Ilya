<!--
  LoupeSyllables.svelte

  N.147, RULED BY DANN 2026-09-17: the syllable line leaves the drawer
  entirely and lives in the loupe, an accordion row under the notes, drawing
  1 ("Hairline") of the three the desk put to him that day. `Loupe.svelte`
  draws the hairline and the SYLLABLES disclosure itself (its own `.loupe-tag`
  neighbourhood); this component is the row's CONTENT, open, on the loupe's
  own paper.

  REPLACES `SyllableStation.svelte` rather than reusing it. That component was
  built for the drawer's cursor-then-click-note gesture (Finale's Lyrics
  window: arm a syllable, then click notes in the score) and carried a
  `cursor` prop, an `oncursor` arm-only callback, a `clipped` two-size render
  for the drawer's own collapsed row, and the drawer's sans 0.8125rem type.
  None of that survives N.147's ruling 3 ("no syllable is focused or armed by
  default") or its inverted gesture (tap a SYLLABLE, it places on the note
  already selected, `+page.svelte`'s `placeSyllableOnSelected`), and the two
  surfaces now differ in type (serif, not sans), in per-platform layout (a
  horizontal 44 px strip on a phone, a wrapped paragraph on a desk), and in
  the phone's own gliding scroll after a placement. Keeping one component
  branching on all of that read as more confusing than two components each
  telling one story, so this is a new file.

  READ-ONLY, still: this shows the syllables and where a placement has landed.
  It never edits one. NOTHING IS CONSUMED, exactly as the retired component's
  own head comment: placing a syllable does not remove it from the queue,
  which is derived from the transcription on every render.

  NOTHING IS FOCUSED WHEN THIS APPEARS. There is no call to `.focus()`
  anywhere in this file and no `autofocus` attribute; ruling 3 is satisfied by
  omission; a Tab from the singer is what puts focus on a syllable, and only
  then does Return or Space place it, which is a `<button>`'s native behaviour
  and needs no code of its own.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Slot, PairingMap } from '$lib/shane/pairings';

	interface Props {
		slots: readonly Slot[];
		pairings: PairingMap;
		/** The note the loupe has taken, so the row can outline its syllable. */
		selectedEventId: string | null;
		/** The phone strip scrolls sideways and glides; the desk wraps and grows. */
		isPhone: boolean;
		/** A tap on a syllable: it places on whichever note is selected, or does
		    nothing (`+page.svelte`'s own guard) where there is none. */
		onplace: (slot: Slot) => void;
		/** `Loupe.svelte`'s own toggle button points `aria-controls` at this id. */
		id: string;
	}
	let { slots, pairings, selectedEventId, isPhone, onplace, id }: Props = $props();

	const keyOf = (s: Slot) => `${s.origin.lineIndex}-${s.origin.wordIndex}-${s.origin.slotIndex}`;

	/* A slot counts as placed when SOME note carries a pairing that came from
	   it, the same rule `SyllableStation` kept: keyed by origin rather than by
	   text, so two identical syllables in one line are still two slots.
	   COLOURS UNCHANGED FROM N.114 RULING 4 ("Committed is black"): unplaced
	   #6A655F, placed #1a1612. */
	const placedKeys = $derived.by(() => {
		const s = new Set<string>();
		for (const p of Object.values(pairings)) {
			if (p.kind === 'syllable') s.add(`${p.origin.lineIndex}-${p.origin.wordIndex}-${p.origin.slotIndex}`);
		}
		return s;
	});

	/**
	 * THE ONE HIGHLIGHT N.147 RULES: the syllable sitting on the SELECTED
	 * note, found by reading that note's own pairing back rather than by
	 * tracking an index. There is no cursor here; a note that is selected but
	 * carries no syllable yet highlights nothing, which is correct, since
	 * nothing in the row is "next."
	 */
	const selectedKey = $derived.by(() => {
		if (!selectedEventId) return null;
		const p = pairings[selectedEventId];
		return p?.kind === 'syllable' ? `${p.origin.lineIndex}-${p.origin.wordIndex}-${p.origin.slotIndex}` : null;
	});

	/* THE READING ORDER, `SyllableStation`'s own grouping carried over
	   verbatim: a new poem line at a line boundary, a space at a word
	   boundary, a hyphen (kept inside the PRECEDING syllable, not a separate
	   element) within one word. `buildSlotQueue` already walks slots in this
	   document order, so this only looks at neighbours. */
	type Lead = 'line' | 'space' | null;
	const items = $derived.by(() =>
		slots.map((s, i) => {
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
		}),
	);

	/* THE PHONE'S GLIDE, ruled: "after each placement the row glides so the
	   syllable after the one placed sits about 64 px from the left edge; with
	   `prefers-reduced-motion`, it jumps." Read once, at mount, and kept live
	   by the standard `matchMedia` listener (`Pacifier.svelte`'s own
	   precedent), because a singer can change the OS setting mid-session. */
	let reducedMotion = $state(false);
	onMount(() => {
		if (typeof matchMedia !== 'function') return;
		const mq = matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onChange = () => (reducedMotion = mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	let rowEl = $state<HTMLElement | undefined>(undefined);

	/**
	 * A tap on ONE syllable. Places it (`onplace`, which is
	 * `+page.svelte`'s `placeSyllableOnSelected`; a no-op there with no note
	 * selected is that function's own guard, not this one's), then, on a
	 * phone only, glides the strip so the NEXT syllable in this row (not
	 * necessarily the note selection's own next target, which can land
	 * anywhere in the score) sits about 64 px in from the left edge.
	 */
	function tap(index: number): void {
		onplace(slots[index]);
		if (!isPhone || !rowEl) return;
		const nextEl = rowEl.querySelector<HTMLElement>(`[data-slot-index="${index + 1}"]`);
		if (!nextEl) return;
		const left = Math.max(0, nextEl.offsetLeft - 64);
		rowEl.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
	}
</script>

{#if isPhone}
	<!-- THE PHONE STRIP: one row, 44 px tall, its own height the touch floor
	     for every syllable in it (`align-items: stretch` below), scrolling
	     sideways under `touch-action: pan-x` so it can scroll inside the
	     loupe's own `touch-action: none` (`Loupe.svelte:1513`, there for the
	     dismiss swipe). DESK INFERENCE, PER THE BRIEF: a child's `pan-x`
	     leaves vertical touch movement on it unclaimed by the browser, so a
	     downward drag starting on the row should still reach the dismiss
	     listener; verified on the built-in browser's touch emulation, see the
	     memo. -->
	<div class="loupe-syl-row" bind:this={rowEl} {id}>
		{#each items as it (keyOf(it.slot))}{#if it.lead === 'line'}<span
					class="loupe-syl-break"
					aria-hidden="true"
				></span>{:else if it.lead === 'space'}{' '}{/if}<button
				type="button"
				class="loupe-syl-slot"
				class:is-placed={placedKeys.has(keyOf(it.slot))}
				class:is-selected={selectedKey === keyOf(it.slot)}
				class:joins-prev={it.lead === null}
				class:joins-next={it.trailingHyphen}
				data-slot-index={it.index}
				onclick={() => tap(it.index)}
			>{it.slot.cyrillic}{it.trailingHyphen ? '-' : ''}</button>{/each}
	</div>
{:else}
	<!-- THE DESK PARAGRAPH: wraps at the poem's own line breaks (a real
	     `<br>` at `lead === 'line'`, the browser's own wrap everywhere else),
	     serif at 16 px over a 26 px line, and scrolls downward past four
	     lines (`max-height: 104px`, the CSS below). No swipe exists on a
	     desk (`+page.svelte:1882-1883`), so there is no glide to build. -->
	<div class="loupe-syl-wrap">
		<p class="loupe-syl-text" {id}>{#each items as it (keyOf(it.slot))}{#if it.lead === 'line'}<br
					/>{:else if it.lead === 'space'}{' '}{/if}<button
					type="button"
					class="loupe-syl-slot"
					class:is-placed={placedKeys.has(keyOf(it.slot))}
					class:is-selected={selectedKey === keyOf(it.slot)}
					onclick={() => tap(it.index)}
				>{it.slot.cyrillic}{it.trailingHyphen ? '-' : ''}</button>{/each}</p>
	</div>
{/if}

<style>
	/* Shared reset. Plain inline text, not a chip, same rule
	   `SyllableStation` drew: only `.is-selected` gets a visible box. */
	.loupe-syl-slot {
		border: none;
		background: none;
		margin: 0;
		padding: 0;
		cursor: pointer;
		font: inherit;
		/* N.114 ruling 4, unchanged: "Committed is black." */
		color: #6a655f;
	}
	.loupe-syl-slot.is-placed {
		color: #1a1612;
	}
	/* THE ONE HIGHLIGHT N.147 RULES: white fill, 1.4 px lavender INSET
	   outline, 4 px radius. `outline-offset: -1.4px` is what makes a CSS
	   `outline` sit inside the box's own edge rather than outside it, which
	   is how the loupe's other mark (`.loupe :global([data-loupe-selected])`)
	   already draws OUTSIDE at `+2px`; this one is deliberately the other
	   way, per the brief. */
	.loupe-syl-slot.is-selected {
		background: #ffffff;
		outline: 1.4px solid var(--lavender, #9585a2);
		outline-offset: -1.4px;
		border-radius: 4px;
	}
	.loupe-syl-slot:focus-visible {
		outline: 2px solid var(--lavender, #9585a2);
		outline-offset: 1px;
	}

	/* ── THE PHONE STRIP ── */
	.loupe-syl-row {
		display: flex;
		align-items: stretch;
		height: 44px;
		overflow-x: auto;
		overflow-y: hidden;
		/* THE ROW'S OWN PAN, so it can scroll inside the loupe's
		   `touch-action: none`. See the head comment and the memo. */
		touch-action: pan-x;
		scrollbar-width: none;
		font-family: var(--font-serif, Georgia, serif);
		font-size: 17px;
		/* NO VISIBLE SCROLL BAR, and a soft fade at both ends, ruled. */
		mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent,
			black 16px,
			black calc(100% - 16px),
			transparent
		);
	}
	.loupe-syl-row::-webkit-scrollbar {
		display: none;
	}
	.loupe-syl-row .loupe-syl-slot {
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
		height: 100%;
		padding: 0 3px;
		white-space: nowrap;
	}
	/* NO GAP AROUND A HYPHEN WITHIN ONE WORD: `padding: 0 3px` above reads
	   right between two syllables of the SAME word, where the hyphen already
	   carries the join and a singer should read "Моск-ва," not "Моск- ва."
	   `.joins-prev`/`.joins-next` zero the one side that would otherwise open
	   a gap next to that hyphen; the desk paragraph needs neither, since
	   `display: inline` there carries no padding at all. */
	.loupe-syl-row .loupe-syl-slot.joins-prev {
		padding-left: 0;
	}
	.loupe-syl-row .loupe-syl-slot.joins-next {
		padding-right: 0;
	}
	/* A POEM LINE BREAK, shown on the strip as a wider gap with a short
	   vertical hairline rather than a line break, since the strip is one
	   line. Sizing is the desk's own call (DESK DEFAULT): the brief asks for
	   "a wider gap" and "a short vertical hairline" without pixel values. */
	.loupe-syl-break {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 100%;
	}
	.loupe-syl-break::before {
		content: '';
		display: block;
		width: 1px;
		height: 16px;
		background: rgba(74, 69, 64, 0.25);
	}

	/* ── THE DESK PARAGRAPH ── */
	.loupe-syl-wrap {
		max-height: 104px;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.loupe-syl-text {
		margin: 0;
		font-family: var(--font-serif, Georgia, serif);
		font-size: 16px;
		line-height: 26px;
	}
	.loupe-syl-wrap .loupe-syl-slot {
		display: inline;
	}

	@media print {
		.loupe-syl-row,
		.loupe-syl-wrap {
			display: none !important;
		}
	}
</style>
