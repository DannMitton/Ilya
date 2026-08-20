<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { PAGE_SIZES, sliceLinesToPages, formatRunningHeader } from '$lib/page-config';
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
	const totalPages = $derived(pages.length);

	/* ── The fitted page (N.73 portrait C, ruled by Dann 2026-08-18) ──
	   Portrait's arrival view is the real page scaled down, not a second
	   drawing of the same content. The pages below are the same 816 by 1056
	   sheets the desktop lays out and the printer prints; the only thing this
	   block adds is a scale factor and the layout height that factor reserves.

	   Nothing here changes what is ON the page, which is the point: if this
	   drew a lookalike, WYSIWYG would be gone. */

	/** The share of the desk's width the fitted page takes.

	    The mockup insets the page to roughly 70 percent of the screen
	    (`docs/sessions/fable-gui-mockup_r2_2026-08-18.html`, exhibit 1). The
	    desk's content box is the screen less its 0.5rem padding either side,
	    so on a 390px phone this lands the page on 277px, which is 71 percent
	    of the screen and leaves 49px of desk on each side. */
	const PORTRAIT_PAGE_SHARE = 0.74;

	/** The desk's content width, measured. 0 until the first layout pass. */
	let fitWidth = $state(0);
	/** The stack's own height at full size, measured. Transform-immune. */
	let naturalHeight = $state(0);

	const fitScale = $derived(
		isMobile && fitWidth > 0
			? (fitWidth * PORTRAIT_PAGE_SHARE) / PAGE_SIZES[pageSize].width
			: 1
	);
	const fitting = $derived(isMobile && fitWidth > 0);
	/* transform-origin is top left, so the horizontal inset is spent here
	   rather than by auto margins, which cannot centre a box wider than its
	   container. translateX runs in the parent's coordinates because the
	   matrix applies it after the scale. */
	const fitOffset = $derived((fitWidth - PAGE_SIZES[pageSize].width * fitScale) / 2);
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

<div
	class="paper-fit"
	class:fitting
	bind:clientWidth={fitWidth}
	style={fitting ? `height: ${naturalHeight * fitScale}px;` : ''}
>
<div
	class="paper-scale"
	class:fitting
	bind:clientHeight={naturalHeight}
	style={fitting
		? `width: ${PAGE_SIZES[pageSize].width}px; transform: translateX(${fitOffset}px) scale(${fitScale});`
		: ''}
>
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
</div>
</div>

<style>
	/* ── The fitted page's frame ───────────────────────────── */

	/* Off the phone these two are inert: no class, no inline style, no
	   transform, and the stack lays out exactly as it did before N.73. */
	.paper-fit {
		width: 100%;
	}

	.paper-fit.fitting {
		position: relative;
	}

	/* Taken out of flow so its 816px layout width cannot widen the desk or
	   set the desk's scroll width. The visual box is the transformed one,
	   which fits, and .paper-fit's inline height reserves exactly that. */
	.paper-scale.fitting {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: top left;
	}

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

	/* PRINT EMITS THE PAGE, WHOLE. `isMobile` is a width test, so a phone
	   printing in portrait still carries `fitting`, and without this the
	   printer would be handed a page scaled to a third of its size inside a
	   reserved box a third as tall. Every part of the fit is undone here: the
	   reserved height, the absolute placement, the 816px inline width, and the
	   transform. What prints is what prints from the desktop. */
	@media print {
		.paper-fit,
		.paper-fit.fitting {
			position: static !important;
			width: auto !important;
			height: auto !important;
		}

		.paper-scale,
		.paper-scale.fitting {
			position: static !important;
			width: auto !important;
			transform: none !important;
		}

		.paper-container {
			display: block;
			gap: 0;
			padding: 0;
		}
	}
</style>
