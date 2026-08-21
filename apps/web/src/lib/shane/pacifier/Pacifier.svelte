<script module lang="ts">
	import type { Vowel } from '$lib/shane/engine/types';
	import { t, type Language } from '$lib/i18n';

	// Speakable per-vowel names for the button labels and the aria-live caption.
	// Sourced from Mitton (2020) §4.6, which names all ten vowels, so a blind
	// listener hears the same nicknames sighted users see, and the bare IPA
	// glyphs never reach the speech engine. This is the fix for English TTS
	// collapsing [ɪ] and [ɨ] onto the [i] ("ee") value: a named label is read
	// as words, not a vowel the engine has to guess at. [i] uses Dann's
	// 'cardinal-i' (Cardinal Vowel 1), completing the i-triplet with velar-i
	// and smallcaps-i; [o] and [u] have no §4.6 nickname, so they keep the
	// plain letter rather than an invented term. Keyword anchors (English
	// 'as in bit', French mots-repères) are deferred to the bilingual anchor
	// work, where they become one designed feature across both languages.
	// Exported at module scope (not duplicated) so the guided-director wizard
	// (wizard spec v1 §3, "Accessibility") announces vowels by the identical
	// name a sighted user sees and a screen-reader user hears here.
	// N.35, 2026-08-12: these were English string literals. They now read
	// the dictionary, so both take the active language. `spokenName` keeps the
	// old Record's shape as a lookup; the keys are 'vowel.name.<glyph>'.
	export const spokenName = (g: Vowel, lang: Language): string => t(`vowel.name.${g}`, lang);
	export const spoken = (g: Vowel, lang: Language): string =>
		t('vowel.spoken', lang).replace('{name}', spokenName(g, lang));
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { StubCaptureSession } from '$lib/shane/engine/stub';
	import type { CaptureSession, CaptureHandlers } from '$lib/shane/engine/session';
	import type { VoiceType, CalibratedFormant } from '$lib/shane/engine/types';
	import type { ShaneEngineError } from '$lib/shane/engine/errors';

	// 'estimated' added 2026-07-11 (Kimi's ruling, additive-only): a node
	// whose value is a derived preview, not a sung capture. It rests with
	// dormant's exact visuals plus the ≈ accounting badge, and it arms and
	// captures exactly like dormant — a singer can always supersede a
	// synthetic value by singing. "The chart should know what the roster
	// knows": without this state, a derived vowel showed as a plain dormant
	// circle while the roster beneath displayed its value.
	type NodeState =
		| 'deselected'
		| 'dormant'
		| 'armed'
		| 'preparing'
		| 'listening'
		| 'working'
		| 'captured'
		| 'provisional'
		| 'estimated';

	interface PacifierProps {
		voiceType?: VoiceType;
		initialFormants?: Partial<Record<Vowel, CalibratedFormant>>;
		session?: CaptureSession;
		calibrationOrder?: Vowel[];
		countdownTicks?: boolean;
		/** Wizard spec v1 §2 Phase 2: the five-anchor achievement overlay. On by default; a guided-director host never needs to opt in. */
		minimumMetOverlay?: boolean;
		onVowelCaptured?: (vowel: Vowel, formant: CalibratedFormant) => void;
		onProfileChange?: (formants: Partial<Record<Vowel, CalibratedFormant>>) => void;
		/**
		 * Wizard spec v1 §3, the re-take rule: fires when a re-take reads
		 * Provisional and the previous reading was Captured, so the previous
		 * value is kept and this formant is discarded rather than applied.
		 * `onVowelCaptured` and `onProfileChange` do NOT fire for a rolled-back
		 * re-take, since nothing in the profile changed.
		 */
		onRetakeRolledBack?: (vowel: Vowel, rejectedFormant: CalibratedFormant) => void;
		/**
		 * N.48: the long-press skip is a promise the interface already makes
		 * (it announces `pacifier.skipped`) and no host could keep, because
		 * nothing routed the skip back out. Fires with the skipped vowel.
		 * The Pacifier has no tour of its own and advances nothing here.
		 */
		onVowelSkipped?: (vowel: Vowel) => void;
		/** N.22/N.35: active display language, threaded to the i18n dictionary. */
		language: Language;
	}

	// Advisory counterclockwise tour of the vowel space (spec §8). Overridable;
	// it only sets Tab order and the initial cue, never a required sequence.
	const DEFAULT_ORDER: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ʌ', 'ɑ', 'o', 'u', 'ɨ', 'ɪ'];

	let {
		voiceType = undefined,
		initialFormants = undefined,
		session = new StubCaptureSession(),
		calibrationOrder = DEFAULT_ORDER,
		countdownTicks = true,
		minimumMetOverlay = true,
		onVowelCaptured,
		onProfileChange,
		onRetakeRolledBack,
		onVowelSkipped,
		language
	}: PacifierProps = $props();

	// N.35: the house dictionary pattern, per `const T` in CalibrationWizard.svelte.
	const T = (key: string) => t(key, language);
	// Every caption that names a vowel puts it mid-sentence, Dann's ruling of
	// 2026-08-12, so {v} is substituted rather than concatenated at the front.
	const say = (key: string, g: Vowel) => T(key).replace('{v}', spoken(g, language));

	// ── Locked geometry, ported verbatim from the prototype ──────────────────
	const VERTS: [number, number][] = [
		[30, 60],
		[350, 60],
		[350, 260],
		[230, 260]
	];
	const W = 39;
	const RC = 23;
	const RAD = 14;
	const CX = 190;
	const CY = 160;
	const S = 1.3;
	const ARCR = RAD + 3;
	const CIRC = 2 * Math.PI * ARCR;
	const CORNERS: Vowel[] = ['i', 'u', 'ɑ', 'a'];
	const EDGE: { g: Vowel; p: [number, number] }[] = [
		{ g: 'ɨ', p: [190, 60] },
		{ g: 'e', p: [97, 127] },
		{ g: 'o', p: [350, 127] },
		{ g: 'ɛ', p: [163, 193] },
		{ g: 'ʌ', p: [350, 193] },
		{ g: 'ɪ', p: [112, 91] }
	];

	type Pt = [number, number];
	const sc = (p: Pt): Pt => [CX + S * (p[0] - CX), CY + S * (p[1] - CY)];
	const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
	const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
	const mul = (a: Pt, s: number): Pt => [a[0] * s, a[1] * s];
	const len = (a: Pt): number => Math.hypot(a[0], a[1]);
	const unit = (a: Pt): Pt => {
		const l = len(a);
		return [a[0] / l, a[1] / l];
	};
	const f = (p: Pt): string => p[0].toFixed(2) + ',' + p[1].toFixed(2);

	function cornerGeom(prev: Pt, vert: Pt, next: Pt, rc: number) {
		const tP = unit(sub(prev, vert));
		const tN = unit(sub(next, vert));
		const dot = Math.max(-1, Math.min(1, tP[0] * tN[0] + tP[1] * tN[1]));
		const th = Math.acos(dot);
		let t = rc / Math.tan(th / 2);
		t = Math.min(t, len(sub(prev, vert)) * 0.48, len(sub(next, vert)) * 0.48);
		const reff = t * Math.tan(th / 2);
		const A = add(vert, mul(tP, t));
		const B = add(vert, mul(tN, t));
		const c = (4 / 3) * reff * Math.tan((Math.PI - th) / 4);
		return {
			A,
			B,
			P1: add(A, mul(tP, -c)),
			P2: add(B, mul(tN, -c)),
			inward: unit(add(tP, tN)),
			medial: reff * (1 / Math.sin(th / 2) - 1),
			V: vert
		};
	}

	const Vs = VERTS.map(sc);
	const cornerG: ReturnType<typeof cornerGeom>[] = [];
	for (let i = 0; i < 4; i++) {
		cornerG.push(cornerGeom(Vs[(i + 3) % 4], Vs[i], Vs[(i + 1) % 4], RC));
	}
	const bandPath = ((): string => {
		let p = 'M' + f(cornerG[0].A);
		for (let i = 0; i < 4; i++) {
			p += 'C' + f(cornerG[i].P1) + ' ' + f(cornerG[i].P2) + ' ' + f(cornerG[i].B);
			p += 'L' + f(cornerG[(i + 1) % 4].A);
		}
		return p + 'Z';
	})();

	const seats: Pt[] = cornerG.map((cg) => add(cg.V, mul(cg.inward, cg.medial)));
	type GeomVowel = { g: Vowel; cx: number; cy: number };
	const geomVowels: GeomVowel[] = [
		...CORNERS.map((g, i) => ({ g, cx: seats[i][0], cy: seats[i][1] })),
		...EDGE.map((e) => {
			const q = sc(e.p);
			return { g: e.g, cx: q[0], cy: q[1] };
		})
	];
	// Render and Tab order follow calibrationOrder, with any omitted vowels appended.
	// Render and Tab order follow calibrationOrder, with any omitted vowels
	// appended. Computed once from the prop at construction: the calibration
	// order is static configuration, not something that changes mid-session, so
	// the one-time read is intentional.
	// svelte-ignore state_referenced_locally
	const layout: GeomVowel[] = calibrationOrder
		.map((g) => geomVowels.find((v) => v.g === g))
		.filter((v): v is GeomVowel => !!v)
		.concat(geomVowels.filter((v) => !calibrationOrder.includes(v.g)));

	// ── Minimum-met achievement overlay (wizard spec v1 §2 Phase 2, §4) ──────
	// The five-anchor floor {[i], [e], [ɛ], [ɑ], [u]} is Fit's engineering
	// minimum: exactly the anchors the four derivations consume to reconstruct
	// the rest of Grayson's ten idealized sung-Russian vowels (see derivations.ts).
	// It targets Grayson's schema, not phonetic vowel-space completeness. JUDGEMENT.
	// (Earlier this cited Fox and Jacewicz 2017; removed 2026-07-17: that is
	// speech-dialect VSA work that critiques corner-vowel sets rather than
	// endorsing a five-vowel minimum, and does not cross into sung vowels.)
	// A non-destructive overlay: nothing moves,
	// the deselected [ɨ], [ɪ], [ʌ] stay dashed in their canonical home
	// positions, and this polygon lights in behind the vowel nodes once all
	// five are sampled. The draw order is computed by angle around the shape's
	// centre rather than hand-ordered, so it is a simple, non-self-intersecting
	// polygon regardless of exactly where the five anchors sit on the locked
	// Jones geometry. Contrast for this overlay is not yet a locked obligation
	// in contrast.ts; the rendering itself is flagged open in wizard spec v1 §5
	// ("confirm it reads as intended at the port").
	const FLOOR_ANCHORS: Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'u'];
	const floorAnchorGeom: GeomVowel[] = FLOOR_ANCHORS.map((g) => geomVowels.find((v) => v.g === g))
		.filter((v): v is GeomVowel => !!v)
		.sort((p, q) => Math.atan2(p.cy - CY, p.cx - CX) - Math.atan2(q.cy - CY, q.cx - CX));
	const floorPolygonPath: string =
		floorAnchorGeom.length === FLOOR_ANCHORS.length
			? 'M' + floorAnchorGeom.map((v) => f([v.cx, v.cy])).join('L') + 'Z'
			: '';

	// ── Reactive per-vowel state ─────────────────────────────────────────────
	interface PNode {
		state: NodeState;
		sampled: boolean;
		skipped: boolean;
		formant?: CalibratedFormant;
		arcProgress: number;
		flashOn: boolean;
		outlinePulse: boolean;
		completeFlash: '' | 'flash-good' | 'flash-retake';
		swell: boolean;
	}
	const initNode = (g: Vowel): PNode => {
		const fm = initialFormants?.[g];
		return {
			state: fm
				? fm.reading === 'provisional'
					? 'provisional'
					: fm.reading === 'estimated'
						? 'estimated'
						: 'captured'
				: 'dormant',
			sampled: !!fm && fm.reading !== 'estimated',
			skipped: false,
			formant: fm,
			arcProgress: 0,
			flashOn: false,
			outlinePulse: false,
			completeFlash: '',
			swell: false
		};
	};
	let nodes = $state<PNode[]>(layout.map((v) => initNode(v.g)));
	let announce = $state(T('pacifier.tapToCapture'));
	let reducedMotion = $state(false);
	let activeIdx = $state(-1);

	// The floor is "met" once every anchor has a reading, captured or
	// provisional; a provisional first attempt still counts; a skipped vowel
	// does not. Recomputed from `nodes`, which is deeply reactive.
	let floorComplete = $derived(
		FLOOR_ANCHORS.every((g) => {
			const i = layout.findIndex((v) => v.g === g);
			return i !== -1 && nodes[i].sampled && !nodes[i].skipped;
		})
	);
	let floorPulsing = $state(false);
	let floorWasComplete = false;
	$effect(() => {
		if (floorComplete && !floorWasComplete) {
			floorWasComplete = true;
			if (!reducedMotion) {
				floorPulsing = true;
				after(900, () => {
					floorPulsing = false;
				});
			}
		} else if (!floorComplete) {
			floorWasComplete = false;
		}
	});

	// ── Non-reactive control state ───────────────────────────────────────────
	let timers: ReturnType<typeof setTimeout>[] = [];
	let rafId = 0;
	let arcDone = false;
	let pendingResult: CalibratedFormant | null = null;
	let audioCtx: AudioContext | null = null;

	const COUNT_INTERVAL = 700;
	const FLASH_MS = 200;
	const SWEEP_MS = 3000;
	const COMPLETE_MS = 900;
	const LONGPRESS_MS = 500;

	const clearTimers = () => {
		for (const t of timers) clearTimeout(t);
		timers = [];
		if (rafId) cancelAnimationFrame(rafId);
		rafId = 0;
	};
	const after = (ms: number, fn: () => void) => {
		timers.push(setTimeout(fn, ms));
	};

	const restingState = (n: PNode): NodeState =>
		n.skipped
			? 'deselected'
			: n.formant?.reading === 'provisional'
				? 'provisional'
				: n.sampled
					? 'captured'
					: n.formant?.reading === 'estimated'
						? 'estimated'
						: 'dormant';

	const formantsMap = (): Partial<Record<Vowel, CalibratedFormant>> => {
		const m: Partial<Record<Vowel, CalibratedFormant>> = {};
		nodes.forEach((n, i) => {
			if (n.formant) m[layout[i].g] = n.formant;
		});
		return m;
	};

	function tick() {
		if (!countdownTicks) return;
		try {
			audioCtx ??= new AudioContext();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.type = 'sine';
			osc.frequency.value = 660;
			gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
			osc.connect(gain).connect(audioCtx.destination);
			osc.start();
			osc.stop(audioCtx.currentTime + 0.1);
		} catch {
			// Audio is optional; a failed tick must never block the countdown.
		}
	}

	function focusVowel(idx: number) {
		nodes.forEach((n, j) => {
			if (j !== idx && !n.sampled && !n.skipped) n.state = 'deselected';
		});
		activeIdx = idx;
	}

	function restoreResting(exceptIdx: number) {
		nodes.forEach((n, j) => {
			if (j !== exceptIdx) n.state = restingState(n);
		});
	}

	function flashBeat(idx: number) {
		if (reducedMotion) return; // amber flash suppressed; the tick and announce remain
		const n = nodes[idx];
		n.flashOn = true;
		n.outlinePulse = true;
		after(FLASH_MS, () => {
			n.flashOn = false;
			n.outlinePulse = false;
		});
	}

	function beginPrepare(idx: number) {
		clearTimers();
		focusVowel(idx);
		nodes[idx].state = 'preparing';
		announce = say('pacifier.preparing', layout[idx].g);
		flashBeat(idx);
		tick();
		after(COUNT_INTERVAL, () => {
			announce = T('calib.readiness.countTwo');
			flashBeat(idx);
			tick();
		});
		after(2 * COUNT_INTERVAL, () => {
			announce = T('calib.readiness.countOne');
			flashBeat(idx);
			tick();
		});
		after(3 * COUNT_INTERVAL, () => startListening(idx)); // silent zero
	}

	function startListening(idx: number) {
		clearTimers();
		const n = nodes[idx];
		n.state = 'listening';
		n.arcProgress = 0;
		arcDone = false;
		pendingResult = null;
		announce = say('pacifier.beginPhonating', layout[idx].g);
		const handlers: CaptureHandlers = {
			onStableFry: () => startSweep(idx),
			onComplete: (formant) => deliverResult(idx, formant),
			onError: (err) => handleError(idx, err)
		};
		session.start(layout[idx].g, voiceType, handlers);
	}

	function startSweep(idx: number) {
		const n = nodes[idx];
		n.state = 'working';
		announce = T('pacifier.nowSustain');
		arcDone = false;
		if (!reducedMotion) {
			const t0 = performance.now();
			const step = (t: number) => {
				n.arcProgress = Math.min(1, (t - t0) / SWEEP_MS);
				if (n.arcProgress < 1) rafId = requestAnimationFrame(step);
				else rafId = 0;
			};
			rafId = requestAnimationFrame(step);
		} else {
			n.arcProgress = 1; // static full ring under reduced motion
		}
		// The arc is a fixed 3.0 s clock that never stalls, independent of the
		// engine's delivery time; completion waits on both the clock and the result.
		after(SWEEP_MS, () => {
			arcDone = true;
			maybeComplete(idx);
		});
	}

	function deliverResult(idx: number, formant: CalibratedFormant) {
		pendingResult = formant;
		maybeComplete(idx);
	}

	function maybeComplete(idx: number) {
		if (!arcDone || pendingResult === null) return;
		const formant = pendingResult;
		pendingResult = null;
		if (formant.reading === 'provisional') completePoor(idx, formant);
		else completeGood(idx, formant);
	}

	function completeGood(idx: number, formant: CalibratedFormant) {
		const n = nodes[idx];
		n.formant = formant;
		n.sampled = true;
		n.skipped = false;
		if (!reducedMotion) {
			n.completeFlash = 'flash-good';
			n.swell = true;
		}
		const finish = () => {
			n.completeFlash = '';
			n.swell = false;
			n.arcProgress = 0;
			n.state = 'captured';
			restoreResting(idx);
			activeIdx = -1;
			announce = say('pacifier.captured', layout[idx].g);
			onVowelCaptured?.(layout[idx].g, formant);
			onProfileChange?.(formantsMap());
		};
		if (reducedMotion) finish();
		else after(COMPLETE_MS, finish);
	}

	function completePoor(idx: number, formant: CalibratedFormant) {
		const n = nodes[idx];
		// Wizard spec v1 §3, the re-take rule: replace-on-re-take, with one
		// automatic rollback. A Provisional re-take never overwrites a Captured
		// previous; the engine's own reading is the arbiter, never the raw
		// numbers, so the singer is never asked to adjudicate two fR1/fR2
		// pairs. This only applies to a genuine re-take (a previous Captured
		// reading already sits on this vowel); a first attempt that reads
		// Provisional always proceeds as usual below. (An estimated preview is
		// not a Captured previous: a sung Provisional supersedes a synthetic
		// value, bespoke-first.)
		const previousWasCaptured = n.sampled && !n.skipped && n.formant?.reading === 'captured';
		if (previousWasCaptured) {
			if (!reducedMotion) n.completeFlash = 'flash-retake';
			const finish = () => {
				n.completeFlash = '';
				n.arcProgress = 0;
				n.state = 'captured'; // the kept previous, unchanged
				restoreResting(idx);
				activeIdx = -1;
				announce = say('pacifier.rolledBack', layout[idx].g);
				onRetakeRolledBack?.(layout[idx].g, formant);
			};
			if (reducedMotion) finish();
			else after(COMPLETE_MS, finish);
			return;
		}
		n.formant = formant;
		n.sampled = true;
		n.skipped = false;
		if (!reducedMotion) n.completeFlash = 'flash-retake';
		const finish = () => {
			n.completeFlash = '';
			n.arcProgress = 0;
			n.state = 'provisional';
			restoreResting(idx);
			activeIdx = -1;
			announce = say('pacifier.sampleUncertain', layout[idx].g);
			onVowelCaptured?.(layout[idx].g, formant);
			onProfileChange?.(formantsMap());
		};
		if (reducedMotion) finish();
		else after(COMPLETE_MS, finish);
	}

	function errorCaption(code: string): string {
		switch (code) {
			case 'MIC_PERMISSION_DENIED':
				return T('pacifier.error.micPermission');
			case 'MIC_NOT_FOUND':
				return T('pacifier.error.micNotFound');
			case 'NO_AUDIO_INPUT':
				return T('pacifier.error.noAudio');
			case 'SAMPLE_TOO_SHORT':
				return T('pacifier.error.tooShort');
			default:
				return T('pacifier.error.default');
		}
	}

	function handleError(idx: number, err: ShaneEngineError) {
		clearTimers();
		const n = nodes[idx];
		const code = 'code' in err ? err.code : 'EXTRACTION_FAILED';
		if (code === 'CANCELLED') {
			n.state = restingState(n);
			restoreResting(idx);
			activeIdx = -1;
			announce = T('pacifier.cancelled');
			return;
		}
		n.arcProgress = 0;
		n.state = n.sampled ? restingState(n) : 'armed';
		restoreResting(idx);
		activeIdx = -1;
		announce = errorCaption(code);
	}

	function cancelCapture(idx: number) {
		session.cancel();
		clearTimers();
		const n = nodes[idx];
		n.flashOn = false;
		n.outlinePulse = false;
		n.completeFlash = '';
		n.swell = false;
		n.arcProgress = 0;
		n.state = restingState(n);
		restoreResting(idx);
		activeIdx = -1;
		announce = T('pacifier.cancelled');
	}

	function onActivate(idx: number) {
		const n = nodes[idx];
		if (activeIdx !== -1 && activeIdx !== idx) return; // capture is exclusive
		switch (n.state) {
			case 'deselected':
				n.skipped = false;
				n.state = 'dormant';
				announce = say('pacifier.selected', layout[idx].g);
				break;
			case 'dormant':
			// An estimated node arms exactly like a dormant one (Kimi's
			// ruling, 2026-07-11): the replacement of a synthetic value by a
			// sung one is silent and automatic, and the arming caption stays
			// procedural — no metadata chatter at the moment of breath.
			case 'estimated':
				n.state = 'armed';
				announce = say('pacifier.armed', layout[idx].g);
				break;
			case 'armed':
				beginPrepare(idx);
				break;
			case 'preparing':
				startListening(idx); // tap-to-start-now skips the remaining count
				break;
			case 'captured':
				n.state = 'armed'; // re-take via two taps; a stray tap only arms
				announce = say('pacifier.armedRetake', layout[idx].g);
				break;
			case 'provisional':
				beginPrepare(idx); // a single tap on a provisional vowel re-takes
				break;
			case 'listening':
			case 'working':
				break; // ignore; Escape cancels an in-progress capture
		}
	}

	/**
	 * Guided-director wizard hook (wizard spec v1 §2 Phase 2, §3). Drives the
	 * exact same state transition a real tap drives, so a wizard's auto-advance
	 * can move focus to (and arm) the next vowel without a second, separate
	 * interaction path to keep in sync with the locked ritual. Calling this on
	 * a vowel already mid-capture is a no-op, matching onActivate's own guard.
	 */
	export function activateVowel(g: Vowel): void {
		const idx = layout.findIndex((v) => v.g === g);
		if (idx !== -1) onActivate(idx);
	}

	function onLongPressFire(idx: number) {
		const n = nodes[idx];
		if (activeIdx === idx) return;
		if (n.state === 'listening' || n.state === 'working' || n.state === 'preparing') return;
		n.skipped = true;
		n.sampled = false;
		n.formant = undefined;
		n.state = 'deselected';
		announce = say('pacifier.skipped', layout[idx].g);
		onProfileChange?.(formantsMap());
		onVowelSkipped?.(layout[idx].g);
	}

	// ── Pointer: distinguish a tap from a long-press ─────────────────────────
	let pressTimer = 0;
	let pressIdx = -1;
	let longFired = false;
	let moved = false;

	function onPointerDown(idx: number) {
		pressIdx = idx;
		longFired = false;
		moved = false;
		pressTimer = window.setTimeout(() => {
			longFired = true;
			onLongPressFire(idx);
		}, LONGPRESS_MS);
	}
	function onPointerMove() {
		moved = true;
	}
	function onPointerUp(idx: number) {
		clearTimeout(pressTimer);
		if (idx === pressIdx && !longFired && !moved) onActivate(idx);
		pressIdx = -1;
	}
	function onPointerLeave() {
		clearTimeout(pressTimer);
	}
	function onKey(e: KeyboardEvent, idx: number) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onActivate(idx);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			if (activeIdx === idx) cancelCapture(idx);
		}
	}

	function view(n: PNode) {
		let stroke = 'var(--ink-primary)';
		let strokeOpacity = 0.35;
		let strokeWidth = 1.5;
		let dash = 'none';
		let glyphFill = 'var(--ink-primary)';
		let glyphOpacity = 0.5;
		let sigil = '';
		let sigilColor = '';
		switch (n.state) {
			case 'dormant':
				break;
			// The ≈ accounting badge (Kimi's ruling, 2026-07-11): an estimated
			// node keeps dormant's exact resting visuals — no third stroke
			// treatment competing with the capture ritual's feedback — plus the
			// badge alone. Tertiary ink on the white badge measures 5.77:1
			// (computed against app.css values), clearing the 3:1 bar, so no
			// ghost pill is needed. ≈ is an accounting mark, not an achievement
			// mark: it says "this node carries a value, but not a sung one."
			case 'estimated':
				sigil = '≈';
				sigilColor = 'var(--ink-tertiary)';
				break;
			case 'deselected':
				stroke = 'var(--ink-tertiary)';
				strokeOpacity = 1;
				dash = '3,2';
				glyphOpacity = 0.7;
				break;
			case 'armed':
				stroke = 'var(--ink-secondary)';
				strokeOpacity = 0.6;
				strokeWidth = 2.5;
				glyphFill = 'var(--ink-secondary)';
				glyphOpacity = 1;
				break;
			case 'preparing':
				stroke = n.outlinePulse ? 'var(--prep-amber)' : 'var(--ink-secondary)';
				strokeOpacity = 1;
				strokeWidth = 2.5;
				glyphOpacity = 1;
				break;
			case 'listening':
				stroke = 'var(--ink-secondary)';
				strokeOpacity = 0.4;
				glyphFill = 'var(--ink-secondary)';
				glyphOpacity = 1;
				break;
			case 'working':
				stroke = 'var(--ink-secondary)';
				strokeOpacity = 0.7;
				strokeWidth = 2.5;
				glyphFill = 'var(--ink-secondary)';
				glyphOpacity = 1;
				break;
			case 'captured':
				stroke = 'var(--deeper-lavender)';
				strokeOpacity = 1;
				strokeWidth = 2.5;
				glyphOpacity = 1;
				sigil = '✓';
				sigilColor = 'var(--ink-secondary)';
				break;
			case 'provisional':
				stroke = 'var(--deeper-lavender)';
				strokeOpacity = 1;
				strokeWidth = 2.5;
				glyphOpacity = 1;
				sigil = '↻';
				sigilColor = 'var(--signal-red)';
				break;
		}
		return { stroke, strokeOpacity, strokeWidth, dash, glyphFill, glyphOpacity, sigil, sigilColor };
	}

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onChange = () => (reducedMotion = mq.matches);
		mq.addEventListener('change', onChange);
		return () => {
			mq.removeEventListener('change', onChange);
			clearTimers();
			session.cancel();
			audioCtx?.close();
		};
	});
