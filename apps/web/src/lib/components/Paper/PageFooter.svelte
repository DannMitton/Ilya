<script lang="ts">
	import type { LegendItem } from '$lib/provenance';
	import type { PreparedSmuflFont } from '@ilya/score-parser';
	import LegendItems from './LegendItems.svelte';
	import { t, type Language } from '$lib/i18n';
	import Italics from '$lib/components/Italics.svelte';

	interface Props {
		pageNumber: number;
		totalPages: number;
		language: Language;
		legendItems?: LegendItem[];
		/** The broad-analysis legend sentence (§B.5); absent on non-Markup pages. */
		broadNote?: string;
		/** Footer hairline accent: sage (Transcription) default, lavender for Markup. */
		hairlineAccent?: string;
		/**
		 * Reports this footer's measured height, so the page that owns it can
		 * reserve exactly that much and no content window ever reaches into it.
		 *
		 * The same seam `TitleHeader` already offers, for the same reason. A
		 * footer's height is not a constant: the provenance legend wraps with
		 * its entry count and its language, and the broad-analysis sentence is
		 * present on a Markup page and absent everywhere else. Only a page that
		 * measures its own footer can reserve one.
		 */
		onheightchange?: (height: number) => void;
		/** A line on this page shows Richter's IPA for a Latin word (`latin.ts`), so the page credits him. */
		richterCredit?: boolean;
		/** The page's notation font, so a stems key draws with the same heads the stave does (N.176). */
		notationFont?: { prepared: PreparedSmuflFont; family: string } | null;
	}

	let { pageNumber, totalPages, language, legendItems = [], broadNote, hairlineAccent = 'var(--sage)', richterCredit = false, notationFont = null, onheightchange }: Props = $props();

	const attribution = $derived(t('footer.attribution', language));
	const richterLine = $derived(richterCredit ? t('footer.richter', language) : '');

	/** Measured height of this footer: legend, broad note, hairline and colophon. */
	let measuredHeight = $state(0);

	$effect(() => {
		if (measuredHeight > 0) {
			onheightchange?.(measuredHeight);
		}
	});
</script>

<footer
	class="page-footer"
	class:is-last-page={pageNumber === totalPages}
	style="--footer-accent: {hairlineAccent};"
	bind:offsetHeight={measuredHeight}
>
	{#if legendItems.length > 0}
		<div class="provenance-legend">
			<LegendItems items={legendItems} {notationFont} />
		</div>
	{/if}

	{#if broadNote}
		<p class="broad-legend" role="note"><Italics text={broadNote} /></p>
	{/if}

	<div class="footer-hairline"></div>

	<div class="footer-content">
		<div class="attribution-cell">
			<span class="attribution-text">
				{#if richterLine}{@html richterLine}{' '}{/if}{@html attribution}&nbsp;&nbsp;&nbsp;<a href="https://dannmitton.com" target="_blank" rel="noopener">dannmitton.com</a>
			</span>
		</div>
		<div class="pagination-cell">
			<span class="page-number">{t('footer.page', language)} {pageNumber} {t('footer.of', language)} {totalPages}</span>
		</div>
	</div>
</footer>

<style>
	.page-footer {
		position: absolute;
		bottom: 48px;
		left: 96px;
		right: 96px;
	}

	/* ── Provenance legend (the footer's first row) ─────────── */

	/* IN FLOW, and that is the whole of the N.83 repair. It was
	   `position: absolute; bottom: 100%`, which drew it in the band the page
	   had reserved for the content window: out of the footer's own height, so
	   nothing budgeted for it, and over the last system's lyrics whenever they
	   reached that far down. Measured on the engraved Sunless no. 1 at page 1,
	   816 by 1056: the legend occupied y 867.4 to 899.9 while the score window
	   ran to y 920, and the Cyrillic row ended at y 876.

	   In flow it lands on the same pixels it always did, because the footer is
	   anchored by its bottom edge and grows upward. What changes is that its
	   height is now the footer's height, `onheightchange` reports it, and the
	   page reserves it. */
	.provenance-legend {
		margin-bottom: 8px;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 4px 12px;
	}

	/* ── Sage hairline ─────────────────────────────────────── */

	.footer-hairline {
		border-top: 0.5px solid var(--footer-accent);
		margin-bottom: 8px;
	}

	/* ── Two-column footer: invisible table layout ────────── */

	.footer-content {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: stretch;
		gap: 0 32px;
	}

	/* Column 1: Attribution + URL, fully justified */
	.attribution-cell {
		text-align: justify;
	}

	.attribution-text {
		display: block;
		font-family: var(--font-sans);
		font-size: 9.5pt;
		color: var(--ink-secondary);
		font-variant-caps: all-small-caps;
		letter-spacing: 1px;
		font-weight: 400;
	}

	/* Italic styling for book title */
	.attribution-text :global(em) {
		font-style: italic;
	}

	/* Link styling */
	.attribution-text :global(a) {
		color: var(--ink-secondary);
		text-decoration: none !important;
	}

	.attribution-text :global(a:hover) {
		color: var(--ink-primary);
		text-decoration: none !important;
	}

	/* Column 2: Pagination - flush right, bottom-aligned */
	.pagination-cell {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		white-space: nowrap;
	}

	.page-number {
		font-family: var(--font-sans);
		font-size: 9.5pt;
		font-variant-caps: all-small-caps;
		letter-spacing: 1px;
		color: var(--ink-secondary);
		font-weight: 400;
	}
	/* The broad-analysis legend (§B.5): shares the sigla legend's type
	   language (sans, ~9.5px, stone) but upright roman sentence case for
	   readability (Gould rule 12), left-aligned to the content margin. */
	.broad-legend {
		margin: 0 0 8px 0;
		font-family: var(--font-sans);
		font-size: 9.5px;
		line-height: 1.4;
		color: #78716c;
	}

	/* N.73 portrait C, ruled by Dann 2026-08-18, retires the N.45 footer
	   concession that stood here. Two comment blocks and one media query are
	   gone: below the breakpoint the footer went static and flowed after the
	   content, the pagination cell was hidden because pages were not visible,
	   and the attribution consolidated onto the last page alone.

	   Portrait C makes all three wrong. The page is a real page again, whole
	   and shadowed, and Dann's own test is that what is on the small page is
	   what prints. A footer that flows, a page number that is missing, or a
	   colophon that appears once in a two-page document is a page that does
	   not print as drawn.

	   The N.45 residual it recorded goes with it: the attribution repeating
	   at every page boundary is not a residual any more, it is what a printed
	   document does. */
</style>
