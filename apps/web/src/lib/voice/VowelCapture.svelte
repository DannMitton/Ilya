<!--
	THE CAPTURE SCREEN (N.199 Step 4b; reordered by N.203 lane 59 Step 4, Dann 2026-11-16 00:32). One vowel at a time, in this order: the head and its
	count; the vowel's row (the symbol in a circle, its spoken name, the drawing's credit and the two resonances, and the side view); the take line;
	the cue, alone; the first-time explanation until a take has begun; the ten buttons in Grayson's order; Start and the second button (and, at ten
	recorded, See your vowel space); the vowel space chart; then the hint, the sentence on the dots, the folded readings, the toggle that hides the chart
	and the numbers during a take, and the quiet way back to the summary. A tap on a vowel focuses it; Start records it. It is the capture phase
	for every singer (Step 8, Dann 2026-11-14 21:03); the wheel it replaced is deleted.

	WHAT IT OWNS: the selection, the idle notice, the Clear-all confirmation, the toggle. WHAT IT DOES NOT: the profile, which is the
	wizard's and arrives as `profile`; a captured reading goes back to the wizard through `onCaptured`, which runs the guard, persists,
	and returns the profile with the reading in it, so the dot lands from the same stored values the summary reads. The take itself
	is `capture-ritual.svelte.ts`. Capture shows no verdict: a dot is drawn wherever it falls, the summary asks about it.

	Width: 484 px in the Drawer on desktop, the phone's width on a phone. One component; the chart takes the width it is given. Everything from the
	VOICE header down to the Start row is in view without scrolling (measured in the Step 4 report); nothing is sticky now.
	Words: `i18n.ts`, English and French, ratified by Dann (`OPEN.md` section N.199); never invented here.
