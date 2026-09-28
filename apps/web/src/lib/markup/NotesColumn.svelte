<script lang="ts">
	/**
	 * The trailing notes sheet's column: the withheld statement (item 1.8), the
	 * octave notice, and the "Places to watch" band, in that order (Dann's
	 * placement ruling, 2026-07-18). Lifted out of `MarkupPane.svelte` with its
	 * styles when the notes learned to run on to a further sheet (Dann's look,
	 * 2026-09-28; `notes-pages.ts` says why and how).
	 *
	 * TWO MODES. Given a `sheet`, it draws that sheet's share inside the page's
	 * content window. Given no `sheet`, it lays the whole column out unseen and
	 * unbounded at the same text width, and reports each piece's place through
	 * `onmeasure`, so the pane can pack the sheets. It measures with `offsetTop`
	 * and `offsetHeight`, which are layout pixels: `PageFit`'s scaling
	 * transform does not reach them, where it would reach a bounding rect.
	 */
	import type { NotesMeasure, NotesSheet } from './notes-pages';

	interface Withheld {
		heading: string;
		lede: string;
		items: string[];
		close: string;
	}

	interface Props {
		withheld: Withheld | null;
		octave: string | null;
		bandHeader: string;
		/** Every line of the band; empty when the band does not print. */
		lines: string[];
		/** This sheet's share; omitted in the measuring mode. */
		sheet?: NotesSheet;
		/** The content window's insets, in px (sheet mode). */
		top?: number;
		bottom?: number;
		onmeasure?: (m: NotesMeasure) => void;
	}

	let { withheld, octave, bandHeader, lines, sheet, top = 0, bottom = 0, onmeasure }: Props = $props();

	const all: NotesSheet = $derived({ withheld: !!withheld, octave: !!octave, lines: lines.length > 0 ? [0, lines.length] : null });
	const share = $derived(sheet ?? all);

	let column: HTMLDivElement | undefined = $state();

	function measure() {
		if (!column || !onmeasure) return;
		const span = (el: Element | null) =>
			el instanceof HTMLElement ? { top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight } : undefined;
		const band = span(column.querySelector('.watch-band'));
		onmeasure({
			withheld: span(column.querySelector('.withheld')),
			octave: span(column.querySelector('.octave-notice')),
			band: band && {
				...band,
				lines: [...column.querySelectorAll('.watch-band-line')].map((li) => span(li)!)
			}
		});
	}

	// Re-measure whenever the column's size changes: new lines, a language
	// switch, or the web fonts arriving and reflowing the text.
	$effect(() => {
		if (sheet || !column) return;
		const observer = new ResizeObserver(measure);
		observer.observe(column);
		return () => observer.disconnect();
	});
	$effect(() => {
		void [lines, withheld, octave];
		if (!sheet) measure();
	});
</script>

{#snippet content()}
	{#if withheld && share.withheld}
		<!-- Item 1.8: absence as a positive object on the page, not a
		     gap. Placed FIRST, above the octave notice, because it
		     governs everything else on the sheet: if no voice has been
		     measured, nothing below it could have been forecast. -->
		<aside class="withheld" aria-label={withheld.heading}>
			<p class="withheld-heading">{withheld.heading}</p>
			<p class="withheld-lede">{withheld.lede}</p>
			<ul class="withheld-list">
				{#each withheld.items as item (item)}
					<li class="withheld-line">{item}</li>
				{/each}
			</ul>
			<p class="withheld-close">{withheld.close}</p>
		</aside>
	{/if}
	{#if octave && share.octave}
		<aside class="octave-notice">{octave}</aside>
	{/if}
	{#if share.lines}
		<aside class="watch-band" aria-label={bandHeader}>
			<p class="watch-band-header">{bandHeader}</p>
			<ul class="watch-band-list">
				{#each lines.slice(share.lines[0], share.lines[1]) as line (line)}
					<li class="watch-band-line">{line}</li>
				{/each}
			</ul>
		</aside>
	{/if}
{/snippet}

{#if sheet}
	<div class="commentary-window" style="top: {top}px; bottom: {bottom}px;">
		{@render content()}
	</div>
{:else}
	<div class="notes-measure" aria-hidden="true">
		<div class="commentary-column" bind:this={column}>
			{@render content()}
		</div>
	</div>
{/if}

<style>
	/* The notes page's content window: the same text column as the score, a
	   column of the octave notice then the "Places to watch" band. The octave
	   notice and band render AFTER the score on their own sheet (Dann's
	   placement ruling, 2026-07-18). First-pass treatment; design is Dann's.
	   `overflow: hidden` stays as a backstop only: the packing in
	   `notes-pages.ts` sees that nothing reaches it. */
	.commentary-window {
		position: absolute;
		left: 96px;
		right: 96px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: hidden;
	}

	/* The measuring twin: the same width and the same column rules, laid out
	   unbounded, seen by nobody, and taking no room on the sheet. */
	.notes-measure {
		position: absolute;
		left: 96px;
		right: 96px;
		top: 0;
		height: 0;
		overflow: hidden;
		visibility: hidden;
		pointer-events: none;
	}

	.commentary-column {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.octave-notice {
		box-sizing: border-box;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--ink-secondary, #4a4540);
	}

	/* Item 1.8, the withheld statement. Twinned on .watch-band deliberately:
	   it stands in the place the watch list would have stood, so it should
	   carry the same weight rather than read as a warning. Same squircle, same
	   lavender, same small-caps header. The only departure is the closing line,
	   which is italic serif to match .octave-notice, because it is a remark
	   about the page rather than an item in a list. */
	.withheld,
	.watch-band {
		box-sizing: border-box;
		border: 1px solid var(--lavender, #9585a2);
		border-radius: 12px;
		padding: 0.7rem 1.1rem 0.8rem;
		background: var(--paper-cream);
	}

	/* The box's title (Dann's look, 2026-09-28: at 0.8rem in the outline
	   lavender, #9585A2, he did not see it). Now Insights' `.section-head`,
	   which is `TitleHeader.svelte`'s `.metadata-line` recipe, in lavender
	   label ink: the same title the sister document puts on its boxes, and
	   --lavender-ink clears 4.5 on cream where --lavender did not. The
	   withheld heading moves with it, since the two are twins. */
	.withheld-heading,
	.watch-band-header {
		margin: 0 0 0.35rem;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 1.5px;
		line-height: 1.6;
		font-variant-caps: all-small-caps;
		color: var(--lavender-ink, #554660);
	}

	.withheld-lede {
		margin: 0 0 0.5rem;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	.withheld-list {
		margin: 0 0 0.5rem;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.withheld-line,
	.watch-band-line {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	.withheld-close {
		margin: 0;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	/* Outline-only lavender squircle; an in-flow block below the score. */
	.watch-band-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
</style>
