<script lang="ts">
	/**
	 * N.127 Insights, increment 1: Studio's third document, page one without
	 * the compass.
	 *
	 * RULED, all Dann's 2026-09-11 unless dated otherwise (`STATE.md`, the N.127
	 * block, and `brief-n127-insights-inc1_r1_2026-09-12.md` §1): read-only and
	 * never an input surface; every line computed or a sourced string a
	 * predicate fired; the content in a squircle inheriting the watch band
	 * (`VoiceProfilePane.svelte`, `.watch-band`: 12 px radius, 1 px dusty rose,
	 * cream inside); governing colour dusty rose, label ink `--rose-ink`, `--rose`
	 * for lines and marks only (both moved at colour stage 4, 2026-09-14); page one fixed at one page; section headers on
	 * `TitleHeader.svelte`'s `.metadata-line` recipe in rose; the foot one
	 * apparatus block with the lieder.net clause struck; silence is a finding.
	 * The composition is Design's R3, drawing 1a
	 * (`docs/sessions/n127-design-pack/design-return-insights_r3_2026-09-11.dc.html`).
	 *
	 * NOTHING HERE IS CLICKABLE, EDITABLE, OR FOCUSABLE. It is a document.
	 *
	 * THE ANALYSIS CHAIN IS `VoiceProfilePane`'S, repeated rather than shared.
	 * The same six derivations in the same order (snapshot, reading octave,
	 * performance order, resolvers, analysis, watch list), so the findings
	 * here are the marks the score page draws. Lifting them into one module is
	 * N.123's work, and brief §6 says not to build N.123. The two panes are
	 * never mounted together, so the chain runs once either way.
	 */
	import TitleHeader from '$lib/components/Paper/TitleHeader.svelte';
	import PageFit from '$lib/components/Paper/PageFit.svelte';
	import { PAGE_SIZES, MARGINS, HEADER_GAP } from '$lib/page-config';
	import type { LineData } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import { COMPOSERS, formatNameForPaper } from '$lib/composers-poets';
	import type { Vowel, CalibratedFormant, VoiceCharacteristics } from '$lib/shane/engine/types';
	import type { IngestedScore } from '$lib/shane/ingestion/ingest';
	import {
		analyzeScore,
		resolveVocalReadingOctave,
		shiftVocalOctave,
		scoreInPerformanceOrder,
		type Pitch,
	} from '@ilya/score-parser';
	import { buildUnderlayResolvers } from '$lib/shane/vowel-resolver';
	import { withPairedVowel, type PairingMap, type DrawnUnderlay } from '$lib/shane/pairings';
	import { resolveAdvice } from '$lib/shane/advice-resolver';
	import { buildVoiceProfileSnapshot } from '$lib/shane/analyze-score-adapter';
	import { buildWatchList } from '$lib/shane/watchlist';
	import { pitchLabel } from '$lib/shane/note-picker';
	import {
		buildInsights,
		strikeLiederClause,
		PAGE_ONE_FINDINGS,
		type Containment,
		type Finding,
	} from '$lib/shane/insights';

	interface Props {
		formants: Partial<Record<Vowel, CalibratedFormant>>;
		characteristics?: VoiceCharacteristics;
		voiceName?: string;
		/** The voice's `updatedAt`, ISO 8601. Printed as the calibration date (N.19). */
		voiceUpdatedAt?: string;
		language: Language;
		/** The corrected score, the same value the marked score reads. */
		ingested?: IngestedScore | null;
		scoreTitle?: string;
		composer?: string;
		transcribedLines?: readonly LineData[];
		pairings?: PairingMap;
		/** N.159: the drawn vowel outranks the stored one, so Insights names
		 *  the marks Score markup draws. */
		drawnUnderlay?: DrawnUnderlay;
		openSyllabification?: boolean;
		isMobile?: boolean;
	}

	let {
		formants,
		characteristics = undefined,
		voiceName = undefined,
		voiceUpdatedAt = undefined,
		language,
		ingested = null,
		scoreTitle = undefined,
		composer = '',
		transcribedLines = undefined,
		pairings = undefined,
		drawnUnderlay = undefined,
		openSyllabification = false,
		isMobile = false,
	}: Props = $props();

	const T = (key: string) => t(key, language);
	const fill = (s: string, vars: Record<string, string | number>) =>
		Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

	const dims = PAGE_SIZES.letter;

	// ── The chain, as `VoiceProfilePane` runs it ───────────────────────
	const adapted = $derived(buildVoiceProfileSnapshot(formants, characteristics, voiceName));
	const parsed = $derived(ingested?.result.score ?? null);
	const octaveShift = $derived(parsed ? resolveVocalReadingOctave(parsed, adapted.snapshot.range) : 0);
	const readingScore = $derived(parsed && octaveShift !== 0 ? shiftVocalOctave(parsed, octaveShift) : parsed);
	const analysisScore = $derived(readingScore ? scoreInPerformanceOrder(readingScore).score : null);
	const underlayResolvers = $derived(
		readingScore
			? buildUnderlayResolvers(readingScore, 1, {
					openSyllabification,
					...(transcribedLines ? { transcribedLines } : {}),
				})
			: null,
	);
	const vowelResolver = $derived(underlayResolvers ? withPairedVowel(underlayResolvers.vowel, pairings, drawnUnderlay) : null);
	const analyzed = $derived(
		analysisScore && vowelResolver
			? resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))
			: null,
	);
	const watchList = $derived(
		readingScore && analyzed && analysisScore && vowelResolver
			? buildWatchList(readingScore, analyzed, 1, {
					analysisScore,
					profile: adapted.snapshot,
					resolver: vowelResolver,
				})
			: null,
	);

	/* THE CONDITION IS THE MEASURED VOICE, as it is for the score page's
	   withheld statement (`VoiceProfilePane.svelte`, `showWithheld`). With no
	   measured resonance nothing about this voice can be forecast, so the page
	   prints no number at all (brief §7), even where a typed range exists. */
	const measured = $derived(adapted.completeness.formants);
	const model = $derived(
		measured && analysisScore ? buildInsights({ analysisScore, profile: adapted.snapshot, watchList }) : null,
	);

	// ── The identity head ──────────────────────────────────────────────
	const calibratedOn = $derived(/^\d{4}-\d{2}-\d{2}/.exec(voiceUpdatedAt ?? '')?.[0] ?? null);
	const voiceLabel = $derived(voiceName?.trim() ? voiceName.trim() : T('insights.yourVoice'));
	const identityLine = $derived(
		measured && calibratedOn
			? fill(T('insights.identity'), { voice: voiceLabel, date: calibratedOn })
			: fill(T('insights.identityUncalibrated'), { voice: voiceLabel }),
	);
	const composerDisplay = $derived(formatNameForPaper(composer, COMPOSERS, language));

	let headerHeight = $state(0);
	const contentTop = $derived(MARGINS.vertical + headerHeight + HEADER_GAP);
	let runningHeight = $state(0);
	const subsequentTop = $derived(MARGINS.vertical + runningHeight + HEADER_GAP);

	// ── Pages ──────────────────────────────────────────────────────────
	const pageOneFindings = $derived(model ? model.findings.slice(0, PAGE_ONE_FINDINGS) : []);
	const deferredFindings = $derived(model ? model.findings.slice(PAGE_ONE_FINDINGS) : []);
	const totalPages = $derived(deferredFindings.length > 0 ? 2 : 1);

	const attribution = $derived(strikeLiederClause(T('footer.attribution')));
	const hasTypedCharacteristics = $derived(
		adapted.completeness.range || adapted.completeness.tessitura || adapted.completeness.passaggio,
	);
	const methodLine = $derived(
		!model
			? T('insights.method.silent')
			: fill(T(hasTypedCharacteristics ? 'insights.method.typed' : 'insights.method.untyped'), {
					date: calibratedOn ?? '',
				}),
	);
	/* The footnote prints on the page that cites it, and only then. */
	const citesTessitura = $derived(!!model?.tessitura.measured);

	// ── Words for the model ────────────────────────────────────────────
	const P = (p: Pitch) => pitchLabel(p);

	function flagWord(flag: Containment | null): string {
		return flag ? T(`insights.flag.${flag}`) : '';
	}

	function findingTag(f: Finding): string {
		const parts = [T('loupe.measureTagShort').replace('%m', f.measure), P(f.pitch)];
		return parts.join(' · ');
	}

	/* The word as the score prints it, less the punctuation the engraver set
	   against it: `collectScoreWords` keeps the raw cell, comma and all. */
	function wordOf(f: Finding): string {
		return (f.word ?? '').replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, '');
	}

	function findingBody(f: Finding): string {
		const vowel = `[${f.vowel}]`;
		switch (f.kind) {
			case 'range':
				return T(f.rangeDirection === 'below' ? 'insights.finding.rangeBelow' : 'insights.finding.rangeAbove');
			case 'crossing':
				return fill(T('insights.finding.crossing'), { vowel });
			case 'cover':
			case 'tracking':
				return fill(T('insights.finding.tighten'), { vowel });
			case 'turnover':
				return fill(T('insights.finding.turnover'), { vowel });
			case 'passaggio':
				return T('insights.finding.passaggio');
			case 'timbre':
				return fill(
					T(
						f.timbreDirection === 'close-to-open'
							? 'insights.finding.timbreCloseToOpen'
							: 'insights.finding.timbreOpenToClose',
					),
					{ vowel },
				);
			case 'sustain':
				return fill(T('insights.finding.sustain'), { vowel });
		}
	}

	function furtherLine(f: Finding): string {
		const n = f.instances - 1;
		if (n <= 0) return '';
		return n === 1 ? T('insights.findings.furtherOne') : fill(T('insights.findings.furtherMany'), { n });
	}

	const remainderLine = $derived(
		deferredFindings.length === 1
			? T('insights.findings.remainderOne')
			: fill(T('insights.findings.remainderMany'), { n: deferredFindings.length }),
	);

	const runningHeader = $derived(
		[scoreTitle?.trim() ?? '', identityLine].filter((s) => s.length > 0).join(' · '),
	);
