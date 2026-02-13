<script lang="ts">
	import type { LineData, WordStackData, PageSize } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, HEADER_HEIGHTS, FOOTER_MAX_HEIGHT, GAP, MARGINS, ROW_HEIGHT, ROW_GAP, ROW_COUNTS } from '$lib/page-config';
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
		transcriber?: string;
		showStressDiacritics?: boolean;
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
		transcriber = '',
		showStressDiacritics = false,
		onwordclick,
	}: Props = $props();

	const dims = $derived(PAGE_SIZES[pageSize]);

	/** Content window positioning (px) */
	const contentTop = MARGINS.vertical + HEADER_HEIGHTS.subsequent + GAP;
	const contentBottom = MARGINS.vertical + FOOTER_MAX_HEIGHT + GAP;
</script>

<div
	class="paper-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Header layer: absolute, pinned to top margin -->
	<RunningHeader headerText={runningHeader} />

	<!-- Content layer: absolute, fixed-height aperture -->
	<div
		class="page-content"
		style="top: {contentTop}px; bottom: {contentBottom}px; --row-height: {ROW_HEIGHT}px; --row-count: {ROW_COUNTS.subsequent}; --row-gap: {ROW_GAP}px;"
	>
		{#each lines as line (line.lineNumber)}
			<div class="verse-row">
				<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {onwordclick} />
			</div>
		{/each}
	</div>

	<!-- Footer layer: absolute, pinned to bottom margin -->
	<PageFooter
		{pageNumber}
		{totalPages}
		{transcriber}
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
		break-after: page;
	}

	/* ── Content window ────────────────────────────────────── */

	.page-content {
		position: absolute;
		left: 88px;
		right: 96px;
		overflow: hidden;
		padding-top: 4px;
		padding-left: 4px;

		display: grid;
		grid-template-rows: repeat(var(--row-count), var(--row-height));
		row-gap: var(--row-gap);
		align-content: start;
	}

	.verse-row {
		height: var(--row-height);
		box-sizing: border-box;
	}

	/* ── Print rules ───────────────────────────────────────── */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
