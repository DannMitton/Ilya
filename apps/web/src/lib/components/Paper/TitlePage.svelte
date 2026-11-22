<script lang="ts">
	import type { ResolvedGloss } from '$lib/text/gloss-edit';
	import type { WordStackData, SongMetadata, PageSize, LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import type { Language } from '$lib/i18n';
	import { t } from '$lib/i18n';
	import { textTabKey } from '$lib/text/text-header';
	import type { InputView } from '$lib/text/input-views.svelte';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, ROW_HEIGHT, TEXT_CONTENT } from '$lib/page-config';
	import { COMPOSERS, POETS, formatNameForPaper } from '$lib/composers-poets';
	import TitleHeader from './TitleHeader.svelte';
	import VerseLine from './VerseLine.svelte';
	import PageFooter from './PageFooter.svelte';
	import RunningHeader from './RunningHeader.svelte';
	import { showsRichterIpa } from '$lib/latin';
	import type { EmptyTextNotice } from '$lib/one-action';
	import BlankState from './BlankState.svelte';

	interface Props {
		lines: LineData[];
		notationPrefs: NotationPreferences;
		language: Language;
		metadata: SongMetadata;
		pageSize: PageSize;
		totalPages: number;
		legendItems: LegendItem[];
		showStressDiacritics?: boolean;
		spotReconstitution?: Map<string, boolean>;
		glossOverrides?: Map<string, ResolvedGloss>;
		/** Rows 109 and 110: the poem's words the song does not set, as `"lineIndex-wordIndex"`, drawn grey. */
		mutedWords?: ReadonlySet<string>;
		onwordclick?: (word: WordStackData) => void;
		/** N.201: the word the singer tapped, as `"lineIndex-wordIndex"`. The page marks it on screen only; the mark never prints. */
		selectedKey?: string | null;
		/** Which text the page prints, `shown` in `+page.svelte`; the running head's tab name follows it (`text/text-header.ts`). */
		witness?: InputView;
		/** Whether the document prints any line at all; with none the tab name is the bare `tab.text`. */
		documentHasLines?: boolean;
		/** The content window's top and bottom (px from the sheet's edges) and the gap between rows, from the measured fit. */
		contentTop: number;
		contentBottom: number;
		rowGap: number;
		/** The title header's measured height, which the window's top follows. */
		onheaderheight?: (height: number) => void;
		/** Row 2j: what to say with no lines (`emptyTextNotice`); `enter` when absent. */
		emptyNotice?: EmptyTextNotice;
		/** Lane 78: the blank state's link to INPUT (the section's own name in the sentence). */
		onopeninput?: () => void;
	}

	let {
		lines,
		notationPrefs,
		language,
		metadata,
		pageSize,
		totalPages,
		legendItems,
		showStressDiacritics = false,
		spotReconstitution,
		glossOverrides,
		mutedWords,
		onwordclick,
		selectedKey = null,
		witness = 'lyrics',
		documentHasLines = true,
		contentTop,
		contentBottom,
		rowGap,
		onheaderheight,
		emptyNotice = 'enter',
		onopeninput,
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

	/** The running head's tab name: what the page prints (`text/text-header.ts`). */
	const tabName = $derived(t(textTabKey(witness, documentHasLines), language));

	/*
	 * The window's top, bottom, and row gap come from `Paper.svelte`, which cuts the pages from measured heights
	 * (`page-fit.ts`; step 7, part 1). This page only reports its header's height. The sum that stood here (ten rows of a
	 * constant 56 into a window that ignored its own 4 px padding, the gap rounded up, and a footer reserve of a constant
	 * 80) overran page 1 by 7.4 px on the Tchaikovsky song once a poem was filled; the measured numbers are in `page-fit.ts`.
	 */
</script>

<div
	class="paper-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Header layer: absolute, pinned to top margin -->
	<!-- Page 1 names its tab (QUEUE row 64; Dann 2026-10-11 03:24). -->
	<RunningHeader headerText="" {tabName} tabOnly />
	<TitleHeader
		title={metadata.title}
		composer={composerDisplay}
		poet={poetDisplay}
		translator={translatorDisplay}
		opus={metadata.opus}
		{language}
		onheightchange={onheaderheight}
	/>

	<!-- Content layer: flex column, rows grow if they wrap -->
	<div
		class="page-content"
		style="top: {contentTop}px; bottom: {contentBottom}px; left: {TEXT_CONTENT.left}px; right: {TEXT_CONTENT.right}px; padding-top: {TEXT_CONTENT.padTop}px; padding-left: {TEXT_CONTENT.padLeft}px; --row-height: {ROW_HEIGHT}px; --row-gap: {rowGap}px;"
	>
		{#if hasContent}
			{#each lines as line (line.lineNumber)}
				<div class="verse-row">
					<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {glossOverrides} {mutedWords} {onwordclick} {selectedKey} />
				</div>
			{/each}
		{/if}
	</div>

	<!-- The blank state (lane 78): one squircle, centred in this window, drawn by the component all three documents share. `loading` says the dictionary's own word and no ask; `quiet` draws nothing (`one-action.ts`). -->
	{#if !hasContent && emptyNotice !== 'quiet'}
		<BlankState
			{language}
			accent="var(--sage)"
			ink="var(--sage-ink)"
			top={contentTop}
			bottom={contentBottom}
			left={TEXT_CONTENT.left + TEXT_CONTENT.padLeft}
			right={TEXT_CONTENT.right}
			paragraphs={[emptyNotice === 'loading' ? t('dict.loading', language) : t('paper.blank', language)]}
			links={emptyNotice === 'enter' ? { input: onopeninput } : {}}
		/>
	{/if}

	<!-- Footer layer: absolute, pinned to bottom margin -->
	<PageFooter
		pageNumber={1}
		{totalPages}
		{language}
		{legendItems}
		richterCredit={showsRichterIpa(lines)}
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
		overflow: visible;

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
	}
</style>
