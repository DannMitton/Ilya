<script lang="ts">
	import type { LineData, WordStackData, SongMetadata, PageSize } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';
	import { onMount, untrack } from 'svelte';
	import { PAGE_SIZES, FOOTER_MAX_HEIGHT, GAP, HEADER_GAP, HEADER_HEIGHTS_AT_LETTER, MARGINS, formatRunningHeader } from '$lib/page-config';
	import { FALLBACK_FIT, slicePages, type FitMetrics, type PieceMetrics } from '$lib/page-fit';
	import { buildProvenanceLegend } from '$lib/provenance';
	import { showsRichterIpa } from '$lib/latin';
	import PageFit from './PageFit.svelte';
	import PageFooter from './PageFooter.svelte';
	import TextFitProbe from './TextFitProbe.svelte';
	import TitlePage from './TitlePage.svelte';
	import SubsequentPage from './SubsequentPage.svelte';
	import type { EmptyTextNotice } from '$lib/one-action';
	import type { InputView } from '$lib/text/input-views.svelte';

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
		/** Rows 109 and 110: the poem's words the song does not set, as `"lineIndex-wordIndex"`, drawn grey. */
		mutedWords?: ReadonlySet<string>;
		onwordclick?: (word: WordStackData) => void;
		/** Row 2j: what page 1 says with no lines (`emptyTextNotice`). */
		emptyNotice?: EmptyTextNotice;
		/** Which text `lines` is: `shown` in `+page.svelte`, the value `textLines` branches on. The running head names it (`text/text-header.ts`). */
		witness?: InputView;
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
		mutedWords,
		onwordclick,
		emptyNotice = 'enter',
		witness = 'lyrics',
	}: Props = $props();

	/*
	 * THE PAGES ARE CUT FROM MEASURED HEIGHTS (step 7, part 1; `page-fit.ts` is the pure half and says why, with the
	 * four numbers the old constants got wrong). Four things are measured, and none of them depends on how the lines are
	 * sliced, so measuring them cannot move the slice that was measured from (the structural guard against a measure,
	 * slice, measure loop, Fable's review r2, amendment 1):
	 *   - the title header's height and the running header's height (their own components report them);
	 *   - the FOOTER RESERVE: one hidden `PageFooter`, rendered with the legend and the Richter credit of the WHOLE
	 *     document's lines, measured by its own `onheightchange`, reserved on every page. A page's footer is built from
	 *     that page's lines, so measuring the real footers would feed back: a legend that grows the footer shrinks the
	 *     window, which can move the line that put the legend there. `Math.max(FOOTER_MAX_HEIGHT, measured)` is the N.83
	 *     precedent (`MarkupPane.svelte`), so a short footer reserves what it always reserved;
	 *   - the lines' wrap counts and cut points, and the row's drawn height and overhang (`TextFitProbe`).
	 * What the lines' measurement depends on is only the lines and how they are drawn, and it is thrown away when they
	 * change. Until a line is measured it is sliced by an estimate, so a page is never blank; the slice then converges
	 * (`MAX_MEASURE_CYCLES` caps the loop, and the cap is reported, not silent).
	 */
	let titleHeader = $state(0);
	let subHeader = $state(0);
	let footerMeasured = $state(0);
	let measured = $state<Map<string, PieceMetrics>>(new Map());
	let constants = $state<{ rowBox?: number; overhang?: number }>({});
	let requests = $state.raw<LineData[]>([]);
	/** Measure cycles since the lines (or how they are drawn) last changed. */
	let cycles = 0;
	const MAX_MEASURE_CYCLES = 8;

	const dims = $derived(PAGE_SIZES[pageSize]);
	const fit = $derived<FitMetrics>({ ...FALLBACK_FIT, ...(constants.rowBox ? { rowBox: constants.rowBox } : {}), ...(constants.overhang !== undefined ? { overhang: constants.overhang } : {}) });
	const footerReserve = $derived(Math.max(FOOTER_MAX_HEIGHT, footerMeasured));
	const contentBottom = $derived(MARGINS.vertical + footerReserve + GAP);
	const contentTopOf = (index: number) => MARGINS.vertical + (index === 0 ? titleHeader || HEADER_HEIGHTS_AT_LETTER.title : subHeader || HEADER_HEIGHTS_AT_LETTER.subsequent) + HEADER_GAP;

	const sliced = $derived(
		slicePages({ lines, metricsOf: (key) => measured.get(key), windowOf: (i) => dims.height - contentTopOf(i) - contentBottom, fit }),
	);
	const pages = $derived(sliced.pages);
	const totalPages = $derived(pages.length);

	/** The footer reserve is measured over the whole document's legend and credit, so it holds for every page. */
	const wholeLegend = $derived(buildProvenanceLegend(lines, language, spotReconstitution));
	const wholeCredit = $derived(showsRichterIpa(lines));

	/** What the measurement depends on besides `lines`: anything that can change a word's width. */
	const drawn = $derived(JSON.stringify([language, showStressDiacritics, pageSize, notationPrefs, [...glossOverrides], [...spotReconstitution]]));
	$effect(() => {
		void lines;
		void drawn;
		untrack(() => {
			measured = new Map();
			requests = [];
			cycles = 0;
		});
	});
	onMount(() => {
		// A word's width, and so a wrap, depends on the fonts: measure again once they are in.
		void document.fonts?.ready.then(() => {
			measured = new Map();
			cycles = 0;
		});
	});

	/** Ask the probe for whatever the slice had to guess; stop at the cap and say so. */
	$effect(() => {
		const missing = sliced.unmeasured;
		untrack(() => {
			if (missing.length === 0) {
				requests = [];
			} else if (cycles >= MAX_MEASURE_CYCLES) {
				console.warn(`[Ilya] Text's page fit did not settle after ${MAX_MEASURE_CYCLES} measurements; ${missing.length} piece(s) are sliced by estimate.`);
			} else {
				cycles += 1;
				requests = missing;
			}
		});
	});

	function handleMeasured(result: { pieces: Map<string, PieceMetrics>; rowBox?: number; overhang?: number }) {
		measured = new Map([...measured, ...result.pieces]);
		constants = { ...constants, ...(result.rowBox ? { rowBox: result.rowBox } : {}), ...(result.overhang !== undefined ? { overhang: result.overhang } : {}) };
		requests = [];
	}

	/* The fit itself lives in PageFit.svelte (N.73 C2), which the marked
	   score's page now shares. The 0.74 share that stood here is gone with
	   it: Dann's C2 ruling spends the gutter in the desk's own padding, so
	   the page fills the desk that is left and the width follows one token
	   rather than a percentage. */
	const runningHeader = $derived(
		formatRunningHeader(metadata.composer, metadata.title, metadata.poet)
	);

