<!--
	THE VOWEL-SPACE SHEET (N.199 Step 2; brief r5 section 5). The whole voice on one letter page: all ten vowels as zones, the
	vowels the singer sang as filled dots, a placeholder for each not yet sung as a hollow one, the hull of what is sung (dashed
	until all ten are), the readings in Hz with the nearest note and signed cents ("D4 +14"), the legend, and where the numbers
	come from. It reads the STORED PROFILE and touches no capture code, so it shows the voice as it stands.

	It is built to board B3 (the sheet; `project/PhoneticColourFlat.dc.html` on the design canvas), which is not in the
	repository: the layout follows the brief's description and board D's chart, and where they differ the brief governs. Words are
	the ratified words in `i18n.ts` (`sheet.*`), English and French. Nothing here says "goal" or "target", and nothing tells a singer the voice
	looks wrong: a zone is a neighbourhood (brief section 1).

	`forPrint` draws the same sheet without its screen control, on white, at the letter page's measure (`print-sheet.ts` mounts
	it on the page for the print dialogue).
-->
<script lang="ts">
	import { t, tv, type Language } from '$lib/i18n';
	import Italics from '$lib/components/Italics.svelte';
	import type { CalibratedFormant, Vowel } from '../engine/types';
	import { spokenName } from '../vowel-names';
	import FrSym from '../FrSym.svelte';
	import ChartLayers from './ChartLayers.svelte';
	import { buildChartModel } from './model';
	import { labelSizeFor } from './geometry';
	import { summaryRows } from './readings';
	import { zoneColour } from './colours';

	let {
		profile,
		voiceType,
		language,
		voiceName,
		forPrint = false,
		onprint,
		onLearnNote
	}: {
		profile: Partial<Record<Vowel, CalibratedFormant>>;
		voiceType?: string;
		language: Language;
		voiceName?: string;
		forPrint?: boolean;
		/** The screen's print control. Absent: no control is drawn. */
		onprint?: () => void;
		/** The ⓘ beside [o] that opens LEARN. Absent, or on paper: no ⓘ is drawn. */
		onLearnNote?: () => void;
	} = $props();

	/** The chart's own frame, in its viewBox units (the SVG scales to the width it is given). */
	const W = 720;
	/** Shorter on paper: the ratified legend and provenance lines are longer than the drafts were, and one letter sheet holds the sheet (measured, Step 6b). */
	const H = $derived(forPrint ? 360 : 420);

	// The grid's numbers: on screen the SVG scales to its container, so a size in chart units shrinks with it; they are sized to hold 11 CSS px at
	// any width (as `VowelChart.svelte` does), and `ChartLayers` leaves out a number that would meet another (Step 2). Print is a second instance
	// (`print-sheet.ts`) in a root that is `display: none` on screen, so it is chosen by `forPrint`, never by a measured width: it keeps 12 units.
	let chartWidth = $state(0);
	const labelSize = $derived(forPrint ? 12 : labelSizeFor(W, chartWidth));
	const model = $derived(buildChartModel(profile, voiceType));
	// Ten rows, always: a recorded vowel's reading, or the placeholder the chart draws for one not recorded (N.203 lane 60, Step 5).
	const rows = $derived(summaryRows(profile, model.placeholders, language));
	const allTen = $derived(model.allTen);
	const hz = $derived(t('calib.common.hz', language));
</script>

