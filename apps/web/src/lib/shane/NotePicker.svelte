<script lang="ts">
	/**
	 * The note picker (E.5 slice 3; Kimi's Q5 ruling, handover v39 §A.31).
	 *
	 * One component for all six voice-characteristics fields: typed-first
	 * capture of a single pitch through three small controls (letter,
	 * accidental, octave), with a live staff preview beside them — staff
	 * notation AND note name, both ruled. Input model per Dann's slice-3
	 * decision (2026-07-13): steppers/selects, never click-the-staff, so
	 * the picker is keyboard-accessible by construction and demands no
	 * pointer precision.
	 *
	 * The staff preview renders through the shared SMuFL machinery —
	 * Finale Maestro by default via the page's loadNotationFont (the
	 * standing all-renderings ruling), passed in as a prop so six pickers
	 * share one load. Without the font (fetch failed, or not yet arrived)
	 * the preview falls back to primitive shapes, the same degradation
	 * the score renderer accepts: a picker is never blocked on a font.
	 *
	 * Clef is auto-chosen per note (bass below middle C, treble from
	 * middle C up, by sounding pitch), so a bass's low D2 and a soprano's
	 * high C6 each sit near their staff. The preview's box is sized for
	 * C1–B6 (the octave controls' span), so no legal note ever clips.
	 *
	 * Every field is optional (the phase is skippable, never a gate):
	 * the letter control carries a none state, and Clear returns to it.
	 * Accidental and octave persist while unset, so re-choosing a letter
	 * restores the singer's staged context instead of resetting it.
	 */
	import { t, type Language } from '$lib/i18n';
	import type { Pitch, RequiredGlyphName } from '@ilya/score-parser';
	import { smuflFontSizePx, spToPx } from '@ilya/score-parser';
	import type { LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import {
		STEPS,
		clefFor,
		staffOffset,
		ledgerOffsets,
		pitchLabel,
		spokenPitchLabel,
		type Step
	} from '$lib/shane/note-picker';

	interface Props {
		/** The field's visible name (fieldset legend), e.g. "Lowest comfortable note". */
		label: string;
		value?: Pitch | undefined;
		/** Shared notation font; null falls back to primitive shapes. */
		font?: LoadedNotationFont | null;
		onchange: (p: Pitch | undefined) => void;
		/** N.50: active display language, threaded to the dictionary. */
		language: Language;
	}

	let { label, value = undefined, font = null, onchange, language }: Props = $props();

	// N.50: the house dictionary pattern, per `const T` in CalibrationWizard.svelte.
	const T = (key: string) => t(key, language);

	// Staged accidental and octave survive while no letter is chosen (and
	// after Clear), so the controls never snap back mid-entry.
	let stagedAlter = $state(0);
	let stagedOctave = $state(4);
	let curStep = $derived<Step | ''>(value?.step ?? '');
	let curAlter = $derived(value ? value.alter : stagedAlter);
	let curOctave = $derived(value ? value.octave : stagedOctave);

	const OCTAVES = [1, 2, 3, 4, 5, 6];
	// N.50: the option text is a dictionary KEY, not a literal. The glyphs
	// were dropped with the translation (Dann, E.43): a native picker wheel
	// takes no CSS, so ♯♯ could be neither kerned nor replaced by the
	// notation font's single x-shaped accidentalDoubleSharp.
	const ACCIDENTALS: { alter: number; key: string }[] = [
		{ alter: -2, key: 'notePicker.acc.doubleFlat' },
		{ alter: -1, key: 'notePicker.acc.flat' },
		{ alter: 0, key: 'notePicker.acc.natural' },
		{ alter: 1, key: 'notePicker.acc.sharp' },
		{ alter: 2, key: 'notePicker.acc.doubleSharp' }
	];

	function setStep(step: string) {
		if (!step) {
			onchange(undefined);
			return;
		}
		onchange({ step: step as Step, alter: curAlter, octave: curOctave });
	}
	function setAlter(alter: number) {
		stagedAlter = alter;
		if (value) onchange({ step: value.step, alter, octave: value.octave });
	}
	function setOctave(octave: number) {
		stagedOctave = octave;
		if (value) onchange({ step: value.step, alter: value.alter, octave });
	}
	function clear() {
		if (!value) return;
		stagedAlter = value.alter;
		stagedOctave = value.octave;
		onchange(undefined);
	}

	// ── Staff preview geometry ────────────────────────────────────────
	// Sized for the controls' full span (C1 bass to B6 treble): lineGap 8,
	// middle line at y=68 in a 150×136 box. The box is constant whether or
	// not a note is set — the reserved-space discipline (the hold-slot and
	// static-roster precedent), so choosing a letter never shifts layout.
	const L = 8; // lineGap, px
	const HALF = L / 2;
	const MID = 68;
	const W = 150;
	const H = 136;
	const NOTE_X = 100; // notehead centre
	const ACC_X = 82; // accidental centre
	const glyphSize = smuflFontSizePx(L); // 4 spaces, one em spans the staff

	let clef = $derived(value ? clefFor(value) : 'treble');
	let offset = $derived(value ? staffOffset(value, clef) : 0);
	let noteY = $derived(MID - offset * HALF);
	let ledgers = $derived(value ? ledgerOffsets(offset) : []);

	const sp = (n: number) => spToPx(n, L);
	let prepared = $derived(font?.prepared ?? null);
	let staffLineT = $derived(prepared ? sp(prepared.engravingDefaults.staffLineThickness) : 1);
	let ledgerT = $derived(prepared ? sp(prepared.engravingDefaults.legerLineThickness) : 1.4);
	// Ledger extension beyond the notehead, per side (SMuFL engraving default).
	let ledgerHalf = $derived.by(() => {
		const headHalf = prepared ? sp(prepared.glyph('noteheadWhole').widthSp / 2) : 7;
		return headHalf + (prepared ? sp(prepared.engravingDefaults.legerLineExtension) : 3);
	});

	const ACC_GLYPH: Record<number, RequiredGlyphName> = {
		[-2]: 'accidentalDoubleFlat',
		[-1]: 'accidentalFlat',
		1: 'accidentalSharp',
		2: 'accidentalDoubleSharp'
	};
	// Primitive-fallback accidental text (Unicode, not SMuFL).
	const ACC_TEXT: Record<number, string> = { [-2]: '♭♭', [-1]: '♭', 1: '♯', 2: '♯♯' };

	/** The x that centres a SMuFL glyph (drawn from its left edge) on `x`. */
	function glyphX(name: RequiredGlyphName, x: number): number {
		return prepared ? x - sp(prepared.glyph(name).widthSp / 2) : x;
	}
</script>

<fieldset class="np">
	<legend class="np-legend">{label}</legend>
	<div class="np-row">
		<div class="np-controls">
			<select
				class="np-select"
				aria-label={T('notePicker.letterAria')}
				value={curStep}
				onchange={(e) => setStep(e.currentTarget.value)}
			>
				<option value="">—</option>
				{#each STEPS as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
			<select
				class="np-select"
				aria-label={T('notePicker.accidentalAria')}
				value={String(curAlter)}
				onchange={(e) => setAlter(Number(e.currentTarget.value))}
			>
				{#each ACCIDENTALS as a (a.alter)}
					<option value={String(a.alter)}>{T(a.key)}</option>
				{/each}
			</select>
			<select
				class="np-select"
				aria-label={T('notePicker.octaveAria')}
				value={String(curOctave)}
				onchange={(e) => setOctave(Number(e.currentTarget.value))}
			>
				{#each OCTAVES as o (o)}
					<option value={String(o)}>{o}</option>
				{/each}
			</select>
		</div>

		<!-- The staff preview: presentational, aria-hidden — the spoken
		     note name below carries the same information in words. -->
		<svg
			class="np-staff"
			viewBox="0 0 {W} {H}"
			width={W}
			height={H}
			aria-hidden="true"
			focusable="false"
		>
			{#each [-2, -1, 0, 1, 2] as i (i)}
				<line
					x1="10"
					y1={MID + i * L}
					x2={W - 10}
					y2={MID + i * L}
					stroke="#3a352f"
					stroke-width={staffLineT}
				/>
			{/each}
			{#if prepared && font}
				{#if clef === 'bass'}
					<text x="16" y={MID - L} font-size="{glyphSize}px" font-family={font.family} fill="#3a352f"
						>{prepared.glyph('fClef').char}</text
					>
				{:else}
					<text x="16" y={MID + L} font-size="{glyphSize}px" font-family={font.family} fill="#3a352f"
						>{prepared.glyph('gClef').char}</text
					>
				{/if}
			{:else if clef === 'bass'}
				<!-- Primitive clef fallback, the staff renderer's shapes. -->
				<path
					d="M22 {MID - L - 5} q10 -2 10 8 q0 12 -14 16"
					fill="none"
					stroke="#3a352f"
					stroke-width="2.2"
				/>
				<circle cx="36" cy={MID - L - 3} r="1.7" fill="#3a352f" />
				<circle cx="36" cy={MID - L + 3} r="1.7" fill="#3a352f" />
			{:else}
				<line x1="26" y1={MID - 2 * L - 8} x2="26" y2={MID + L + 10} stroke="#3a352f" stroke-width="2.2" />
				<circle cx="26" cy={MID + L} r="4" fill="none" stroke="#3a352f" stroke-width="1.6" />
			{/if}

			{#if value}
				{#each ledgers as k (k)}
					<line
						x1={NOTE_X - ledgerHalf}
						y1={MID - k * HALF}
						x2={NOTE_X + ledgerHalf}
						y2={MID - k * HALF}
						stroke="#3a352f"
						stroke-width={ledgerT}
					/>
				{/each}
				{#if prepared && font}
					{#if value.alter !== 0}
						<text
							x={glyphX(ACC_GLYPH[value.alter], ACC_X)}
							y={noteY}
							font-size="{glyphSize}px"
							font-family={font.family}
							fill="#1a1612">{prepared.glyph(ACC_GLYPH[value.alter]).char}</text
						>
					{/if}
					<text
						x={glyphX('noteheadWhole', NOTE_X)}
						y={noteY}
						font-size="{glyphSize}px"
						font-family={font.family}
						fill="#1a1612">{prepared.glyph('noteheadWhole').char}</text
					>
				{:else}
					{#if value.alter !== 0}
						<text x={ACC_X} y={noteY + 4} text-anchor="middle" font-size="12" fill="#1a1612"
							>{ACC_TEXT[value.alter]}</text
						>
					{/if}
					<ellipse cx={NOTE_X} cy={noteY} rx="5.5" ry="3.6" fill="none" stroke="#1a1612" stroke-width="1.6" />
				{/if}
			{/if}
		</svg>

		<div class="np-readout">
			{#if value}
				<span class="np-name" aria-hidden="true">{pitchLabel(value)}</span>
				<span class="visually-hidden">{spokenPitchLabel(value)}</span>
				<button type="button" class="np-clear" onclick={clear}>{T('notePicker.clear')}</button>
			{:else}
				<span class="np-name np-name-empty" aria-hidden="true">—</span>
				<span class="visually-hidden">{T('notePicker.empty')}</span>
			{/if}
		</div>
	</div>
</fieldset>

<style>
	.np {
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
	}
	.np-legend {
		padding: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ink-primary);
		margin-bottom: 0.25rem;
	}
	.np-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.np-controls {
		display: flex;
		gap: 0.375rem;
	}
	.np-select {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.875rem;
		color: var(--ink-primary);
		background: #ffffff;
		border: 1px solid var(--stone-300);
		border-radius: 0.375rem;
		padding: 0.25rem 0.375rem;
	}
	.np-staff {
		flex-shrink: 0;
	}
	.np-readout {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		min-width: 3.5rem;
	}
	.np-name {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink-primary);
		font-variant-numeric: tabular-nums;
	}
	.np-name-empty {
		color: var(--ink-tertiary);
		font-weight: 400;
	}
	.np-clear {
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		background: transparent;
		border: none;
		text-decoration: underline;
		cursor: pointer;
		padding: 0;
	}
	.np-clear:hover {
		color: var(--ink-secondary);
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
</style>
