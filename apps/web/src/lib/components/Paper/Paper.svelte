<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { PAGE_SIZES, sliceLinesToPages, formatRunningHeader } from '$lib/page-config';
	import { buildProvenanceLegend } from '$lib/provenance';
	import PageFit from './PageFit.svelte';
	import TitlePage from './TitlePage.svelte';
	import SubsequentPage from './SubsequentPage.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language: Language;
		metadata: SongMetadata;
		pageSize: PageSize;
		isMobile?: boolean;
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, string>;
		onwordclick?: (word: WordStackData) => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		metadata,
		pageSize,
		isMobile = false,
		showStressDiacritics = false,
		spotReconstitution = new Map(),
		glossOverrides = new Map(),
		onwordclick,
	}: Props = $props();

	/** Page-1 row budget, updated by TitlePage after header measurement. */
	let page1Budget = $state(9);

	const pages = $derived(sliceLinesToPages(lines, page1Budget));
	const totalPages = $derived(pages.length);

	/* The fit itself lives in PageFit.svelte (N.73 C2), which the marked
	   score's page now shares. The 0.74 share that stood here is gone with
	   it: Dann's C2 ruling spends the gutter in the desk's own padding, so
	   the page fills the desk that is left and the width follows one token
	   rather than a percentage. */
	const runningHeader = $derived(
		formatRunningHeader(metadata.composer, metadata.title, metadata.poet)
	);

	function handleBudgetChange(maxRows: number) {
		page1Budget = maxRows;
	}
</script>

<svelte:head>
	{@html `<style id="ilya-print-page">@page { size: ${pageSize === 'a4' ? '210mm 297mm' : '8.5in 11in'}; margin: 0; }</style>`}
</svelte:head>

<PageFit fit={isMobile} pageWidth={PAGE_SIZES[pageSize].width}>
	{#snippet content()}
<div class="paper-container" role="region" aria-label="Transcription">
	{#each pages as pageLines, i}
		<!-- N.65 item 8. The spot map goes into the builder alongside the lines,
		     so a page carrying an `R` carries its legend entry and a page
		     without one does not. Dann's ruling of 2026-08-21: "When a sigil
		     prints to the page it must be decoded with a legend." -->
		{@const legendItems = buildProvenanceLegend(pageLines, language, spotReconstitution)}
		{#if i === 0}
			<TitlePage
				lines={pageLines}
				{notationPrefs}
				{language}
				{metadata}
				{pageSize}
				{totalPages}
				{legendItems}
				{isMobile}
				{showStressDiacritics}
				{spotReconstitution}
				{glossOverrides}
				{onwordclick}
				onbudgetchange={handleBudgetChange}
			/>
		{:else}
			<SubsequentPage
				lines={pageLines}
				{notationPrefs}
				{language}
				{pageSize}
				pageNumber={i + 1}
				{totalPages}
				{runningHeader}
				{legendItems}
				{showStressDiacritics}
				{spotReconstitution}
				{glossOverrides}
				{onwordclick}
			/>
		{/if}
	{/each}
</div>
	{/snippet}
</PageFit>

<style>
	.paper-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}

	/* N.45's seam rule stood here and closed the gap between pages on the
	   phone, because the spike had reflowed them into one scrolling document
	   and a gap would have read as a tear. N.73 portrait C put the pages back:
	   they are discrete sheets again, each with its own shadow, so the seam
	   between them is the desktop's 2rem and it scales with everything else. */

	/* The print guard that undoes the fit travels with the fit, in
	   PageFit.svelte. This block is the page stack's own print layout. */
	@media print {
		.paper-container {
			display: block;
			gap: 0;
			padding: 0;
		}
	}
</style>
