<script lang="ts">
	/**
	 * Shane guided-director calibration wizard, user-facing name "Your
	 * Resonances" (the Drawer-panel surface for the Shane tab).
	 *
	 * Source of record: shane-calibration-wizard-spec_v1_2026-06-30.md,
	 * reconciled between Claude and Kimi over two review rounds, recorded in
	 * handover v27. This wraps the pacifier's locked per-vowel ritual (spec
	 * v11 §3, §4, §6, §7, §8, §11) in four phases — Welcome, Readiness,
	 * Guided capture, Profile summary — without altering that ritual; the
	 * two-tap arming, the 3-2-1 prep, the fixed 3.0 s arc, and the calm
	 * reset-sigla path all stay exactly as the Pacifier already implements
	 * them. This wizard only decides *which* vowel is current and moves
	 * focus between captures.
	 *
	 * Locked port order (spec v1 §2): (1) this wizard, built and clickable
	 * end to end against StubCaptureSession, with the readiness phase as UI
	 * and permission scaffolding only, its measurements mocked because the
	 * stub cannot supply live audio; (2) the live CaptureSession, gated on
	 * Dann's separate go; (3) polish (toast-threshold tuning, copy). Step
	 * 2's capture side landed 2026-07-02: the Pacifier below now runs
	 * against LiveCaptureSession (engine/live.ts), so vowel captures are
	 * real audio. The readiness phase's measurements remain mocked (the one
	 * remaining seam); wiring them live is the next gated step.
	 *
	 * Replaces the earlier placeholder shell (Ilya2006B fold-in), which
	 * rendered the Pacifier with a static coaching line and nothing else.
	 */
	import { tick } from 'svelte';
	import Pacifier, { SPOKEN_NAME } from '$lib/shane/pacifier/Pacifier.svelte';
	import { LiveCaptureSession } from '$lib/shane/engine/live';
	import { derive } from '$lib/shane/engine/derivations';
	import type { Vowel, VoiceType, CalibratedFormant } from '$lib/shane/engine/types';

	// ── Locked upstream (spec v1 §1, §2) ──────────────────────────────────────
	// The seven default vowels, in the spec's fixed counterclockwise order.
	// The three optional vowels are offered afterward from the summary, never
	// required (spec v1 §2 Phase 2, "the remaining two default vowels and the
	// optional three extend a bespoke profile but are not required").
	const DEFAULT_VOWELS: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u'];
	const OPTIONAL_VOWELS: Vowel[] = ['ɨ', 'ɪ', 'ʌ'];
	const ALL_VOWELS: Vowel[] = [...DEFAULT_VOWELS, ...OPTIONAL_VOWELS];
	// The confirming beat before auto-advance (spec v1 §2 Phase 2), retimed in
	// the pacing pass of 2026-07-02: the Pacifier reports a capture only after
	// its 0.9 s completion animation (COMPLETE_MS, pacifier spec v11), so this
	// hold runs concurrently with the seam rather than stacking on it —
	// 0.9 s + 1.6 s = 2.5 s total from end of voicing to advance, replacing
	// the previous 0.9 s + 2.5 s = 3.4 s stack.
	const HOLD_MS = 1600;

	type Phase = 'welcome' | 'readiness' | 'capture' | 'summary';
	type ReadinessOutcome = 'clear' | 'marginal-fry' | 'marginal-snr';
	type HoldKind = 'good' | 'provisional' | 'rolled-back';

	interface CalibrationWizardProps {
		/** Routing key to the Bozeman value-sets; undefined until a selector lands. */
		voiceType?: VoiceType;
		/**
		 * Stub-era test hook only. Forces the Readiness phase's mocked outcome
		 * so the fry-range guidance and the room-SNR toast can be exercised
		 * without real audio (the readiness phase is not yet wired to the live
		 * CaptureSession; captures are). Defaults to
		 * the clean path. This prop, and the mocked readiness timers below, are
		 * the one seam meant to be removed when the live CaptureSession lands
		 * (spec v1 §2 Phase 1).
		 */
		readinessOutcome?: ReadinessOutcome;
		/** Forwarded from the Pacifier, so a future parent can subscribe. */
		onVowelCaptured?: (vowel: Vowel, formant: CalibratedFormant) => void;
		/** Forwarded from the Pacifier, so a future parent can subscribe. */
		onProfileChange?: (formants: Partial<Record<Vowel, CalibratedFormant>>) => void;
		/**
		 * Fires once the singer taps Finish on the Profile summary (spec v1 §2
		 * Phase 3). No persistence is wired up yet (development plan Phase 2b,
		 * localStorage persistence: not started); a parent can hook this in
		 * when that lands. Until then the wizard just acknowledges completion.
		 */
		onComplete?: (formants: Partial<Record<Vowel, CalibratedFormant>>) => void;
	}

	let {
		voiceType = undefined,
		readinessOutcome = 'clear',
		onVowelCaptured,
		onProfileChange,
		onComplete
	}: CalibrationWizardProps = $props();

	let pacifierRef: ReturnType<typeof Pacifier> | undefined = $state();

	// The live auditory input (locked port order step 2, capture side). One
	// session instance for the wizard's lifetime; each capture opens and
	// releases the microphone itself, so the mic indicator rests dark
	// between vowels. Construction touches no browser API; getUserMedia is
	// requested only inside start().
	const captureSession = new LiveCaptureSession();

	let phase = $state<Phase>('welcome');
	let profile = $state<Partial<Record<Vowel, CalibratedFormant>>>({});
	let queue = $state<Vowel[]>([...DEFAULT_VOWELS]);
	let queueIndex = $state(0);
	let optionalOffered = $state(false);
	let finished = $state(false);
	let currentVowel = $derived<Vowel | undefined>(queue[queueIndex]);
	let capturedCount = $derived(Object.values(profile).filter((f) => !!f).length);

	// ── Phase 1, readiness (mocked; see readinessOutcome doc above) ──────────
	let readinessStep = $state<'quiet' | 'fry' | 'done'>('quiet');
	let fryMarginal = $state(false);
	let snrMarginal = $state(false);

	// ── Phase 2, the confirming hold (spec v1 §2 Phase 2, §3; retimed, see
	// HOLD_MS above) ──────────
	let holdActive = $state(false);
	let holdVowel = $state<Vowel | undefined>(undefined);
	let holdKind = $state<HoldKind>('good');
	let holdTimer: ReturnType<typeof setTimeout> | undefined;

	// Pause / resume (spec v1 §3). Best-effort: the Pacifier does not yet
	// surface a "mid-ritual" signal to a host component, so Pause is offered
	// whenever the wizard is not itself in the post-capture hold. A singer
	// would have to tap Pause while actively phonating to find the gap, and
	// the affordance is small and out of the way, so the risk is low. A
	// future `onStateChange` hook on the Pacifier would close this precisely.
	let paused = $state(false);

	// The room-SNR toast (spec v1 §3): once per session, no modal, self-dismissing.
	let toastVisible = $state(false);
	let toastShown = false;

	let timers: ReturnType<typeof setTimeout>[] = [];
	function after(ms: number, fn: () => void): ReturnType<typeof setTimeout> {
		const t = setTimeout(fn, ms);
		timers.push(t);
		return t;
	}
	function clearAllTimers() {
		for (const t of timers) clearTimeout(t);
		timers = [];
	}

	// ── Phase 0 → 1 ────────────────────────────────────────────────────────
	function beginReadiness() {
		phase = 'readiness';
		readinessStep = 'quiet';
		fryMarginal = false;
		snrMarginal = false;
		// Quiet second (spec v1 §2 Phase 1, step 1): the ambient noise floor,
		// the SNR baseline. Timed here but not measured; the real measurement
		// needs the live CaptureSession's getUserMedia.
		after(1000, () => {
			readinessStep = 'fry';
			// Throwaway fry (step 2): mic check, the 20-80 Hz range check, and
			// the SNR signal side. Also timed, not measured, against the stub.
			after(1200, () => {
				fryMarginal = readinessOutcome === 'marginal-fry';
				snrMarginal = readinessOutcome === 'marginal-snr';
				readinessStep = 'done';
			});
		});
	}

	// ── Phase 1 → 2 ────────────────────────────────────────────────────────
	async function beginCapture() {
		phase = 'capture';
		queue = [...DEFAULT_VOWELS];
		queueIndex = 0;
		await tick(); // let the Pacifier mount before driving it
		pacifierRef?.activateVowel(queue[0]);
		if (snrMarginal) maybeShowToast();
	}

	function maybeShowToast() {
		if (toastShown) return;
		toastShown = true;
		toastVisible = true;
		after(5000, () => {
			toastVisible = false;
		});
	}
	function dismissToast() {
		toastVisible = false;
	}

	// ── Capture-completion routing ────────────────────────────────────────
	function handleVowelCaptured(vowel: Vowel, formant: CalibratedFormant) {
		profile = { ...profile, [vowel]: formant };
		onVowelCaptured?.(vowel, formant);
		if (phase !== 'capture' || paused) return;
		beginHold(vowel, formant.reading === 'captured' ? 'good' : 'provisional');
	}

	function handleProfileChange(formants: Partial<Record<Vowel, CalibratedFormant>>) {
		profile = formants;
		onProfileChange?.(formants);
	}

	function handleRolledBack(vowel: Vowel) {
		// Spec v1 §3, the re-take rule: the previous Captured value stands and
		// the profile did not change, so there is no onVowelCaptured /
		// onProfileChange to forward. The sequence still continues.
		if (phase !== 'capture' || paused) return;
		beginHold(vowel, 'rolled-back');
	}

	function beginHold(vowel: Vowel, kind: HoldKind) {
		holdVowel = vowel;
		holdKind = kind;
		holdActive = true;
		holdTimer = after(HOLD_MS, () => {
			holdActive = false;
			holdTimer = undefined;
			advance();
		});
	}

	/**
	 * The tap-catcher's handler (spec v1 §2, the cancel-tap race fix, per
	 * Kimi's review round 2). This only exists while `holdActive` is true —
	 * the catcher element in the markup below is conditional on it — so a tap
	 * arriving after the hold has already ended, by timeout or by an explicit
	 * Continue/Re-take, never reaches this handler at all and falls straight
	 * through to the Pacifier's own tap semantics on whatever vowel it lands
	 * on. A late tap can never be mistaken for a choice about the vowel that
	 * focus has already left.
	 */
	function interruptHold() {
		if (!holdActive || !holdTimer) return;
		clearTimeout(holdTimer);
		holdTimer = undefined;
		// Stop the clock only. The Continue / Re-take choice was already
		// visible for the whole hold, so an interrupting tap just leaves it
		// up for an explicit decision instead of letting it auto-resolve.
	}

	function holdContinue() {
		if (holdTimer) clearTimeout(holdTimer);
		holdTimer = undefined;
		holdActive = false;
		advance();
	}

	function holdRetake() {
		if (holdTimer) clearTimeout(holdTimer);
		holdTimer = undefined;
		holdActive = false;
		const g = holdVowel;
		holdVowel = undefined;
		// Hands back cleanly to the Pacifier's own tap-to-arm-a-re-take (spec
		// v11 §7.1): arming here is the first of that ritual's two taps.
		if (g) pacifierRef?.activateVowel(g);
	}

	function advance() {
		holdVowel = undefined;
		queueIndex += 1;
		if (queueIndex >= queue.length) {
			phase = 'summary';
			return;
		}
		pacifierRef?.activateVowel(queue[queueIndex]);
	}

	async function addOptionalVowels() {
		optionalOffered = true;
		queue = [...DEFAULT_VOWELS, ...OPTIONAL_VOWELS];
		queueIndex = DEFAULT_VOWELS.length; // resume right where the default set ended
		phase = 'capture';
		await tick();
		pacifierRef?.activateVowel(queue[queueIndex]);
	}

	async function retakeFromSummary(vowel: Vowel) {
		// Re-enter the guided flow for this one vowel; the queue becomes a
		// single-item pass, so the ritual (and the post-capture hold) still
		// applies, and finishing it returns to the summary via the normal
		// advance path.
		queue = [vowel];
		queueIndex = 0;
		phase = 'capture';
		await tick();
		pacifierRef?.activateVowel(vowel);
	}

	function togglePause() {
		paused = !paused;
	}

	function finish() {
		onComplete?.(profile);
		finished = true;
	}

	function readingLabel(reading: CalibratedFormant['reading'] | undefined): string {
		switch (reading) {
			case 'captured':
				return 'Captured';
			case 'provisional':
				return 'Provisional';
			case 'estimated':
				return 'Estimated';
			default:
				return 'Not yet sampled';
		}
	}

	// ── Working values in the summary (Dann, 2026-07-02) ────────────────────
	// An interim confirmation surface ahead of the output-page legend design:
	// each row publishes the working fR1/fR2 so the singer sees what was
	// received. For the three optional vowels, an unsampled row shows the
	// engine's derived value (reading: Estimated), greyed, computed by the
	// same derive() the analysis layer uses — display-only, single source of
	// formulae (Mitton 2020 §5.3.3; the formulae themselves are never shown),
	// and the stored profile keeps only what was actually sung.

	/** The anchors each derivable optional vowel needs (derivations.ts). */
	const DERIVE_ANCHORS: Partial<Record<Vowel, Vowel[]>> = {
		ɨ: ['i', 'u'],
		ɪ: ['e', 'i'],
		ʌ: ['ɑ', 'ɛ']
	};

	/** Usable as a derivation anchor: sampled, not Provisional, both formants present. */
	function usableAnchor(f: CalibratedFormant | undefined): f is CalibratedFormant & { f2: number } {
		return !!f && f.reading !== 'provisional' && typeof f.f2 === 'number';
	}

	/** The row's display value: the direct sample, or a derived preview for optional vowels. */
	function displayFormant(g: Vowel): CalibratedFormant | undefined {
		const direct = profile[g];
		if (direct) return direct;
		const need = DERIVE_ANCHORS[g];
		if (!need) return undefined;
		const cap: Record<string, { f1: number; f2: number }> = {};
		for (const a of need) {
			const f = profile[a];
			if (!usableAnchor(f)) return undefined;
			cap[a] = { f1: f.f1, f2: f.f2 };
		}
		return derive(g, cap) ?? undefined;
	}

	function valueLabel(f: CalibratedFormant): string {
		const f1 = `fR1 ${Math.round(f.f1)} Hz`;
		return typeof f.f2 === 'number' ? `${f1} · fR2 ${Math.round(f.f2)} Hz` : f1;
	}

	$effect(() => () => clearAllTimers());
