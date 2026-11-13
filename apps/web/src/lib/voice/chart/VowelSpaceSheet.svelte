<!--
	THE VOWEL-SPACE SHEET (N.199 Step 2; brief r5 section 5). The whole voice on one letter page: all ten vowels as zones, the
	vowels the singer sang as filled dots, a placeholder for each not yet sung as a hollow one, the hull of what is sung (dashed
	until all ten are), the readings in Hz with the nearest note and signed cents ("D4 +14"), the legend, and where the numbers
	come from. It reads the STORED PROFILE and touches no capture code, so it shows the voice as it stands.

	It is built to board B3 (the sheet; `project/PhoneticColourFlat.dc.html` on the design canvas), which is not in the
	repository: the layout follows the brief's description and board D's chart, and where they differ the brief governs. Words are
	the draft English in `draft-strings.ts` until Step 7. Nothing here says "goal" or "target", and nothing tells a singer the voice
	looks wrong: a zone is a neighbourhood (brief section 1).

	`forPrint` draws the same sheet without its screen control, on white, at the letter page's measure (`print-sheet.ts` mounts
	it on the page for the print dialogue).
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { CalibratedFormant, Vowel } from '../engine/types';
	import { spokenName } from '../vowel-names';
	import FrSym from '../FrSym.svelte';
	import ChartLayers from './ChartLayers.svelte';
	import { buildChartModel } from './model';
	import { readingRows } from './readings';
	import { zoneColour } from './colours';
	import { ds } from './draft-strings';

	let {
		profile,
		voiceType,
		language,
		voiceName,
		forPrint = false,
		onprint
	}: {
		profile: Partial<Record<Vowel, CalibratedFormant>>;
		voiceType?: string;
		language: Language;
		voiceName?: string;
		forPrint?: boolean;
		/** The screen's print control. Absent: no control is drawn. */
		onprint?: () => void;
	} = $props();

	/** The chart's own frame, in its viewBox units (the SVG scales to the width it is given). */
	const W = 720;
	const H = 420;

	const model = $derived(buildChartModel(profile, voiceType));
	const rows = $derived(readingRows(profile, language));
	const allTen = $derived(model.allTen);
	const hz = $derived(t('calib.common.hz', language));
</script>