-->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { t, tv, type Language } from '$lib/i18n';
	import type { CaptureSession } from './engine/session';
	import type { CaptureError } from './engine/errors';
	import type { CalibratedFormant, Vowel } from './engine/types';
	import { VOWELS } from './engine/types';
	import { createCaptureRitual, GLIDE_MS, type RitualCue } from './capture-ritual.svelte';
	import TakeLine from './TakeLine.svelte';
	import { TAKE_PART_IDS, TAKE_WEIGHTS } from './take-line';
	import { createVisit } from './visit';
	import { spokenName } from './vowel-names';
	import FrSym from './FrSym.svelte';
	import VowelChart from './chart/VowelChart.svelte';
	import { buildChartModel } from './chart/model';
	import { readingListRows } from './chart/readings';
	import { nextVowel } from './chart/tour';
	import { zoomTarget, type View } from './chart/geometry';
	import { createViewMotion } from './chart/view-motion';
	import { creditLine } from './chart/drawings';
	import SagittalDrawing from './chart/SagittalDrawing.svelte';
	import { failedTake, readingTake, type TakeRecord, type TakeVisibility } from './takes';
	import {
		GLYPH_NUDGE, bracket, buttonLabel, buttonStates, cueText, firstTimeExplanation, hintText, hintsFor, idleCue, mainButton, staysAfterTake, stopLabel, tapEffect
	} from './chart/screen-logic';

	let {
		session,
		language,
		voiceType,
		profile,
		startVowel,
		pass,
		onCaptured,
		onRolledBack,
		onFailed,
		onTake,
		onReturn,
		onClearAll,
		takeoverVisible = true
	}: {
		session: CaptureSession;
		language: Language;
		voiceType?: string;
		/** The wizard's stored, guarded readings. */
		profile: Partial<Record<Vowel, CalibratedFormant>>;
		/** The vowel the screen opens on. */
		startVowel: Vowel;
		/** A list to walk, then return to the summary (a re-take from the summary). Absent: Ilya's order. */
		pass?: Vowel[];
		onCaptured: (vowel: Vowel, formant: CalibratedFormant) => void;
		onRolledBack?: (vowel: Vowel, rejected: CalibratedFormant) => void;
		onFailed?: (vowel: Vowel, error: CaptureError) => void;
		/** Every take's record, for the voice's take record (Step 5; written for every singer). */
		onTake?: (record: TakeRecord) => void;
		/** Leave for the summary. */
		onReturn: () => void;
		/** The second tap of Start over: the wizard clears this voice's readings. */
		onClearAll: () => void;
		/** Whether the takeover this screen sits in is showing. The microphone is held open only while it is (`visit.ts`). */
		takeoverVisible?: boolean;
	} = $props();

	// ── State ───────────────────────────────────────────────────────────────
	let selected = $state<Vowel>(untrack(() => startVowel));
	/** Where the selection moves when the landing is over: it does not change under the dot that is landing. */
	let pendingSelected = $state<Vowel | null>(null);
	let notice = $state<RitualCue | null>(null);
	let confirmingClear = $state(false);
	let hideWhileSinging = $state(false);
	/** The readings list, closed until the singer opens it. Not stored; it never opens by itself, and a take closes it while the chart is hidden. */
	let listOpen = $state(false);
	/** Whether a take has begun on this screen: the first-time explanation shows until one has. */
	let tookAny = $state(false);
	/** A pass ended with the last capture: return to the summary when the landing is over. */
	let returnWhenIdle = $state(false);
	let reducedMotion = $state(false);

	const sungSet = $derived(new Set(VOWELS.filter((v) => profile[v] && profile[v]!.reading !== 'estimated' && profile[v]!.f1 > 0)));
	const model = $derived(buildChartModel(profile, voiceType));
	const listRows = $derived(readingListRows(profile, model.placeholders, language));

	const ritual = createCaptureRitual({
		// The session is the wizard's for the life of this screen; it is read once.
		session: untrack(() => session),
		voiceType: () => voiceType,
		previous: (v) => profile[v],
		reducedMotion: () => reducedMotion,
		onCaptured: (v, f) => {
			onTake?.(readingTake(takeContext(v), f));
			onCaptured(v, { ...f, visibility: takeVisible }); // the reading carries how it was taken
			keepNotice();
			advanceFrom(v);
		},
		onRolledBack: (v, f) => {
			onTake?.(readingTake(takeContext(v), f, true));
			onRolledBack?.(v, f);
			keepNotice();
			advanceFrom(v);
		},
		onFailed: (v, e) => {
			onTake?.(failedTake(takeContext(v), e));
			onFailed?.(v, e);
			keepNotice();
		}
	});

	// The microphone is open once per visit to this screen: while it is mounted and the takeover is showing (Step 1).
	const visit = createVisit({
		session: untrack(() => session),
		endTake: () => ritual.cancel(),
		closeTicks: () => ritual.closeTicks(),
		wanted: () => takeoverVisible
	});
	$effect(() => visit.sync());

	/** The ritual has just set its cue for the take that ended: keep it on the screen if the singer needs to read it, else let the invitation take over. */
	function keepNotice() {
		notice = staysAfterTake(ritual.cue.key) ? ritual.cue : null;
	}

	/** After a take that ended with a reading: carry on from the vowel just sung, and wait. Nothing starts by itself. */
	function advanceFrom(v: Vowel) {
		const after = new Set<Vowel>([...sungSet, v]);
		const next = nextVowel(after, v, pass);
		if (next !== null) pendingSelected = next;
		else if (pass && !notice) returnWhenIdle = true; // a take that leaves a notice to read (a rollback, an uncertain reading) stays until the singer returns
		// all ten sung, no pass: the screen rests where it is
	}

	// ── The chart's view: it rests on the focused vowel and glides on every change of focus (N.203 Step 4) ────────
	/** The view that moves in on a vowel's zone, widened to hold the reading it has (a re-take) or is about to have. */
	const targetFor = (v: Vowel, extra?: CalibratedFormant) => {
		const zone = model.zones.find((z) => z.vowel === v)!;
		const have = extra ?? profile[v];
		return zoomTarget(model.full, zone, have ? [{ f1: have.f1, f2: have.f2 }] : []);
	};
	let view = $state<View>(untrack(() => targetFor(startVowel)));
	const motion = createViewMotion(untrack(() => targetFor(startVowel)), (v) => (view = v));
	// The subject is the take's vowel while one runs or lands, else the focus. A change of subject, or of the reading it holds, aims the view at
	// it: a glide of about 800 ms, a jump under reduced motion, and none in hidden mode (the chart is not drawn). The dwell is the ritual's: the
	// chart rests on the new dot for its 1.4 s because the subject does not change until the dwell is over.
	$effect(() => {
		const target = targetFor(subject, profile[subject]);
		const ms = reducedMotion || hiding ? 0 : GLIDE_MS;
		untrack(() => motion.to(target, ms));
	});

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const change = () => (reducedMotion = mq.matches);
		mq.addEventListener('change', change);
		return () => {
			mq.removeEventListener('change', change);
			motion.stop();
			visit.destroy();
			ritual.destroy();
		};
	});

	// The selection moves when the landing is over, and a pass that has run out returns to the summary then.
	$effect(() => {
		if (ritual.phase === 'idle' && pendingSelected !== null) {
			selected = pendingSelected;
			pendingSelected = null;
		}
	})
	$effect(() => {
		if (returnWhenIdle && ritual.phase === 'idle') {
			returnWhenIdle = false;
			onReturn();
		}
	});

	// ── Derived presentation ───────────────────────────────────────────────
	const active = $derived(ritual.phase !== 'idle' && ritual.phase !== 'landing');
	const running = $derived(ritual.phase !== 'idle');
	const finished = $derived(sungSet.size === VOWELS.length);
	const hiding = $derived(hideWhileSinging && active);
	const states = $derived(buttonStates(sungSet));
	const cue = $derived(running ? cueText(ritual.cue, language) : cueText(notice ?? idleCue(selected, sungSet), language));
	const hint = $derived(hintText(hintsFor({ active, confirmingClear, selected, sung: sungSet, voiceType }), language));
	const main = $derived(mainButton(running, sungSet, selected, language));
	const showExplain = $derived(!tookAny && sungSet.size === 0);
	/** The vowel the chart and the readout are about: the take's, while one is running or landing; else the selection. */
	const subject = $derived(ritual.vowel ?? selected);
	const reading = $derived(profile[subject]);
	/** The readout shows at rest and in the landing, and not while a notice is being read: the cue then has the whole row (Step 7, the pause line on a phone). */
	const showReading = $derived((ritual.phase === 'idle' || ritual.phase === 'landing') && !!reading && !(ritual.phase === 'idle' && notice));
	const hz = $derived(t('calib.common.hz', language));
	const takeParts = $derived(TAKE_PART_IDS.map((id) => ({ id, label: tv(`capture.part.${id}`, language), weight: TAKE_WEIGHTS[id] })));

	// ── Gestures ───────────────────────────────────────────────────────────
	/** What the singer could see from the tap to the reading: the toggle as it stood at the tap. */
	let takeVisible: TakeVisibility = 'zone';
	const takeContext = (vowel: Vowel) => ({ vowel, voiceType, visible: takeVisible });
	function startTake(v: Vowel) {
		takeVisible = hideWhileSinging ? 'hidden' : 'zone';
		if (hideWhileSinging) listOpen = false; // the list follows the chart and the readout: out of sight from the tap to the landing
		notice = null;
		confirmingClear = false;
		tookAny = true;
		visit.resume(); // the Start tap is a gesture: a context the system suspended between takes resumes here
		ritual.begin(v);
	}
	/** A tap focuses a vowel and never records (Dann 2026-11-15 19:23). During a take it does nothing; during the dwell on a new dot it ends the dwell at once (DESK DEFAULT). */
	function tapVowel(v: Vowel) {
		const effect = tapEffect(ritual.phase);
		if (effect === 'ignore') return;
		if (effect === 'endDwellAndFocus') {
			ritual.endDwell();
			pendingSelected = null;
		}
		selected = v;
	}
	function pressMain() {
		if (main.disabled) return;
		startTake(selected);
	}
	function pressStop() {
		if (active) {
			ritual.cancel();
			return;
		}
		if (running) return; // the landing: nothing to stop
		if (sungSet.size === 0) return;
		if (!confirmingClear) {
			confirmingClear = true;
			return;
		}
		confirmingClear = false;
		onClearAll();
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && ritual.cancellable) {
			e.preventDefault();
			ritual.cancel();
		}
	}
	const returnShown = $derived(ritual.phase === 'idle' && sungSet.size >= 1 && !finished);
	const seeSpaceShown = $derived(ritual.phase === 'idle' && finished);
	const stopDisabled = $derived(!active && (running || sungSet.size === 0));
