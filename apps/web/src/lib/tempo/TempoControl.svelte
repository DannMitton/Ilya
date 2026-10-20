<script lang="ts">
	/**
	 * THE TEMPO CONTROL (QUEUE row 48, ruled by Dann 2026-10-08 01:28 to 01:44):
	 * a small floating panel that never prints, where the singer sets their own
	 * tempo for the song. The beat unit is a row of note CHIPS, glyphs from the
	 * notation face with the note-value names as their accessible labels; beside
	 * them a number with − and + and a typed value; and "Use Ilya's estimate"
	 * to go back.
	 *
	 * FLEXIBILITY IS THE POINT (Dann, 01:44: "3/8 is not always felt in one, but
	 * it often is. Sometimes it can feel like a sprightly 3/4"). A tap on the
	 * other chip changes the unit and KEEPS THE SPEED (`convertBpm`): ♩. = 60
	 * becomes ♪ = 180, and the singer then sets the number as they feel it.
	 *
	 * One opener or two (Insights' "Change the tempo" and the Input band's
	 * receipt) both set `tempoUi.open`; the choice is stored on the song by
	 * `+page.svelte`'s binding (`SongRecord.tempo`) and every readout follows.
	 *
	 * Escape and a press outside the panel close it. There is no close button,
	 * because a button needs a name and no string for one is ratified: owed to
	 * Dann if he wants one. The words are the ratified `tempo.hint` and
	 * `tempo.useEstimate`; the − and + are the characters themselves.
	 */
	import { untrack } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { centredViewBox, commonInkBox, type InkBox } from '$lib/score/loupe';
	import { MEASURE_PX, measureGlyphInkInBrowser } from '$lib/score/loupe-ink';
	import { beatGlyph, beatName } from './beat-glyph';
	import { beatChips, BPM_MAX, BPM_MIN, clampBpm, convertBpm, type Beat } from './singer-tempo';
	import { tempoUi } from './tempo-ui.svelte';

	let { language }: { language: Language } = $props();
	const T = (key: string) => t(key, language);

	const cur = $derived(tempoUi.current);
	const beat = $derived<Beat | null>(cur ? { unit: cur.beatUnit as Beat['unit'], dots: cur.beatUnitDots } : null);
	const chips = $derived(tempoUi.score && beat ? beatChips(tempoUi.score, beat) : []);
	const estimated = $derived(cur?.provenance === 'estimated');
	const band = $derived(estimated && cur?.range ? `${cur.range[0]}–${cur.range[1]}` : '');
	const shown = $derived(estimated ? '' : cur ? String(Math.round(cur.bpm)) : '');

	/* THE CHIPS DRAW THEIR NOTE BY ITS MEASURED INK, as Corrections' duration
	   cells do (`CorrectionSurface.svelte`, row 128; Dann 2026-10-19: the notes
	   sit too high in their buttons, and the buffer should be consistent). A
	   SMuFL note's notehead sits on the baseline and its stem rises from it, so
	   set as text it hangs off the chip's centre. The chips shown share one ink
	   box (one scale, one margin) and each is drawn through a viewBox centred on
	   its own ink. Until the face is measured, the chip shows its glyph as text. */
	/** Glyphs measured into the common box besides the chips shown. Empty: the box spans the chips. For Corrections' scale, set it to `[...LENGTH_CELLS.map((c) => c.glyph), DOT]` (from `$lib/score/correction` and `./beat-glyph`). */
	const CHIP_BOX_EXTRA: readonly string[] = [];
	const CHIP_H = 26;
	const chipGlyphs = $derived(chips.map((c) => beatGlyph(c.unit, c.dots)));
	const boxGlyphs = $derived([...chipGlyphs, ...CHIP_BOX_EXTRA]);
	let boxes = $state<Record<string, InkBox>>({});
	const measured = new Set<string>();
	$effect(() => {
		if (!tempoUi.open) return;
		const wanted = boxGlyphs.filter((g) => g && !measured.has(g));
		if (wanted.length === 0) return;
		for (const g of wanted) measured.add(g);
		let alive = true;
		measureGlyphInkInBrowser(wanted)
			.then((next) => {
				if (alive) boxes = { ...untrack(() => boxes), ...next };
			})
			.catch(() => {
				// The face never loaded: the chips keep their text glyphs. Allow a retry.
				for (const g of wanted) measured.delete(g);
			});
		return () => {
			alive = false;
			for (const g of wanted) if (!(g in untrack(() => boxes))) measured.delete(g);
		};
	});
	const common = $derived(commonInkBox(boxGlyphs.map((g) => boxes[g]).filter((b): b is InkBox => !!b)));
	function drawn(glyph: string): { viewBox: string; width: number; height: number } | null {
		const box = boxes[glyph];
		if (!box || common.height <= 0) return null;
		return { viewBox: centredViewBox(box, common), width: (CHIP_H * common.width) / common.height, height: CHIP_H };
	}

	/** The number the steppers start from: the singer's, else the figure in force (an estimate's midpoint). */
	const start = $derived(tempoUi.choice?.bpm ?? Math.round(cur?.bpm ?? 66));

	function set(bpm: number, to: Beat) {
		tempoUi.choose({ bpm: clampBpm(bpm), beatUnit: to.unit, beatUnitDots: to.dots });
	}
	function pickChip(to: Beat) {
		if (!beat) return;
		set(convertBpm(start, beat, to), to);
	}
	function nudge(by: number) {
		if (beat) set(start + by, beat);
	}
	function typed(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value.replace(',', '.').trim();
		const n = Number(raw);
		if (beat && raw !== '' && Number.isFinite(n) && n > 0) set(n, beat);
		else (e.currentTarget as HTMLInputElement).value = shown;
	}

	let panel: HTMLDivElement | undefined = $state();
	let input: HTMLInputElement | undefined = $state();

	$effect(() => {
		if (!tempoUi.open) return;
		input?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') tempoUi.closeControl();
		};
		/* A press outside closes it, except on a tap that opens it: the opener's own
		   click has already run by the time this listener is attached. */
		const onDown = (e: PointerEvent) => {
			if (panel && !panel.contains(e.target as Node)) tempoUi.closeControl();
		};
		window.addEventListener('keydown', onKey);
		const id = setTimeout(() => window.addEventListener('pointerdown', onDown), 0);
		return () => {
			window.removeEventListener('keydown', onKey);
			clearTimeout(id);
			window.removeEventListener('pointerdown', onDown);
		};
	});