</script>

<div class="pacifier-field">
	<svg
		class="pacifier"
		viewBox="-44 -44 548 424"
		role="group"
		aria-label={T('pacifier.wheelAria')}
	>
		<path
			d={bandPath}
			fill="none"
			stroke="var(--surround-shane)"
			stroke-width={W}
			stroke-linejoin="round"
			stroke-linecap="round"
		/>
		{#if minimumMetOverlay && floorComplete && floorPolygonPath}
			<path
				class="floor-overlay"
				class:floor-overlay-pulse={floorPulsing}
				d={floorPolygonPath}
				fill="var(--sage)"
				fill-opacity="0.14"
				stroke="var(--sage)"
				stroke-opacity="0.9"
				stroke-width="2"
				aria-hidden="true"
			/>
		{/if}
		{#each layout as v, i (v.g)}
			{@const n = nodes[i]}
			{@const vw = view(n)}
			{@const bx = v.cx + (RAD + 4) * 0.707}
			{@const by = v.cy + (RAD + 4) * 0.707}
			<g
				class="vowel"
				role="button"
				tabindex="0"
				aria-label={spoken(v.g, language)}
				onpointerdown={() => onPointerDown(i)}
				onpointermove={onPointerMove}
				onpointerup={() => onPointerUp(i)}
				onpointerleave={onPointerLeave}
				onkeydown={(e) => onKey(e, i)}
			>
				<circle class="focus-ring" cx={v.cx} cy={v.cy} r={RAD + 6} fill="none" stroke="var(--sage)" stroke-width="2" opacity="0" />
				<circle cx={v.cx} cy={v.cy} r={RAD} fill="#FFFFFF" />
				<!-- prep-amber flash: full-opacity interior fill, inset 2px, behind the glyph (3.43:1 on white) -->
				<circle class="prep-flash" cx={v.cx} cy={v.cy} r={RAD - 2} fill="var(--prep-amber)" style:opacity={n.flashOn ? 1 : 0} />
				<circle
					class="outline"
					class:complete-flash-good={n.completeFlash === 'flash-good'}
					class:complete-flash-retake={n.completeFlash === 'flash-retake'}
					cx={v.cx}
					cy={v.cy}
					r={RAD}
					fill="none"
					stroke={vw.stroke}
					stroke-opacity={vw.strokeOpacity}
					stroke-width={vw.strokeWidth}
					stroke-dasharray={vw.dash}
				/>
				<circle
					class="arc"
					class:arc-ready={n.state === 'listening' && !reducedMotion}
					cx={v.cx}
					cy={v.cy}
					r={ARCR}
					fill="none"
					stroke="var(--arc-green)"
					stroke-width="3"
					stroke-linecap="round"
					stroke-dasharray={CIRC}
					stroke-dashoffset={n.state === 'listening' ? 0 : n.state === 'working' ? CIRC * (1 - n.arcProgress) : CIRC}
					transform={`rotate(-90 ${v.cx} ${v.cy})`}
					style:opacity={n.state === 'listening' || n.state === 'working' ? 1 : 0}
				/>
				<text
					class="glyph"
					class:swell={n.swell}
					x={v.cx}
					y={v.cy}
					text-anchor="middle"
					dominant-baseline="central"
					font-family="'Lato IPA', sans-serif"
					font-size="18"
					fill={vw.glyphFill}
					fill-opacity={vw.glyphOpacity}>{v.g}</text
				>
				{#if vw.sigil}
					<g class="badge">
						<circle cx={bx} cy={by} r="8" fill="#FFFFFF" stroke={vw.sigilColor} stroke-width="1.25" />
						<text
							x={bx}
							y={by + 0.5}
							text-anchor="middle"
							dominant-baseline="central"
							font-family="'Lato', sans-serif"
							font-size="10"
							fill={vw.sigilColor}>{vw.sigil}</text
						>
					</g>
				{/if}
			</g>
		{/each}
	</svg>
	<p class="pacifier-caption" role="status" aria-live="polite">{announce}</p>
</div>

<style>
	.pacifier-field {
		width: 100%;
		max-width: 680px;
		margin: 0 auto;
	}
	.pacifier {
		display: block;
		width: 100%;
		height: auto;
		touch-action: manipulation;
	}
	.vowel {
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		/* N.48: iOS raises the callout and selection UI on a long press and
		   swallows the gesture before LONGPRESS_MS fires. `user-select` takes
		   the house form already used by `.brand-mark` in HeaderBar.svelte and
		   by the Inspector's own non-selectable labels in
		   InspectorPanel.svelte; `-webkit-touch-callout` is new to this tree.

		   REPAIRED BY NAMING, N.65 2026-08-21. This read
		   `HeaderBar.svelte:103 and Drawer.svelte:587`. Both were stale before
		   this ship: HeaderBar's rule is at :93, and `Drawer.svelte` carries no
		   `user-select` at all, at :587 or anywhere else. */
		-webkit-touch-callout: none;
		user-select: none;
	}
	.vowel:focus {
		outline: none;
	}
	.vowel:focus-visible .focus-ring {
		opacity: 1;
	}
	.pacifier-caption {
		text-align: center;
		font-size: 13px;
		letter-spacing: 0.02em;
		color: var(--ink-secondary);
		margin: 18px 0 0;
		min-height: 20px;
		font-weight: 400;
	}
	.prep-flash {
		transition: opacity 0.2s ease-out;
	}
	@keyframes flashGood {
		0%,
		100% {
			stroke: var(--deeper-lavender);
		}
		16%,
		48%,
		80% {
			stroke: var(--arc-green);
		}
		32%,
		64% {
			stroke: var(--deeper-lavender);
		}
	}
	@keyframes flashRetake {
		0%,
		100% {
			stroke: var(--deeper-lavender);
		}
		16%,
		48%,
		80% {
			stroke: var(--signal-red);
		}
		32%,
		64% {
			stroke: var(--deeper-lavender);
		}
	}
	.complete-flash-good {
		animation: flashGood 0.9s ease-in-out 1;
	}
	.complete-flash-retake {
		animation: flashRetake 0.9s ease-in-out 1;
	}
	@keyframes swell {
		0% {
			transform: scale(1);
		}
		55% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
	.swell {
		animation: swell 0.5s ease-in-out 1;
		transform-box: fill-box;
		transform-origin: center;
	}
	@keyframes arcReady {
		0%,
		100% {
			opacity: 0.45;
		}
		50% {
			opacity: 1;
		}
	}
	.arc-ready {
		animation: arcReady 1.2s ease-in-out infinite;
	}
	.floor-overlay {
		transition: opacity 0.3s ease-out;
	}
	@keyframes floorPulse {
		0% {
			opacity: 0.55;
		}
		40% {
			opacity: 1;
		}
		100% {
			opacity: 0.55;
		}
	}
	.floor-overlay-pulse {
		animation: floorPulse 0.9s ease-in-out 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.complete-flash-good,
		.complete-flash-retake,
		.swell,
		.arc-ready,
		.prep-flash,
		.floor-overlay-pulse {
			animation: none;
			transition: none;
		}
	}
</style>
