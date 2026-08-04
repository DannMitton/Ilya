<script lang="ts">
	/**
	 * Shane guided-director calibration wizard, user-facing name "Your
	 * Resonances" (the Drawer-panel surface for the Shane tab).
	 *
	 * Source of record: shane-calibration-wizard-spec_v1_2026-06-30.md,
	 * reconciled between Claude and Kimi over two review rounds, recorded in
	 * handover v27. This wraps the pacifier's locked per-vowel ritual (spec
	 * v11 §3, §4, §6, §7, §8, §11) in four phases — Welcome, Readiness,
	 * Guided capture, Profile summary — plus the skippable Voice
	 * characteristics phase behind the summary (E.5 slice 3, Kimi's Q5
	 * ruling, v39 §A.31) — without altering that ritual; the
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
	 * real audio. Step 2's READINESS side landed 2026-08-04 (item 1.4a):
	 * the quiet second and the throwaway fry are measured through the same
	 * session, the two mocked `after()` timers that stood in for them are
	 * gone, and the `readinessOutcome` test hook is retired with them. The
	 * numbers themselves live in engine/readiness.ts, where vitest can
	 * reach them; this component renders what that returns and decides
	 * nothing numeric.
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
	import { onMount, tick } from 'svelte';
	import Pacifier, { SPOKEN_NAME } from '$lib/shane/pacifier/Pacifier.svelte';
	import ProfileSwitcher from '$lib/shane/ProfileSwitcher.svelte';
	import NotePicker from '$lib/shane/NotePicker.svelte';
	import { LiveCaptureSession } from '$lib/shane/engine/live';
	import type { CaptureSession } from '$lib/shane/engine/session';
	import {
		READINESS_CAPTURE_MS,
		READINESS_PREP_MS,
		type ReadinessResult
	} from '$lib/shane/engine/readiness';
	import type { ShaneEngineError } from '$lib/shane/engine/errors';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import { pitchToMidi, type Pitch } from '@ilya/score-parser';
	import { derive } from '$lib/shane/engine/derivations';
	import { applyIghDivergence } from '$lib/shane/engine/divergence';
	import { checkPlausibility, buildPlausibilityEvent } from '$lib/shane/engine/plausibility';
	import {
		loadStore,
		saveStore,
		newVoiceId,
		type ProfileStore,
		type StoredVoice,
		type ReadinessRecord
	} from '$lib/shane/profileStore';
	import type {
		Vowel,
		VoiceType,
		CalibratedFormant,
		VoiceCharacteristics
	} from '$lib/shane/engine/types';

	// ── Locked upstream (spec v1 §1, §2) ──────────────────────────────────────
	// The seven default vowels, in the spec's fixed counterclockwise order.
	// The other three are offered afterward from the summary and are not
	// required to finish (spec v1 §2 Phase 2, "the remaining two default vowels
	// and the optional three extend a bespoke profile but are not required").
	//
	// RENAMED 2026-08-04 on Dann's ruling, and the word mattered enough to move
	// an identifier: **none of the ten vowels is optional.** All ten are
	// necessary for sung Russian. Five are the floor the four derivations
	// consume (`Pacifier.svelte:204`); seven are what the guided tour asks for;
	// these three are simply the hardest for a new singer to produce on demand,
	// so Ilya derives them as an assistance until the singer chooses to sing
	// them. **`OPTIONAL_VOWELS` encoded a claim about importance that is false,
	// and a singer reading the surface it fed would have inherited it.**
	const DEFAULT_VOWELS: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u'];
	const CHALLENGING_VOWELS: Vowel[] = ['ɨ', 'ɪ', 'ʌ'];
	const ALL_VOWELS: Vowel[] = [...DEFAULT_VOWELS, ...CHALLENGING_VOWELS];
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

	// 'characteristics' is the fifth phase (E.5 slice 3; Kimi's Q5 ruling,
	// v39 §A.31): typed range/tessitura/passaggio through note pickers.
	// Skippable and never a gate — entered only through the quiet summary
	// button (Dann's slice-3 decision, 2026-07-13), and Done returns to
	// the summary. Editable later through the same button.
	type Phase = 'welcome' | 'readiness' | 'capture' | 'summary' | 'characteristics';
	type HoldKind = 'good' | 'provisional' | 'rolled-back' | 'implausible';

	interface CalibrationWizardProps {
		/** Routing key to the Bozeman value-sets; undefined until a selector lands. */
		voiceType?: VoiceType;
		/**
		 * The auditory input, injectable on the same pattern the Pacifier
		 * already uses (Pacifier.svelte:85). Defaults to the live session, so
		 * the page shell needs no change; a harness can pass a
		 * StubCaptureSession to drive the readiness and capture paths without a
		 * microphone. This replaces the retired `readinessOutcome` hook, which
		 * forced a mocked outcome the gate no longer produces.
		 */
		session?: CaptureSession;
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
		/**
		 * Fires with the active voice's working profile and name whenever
		 * either changes, including the paths the Pacifier-forwarded
		 * onProfileChange cannot see: hydration on mount, voice switching,
		 * creation, duplication, deletion, rename, and Start over. This is
		 * the main pane's subscription — the Voice Profile envelope
		 * (VoiceProfilePane.svelte, handover v30 §C.1) mirrors the
		 * workshop's readings through the page shell, so the gallery always
		 * shows the voice the drawer is working on, and its TitleHeader
		 * carries the voice's name (Dann's page-furniture ruling in review).
		 * The name is undefined only before first-launch naming.
		 */
		onActiveProfileChange?: (
			formants: Partial<Record<Vowel, CalibratedFormant>>,
			voiceName: string | undefined,
			characteristics: VoiceCharacteristics | undefined
		) => void;
		/**
		 * Q3 wizard collapse (Kimi's §A.28 ruling, 2026-07-13): counts
		 * successful score renders in the Fit main pane — loaded, parsed,
		 * AND rendered; a load failure never increments (the error belongs
		 * to the uploader slot). Each increment collapses the wizard to
		 * its compact header, unless a capture is mid-flight, in which
		 * case the collapse waits for the summary (Dann's deferral ruling,
		 * 2026-07-13): the ritual is never interrupted. 0 = no score yet,
		 * and no collapse chrome renders at all.
		 */
		scoreRenders?: number;
		/**
		 * The collapse state, bindable so the page shell can carry it
		 * across drawer tab switches (the shane panel unmounts when the
		 * tab changes, so wizard-local state would forget an expansion).
		 * The compact-header chevron toggles it both ways.
		 */
		collapsed?: boolean;
		/**
		 * Opens the Learn module's sung-[o] note (anchor learn-u3-note-o).
		 * The sung-[o] précis ruling (Kimi 2026-07-11; copy Dann's, approved
		 * same day): ONE quiet tertiary ⓘ glyph on the [o] roster row is the
		 * whole affordance — the glyph is the affordance ceiling, there is
		 * no per-vowel framework (Dann gates each vowel individually, and
		 * only [o] is ruled), and it is hidden mid-wizard: the glyph renders
		 * on the summary surface only, never inside a capture ritual. The
		 * return path is the Shane tab itself; the wizard rehydrates to the
		 * summary because the voice has readings.
		 */
		onOpenLearnNote?: () => void;
	}

	let {
		voiceType = undefined,
		// The live auditory input (locked port order step 2). One session
		// instance for the wizard's lifetime; each capture and each readiness
		// run opens and releases the microphone itself, so the mic indicator
		// rests dark between them. Construction touches no browser API;
		// getUserMedia is requested only inside start() and startReadiness().
		session: captureSession = new LiveCaptureSession(),
		scoreRenders = 0,
		collapsed = $bindable(false),
		onVowelCaptured,
		onProfileChange,
		onComplete,
		onActiveProfileChange,
		onOpenLearnNote
	}: CalibrationWizardProps = $props();

	let pacifierRef: ReturnType<typeof Pacifier> | undefined = $state();

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

	// ── The plausibility guard, wizard boundary (amendment LOCKED 2026-07-11) ─
	// One session id per wizard mount, so the console evidence (ruled schema)
	// can group a sitting's extractions for manual audit.
	const guardSessionId =
		typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID()
			: `s-${Date.now().toString(36)}`;
	/**
	 * Runs the vowel-aware fR1 window check on a just-captured reading and
	 * returns a clone carrying the verdict. An `implausible` reading resolves
	 * to Provisional (never a block, nothing discarded; the sigla and the
	 * hold copy carry it) while `confidence` stays untouched — plausibility
	 * and signal quality are orthogonal facts (Kimi's ruling: "the machine
	 * heard you perfectly, but you sang a different vowel than intended" is
	 * itself useful information). Guard placement at this boundary follows
	 * the withIghPass precedent: the profile (the anchors) lives here, not in
	 * the §9 core. The structured console event is emitted for EVERY
	 * extraction (ruled): the distance-to-edge distribution of honest
	 * readings is the evidence base for any future margin tightening.
	 */
	function withPlausibility(vowel: Vowel, formant: CalibratedFormant): CalibratedFormant {
		if (formant.source !== 'measured-user') return formant;
		const anchorF1s: Partial<Record<Vowel, number>> = {};
		for (const [g, f] of Object.entries(profile) as [Vowel, CalibratedFormant][]) {
			if (f && f.reading !== 'estimated') anchorF1s[g] = f.f1;
		}
		const res = checkPlausibility(formant.f1, vowel, voiceType, anchorF1s);
		const out: CalibratedFormant = { ...formant, plausibility: res.plausibility };
		if (res.plausibility === 'implausible' && out.reading === 'captured')
			out.reading = 'provisional';
		const rePromptShown =
			res.plausibility === 'implausible' && phase === 'capture' && !paused && vowel === currentVowel;
		console.info(
			'[shane] plausibility',
			JSON.stringify(buildPlausibilityEvent(vowel, formant.f1, res, rePromptShown, guardSessionId, voiceType))
		);
		return out;
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
	let challengingOffered = $state(false);
	let finished = $state(false);
	let currentVowel = $derived<Vowel | undefined>(queue[queueIndex]);
	let capturedCount = $derived(Object.values(profile).filter((f) => !!f).length);
	// The invitation to sing the remaining three waits for a complete default set
	// (Dann, 2026-07-10): it must not appear when the summary is reached
	// early by any path (a single-vowel re-take pass, or a queue bug).
	let defaultsComplete = $derived(DEFAULT_VOWELS.every((g) => !!profile[g]));

	// ── Q3 wizard collapse (Kimi §A.28; Dann's mid-capture deferral) ─────────
	// A new successful render (the counter incremented) collapses the wizard
	// to its compact header — including a re-collapse after the singer
	// expanded, since each fresh score render re-triggers (Dann's default,
	// 2026-07-13). Mid-capture, the trigger is remembered and lands when the
	// phase next reaches the summary; the ritual is never torn down. Plain
	// variables: both are compared inside effects, never rendered.
	// svelte-ignore state_referenced_locally
	let seenScoreRenders = scoreRenders;
	let pendingCollapse = false;
	$effect(() => {
		if (scoreRenders > seenScoreRenders) {
			seenScoreRenders = scoreRenders;
			if (phase === 'capture') pendingCollapse = true;
			else collapsed = true;
		}
	});
	$effect(() => {
		if (phase === 'summary' && pendingCollapse) {
			pendingCollapse = false;
			collapsed = true;
		}
	});
	// The compact header's line, Kimi's "Dann — bass (provisional) — 7/10
	// vowels" style. The voice-type segment waits for the Q5 declaration
	// build (no selector exists yet); the separator is a middle dot per the
	// no-em-dash constraint. The aria-label speaks the counts in words, the
	// §4.6 discipline (a raw "7/10" reads as a fraction).
	let compactLabel = $derived(
		`${activeVoice ? `${activeVoice.name} · ` : ''}${capturedCount}/${ALL_VOWELS.length} vowels`
	);
	let compactSpokenLabel = $derived(
		`${activeVoice ? `${activeVoice.name}, ` : ''}${capturedCount} of ${ALL_VOWELS.length} vowels sampled`
	);

	function persistStore() {
		saveStore($state.snapshot(store) as ProfileStore);
	}

	// ── Voice characteristics (E.5 slice 3; Kimi's Q5 ruling, v39 §A.31) ─────
	// The six pickers share one notation font load (memoized in the shared
	// loader; the Fit pane's own load makes this a cache hit). Failure falls
	// back to the pickers' primitive shapes — never blocking.
	let notationFont = $state<LoadedNotationFont | null>(null);
	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then((f) => {
				if (alive) notationFont = f;
			})
			.catch(() => {
				/* primitive-mode fallback; the pickers stay fully functional */
			});
		return () => {
			alive = false;
		};
	});

	type CharacteristicField =
		| 'rangeLow'
		| 'rangeHigh'
		| 'tessituraLow'
		| 'tessituraHigh'
		| 'passaggioPrimary'
		| 'passaggioSecondary';
	const CHARACTERISTIC_FIELDS: CharacteristicField[] = [
		'rangeLow',
		'rangeHigh',
		'tessituraLow',
		'tessituraHigh',
		'passaggioPrimary',
		'passaggioSecondary'
	];

	/**
	 * Write one characteristic into the active voice, saving on every
	 * change like the formant path. Source is 'manual' — typed entry. The
	 * template seam (Kimi's Q5): a fach-preset pre-fill is this same write
	 * with source 'declared-template', BLOCKED on §A.34's citation-grade
	 * values; no visible affordance renders until they arrive (a greyed
	 * control would advertise what cannot be delivered). Clearing the last
	 * field removes the object entirely, so a fully cleared phase reads as
	 * skipped and analyzeScore's per-dimension defaults apply cleanly.
	 */
	function setCharacteristic(field: CharacteristicField, p: Pitch | undefined) {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (!v) return;
		const next: VoiceCharacteristics = {
			...(v.characteristics ?? { source: 'manual' }),
			source: 'manual'
		};
		if (p) next[field] = p;
		else delete next[field];
		v.characteristics = CHARACTERISTIC_FIELDS.some((f) => !!next[f]) ? next : undefined;
		v.updatedAt = new Date().toISOString();
		persistStore();
	}

	let hasCharacteristics = $derived.by(() => {
		const c = activeVoice?.characteristics;
		return !!c && CHARACTERISTIC_FIELDS.some((f) => !!c[f]);
	});
	// Gentle consistency notes (amber, never a block): an inverted pair is
	// almost certainly a typo, but the phase is not a gate and analysis
	// copes, so the note only names what it sees. Enharmonic-aware through
	// pitchToMidi. Copy flagged for Dann's review with the slice-3 strings.
	let rangeInverted = $derived.by(() => {
		const c = activeVoice?.characteristics;
		return !!(c?.rangeLow && c.rangeHigh) && pitchToMidi(c.rangeLow) > pitchToMidi(c.rangeHigh);
	});
	let tessituraInverted = $derived.by(() => {
		const c = activeVoice?.characteristics;
		return (
			!!(c?.tessituraLow && c.tessituraHigh) &&
			pitchToMidi(c.tessituraLow) > pitchToMidi(c.tessituraHigh)
		);
	});
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
		// A readiness run holds the microphone, so leaving the phase must
		// release it. Scoped to that phase deliberately: a capture in flight is
		// the Pacifier's to cancel, and reaching across would change a shipped
		// path this item does not touch.
		if (phase === 'readiness') captureSession.cancel();
		readinessResult = undefined;
		readinessError = undefined;
		readinessStep = 'quiet';
		readinessCount = '';
		readinessProgress = 0;
		clearReadinessTimers();
		clearAllTimers();
		holdTimer = undefined;
		holdActive = false;
		holdVowel = undefined;
		paused = false;
		confirmingReset = false;
		toastVisible = false;
		queue = [...DEFAULT_VOWELS];
		queueIndex = 0;
		challengingOffered = false;
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

	// ── Phase 1, readiness (measured; item 1.4a) ─────────────────────────────
	// 'unmeasured' is the abstention: the gate could not measure, so the
	// wizard says so and makes no claim about the room or the fry. It is a
	// state, never a block; Continue stands from it exactly as from 'done'.
	// 'prepare' and 'capture' split what used to be one 'fry' step, on Dann's
	// ruling of 2026-08-04 after he walked it as a user: "The step ... is too
	// rapid. A new user will assume there was an error ... A human being will
	// expect 3-5 seconds to carry out this task." The engine reaches its verdict
	// in about one second; the step is longer on purpose, so the singer is
	// counted in and can see when they have given enough. Same shape as the
	// vowel steps (`pacifier/Pacifier.svelte:360` and `:412`).
	let readinessStep = $state<'quiet' | 'prepare' | 'capture' | 'done' | 'unmeasured'>('quiet');
	let readinessResult = $state<ReadinessResult | undefined>(undefined);
	let readinessError = $state<ShaneEngineError | undefined>(undefined);
	/** The count-in beat, 'Three.' | 'Two.' | 'One.'. */
	let readinessCount = $state('');
	/** 0 to 1 across READINESS_CAPTURE_MS. Drawn as the bar; never a measurement. */
	let readinessProgress = $state(0);
	let readinessTimers: ReturnType<typeof setTimeout>[] = [];
	let readinessRaf = 0;

	/**
	 * The wizard's own clock. It does NOT drive the engine and the engine does
	 * not drive it: both read READINESS_PREP_MS and READINESS_CAPTURE_MS from
	 * `engine/readiness.ts`, which is the same decoupling the vowel arc uses
	 * ("a fixed 3.0 s clock that never stalls, independent of the engine's
	 * delivery time", `Pacifier.svelte:412`). If they ever disagree, the bar is
	 * wrong and the measurement is not.
	 */
	function clearReadinessTimers() {
		for (const t of readinessTimers) clearTimeout(t);
		readinessTimers = [];
		if (readinessRaf) cancelAnimationFrame(readinessRaf);
		readinessRaf = 0;
	}
	// One source of truth: the two flags the UI reads are views of the gate's
	// verdict, never separately assignable state that could disagree with it.
	// An out-of-range fry takes the same guidance line as a marginal one; that
	// line is Dann's copy and a distinct out-of-range string is flagged, not
	// invented here.
	let fryMarginal = $derived(
		readinessResult?.fryRange === 'marginal' || readinessResult?.fryRange === 'out-of-range'
	);
	let snrMarginal = $derived(readinessResult?.room.lively ?? false);
	/** True when no microphone could be reached, as opposed to no fry heard. */
	let readinessNoMic = $derived(
		readinessError?.code === 'MIC_NOT_FOUND' ||
			readinessError?.code === 'MIC_PERMISSION_DENIED' ||
			readinessError?.code === 'NO_AUDIO_INPUT'
	);

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

	/**
	 * Write the readiness gate's finding into the active voice (item 1.4a,
	 * "recorded in the profile's provenance"). Failure-silent, like persist():
	 * a voice that cannot be found simply keeps no record, and an absent record
	 * means "we do not know what the room was like", never "the room was fine".
	 */
	function recordReadiness(record: ReadinessRecord) {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (!v) return;
		v.readiness = record;
		v.updatedAt = new Date().toISOString();
		persistStore();
	}

	// ── Phase 0 → 1 ────────────────────────────────────────────────────────
	function beginReadiness() {
		phase = 'readiness';
		readinessStep = 'quiet';
		readinessResult = undefined;
		readinessError = undefined;
		readinessCount = '';
		readinessProgress = 0;
		clearReadinessTimers();
		// Item 1.4a. Two steps, in this order, because SNR needs a quiet
		// reference and a fry is not quiet (wizard spec v1 §2 Phase 1). Both
		// are measured through the session's own microphone; the two `after()`
		// timers that stood here, and read a stub, are deleted. The gate never
		// blocks: every terminal state below offers Continue.
		captureSession.startReadiness({
			onQuiet: () => {
				// Count the singer in, then draw the capture window. Three beats
				// at a third of the countdown each, matching COUNT_INTERVAL on
				// the vowel steps, then the bar.
				readinessStep = 'prepare';
				readinessCount = 'Three.';
				readinessProgress = 0;
				const beat = READINESS_PREP_MS / 3;
				readinessTimers.push(setTimeout(() => (readinessCount = 'Two.'), beat));
				readinessTimers.push(setTimeout(() => (readinessCount = 'One.'), 2 * beat));
				readinessTimers.push(
					setTimeout(() => {
						readinessStep = 'capture';
						readinessCount = '';
						const t0 = performance.now();
						const step = (t: number) => {
							readinessProgress = Math.min(1, (t - t0) / READINESS_CAPTURE_MS);
							readinessRaf = readinessProgress < 1 ? requestAnimationFrame(step) : 0;
						};
						readinessRaf = requestAnimationFrame(step);
					}, READINESS_PREP_MS)
				);
			},
			onComplete: (result) => {
				clearReadinessTimers();
				readinessProgress = 1;
				readinessResult = result;
				readinessStep = 'done';
				recordReadiness({
					measuredAt: new Date().toISOString(),
					measured: true,
					roomSnrDb: result.room.snrDb,
					roomLively: result.room.lively,
					fryRateHz: result.fryRateHz,
					fryRange: result.fryRange
				});
			},
			onError: (error) => {
				// CANCELLED is the singer leaving, not a finding: there is
				// nothing to say and nothing to record.
				if (error.code === 'CANCELLED') return;
				clearReadinessTimers();
				readinessError = error;
				readinessStep = 'unmeasured';
				recordReadiness({
					measuredAt: new Date().toISOString(),
					measured: false,
					roomSnrDb: null,
					roomLively: false,
					fryRateHz: null,
					fryRange: 'not-measured'
				});
			}
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
		const checked = withPlausibility(vowel, formant);
		profile = withIghPass({ ...profile, [vowel]: checked });
		persist();
		// The hold and the announcement use the post-pass reading: a divergent
		// [ɨ] that the pass resolved to Provisional must not be celebrated as
		// captured (no capture-time modal, per the locked decision — the
		// ordinary provisional hold wording carries it).
		const effective = profile[vowel] ?? checked;
		// The polite data delivery (Kimi, 2026-07-10): the hold banner is the
		// confirmation, this is the number's first availability to non-visual
		// users. Speakable name, never the raw glyph (§4.6 discipline).
		logAnnounce = `Added to progress: ${SPOKEN_NAME[vowel]}, ${Math.round(effective.f1)} hertz, ${readingLabel(effective.reading)}.`;
		onVowelCaptured?.(vowel, effective);
		if (phase !== 'capture' || paused) return;
		if (vowel === currentVowel) {
			// The implausible hold outranks the ordinary provisional wording:
			// same Provisional resolution, but the copy names the mismatch
			// (signed-off re-prompt line, 2026-07-11) instead of the generic
			// uncertainty wording. Never a block: Continue stands.
			beginHold(
				vowel,
				effective.plausibility === 'implausible'
					? 'implausible'
					: effective.reading === 'captured'
						? 'good'
						: 'provisional'
			);
		} else if (currentVowel) {
			// Out of turn: the roster took the value; the tour stays put.
			pacifierRef?.activateVowel(currentVowel);
		}
	}

	/**
	 * Are these two readings the same extraction?
	 *
	 * The Pacifier holds the RAW formant the session handed it
	 * (`Pacifier.svelte`, `n.formant = formant`), while `profile` holds the
	 * clone `withPlausibility` returned. They describe one capture and differ
	 * only in the fields the guard added. Comparing the measured numbers and
	 * the provenance identifies that pair without trusting either copy's
	 * verdict, which is the field under dispute.
	 */
	function sameExtraction(a?: CalibratedFormant, b?: CalibratedFormant): boolean {
		return !!a && !!b && a.f1 === b.f1 && a.f2 === b.f2 && a.source === b.source;
	}

	function handleProfileChange(formants: Partial<Record<Vowel, CalibratedFormant>>) {
		// The Pacifier now receives the merged map (sung plus derived
		// previews, for the ≈ badge) and reports its full map back, so
		// estimated entries must be stripped here or synthetic values would
		// leak into the stored profile — the only-sung-is-stored rule
		// (Mitton 2020 §5.3.3 discipline) enforced at the boundary.
		//
		// E.26, AND THIS IS A DEFECT FIX RATHER THAN A TIDY-UP. `Pacifier.svelte`
		// fires onVowelCaptured and onProfileChange back to back in one tick.
		// The first ran the plausibility guard, wrote its verdict, and demoted
		// an implausible `captured` to `provisional` (`:275-276`). This function
		// then rebuilt the profile wholesale from the Pacifier's un-guarded map
		// and persisted it, **erasing both**. MEASURED, 2026-08-04, build
		// b6d2828: eight `[shane] plausibility` events fired, one per vowel, and
		// `plausibility` was `undefined` on every reading in every stored
		// profile. Dann's [i] was judged `implausible` with `rePromptShown:
		// true` and was stored as `reading: 'captured'`.
		//
		// So: when the Pacifier reports a reading we already hold a guarded copy
		// of, keep ours. Anything genuinely new (a re-take, a different
		// extraction) still comes from the Pacifier, and a removal still removes.
		const direct: Partial<Record<Vowel, CalibratedFormant>> = {};
		for (const [g, f] of Object.entries(formants) as [Vowel, CalibratedFormant][]) {
			if (!f || f.reading === 'estimated') continue;
			const held = profile[g];
			direct[g] = sameExtraction(held, f) ? (held as CalibratedFormant) : f;
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
					: kind === 'implausible'
						? `That reading looks unlikely for ${SPOKEN_NAME[vowel]}. Try again?`
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

	async function addChallengingVowels() {
		challengingOffered = true;
		queue = [...DEFAULT_VOWELS, ...CHALLENGING_VOWELS];
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
	 * The escape hatch (Kimi's review, 2026-07-11): the challenging-vowel tail
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
	// was received. For the three challenging vowels, an unsampled row shows the
	// engine's derived value (reading: Estimated), greyed, computed by the
	// same derive() the analysis layer uses — display-only, single source of
	// formulae (Mitton 2020 §5.3.3; the formulae themselves are never shown),
	// and the stored profile keeps only what was actually sung.

	/** The anchors each derivable challenging vowel needs (derivations.ts). */
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

	/** The row's display value: the direct sample, or a derived preview for the challenging three. */
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
		for (const g of CHALLENGING_VOWELS) {
			if (!m[g]) {
				const d = displayFormant(g);
				if (d) m[g] = d;
			}
		}
		return m;
	});

	// The envelope's mirror (see onActiveProfileChange above): $state.snapshot
	// reads the profile deeply, and activeVoice?.name is read here too, so
	// this effect re-runs on every path that can change a reading or the
	// title — per-vowel writes, whole-object reassignment on voice switch,
	// rename, and the Start over clear — and the main pane never goes stale.
	$effect(() => {
		onActiveProfileChange?.(
			$state.snapshot(profile) as Partial<Record<Vowel, CalibratedFormant>>,
			activeVoice?.name,
			// Reading activeVoice?.characteristics here tracks it, so the effect
			// re-runs when the Voice characteristics phase writes (E.5 slice 4)
			// and the main pane re-analyses. Snapshotted like the formants.
			$state.snapshot(activeVoice?.characteristics) as VoiceCharacteristics | undefined
		);
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
<!-- The invitation to sing the remaining three, single-sourced (Kimi's review
     polish): the summary renders it in both its finished and unfinished states.

     REWORDED 2026-08-04, Dann's report as a user: "Fit flashed completion before
     I had the chance to enter velar-i or smallcaps-i. The user should be able to
     attempt these values if they choose." **The control was already here and
     already worked.** It failed as an affordance: its label was a sentence about
     who is permitted rather than a verb saying what would happen, and it is the
     quietest control in the last position on the page. So the label is now the
     action and the reasoning moved to a caption beneath it.

     BOTH STRINGS ARE PLACEHOLDER and flagged for Dann, who writes copy. The
     shape is ruled and the wording is not. What must not change is that the
     button says what it does, and that nothing here calls a vowel optional. -->
{#snippet challengingInvite()}
	{#if !challengingOffered && defaultsComplete}
		<button type="button" class="wizard-secondary" onclick={addChallengingVowels}>
			Sing the three Ilya derived for you
		</button>
		<p class="wizard-caption">
			None of the ten vowels is optional. These three are the hardest to produce on demand, so
			Ilya derives them from your own anchors until you choose to sing them.
		</p>
	{/if}
{/snippet}

<!-- The Voice characteristics entry (E.5 slice 3, Dann's decision,
     2026-07-13): one quiet secondary button on the summary, both in its
     finished and unfinished states — opt-in first time, the edit path
     afterward. Skippable and never a gate: Finish never routes through
     the phase. -->
{#snippet characteristicsButton()}
	<button type="button" class="wizard-secondary" onclick={() => (phase = 'characteristics')}>
		{hasCharacteristics ? 'Edit voice characteristics' : 'Add voice characteristics'}
	</button>
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
						{#if showActions && g === 'o' && onOpenLearnNote}
							<!-- The sung-[o] note glyph (see the onOpenLearnNote doc):
							     [o] only, summary only, and the ⓘ is the affordance
							     ceiling. Speakable label, no raw glyph announced. -->
							<button
								type="button"
								class="wizard-info-glyph"
								aria-label="About the sung o vowel (opens the Learn note)"
								onclick={onOpenLearnNote}
							>ⓘ</button>
						{/if}
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
						{#if f?.noiseFloor === 'unmeasured'}
							<!-- Item 1.4b. The word is Dann's ruling of 4 August. It sits
							     on its own line rather than beside the reading, because it
							     is orthogonal to it: we can capture a vowel cleanly and
							     still be unable to measure the room, so "Captured
							     Unmeasured" on one line would read as a contradiction
							     rather than as two separate facts. Never amber: this is
							     not a fault in the singer's sample and must not be
							     coloured like one. The qualifying clause in the title is
							     PLACEHOLDER copy, flagged with the readiness-gate strings;
							     the ruled word itself is not. -->
							<span
								class="wizard-roster-noisefloor"
								title="The room's noise floor could not be measured for this sample."
							>Noise floor: Unmeasured</span>
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

	<!-- The Q3 collapse header (Kimi §A.28): renders only once a score has
	     rendered (before that there is nothing to cede the drawer to). One
	     accordion row in both states — chevron flips, body shows or hides —
	     so the affordance is reversible in place. The visible glyph is
	     aria-hidden; aria-expanded and the spoken label carry the state. -->
	{#if scoreRenders > 0 || collapsed}
		<button
			type="button"
			class="wizard-compact-toggle"
			aria-expanded={!collapsed}
			aria-controls="calibration-wizard-body"
			aria-label={compactSpokenLabel}
			onclick={() => (collapsed = !collapsed)}
		>
			<span class="wizard-compact-chevron" aria-hidden="true">{collapsed ? '▸' : '▾'}</span>
			<span aria-hidden="true">{compactLabel}</span>
		</button>
	{/if}

	{#if !collapsed}
	<div class="wizard-body" id="calibration-wizard-body">
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
				{:else if readinessStep === 'prepare'}
					<!-- The count-in. PLACEHOLDER COPY, flagged for Dann. The shape
					     is ruled and the wording is not: the singer is told what is
					     coming and given time to draw breath before anything is
					     collected. Nothing is recorded during this step. -->
					<p class="wizard-lede">Now a throwaway fry, just to check the mic hears you.</p>
					<p class="wizard-count" aria-hidden="true">{readinessCount}</p>
				{:else if readinessStep === 'capture'}
					<!-- PLACEHOLDER COPY, flagged for Dann. The bar is the point: it
					     says the microphone is hearing them AND when they have given
					     enough, which is the pair Dann named. -->
					<p class="wizard-lede">Fry now, and keep going until the bar fills.</p>
					<div
						class="readiness-meter"
						role="progressbar"
						aria-label="Recording your throwaway fry"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={Math.round(readinessProgress * 100)}
					>
						<div class="readiness-meter-fill" style="width: {readinessProgress * 100}%"></div>
					</div>
				{:else if readinessStep === 'unmeasured'}
					<!-- The abstention (item 1.4a, "abstain with no microphone").
					     PLACEHOLDER COPY, flagged for Dann, who writes copy: the
					     register is right (states what happened, assigns no
					     fault, names the next action) but the strings are not
					     signed off. What must not change is the shape: the gate
					     makes no claim about the room or the fry here, and it
					     does not block. -->
					{#if readinessNoMic}
						<p class="wizard-lede">
							We could not reach your microphone, so nothing was measured.
						</p>
					{:else}
						<p class="wizard-lede">We did not hear a fry, so nothing was measured.</p>
					{/if}
					<p class="wizard-guidance">
						You can carry on; each vowel asks for the microphone again.
					</p>
					<button type="button" class="wizard-primary" onclick={beginCapture}>Continue</button>
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
				<!-- The hold slot (Dann's direction, 2026-07-11, evening): the
				     post-capture banner sits directly beneath the quadrilateral
				     and above the roster, and the slot's height is reserved
				     whether or not a banner is showing, so the roster never
				     shifts when one appears — the same layout-stability
				     principle the static ten-row roster serves. -->
				<div class="wizard-hold-slot">
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
								{:else if holdKind === 'implausible'}
									<!-- The guard's re-prompt (signed off 2026-07-11): factual
									     observation, no fault assigned — an implausible reading
									     can equally be a mis-extraction — and the invitation
									     rides the existing Re-take affordance below. -->
									That reading looks unlikely for {@render vowelTag(holdVowel!)}. Try again?
								{:else}
									Noted, moving on. You can re-take it from the summary.
								{/if}
							</p>
							<div class="wizard-hold-actions">
								<button type="button" onclick={holdContinue}>Continue</button>
								<button type="button" onclick={holdRetake}>Re-take</button>
							</div>
						</div>
					{/if}
				</div>
				{@render rosterTable(false)}
				{#if !paused && !(holdActive && holdVowel) && currentVowel}
					<div class="wizard-quiet-actions">
						<button type="button" class="wizard-pause" onclick={togglePause}>Pause</button>
						{#if defaultsComplete}
							<!-- The escape hatch (Kimi's review): only offered once the
							     seven defaults are complete, i.e. during the challenging
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
					     the invitation to sing the remaining three survives. With persistence
					     (Phase 2b) the confirmation is true across reloads. -->
					<p class="wizard-lede">
						Your profile is saved on this device. You can keep refining any reading below.
					</p>
					{@render rosterTable(true)}
					{@render challengingInvite()}
					{@render characteristicsButton()}
				{:else}
					<p class="wizard-lede">
						{capturedCount} of {ALL_VOWELS.length} vowels sampled. Review each reading and re-take
						anything uncertain before you finish.
					</p>
					{@render rosterTable(true)}
					{@render challengingInvite()}
					{@render characteristicsButton()}
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
		{:else if phase === 'characteristics'}
			<!-- E.5 slice 3 (Kimi's Q5 ruling, v39 §A.31): typed-first capture
			     through note pickers; sung capture, when it arrives, verifies
			     and never discovers. Every field optional; values save on
			     every change (source 'manual'); Done returns to the summary.
			     Copy is agentless throughout and EN-only pending the standing
			     calibration-French pass; all strings flagged for Dann's copy
			     review. -->
			<div class="wizard-phase">
				<h2 id="wizard-title">Voice characteristics</h2>
				<p class="wizard-lede">
					These optional values sharpen the fit analysis. Any field can stay blank; where a value
					is missing, the analysis simply stays broad for that dimension.
				</p>
				<div class="charx-group">
					<h3 class="charx-heading">Range</h3>
					<NotePicker
						label="Lowest comfortable note"
						value={activeVoice.characteristics?.rangeLow}
						font={notationFont}
						onchange={(p) => setCharacteristic('rangeLow', p)}
					/>
					<NotePicker
						label="Highest comfortable note"
						value={activeVoice.characteristics?.rangeHigh}
						font={notationFont}
						onchange={(p) => setCharacteristic('rangeHigh', p)}
					/>
					{#if rangeInverted}
						<p class="charx-note" role="status">The lowest note is set above the highest.</p>
					{/if}
				</div>
				<div class="charx-group">
					<h3 class="charx-heading">Tessitura</h3>
					<!-- Kimi's ruled copy, verbatim (v39 §A.31). -->
					<p class="charx-hint">Where you live, not your edges.</p>
					<NotePicker
						label="Tessitura floor"
						value={activeVoice.characteristics?.tessituraLow}
						font={notationFont}
						onchange={(p) => setCharacteristic('tessituraLow', p)}
					/>
					<NotePicker
						label="Tessitura ceiling"
						value={activeVoice.characteristics?.tessituraHigh}
						font={notationFont}
						onchange={(p) => setCharacteristic('tessituraHigh', p)}
					/>
					{#if tessituraInverted}
						<p class="charx-note" role="status">The tessitura floor is set above its ceiling.</p>
					{/if}
				</div>
				<div class="charx-group">
					<h3 class="charx-heading">Passaggio</h3>
					<!-- Kimi's example string redrafted agentless (the §A.31 copy
					     flag): the app never speaks as "Shane". -->
					<p class="charx-hint">The zona lies between two turns, a lower and an upper. Enter both to flag it; with either blank it stays unmarked, which does not mean it is absent.</p>
					<NotePicker
						label="Primary passaggio"
						value={activeVoice.characteristics?.passaggioPrimary}
						font={notationFont}
						onchange={(p) => setCharacteristic('passaggioPrimary', p)}
					/>
					<NotePicker
						label="Secondary passaggio"
						value={activeVoice.characteristics?.passaggioSecondary}
						font={notationFont}
						onchange={(p) => setCharacteristic('passaggioSecondary', p)}
					/>
				</div>
				<button type="button" class="wizard-primary" onclick={() => (phase = 'summary')}>
					Done
				</button>
			</div>
		{/if}
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
		/* Outer padding (20px top, 40px bottom, 1rem sides) now comes from the
		   shared .shane-panel column in +page.svelte, which wraps the whole Fit
		   drawer so it reads as one surface with the Transcription drawer
		   (Dann's consistency ruling, 2026-07-12; unified 2026-07-13). */
		padding: 0;
	}

	/* Drawer-margin alignment (Dann, 2026-07-12): the wizard's structural
	   elements (phase container, roster, banners) span the panel's full
	   width, sharing the transcription panel's 1rem content edges, so the
	   two drawers read as one designed surface. Prose lines keep a
	   readable measure inside that width. */
	.wizard-phase {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.875rem;
		width: 100%;
	}

	/* The collapse body wrapper reproduces the section's own column layout
	   (flex, centred, 1rem gap), so wrapping the switcher and phases for
	   the Q3 accordion moves nothing visually. */
	.wizard-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	/* The Q3 compact header: the phase-heading recipe (sans smallcaps,
	   0.12em tracking, the Fit drawer's deeper lavender), rendered as one
	   full-width accordion row. The chevron column is fixed-width so the
	   label does not shift when the glyph flips. */
	.wizard-compact-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		background: none;
		border: none;
		padding: 0.125rem 0;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--deeper-lavender);
		font-weight: 600;
		text-align: left;
		cursor: pointer;
	}
	.wizard-compact-toggle:hover {
		color: var(--ink-primary);
	}
	.wizard-compact-chevron {
		display: inline-block;
		width: 0.875rem;
		font-size: 0.75rem;
		line-height: 1;
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

	/* Drawer kinship (Dann, 2026-07-12): the wizard adopts Ilya's drawer
	   vocabulary — the phase heading renders in the section-label recipe
	   (sans smallcaps, 0.12em tracking, the tab's accent colour: sage on
	   Ilya, deeper lavender here), and a 2px accent rule fences the
	   working area from the voice switcher, echoing the transcription
	   panel's fenced console. Headings stay h2 semantically. */
	.wizard-phase {
		border-top: 2px solid var(--deeper-lavender);
		padding-top: 0.875rem;
	}

	.wizard-phase h2 {
		margin: 0;
		width: 100%;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--deeper-lavender);
		font-weight: 600;
		text-align: left;
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

	/* The count-in beat and the capture bar (item 1.4a interaction, E.26).
	   Deliberately plain: this is the wizard's own furniture, not the result
	   surface, and it borrows the same tokens as everything else here. */
	/* The caption under the invitation to sing the remaining three. Quieter than
	   the button above it, because the button is the action and this explains
	   it. */
	.wizard-caption {
		margin: 0.375rem 0 0;
		max-width: 26rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		line-height: 1.45;
		text-align: center;
		color: var(--ink-tertiary);
	}

	.wizard-count {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1;
		color: var(--ink-secondary);
		font-variant-numeric: tabular-nums;
	}

	.readiness-meter {
		width: 100%;
		max-width: 18rem;
		height: 0.375rem;
		border-radius: 999px;
		background: var(--stone-300);
		overflow: hidden;
	}
	.readiness-meter-fill {
		height: 100%;
		background: var(--sage);
		/* No CSS transition: the width is driven per frame from one clock, so a
		   transition would add a second, slower clock that disagrees with it. */
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
	/* Item 1.4b. Deliberately the quietest tier available and deliberately NOT
	   --prep-amber: amber is the project's "something about your sample needs
	   your attention" colour, and an unmeasurable room is not that. It is a
	   statement about our instrument. */
	.wizard-roster-noisefloor {
		display: block;
		font-size: 0.6875rem;
		font-weight: 400;
		color: var(--ink-tertiary);
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
	/* The sung-[o] note glyph: quiet and tertiary by ruling — no border,
	   no fill, no animation. The markup gates it to the summary surface. */
	.wizard-info-glyph {
		background: none;
		border: none;
		padding: 0 0.25rem;
		margin-left: 0.125rem;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		line-height: 1;
		color: var(--ink-tertiary);
		cursor: pointer;
	}
	.wizard-info-glyph:hover {
		color: var(--ink-secondary);
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

	/* ── Voice characteristics (E.5 slice 3) ─────────────────────────────
	   Groups fence with a quiet rule; the group heading takes a smaller
	   cut of the phase-heading recipe so the hierarchy reads at a glance. */
	.charx-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		padding-top: 0.625rem;
		border-top: 1px solid var(--stone-300);
	}
	.charx-heading {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--ink-tertiary);
		font-weight: 600;
		text-align: left;
	}
	.charx-hint {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--ink-tertiary);
		line-height: 1.4;
	}
	.charx-note {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.8125rem;
		color: var(--prep-amber);
		line-height: 1.4;
	}

	.wizard-quiet-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* The hold slot: space for the post-capture banner is reserved even
	   while empty (Dann's direction, 2026-07-11, evening), so the roster
	   below holds still when a banner lands. The min-height covers the
	   banner's tallest common form (a two-line message plus the
	   Continue/Re-take row); a rarer taller wrap grows the slot, never
	   overlaps. */
	.wizard-hold-slot {
		width: 100%;
		min-height: 6.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
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
