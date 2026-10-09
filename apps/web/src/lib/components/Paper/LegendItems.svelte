<script lang="ts">
	import type { LegendItem } from '$lib/provenance';
	import { WITHHELD_SIGLA, stemLegendDrawing, type PreparedSmuflFont } from '@ilya/score-parser';
	import { MARKUP_WITHHELD_TYPE } from '$lib/markup/legend';

	/**
	 * The legend's entries, drawn one after another as inline items. Lifted out
	 * of `PageFooter.svelte` unchanged (walk finding 2026-10-09, the Markup
	 * legend moves to the header's subtitle line), so the footer's provenance
	 * legend and the header's Markup legend draw an entry the same way. The
	 * entry's size follows `--legend-font-size` (9.5px where unset), so a
	 * caller sets it on a wrapper rather than this component knowing where it sits.
	 */
	interface Props {
		items: LegendItem[];
		/** The page's notation font, so a stems key draws with the same heads the stave does (N.176). */
		notationFont?: { prepared: PreparedSmuflFont; family: string } | null;
	}

	let { items, notationFont = null }: Props = $props();
</script>

{#each items as item}
	<span class="legend-item">
		<!-- item.textOnly (item 1.6): an entry that is a word on the page
		     rather than a glyph carries no circle. No builder sets it
		     since the Markup voice states were removed (2026-09-28).
		     Absent means "draw it". -->
		{#if item.stems}
			<!-- N.176: four notes, their stems pointing the stated way, from the
			     renderer's own heads, stems, beam and ink (`stemLegendDrawing`). -->
			{@const d = stemLegendDrawing(item.stems, notationFont ? { font: notationFont.prepared, fontFamily: notationFont.family } : {})}
			<svg class="legend-stems" width={d.width} height={d.height} viewBox="0 0 {d.width} {d.height}" aria-hidden="true" data-stems={item.stems}>{@html d.inner}</svg>
		{:else if !item.textOnly}
			<span class="legend-circle" aria-hidden="true">
			{#if item.type === 'user-dictionary'}
				<!-- Dictionary (open book with spine) -->
				<svg viewBox="0 0 16 16" class="legend-icon" fill="none"><path d="M8 2C6.5 1 4 .5 1 1v11c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2V1c-3-.5-5.5 0-7 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" stroke-width="1"/></svg>
			{:else if item.type === 'user-composer'}
				<!-- Composer (beamed eighth notes) -->
				<svg viewBox="0 0 16 16" class="legend-icon" fill="currentColor"><ellipse cx="4" cy="13" rx="2.5" ry="1.8" transform="rotate(-20 4 13)"/><ellipse cx="11.5" cy="12" rx="2.5" ry="1.8" transform="rotate(-20 11.5 12)"/><rect x="5.5" y="1.5" width="1.3" height="11.5"/><rect x="12.5" y="1.5" width="1.3" height="10.5"/><rect x="5.5" y="1.5" width="8.3" height="2" rx="0.3"/></svg>
			{:else if item.type === 'user-override'}
				<!-- User (head + shoulders) -->
				<svg viewBox="0 0 16 16" class="legend-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z"/></svg>
			{:else if item.type === 'yo-restored'}
				<!-- ё (two dots + curved e) -->
				<svg viewBox="0 0 16 16" class="legend-icon" fill="currentColor" stroke="currentColor"><circle cx="5.5" cy="2.5" r="1.3" stroke="none"/><circle cx="10.5" cy="2.5" r="1.3" stroke="none"/><path d="M4 10h8c0-3-2-4.5-4-4.5S4 7 4 10c0 2.5 1.5 4.5 4 4.5 1.5 0 3-.5 4-2" fill="none" stroke-width="1.5" stroke-linecap="round"/></svg>
			{:else if item.type === MARKUP_WITHHELD_TYPE}
				<!-- N.10b: the withheld sigla, drawn from the SAME constant
				     the renderer puts on the stave, so the legend and the
				     page can never become two different glyphs. Lavender
				     here for the same reason it is lavender there. -->
				<svg viewBox="{WITHHELD_SIGLA.x} {WITHHELD_SIGLA.y} {WITHHELD_SIGLA.w} {WITHHELD_SIGLA.h}" class="legend-icon" fill={WITHHELD_SIGLA.colour}><path d={WITHHELD_SIGLA.path}/></svg>
			{:else if item.type === 'spot-reconstitution'}
				<!-- Reconstitution (traced capital R) -->
				<svg viewBox="348 458 854 1063" class="legend-icon" fill="currentColor"><path d="M408 989.5V1474h202v-351l81.7.2 81.7.3 90.1 175.2 90 175.3h114.9c91.4 0 114.7-.3 114.3-1.2-.3-.7-46.2-86.6-102-190.8-95.7-178.8-101.3-189.6-99.3-190.4 10.4-4.5 35.9-17.6 43.1-22.2 64.8-41.4 109.9-110.8 124.5-191.4 6.4-35.6 7-83.2 1.4-121-12.7-86.9-55.2-153.9-125.7-198.2-37.3-23.5-81.9-39.5-133.2-47.7-35.9-5.8-22.8-5.5-262.7-5.8l-220.8-.4zM798 664c58.3 3.7 100.8 26.3 127.2 67.6 14.2 22.2 21.8 51.9 21.8 85.4 0 44.8-12.6 80-38 106.4-24.5 25.4-55.6 39.5-98.5 44.5-5.7.7-43.8 1.1-104.7 1.1H610V816.7c0-83.8.3-152.7.7-153 1-1.1 170.2-.8 187.3.3"/></svg>
			{/if}
		</span>
		{/if}
		<span class="legend-label">{#if item.emphasis && item.label.includes(item.emphasis)}{item.label.slice(0, item.label.indexOf(item.emphasis))}<u>{item.emphasis}</u>{item.label.slice(item.label.indexOf(item.emphasis) + item.emphasis.length)}{:else}{item.label}{/if}</span>
	</span>
{/each}

<style>
	.legend-item {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: #78716c;
	}

	.legend-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: 1px solid currentColor;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.legend-stems {
		flex-shrink: 0;
		margin-right: 2px;
	}

	.legend-icon {
		width: 9px;
		height: 9px;
		flex-shrink: 0;
	}

	.legend-label {
		font-family: var(--font-sans);
		font-size: var(--legend-font-size, 9.5px);
		font-variant-caps: small-caps;
		letter-spacing: 0.04em;
	}
</style>
