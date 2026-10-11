<script lang="ts">
	/**
	 * ONE RUNNING HEAD FOR TEXT, MARKUP, AND INSIGHTS (QUEUE row 64; Dann
	 * 2026-10-11 03:23, `OPEN.md` "ONE FOOTER FOR ALL THREE TABS"): the piece on
	 * the left, `formatRunningHeader(composer, title, poet)`; the tab's name on
	 * the right; the rule in the tab's colour. A loose sheet from a printed stack
	 * says where it came from.
	 *
	 * `tabOnly` draws page 1's mark (Dann 2026-10-11 03:24, "Yes page 1 should
	 * name its tab"): the tab's name alone, right-aligned, in the same type and
	 * the tab's colour, with no rule. It sits in the top margin, above the title
	 * block, so nothing on page 1 moves (DESK DEFAULT, row 64 report).
	 */
	interface Props {
		headerText: string;
		/** The tab's name, `t('tab.text')`, `t('tab.markedScore')`, or `t('tab.insights')`. */
		tabName?: string;
		/** The tab's colour: sage (Text, the default), lavender (Markup), rose (Insights). */
		accent?: string;
		/** The tab's ink, for page 1's mark, which is coloured text rather than a rule. */
		accentInk?: string;
		/** Page 1: the tab's name alone, no piece and no rule. */
		tabOnly?: boolean;
		onheightchange?: (height: number) => void;
	}

	let {
		headerText,
		tabName = '',
		accent = 'var(--sage)',
		accentInk = 'var(--sage-ink)',
		tabOnly = false,
		onheightchange,
	}: Props = $props();

	/**
	 * Measured height of this header, ending AT the rule: .header-underline is
	 * the last child and nothing renders below it. So a page's contentTop minus
	 * (margin + this) is exactly the visible gap under the rule.
	 */
	let measuredHeight = $state(0);

	$effect(() => {
		if (measuredHeight > 0) {
			onheightchange?.(measuredHeight);
		}
	});
</script>

{#if tabOnly}
	<p class="tab-mark" style="--tab-ink: {accentInk};">{tabName}</p>
{:else}
	<header class="running-header" style="--header-accent: {accent};" bind:offsetHeight={measuredHeight}>
		<div class="header-line">
			<span class="header-text">{headerText}</span>
			{#if tabName}<span class="header-text header-tab">{tabName}</span>{/if}
		</div>
		<div class="header-underline"></div>
	</header>
{/if}

<style>
	.running-header {
		position: absolute;
		top: 48px;
		left: 96px;
		right: 96px;
	}

	/* The piece takes what the tab's name leaves. A piece too long for the line
	   ends in an ellipsis rather than wrapping (DESK DEFAULT, row 64): Markup
	   reserves a fixed head height (`HEADER_HEIGHTS.subsequent`), so a second
	   line would run into its score, and page 1 prints the piece in full. */
	.header-line {
		display: flex;
		align-items: baseline;
		gap: 24px;
	}

	.header-text {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-secondary);
		letter-spacing: 1.5px;
		line-height: 1.4;
		font-variant-caps: all-small-caps;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.header-tab {
		margin-left: auto;
		flex-shrink: 0;
	}

	.header-underline {
		border-bottom: 1px solid var(--header-accent);
		margin-top: 4px;
	}

	/* Page 1's mark: the running head's type, in the tab's ink, right-aligned
	   to the content edge. Its box ends 4 px above the 48 px margin, where the
	   title block and Insights' compass start, so neither moves. */
	.tab-mark {
		position: absolute;
		top: 24px;
		right: 96px;
		margin: 0;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		color: var(--tab-ink);
		letter-spacing: 1.5px;
		line-height: 1.4;
		font-variant-caps: all-small-caps;
	}

	/* N.73 portrait C retires the N.45 rule that stood here. It hid this
	   running head on the phone because the mobile document had no pages a
	   reader could see. It has pages again, each one whole, so the head that
	   names them is back with them. */
</style>