<section class="vowel-sheet" class:for-print={forPrint} aria-labelledby="vowel-sheet-title{forPrint ? '-print' : ''}">
	<header class="sheet-head">
		<h2 id="vowel-sheet-title{forPrint ? '-print' : ''}">{ds('sheet.title')}</h2>
		<p class="sheet-sub">{ds('sheet.subtitle')}</p>
		{#if voiceName}<p class="sheet-voice">{voiceName}</p>{/if}
	</header>

	<div class="sheet-frame">
		<div class="axis-top" aria-hidden="true">
			<span>{ds('sheet.axis.front')}</span>
			<span class="axis-sym"><FrSym n={2} /></span>
			<span>{ds('sheet.axis.back')}</span>
		</div>
		<div class="axis-side" aria-hidden="true">
			<span class="axis-sym"><FrSym n={1} /></span>
			<span>{ds('sheet.axis.open')}</span>
		</div>
		<svg class="sheet-chart" viewBox="0 0 {W} {H}" role="img" aria-label={ds('sheet.chartAlt')} preserveAspectRatio="xMidYMid meet">
			<rect x="0" y="0" width={W} height={H} class="chart-ground" />
			<ChartLayers
				view={model.full}
				width={W}
				height={H}
				zones={model.zones}
				placeholders={model.placeholders}
				sung={model.sung}
				hullDashed={!allTen}
				symbolSize={22}
				labelSize={12}
			/>
			<rect x="0.6" y="0.6" width={W - 1.2} height={H - 1.2} class="chart-frame" />
		</svg>
	</div>

	<ul class="legend">
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><circle cx="12" cy="8" r="6" class="swatch-dot" /></svg>
			<span>{ds('sheet.legend.sung')}</span>
		</li>
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><circle cx="12" cy="8" r="5.5" class="swatch-ghost" /></svg>
			<span>{ds('sheet.legend.placeholder')}</span>
		</li>
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
				<ellipse cx="8" cy="8" rx="7" ry="5" style="fill: {zoneColour('i')}; fill-opacity: 0.4; mix-blend-mode: multiply" />
				<ellipse cx="14" cy="8" rx="7" ry="5" style="fill: {zoneColour('e')}; fill-opacity: 0.4; mix-blend-mode: multiply" />
				<ellipse cx="17" cy="8" rx="6" ry="4.5" style="fill: {zoneColour('ɨ')}; fill-opacity: 0.4; mix-blend-mode: multiply" />
			</svg>
			<span>{ds('sheet.legend.zones')}</span>
		</li>
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><path d="M2 12 L8 3 L20 6 L14 14 Z" class="swatch-hull" class:dashed={!allTen} /></svg>
			<span>{ds('sheet.legend.hull')}</span>
		</li>
	</ul>

	{#if rows.length}
		<table class="readings">
			<caption>{ds('sheet.readings')}</caption>
			<thead>
				<tr>
					<th scope="col" class="col-vowel">{ds('sheet.col.vowel')}</th>
					<th scope="col"><FrSym n={1} /> <span class="col-unit">{ds('sheet.col.fr1')}</span></th>
					<th scope="col"><FrSym n={2} /> <span class="col-unit">{ds('sheet.col.fr2')}</span></th>
				</tr>
			</thead>
			<tbody>
				{#each rows as r (r.vowel)}
					<tr>
						<th scope="row" class="col-vowel">
							<span class="row-sym" aria-hidden="true">{r.vowel}</span>
							<span class="row-name">{spokenName(r.vowel, language)}</span>
						</th>
						<td><span class="num">{r.fR1.hzText} {hz}</span> <span class="note">{r.fR1.text}</span></td>
						<td>
							{#if r.fR2}
								<span class="num">{r.fR2.hzText} {hz}</span> <span class="note">{r.fR2.text}</span>
							{:else}
								<span class="tryagain">{t('calib.roster.tryAgain', language)}</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}

	<p class="provenance">{ds('sheet.provenance')}</p>

	{#if onprint && !forPrint}
		<button type="button" class="sheet-print-btn" onclick={onprint}>{ds('sheet.print')}</button>
	{/if}
</section>

<style>
	.vowel-sheet {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		box-sizing: border-box;
		text-align: left;
		color: var(--ink-primary);
		font-family: var(--font-sans);
	}
	.sheet-head h2 {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 1.375rem;
		font-weight: 600;
		line-height: 1.2;
	}
	.sheet-sub {
		margin: 0.15rem 0 0;
		font-size: 0.875rem;
		color: var(--ink-secondary);
	}
	.sheet-voice {
		margin: 0.15rem 0 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--lavender-ink);
	}
	.sheet-frame {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		column-gap: 0.35rem;
		row-gap: 0.2rem;
	}
	.axis-top {
		grid-column: 2;
		grid-row: 1;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 0.8125rem;
		color: var(--ink-secondary);
	}
	.axis-side {
		grid-column: 1;
		grid-row: 2;
		display: flex;
		flex-direction: row-reverse;
		gap: 0.4rem;
		align-items: center;
		justify-content: flex-end;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-size: 0.8125rem;
		color: var(--ink-secondary);
	}
	.axis-sym {
		color: var(--ink-primary);
	}
	.sheet-chart {
		grid-column: 2;
		grid-row: 2;
		display: block;
		width: 100%;
		height: auto;
	}
	.chart-ground {
		fill: var(--paper-light, #f5f1e8);
	}
	.chart-frame {
		fill: none;
		stroke: var(--ink-stave);
		stroke-width: 1.25;
	}
	.legend {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem 1.25rem;
		font-size: 0.8125rem;
		line-height: 1.35;
		color: var(--ink-secondary);
	}
	.legend li {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
	}
	.legend svg {
		flex: none;
		margin-top: 0.1rem;
	}
	.swatch-dot {
		fill: var(--lavender-jewel);
	}
	.swatch-ghost {
		fill: var(--paper-light, #f5f1e8);
		stroke: var(--lavender-jewel);
		stroke-width: 1.5;
		stroke-dasharray: 2.5 2;
	}
	.swatch-hull {
		fill: color-mix(in srgb, var(--lavender-jewel) 8%, transparent);
		stroke: var(--lavender-jewel);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.swatch-hull.dashed {
		stroke-dasharray: 3 2.5;
	}
	.readings {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
		font-variant-numeric: tabular-nums;
	}
	.readings caption {
		text-align: left;
		font-family: var(--font-serif);
		font-size: 1rem;
		font-weight: 600;
		padding-bottom: 0.25rem;
	}
	.readings th,
	.readings td {
		text-align: left;
		padding: 0.18rem 0.5rem 0.18rem 0;
		border-bottom: 1px solid var(--stone-300, #d6d3d1);
		font-weight: 400;
	}
	.readings thead th {
		font-weight: 600;
		border-bottom: 1.5px solid var(--lavender-jewel);
	}
	.col-unit {
		font-weight: 400;
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}
	.col-vowel {
		white-space: nowrap;
	}
	.row-sym {
		display: inline-block;
		min-width: 1.4em;
		font-family: 'Lato IPA', 'Source Sans 3', sans-serif;
		font-size: 1.05em;
	}
	.row-name {
		color: var(--ink-secondary);
	}
	.num {
		font-weight: 600;
	}
	.note {
		color: var(--ink-secondary);
		margin-left: 0.4em;
	}
	.tryagain {
		color: var(--ink-tertiary);
	}
	.provenance {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink-tertiary);
	}
	.sheet-print-btn {
		align-self: flex-start;
		min-height: 44px;
		padding: 0 1.1rem;
		border-radius: 22px;
		border: 1.5px solid var(--lavender-jewel);
		background: transparent;
		color: var(--lavender-ink);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.sheet-print-btn:hover {
		background: var(--lavender-wash);
	}
	.sheet-print-btn:focus-visible {
		outline: 2px solid var(--ink-primary);
		outline-offset: 2px;
	}

	/* The page the print dialogue gets (`print-sheet.ts` mounts the sheet on the body and marks the body). The app's own
	   print rules hide the drawer and set the page to letter with no margin (`app.css`, `@media print`), so this sheet carries
	   its own half-inch margin, prints white, and keeps its colours on paper. Nothing interactive is drawn (`forPrint`). */
	.vowel-sheet.for-print {
		width: 8.5in;
		padding: 0.4in 0.5in;
		gap: 0.4rem;
		background: #ffffff;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
		break-inside: avoid;
	}
	.vowel-sheet.for-print .chart-ground {
		fill: #ffffff;
	}
	/* One letter sheet, measured (Step 6): the rows, the legend, and the provenance take less room on paper than on the screen. */
	.vowel-sheet.for-print .readings {
		font-size: 0.8125rem;
	}
	.vowel-sheet.for-print .readings th,
	.vowel-sheet.for-print .readings td {
		padding-top: 0.08rem;
		padding-bottom: 0.08rem;
	}
	.vowel-sheet.for-print .legend {
		font-size: 0.75rem;
		gap: 0.2rem 1rem;
	}
	.vowel-sheet.for-print .provenance {
		font-size: 0.6875rem;
	}
	@media print {
		:global(body.printing-vowel-sheet > *:not(.vowel-sheet-print-root)) {
			display: none !important;
		}
		:global(body.printing-vowel-sheet) {
			background: #ffffff !important;
		}
		:global(.vowel-sheet-print-root) {
			display: block;
			width: 8.5in;
			margin: 0;
			padding: 0;
		}
	}
	@media screen {
		:global(.vowel-sheet-print-root) {
			display: none;
		}
	}
</style>
