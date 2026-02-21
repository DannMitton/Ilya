<script lang="ts">
	import type { WordStackData, PageSize, LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, HEADER_HEIGHTS, FOOTER_MAX_HEIGHT, GAP, MARGINS, ROW_HEIGHT } from '$lib/page-config';
	import RunningHeader from './RunningHeader.svelte';
	import VerseLine from './VerseLine.svelte';
	import PageFooter from './PageFooter.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language: Language;
		pageSize: PageSize;
		pageNumber: number;
		totalPages: number;
		runningHeader: string;
		legendItems: LegendItem[];
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, string>;
		onwordclick?: (word: WordStackData) => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		pageSize,
		pageNumber,
		totalPages,
		runningHeader,
		legendItems,
		showStressDiacritics = false,
		spotReconstitution,
		glossOverrides,
		onwordclick,
	}: Props = $props();

	const dims = $derived(PAGE_SIZES[pageSize]);

	/** Content window positioning (px) */
	const contentTop = MARGINS.vertical + HEADER_HEIGHTS.subsequent + GAP;
	const contentBottom = MARGINS.vertical + FOOTER_MAX_HEIGHT + GAP;

	/**
	 * Subsequent pages have more vertical space than the title page
	 * (shorter header). 28px row gap distributes 10 rows evenly
	 * across the taller content aperture.
	 */
	const subsequentRowGap = 28;
</script>

<div
	class="paper-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Header layer: absolute, pinned to top margin -->
	<RunningHeader headerText={runningHeader} />

	<!-- Content layer: flex column, rows grow if they wrap -->
	<div
		class="page-content"
		style="top: {contentTop}px; bottom: {contentBottom}px; --row-height: {ROW_HEIGHT}px; --row-gap: {subsequentRowGap}px;"
	>
		{#each lines as line (line.lineNumber)}
			<div class="verse-row">
				<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {glossOverrides} {onwordclick} />
			</div>
		{/each}
	</div>

	<!-- Footer layer: absolute, pinned to bottom margin -->
	<PageFooter
		{pageNumber}
		{totalPages}
		{language}
		{legendItems}
	/>
</div>

<style>
	.paper-page {
		position: relative;
		box-sizing: border-box;
		background: var(--paper-cream);
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
	}

	/* ── Content window ────────────────────────────────────── */

	.page-content {
		position: absolute;
		left: 88px;
		right: 96px;
		overflow: visible;
		padding-top: 4px;
		padding-left: 4px;

		display: flex;
		flex-direction: column;
		gap: var(--row-gap);
	}

	.verse-row {
		box-sizing: border-box;
		min-height: var(--row-height);
		overflow: visible;
	}

	/* ── Print rules ───────────────────────────────────────── */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
