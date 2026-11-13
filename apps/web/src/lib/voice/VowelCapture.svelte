<!--
	THE CAPTURE SCREEN (N.199 Step 4b; brief r5 section 1). One vowel at a time: the symbol in a circle with its spoken name, the
	chart of the vowel space, the cue line and the readout, the progress of the take, ten buttons in Grayson's order, the hint, Start and
	Stop, the toggle that hides the chart and the numbers while singing, and the way back to the summary. It replaces the wheel
	(`pacifier/Pacifier.svelte`) behind `?calibrate=new`; the wheel stays the default until the new screen has been walked (Step 8).

	WHAT IT OWNS: the selection, the idle notice, the Clear-all confirmation, the toggle. WHAT IT DOES NOT: the profile, which is the
	wizard's and arrives as `profile`; a captured reading goes back to the wizard through `onCaptured`, which runs the guard, persists,
	and returns the profile with the reading in it, so the dot lands from the same stored values the summary reads. The take itself
	is `capture-ritual.svelte.ts`. Capture shows no verdict: a dot is drawn wherever it falls, the summary asks about it.

	Width: 484 px in the Drawer on desktop, the phone's width on a phone. One component; the chart takes the width it is given. The
	chart, the cue line, and the buttons sit in one sticky group, so they stay in view together during a take when the takeover scrolls.
	Words: the draft English in `chart/draft-strings.ts` and the tree's own keys (`t()`); never invented here.