</script>

<svelte:head>
	{@html `<style id="ilya-print-page">@page { size: ${pageSize === 'a4' ? '210mm 297mm' : '8.5in 11in'}; margin: 0; }</style>`}
</svelte:head>

<PageFit fit={isMobile} pageWidth={PAGE_SIZES[pageSize].width}>
	{#snippet content()}
<div class="paper-container" role="region" aria-label={t('a11y.paper', language)}>
	<div class="footer-probe" aria-hidden="true" inert style="width: {dims.width}px;">
		<PageFooter pageNumber={1} {totalPages} {language} legendItems={wholeLegend} richterCredit={wholeCredit} onheightchange={(h) => (footerMeasured = h)} />
	</div>
	{#if requests.length > 0}
		<TextFitProbe pieces={requests} pageWidth={dims.width} {notationPrefs} {language} {showStressDiacritics} {spotReconstitution} {glossOverrides} onmeasured={handleMeasured} />
	{/if}
	{#each pages as page, i}
		{@const pageLines = page.lines}
		<!-- N.65 item 8. The spot map goes into the builder alongside the lines,
		     so a page carrying an `R` carries its legend entry and a page
		     without one does not. Dann's ruling of 2026-08-21: "When a sigil
		     prints to the page it must be decoded with a legend." -->
		{@const legendItems = buildProvenanceLegend(pageLines, language, spotReconstitution)}
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
				{mutedWords}
				{onwordclick}
				{witness}
				documentHasLines={lines.length > 0}
				contentTop={contentTopOf(0)}
				{contentBottom}
				rowGap={page.gap}
				onheaderheight={(h) => (titleHeader = h)}
				{emptyNotice}
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
				{mutedWords}
				{onwordclick}
				{witness}
				documentHasLines={lines.length > 0}
				contentTop={contentTopOf(i)}
				{contentBottom}
				rowGap={page.gap}
				onheaderheight={(h) => (subHeader = h)}
			/>
		{/if}
	{/each}
</div>
	{/snippet}
</PageFit>

<style>
	.paper-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}

	/* The footer reserve's one measurement (see the script): out of flow, fixed, zero high, invisible, and not printed. */
	.footer-probe {
		position: fixed;
		top: 0;
		left: 0;
		height: 0;
		overflow: hidden;
		visibility: hidden;
		pointer-events: none;
	}

	@media print {
		.footer-probe {
			display: none;
		}
	}

	/* N.45's seam rule stood here and closed the gap between pages on the
	   phone, because the spike had reflowed them into one scrolling document
	   and a gap would have read as a tear. N.73 portrait C put the pages back:
	   they are discrete sheets again, each with its own shadow, so the seam
	   between them is the desktop's 2rem and it scales with everything else. */

	/* The print guard that undoes the fit travels with the fit, in
	   PageFit.svelte. This block is the page stack's own print layout. */
	@media print {
		.paper-container {
			display: block;
			gap: 0;
			padding: 0;
		}
	}
</style>
