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
		<div class="legend-row">
			{#each legend as item}
				<span class="legend-item">
					{#if item.type === 'user-dictionary'}
						<svg viewBox="0 0 16 16" class="legend-icon"><path d="M3 1.5A1.5 1.5 0 0 1 4.5 0h7A1.5 1.5 0 0 1 13 1.5v13a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-13zM4.5 1a.5.5 0 0 0-.5.5v12h8v-12a.5.5 0 0 0-.5-.5h-7z" fill="currentColor"/></svg>
					{:else if item.type === 'user-composer'}
						<svg viewBox="0 0 16 16" class="legend-icon"><path d="M9 0a1 1 0 0 1 1 1v5.268l4.562 2.084a1 1 0 0 1 .438.838v5.31a1.5 1.5 0 1 1-3 0V9.81L9 8.268V14.5a1.5 1.5 0 1 1-3 0V1a1 1 0 0 1 1-1h2z" fill="currentColor"/></svg>
					{:else if item.type === 'user-override'}
						<svg viewBox="0 0 16 16" class="legend-icon"><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z" fill="currentColor"/></svg>
					{:else if item.type === 'yo'}
						<span class="legend-yo">ё</span>
					{:else if item.type === 'inferred'}
						<span class="legend-question">?</span>
					{:else if item.type === 'spot-reconstitution'}
						<span class="legend-recon">R</span>
					{/if}
					<span class="legend-label">{item.label}</span>
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

	/* ── Provenance legend ─────────────────────────────────── */

	.legend-row {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		margin-bottom: 6px;
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: #78716c;
	}

	.legend-icon {
		width: 9px;
		height: 9px;
		flex-shrink: 0;
	}

	.legend-yo {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 9px;
		line-height: 1;
	}

	.legend-question {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 9px;
		line-height: 1;
	}

	.legend-recon {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 9px;
		line-height: 1;
	}

	.legend-label {
		font-family: var(--font-sans);
		font-size: 8.5px;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.04em;
	}

	/* ── Footer content ────────────────────────────────────── */

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
</style>
