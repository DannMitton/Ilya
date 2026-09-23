<script lang="ts">
	/**
	 * The tessituragram: N.123's phonation time per pitch joined to N.127
	 * increment 2's compass stave, one figure on one pitch axis
	 * (`docs/sessions/brief-code-tessituragram_r1_2026-09-23.md`).
	 *
	 * The geometry is Design's R3, drawing 1a
	 * (`docs/sessions/n127-design-pack/design-return-insights_r3_2026-09-11.dc.html`):
	 * the stave on the left, horizontal bars on the right, the range and the
	 * tessitura shaded, the passaggi across the bars only. The additions are
	 * the desk's redraw (`docs/sessions/tessituragram-squircle_r1_2026-09-23.html`):
	 * a finding's number at its bar, one focus colour, labels where things
	 * sit, and quiet bars for a quiet song. One bar per SPELLED pitch, which
	 * is the one place R3 is not copied.
	 *
	 * Colour roles, one per token (brief §3): `--rose-desk` the range field,
	 * `--rose` the bars and the tessitura band, `--rose-chip` the passaggio
	 * lines, `--rose-ink` the focus segment, the numbers, and every label.
	 *
	 * A document: nothing here is clickable or focusable.
	 */
	import { onMount } from 'svelte';
	import { smuflFontSizePx, spToPx, pitchToMidi, type Pitch, type RequiredGlyphName } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import { pitchLabel } from '$lib/shane/note-picker';
	import { diatonicOf, formatSeconds, type FigureBar, type TessituragramModel } from '$lib/shane/insights';

	interface Props {
		figure: TessituragramModel;
		language: Language;
	}

	let { figure, language }: Props = $props();

	const T = (key: string) => t(key, language);
	const fill = (s: string, vars: Record<string, string | number>) =>
		Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

	let font = $state<LoadedNotationFont | null>(null);
	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then((f) => {
				if (alive) font = f;
			})
			.catch(() => {
				/* the figure draws its heads as ellipses and omits the clef */
			});
		return () => {
			alive = false;
		};
	});
	const prepared = $derived(font?.prepared ?? null);

	// ── Geometry. JUDGEMENT throughout, scaled from R3 drawing 1a ──────
	/** The squircle's inner width at letter: 816 less 2 × 96 margin, 2 × 26 padding, 2 × 1 border. */
	const W = 570;
	/** Half a line gap: one stave step. R3's value. */
	const STEP = 7;
	const LINE_GAP = STEP * 2;
	const PAD_TOP = 12;
	const LABEL_ROW = 18;
	const NAMES_X = 28;
	const STAVE_L = 32;
	const STAVE_R = 206;
	const CLEF_X = 36;
	const LOW_X = 96;
	const HIGH_X = 170;
	/** The bars' shared baseline, and the longest bar's length. */
	const BAR_X = 262;
	const BAR_MAX = 150;
	const BAR_H = 5;
	const RIGHT = W - 8;
	const MARK_R = 5.2;
	const MARK_STEP = 12;

	/** Lines, bottom to top, as stave steps. */
	const STAVE_LINES: Record<'treble' | 'bass', number[]> = {
		bass: [18, 20, 22, 24, 26], // G2 B2 D3 F3 A3
		treble: [30, 32, 34, 36, 38], // E4 G4 B4 D5 F5
	};
	const LINE_NAMES: Record<'treble' | 'bass', string[]> = {
		bass: ['G2', 'B2', 'D3', 'F3', 'A3'],
		treble: ['E4', 'G4', 'B4', 'D5', 'F5'],
	};

	const lines = $derived(STAVE_LINES[figure.clef]);
	const bottomLine = $derived(lines[0]);
	const topLine = $derived(lines[4]);
	const middleLine = $derived(lines[2]);

	const lowD = $derived(diatonicOf(figure.compass.low));
	const highD = $derived(diatonicOf(figure.compass.high));

	/** Every step the figure must show, so nothing it draws falls outside the frame. */
	const extent = $derived.by(() => {
		const ds = [bottomLine, topLine, lowD, highD, ...figure.slots.map((s) => s.diatonic)];
		for (const span of [figure.range, figure.tessitura]) if (span) ds.push(diatonicOf(span.low), diatonicOf(span.high));
		if (figure.passaggio) ds.push(diatonicOf(figure.passaggio.primo), diatonicOf(figure.passaggio.secondo));
		return { top: Math.max(...ds) + 1, bottom: Math.min(...ds) - 1 };
	});

	const y = (d: number) => PAD_TOP + (extent.top - d) * STEP;
	const H = $derived(y(extent.bottom) + STEP / 2 + LABEL_ROW);

	// ── Bars ───────────────────────────────────────────────────────────
	interface DrawnBar extends FigureBar {
		top: number;
		height: number;
		length: number;
		focus: number;
	}

	const drawn = $derived(
		figure.slots.flatMap((slot) => {
			const n = slot.bars.length;
			const gap = 0.6;
			const h = (BAR_H - gap * (n - 1)) / n;
			const bottom = y(slot.diatonic) + BAR_H / 2;
			return slot.bars.map((bar, i): DrawnBar => ({
				...bar,
				top: bottom - (i + 1) * h - i * gap,
				height: h,
				length: (bar.quavers / figure.longest.quavers) * BAR_MAX,
				focus: figure.quiet ? 0 : (bar.focusQuavers / figure.longest.quavers) * BAR_MAX,
			}));
		}),
	);

	const same = (a: Pitch, b: Pitch) => a.step === b.step && (a.alter ?? 0) === (b.alter ?? 0) && a.octave === b.octave;

	/** The numbers each bar carries, side by side in list order. */
	function marksOf(bar: FigureBar): number[] {
		return figure.quiet ? [] : figure.marks.filter((m) => same(m.pitch, bar.pitch)).map((m) => m.n);
	}

	const longestText = $derived.by(() => {
		const s = figure.longest.seconds;
		if (figure.scale === 'seconds' && s?.kind === 'point') return formatSeconds(s.seconds);
		if (s?.kind === 'range') return fill(T('insights.fit.span'), { low: formatSeconds(s.low), high: formatSeconds(s.high) });
		return fill(T('insights.phonation.share'), { n: Math.round(figure.longest.share * 100) });
	});

	// ── The passaggi ───────────────────────────────────────────────────
	/* THE LINE SITS ON THE ZONE EDGE (`phonationSection`): the primo belongs
	   to the zone between, so its line runs under the primo's bar, and the
	   secondo's runs over the secondo's. In a split step the line runs
	   between the two spellings where the MIDI number crosses the edge. */
	function edgeY(edge: Pitch, side: 'primo' | 'secondo'): number {
		const d = diatonicOf(edge);
		const midi = pitchToMidi(edge);
		const inSlot = drawn.filter((b) => diatonicOf(b.pitch) === d);
		if (side === 'primo') {
			const first = inSlot.find((b) => b.midi >= midi);
			return first ? first.top + first.height + 0.8 : y(d) + STEP / 2;
		}
		const last = [...inSlot].reverse().find((b) => b.midi <= midi);
		return last ? last.top - 0.8 : y(d) - STEP / 2;
	}

	const passaggi = $derived(
		figure.passaggio && figure.zones
			? { primo: edgeY(figure.passaggio.primo, 'primo'), secondo: edgeY(figure.passaggio.secondo, 'secondo') }
			: null,
	);

	const shareText = (n: number) => fill(T('insights.phonation.share'), { n });

	// ── The range's label ──────────────────────────────────────────────
	/* Top left of the field, unless the clef reaches that high: a treble
	   clef rises above its stave, so the label then starts past it. The
	   clef's extent is the font's own bounding box, not an estimate. */
	const clefName = $derived<RequiredGlyphName>(figure.clef === 'bass' ? 'fClef' : 'gClef');
	const clefAnchor = $derived(figure.clef === 'bass' ? 24 : 32);
	const rangeTop = $derived(figure.range ? y(diatonicOf(figure.range.high)) - STEP / 2 : 0);
	const rangeLabelX = $derived.by(() => {
		if (!prepared) return 8;
		const g = prepared.glyph(clefName);
		const clefTop = y(clefAnchor) - sp(g.bBoxNE[1]);
		const clefBottom = y(clefAnchor) - sp(g.bBoxSW[1]);
		const labelTop = rangeTop + 1;
		const labelBottom = rangeTop + 11;
		return clefTop < labelBottom && clefBottom > labelTop ? CLEF_X + sp(g.widthSp) + 6 : 8;
	});

	// ── The stave ──────────────────────────────────────────────────────
	const glyphPx = smuflFontSizePx(LINE_GAP);
	const sp = (n: number) => spToPx(n, LINE_GAP);
	const headHalf = $derived(prepared ? sp(prepared.glyph('noteheadBlack').widthSp / 2) : 6);
	const ACC: Record<number, RequiredGlyphName> = {
		[-2]: 'accidentalDoubleFlat',
		[-1]: 'accidentalFlat',
		1: 'accidentalSharp',
		2: 'accidentalDoubleSharp',
	};

	/** Ledger steps between the stave and a note outside it. */
	function ledgers(d: number): number[] {
		const out: number[] = [];
		for (let l = bottomLine - 2; l >= d; l -= 2) out.push(l);
		for (let l = topLine + 2; l <= d; l += 2) out.push(l);
		return out;
	}

	const notes = $derived(
		lowD === highD && same(figure.compass.low, figure.compass.high)
			? [{ pitch: figure.compass.low, x: LOW_X, labels: ['lowest', 'highest'] }]
			: [
					{ pitch: figure.compass.low, x: LOW_X, labels: ['lowest'] },
					{ pitch: figure.compass.high, x: HIGH_X, labels: ['highest'] },
				],
	);