</script>

{#snippet sectionHead(text: string)}
	<p class="section-head">{text}</p>
{/snippet}

{#snippet finding(f: Finding)}
	<div class="finding">
		<p class="finding-tag">{findingTag(f)}{' \u00b7 '}<span class="ipa">[{f.vowel}]</span>{#if wordOf(f)}{' \u00b7 '}{wordOf(f)}{/if}</p>
		<p class="finding-body">{findingBody(f)}{#if furtherLine(f)}{' '}<span class="finding-further">{furtherLine(f)}</span>{/if}</p>
	</div>
{/snippet}

{#snippet foot(pageNumber: number, withFootnote: boolean)}
	<footer class="insights-foot">
		<div class="apparatus">
			{#if withFootnote}
				<p class="footnote">
					<sup>1</sup>&#8201;{@html T('insights.footnote.tessitura')}
					<span class="unverified">{T('insights.citationUnverified')}</span>
				</p>
			{/if}
			<p class="method">{methodLine}</p>
			<p class="attribution">
				{@html attribution}&nbsp;&nbsp;&nbsp;<a href="https://dannmitton.com" target="_blank" rel="noopener">dannmitton.com</a>
			</p>
		</div>
		<div class="foot-hairline"></div>
		<p class="page-count">{T('footer.page')} {pageNumber} {T('footer.of')} {totalPages}</p>
	</footer>
{/snippet}

<PageFit fit={isMobile} pageWidth={dims.width}>
	{#snippet content()}
		<div class="insights-container">
			<article
				class="paper-page insights-page"
				style="width: {dims.width}px; height: {dims.height}px;"
				aria-label={fill(T('insights.pageAria'), { n: 1, total: totalPages })}
			>
				<TitleHeader
					title={scoreTitle ?? ''}
					composer={composerDisplay}
					poet={identityLine}
					translator=""
					opus=""
					{language}
					onheightchange={(h) => (headerHeight = h)}
					versionAccent="#AB7F7F"
					markAccent="#AB7F7F"
					ruleAccent="#AB7F7F"
					labelInk="var(--rose-ink)"
				/>

				<div class="squircle" style="top: {contentTop}px;">
					{#if !analysisScore}
						<p class="silence">{T('insights.silence.noScore')}</p>
					{:else if !model}
						<!-- The page with no measured voice. The heading and the third
						     line are the score page's withheld statement, reused with
						     their French (`profile.withheld.*`); nothing on it is a
						     number. -->
						<div class="section">
							{@render sectionHead(T('profile.withheld.heading'))}
							<p class="prose">{T('insights.silence.unmeasured')}</p>
							<ul class="withheld-list">
								<li>{T('profile.withheld.item3')}</li>
								<li>{T('insights.silence.findings')}</li>
							</ul>
						</div>
					{:else}
						<!-- THE COMPASS'S PLACE, increment 2. Brief §4: leave the space
						     it will occupy, and draw neither a placeholder nor a label.
						     The height is Design R3 drawing 1a's compass block: its
						     section head, the stave squircle at the sheet's measure,
						     and the gap beneath them. -->
						<div class="compass-reserve" aria-hidden="true"></div>

						<div class="section">
							{@render sectionHead(T('insights.fit.heading'))}
							<div class="fit-table" role="table" aria-label={T('insights.fit.heading')}>
								<div class="fit-row fit-head" role="row">
									<span role="columnheader">{T('insights.fit.colTerm')}</span>
									<span role="columnheader">{T('insights.fit.colMeasured')}</span>
									<span role="columnheader">{T('insights.fit.colReference')}</span>
									<span role="columnheader" class="flag">{T('insights.fit.colFlag')}</span>
								</div>

								<div class="fit-row" role="row">
									<span role="cell" class="term">{T('insights.fit.range')}</span>
									<span role="cell">
										{#if model.range.measured}
											{fill(T('insights.fit.compass'), { low: P(model.range.measured.low), high: P(model.range.measured.high) })}
										{:else}
											{T('insights.fit.noPitches')}
										{/if}
									</span>
									<span role="cell">
										{#if model.range.reference}
											{fill(T('insights.fit.spanTyped'), { low: P(model.range.reference.low), high: P(model.range.reference.high) })}
										{:else}
											{T('insights.fit.notTyped')}
										{/if}
									</span>
									<span role="cell" class="flag">{flagWord(model.range.flag)}</span>
								</div>

								<div class="fit-row" role="row">
									<span role="cell" class="term">{T('insights.fit.crossings')}</span>
									<span role="cell">
										{#if model.crossings.measured}
											{fill(T('insights.fit.crossingsCount'), model.crossings.measured)}
										{:else}
											{T('insights.fit.crossingsUncounted')}
										{/if}
									</span>
									<span role="cell">
										{#if model.crossings.reference}
											{fill(T('insights.fit.passaggiTyped'), { primo: P(model.crossings.reference.primo), secondo: P(model.crossings.reference.secondo) })}
										{:else}
											{T('insights.fit.notTyped')}
										{/if}
									</span>
									<!-- No threshold for a crossing count is ruled anywhere, so the
									     flag says that rather than judging the count. -->
									<span role="cell" class="flag">{model.crossings.measured ? T('insights.flag.noThreshold') : ''}</span>
								</div>

								<div class="fit-row" role="row">
									<span role="cell" class="term">{T('insights.fit.tessitura')}</span>
									<span role="cell">
										{#if model.tessitura.measured}
											{fill(T('insights.fit.span'), { low: P(model.tessitura.measured.low), high: P(model.tessitura.measured.high) })}<sup>1</sup>
											{#if model.tessitura.measured.basis === 'half-second-maximum'}
												<span class="qualifier">{T('insights.fit.tessituraFallback')}</span>
											{/if}
											{#if model.tessitura.measured.marginal}
												<span class="qualifier">{T('insights.fit.tessituraMarginal')}</span>
											{/if}
										{:else if model.tessitura.withheldFor}
											{fill(
												T(model.tessitura.withheldFor.length === 1 ? 'insights.fit.withheldOne' : 'insights.fit.withheldMany'),
												{ measures: model.tessitura.withheldFor.join(', ') },
											)}
										{:else}
											{T('insights.fit.nothingSung')}
										{/if}
									</span>
									<span role="cell">
										{#if model.tessitura.reference}
											{fill(T('insights.fit.spanTyped'), { low: P(model.tessitura.reference.low), high: P(model.tessitura.reference.high) })}
										{:else}
											{T('insights.fit.notTyped')}
										{/if}
									</span>
									<span role="cell" class="flag">{flagWord(model.tessitura.flag)}</span>
								</div>
							</div>
							<p class="verdict">
								{T(
									{
										fit: 'insights.verdict.fit',
										'outside-range': 'insights.verdict.outsideRange',
										'outside-tessitura': 'insights.verdict.outsideTessitura',
										'range-only': 'insights.verdict.rangeOnly',
										'cannot-say': 'insights.verdict.cannotSay',
									}[model.verdict],
								)}
							</p>
						</div>

						<div class="section">
							{@render sectionHead(T('insights.findings.heading'))}
							{#if pageOneFindings.length === 0}
								<p class="prose">{T('insights.findings.none')}</p>
							{:else}
								{#each pageOneFindings as f (f.key)}
									{@render finding(f)}
								{/each}
								{#if deferredFindings.length > 0}
									<p class="remainder">{remainderLine}</p>
								{/if}
							{/if}
						</div>
					{/if}
				</div>

				{@render foot(1, citesTessitura)}
			</article>

			{#if deferredFindings.length > 0}
				<!-- THE EARNED PAGE, and it exists only because page one's count line
				     promises it (brief §4.3). It carries the deferred findings in
				     page one's own shape; the advice section Design drew on it is
				     not in this increment. -->
				<article
					class="paper-page insights-page"
					style="width: {dims.width}px; height: {dims.height}px;"
					aria-label={fill(T('insights.pageAria'), { n: 2, total: totalPages })}
				>
					<header class="running-header" bind:offsetHeight={runningHeight}>
						<span class="running-text">{runningHeader}</span>
						<div class="running-rule"></div>
					</header>
					<div class="squircle" style="top: {subsequentTop}px;">
						<div class="section">
							{@render sectionHead(T('insights.findings.deferredHeading'))}
							{#each deferredFindings as f (f.key)}
								{@render finding(f)}
							{/each}
						</div>
					</div>
					{@render foot(2, false)}
				</article>
			{/if}
		</div>
	{/snippet}
</PageFit>

<style>
	/* The page stack: `VoiceProfilePane`'s `.fit-paper-container`, whose
	   declarations are byte-identical to `Paper.svelte`'s `.paper-container`. */
	.insights-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}

	.paper-page {
		position: relative;
		box-sizing: border-box;
		background: var(--paper-cream);
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
		flex-shrink: 0;
	}

	/* ── The squircle ─────────────────────────────────────────
	   The watch band's outline: 12 px radius, 1 px dusty rose, cream inside.
	   It sizes to its content (Design R3); the paper is what is fixed. */
	.squircle {
		position: absolute;
		left: 96px;
		right: 96px;
		box-sizing: border-box;
		border: 1px solid var(--rose, #ab7f7f);
		border-radius: 12px;
		background: var(--paper-cream);
		padding: 18px 26px 20px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	/* Design R3 drawing 1a: the compass section's head (22.4) and gap (6),
	   the stave squircle at this measure (160 plus its 2 px border). */
	.compass-reserve {
		height: 190px;
		flex-shrink: 0;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* `TitleHeader.svelte`'s `.metadata-line`, in rose label ink, ruled by
	   Dann 2026-09-11. Small caps must clear 4.5 on cream. Since colour stage
	   4 (2026-09-14) it is `--rose-ink`, #674141 at 7.33, per ruling 4 of 4
	   of 2026-09-13; it was the literal #8A5C5C. */
	.section-head {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 1.5px;
		line-height: 1.6;
		font-variant-caps: all-small-caps;
		color: var(--rose-ink);
	}

	.prose,
	.silence {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-primary);
	}

	.withheld-list {
		margin: 0;
		padding-left: 1.1rem;
		font-family: var(--font-serif);
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--ink-secondary);
	}

	/* ── The fit table ──────────────────────────────────────── */

	.fit-table {
		display: grid;
		grid-template-columns: 150px 1fr 1fr 88px;
		column-gap: 14px;
		font-family: var(--font-serif);
		font-size: 12.5px;
		line-height: 1.35;
		color: var(--ink-secondary);
	}

	.fit-row {
		display: contents;
	}

	.fit-row > span {
		padding: 5px 0 4px;
		border-top: 1px solid rgba(171, 127, 127, 0.35);
	}

	.fit-head > span {
		padding-top: 0;
		border-top: none;
		font-family: var(--font-sans);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-tertiary);
	}

	.fit-row .term {
		color: var(--ink-primary);
	}

	.fit-row .flag {
		text-align: right;
	}

	.fit-row:not(.fit-head) .flag {
		font-family: var(--font-sans);
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-secondary);
	}

	.qualifier {
		display: block;
		color: var(--ink-tertiary);
	}

	sup {
		font-size: 0.62em;
		line-height: 0;
	}

	.verdict {
		margin: 0;
		padding-top: 2px;
		font-family: var(--font-serif);
		font-size: 16px;
		line-height: 1.4;
		color: var(--ink-primary);
	}

	/* ── Findings ───────────────────────────────────────────── */

	.finding {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	/* The Loupe's measure tag (`Loupe.svelte`, `.loupe-tag`). */
	.finding-tag {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--ink-tertiary);
	}

	.ipa {
		font-family: 'Lato IPA', var(--font-sans);
		letter-spacing: 0;
	}

	.finding-body {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.4;
		color: var(--ink-primary);
		text-wrap: pretty;
	}

	.finding-further,
	.remainder {
		color: var(--ink-tertiary);
	}

	.remainder {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 12.5px;
		line-height: 1.4;
	}

	/* ── The running head on the earned page ─────────────────
	   `RunningHeader.svelte`'s recipe, in rose. That component draws its rule
	   in sage and its siblings are untouched, so the recipe is repeated here. */
	.running-header {
		position: absolute;
		top: 48px;
		left: 96px;
		right: 96px;
	}

	.running-text {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-secondary);
		letter-spacing: 1.5px;
		line-height: 1.4;
		font-variant-caps: all-small-caps;
	}

	.running-rule {
		border-bottom: 1px solid var(--rose, #ab7f7f);
		margin-top: 4px;
	}

	/* ── The foot: one apparatus block, one hairline ───────── */

	.insights-foot {
		position: absolute;
		bottom: 48px;
		left: 96px;
		right: 96px;
	}

	.apparatus {
		margin-bottom: 8px;
		font-family: var(--font-sans);
		font-size: 9.5px;
		line-height: 1.45;
		color: #78716c;
	}

	.apparatus p {
		margin: 0;
	}

	.unverified {
		font-family: var(--font-mono);
		font-size: 8.5px;
		letter-spacing: 0.04em;
	}

	.method {
		font-variant-caps: all-small-caps;
		letter-spacing: 0.06em;
	}

	.attribution {
		text-align: justify;
		font-variant-caps: all-small-caps;
		letter-spacing: 1px;
		color: var(--ink-secondary);
	}

	.attribution :global(a) {
		color: var(--ink-secondary);
		text-decoration: none;
	}

	.foot-hairline {
		border-top: 1px solid var(--rose, #ab7f7f);
		margin-bottom: 8px;
	}

	.page-count {
		margin: 0;
		text-align: right;
		font-family: var(--font-sans);
		font-size: 9.5pt;
		font-variant-caps: all-small-caps;
		letter-spacing: 1px;
		color: var(--ink-secondary);
	}

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
