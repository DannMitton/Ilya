<script lang="ts">
	/**
	 * The guided-director calibration wizard, user-facing name "Your
	 * Resonances" (the drawer's Voice surface).
	 *
	 * Source of record: shane-calibration-wizard-spec_v1_2026-06-30.md,
	 * reconciled between Claude and Kimi over two review rounds, recorded in
	 * handover v27. This wraps the capture ritual (spec
	 * v11 §3, §4, §6, §7, §8, §11) in four phases — Welcome, Readiness,
	 * Capture, Profile summary — plus the skippable Voice
	 * characteristics phase behind the summary (E.5 slice 3, Kimi's Q5
	 * ruling, v39 §A.31). N.199 Step 8 (Dann 2026-11-14 21:03): the capture
	 * phase is `VowelCapture.svelte` for every singer, one vowel at a time.
	 * The wheel this paragraph once described is deleted. This wizard hands
	 * the capture screen its opening (`opening`) and the guarded reading
	 * (`commitReading`), and decides nothing about the take itself.
	 *
	 * Locked port order (spec v1 §2): (1) this wizard, built and clickable
	 * end to end against StubCaptureSession, with the readiness phase as UI
	 * and permission scaffolding only, its measurements mocked because the
	 * stub cannot supply live audio; (2) the live CaptureSession, gated on
	 * Dann's separate go; (3) polish (toast-threshold tuning, copy). Step
	 * 2's capture side landed 2026-07-02: the capture screen runs
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
	 * Replaces the earlier placeholder shell (Ilya2006B fold-in).
	 */
	import { onMount, untrack } from 'svelte';
	import { spokenName } from '$lib/voice/vowel-names';
	import FrSym from '$lib/voice/FrSym.svelte';
	// N.199: the capture screen and the sheet on the summary, for every singer.
	import { captureSessionFor } from '$lib/voice/chart/stub-switch';
	import SummarySheet from '$lib/voice/chart/SummarySheet.svelte';
	import VowelCapture from '$lib/voice/VowelCapture.svelte';
	import { addTake, type TakeRecord } from '$lib/voice/takes';
	import { openRetake, openTour, type Opening } from '$lib/voice/chart/opening';
	import { landingFor, requestRefused, type VoiceRequest, type VoiceSeam } from '$lib/voice/seam';
	import { t, type Language } from '$lib/i18n';
	import Italics from '$lib/components/Italics.svelte';
	import InsightsIntake from '$lib/voice/InsightsIntake.svelte';
	import VoiceTypeIntake from '$lib/voice/VoiceTypeIntake.svelte';
	import VoiceTypeFirst from '$lib/voice/VoiceTypeFirst.svelte';
	import OutsideNote from '$lib/voice/OutsideNote.svelte';
	import { outsideVowels } from '$lib/voice/outside';
	import NotePicker from '$lib/voice/NotePicker.svelte';
	import type { CaptureSession } from '$lib/voice/engine/session';
	import {
		READINESS_CAPTURE_MS,
		READINESS_PREP_MS,
		type ReadinessResult
	} from '$lib/voice/engine/readiness';
	import type { CaptureError } from '$lib/voice/engine/errors';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/score/notation-fonts';
	import { pitchToMidi, type IntakeAnswers, type Pitch } from '@ilya/score-parser';
		import { applyIghDivergence } from '$lib/voice/engine/divergence';
	import { anchorF1sFor, checkPlausibility, buildPlausibilityEvent, keepReading } from '$lib/voice/engine/plausibility';
	import {
		loadStore,
		saveStore,
		newVoiceId,
		// N.73 S3: lifted out of this file so the drawer's voice anchor and
		// this wizard cannot disagree about whether a voice is calibrated.
		hasAnyReadings,
		assignToVoice, touchVoice,
		type VoiceTypeChoice,
		type ProfileStore,
		type StoredVoice,
		type ReadinessRecord
	} from '$lib/voice/profileStore';
	import type {
		Vowel,
		CalibratedFormant,
		VoiceCharacteristics
	} from '$lib/voice/engine/types';

	// ── Locked upstream (spec v1 §1, §2) ──────────────────────────────────────
	// The seven default vowels, in the spec's fixed counterclockwise order.
	// The other three are offered afterward from the summary and are not
	// required to finish (spec v1 §2 Phase 2, "the remaining two default vowels
	// and the optional three extend a bespoke profile but are not required").
	//
	// RENAMED 2026-08-04 on Dann's ruling, and the word mattered enough to move
	// an identifier: **none of the ten vowels is optional.** All ten are
	// necessary for sung Russian. Five are the floor the four derivations
	// consume (`FLOOR_ANCHORS`, formerly in the deleted wheel); seven are what the tour asks;
	// these three are simply the hardest for a new singer to produce on demand,
	// so Ilya derives them as an assistance until the singer chooses to sing
	// them. **`OPTIONAL_VOWELS` encoded a claim about importance that is false,
	// and a singer reading the surface it fed would have inherited it.**
	const DEFAULT_VOWELS: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u'];
	const CHALLENGING_VOWELS: Vowel[] = ['ɨ', 'ɪ', 'ʌ'];
	const ALL_VOWELS: Vowel[] = [...DEFAULT_VOWELS, ...CHALLENGING_VOWELS];
	// The default-name base ("Voice 1", "Voice 2", …), Kimi's ruling:
	// domain-appropriate, scales to variants and guests without special
	// pleading. N.22: DEFAULT_NAME_BASE moved below the props destructure
	// (declared there, see near `const T =`) so it can read
	// calib.defaultVoiceName through T(), which needs `language`.

	// 'characteristics' is the fifth phase (E.5 slice 3; Kimi's Q5 ruling,
	// v39 §A.31): typed range/tessitura/passaggio through note pickers.
	// Skippable and never a gate — entered only through the quiet summary
	// button (Dann's slice-3 decision, 2026-07-13), and Done returns to
	// the summary. Editable later through the same button.
	// N.164 (Dann, 2026-09-25) adds a second door: Insights' "Add your
	// range" opens here directly, through `openRequest`.
	type Phase = 'welcome' | 'readiness' | 'capture' | 'summary' | 'characteristics';

	interface CalibrationWizardProps {
		/**
		 * The auditory input, injectable (the capture screen's `session` is
		 * this one). Defaults to the live session, so
		 * the page shell needs no change; a harness can pass a
		 * StubCaptureSession to drive the readiness and capture paths without a
		 * microphone. This replaces the retired `readinessOutcome` hook, which
		 * forced a mocked outcome the gate no longer produces.
		 */
		session?: CaptureSession;
		/** Fires with each guarded reading as it is stored, so a future parent can subscribe. */
		onVowelCaptured?: (vowel: Vowel, formant: CalibratedFormant) => void;
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
		 * either changes, including the paths a per-capture callback
		 * cannot see: hydration on mount, voice switching,
		 * creation, duplication, deletion, rename, and Start over. This is
		 * the main pane's subscription — the Voice Profile envelope
		 * (MarkupPane.svelte, handover v30 §C.1) mirrors the
		 * workshop's readings through the page shell, so the gallery always
		 * shows the voice the drawer is working on, and its TitleHeader
		 * carries the voice's name (Dann's page-furniture ruling in review).
		 * The name is undefined only before first-launch naming.
		 */
		onActiveProfileChange?: (
			formants: Partial<Record<Vowel, CalibratedFormant>>,
			voiceName: string | undefined,
			characteristics: VoiceCharacteristics | undefined,
			/**
			 * The voice's `updatedAt`, ISO 8601. N.127 increment 1 prints it on
			 * Insights' identity line, which closes N.19: written five times,
			 * rendered nowhere (`memo-release-audit-b_r1_2026-08-24.md`).
			 * Additive, so the other readers of this callback are unchanged.
			 */
			updatedAt?: string,
			/** N.172: the voice's Insights intake answers. Additive, like `updatedAt`. */
			intake?: IntakeAnswers,
			/** Voice type slice A: the declared type, which Insights prints. Additive. */
			voiceType?: VoiceTypeChoice
		) => void;
		/**
		 * Q3 wizard collapse (Kimi's §A.28 ruling, 2026-07-13): counts
		 * successful score renders on the Markup page — loaded, parsed,
		 * AND rendered; a load failure never increments (the error belongs
		 * `scoreRenders` AND `collapsed` ARE GONE, N.114b item 8. They were
		 * this component's whole collapse mechanism and it has no collapse
		 * any more; the takeover surface is the wizard's own, so a render on
		 * the page behind it has nothing to ask of the ritual.
		 */
		/**
		 * Opens the Learn module's sung-[o] note (anchor learn-u3-note-o).
		 * The sung-[o] précis ruling (Kimi 2026-07-11; copy Dann's, approved
		 * same day): ONE quiet tertiary ⓘ glyph on the [o] roster row is the
		 * whole affordance — the glyph is the affordance ceiling, there is
		 * no per-vowel framework (Dann gates each vowel individually, and
		 * only [o] is ruled), and it is hidden mid-wizard: the glyph renders
		 * on the summary surface only, never inside a capture ritual. The
		 * return path is the Markup page itself; the wizard rehydrates to the
		 * summary because the voice has readings.
		 */
		onOpenLearnNote?: () => void;
		/** N.22: active display language, threaded to the i18n dictionary. */
		language: Language;
		/**
		 * N.164: a parent's request to show a phase. Each new `n` lands the
		 * wizard on `phase`, wherever it was, because the wizard stays mounted
		 * while the takeover is stowed and a value read once at mount would
		 * work only the first time. Insights' "Add your range" sends
		 * `characteristics`, the Range fields. Absent, nothing changes.
		 * N.203 lane 60: the pane's doors send `record`, `summary`, or `characteristics`
		 * (`seam.ts`), and a request carries `fromRest`.
		 */
		openRequest?: VoiceRequest | null;
		/** N.203 lane 60: the voices, the active id, and the commands, published whole for the pane at rest (`seam.ts`). */
		onSeamChange?: (seam: VoiceSeam) => void;
	}

	let {
		// The live auditory input (locked port order step 2). One session
		// instance for the wizard's lifetime; each capture and each readiness
		// run opens and releases the microphone itself, so the mic indicator
		// rests dark between them. Construction touches no browser API;
		// getUserMedia is requested only inside start() and startReadiness().
		session: captureSession = captureSessionFor(),
		onVowelCaptured,
		onComplete,
		onActiveProfileChange,
		onOpenLearnNote,
		language,
		openRequest = null,
		onSeamChange
	}: CalibrationWizardProps = $props();

	// N.22: dictionary lookup, following ScoreUploader.svelte and
	// MarkupPane.svelte's convention.
	const T = (key: string) => t(key, language);
	// Reactive, for names not yet created: a voice added while the page is in
	// French should be offered as "Voix 3".
	const DEFAULT_NAME_BASE = $derived(T('calib.defaultVoiceName'));
	// NOT reactive, deliberately. `loadStore` runs once at construction and the
	// name it falls back to is PERSISTED. A derived here would rename a voice
	// the singer has already saved whenever they switch language, which is
	// rewriting their own data underneath them.
	// svelte-ignore state_referenced_locally
	const INITIAL_NAME_BASE = t('calib.defaultVoiceName', language);

	// ── The voice store (Phase 2b v2, multiple named voices, 2026-07-11) ─────
	// One read at construction; a v1 single profile migrates transparently
	// to become the first named voice. All mutations flow through the
	// functions below and save the whole store, failure-silent.
	let store = $state<ProfileStore>(loadStore(`${INITIAL_NAME_BASE} 1`));
	let activeVoice = $derived(store.voices.find((v) => v.id === store.activeId));
	let opening = $state<Opening>({ start: 'i' }); // where the new capture screen opens, and any list it walks
	let voiceType = $derived(activeVoice?.voiceType); // Voice type slice A: the guard routes from the stored Tier 1 id.
	// The smallest unused sequential default, so deletions never cause
	// name collisions ("Voice 2" existing skips to "Voice 3").
	let nextDefaultName = $derived.by(() => {
		const names = new Set(store.voices.map((v) => v.name));
		let n = store.voices.length + 1;
		while (names.has(`${DEFAULT_NAME_BASE} ${n}`)) n += 1;
		return `${DEFAULT_NAME_BASE} ${n}`;
	});

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
	 * The capture screen reads the guarded profile this pass writes, so a
	 * downgraded [ɨ] is drawn as the profile holds it.
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
		const res = checkPlausibility(formant.f1, vowel, voiceType, anchorF1sFor(profile));
		const out: CalibratedFormant = { ...formant, plausibility: res.plausibility };
		if (res.plausibility === 'implausible' && out.reading === 'captured')
			out.reading = 'provisional';
		// No re-prompt is ever shown now (2026-09-30, `outside.ts`); the field stays in the ruled schema.
		const rePromptShown = false;
		console.info(
			'[voice] plausibility',
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

	/* N.164: answer each new `openRequest` once. Refused only for "Add your range" pressed over the capture screen (`requestRefused`); a
	   refused request is dropped. A `record` request meets a fresh capture screen: `captureKey` remounts it on the vowel `openTour` names. */
	let answeredRequest = 0;
	let captureKey = $state(0);
	$effect(() => {
		const req = openRequest;
		if (!req || req.n === answeredRequest) return;
		answeredRequest = req.n;
		untrack(() => {
			if (requestRefused(phase, req)) return;
			const to = landingFor(req.phase, hasAnyReadings(profile));
			if (to === 'capture') { opening = openTour(profile); captureKey += 1; }
			resetFlow(to);
		});
	});

	let outside = $derived(outsideVowels(profile, ALL_VOWELS)); // The summary's one note (`outside.ts`).
	// The voice type is asked before the first vowel only if the voice had none on arrival (Dann, 2026-09-30 12:44).
	let askTypeFirst = $state(false);
	$effect(() => { if (phase === 'welcome' && store.activeId) askTypeFirst = !untrack(() => voiceType); });

	// ── Q3 WIZARD COLLAPSE, GONE (N.114b item 8) ─────────────────────────────
	// Two effects, `seenScoreRenders`, `pendingCollapse` and the compact label
	// pair lived here. They collapsed the wizard to a one-line header on each
	// fresh score render, deferring mid-capture so the ritual was never torn
	// down (Kimi §A.28; Dann's deferral ruling, 2026-07-13). The takeover
	// surface made the ceding pointless and Dann ruled the row away
	// 2026-09-10. `calib.compact.vowelsSampled` is marked UNUSED in `i18n.ts`
	// rather than deleted, the way this tree's retired strings are.

	function persistStore() {
		saveStore($state.snapshot(store) as ProfileStore);
	}

	// ── Voice characteristics (E.5 slice 3; Kimi's Q5 ruling, v39 §A.31) ─────
	// The six pickers share one notation font load (memoized in the shared
	// loader; the Markup page's own load makes this a cache hit). Failure falls
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
		touchVoice(v);
		persistStore();
	}

	/** N.172 and voice type slice A: the singer's own answers save on every change, like the characteristics. */
	function setOwn(patch: Parameters<typeof assignToVoice>[1]) {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (v) { assignToVoice(v, patch); persistStore(); }
	}

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
		v.updatedAt = v.calibratedAt = new Date().toISOString();
		persistStore();
	}

	// ── Voice management (consensus, 2026-07-11) ─────────────────────────────
	/** Interrupt everything transient and land on the given phase. */
	function resetFlow(to: Phase) {
		// A readiness run holds the microphone, so leaving the phase must
		// release it. A capture in flight is the capture screen's: it ends the
		// take when it unmounts (`ritual.destroy()`).
		if (phase === 'readiness') captureSession.cancel();
		readinessResult = undefined;
		readinessError = undefined;
		readinessStep = 'quiet';
		readinessCount = '';
		readinessProgress = 0;
		clearReadinessTimers();
		clearAllTimers();
		confirmingReset = false;
		toastVisible = false;
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
	// vowel steps (the deleted wheel's `beginPrepare` and its `SWEEP_MS` arc;
	// the capture screen's count-in is `count-in.ts`).
	let readinessStep = $state<'quiet' | 'prepare' | 'capture' | 'done' | 'unmeasured'>('quiet');
	let readinessResult = $state<ReadinessResult | undefined>(undefined);
	let readinessError = $state<CaptureError | undefined>(undefined);
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
	 * delivery time", `SWEEP_MS` in the deleted wheel). If they disagree, the bar is
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
	// upright roman subscript R1 or R2 (a label, not a product of variables), set as
	// a true subscript slightly smaller than the base, the R a full capital: Titze et al. (2015), Table I (Dann 2026-11-13 15:44).
	// See `FrSym.svelte` (lifted from the wizard's snippet, N.199 Step 1). One source in the code; the convention extends across the
	// whole app as other surfaces are touched.
	let logAnnounce = $state('');

	// Start over (Phase 2b): clearing a voice's captures deserves one
	// deliberate confirmation, phrased as a question naming the action,
	// never a verdict. It clears readings only; the voice keeps its name.
	let confirmingReset = $state(false);

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
		touchVoice(v);
		persistStore();
	}

	// N.199 Step 5: a take's record, written as `recordReadiness` writes (not `persist()`, which moves the calibration date).
	function recordTake(rec: TakeRecord) {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (v) { addTake(v, rec); persistStore(); }
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
				// at a third of the countdown each, then the bar. Not shared with
				// the vowel steps, whose beat is `SING_BEAT_MS` (`count-in.ts`).
				readinessStep = 'prepare';
				readinessCount = T('calib.readiness.countThree');
				readinessProgress = 0;
				const beat = READINESS_PREP_MS / 3;
				readinessTimers.push(setTimeout(() => (readinessCount = T('calib.readiness.countTwo')), beat));
				readinessTimers.push(setTimeout(() => (readinessCount = T('calib.readiness.countOne')), 2 * beat));
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
	function beginCapture() {
		opening = openTour(profile);
		phase = 'capture';
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

	// ── A reading, from the capture screen ──────────────────────────────────
	// A reading into the profile (guard, [ɨ] pass, save, announcement): the capture screen's `onCaptured`.
	function commitReading(vowel: Vowel, formant: CalibratedFormant): CalibratedFormant {
		const checked = withPlausibility(vowel, formant);
		profile = withIghPass({ ...profile, [vowel]: checked });
		persist();
		// The announcement uses the post-pass reading: a divergent [ɨ] that the
		// pass resolved to Provisional must not be announced as captured.
		const effective = profile[vowel] ?? checked;
		// The polite data delivery (Kimi, 2026-07-10): the number's first
		// availability to non-visual users. Speakable name, never the raw glyph
		// (§4.6 discipline).
		logAnnounce = `${T('calib.log.addedPrefix')} ${spokenName(vowel, language)}, ${Math.round(effective.f1)} ${T('calib.log.hertz')}, ${readingLabel(effective.reading)}.`;
		onVowelCaptured?.(vowel, effective);
		return effective;
	}

	/** The summary's Keep (`outside.ts`): the singer's measured voice outranks an approximate band. */
	function keepOutside(vowels: Vowel[]) {
		const next = { ...profile };
		for (const g of vowels) {
			const f = next[g];
			if (!f) continue;
			next[g] = keepReading(f);
			console.info('[voice] plausibility override', JSON.stringify({ vowel: g, f1: f.f1, kept: true, guardSessionId }));
		}
		profile = next;
		persist();
	}

	/** The summary's way back to the ten vowels (sheet line 25): the next vowel Ilya's order has not got, or, with nothing recorded, Welcome. */
	function backToTen() {
		if (!hasAnyReadings(profile)) { phase = 'welcome'; return; }
		opening = openTour(profile);
		phase = 'capture';
	}

	function retakeFromSummary(vowel: Vowel, ...more: Vowel[]) {
		// A pass over the vowels named (`more`: the summary note's Re-take sings
		// every vowel it names); the capture screen returns to the summary when
		// the pass has run out.
		opening = openRetake([vowel, ...more]);
		phase = 'capture';
	}

	/** Finish closes the takeover and writes nothing: `persist()` would move `calibratedAt`, the date INSIGHTS prints. */
	function finish() {
		onComplete?.(profile);
	}

	// ── Start over: clears the active voice's readings, keeps its name ──────
	function confirmReset() {
		const v = store.voices.find((x) => x.id === store.activeId);
		if (v) delete v.takes; // Start over clears the take record with the readings
		profile = {};
		persist();
		resetFlow('welcome');
	}

	function readingLabel(reading: CalibratedFormant['reading'] | undefined): string {
		switch (reading) {
			case 'captured':
				return T('calib.roster.reading.captured');
			case 'provisional':
				return T('calib.roster.reading.provisional');
			default:
				return '';
		}
	}

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
			$state.snapshot(activeVoice?.characteristics) as VoiceCharacteristics | undefined,
			// `updatedAt` is read so every write re-publishes; the value sent is the
			// readings' own date, `calibratedAt`, which Insights prints (desk, 2026-09-30).
			activeVoice?.updatedAt && (activeVoice.calibratedAt ?? activeVoice.updatedAt),
			$state.snapshot(activeVoice?.intake) as IntakeAnswers | undefined,
			{ voiceType, voiceTypeSpecific: activeVoice?.voiceTypeSpecific, voiceTypeOther: activeVoice?.voiceTypeOther }
		);
	});

	// The seam (`seam.ts`): one object, republished whenever the list, the active voice, or the next default name changes.
	$effect(() => {
		onSeamChange?.({
			voices: store.voices.map((v) => ({ id: v.id, name: v.name, createdAt: v.createdAt })),
			activeId: store.activeId,
			nextDefaultName,
			select: selectVoice,
			create: (n) => createVoice(n),
			duplicate: duplicateActiveVoice,
			rename: renameActiveVoice,
			remove: deleteActiveVoice,
			setOwn
		});
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
	>{spokenName(g, language)}{/snippet}

<section class="calibration-wizard" aria-label={T('calib.section.ariaLabel')}>
	<!-- The dedicated polite live region for roster announcements (Kimi
	     consensus, 2026-07-10). A single-purpose hidden region rather than
	     aria-live on the table itself: table semantics plus live region
	     semantics can double-announce or announce structural noise.
	     Rendered unconditionally so the region exists before its first
	     update, which some screen readers require to announce reliably. -->
	<div class="visually-hidden" role="status">{logAnnounce}</div>

	<!-- THE Q3 COLLAPSE HEADER IS GONE, N.114b item 8, RULED BY DANN 2026-09-10
	     walking `8278429`. Kimi §A.28 built it to cede the score drawer (then Fit's) to the
	     score once a score had rendered; N.73 S3 gave calibration a TAKEOVER
	     surface of its own, so there has been nothing to cede since, and the row
	     folded the whole ritual away and left an empty drawer.

	     THE WHOLE COLLAPSE WENT WITH IT, not just the row: the `collapsed`
	     binding, the `scoreRenders` prop that drove it, the two effects that
	     collapsed on a fresh render and deferred that mid-capture, the compact
	     label pair, and three rules. This component is mounted in ONE place,
	     `+page.svelte`'s `voiceTakeover` snippet, so there is no second surface
	     where the fold still had a job and nothing needed scoping.

	     DESK DEFAULT, ruled reversible: the body is always shown. -->
	<div class="wizard-body" id="calibration-wizard-body">
	<!-- N.203 lane 60: the switcher is in the VOICE pane at rest (`VoicePane.svelte`, by the seam). Here the voice's name is a plain label at the head of each screen; the summary's sheet carries it on its own line, so the label is not drawn there. -->
	{#if activeVoice && phase !== 'summary'}<p class="wizard-voice-name">{activeVoice.name}</p>{/if}

	{#if activeVoice}
		{#if phase === 'welcome'}
			<div class="wizard-phase">
				<h2 id="wizard-title">{T('calib.welcome.title')}</h2>
				<!-- Phase 0 onboarding copy, Dann's draft (2026-07-01), closing the
				     placeholder flagged in wizard spec v1 §5 / pacifier spec v11 §15. -->
				<p class="wizard-lede">
					{T('calib.welcome.lede')}
				</p>
				<details class="wizard-expander">
					<summary>{T('calib.welcome.fryQuestion')}</summary>
					<!-- Placeholder: the newcomer fry-description copy is deferred
					     (wizard spec v1 §5; pacifier spec v11 §17). Ground in Titze
					     1988 and Roubeau et al. 2009 when drafted. -->
					<p>
						{T('calib.welcome.fryAnswer')}
					</p>
				</details>
				{#if askTypeFirst}<VoiceTypeFirst value={voiceType} {language} onchange={(id) => setOwn({ voiceType: id })} />{/if}
				<button type="button" class="wizard-primary" onclick={beginReadiness}>{T('calib.welcome.beginButton')}</button>
			</div>
		{:else if phase === 'readiness'}
			<div class="wizard-phase" aria-live="polite">
				<h2 id="wizard-title">{T('calib.readiness.title')}</h2>
				{#if readinessStep === 'quiet'}
					<p class="wizard-lede">{T('calib.readiness.quiet')}</p>
				{:else if readinessStep === 'prepare'}
					<!-- The count-in. Copy RATIFIED by Dann 2026-09-30 23:42. The shape
					     was ruled first: the singer is told what is
					     coming and given time to draw breath before anything is
					     collected. Nothing is recorded during this step. -->
					<p class="wizard-lede">{T('calib.readiness.prepareLede')}</p>
					<p class="wizard-count" aria-hidden="true">{readinessCount}</p>
				{:else if readinessStep === 'capture'}
					<!-- Copy RATIFIED by Dann 2026-09-30 23:42. The bar is the point: it
					     says the microphone is hearing them AND when they have given
					     enough, which is the pair Dann named. -->
					<p class="wizard-lede">{T('calib.readiness.captureLede')}</p>
					<div
						class="readiness-meter"
						role="progressbar"
						aria-label={T('calib.readiness.captureAria')}
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={Math.round(readinessProgress * 100)}
					>
						<div class="readiness-meter-fill" style="width: {readinessProgress * 100}%"></div>
					</div>
				{:else if readinessStep === 'unmeasured'}
					<!-- The abstention (item 1.4a, "abstain with no microphone").
					     Copy RATIFIED by Dann 2026-09-30 23:42. The register:
					     it states what happened, assigns no fault, and names
					     the next action, and Ilya, not "we", is the one that
					     could not hear. What must not change is the shape: the gate
					     makes no claim about the room or the fry here, and it
					     does not block. -->
					{#if readinessNoMic}
						<p class="wizard-lede">
							{T('calib.readiness.noMic')}
						</p>
					{:else}
						<p class="wizard-lede">{T('calib.readiness.noFry')}</p>
					{/if}
					<p class="wizard-guidance">
						{T('calib.readiness.guidance')}
					</p>
					<button type="button" class="wizard-primary" onclick={beginCapture}>{T('calib.common.continue')}</button>
				{:else}
					<p class="wizard-lede">{T('calib.readiness.complete')}</p>
					{#if fryMarginal}
						<p class="wizard-guidance">
							{T('calib.readiness.marginal')}
						</p>
					{/if}
					<button type="button" class="wizard-primary" onclick={beginCapture}>{T('calib.common.continue')}</button>
				{/if}
			</div>
		{:else if phase === 'capture'}
			<div class="wizard-phase">
				<!-- The room notice (N.199 Step 8, B2): raised by `beginCapture` when the room read lively, above the screen so it is seen. -->
				{#if toastVisible}
					<div class="wizard-toast" role="status">
						<p>
							{T('calib.capture.toast')}
						</p>
						<button
							type="button"
							class="wizard-toast-dismiss"
							onclick={dismissToast}
							aria-label={T('calib.capture.toastDismissAria')}>×</button
						>
					</div>
				{/if}
				{#key captureKey}<VowelCapture session={captureSession} {language} {voiceType} {profile} startVowel={opening.start} pass={opening.pass}
					onCaptured={commitReading} onTake={recordTake} onReturn={() => (phase = 'summary')} onClearAll={confirmReset} />{/key}
			</div>
			{:else if phase === 'summary'}
				<!-- YOUR VOWEL SPACE (N.203 lane 60, Step 5; plan r4 section 4.5). The sheet is the whole summary: the note on readings outside Ilya's values, then the chart, the one table with the roster's marks in it, the legend, the sources, and Print (`VowelSpaceSheet.svelte`). Finish is filled and leads; the way back to the ten vowels and Start over are quiet (Dann 2026-09-10, "Filled Finish ... in that order"). Finish writes nothing: every reading was saved when it was captured, so a singer who only looked must not re-date them. -->
				<div class="wizard-phase">
					{#if outside.length}<OutsideNote vowels={outside} {voiceType} {language} tag={vowelTag} onkeep={() => keepOutside(outside)} onretake={() => retakeFromSummary(outside[0], ...outside.slice(1))} />{/if}
					<SummarySheet {profile} {voiceType} {language} voiceName={activeVoice?.name} {onOpenLearnNote} />
					<button type="button" class="wizard-primary" onclick={finish}>{T('calib.summary.finishButton')}</button>
					<button type="button" class="wizard-secondary" onclick={backToTen}>{T('calib.summary.backToTen')}</button>
					{#if confirmingReset}
						<div class="wizard-inline-banner">
							<p>{T('calib.summary.resetConfirm')}</p>
							<div class="wizard-hold-actions">
								<button type="button" onclick={confirmReset}>{T('calib.summary.startFreshButton')}</button>
								<button type="button" onclick={() => (confirmingReset = false)}>{T('calib.summary.keepProfileButton')}</button>
							</div>
						</div>
					{:else if hasAnyReadings(profile)}
						<button type="button" class="wizard-secondary" onclick={() => (confirmingReset = true)}>{T('calib.summary.startOverButton')}</button>
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
				<h2 id="wizard-title">{T('calib.characteristics.title')}</h2>
				<p class="wizard-lede">
					{T('calib.characteristics.lede')}
				</p>
				<div class="charx-group"><VoiceTypeIntake value={activeVoice} {language} onchange={setOwn} /></div>
				<div class="charx-group">
					<h3 class="charx-heading">{T('calib.characteristics.rangeHeading')}</h3>
					<NotePicker
						label={T('calib.characteristics.rangeHighLabel')}
						value={activeVoice.characteristics?.rangeHigh}
						font={notationFont}
						{language} {voiceType}
						onchange={(p) => setCharacteristic('rangeHigh', p)}
					/>
					<NotePicker
						label={T('calib.characteristics.rangeLowLabel')}
						value={activeVoice.characteristics?.rangeLow}
						font={notationFont}
						{language} {voiceType}
						onchange={(p) => setCharacteristic('rangeLow', p)}
					/>
					{#if rangeInverted}
						<p class="charx-note" role="status">{T('calib.characteristics.rangeInvertedNote')}</p>
					{/if}
				</div>
				<div class="charx-group">
					<h3 class="charx-heading">{T('calib.characteristics.tessituraHeading')}</h3>
					<!-- Kimi's ruled copy, verbatim (v39 §A.31). Higher limits first in all three groups (Dann, 2026-09-28 15:40). -->
					<p class="charx-hint">{T('calib.characteristics.tessituraHint')}</p>
					<NotePicker
						label={T('calib.characteristics.tessituraHighLabel')}
						value={activeVoice.characteristics?.tessituraHigh}
						font={notationFont}
						{language} {voiceType}
						onchange={(p) => setCharacteristic('tessituraHigh', p)}
					/>
					<NotePicker
						label={T('calib.characteristics.tessituraLowLabel')}
						value={activeVoice.characteristics?.tessituraLow}
						font={notationFont}
						{language} {voiceType}
						onchange={(p) => setCharacteristic('tessituraLow', p)}
					/>
					{#if tessituraInverted}
						<p class="charx-note" role="status">{T('calib.characteristics.tessituraInvertedNote')}</p>
					{/if}
				</div>
				<div class="charx-group">
					<h3 class="charx-heading"><Italics text={T('calib.characteristics.passaggioHeading')} /></h3>
					<!-- Kimi's example string redrafted agentless (the §A.31 copy
					     flag): the app never speaks as an agent. -->
					<p class="charx-hint"><Italics text={T('calib.characteristics.passaggioHint')} /></p>
					<NotePicker
						label={T('calib.characteristics.passaggioSecondaryLabel')}
						value={activeVoice.characteristics?.passaggioSecondary}
						font={notationFont}
						{language} {voiceType}
						onchange={(p) => setCharacteristic('passaggioSecondary', p)}
					/>
					<NotePicker
						label={T('calib.characteristics.passaggioPrimaryLabel')}
						value={activeVoice.characteristics?.passaggioPrimary}
						font={notationFont}
						{language} {voiceType}
						onchange={(p) => setCharacteristic('passaggioPrimary', p)}
					/>
				</div>
				<!-- N.172: the Insights intake, one panel with the questions and the
				     topic switches (Dann, 2026-09-24 23:21), beside the fields it
				     joins on the profile. Ratified in both languages 2026-09-25. -->
				<div class="charx-group">
					<InsightsIntake value={activeVoice.intake} {language} onchange={(intake) => setOwn({ intake })} />
				</div>
				<button type="button" class="wizard-primary" onclick={() => (phase = 'summary')}>
					{T('calib.characteristics.doneButton')}
				</button>
			</div>
		{/if}
	{/if}
	</div>
</section>

<style>
	.calibration-wizard {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		/* Outer padding (20px top, 40px bottom, 1rem sides) came from the old
		   `.shane-panel` column in +page.svelte (gone since N.108), which made the
		   score drawer read as one surface with the Transcription drawer (Dann's
		   consistency ruling, 2026-07-12; unified 2026-07-13). */
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

	/* `.wizard-compact-toggle`, ITS HOVER AND `.wizard-compact-chevron` ARE
	   GONE, N.114b item 8, with the accordion row they drew. Deleted rather
	   than left, because `svelte-check` counts an unused selector as a warning
	   and gate 3's baseline is 7. */

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

	/* Drawer kinship (Dann, 2026-07-12): the wizard adopts Ilya's drawer
	   vocabulary — the phase heading renders in the section-label recipe
	   (sans smallcaps, 0.12em tracking, the tab's accent colour: sage on
	   Ilya, deeper lavender here), and a 2px accent rule fences the
	   working area from the voice switcher, echoing the transcription
	   panel's fenced console. Headings stay h2 semantically. */
	.wizard-phase {
		border-top: 2px solid var(--lavender);
		padding-top: 0.875rem;
	}

	.wizard-phase h2 {
		margin: 0;
		width: 100%;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--lavender-ink);
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
	/* LAVENDER, N.73 S3, third repair from Dann's walk of ship one: the ritual's
	   own actions take the voice family's colour and match the Calibrate button
	   that opened them. Since row 165 the fill is `--lavender-jewel` (white on
	   it 6.8:1), the family's button step; the hover keeps `opacity: 0.85`,
	   which is also `RootPanel`'s `.action-btn:hover`. */
	.wizard-primary {
		background: var(--lavender-jewel);
		color: #ffffff;
		transition: opacity 0.12s;
	}
	.wizard-primary:hover {
		opacity: 0.85;
	}
	.wizard-secondary {
		background: transparent;
		color: var(--ink-secondary);
		border-color: var(--stone-300);
	}
	.wizard-voice-name {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--lavender-ink);
	}
	.wizard-secondary:hover {
		border-color: var(--lavender);
		color: var(--lavender-ink);
	}

	/* THE TOUCH FLOOR, N.114b item 9. MEASURED at 43.5 px: `0.625rem` twice
	   plus a 0.9375rem line lands half a pixel short of the ruled 44, and the
	   ruling puts a third action in this column, so the shortfall is now three
	   targets rather than two. Coarse pointer only, twinned on
	   `StationHeader`'s `.station-disclosure` and `IntakePanel`'s row, so a
	   desk's geometry does not move. It reaches Finish and Add voice
	   characteristics as well, by half a pixel each. */
	@media (pointer: coarse) {
		.wizard-primary,
		.wizard-secondary {
			min-height: 44px;
		}
	}

	/* The count-in beat and the capture bar (item 1.4a interaction, E.26).
	   Deliberately plain: this is the wizard's own furniture, not the result
	   surface, and it borrows the same tokens as everything else here. */

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
		color: var(--sage-ink);
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