<section class="vowel-sheet" class:for-print={forPrint} aria-labelledby="vowel-sheet-title{forPrint ? '-print' : ''}">
	<header class="sheet-head">
		<h2 id="vowel-sheet-title{forPrint ? '-print' : ''}">{tv('sheet.title', language)}</h2>
		<p class="sheet-sub">{tv('sheet.subtitle', language)}</p>
		{#if voiceName}<p class="sheet-voice">{voiceName}</p>{/if}
	</header>

	<div class="sheet-frame">
		<div class="axis-top" aria-hidden="true">
			<span>{tv('sheet.axis.front', language)}</span>
			<span class="axis-sym"><FrSym n={2} /></span>
			<span>{tv('sheet.axis.back', language)}</span>
		</div>
		<div class="axis-side" aria-hidden="true">
			<span class="axis-sym"><FrSym n={1} /></span>
			<span>{tv('sheet.axis.open', language)}</span>
		</div>
		<svg class="sheet-chart" bind:clientWidth={chartWidth} viewBox="0 0 {W} {H}" role="img" aria-label={tv('sheet.chartAlt', language)} preserveAspectRatio="xMidYMid meet">
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
				{labelSize}
			/>
			<rect x="0.6" y="0.6" width={W - 1.2} height={H - 1.2} class="chart-frame" />
		</svg>
	</div>

	{#if rows.length}
		<table class="readings">
			<caption>{tv('sheet.readings', language)}</caption>
			<thead>
				<tr>
					<th scope="col" class="col-vowel">{tv('sheet.col.vowel', language)}</th>
					<th scope="col"><FrSym n={1} /> <span class="col-unit">{tv('sheet.col.fr1', language)}</span></th>
					<th scope="col"><FrSym n={2} /> <span class="col-unit">{tv('sheet.col.fr2', language)}</span></th>
				</tr>
			</thead>
			<tbody>
				{#each rows as r (r.vowel)}
					<tr class:placed={r.kind === 'placed'} data-row={r.vowel}>
						<th scope="row" class="col-vowel">
							{#if r.kind === 'sung'}
								<svg class="row-mark" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" class="swatch-dot" /></svg>
							{:else}
								<svg class="row-mark" viewBox="0 0 12 12" width="12" height="12" role="img" aria-label={t('capture.button.placed', language)}><circle cx="6" cy="6" r="4.25" class="swatch-ghost" /></svg>
							{/if}
							<span class="row-sym" aria-hidden="true">{r.vowel}</span>
							<span class="row-name">{spokenName(r.vowel, language)}</span>
							{#if onLearnNote && !forPrint && r.vowel === 'o'}
								<!-- The sung-[o] note glyph (Kimi 2026-07-11): [o] only, quiet and tertiary by ruling; it is the whole affordance. -->
								<button type="button" class="row-info" aria-label={t('calib.roster.oNoteAria', language)} onclick={onLearnNote}>ⓘ</button>
							{/if}
							{#if r.marks.provisional}<span class="row-mark-word is-provisional">{t('calib.roster.reading.provisional', language)}</span>{/if}
							{#if r.marks.beyond}<span class="row-mark-word">{t('calib.roster.kept', language)}</span>{/if}
							{#if r.marks.noiseFloorUnmeasured}<span class="row-mark-word" title={t('calib.roster.noiseFloorTitle', language)}>{t('calib.roster.noiseFloorLabel', language)}</span>{/if}
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

	<ul class="legend">
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><circle cx="12" cy="8" r="6" class="swatch-dot" /></svg>
			<span>{tv('sheet.legend.sung', language)}</span>
		</li>
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><circle cx="12" cy="8" r="5.5" class="swatch-ghost" /></svg>
			<span>{tv('sheet.legend.placeholder', language)}</span>
		</li>
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
				<ellipse cx="8" cy="8" rx="7" ry="5" style="fill: {zoneColour('i')}; fill-opacity: 0.4; mix-blend-mode: multiply" />
				<ellipse cx="14" cy="8" rx="7" ry="5" style="fill: {zoneColour('e')}; fill-opacity: 0.4; mix-blend-mode: multiply" />
				<ellipse cx="17" cy="8" rx="6" ry="4.5" style="fill: {zoneColour('ɨ')}; fill-opacity: 0.4; mix-blend-mode: multiply" />
			</svg>
			<span>{tv('sheet.legend.zones', language)}</span>
		</li>
		<li>
			<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><path d="M2 12 L8 3 L20 6 L14 14 Z" class="swatch-hull" class:dashed={!allTen} /></svg>
			<span>{tv('sheet.legend.hull', language)}</span>
		</li>
	</ul>

	<p class="provenance"><Italics text={tv('sheet.provenance', language)} /></p>

	{#if onprint && !forPrint}
		<button type="button" class="sheet-print-btn" onclick={onprint}>{tv('sheet.print', language)}</button>
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
	/* A largest width on screen: the chart's own frame, 720 px (`W`), so in the Drawer as a sheet it does not stretch past it. Print is not capped. */
	.vowel-sheet:not(.for-print) {
		max-width: 720px;
		margin-inline: auto;
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
	/* The mark: filled where recorded, hollow where Ilya's placeholder stands. Its word is the hollow one's accessible name. */
	.row-mark {
		display: inline-block;
		vertical-align: -1px;
		margin-right: 0.35em;
	}
	.readings tr.placed .num,
	.readings tr.placed .row-sym,
	.readings tr.placed .row-name,
	.readings tr.placed .note {
		color: var(--ink-tertiary);
		font-weight: 400;
	}
	/* The roster's marks sit in the row's own cell, under the vowel's name (Dann's placement of 2026-07-10), so a marked row grows and an unmarked one does not. */
	.row-mark-word {
		display: block;
		margin-left: 1.6em;
		white-space: normal;
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--ink-tertiary);
	}
	.row-mark-word.is-provisional {
		color: var(--prep-amber);
	}
	/* Narrow screens (390 px, measured): one line a row. The number and its note stay together, the type steps down a size, and the gaps close. */
	@media (max-width: 430px) {
		.readings {
			font-size: 0.8125rem;
		}
		.readings td {
			white-space: nowrap;
		}
		.col-vowel {
			white-space: normal;
		}
		.vowel-sheet:not(.for-print) {
			gap: 0.55rem;
		}
		.readings th,
		.readings td {
			padding: 0.12rem 0.3rem 0.12rem 0;
		}
		.note {
			margin-left: 0.2em;
		}
		.row-sym {
			min-width: 1.1em;
		}
		.row-mark {
			margin-right: 0.2em;
		}
	}
	.row-info {
		background: none;
		border: none;
		padding: 0 0.25rem;
		font: inherit;
		font-size: 0.875rem;
		line-height: 1;
		color: var(--ink-tertiary);
		cursor: pointer;
	}
	.row-info:hover {
		color: var(--ink-secondary);
	}
	@media (pointer: coarse) {
		.row-info {
			min-width: 44px;
			min-height: 44px;
		}
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
		padding: 0.35in 0.5in;
		gap: 0.35rem;
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
	/* On paper the marks sit on the row's own line, beside the name: the page is wide, and the sheet must stay one page (measured with ten rows and three marks). */
	.vowel-sheet.for-print .row-mark-word {
		display: inline-block;
		margin-left: 0.6em;
	}
	.vowel-sheet.for-print .legend {
		font-size: 0.75rem;
		gap: 0.2rem 1rem;
	}
	.vowel-sheet.for-print .provenance {
		font-size: 0.65rem;
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
