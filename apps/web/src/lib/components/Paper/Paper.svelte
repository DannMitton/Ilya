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
		onwordclick?: (word: WordStackData) => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		metadata,
		pageSize,
		showStressDiacritics = false,
		onwordclick,
	}: Props = $props();

	const pages = $derived(sliceLinesToPages(lines));
	const totalPages = $derived(pages.length);
	const runningHeader = $derived(
		formatRunningHeader(metadata.composer, metadata.title)
	);
</script>

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
				{onwordclick}
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
				transcriber={metadata.transcriber}
				{showStressDiacritics}
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
</style>