-->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { CaptureSession } from './engine/session';
	import type { CaptureError } from './engine/errors';
	import type { CalibratedFormant, Vowel } from './engine/types';
	import { VOWELS } from './engine/types';
	import { createCaptureRitual, type RitualCue } from './capture-ritual.svelte';
	import { spokenName } from './vowel-names';
	import FrSym from './FrSym.svelte';
	import VowelChart from './chart/VowelChart.svelte';
	import { buildChartModel } from './chart/model';
	import { nextVowel } from './chart/tour';
	import { ds } from './chart/draft-strings';
	import {
		GLYPH_NUDGE, bracket, buttonLabel, buttonStates, cueText, firstTimeExplanation, hintText, hintsFor, idleCue, mainButton, staysAfterTake, stopLabel
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
		onReturn,
		onClearAll
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
		/** Leave for the summary. */
		onReturn: () => void;
		/** The second tap of Start over: the wizard clears this voice's readings. */
		onClearAll: () => void;
	} = $props();

	// ── State ───────────────────────────────────────────────────────────────
	let selected = $state<Vowel>(untrack(() => startVowel));
	/** Where the selection moves when the landing is over: it does not change under the dot that is landing. */
	let pendingSelected = $state<Vowel | null>(null);
	let notice = $state<RitualCue | null>(null);
	let confirmingClear = $state(false);
	let hideWhileSinging = $state(false);
	/** Whether a take has begun on this screen: the first-time explanation shows until one has. */
	let tookAny = $state(false);
	/** A pass ended with the last capture: return to the summary when the landing is over. */
	let returnWhenIdle = $state(false);
	let reducedMotion = $state(false);

	const sungSet = $derived(new Set(VOWELS.filter((v) => profile[v] && profile[v]!.reading !== 'estimated' && profile[v]!.f1 > 0)));
	const model = $derived(buildChartModel(profile, voiceType));

	const ritual = createCaptureRitual({
		// The session is the wizard's for the life of this screen; it is read once.
		session: untrack(() => session),
		voiceType: () => voiceType,
		previous: (v) => profile[v],
		reducedMotion: () => reducedMotion,
		onCaptured: (v, f) => {
			onCaptured(v, f);
			keepNotice();
			advanceFrom(v);
		},
		onRolledBack: (v, f) => {
			onRolledBack?.(v, f);
			keepNotice();
			advanceFrom(v);
		},
		onFailed: (v, e) => {
			onFailed?.(v, e);
			keepNotice();
		}
	});

	/** The ritual has just set its cue for the take that ended: keep it on the screen if the singer needs to read it, else let the invitation take over. */
	function keepNotice() {
		notice = staysAfterTake(ritual.cue.key) ? ritual.cue : null;
	}

	/** After a take that ended with a reading: carry on from the vowel just sung, and wait. Nothing starts by itself. */
	function advanceFrom(v: Vowel) {
		const after = new Set<Vowel>([...sungSet, v]);
		const next = nextVowel(after, v, pass);
		if (next !== null) pendingSelected = next;
		else if (pass) returnWhenIdle = true;
		// all ten sung, no pass: the screen rests where it is
	}

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const change = () => (reducedMotion = mq.matches);
		mq.addEventListener('change', change);
		return () => {
			mq.removeEventListener('change', change);
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
	const hint = $derived(hintText(hintsFor({ active, confirmingClear, selected, sung: sungSet, voiceType })));
	const main = $derived(mainButton(running, sungSet, selected));
	const showExplain = $derived(!tookAny && sungSet.size === 0);
	/** The vowel the chart and the readout are about: the take's, while one is running or landing; else the selection. */
	const subject = $derived(ritual.vowel ?? selected);
	const reading = $derived(profile[subject]);
	const showReading = $derived((ritual.phase === 'idle' || ritual.phase === 'landing') && !!reading);
	const hz = $derived(t('calib.common.hz', language));

	// ── Gestures ───────────────────────────────────────────────────────────
	function startTake(v: Vowel) {
		notice = null;
		confirmingClear = false;
		tookAny = true;
		ritual.begin(v);
	}
	function tapVowel(v: Vowel) {
		if (ritual.phase !== 'idle') {
			// A second tap on the vowel in progress ends the take; a tap on any other vowel is ignored.
			if (v === ritual.vowel) ritual.cancel();
			return;
		}
		selected = v;
		startTake(v); // a tapped vowel starts at once and takes precedence
	}
	function pressMain() {
		if (main.kind === 'done') return onReturn();
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
	const returnShown = $derived(ritual.phase === 'idle' && sungSet.size >= 1);
	const stopDisabled = $derived(!active && (running || sungSet.size === 0));
</script>

<svelte:window onkeydown={onKeydown} />

<div class="capture">
	<!-- The cue, spoken: the vowel by its name, never the bare glyph (§4.6). The eye reads the bracketed symbol below. -->
	<p class="visually-hidden" role="status" aria-live="polite">{cue.ear}</p>

	<header class="head">
		<h2>{ds('capture.title')}</h2>
		<p class="count">{ds('capture.count', { n: sungSet.size })}</p>
	</header>

	<div class="glyph-row">
		<div class="glyph-circle" aria-hidden="true">
			<span class="glyph" style="transform: translate({GLYPH_NUDGE[selected][0]}em, {GLYPH_NUDGE[selected][1]}em)">{selected}</span>
		</div>
		<div class="glyph-words">
			<p class="vowel-name">{spokenName(selected, language)}</p>
		</div>
	</div>

	<div class="stage">
		<div class="chart-box">
			{#if hiding}
				<p class="hidden-note">{ds('capture.hidden')}</p>
			{:else}
				<VowelChart {model} view={model.full} active={running ? subject : null} />
			{/if}
		</div>
		<div
			class="bar"
			role="progressbar"
			aria-label={ds('capture.bar')}
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow={Math.round(ritual.progress * 100)}
		>
			<div class="bar-fill" style="width: {Math.round(ritual.progress * 100)}%"></div>
		</div>
		<div class="cue-row">
			<p class="cue" aria-hidden="true">{cue.eye}</p>
			<div class="readout" aria-hidden="true">
				{#if showReading && reading && !hiding}
					<div class="readout-line"><FrSym n={1} /><span>{Math.round(reading.f1)} {hz}</span></div>
					<div class="readout-line">
						<FrSym n={2} />
						{#if typeof reading.f2 === 'number'}<span>{Math.round(reading.f2)} {hz}</span>{:else}<span class="try">{t('calib.roster.tryAgain', language)}</span>{/if}
					</div>
				{/if}
			</div>
		</div>
		{#if showExplain}
			<p class="explain-first">{firstTimeExplanation(selected, language)}</p>
		{/if}

		<div class="buttons" role="group" aria-label={ds('capture.vowels')}>
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
	</div>

	<p class="hint">{hint}</p>
	<p class="explain">{ds('capture.explain')}</p>

	<label class="hide-toggle">
		<input type="checkbox" bind:checked={hideWhileSinging} />
		<span>{ds('capture.hide')}</span>
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
		display: flex;
		gap: 0.9rem;
		align-items: center;
		min-height: 6rem;
	}
	.glyph-circle {
		flex: none;
		width: 6rem;
		height: 6rem;
		box-sizing: border-box;
		border-radius: 50%;
		background: var(--lavender-wash);
		border: 2px solid var(--lavender-jewel);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Lato IPA', 'Source Sans 3', sans-serif;
		font-size: 3.25rem;
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
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.35;
	}

	/* The group that stays in view together during a take when the takeover scrolls: chart, bar, cue, buttons, Start and Stop. */
	.stage {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 0.35rem 0 0.5rem;
		background: var(--drawer-bg, #faf8f5);
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
	.bar {
		height: 8px;
		border-radius: 4px;
		background: var(--lavender-desk);
		overflow: hidden;
	}
	.bar-fill {
		height: 8px;
		background: var(--lavender-jewel);
		transition: width 0.06s linear;
	}
	.cue-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-height: 2.9rem;
	}
	.cue {
		margin: 0;
		flex: 1;
		font-family: var(--font-serif);
		font-size: 1.1875rem;
		line-height: 1.25;
	}
	.readout {
		flex: none;
		width: 8rem;
		display: flex;
		flex-direction: column;
		gap: 1px;
		font-size: 1rem;
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
	.return:focus-visible {
		outline: 2px solid var(--ink-primary);
		outline-offset: 2px;
	}
	.btn-glyph {
		display: inline-block;
	}
	.actions {
		display: flex;
		gap: 0.6rem;
	}
	.main,
	.stop,
	.return {
		min-height: 44px;
		border-radius: 22px;
		font: inherit;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}
	.main {
		flex: 2;
		border: none;
		background: var(--lavender-jewel);
		color: #ffffff;
	}
	.main:disabled {
		background: #9a8fa6;
		cursor: default;
	}
	.stop {
		flex: 1;
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
	.return {
		align-self: flex-start;
		padding: 0 1.1rem;
		border: none;
		background: transparent;
		color: var(--lavender-ink);
		text-decoration: underline;
		font-weight: 400;
	}
	@media (prefers-reduced-motion: reduce) {
		.bar-fill {
			transition: none;
		}
	}
</style>
