<script lang="ts">
	import type { WordStackData, PageSize, LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, FOOTER_MAX_HEIGHT, GAP, HEADER_GAP, HEADER_HEIGHTS_AT_LETTER, MARGINS, ROW_HEIGHT } from '$lib/page-config';
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

	/** Measured running-header height (px). Updated via RunningHeader's callback. */
	let headerHeight = $state(0);

	function handleHeaderHeight(height: number) {
		headerHeight = height;
	}

	/**
	 * Same formula and the same HEADER_GAP as TitlePage, so the space under the
	 * rule is identical on every page. The breakpoint override went with the
	 * N.45 spike under N.73 portrait C, for the reason TitlePage's matching
	 * comment gives: this page is 816px wide on every display now, so the
	 * running header no longer wraps and the measurement needs no correcting.
	 */
	const effectiveHeaderHeight = $derived(
		headerHeight || HEADER_HEIGHTS_AT_LETTER.subsequent
	);

	const contentTop = $derived(MARGINS.vertical + effectiveHeaderHeight + HEADER_GAP);
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
	<RunningHeader headerText={runningHeader} onheightchange={handleHeaderHeight} />

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
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
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

	/* N.73 portrait C retires the N.45 spike that stood here, for the reason
	   set out on TitlePage's matching block. This sheet keeps 816 by 1056 on
	   every display. */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