</script>

<svelte:window onkeydown={onKeydown} />

<div class="capture">
	<!-- The cue, spoken: the vowel by its name, never the bare glyph (§4.6). The eye reads the bracketed symbol below. -->
	<p class="visually-hidden" role="status" aria-live="polite">{cue.ear}</p>

	<header class="head">
		<h2>{tv('capture.title', language)}</h2>
		<p class="count">{tv('capture.count', language, { n: sungSet.size })}</p>
	</header>

	<!-- The vowel's row: the symbol, its name and credit and the two resonances, and the side view (N.203 Step 4, Dann 2026-11-16 00:32). -->
	<div class="glyph-row">
		<div class="glyph-circle" aria-hidden="true">
			<span class="glyph" style="transform: translate({GLYPH_NUDGE[selected][0]}em, {GLYPH_NUDGE[selected][1]}em)">{selected}</span>
		</div>
		<div class="glyph-words">
			<p class="vowel-name">{spokenName(selected, language)}</p>
			<p class="credit">{creditLine(selected, language)}</p>
			{#if showReading && reading && !hiding}
				<div class="readout" aria-hidden="true">
					<div class="readout-line"><FrSym n={1} /><span>{Math.round(reading.f1)} {hz}</span></div>
					<div class="readout-line">
						<FrSym n={2} />
						{#if typeof reading.f2 === 'number'}<span>{Math.round(reading.f2)} {hz}</span>{:else}<span class="try">{t('calib.roster.tryAgain', language)}</span>{/if}
					</div>
				</div>
			{/if}
		</div>
		<!-- The side view, in a squircle with a fixed frame: the ten drawings share one box, so the picture changes in place (Dann 2026-11-12, entry 41). -->
		<div class="squircle" role="img" aria-label={tv('capture.drawingAlt', language, { name: spokenName(selected, language) })}>
			<div class="squircle-frame"><SagittalDrawing {selected} /></div>
		</div>
	</div>

	<TakeLine
		parts={takeParts}
		current={ritual.take?.part ?? null}
		within={ritual.take?.within ?? 0}
		holding={ritual.take?.holding ?? false}
		label={tv('capture.bar', language)}
		{reducedMotion}
	/>
	<p class="cue" aria-hidden="true">{cue.eye}</p>
	{#if showExplain}
		<p class="explain-first">{firstTimeExplanation(selected, language)}</p>
	{/if}

	<div class="buttons" role="group" aria-label={tv('capture.vowels', language)}>
		{#each VOWELS as v (v)}
			{@const isSelected = v === selected}
			<button
				type="button"
				class="vowel-btn"
				class:sung={states[v] === 'sung'}
				class:placed={states[v] === 'placed'}
				class:selected={isSelected}
				aria-label={buttonLabel(v, states[v], isSelected, language)}
				aria-pressed={isSelected}
				onclick={() => tapVowel(v)}
			>
				<span class="btn-glyph" style="transform: translate({GLYPH_NUDGE[v][0]}em, {GLYPH_NUDGE[v][1]}em)">{v}</span>
			</button>
		{/each}
	</div>

	<div class="actions">
		<button type="button" class="main" disabled={main.disabled} onclick={pressMain}>{main.label}</button>
		<button type="button" class="stop" disabled={stopDisabled} onclick={pressStop}>{stopLabel(active, confirmingClear, language)}</button>
	</div>
	{#if seeSpaceShown}
		<button type="button" class="see-space" onclick={onReturn}>{tv('capture.seeSpace', language)}</button>
	{/if}

	<!-- The vowel space chart, below the buttons (Dann 2026-11-16 00:32). -->
	<div class="chart-box">
		{#if hiding}
			<p class="hidden-note">{tv('capture.hidden', language)}</p>
		{:else}
			<VowelChart {model} {view} {language} active={running ? subject : null} onFocus={tapVowel} />
		{/if}
	</div>

	<p class="hint">{hint}</p>
	<p class="explain">{tv('capture.explain', language)}</p>

	<!-- The readings list (N.199 readings brief, Step 1): fR1 and fR2 for each of the ten vowels, folded. Closed by default so the chart stays the feature.
	     While the chart is hidden its closed line stays in place, invisible and inert, so the toggle below does not move. -->
	<details class="readings" class:away={hiding} inert={hiding} bind:open={listOpen}>
		<summary id="capture-readings-summary">{tv('sheet.readings', language)}</summary>
		<table aria-labelledby="capture-readings-summary">
			<thead>
				<tr>
					<th scope="col" class="c-vowel">{tv('sheet.col.vowel', language)}</th>
					<th scope="col"><FrSym n={1} /> <span class="col-unit">{tv('sheet.col.fr1', language)}</span></th>
					<th scope="col"><FrSym n={2} /> <span class="col-unit">{tv('sheet.col.fr2', language)}</span></th>
				</tr>
			</thead>
			<tbody>
				{#each listRows as r (r.vowel)}
					<tr class:placed-row={r.kind === 'placed'} data-row={r.vowel} data-kind={r.kind}>
						<th scope="row" class="c-vowel">
							<svg class="mark" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
								<circle cx="6" cy="6" r={r.kind === 'sung' ? 4.5 : 4} class={r.kind === 'sung' ? 'mark-sung' : 'mark-placed'} />
							</svg>
							<span class="row-sym" aria-hidden="true">{r.vowel}</span>
							<span class="visually-hidden">{buttonLabel(r.vowel, r.kind, false, language)}</span>
						</th>
						<td><span class="num">{r.fR1.hzText} {hz}</span> <span class="note">{r.fR1.text}</span></td>
						<td>
							{#if r.fR2}
								<span class="num">{r.fR2.hzText} {hz}</span> <span class="note">{r.fR2.text}</span>
							{:else if r.kind === 'sung'}
								<span class="try">{t('calib.roster.tryAgain', language)}</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</details>

	<label class="hide-toggle">
		<!-- Fixed at the tap for the take's record (`takeVisible`), so the box is not live while a take runs (Step 6a). -->
		<input type="checkbox" bind:checked={hideWhileSinging} disabled={running} />
		<span>{tv('capture.hide', language)}</span>
	</label>

	{#if returnShown}
		<button type="button" class="return" onclick={onReturn}>{t('calib.capture.returnToSummary', language)}</button>
	{/if}
</div>

<style>
	.capture {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 100%;
		/* A largest width: the chart's own frame, 484 px (`chart/model.ts` `CHART_W`). In the desk Drawer the content is 484 px already (520 less 32 less
		   36), so the phone and the desk are unchanged; in the Drawer as a sheet (`max-width: 1399px`) the chart no longer fills the sheet and pushes the
		   ten buttons below the fold. Its parent centres it (`CalibrationWizard.svelte` `.wizard-phase`); the auto margins keep it centred where it does not. */
		max-width: 484px;
		margin-inline: auto;
		box-sizing: border-box;
		text-align: left;
		color: var(--ink-primary);
		font-family: var(--font-sans);
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-bottom: 2px solid var(--lavender-jewel);
		padding-bottom: 0.4rem;
	}
	.head h2 {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 1.375rem;
		font-weight: 600;
	}
	.count {
		margin: 0;
		font-size: 0.875rem;
		color: var(--ink-secondary);
	}
	.glyph-row {
		container-type: inline-size;
		display: flex;
		gap: 0.7rem;
		align-items: center;
		min-height: 4.5rem;
	}
	.glyph-circle {
		flex: none;
		width: min(6rem, 20cqw);
		height: min(6rem, 20cqw);
		box-sizing: border-box;
		border-radius: 50%;
		background: var(--lavender-wash);
		border: 2px solid var(--lavender-jewel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Lato IPA', 'Source Sans 3', sans-serif;
		font-size: min(3.25rem, 11cqw);
		line-height: 1;
	}
	.glyph {
		display: inline-block;
	}
	.glyph-words {
		flex: 1;
		min-width: 0;
	}
	.vowel-name {
		margin: 0 0 0.3rem;
		font-size: 0.9375rem;
		line-height: 1.35;
	}
	.credit {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink-secondary);
	}
	.squircle {
		flex: none;
		position: relative;
		/* The side view takes the width the row allows: about 208 px in the desk Drawer and 154 px on a 390 px phone (plan r4 section 4.4's target 220 and 155). */
		width: min(13.75rem, 43cqw);
		aspect-ratio: 1;
		box-sizing: border-box;
		border-radius: 24%;
		background: #ffffff;
		border: 2px solid var(--lavender-jewel);
		overflow: hidden;
	}
	.squircle-frame {
		position: absolute;
		inset: 6%;
	}

	.chart-box {
		position: relative;
		width: 100%;
		aspect-ratio: 484 / 280;
		background: var(--paper-light, #f5f1e8);
		border: 1.25px solid var(--ink-stave);
		box-sizing: border-box;
		overflow: hidden;
	}
	.chart-box :global(.vowel-chart) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.hidden-note {
		margin: 0;
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1.5rem;
		font-size: 0.9375rem;
		color: var(--ink-secondary);
	}
	/* The cue sits alone in its row, two lines tall at the most: a longer notice (a rolled-back take, an error) grows the row by a line. */
	.cue {
		margin: 0;
		min-height: 2.5em;
		font-family: var(--font-serif);
		font-size: 1.1875rem;
		line-height: 1.25;
	}
	.readout {
		margin-top: 0.35rem;
		display: flex;
		flex-direction: column;
		gap: 1px;
		font-size: 0.9375rem;
		line-height: 1.3;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		color: var(--ink-primary);
	}
	.readout-line {
		display: flex;
		justify-content: space-between;
	}
	.try {
		font-weight: 400;
		color: var(--ink-secondary);
	}
	.explain-first {
		margin: 0;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--ink-secondary);
	}
	.buttons {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
	}
	.vowel-btn {
		min-height: 44px;
		height: 44px;
		padding: 0;
		border-radius: 22px;
		box-sizing: border-box;
		font-family: 'Lato IPA', 'Source Sans 3', sans-serif;
		font-size: 1.125rem;
		cursor: pointer;
		background: transparent;
		color: var(--ink-primary);
		border: 1.5px solid var(--lavender-jewel);
	}
	.vowel-btn.placed {
		border-style: solid;
	}
	.vowel-btn.sung {
		background: var(--lavender-jewel);
		color: #ffffff;
	}
	.vowel-btn.selected {
		border: 2.5px solid var(--ink-primary);
	}
	.vowel-btn.selected:not(.sung) {
		background: var(--lavender-wash);
	}
	.vowel-btn:focus-visible,
	.main:focus-visible,
	.stop:focus-visible,
	.see-space:focus-visible,
	.return:focus-visible {
		outline: 2px solid var(--ink-primary);
		outline-offset: 2px;
	}
	.btn-glyph {
		display: inline-block;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.main,
	.stop,
	.see-space,
	.return {
		min-height: 44px;
		border-radius: 22px;
		font: inherit;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}
	/* One line in both languages (Step 8c.2): the label never wraps, and the row wraps as a whole where the two do not fit (320 px). The padding keeps
	   the longest French label off the button's edge. */
	.main {
		flex: 2;
		white-space: nowrap;
		padding: 0 0.9rem;
		border: none;
		background: var(--lavender-jewel);
		color: #ffffff;
	}
	.main:disabled {
		background: #9a8fa6;
		cursor: default;
	}
	.stop {
		flex: 1 0 auto;
		padding: 0 1rem;
		white-space: nowrap;
		border: 1.5px solid var(--lavender-jewel);
		background: transparent;
		color: var(--lavender-ink);
	}
	.stop:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.hint {
		margin: 0;
		min-height: 2.6rem;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--ink-secondary);
	}
	.explain {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.35;
		color: var(--ink-tertiary);
	}
	.readings summary {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 44px;
		font-size: 0.9375rem;
		cursor: pointer;
		list-style: none;
	}
	.readings summary::-webkit-details-marker {
		display: none;
	}
	/* The marker is drawn here, not by the browser: a chevron that turns when the list is open. */
	.readings summary::before {
		content: '';
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		margin: 0 0.25rem 0 0.4rem;
		border-right: 2px solid var(--lavender-ink);
		border-bottom: 2px solid var(--lavender-ink);
		transform: rotate(-45deg);
		transition: transform 0.12s ease;
	}
	.readings[open] summary::before {
		transform: rotate(45deg);
	}
	.readings summary:focus-visible {
		outline: 2px solid var(--ink-primary);
		outline-offset: 2px;
	}
	/* Hidden mode: the closed line keeps its place and is not seen or reached; the toggle below it does not move. */
	.readings.away {
		visibility: hidden;
	}
	.readings table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
		margin-bottom: 0.4rem;
	}
	.readings th,
	.readings td {
		text-align: left;
		padding: 0.18rem 0.4rem 0.18rem 0;
		border-bottom: 1px solid var(--stone-300, #d6d3d1);
		font-weight: 400;
		white-space: nowrap;
	}
	.readings thead th {
		font-weight: 600;
		border-bottom: 1.5px solid var(--lavender-jewel);
	}
	.col-unit {
		font-weight: 400;
		font-size: 0.6875rem;
		color: var(--ink-tertiary);
	}
	.c-vowel {
		width: 1%;
	}
	.mark {
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.3rem;
	}
	.mark-sung {
		fill: var(--lavender-jewel);
	}
	.mark-placed {
		fill: var(--paper-light, #f5f1e8);
		stroke: var(--lavender-jewel);
		stroke-width: 1.5;
		stroke-dasharray: 2.5 2;
	}
	.row-sym {
		display: inline-block;
		min-width: 1.1em;
		font-family: 'Lato IPA', 'Source Sans 3', sans-serif;
		font-size: 1.05rem;
	}
	.num {
		font-weight: 600;
		color: var(--ink-primary);
	}
	.note {
		color: var(--ink-secondary);
		margin-left: 0.2em;
	}
	/* A vowel not yet sung is a placeholder: the tertiary grey, with the legend's hollow dot. */
	.placed-row .num,
	.placed-row .note,
	.placed-row .row-sym {
		color: var(--ink-tertiary);
		font-weight: 400;
	}
	.hide-toggle {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 44px;
		font-size: 0.9375rem;
		cursor: pointer;
	}
	.hide-toggle input {
		width: 20px;
		height: 20px;
		margin: 0;
		accent-color: var(--lavender-jewel);
	}
	.see-space {
		padding: 0 1.1rem;
		border: 1.5px solid var(--lavender-jewel);
		background: transparent;
		color: var(--lavender-ink);
	}
	.return {
		align-self: flex-start;
		padding: 0 1.1rem;
		border: none;
		background: transparent;
		color: var(--lavender-ink);
		text-decoration: underline;
		font-weight: 400;
	}
	</style>
