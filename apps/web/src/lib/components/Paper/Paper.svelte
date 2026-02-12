<script lang="ts">
	import { untrack } from 'svelte';
	import type { LineData, WordStackData, SongMetadata, PageSize, Page } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { t } from '$lib/i18n';
	import { distributeLinesToPages } from '$lib/paper-manager';
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
		onwordclick?: (word: WordStackData) => void;
	}

	let { lines, notationPrefs, language, metadata, pageSize, showStressDiacritics = false, spotReconstitution, onwordclick }: Props = $props();

	const hasTranscription = $derived(lines.length > 0);
	const pages = $derived(distributeLinesToPages(lines, pageSize));
	const totalPages = $derived(Math.max(pages.length, 1));
</script>

<div class="paper-container" role="region" aria-label="Transcription">
	{#if hasTranscription}
		{#each pages as page (page.pageIndex)}
			{#if page.template === 'title'}
				<TitlePage
					lines={page.lines}
					{notationPrefs}
					{language}
					{metadata}
					{pageSize}
					{totalPages}
					{showStressDiacritics}
					{spotReconstitution}
					{onwordclick}
				/>
			{:else}
				<SubsequentPage
					pageNumber={page.pageIndex + 1}
					lines={page.lines}
					{notationPrefs}
					{language}
					{metadata}
					{pageSize}
					{totalPages}
					{showStressDiacritics}
					{spotReconstitution}
					{onwordclick}
				/>
			{/if}
		{/each}
	{:else}
		<TitlePage
			lines={[]}
			{notationPrefs}
			{language}
			{metadata}
			{pageSize}
			totalPages={1}
			{showStressDiacritics}
			{spotReconstitution}
			{onwordclick}
		/>
	{/if}
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