</script>

{#if tempoUi.open && cur && beat}
	<div class="tempo-control" role="dialog" aria-labelledby="tempo-hint" bind:this={panel} data-tempo-control>
		<p id="tempo-hint" class="hint">{T('tempo.hint')}</p>
		<div class="row">
			<div class="chips" role="group" aria-labelledby="tempo-hint">
				{#each chips as c (`${c.unit}.${c.dots}`)}
					{@const on = c.unit === beat.unit && c.dots === beat.dots}
					{@const g = beatGlyph(c.unit, c.dots)}
					{@const d = drawn(g)}
					<button type="button" class="chip" class:on aria-pressed={on} aria-label={beatName(c.unit, c.dots, language)} onclick={() => pickChip(c)}>
						{#if d}
							<svg class="glyph" viewBox={d.viewBox} width={d.width} height={d.height} aria-hidden="true" focusable="false">
								<text x="0" y="0" font-family="Finale Maestro" font-size={MEASURE_PX} fill="currentColor">{g}</text>
							</svg>
						{:else}
							<span class="mus" aria-hidden="true">{g}</span>
						{/if}
					</button>
				{/each}
			</div>
			<span class="equals" aria-hidden="true">=</span>
			<div class="stepper">
				<button type="button" class="step" disabled={start <= BPM_MIN} onclick={() => nudge(-1)}>{'−'}</button>
				<input
					bind:this={input}
					class="bpm"
					type="text"
					inputmode="decimal"
					autocomplete="off"
					aria-labelledby="tempo-hint"
					placeholder={band}
					value={shown}
					onchange={typed}
					onkeydown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
				/>
				<button type="button" class="step" disabled={start >= BPM_MAX} onclick={() => nudge(1)}>+</button>
			</div>
		</div>
		{#if tempoUi.choice}
			<button type="button" class="use-estimate" onclick={() => tempoUi.choose(null)}>{T('tempo.useEstimate')}</button>
		{/if}
	</div>
{/if}

<style>
	.tempo-control {
		position: fixed;
		right: 24px;
		bottom: 24px;
		z-index: 60;
		box-sizing: border-box;
		width: min(340px, calc(100vw - 24px));
		padding: 0.8rem 1rem 0.9rem;
		border: 1px solid var(--lavender, #9585a2);
		border-radius: 12px;
		background: var(--paper-cream, #f6f1e6);
		box-shadow: 0 6px 24px rgba(26, 22, 18, 0.18);
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans);
	}

	.hint {
		margin: 0 0 0.6rem;
		font-size: 0.8rem;
		font-style: italic;
		color: var(--ink-secondary, #4a4540);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.chips {
		display: flex;
		gap: 0.35rem;
	}

	.chip,
	.step {
		appearance: none;
		min-width: 44px;
		min-height: 44px;
		box-sizing: border-box;
		border: 1px solid var(--lavender, #9585a2);
		border-radius: 10px;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
		line-height: 1;
	}

	/* The chip centres a box of one size for the set, so the margin is the same in every chip. */
	.chip {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.glyph {
		display: block;
		overflow: visible;
	}

	.chip.on {
		background: var(--lavender, #9585a2);
		color: #fff;
	}

	.chip:focus-visible,
	.step:focus-visible,
	.bpm:focus-visible,
	.use-estimate:focus-visible {
		outline: 2px solid var(--lavender, #9585a2);
		outline-offset: 2px;
	}

	.step:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.step {
		font-size: 1.2rem;
	}

	.mus {
		font-family: 'Finale Maestro', serif;
		font-size: 1.5rem;
	}

	.equals {
		font-size: 1rem;
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		margin-left: auto;
	}

	.bpm {
		box-sizing: border-box;
		width: 4.4rem;
		min-height: 44px;
		padding: 0 0.4rem;
		border: 1px solid var(--lavender, #9585a2);
		border-radius: 10px;
		background: #fff;
		color: inherit;
		font: inherit;
		font-variant-numeric: tabular-nums;
		text-align: center;
	}

	.bpm::placeholder {
		color: var(--ink-tertiary, #6a655f);
	}

	.use-estimate {
		appearance: none;
		margin: 0.6rem 0 0;
		padding: 0.25rem 0.1rem;
		min-height: 44px;
		border: 0;
		background: none;
		font: inherit;
		font-size: 0.85rem;
		color: var(--lavender-ink, #6b5b7a);
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	/* On a phone it spans the bottom, clear of the home bar. */
	@media (max-width: 700px) {
		.tempo-control {
			left: 12px;
			right: 12px;
			bottom: calc(12px + env(safe-area-inset-bottom, 0px));
			width: auto;
		}
	}

	/* It never prints (row 48). */
	@media print {
		.tempo-control {
			display: none;
		}
	}
</style>