</script>

<svg
	class="tessituragram"
	viewBox="0 0 {W} {H}"
	aria-hidden="true"
	focusable="false"
	style="font-family: var(--font-sans);"
>
	<defs>
		<clipPath id="tessituragram-frame">
			<rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="12" />
		</clipPath>
	</defs>

	<g clip-path="url(#tessituragram-frame)">
		{#if figure.range}
			{@const top = y(diatonicOf(figure.range.high)) - STEP / 2}
			{@const bottom = y(diatonicOf(figure.range.low)) + STEP / 2}
			<rect x="0" y={top} width={W} height={bottom - top} fill="var(--rose-desk)" fill-opacity="0.45" />
			<text x={rangeLabelX} y={top + 9} font-size="8" fill="var(--rose-ink)"
				>{fill(T('insights.figure.rangeLabel'), { low: pitchLabel(figure.range.low), high: pitchLabel(figure.range.high) })}</text
			>
		{/if}
	</g>

	{#if figure.tessitura}
		{@const top = y(diatonicOf(figure.tessitura.high)) - STEP / 2}
		{@const bottom = y(diatonicOf(figure.tessitura.low)) + STEP / 2}
		<rect x={STAVE_L} y={top} width={STAVE_R - STAVE_L} height={bottom - top} fill="var(--rose)" opacity="0.26" />
		<text x={STAVE_R - 2} y={bottom - 2} font-size="8" fill="var(--rose-ink)" text-anchor="end">{T('insights.figure.tessitura')}</text>
	{/if}

	<rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="12" fill="none" stroke="var(--rose)" stroke-width="1" />

	<!-- The stave, its line names, and the clef that follows the singer. -->
	<g stroke="var(--ink-stave, #1a1612)" stroke-width="1">
		{#each lines as l (l)}
			<line x1={STAVE_L} y1={y(l)} x2={STAVE_R} y2={y(l)} />
		{/each}
	</g>
	<g font-size="8.5" fill="var(--rose-ink)" text-anchor="end">
		{#each lines as l, i (l)}
			<text x={NAMES_X} y={y(l) + 3}>{LINE_NAMES[figure.clef][i]}</text>
		{/each}
	</g>
	{#if prepared && font}
		<text
			x={CLEF_X}
			y={y(clefAnchor)}
			font-family={font.family}
			font-size={glyphPx}
			fill="var(--ink-stave, #1a1612)">{prepared.glyph(clefName).char}</text
		>
	{/if}

	<!-- The compass: the lowest and highest sung pitch, spelled as the score spells them. -->
	{#each notes as n (n.x)}
		{@const d = diatonicOf(n.pitch)}
		{@const up = d < middleLine}
		<g stroke="var(--ink-stave, #1a1612)" stroke-width="1">
			{#each ledgers(d) as l (l)}
				<line x1={n.x - headHalf - 4} y1={y(l)} x2={n.x + headHalf + 4} y2={y(l)} />
			{/each}
		</g>
		{#if prepared && font}
			<text x={n.x - headHalf} y={y(d)} font-family={font.family} font-size={glyphPx} fill="var(--ink-stave, #1a1612)"
				>{prepared.glyph('noteheadBlack').char}</text
			>
			{#if n.pitch.alter}
				{@const acc = ACC[n.pitch.alter]}
				<text
					x={n.x - headHalf - 3 - sp(prepared.glyph(acc).widthSp)}
					y={y(d)}
					font-family={font.family}
					font-size={glyphPx}
					fill="var(--ink-stave, #1a1612)">{prepared.glyph(acc).char}</text
				>
			{/if}
		{:else}
			<ellipse cx={n.x} cy={y(d)} rx="6" ry="4.4" fill="var(--ink-stave, #1a1612)" transform="rotate(-18 {n.x} {y(d)})" />
		{/if}
		<line
			x1={up ? n.x + headHalf - 0.6 : n.x - headHalf + 0.6}
			y1={y(d)}
			x2={up ? n.x + headHalf - 0.6 : n.x - headHalf + 0.6}
			y2={up ? y(d) - STEP * 7 : y(d) + STEP * 7}
			stroke="var(--ink-stave, #1a1612)"
			stroke-width="1.2"
		/>
		{#each n.labels as which, i (which)}
			<text
				x={n.x}
				y={H - 7 - (n.labels.length - 1 - i) * 10}
				font-size="8.5"
				fill="var(--rose-ink)"
				text-anchor="middle">{fill(T(`insights.figure.${which}`), { pitch: pitchLabel(n.pitch) })}</text
			>
		{/each}
	{/each}

	<!-- The bars: time per spelled pitch from one baseline. -->
	<g opacity={figure.quiet ? 0.5 : 1}>
		{#each drawn as b (`${b.pitch.step}${b.pitch.alter}${b.pitch.octave}`)}
			<rect x={BAR_X} y={b.top} width={b.length} height={b.height} fill="var(--rose)" />
			{#if b.focus > 0}
				<rect x={BAR_X} y={b.top} width={b.focus} height={b.height} fill="var(--rose-ink)" />
			{/if}
		{/each}
	</g>
	<line x1={BAR_X} y1={PAD_TOP - 4} x2={BAR_X} y2={y(extent.bottom) + STEP / 2} stroke="var(--rose-ink)" stroke-width="0.8" />

	{#each drawn as b (`m${b.pitch.step}${b.pitch.alter}${b.pitch.octave}`)}
		{@const marks = marksOf(b)}
		{@const cy = b.top + b.height / 2}
		{#each marks as n, i (n)}
			{@const cx = BAR_X + b.length + 4 + MARK_R + i * MARK_STEP}
			<circle {cx} {cy} r={MARK_R} fill="var(--paper-cream)" stroke="var(--rose-ink)" stroke-width="0.9" />
			<text x={cx} y={cy + 2.7} font-size="7.5" font-weight="700" fill="var(--rose-ink)" text-anchor="middle">{n}</text>
		{/each}
		{#if same(b.pitch, figure.longest.pitch)}
			<text
				x={BAR_X + b.length + 5 + (marks.length > 0 ? marks.length * MARK_STEP + 2 : 0)}
				y={cy + 3}
				font-size="8"
				fill="var(--rose-ink)">{longestText}</text
			>
		{/if}
	{/each}

	<!-- The passaggi, across the bars only, and each zone's share at its right edge. -->
	{#if passaggi && figure.zones}
		<g stroke="var(--rose-chip)" stroke-width="1" stroke-dasharray="4 3">
			<line x1={BAR_X - 44} y1={passaggi.primo} x2={RIGHT} y2={passaggi.primo} />
			<line x1={BAR_X - 44} y1={passaggi.secondo} x2={RIGHT} y2={passaggi.secondo} />
		</g>
		<g font-size="7.5" fill="var(--rose-ink)" text-anchor="end">
			<text x={BAR_X - 4} y={passaggi.primo - 2}>{T('insights.figure.primo')}</text>
			<text x={BAR_X - 4} y={passaggi.secondo - 2}>{T('insights.figure.secondo')}</text>
		</g>
		<g font-size="8.5" font-weight="600" fill="var(--rose-ink)" text-anchor="end">
			<text x={RIGHT} y={passaggi.secondo - 4}>{fill(T('insights.figure.zoneAbove'), { share: shareText(figure.zones.above) })}</text>
			<text x={RIGHT} y={passaggi.primo - 4}>{fill(T('insights.figure.zoneBetween'), { share: shareText(figure.zones.between) })}</text>
			<text x={RIGHT} y={passaggi.primo + 11}>{fill(T('insights.figure.zoneBelow'), { share: shareText(figure.zones.below) })}</text>
		</g>
	{/if}
</svg>

<style>
	.tessituragram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
</style>
