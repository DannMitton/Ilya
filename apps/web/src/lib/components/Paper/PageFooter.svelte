<script lang="ts">
	import type { LegendItem } from '$lib/types';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		pageNumber: number;
		totalPages: number;
		transcriber?: string;
		language: Language;
		legend?: LegendItem[];
	}

	let { pageNumber, totalPages, transcriber = '', language, legend = [] }: Props = $props();

	const attribution1 = $derived(
		t('footer.attribution1', language).replace('{name}', transcriber || '___')
	);
	const attribution2 = $derived(t('footer.attribution2', language));
</script>

<footer class="page-footer">
	<div class="footer-rule"></div>

	{#if legend.length > 0}
		<div class="provenance-legend" role="list" aria-label="Provenance legend">
			{#each legend as item (item.source)}
				<span class="legend-entry" role="listitem">
					<span class="legend-icon" aria-hidden="true">
						{#if item.source === 'user-dictionary'}
							<svg viewBox="0 0 16 16" class="legend-svg"><path d="M2 1.5C2 .67 2.67 0 3.5 0h9c.83 0 1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5H4a2 2 0 0 1-2-2V1.5zM3.5 1a.5.5 0 0 0-.5.5V11h9V1.5a.5.5 0 0 0-.5-.5h-9zM3 12v1a1 1 0 0 0 1 1h8.5a.5.5 0 0 0 .5-.5V12H3z" fill="currentColor"/></svg>
						{:else if item.source === 'user-composer'}
							<svg viewBox="0 0 16 16" class="legend-svg"><path d="M9 0a1 1 0 0 1 1 1v5.268l4.562 2.084a1 1 0 0 1 .438.838v5.31a1.5 1.5 0 1 1-3 0V9.81L9 8.268V14.5a1.5 1.5 0 1 1-3 0V1a1 1 0 0 1 1-1h2z" fill="currentColor"/></svg>
						{:else if item.source === 'user-override'}
							<svg viewBox="0 0 16 16" class="legend-svg"><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z" fill="currentColor"/></svg>
						{:else if item.source === 'yo'}
							<span class="legend-yo">ё</span>
						{:else if item.source === 'inferred'}
							<svg viewBox="0 0 16 16" class="legend-svg"><rect x="0.5" y="0.5" width="15" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2.5 1.5"/><text x="8" y="12" text-anchor="middle" fill="currentColor" font-family="var(--font-sans)" font-size="11" font-weight="600">?</text></svg>
						{/if}
					</span>
					<span class="legend-label">{t(item.labelKey, language)}</span>
				</span>
			{/each}
		</div>
	{/if}

	<div class="footer-content">
		<div class="footer-attribution">
			<p class="attribution-text">{@html attribution1}</p>
			<p class="attribution-text">
				{@html attribution2}
				<svg class="canada-flag" viewBox="0 0 9600 4800" aria-label="Canada" role="img">
					<path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"/>
					<path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/>
				</svg>
			</p>
		</div>
		<div class="footer-pagination">
			<span class="page-number">{t('footer.page', language)} {pageNumber} {t('footer.of', language)} {totalPages}</span>
		</div>
	</div>
</footer>

<style>
	.page-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 96px 28px;
	}

	.footer-rule {
		height: 0;
		border-top: 0.5px solid var(--sage);
		margin-bottom: 8px;
	}

	/* ── Provenance legend ───────────────────────────────── */

	.provenance-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		margin-bottom: 6px;
	}

	.legend-entry {
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}

	.legend-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 10px;
		height: 10px;
		color: #78716c;
		opacity: 0.7;
		flex-shrink: 0;
	}

	.legend-svg {
		width: 100%;
		height: 100%;
	}

	.legend-yo {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 9px;
		line-height: 1;
		color: #78716c;
	}

	.legend-label {
		font-family: var(--font-sans);
		font-size: 9.5px;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.04em;
		color: #78716c;
	}

	/* ── Attribution and pagination ──────────────────────── */

	.footer-content {
		display: flex;
		align-items: flex-end;
	}

	.footer-attribution {
		flex: 2;
		padding-right: 16px;
	}

	.attribution-text {
		font-family: var(--font-sans);
		font-size: 9.5px;
		line-height: 1.45;
		color: var(--ink-secondary);
		text-align: justify;
		margin-bottom: 2px;
	}

	.attribution-text:last-child {
		margin-bottom: 0;
	}

	/* Italic styling for <em> tags rendered via {@html} */
	.attribution-text :global(em) {
		font-style: italic;
	}

	.canada-flag {
		display: inline-block;
		width: 14px;
		height: 7px;
		vertical-align: baseline;
		margin-left: 2px;
		position: relative;
		top: 0.5px;
	}

	.footer-pagination {
		flex-shrink: 0;
		text-align: right;
		align-self: flex-end;
	}

	.page-number {
		font-family: var(--font-sans);
		font-size: 14px;
		font-variant-caps: all-small-caps;
		letter-spacing: 1px;
		color: var(--ink-secondary);
	}

	@media print {
		.provenance-legend {
			/* Legend prints as-is; icons are pure SVG/text, no opacity change needed */
		}
	}
</style>
