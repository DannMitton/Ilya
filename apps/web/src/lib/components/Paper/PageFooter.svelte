<script lang="ts">
	import type { LegendItem } from '$lib/provenance';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		pageNumber: number;
		totalPages: number;
		language: Language;
		legendItems?: LegendItem[];
		/** The broad-analysis legend sentence (§B.5); absent on non-Fit pages. */
		broadNote?: string;
		/** Footer hairline accent: sage (Transcription) default, deeper-lavender for Fit. */
		hairlineAccent?: string;
	}

	let { pageNumber, totalPages, language, legendItems = [], broadNote, hairlineAccent = 'var(--sage)' }: Props = $props();

	const attribution = $derived(t('footer.attribution', language));
</script>

<footer class="page-footer" style="--footer-accent: {hairlineAccent};">
	{#if legendItems.length > 0}
		<div class="provenance-legend">
			{#each legendItems as item}
				<span class="legend-item">
					<span class="legend-circle" aria-hidden="true">
						{#if item.type === 'user-dictionary'}
							<!-- Dictionary (open book with spine) -->
							<svg viewBox="0 0 16 16" class="legend-icon" fill="none"><path d="M8 2C6.5 1 4 .5 1 1v11c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2V1c-3-.5-5.5 0-7 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" stroke-width="1"/></svg>
						{:else if item.type === 'user-composer'}
							<!-- Composer (beamed eighth notes) -->
							<svg viewBox="0 0 16 16" class="legend-icon" fill="currentColor"><ellipse cx="4" cy="13" rx="2.5" ry="1.8" transform="rotate(-20 4 13)"/><ellipse cx="11.5" cy="12" rx="2.5" ry="1.8" transform="rotate(-20 11.5 12)"/><rect x="5.5" y="1.5" width="1.3" height="11.5"/><rect x="12.5" y="1.5" width="1.3" height="10.5"/><rect x="5.5" y="1.5" width="8.3" height="2" rx="0.3"/></svg>
						{:else if item.type === 'user-override'}
							<!-- User (head + shoulders) -->
							<svg viewBox="0 0 16 16" class="legend-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 14s-1 0-1-1 1-5 6-5 6 4 6 5-1 1-1 1H3z"/></svg>
						{:else if item.type === 'yo-restored'}
							<!-- ё (two dots + curved e) -->
							<svg viewBox="0 0 16 16" class="legend-icon" fill="currentColor" stroke="currentColor"><circle cx="5.5" cy="2.5" r="1.3" stroke="none"/><circle cx="10.5" cy="2.5" r="1.3" stroke="none"/><path d="M4 10h8c0-3-2-4.5-4-4.5S4 7 4 10c0 2.5 1.5 4.5 4 4.5 1.5 0 3-.5 4-2" fill="none" stroke-width="1.5" stroke-linecap="round"/></svg>
						{:else if item.type === 'inferred'}
							<!-- Verify (traced question mark) -->
							<svg viewBox="208 315 493 751" class="legend-icon" fill="currentColor"><path d="M426.5 348.1c-53.8 4.4-96.8 20.7-133.1 50.3-29.3 23.9-51.8 62.6-59.9 103.1-2.1 10.7-4.5 30.4-4.5 37.7v2.8h125.9l.5-3.3c.3-1.7 1-6.6 1.6-10.7 2.7-18.4 10.2-33.1 23.5-46.6 16.8-16.8 34.3-24.3 61.2-26 38.3-2.5 72.4 14.5 86.7 43.1 5.9 11.7 7.1 17.9 7 35.5 0 16.9-1.7 25.8-6.8 37.4-7.6 17.3-25.5 34.2-57.4 54.6-41.3 26.4-54.8 36.7-66.3 50.6-25.5 30.8-32.8 56.2-31.3 108.6l.7 22.8h123.4l.6-18.8c.6-21.6 2.2-29.7 8.7-42.8 4.6-9.4 14.3-21.1 25.1-30.2 7.7-6.6 31.6-22.8 51-34.6 50.9-31.1 79.7-68 89.8-115.1 8.2-38 3.5-81.4-12.4-114-23.1-47.4-71.3-82.9-132.5-97.4-29.8-7.1-68.2-9.7-101.5-7m2 538c-18.7 1.7-38 12-50 26.7-11.4 13.7-15.9 26.8-15.9 45.7 0 8.3.6 14 1.8 18.5 6.2 22.6 23.2 41.1 45.5 49.4 9.8 3.6 15.9 4.6 29 4.6 13.8 0 24.8-2.6 36.2-8.6 38.6-20.3 51-69.7 26.3-105-11.7-16.7-32.4-29.1-51.4-30.9-3.6-.3-8.1-.7-10-.9s-7.1 0-11.5.5"/></svg>
						{:else if item.type === 'spot-reconstitution'}
							<!-- Reconstitution (traced capital R) -->
							<svg viewBox="348 458 854 1063" class="legend-icon" fill="currentColor"><path d="M408 989.5V1474h202v-351l81.7.2 81.7.3 90.1 175.2 90 175.3h114.9c91.4 0 114.7-.3 114.3-1.2-.3-.7-46.2-86.6-102-190.8-95.7-178.8-101.3-189.6-99.3-190.4 10.4-4.5 35.9-17.6 43.1-22.2 64.8-41.4 109.9-110.8 124.5-191.4 6.4-35.6 7-83.2 1.4-121-12.7-86.9-55.2-153.9-125.7-198.2-37.3-23.5-81.9-39.5-133.2-47.7-35.9-5.8-22.8-5.5-262.7-5.8l-220.8-.4zM798 664c58.3 3.7 100.8 26.3 127.2 67.6 14.2 22.2 21.8 51.9 21.8 85.4 0 44.8-12.6 80-38 106.4-24.5 25.4-55.6 39.5-98.5 44.5-5.7.7-43.8 1.1-104.7 1.1H610V816.7c0-83.8.3-152.7.7-153 1-1.1 170.2-.8 187.3.3"/></svg>
						{/if}
					</span>
					<span class="legend-label">{item.label}</span>
				</span>
			{/each}
		</div>
	{/if}

	{#if broadNote}
		<p class="fit-broad-legend" role="note">{broadNote}</p>
	{/if}

	<div class="footer-hairline"></div>

	<div class="footer-content">
		<div class="attribution-cell">
			<span class="attribution-text">
				{@html attribution}&nbsp;&nbsp;&nbsp;<a href="https://dannmitton.com" target="_blank" rel="noopener">dannmitton.com</a>
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

	/* ── Provenance legend (above the footer box) ──────────── */

	.provenance-legend {
		position: absolute;
		right: 0;
		bottom: 100%;
		margin-bottom: 8px;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 4px 12px;
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: #78716c;
	}

	.legend-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: 1px solid currentColor;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.legend-icon {
		width: 9px;
		height: 9px;
		flex-shrink: 0;
	}

	.legend-label {
		font-family: var(--font-sans);
		font-size: 9.5px;
		font-variant-caps: small-caps;
		letter-spacing: 0.04em;
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
	.fit-broad-legend {
		margin: 0 0 8px 0;
		font-family: var(--font-sans);
		font-size: 9.5px;
		line-height: 1.4;
		color: #78716c;
	}
</style>
