<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { t } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, HEADER_HEIGHTS, FOOTER_MAX_HEIGHT, GAP, MARGINS, ROW_HEIGHT, ROW_GAP, ROW_COUNTS } from '$lib/page-config';
	import { COMPOSERS, POETS, formatNameForPaper } from '$lib/composers-poets';
	import TitleHeader from './TitleHeader.svelte';
	import VerseLine from './VerseLine.svelte';
	import PageFooter from './PageFooter.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language: Language;
		metadata: SongMetadata;
		pageSize: PageSize;
		totalPages: number;
		legendItems: LegendItem[];
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		onwordclick?: (word: WordStackData) => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		metadata,
		pageSize,
		totalPages,
		legendItems,
		showStressDiacritics = false,
		spotReconstitution,
		onwordclick,
	}: Props = $props();

	const dims = $derived(PAGE_SIZES[pageSize]);
	const hasContent = $derived(lines.length > 0);

	/** Transform composer/poet names for paper display: "Given Surname (dates)" */
	const composerDisplay = $derived(formatNameForPaper(metadata.composer, COMPOSERS));
	const poetDisplay = $derived(formatNameForPaper(metadata.poet, POETS));

	/** Content window positioning (px) */
	const contentTop = MARGINS.vertical + HEADER_HEIGHTS.title + GAP;
	const contentBottom = MARGINS.vertical + FOOTER_MAX_HEIGHT + GAP;
</script>

<div
	class="paper-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Header layer: absolute, pinned to top margin -->
	<TitleHeader
		title={metadata.title}
		composer={composerDisplay}
		poet={poetDisplay}
		opus={metadata.opus}
		{language}
	/>

	<!-- Content layer: absolute, fixed-height aperture -->
	<div
		class="page-content"
		style="top: {contentTop}px; bottom: {contentBottom}px; --row-height: {ROW_HEIGHT}px; --row-count: {ROW_COUNTS.title}; --row-gap: {ROW_GAP}px;"
	>
		{#if hasContent}
			{#each lines as line (line.lineNumber)}
				<div class="verse-row">
					<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {onwordclick} />
				</div>
			{/each}
		{:else}
			<div class="empty-directive">
				<p>{t('paper.empty', language)}</p>
			</div>
		{/if}
	</div>

	<!-- Footer layer: absolute, pinned to bottom margin -->
	<PageFooter
		pageNumber={1}
		{totalPages}
		transcriber={metadata.transcriber}
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

		display: grid;
		grid-template-rows: repeat(var(--row-count), var(--row-height));
		row-gap: var(--row-gap);
		align-content: start;
	}

	.verse-row {
		height: var(--row-height);
		box-sizing: border-box;
	}

	/* ── Empty state ───────────────────────────────────────── */

	.empty-directive {
		grid-column: 1;
		grid-row: 1 / -1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--ink-tertiary);
		font-style: italic;
		font-family: var(--font-serif);
		font-size: 1rem;
		line-height: 1.6;
		max-width: 480px;
		margin: 0 auto;
	}

	/* ── Print rules ───────────────────────────────────────── */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}

		.empty-directive {
			display: none;
		}
	}
</style>
