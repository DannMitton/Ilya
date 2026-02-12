<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import { PAGE_DIMENSIONS } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';
	import { buildProvenanceLegend } from '$lib/paper-manager';
	import VerseLine from './VerseLine.svelte';
	import PageFooter from './PageFooter.svelte';

	interface Props {
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

	let { lines, notationPrefs, language, metadata, pageSize, totalPages, showStressDiacritics = false, spotReconstitution, onwordclick }: Props = $props();

	const dims = $derived(PAGE_DIMENSIONS[pageSize]);
	const hasMetadata = $derived(
		metadata.title || metadata.composer || metadata.poet || metadata.opus
	);
	const hasContent = $derived(lines.length > 0);
	const legend = $derived(buildProvenanceLegend(lines, language, spotReconstitution));
</script>

<div
	class="paper-page title-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Header area -->
	<div class="title-header">
		<div class="ilya-logo" aria-label="Ilya">
			<span class="bracket">[</span><span class="logo-text">Ilya</span><span class="bracket">]</span>
		</div>
		{#if hasMetadata}
			<div class="song-metadata">
				{#if metadata.title}
					<h1 class="song-title">{metadata.title}</h1>
				{/if}
				<div class="meta-fields">
					{#if metadata.composer}
						<span class="meta-field">{metadata.composer}</span>
					{/if}
					{#if metadata.opus}
						<span class="meta-field">{metadata.opus}</span>
					{/if}
					{#if metadata.poet}
						<span class="meta-field">{t('meta.textBy', language)} {metadata.poet}</span>
					{/if}
				</div>
			</div>
		{/if}
		<div class="header-rule"></div>
	</div>

	<!-- Content area -->
	<div class="page-content">
		{#if hasContent}
			{#each lines as line (line.lineNumber)}
				<div class="verse-line-wrapper">
					<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {onwordclick} />
				</div>
			{/each}
		{:else}
			<p class="empty-hint">{t('paper.empty', language)}</p>
		{/if}
	</div>

	<PageFooter
		pageNumber={1}
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

	.title-header {
		padding: 48px 96px 0;
	}

	.ilya-logo {
		font-size: 22px;
		color: var(--sage);
		margin-bottom: 20px;
	}

	.bracket {
		font-family: var(--font-mono);
		font-weight: 400;
	}

	.logo-text {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
	}

	.song-metadata {
		margin-bottom: 12px;
	}

	.song-title {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 400;
		color: var(--ink-primary);
		margin-bottom: 6px;
		line-height: 1.2;
	}

	.meta-fields {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
	}

	.meta-field {
		font-family: var(--font-sans);
		font-size: 14px;
		font-variant-caps: all-small-caps;
		letter-spacing: 1.5px;
		color: var(--ink-secondary);
	}

	.header-rule {
		height: 0;
		border-top: 0.5px solid var(--sage);
		margin-top: 12px;
	}

	/* Content: 92px left padding compensates for WordStack's 4px internal padding,
	   so text aligns flush with the 96px header rule */
	.page-content {
		padding: 16px 96px 0 92px;
	}

	.verse-line-wrapper {
		padding-bottom: 8px;
		margin-bottom: 8px;
		border-bottom: 0.5px solid rgba(139, 154, 125, 0.2);
	}

	.verse-line-wrapper:last-child {
		border-bottom: none;
	}

	/* Empty state hint: centred in the content area, single line */
	.empty-hint {
		color: var(--ink-tertiary);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 0.95rem;
		text-align: center;
		white-space: nowrap;
		padding-top: 6rem;
	}
</style>
