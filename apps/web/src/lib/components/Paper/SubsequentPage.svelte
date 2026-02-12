<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import { PAGE_DIMENSIONS } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { formatRunningHeader, buildProvenanceLegend } from '$lib/paper-manager';
	import VerseLine from './VerseLine.svelte';
	import PageFooter from './PageFooter.svelte';

	interface Props {
		pageNumber: number;
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language: Language;
		metadata: SongMetadata;
		pageSize: PageSize;
		totalPages: number;
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		onwordclick?: (word: WordStackData) => void;
	}

	let { pageNumber, lines, notationPrefs, language, metadata, pageSize, totalPages, showStressDiacritics = false, spotReconstitution, onwordclick }: Props = $props();

	const dims = $derived(PAGE_DIMENSIONS[pageSize]);
	const runningHeader = $derived(formatRunningHeader(metadata.composer, metadata.title));
	const legend = $derived(buildProvenanceLegend(lines, language, spotReconstitution));
</script>

<div
	class="paper-page subsequent-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Running header -->
	{#if runningHeader}
		<div class="running-header">
			<span class="running-text">{runningHeader}</span>
			<div class="running-underline"></div>
		</div>
	{/if}

	<!-- Content area -->
	<div class="page-content">
		{#each lines as line (line.lineNumber)}
			<div class="verse-line-wrapper">
				<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {onwordclick} />
			</div>
		{/each}
	</div>

	<PageFooter
		{pageNumber}
		{totalPages}
		transcriber={metadata.transcriber}
		{language}
		{legend}
	/>
</div>

<style>
	.paper-page {
		position: relative;
		background: var(--paper-cream);
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		flex-shrink: 0;
	}

	.running-header {
		padding: 36px 96px 0;
	}

	.running-text {
		font-family: var(--font-sans);
		font-size: 14px;
		font-variant-caps: all-small-caps;
		letter-spacing: 1.5px;
		color: var(--ink-secondary);
	}

	.running-underline {
		height: 0;
		border-top: 0.5px solid var(--sage);
		margin-top: 6px;
	}

	/* Content: 92px left padding compensates for WordStack's 4px internal padding,
	   so text aligns flush with the 96px header rule */
	.page-content {
		padding: 12px 96px 0 92px;
	}

	.verse-line-wrapper {
		padding-bottom: 6px;
		margin-bottom: 6px;
		border-bottom: 0.5px solid rgba(139, 154, 125, 0.2);
	}

	.verse-line-wrapper:last-child {
		border-bottom: none;
	}
</style>
