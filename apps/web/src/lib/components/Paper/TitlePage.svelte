<script lang="ts">
	import type { WordStackData, SongMetadata, PageSize, LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { t } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, FOOTER_MAX_HEIGHT, GAP, MARGINS, ROW_HEIGHT } from '$lib/page-config';
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
		isMobile?: boolean;
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, string>;
		onwordclick?: (word: WordStackData) => void;
		onbudgetchange?: (maxRows: number) => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		metadata,
		pageSize,
		totalPages,
		legendItems,
		isMobile = false,
		showStressDiacritics = false,
		spotReconstitution,
		glossOverrides,
		onwordclick,
		onbudgetchange,
	}: Props = $props();

	const dims = $derived(PAGE_SIZES[pageSize]);
	const hasContent = $derived(lines.length > 0);

	/** Transform names for paper display: "Given Surname (dates)" */
	const composerDisplay = $derived(formatNameForPaper(metadata.composer, COMPOSERS));
	const poetDisplay = $derived(formatNameForPaper(metadata.poet, POETS));
	const translatorDisplay = $derived(formatNameForPaper(metadata.translator, POETS));

	/** Measured header height (px). Updated via TitleHeader's onheightchange callback. */
	let headerHeight = $state(0);

	/**
	 * Header-to-content gap for the title page (18px).
	 *
	 * Matches the perceived rule-to-content spacing on subsequent pages
	 * (page 2 is the standard, this value was tuned to achieve visual
	 * parity). One document, one rhythm: the gap below the horizontal
	 * rule must feel identical on every page.
	 *
	 * 10 rows preserved with standard 127px header:
	 *   available = 1056 - (48 + 127 + 18) - (48 + 80 + 8) = 727px
	 *   10 × 56 + 9 × 18 = 722px. 5px clearance.
	 */
	const TITLE_HEADER_GAP = 18;

	/** Content window positioning (px). Bottom is fixed; top adapts to measured header. */
	const contentTop = $derived(MARGINS.vertical + headerHeight + TITLE_HEADER_GAP);
	const contentBottom = MARGINS.vertical + FOOTER_MAX_HEIGHT + GAP;

	/**
	 * Adaptive row configuration: compute rows and gap from measured header.
	 *
	 * Algorithm: try 10 rows first. Calculate the gap that would distribute
	 * them evenly in the available height. If that gap falls below the
	 * minimum (18px), cascade to 9 rows, then 8.
	 *
	 * minGap derivation (not a magic number):
	 *   With measured 127px header and 18px TITLE_HEADER_GAP:
	 *   available = 1056 - 193 - 136 = 727px
	 *   10 rows at 56px = 560px; (727 - 560) / 9 = 18.56px → floor to 18
	 */
	const rowConfig = $derived.by(() => {
		if (headerHeight === 0) return { rows: 9, gap: 20 };

		const availableHeight = PAGE_SIZES[pageSize].height - contentTop - contentBottom;
		const minGap = 18;
		const maxGap = 28;

		let rows = 10;
		let gap = (availableHeight - (rows * ROW_HEIGHT)) / (rows - 1);

		if (gap < minGap) {
			rows = 9;
			gap = (availableHeight - (rows * ROW_HEIGHT)) / (rows - 1);
		}
		if (gap < minGap) {
			rows = 8;
			gap = (availableHeight - (rows * ROW_HEIGHT)) / (rows - 1);
		}

		gap = Math.min(gap, maxGap);

		return { rows, gap: Math.round(gap) };
	});

	/** Signal parent when row budget changes so Paper can re-slice. */
	$effect(() => {
		onbudgetchange?.(rowConfig.rows);
	});

	function handleHeaderHeight(height: number) {
		headerHeight = height;
	}
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
		translator={translatorDisplay}
		opus={metadata.opus}
		{language}
		onheightchange={handleHeaderHeight}
	/>

	<!-- Content layer: flex column, rows grow if they wrap -->
	<div
		class="page-content"
		style="top: {contentTop}px; bottom: {contentBottom}px; --row-height: {ROW_HEIGHT}px; --row-gap: {rowConfig.gap}px;"
	>
		{#if hasContent}
			{#each lines as line (line.lineNumber)}
				<div class="verse-row">
					<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {glossOverrides} {onwordclick} />
				</div>
			{/each}
		{:else}
			<div class="empty-directive">
				<p>{isMobile ? t('paper.empty.mobile', language) : t('paper.empty', language)}</p>
			</div>
		{/if}
	</div>

	<!-- Footer layer: absolute, pinned to bottom margin -->
	<PageFooter
		pageNumber={1}
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

		display: flex;
		flex-direction: column;
		gap: var(--row-gap);
	}

	.verse-row {
		box-sizing: border-box;
		min-height: var(--row-height);
		overflow: visible;
	}

	/* ── Empty state ───────────────────────────────────────── */

	.empty-directive {
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
		flex: 1;
	}

	/* ── Print rules ───────────────────────────────────────── */

	/* SPIKE for N.45. THIS IS NOT A FEATURE.
	   Dann's ruling, 11 August 2026: desktop keeps WYSIWYG, mobile adopts a
	   content-viewing paradigm, and the printed artefact is unchanged because
	   the @media print block below overrides this one.

	   It answers exactly one question: does legible reflowed transcription
	   feel right in the hand. It does NOT implement the header and footer
	   treatment Dann ruled, because the provenance legend's home on mobile is
	   unruled, and fit-legend.ts calls that legend load-bearing for the
	   ratified never-guesses clause. Half a ruling is how things get lost.

	   Content is still pre-paginated by sliceLinesToPages, so the old letter
	   page boundaries remain visible. N.45 proper would bypass pagination on
	   this breakpoint. Reverting this spike is one commit. */
	@media (max-width: 767px) {
		.paper-page {
			width: 100% !important;
			height: auto !important;
			box-shadow: none;
		}

		.page-content {
			position: static;
			left: auto;
			right: auto;
			padding: 0.75rem;
		}

		.verse-row {
			min-height: 0;
		}
	}

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
