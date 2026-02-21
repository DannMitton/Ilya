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
		showStressDiacritics = false,
		spotReconstitution = new Map(),
		glossOverrides = new Map(),
		onwordclick,
	}: Props = $props();

	/** Page-1 row budget, updated by TitlePage after header measurement. */
	let page1Budget = $state(9);

	const pages = $derived(sliceLinesToPages(lines, page1Budget));
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
		{@const legendItems = buildProvenanceLegend(pageLines, language)}
		{#if i === 0}
			<TitlePage
				lines={pageLines}
				{notationPrefs}
				{language}
				{metadata}
				{pageSize}
				{totalPages}
				{legendItems}
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

<style>
	.paper-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}

	@media print {
		.paper-container {
			display: block;
			gap: 0;
			padding: 0;
		}
	}
</style>
