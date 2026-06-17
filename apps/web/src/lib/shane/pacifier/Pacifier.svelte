<script lang="ts">
	import { onMount } from 'svelte';
	import { StubCaptureSession } from '$lib/shane/engine/stub';
	import type { CaptureSession, CaptureHandlers } from '$lib/shane/engine/session';
	import type { Vowel, VoiceType, CalibratedFormant } from '$lib/shane/engine/types';
	import type { ShaneEngineError } from '$lib/shane/engine/errors';

	type NodeState =
		| 'deselected'
		| 'dormant'
		| 'armed'
		| 'preparing'
		| 'listening'
		| 'working'
		| 'captured'
		| 'provisional';

	interface PacifierProps {
		voiceType?: VoiceType;
		initialFormants?: Partial<Record<Vowel, CalibratedFormant>>;
		session?: CaptureSession;
		calibrationOrder?: Vowel[];
		countdownTicks?: boolean;
		onVowelCaptured?: (vowel: Vowel, formant: CalibratedFormant) => void;
		onProfileChange?: (formants: Partial<Record<Vowel, CalibratedFormant>>) => void;
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
		onVowelCaptured,
		onProfileChange
	}: PacifierProps = $props();

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
			state: fm ? (fm.reading === 'provisional' ? 'provisional' : 'captured') : 'dormant',
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
	let announce = $state('Tap a vowel to capture it.');
	let reducedMotion = $state(false);
	let activeIdx = $state(-1);

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
	const spoken = (g: Vowel): string => `the ${g} vowel`;

	const restingState = (n: PNode): NodeState =>
		n.skipped
			? 'deselected'
			: n.formant?.reading === 'provisional'
				? 'provisional'
				: n.sampled
					? 'captured'
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
		announce = `Preparing ${spoken(layout[idx].g)}. Three.`;
		flashBeat(idx);
		tick();
		after(COUNT_INTERVAL, () => {
			announce = 'Two.';
			flashBeat(idx);
			tick();
		});
		after(2 * COUNT_INTERVAL, () => {
			announce = 'One.';
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
		announce = `Begin phonating now. ${spoken(layout[idx].g)} in vocal fry.`;
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
		announce = 'Now sustain. Sample recording.';
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
			announce = `${spoken(layout[idx].g)} captured.`;
			onVowelCaptured?.(layout[idx].g, formant);
			onProfileChange?.(formantsMap());
		};
		if (reducedMotion) finish();
		else after(COMPLETE_MS, finish);
	}

	function completePoor(idx: number, formant: CalibratedFormant) {
		const n = nodes[idx];
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
			announce = `${spoken(layout[idx].g)} sample uncertain. Tap to retry.`;
			onVowelCaptured?.(layout[idx].g, formant);
			onProfileChange?.(formantsMap());
		};
		if (reducedMotion) finish();
		else after(COMPLETE_MS, finish);
	}

	function errorCaption(code: string): string {
		switch (code) {
			case 'MIC_PERMISSION_DENIED':
				return 'Microphone access is needed to hear your fry. Can you allow it and try again?';
			case 'MIC_NOT_FOUND':
				return 'No microphone was found. Can you connect one and try again?';
			case 'NO_AUDIO_INPUT':
				return 'No sound came through. Can you check the microphone and try again?';
			case 'SAMPLE_TOO_SHORT':
				return 'That sample was a little short. Can you sustain the fry a moment longer?';
			default:
				return 'That sample could not be read. Can you try that again?';
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
			announce = 'Capture cancelled.';
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
		announce = 'Capture cancelled.';
	}

	function onActivate(idx: number) {
		const n = nodes[idx];
		if (activeIdx !== -1 && activeIdx !== idx) return; // capture is exclusive
		switch (n.state) {
			case 'deselected':
				n.skipped = false;
				n.state = 'dormant';
				announce = `${spoken(layout[idx].g)} selected.`;
				break;
			case 'dormant':
				n.state = 'armed';
				announce = `${spoken(layout[idx].g)} armed. Tap again to begin.`;
				break;
			case 'armed':
				beginPrepare(idx);
				break;
			case 'preparing':
				startListening(idx); // tap-to-start-now skips the remaining count
				break;
			case 'captured':
				n.state = 'armed'; // re-take via two taps; a stray tap only arms
				announce = `${spoken(layout[idx].g)} armed for re-take. Tap again to begin.`;
				break;
			case 'provisional':
				beginPrepare(idx); // a single tap on a provisional vowel re-takes
				break;
			case 'listening':
			case 'working':
				break; // ignore; Escape cancels an in-progress capture
		}
	}

	function onLongPressFire(idx: number) {
		const n = nodes[idx];
		if (activeIdx === idx) return;
		if (n.state === 'listening' || n.state === 'working' || n.state === 'preparing') return;
		n.skipped = true;
		n.sampled = false;
		n.formant = undefined;
		n.state = 'deselected';
		announce = `${spoken(layout[idx].g)} skipped.`;
		onProfileChange?.(formantsMap());
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
		aria-label="Vowel calibration. Tap a vowel to select it, tap again to begin capture, long-press to skip."
	>
		<path
			d={bandPath}
			fill="none"
			stroke="var(--surround-shane)"
			stroke-width={W}
			stroke-linejoin="round"
			stroke-linecap="round"
		/>
		{#each layout as v, i (v.g)}
			{@const n = nodes[i]}
			{@const vw = view(n)}
			{@const bx = v.cx + (RAD + 4) * 0.707}
			{@const by = v.cy + (RAD + 4) * 0.707}
			<g
				class="vowel"
				role="button"
				tabindex="0"
				aria-label={`vowel ${v.g}`}
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
	@media (prefers-reduced-motion: reduce) {
		.complete-flash-good,
		.complete-flash-retake,
		.swell,
		.arc-ready,
		.prep-flash {
			animation: none;
			transition: none;
		}
	}
</style>
