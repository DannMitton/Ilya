<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { sliceLinesToPages, formatRunningHeader } from '$lib/page-config';
	import { buildProvenanceLegend } from '$lib/provenance';
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
	/* N.45. The document-wide legend, for portrait. buildProvenanceLegend
	   takes any LineData[], so handing it every line rather than one page's
	   slice is the whole change. Without this, consolidating to the last
	   page would show only the LAST page's marks, and a singer meeting a
	   siglum on screen one would find no key for it. */
	const documentLegend = $derived(buildProvenanceLegend(lines, language));
	const totalPages = $derived(pages.length);
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

<div class="paper-container" role="region" aria-label="Transcription">
	{#each pages as pageLines, i}
		{@const legendItems = isMobile
			? (i === pages.length - 1 ? documentLegend : [])
			: buildProvenanceLegend(pageLines, language)}
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
				{isMobile}
				{showStressDiacritics}
				{spotReconstitution}
				{glossOverrides}
				{onwordclick}
			/>
		{/if}
	{/each}
</div>

<style>
	.paper-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}

	/* N.45, Dann's ruling of 11 August 2026: in portrait the text reads as
	   one scrolling document. The pages STAY in the DOM, because @page and
	   the print rules are those blocks and his ruling is that the same paper
	   prints from either device. Only the seam goes. */
	@media (max-width: 767px) {
		.paper-container {
			gap: 0;
		}
	}

	@media print {
		.paper-container {
			display: block;
			gap: 0;
			padding: 0;
		}
	}
</style>
