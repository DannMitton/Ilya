<script lang="ts">
	import type { WordStackData, SongMetadata, PageSize, LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { t } from '$lib/i18n';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, FOOTER_MAX_HEIGHT, GAP, HEADER_GAP, HEADER_HEIGHTS_AT_LETTER, MARGINS, ROW_HEIGHT } from '$lib/page-config';
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

	/**
	 * Transform names for paper display: "Given Surname (dates)", in the
	 * interface language's own spelling (N.78). Storage still holds the
	 * English form; only what the page draws changes, so switching the
	 * language pill redraws the same song without writing anything.
	 */
	const composerDisplay = $derived(formatNameForPaper(metadata.composer, COMPOSERS, language));
	const poetDisplay = $derived(formatNameForPaper(metadata.poet, POETS, language));
	const translatorDisplay = $derived(formatNameForPaper(metadata.translator, POETS, language));

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
	/**
	 * The height to lay out against.
	 *
	 * The live measurement is right and handles a title of any length. It used
	 * to be overridden by the letter-width constant below the breakpoint,
	 * because the N.45 spike made the page 100 percent wide there, the title
	 * wrapped, and the measurement came out about 40px too tall for the 816px
	 * sheet that prints. N.73 portrait C retired that spike: the page is 816px
	 * wide on every display, so the measurement IS the letter-width
	 * measurement and the override has nothing left to correct.
	 *
	 * `bind:offsetHeight` (TitleHeader.svelte) is a layout measurement and a
	 * CSS transform does not touch it, so the scaling Paper.svelte applies in
	 * portrait cannot move this number either.
	 */
	const effectiveHeaderHeight = $derived(headerHeight || HEADER_HEIGHTS_AT_LETTER.title);

	/** Content window positioning (px). Bottom is fixed; top follows the header. */
	const contentTop = $derived(MARGINS.vertical + effectiveHeaderHeight + HEADER_GAP);
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
		if (effectiveHeaderHeight === 0) return { rows: 9, gap: 20 };

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

	/* N.73 portrait C, ruled by Dann 2026-08-18, retires the N.45 spike that
	   stood here. The spike reflowed this sheet on the phone: 100 percent
	   wide, height auto, the content window taken out of its absolute frame.
	   That produced a short card at no particular proportion, which is the
	   thing portrait C exists to cure. The sheet now keeps its true 816 by
	   1056 geometry on every display and Paper.svelte scales it to fit, so
	   what the singer reads on the phone is the artefact that prints.

	   Nothing replaces the spike here. The whole breakpoint block is gone,
	   which is why the shadow, the header block, and the colophon survive
	   into portrait without a rule of their own. */

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