</script>

<!--
	Vowel label: the IPA glyph followed by its informal name (Dann, 2026-07-01,
	e.g. "[i] cardinal-i"). The glyph is aria-hidden, matching the discipline
	behind the aria-label speakable-name fix shipped last night: a raw IPA
	glyph read aloud by a screen reader still collapses [ɪ]/[ɨ] onto "ee," so
	only the informal name is announced. Sighted users see both.
-->
{#snippet vowelTag(g: Vowel)}<span class="ipa-tag" aria-hidden="true">[{g}]</span
	>{SPOKEN_NAME[g]}{/snippet}

<section class="calibration-wizard" aria-label="Your Resonances: voice calibration">
	{#if phase === 'welcome'}
		<div class="wizard-phase">
			<h2 id="wizard-title">Finding Your Resonances</h2>
			<!-- Phase 0 onboarding copy, Dann's draft (2026-07-01), closing the
			     placeholder flagged in wizard spec v1 §5 / pacifier spec v11 §15. -->
			<p class="wizard-lede">
				Shane will measure your voice to build a formant profile, which is a map of your voice's
				resonances that will be applied to the repertoire to determine fit. Follow the prompts.
				This wizard assumes you read IPA. Your device needs a working mic and you should be in a
				quiet space for the best capture of your resonances.
			</p>
			<details class="wizard-expander">
				<summary>What is vocal fry?</summary>
				<!-- Placeholder: the newcomer fry-description copy is deferred
				     (wizard spec v1 §5; pacifier spec v11 §17). Ground in Titze
				     1988 and Roubeau et al. 2009 when drafted. -->
				<p>
					A low, creaky voice register, easy to sustain and gentle on the voice. Shane reads its
					resonances rather than your sung pitch, so comfort matters more than pitch here.
				</p>
			</details>
			<button type="button" class="wizard-primary" onclick={beginReadiness}>Begin</button>
		</div>
	{:else if phase === 'readiness'}
		<div class="wizard-phase" aria-live="polite">
			<h2 id="wizard-title">Getting ready</h2>
			{#if readinessStep === 'quiet'}
				<p class="wizard-lede">Listening for quiet. Stay silent for a moment.</p>
			{:else if readinessStep === 'fry'}
				<p class="wizard-lede">Now a throwaway fry, just to check the mic hears you.</p>
			{:else}
				<p class="wizard-lede">Readiness check complete.</p>
				{#if fryMarginal}
					<p class="wizard-guidance">
						Your fry is reading near the edge of our range; a little lower or higher may read
						cleaner.
					</p>
				{/if}
				<button type="button" class="wizard-primary" onclick={beginCapture}>Continue</button>
			{/if}
		</div>
	{:else if phase === 'capture'}
		<div class="wizard-phase">
			<div class="wizard-progress" role="status" aria-live="polite">
				{#if currentVowel}
					Vowel {queueIndex + 1} of {queue.length} — {@render vowelTag(currentVowel!)}
				{:else}
					All set.
				{/if}
			</div>
			{#if currentVowel}
				<p class="wizard-cue">
					Tap the {@render vowelTag(currentVowel!)} vowel to arm it, tap again to begin.
				</p>
			{/if}
			<div class="wizard-pacifier-wrap">
				<Pacifier
					bind:this={pacifierRef}
					session={captureSession}
					{voiceType}
					initialFormants={profile}
					onVowelCaptured={handleVowelCaptured}
					onProfileChange={handleProfileChange}
					onRetakeRolledBack={handleRolledBack}
				/>
				{#if paused}
					<div class="wizard-catcher" role="presentation"></div>
				{/if}
				{#if holdActive}
					<div class="wizard-catcher" role="presentation" onpointerdown={interruptHold}></div>
				{/if}
			</div>
			{#if paused}
				<div class="wizard-inline-banner">
					<p>Paused. Resume when you're ready.</p>
					<button type="button" class="wizard-primary" onclick={togglePause}>Resume</button>
				</div>
			{:else if holdActive && holdVowel}
				<div class="wizard-inline-banner" role="status" aria-live="polite">
					<p>
						{#if holdKind === 'good'}
							{@render vowelTag(holdVowel!)}, captured.
						{:else if holdKind === 'rolled-back'}
							New sample was less certain, so the previous one was kept.
						{:else}
							Noted, moving on. You can re-take it from the summary.
						{/if}
					</p>
					<div class="wizard-hold-actions">
						<button type="button" onclick={holdContinue}>Continue</button>
						<button type="button" onclick={holdRetake}>Re-take</button>
					</div>
				</div>
			{:else if currentVowel}
				<button type="button" class="wizard-pause" onclick={togglePause}>Pause</button>
			{/if}
			{#if toastVisible}
				<div class="wizard-toast" role="status">
					<p>
						The room sounds a little lively. Your sample is still good, but a quieter space would
						help.
					</p>
					<button type="button" class="wizard-toast-dismiss" onclick={dismissToast} aria-label="Dismiss"
						>×</button
					>
				</div>
			{/if}
		</div>
	{:else if phase === 'summary'}
		<div class="wizard-phase">
			<h2 id="wizard-title">Profile summary</h2>
			{#if finished}
				<p class="wizard-lede">
					Saved for this session. Profile persistence is a later build (development plan Phase
					2b), so this won't survive a reload yet.
				</p>
			{:else}
				<p class="wizard-lede">
					{capturedCount} of {ALL_VOWELS.length} vowels sampled. Review each reading and re-take
					anything uncertain before you finish.
				</p>
				<ul class="wizard-summary-list">
					{#each ALL_VOWELS as g (g)}
						{@const direct = profile[g]}
						{@const f = displayFormant(g)}
						<li class="wizard-summary-row" class:is-muted={!direct && OPTIONAL_VOWELS.includes(g)}>
							<span class="wizard-summary-vowel">{@render vowelTag(g)}</span>
							{#if f}
								<span class="wizard-summary-values">{valueLabel(f)}</span>
							{/if}
							<span class="wizard-summary-reading" class:is-provisional={f?.reading === 'provisional'}>
								{readingLabel(f?.reading)}
							</span>
							{#if direct}
								<button type="button" onclick={() => retakeFromSummary(g)}>Re-take</button>
							{/if}
						</li>
					{/each}
				</ul>
				{#if !optionalOffered}
					<button type="button" class="wizard-secondary" onclick={addOptionalVowels}>
						Experienced singers can provide direct samples for the three optional vowels.
					</button>
				{/if}
				<button type="button" class="wizard-primary" onclick={finish}>Finish</button>
			{/if}
		</div>
	{/if}
</section>

<style>
	.calibration-wizard {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
	}

	.wizard-phase {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.875rem;
		width: 100%;
		max-width: 32rem;
	}

	.ipa-tag {
		font-family: 'Lato IPA', sans-serif;
		opacity: 0.7;
		margin-right: 0.3em;
	}

	.wizard-phase h2 {
		margin: 0;
		font-family: var(--font-serif);
		color: var(--ink-primary);
		font-size: 1.375rem;
		font-weight: 600;
		text-align: center;
	}

	.wizard-lede,
	.wizard-guidance {
		margin: 0;
		max-width: 30rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.9375rem;
		line-height: 1.5;
		text-align: center;
		color: var(--ink-secondary);
	}

	.wizard-guidance {
		color: var(--prep-amber);
	}

	.wizard-expander {
		width: 100%;
		max-width: 26rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		color: var(--ink-secondary);
	}
	.wizard-expander summary {
		cursor: pointer;
		color: var(--ink-secondary);
		font-weight: 600;
	}
	.wizard-expander p {
		margin: 0.5rem 0 0;
		color: var(--ink-tertiary);
		line-height: 1.5;
	}

	.wizard-primary,
	.wizard-secondary {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.9375rem;
		font-weight: 600;
		border-radius: 999px;
		padding: 0.625rem 1.5rem;
		cursor: pointer;
		border: 1px solid transparent;
	}
	.wizard-primary {
		background: var(--sage);
		color: #ffffff;
	}
	.wizard-primary:hover {
		background: var(--deeper-sage);
	}
	.wizard-secondary {
		background: transparent;
		color: var(--ink-secondary);
		border-color: var(--stone-300);
	}
	.wizard-secondary:hover {
		border-color: var(--sage);
		color: var(--sage);
	}

	.wizard-progress {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		letter-spacing: 0.02em;
		color: var(--ink-tertiary);
		text-transform: uppercase;
	}
	.wizard-cue {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.9375rem;
		color: var(--ink-secondary);
		text-align: center;
	}

	.wizard-pacifier-wrap {
		position: relative;
		width: 100%;
	}
	.wizard-catcher {
		position: absolute;
		inset: 0;
		z-index: 2;
		cursor: default;
	}

	.wizard-inline-banner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		background: var(--drawer-bg);
		border: 1px solid var(--stone-300);
		width: 100%;
		max-width: 26rem;
	}
	.wizard-inline-banner p {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		color: var(--ink-secondary);
		text-align: center;
	}
	.wizard-hold-actions {
		display: flex;
		gap: 0.5rem;
	}
	.wizard-hold-actions button {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.375rem 0.875rem;
		border-radius: 999px;
		border: 1px solid var(--stone-300);
		background: #ffffff;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.wizard-hold-actions button:hover {
		border-color: var(--sage);
		color: var(--sage);
	}

	.wizard-pause {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-tertiary);
		background: transparent;
		border: none;
		text-decoration: underline;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
	}

	.wizard-toast {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.875rem;
		border-radius: 0.75rem;
		background: var(--drawer-bg);
		border: 1px solid var(--prep-amber);
		max-width: 26rem;
	}
	.wizard-toast p {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-secondary);
		line-height: 1.4;
	}
	.wizard-toast-dismiss {
		background: none;
		border: none;
		color: var(--ink-tertiary);
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.125rem 0.375rem;
	}

	.wizard-summary-list {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 26rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.wizard-summary-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		background: var(--drawer-bg);
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
	}
	.wizard-summary-vowel {
		color: var(--ink-primary);
		font-weight: 600;
		flex: 1;
	}
	.wizard-summary-values {
		color: var(--ink-secondary);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.wizard-summary-reading {
		color: var(--ink-tertiary);
	}
	/* The three optional vowels rest greyed until sampled directly; their
	   derived preview reads as quieter than a sung capture (Dann, 2026-07-02). */
	.wizard-summary-row.is-muted {
		opacity: 0.6;
	}
	.wizard-summary-reading.is-provisional {
		color: var(--signal-red);
	}
	.wizard-summary-row button {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--stone-300);
		background: #ffffff;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.wizard-summary-row button:hover {
		border-color: var(--sage);
		color: var(--sage);
	}
</style>
