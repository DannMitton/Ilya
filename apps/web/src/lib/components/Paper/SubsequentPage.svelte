<script lang="ts">
	import type { ResolvedGloss } from '$lib/text/gloss-edit';
	import type { WordStackData, PageSize, LineData } from '$lib/types';
	import type { NotationPreferences } from '@ilya/phonology';
	import { t, type Language } from '$lib/i18n';
	import { textTabKey } from '$lib/text/text-header';
	import type { InputView } from '$lib/text/input-views.svelte';
	import type { LegendItem } from '$lib/provenance';
	import { PAGE_SIZES, ROW_HEIGHT, TEXT_CONTENT } from '$lib/page-config';
	import RunningHeader from './RunningHeader.svelte';
	import VerseLine from './VerseLine.svelte';
	import PageFooter from './PageFooter.svelte';
	import { showsRichterIpa } from '$lib/latin';

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
		glossOverrides?: Map<string, ResolvedGloss>;
		/** Rows 109 and 110: the poem's words the song does not set, as `"lineIndex-wordIndex"`, drawn grey. */
		mutedWords?: ReadonlySet<string>;
		onwordclick?: (word: WordStackData) => void;
		/** Which text the page prints, `shown` in `+page.svelte`; the running head's tab name follows it (`text/text-header.ts`). */
		witness?: InputView;
		/** Whether the document prints any line at all; with none the tab name is the bare `tab.text`. */
		documentHasLines?: boolean;
		/** The content window's top and bottom and the gap between rows, from the measured fit. */
		contentTop: number;
		contentBottom: number;
		rowGap: number;
		/** The running header's measured height, which the window's top follows. */
		onheaderheight?: (height: number) => void;
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
		mutedWords,
		onwordclick,
		witness = 'lyrics',
		documentHasLines = true,
		contentTop,
		contentBottom,
		rowGap,
		onheaderheight,
	}: Props = $props();

	const dims = $derived(PAGE_SIZES[pageSize]);

	/** The running head's tab name: what the page prints (`text/text-header.ts`). */
	const tabName = $derived(t(textTabKey(witness, documentHasLines), language));

	/*
	 * Window and gap come from `Paper.svelte` (`page-fit.ts`, step 7, part 1), the same rule as page 1, so the pages cannot
	 * drift apart. What stood here (a fixed 28 px gap and the constant 80 for the footer) overran by 3 px under a one-row legend.
	 */
</script>

<div
	class="paper-page"
	style="width: {dims.width}px; height: {dims.height}px;"
>
	<!-- Header layer: absolute, pinned to top margin -->
	<RunningHeader headerText={runningHeader} {tabName} onheightchange={onheaderheight} />

	<!-- Content layer: flex column, rows grow if they wrap -->
	<div
		class="page-content"
		style="top: {contentTop}px; bottom: {contentBottom}px; left: {TEXT_CONTENT.left}px; right: {TEXT_CONTENT.right}px; padding-top: {TEXT_CONTENT.padTop}px; padding-left: {TEXT_CONTENT.padLeft}px; --row-height: {ROW_HEIGHT}px; --row-gap: {rowGap}px;"
	>
		{#each lines as line (line.lineNumber)}
			<div class="verse-row">
				<VerseLine words={line.words} {notationPrefs} {showStressDiacritics} {language} {spotReconstitution} {glossOverrides} {mutedWords} {onwordclick} />
			</div>
		{/each}
	</div>

	<!-- Footer layer: absolute, pinned to bottom margin -->
	<PageFooter
		{pageNumber}
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
