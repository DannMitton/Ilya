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
	 * Persistence (development plan Phase 2b) landed 2026-07-11 on Kimi's
	 * gate, and widened the same session to multiple named voices
	 * (Claude-Kimi-Dann consensus; see profileStore.ts and
	 * ProfileSwitcher.svelte for the full consensus record). The switcher
	 * heads the drawer; the active voice's readings hydrate this wizard,
	 * saving on every change; first launch asks for a name before the
	 * Welcome phase; Start over clears the active voice's readings only.
	 *
	 * Replaces the earlier placeholder shell (Ilya2006B fold-in), which
	 * rendered the Pacifier with a static coaching line and nothing else.
	 */
	import { tick } from 'svelte';
	import Pacifier, { SPOKEN_NAME } from '$lib/shane/pacifier/Pacifier.svelte';
	import ProfileSwitcher from '$lib/shane/ProfileSwitcher.svelte';
	import { LiveCaptureSession } from '$lib/shane/engine/live';
	import { derive } from '$lib/shane/engine/derivations';
	import { applyIghDivergence } from '$lib/shane/engine/divergence';
	import {
		loadStore,
		saveStore,
		newVoiceId,
		type ProfileStore,
		type StoredVoice
	} from '$lib/shane/profileStore';
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

	// The default-name base ("Voice 1", "Voice 2", …), Kimi's ruling:
	// domain-appropriate, scales to variants and guests without special
	// pleading. French mode ("Voix N") lands with the calibration-UI French
	// pass (standing open item).
	const DEFAULT_NAME_BASE = 'Voice';

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
		 * Phase 3). The profile persists to device storage continuously
		 * (profileStore.ts), so this hook is for a parent that wants the
		 * completion moment itself (the future profile-ready main-pane state,
		 * Kimi-gated behind persistence, which is now real).
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

	// ── The voice store (Phase 2b v2, multiple named voices, 2026-07-11) ─────
	// One read at construction; a v1 single profile migrates transparently
	// to become the first named voice. All mutations flow through the
	// functions below and save the whole store, failure-silent.
	let store = $state<ProfileStore>(loadStore(`${DEFAULT_NAME_BASE} 1`));
	let activeVoice = $derived(store.voices.find((v) => v.id === store.activeId));
	// The smallest unused sequential default, so deletions never cause
	// name collisions ("Voice 2" existing skips to "Voice 3").
	let nextDefaultName = $derived.by(() => {
		const names = new Set(store.voices.map((v) => v.name));
		let n = store.voices.length + 1;
		while (names.has(`${DEFAULT_NAME_BASE} ${n}`)) n += 1;
		return `${DEFAULT_NAME_BASE} ${n}`;
	});

	function hasAnyReadings(f: Partial<Record<Vowel, CalibratedFormant>>): boolean {
		return Object.keys(f).length > 0;
	}

	/**
	 * The profile-level [ɨ] divergence pass, wired 2026-07-11 (it existed in
	 * divergence.ts since the batch core landed but was called by nothing, so
	 * a directly sampled [ɨ] skipped the check entirely — the standing
	 * correctness gap). Engine spec §7, relocation Option A: a sampled [ɨ] is
	 * checked against the expectation built from the singer's own [i] and
	 * [u]; divergence, or a missing/Provisional anchor, resolves [ɨ] to
	 * Provisional (Dann's locked anchor rule). Runs on every profile
	 * mutation; a no-op unless a direct [ɨ] sample exists. The pass mutates,
	 * so it runs on a clone, and the internal isDivergent flag is stripped —
	 * the §9 boundary keeps that flag internal, and the resolved reading is
	 * the whole outcome the UI and the store need.
	 *
	 * Known seam, recorded: if the pass downgrades a just-captured [ɨ]
	 * mid-flow, the roster shows Provisional immediately but the Pacifier's
	 * node keeps its ✓ until the capture phase next remounts (the locked
	 * component owns its node state; reconciling live would need a new hook,
	 * not added unreviewed).
	 */
	function withIghPass(
		map: Partial<Record<Vowel, CalibratedFormant>>
	): Partial<Record<Vowel, CalibratedFormant>> {
		const igh = map['ɨ'];
		if (!igh) return map;
		const clone = { ...map, ɨ: { ...igh } };
		applyIghDivergence(clone);
		delete (clone['ɨ'] as { isDivergent?: boolean | null }).isDivergent;
		return clone;
	}

	// Hydration: the active voice's readings become the working profile; a
	// voice with readings reopens at the summary (the workshop, per Kimi's
	// division of labour), a fresh one at Welcome. With no voices at all,
	// the switcher renders the first-launch naming and the phases wait.
	// svelte-ignore state_referenced_locally
	const initialFormants = store.voices.find((v) => v.id === store.activeId)?.formants ?? {};
	let profile = $state<Partial<Record<Vowel, CalibratedFormant>>>({ ...initialFormants });
	let phase = $state<Phase>(hasAnyReadings(initialFormants) ? 'summary' : 'welcome');

	let queue = $state<Vowel[]>([...DEFAULT_VOWELS]);
	let queueIndex = $state(0);
	let optionalOffered = $state(false);
	let finished = $state(false);
	let currentVowel = $derived<Vowel | undefined>(queue[queueIndex]);
	let capturedCount = $derived(Object.values(profile).filter((f) => !!f).length);
	// The optional-vowels invitation waits for a complete default set
	// (Dann, 2026-07-10): it must not appear when the summary is reached
	// early by any path (a single-vowel re-take pass, or a queue bug).
	let defaultsComplete = $derived(DEFAULT_VOWELS.every((g) => !!profile[g]));

	function persistStore() {
		saveStore($state.snapshot(store) as ProfileStore);
	}
	/** Write the working profile into the active voice and save (failure-silent). */
	function persist() {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (!v) return;
		v.formants = $state.snapshot(profile) as Partial<Record<Vowel, CalibratedFormant>>;
		v.updatedAt = new Date().toISOString();
		persistStore();
	}

	// ── Voice management (consensus, 2026-07-11) ─────────────────────────────
	/** Interrupt everything transient and land on the given phase. */
	function resetFlow(to: Phase) {
		clearAllTimers();
		holdTimer = undefined;
		holdActive = false;
		holdVowel = undefined;
		paused = false;
		confirmingReset = false;
		toastVisible = false;
		queue = [...DEFAULT_VOWELS];
		queueIndex = 0;
		optionalOffered = false;
		finished = false;
		phase = to;
	}

	function createVoice(name: string, fromFormants?: Partial<Record<Vowel, CalibratedFormant>>) {
		const now = new Date().toISOString();
		const v: StoredVoice = {
			id: newVoiceId(),
			name,
			createdAt: now,
			updatedAt: now,
			formants: fromFormants ?? {}
		};
		store.voices.push(v);
		store.activeId = v.id;
		profile = { ...v.formants };
		resetFlow(hasAnyReadings(profile) ? 'summary' : 'welcome');
		persistStore();
	}

	function duplicateActiveVoice(name: string) {
		// A duplicate serves Dann's cases 2 and 3: a style variant you re-take
		// a few vowels on, or a progress snapshot you leave alone.
		createVoice(name, $state.snapshot(profile) as Partial<Record<Vowel, CalibratedFormant>>);
	}

	function selectVoice(id: string) {
		if (id === store.activeId) return;
		const v = store.voices.find((x) => x.id === id);
		if (!v) return;
		store.activeId = id;
		profile = { ...v.formants };
		resetFlow(hasAnyReadings(profile) ? 'summary' : 'welcome');
		persistStore();
	}

	function renameActiveVoice(name: string) {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (!v) return;
		v.name = name;
		persistStore();
	}

	function deleteActiveVoice() {
		// Only reachable when more than one voice exists (the switcher hides
		// Delete when solo; Start over covers the solo case).
		if (store.voices.length <= 1) return;
		const idx = store.voices.findIndex((v) => v.id === store.activeId);
		if (idx === -1) return;
		store.voices.splice(idx, 1);
		const next = store.voices[0];
		store.activeId = next.id;
		profile = { ...next.formants };
		resetFlow(hasAnyReadings(profile) ? 'summary' : 'welcome');
		persistStore();
	}

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

	// ── The resonance roster (Dann's direction, 2026-07-10) ──────────────────
	// One table, both surfaces: all ten vowels accounted for from the start,
	// in the canonical order, greyed until a value lands. Columns: vowel
	// (with the reading word beneath, amber for Provisional), fR1, fR2 (and
	// Re-take in the summary). This supersedes the same-day Claude-Kimi
	// consensus's grow-as-you-capture log, fixed-height container, and
	// scroll-to-newest machinery — a static roster is inherently
	// layout-stable, which honours the ruling those mechanisms served. The
	// unified table also supersedes the summary's earlier red Provisional
	// colouring in favour of the locked calibration amber. An empty fR2 cell
	// on a sampled vowel reads "Try again" (Dann's corrective-as-invitation
	// copy register): the missing second resonance names its next action,
	// not a deficiency. To be recorded in the Kimi file.
	//
	// Typography (Dann, 2026-07-10, per international mathematical-notation
	// convention): the resonance symbol is an italic f (a variable) with an
	// upright roman subscript (a label, not a product of variables), set as
	// a true subscript slightly smaller than the base — see the frSym
	// snippet. One source in the code; the convention extends across Shane
	// and Ilya as other surfaces are touched.
	let logAnnounce = $state('');
	// The hold banner's announcement text; delivered through a persistent
	// hidden live region (see beginHold and Kimi's review, 2026-07-11).
	let holdAnnounce = $state('');

	// Start over (Phase 2b): clearing a voice's captures deserves one
	// deliberate confirmation, phrased as a question naming the action,
	// never a verdict. It clears readings only; the voice keeps its name.
	let confirmingReset = $state(false);

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
		// A fired timer prunes itself from the list (Kimi's review polish),
		// so repeated phase entries never accumulate stale ids.
		const t = setTimeout(() => {
			timers = timers.filter((x) => x !== t);
			fn();
		}, ms);
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
	// Bug fix (Dann's report, 2026-07-10): the queue previously advanced on
	// ANY completed capture, without checking which vowel had completed. An
	// out-of-turn capture (re-taking an earlier vowel mid-flow through the
	// Pacifier's own two-tap ritual) therefore burned one of the remaining
	// queue slots per completion, and enough of them exhausted the queue and
	// opened the summary after only four unique vowels. Now: every capture
	// updates the profile and the roster, but only a capture of the vowel
	// the tour is waiting on holds and advances; an out-of-turn capture
	// hands focus straight back to the current vowel.
	function handleVowelCaptured(vowel: Vowel, formant: CalibratedFormant) {
		profile = withIghPass({ ...profile, [vowel]: formant });
		persist();
		// The hold and the announcement use the post-pass reading: a divergent
		// [ɨ] that the pass resolved to Provisional must not be celebrated as
		// captured (no capture-time modal, per the locked decision — the
		// ordinary provisional hold wording carries it).
		const effective = profile[vowel] ?? formant;
		// The polite data delivery (Kimi, 2026-07-10): the hold banner is the
		// confirmation, this is the number's first availability to non-visual
		// users. Speakable name, never the raw glyph (§4.6 discipline).
		logAnnounce = `Added to progress: ${SPOKEN_NAME[vowel]}, ${Math.round(effective.f1)} hertz, ${readingLabel(effective.reading)}.`;
		onVowelCaptured?.(vowel, effective);
		if (phase !== 'capture' || paused) return;
		if (vowel === currentVowel) {
			beginHold(vowel, effective.reading === 'captured' ? 'good' : 'provisional');
		} else if (currentVowel) {
			// Out of turn: the roster took the value; the tour stays put.
			pacifierRef?.activateVowel(currentVowel);
		}
	}

	function handleProfileChange(formants: Partial<Record<Vowel, CalibratedFormant>>) {
		// The Pacifier now receives the merged map (sung plus derived
		// previews, for the ≈ badge) and reports its full map back, so
		// estimated entries must be stripped here or synthetic values would
		// leak into the stored profile — the only-sung-is-stored rule
		// (Mitton 2020 §5.3.3 discipline) enforced at the boundary.
		const direct: Partial<Record<Vowel, CalibratedFormant>> = {};
		for (const [g, f] of Object.entries(formants) as [Vowel, CalibratedFormant][]) {
			if (f && f.reading !== 'estimated') direct[g] = f;
		}
		// The [ɨ] pass runs here too: a long-press skip can remove an anchor,
		// which must resolve a sampled [ɨ] to Provisional (anchor rule).
		profile = withIghPass(direct);
		persist();
		onProfileChange?.(profile);
	}

	function handleRolledBack(vowel: Vowel) {
		// Spec v1 §3, the re-take rule: the previous Captured value stands and
		// the profile did not change, so there is no onVowelCaptured /
		// onProfileChange to forward (and no roster change, announcement, or
		// save either; the banner alone explains the rollback). Same
		// out-of-turn guard as handleVowelCaptured: only the current vowel's
		// rollback holds and advances the tour.
		if (phase !== 'capture' || paused) return;
		if (vowel === currentVowel) {
			beginHold(vowel, 'rolled-back');
		} else if (currentVowel) {
			pacifierRef?.activateVowel(currentVowel);
		}
	}

	function beginHold(vowel: Vowel, kind: HoldKind) {
		holdVowel = vowel;
		holdKind = kind;
		holdActive = true;
		// The hold's announcement goes through the persistent hidden live
		// region (Kimi's review, 2026-07-11): a live region inserted into the
		// DOM together with its content is often missed by screen readers, so
		// the visual banner renders conditionally for sighted users while the
		// announcement text lands in a region that always exists.
		holdAnnounce =
			kind === 'good'
				? `${SPOKEN_NAME[vowel]}, captured.`
				: kind === 'rolled-back'
					? 'New sample was less certain, so the previous one was kept.'
					: 'Noted, moving on. You can re-take it from the summary.';
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

	/**
	 * The escape hatch (Kimi's review, 2026-07-11): the optional-vowel tail
	 * and the single-vowel re-take pass both re-enter the capture phase with
	 * no way back to the summary short of completing every capture — a trap
	 * door violating the no-dead-ends principle. This quiet affordance shows
	 * only when the default set is already complete (so the main seven-vowel
	 * tour is never interrupted by it) and returns to the summary, cancelling
	 * any capture in flight (the session teardown is fire-and-forget and the
	 * Pacifier handles the CANCELLED callback gracefully).
	 */
	function returnToSummary() {
		captureSession.cancel();
		clearAllTimers();
		holdTimer = undefined;
		holdActive = false;
		holdVowel = undefined;
		paused = false;
		phase = 'summary';
	}

	function finish() {
		persist();
		onComplete?.(profile);
		finished = true;
	}

	// ── Start over: clears the active voice's readings, keeps its name ──────
	function confirmReset() {
		profile = {};
		persist();
		resetFlow('welcome');
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
				return '';
		}
	}

	// ── Working values (Dann, 2026-07-02) ────────────────────────────────────
	// Each roster row publishes the working fR1/fR2 so the singer sees what
	// was received. For the three optional vowels, an unsampled row shows the
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

	/**
	 * Usable as a derivation anchor: sampled with both resonances present.
	 * A Provisional anchor still derives (Dann, 2026-07-11): a greyed
	 * synthetic value beats an empty cell, and the derivation math needs
	 * numbers, not confidence labels. The earlier not-Provisional gate
	 * blocked every derivation whenever a session ran Provisional-heavy,
	 * which is exactly when the singer most wants the full picture. The
	 * locked anchor rule (a Provisional [i]/[u] resolves [ɨ] to
	 * Provisional) belongs to the engine's resolution pass
	 * (applyIghDivergence, not yet wired); this preview stays display-only
	 * and labelled Estimated until that pass takes over.
	 */
	function usableAnchor(f: CalibratedFormant | undefined): f is CalibratedFormant & { f2: number } {
		return !!f && typeof f.f2 === 'number';
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

	// The chart receives the merged map (Kimi's ruling, 2026-07-11): sung
	// values plus derived previews, so an estimated node wears its ≈ badge
	// and "the chart knows what the roster knows." Display-only flow: the
	// return path strips estimated entries (see handleProfileChange).
	let pacifierFormants = $derived.by(() => {
		const m: Partial<Record<Vowel, CalibratedFormant>> = { ...profile };
		for (const g of OPTIONAL_VOWELS) {
			if (!m[g]) {
				const d = displayFormant(g);
				if (d) m[g] = d;
			}
		}
		return m;
	});

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

<!--
	The resonance symbol (Dann, 2026-07-10): italic f (variable), upright
	roman subscript (label, so it cannot be misread as f × R × 1), subscript
	set slightly smaller than the base. The single source of this convention
	in the code. Screen readers announce the aria-label; the styled glyphs
	are hidden from them because "f" plus a subscript reads as noise.
-->
{#snippet frSym(n: number)}<span class="fr-sym" aria-label={`f R ${n}`}><em aria-hidden="true"
			>f</em
		><sub aria-hidden="true">R{n}</sub></span
	>{/snippet}

<!--
	The resonance roster (Dann's direction, 2026-07-10; see the script-side
	comment for full provenance). One table on both surfaces: the guided
	flow renders it read-only under the quadrilateral; the summary renders
	the same table with a Re-take column. All ten vowels present from the
	start, greyed until a value lands, so the full schema is always
	accounted for and the layout never shifts.
-->
<!-- The optional-vowels invitation, single-sourced (Kimi's review polish):
     the summary renders it in both its finished and unfinished states. -->
{#snippet optionalInvite()}
	{#if !optionalOffered && defaultsComplete}
		<button type="button" class="wizard-secondary" onclick={addOptionalVowels}>
			Experienced singers can provide direct samples for the three optional vowels.
		</button>
	{/if}
{/snippet}

{#snippet rosterTable(showActions: boolean)}
	<table class="wizard-roster">
		<thead>
			<tr>
				<th scope="col">Vowel</th>
				<th scope="col">{@render frSym(1)}</th>
				<th scope="col">{@render frSym(2)}</th>
				{#if showActions}
					<th scope="col"><span class="visually-hidden">Actions</span></th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each ALL_VOWELS as g (g)}
				{@const direct = profile[g]}
				{@const f = displayFormant(g)}
				<tr class:is-muted={!direct}>
					<th scope="row" class="wizard-roster-vowel">
						{@render vowelTag(g)}
						{#if f && readingLabel(f.reading)}
							<span
								class="wizard-roster-reading"
								class:is-provisional={f.reading === 'provisional'}
							>
								<!-- The derived siglum (Dann, 2026-07-11): ≈ joins the
								     calibration sigla (✓ captured, ↻ provisional) marking
								     synthetic values. aria-hidden: the word "Estimated"
								     already says it for screen readers. The matching
								     Pacifier node badge is with Kimi for review. -->
								{#if f.reading === 'estimated'}<span aria-hidden="true">≈&nbsp;</span>{/if}
								{readingLabel(f.reading)}
							</span>
						{/if}
					</th>
					<td class="wizard-roster-value">
						{#if f}{Math.round(f.f1)} Hz{/if}
					</td>
					<td class="wizard-roster-value">
						{#if f}
							{#if typeof f.f2 === 'number'}
								{Math.round(f.f2)} Hz
							{:else}
								<!-- Corrective-as-invitation (Dann): the missing second
								     resonance names its next action, not a deficiency. -->
								<span class="wizard-roster-tryagain">Try again</span>
							{/if}
						{/if}
					</td>
					{#if showActions}
						<td class="wizard-roster-action">
							{#if direct}
								<button type="button" onclick={() => retakeFromSummary(g)}>Re-take</button>
							{/if}
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
{/snippet}

<section class="calibration-wizard" aria-label="Your Resonances: voice calibration">
	<!-- The dedicated polite live region for roster announcements (Kimi
	     consensus, 2026-07-10). A single-purpose hidden region rather than
	     aria-live on the table itself: table semantics plus live region
	     semantics can double-announce or announce structural noise.
	     Rendered unconditionally so the region exists before its first
	     update, which some screen readers require to announce reliably. -->
	<div class="visually-hidden" role="status">{logAnnounce}</div>
	<!-- The hold banner's persistent live region (Kimi's review, 2026-07-11):
	     always in the DOM so its first announcement is never missed; the
	     visual banner below renders conditionally and carries no aria-live. -->
	<div class="visually-hidden" role="status">{holdAnnounce}</div>

	<!-- The voice switcher heads the drawer (Kimi: whose-voice-is-this is
	     settled before any capture; the main pane stays a pure gallery).
	     Inert during an active capture. With no voices saved, it renders
	     the first-launch naming and the wizard phases wait behind it. -->
	<ProfileSwitcher
		voices={store.voices}
		activeId={store.activeId}
		disabled={phase === 'capture'}
		{nextDefaultName}
		onSelect={selectVoice}
		onCreate={(n) => createVoice(n)}
		onDuplicate={duplicateActiveVoice}
		onRename={renameActiveVoice}
		onDelete={deleteActiveVoice}
	/>

	{#if activeVoice}
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
						initialFormants={pacifierFormants}
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
				{@render rosterTable(false)}
				{#if paused}
					<div class="wizard-inline-banner">
						<p>Paused. Resume when you're ready.</p>
						<button type="button" class="wizard-primary" onclick={togglePause}>Resume</button>
					</div>
				{:else if holdActive && holdVowel}
					<div class="wizard-inline-banner">
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
					<div class="wizard-quiet-actions">
						<button type="button" class="wizard-pause" onclick={togglePause}>Pause</button>
						{#if defaultsComplete}
							<!-- The escape hatch (Kimi's review): only offered once the
							     seven defaults are complete, i.e. during the optional
							     tail or a re-take pass, never mid-tour. -->
							<button type="button" class="wizard-pause" onclick={returnToSummary}>
								Return to summary
							</button>
						{/if}
					</div>
				{/if}
				{#if toastVisible}
					<div class="wizard-toast" role="status">
						<p>
							The room sounds a little lively. Your sample is still good, but a quieter space
							would help.
						</p>
						<button
							type="button"
							class="wizard-toast-dismiss"
							onclick={dismissToast}
							aria-label="Dismiss">×</button
						>
					</div>
				{/if}
			</div>
		{:else if phase === 'summary'}
			<div class="wizard-phase">
				<h2 id="wizard-title">Profile summary</h2>
				{#if finished}
					<!-- No dead ends (Dann, 2026-07-10): Finish confirms, but the
					     roster stays visible and curatable — Re-take still works and
					     the optional-vowels invitation survives. With persistence
					     (Phase 2b) the confirmation is true across reloads. -->
					<p class="wizard-lede">
						Your profile is saved on this device. You can keep refining any reading below.
					</p>
					{@render rosterTable(true)}
					{@render optionalInvite()}
				{:else}
					<p class="wizard-lede">
						{capturedCount} of {ALL_VOWELS.length} vowels sampled. Review each reading and re-take
						anything uncertain before you finish.
					</p>
					{@render rosterTable(true)}
					{@render optionalInvite()}
					<button type="button" class="wizard-primary" onclick={finish}>Finish</button>
				{/if}
				{#if confirmingReset}
					<div class="wizard-inline-banner">
						<p>This clears every reading saved for this voice. Start fresh?</p>
						<div class="wizard-hold-actions">
							<button type="button" onclick={confirmReset}>Start fresh</button>
							<button type="button" onclick={() => (confirmingReset = false)}>
								Keep my profile
							</button>
						</div>
					</div>
				{:else}
					<button type="button" class="wizard-pause" onclick={() => (confirmingReset = true)}>
						Start over
					</button>
				{/if}
			</div>
		{/if}
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

	/* The resonance symbol: italic variable, upright subscript, subscript
	   slightly smaller than the base (Dann, 2026-07-10). */
	.fr-sym em {
		font-style: italic;
		font-weight: inherit;
	}
	.fr-sym sub {
		font-style: normal;
		font-size: 0.72em;
		line-height: 1;
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

	/* ── The resonance roster (Dann's direction, 2026-07-10) ─────────────────
	   All ten vowels always present, so the table never changes size; rows
	   grey until a value lands. Header carries Shane's signature lavender. */
	.wizard-roster {
		width: 100%;
		max-width: 26rem;
		border-collapse: collapse;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
	}
	.wizard-roster thead th {
		background: var(--deeper-lavender);
		color: #ffffff;
		font-weight: 600;
		font-size: 0.8125rem;
		text-align: left;
		padding: 0.375rem 0.75rem;
	}
	.wizard-roster thead th:first-child {
		border-radius: 0.375rem 0 0 0.375rem;
	}
	.wizard-roster thead th:last-child {
		border-radius: 0 0.375rem 0.375rem 0;
	}
	.wizard-roster tbody tr {
		border-bottom: 1px solid var(--stone-300);
	}
	.wizard-roster tbody tr:last-child {
		border-bottom: none;
	}
	/* Unsampled rows rest greyed, so the whole ten-vowel schema is visibly
	   accounted for; a derived Estimated preview stays greyed too, reading
	   as quieter than a sung capture (Dann, 2026-07-02). */
	.wizard-roster tbody tr.is-muted {
		opacity: 0.5;
	}
	.wizard-roster-vowel {
		text-align: left;
		font-weight: 600;
		color: var(--ink-primary);
		padding: 0.375rem 0.75rem;
	}
	/* The reading word beneath the vowel name (Dann's placement call,
	   2026-07-10), amber for Provisional per the calibration vocabulary. */
	.wizard-roster-reading {
		display: block;
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--ink-tertiary);
		margin-top: 0.0625rem;
	}
	.wizard-roster-reading.is-provisional {
		color: var(--prep-amber);
	}
	/* The numbers: metadata, never coloured (Kimi, 2026-07-10). */
	.wizard-roster-value {
		padding: 0.375rem 0.75rem;
		color: var(--ink-secondary);
		font-weight: 400;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		vertical-align: top;
	}
	.wizard-roster-tryagain {
		color: var(--prep-amber);
		font-size: 0.8125rem;
	}
	.wizard-roster-action {
		padding: 0.375rem 0.5rem;
		text-align: right;
		vertical-align: top;
	}
	.wizard-roster-action button {
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
	.wizard-roster-action button:hover {
		border-color: var(--sage);
		color: var(--sage);
	}
	/* Narrow-viewport hardening (Dann's call on Kimi's review, 2026-07-11):
	   the column form holds at every width; small screens get tighter
	   padding and wrapping vowel names rather than a different layout. */
	@media (max-width: 380px) {
		.wizard-roster {
			font-size: 0.8125rem;
		}
		.wizard-roster thead th,
		.wizard-roster-vowel,
		.wizard-roster-value {
			padding: 0.3125rem 0.375rem;
		}
		.wizard-roster-vowel {
			overflow-wrap: anywhere;
		}
		.wizard-roster-action {
			padding: 0.3125rem 0.25rem;
		}
		.wizard-roster-action button {
			padding: 0.25rem 0.5rem;
		}
	}

	.wizard-quiet-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
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
</style>
