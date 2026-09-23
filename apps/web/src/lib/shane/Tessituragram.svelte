<script lang="ts">
	/**
	 * The tessituragram: N.123's phonation time per pitch joined to N.127
	 * increment 2's compass stave, revised after Dann's walk of `0ccda31`
	 * (`docs/sessions/brief-code-tessituragram_r2_2026-09-23.md`).
	 *
	 * ONE STAVE CARRIES EVERYTHING, as in the desk's sparse drawing
	 * (`docs/sessions/tessituragram-sparse_r1_2026-09-23.html`): the clef, the
	 * compass as its two notes, a barline, then the bars growing rightward
	 * along the same lines and spaces. There is no second frame.
	 *
	 * ONE ROW PER SOUNDING PITCH. A natural sits on its line or space; a sung
	 * sharp or flat sits half a stave step from its letter, and enharmonic
	 * spellings share its row. Only the accidentals the piece sings get a row.
	 *
	 * Colour roles, one per token: `--rose` the bars and the tessitura band,
	 * `--rose-ink` a bar with a finding and every label but the line names,
	 * which are tertiary ink; `--rose-chip` the passaggio lines.
	 *
	 * A document: nothing here is clickable or focusable.
	 */
	import { onMount } from 'svelte';
	import { smuflFontSizePx, spToPx, pitchToMidi, type RequiredGlyphName } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import { pitchLabel } from '$lib/shane/note-picker';
	import { diatonicOf, formatSeconds, type FigureRow, type TessituragramModel } from '$lib/shane/insights';

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

	// ── Geometry. JUDGEMENT throughout, scaled from the sparse drawing ──
	/** The squircle's inner width at letter: 816 less 2 × 96 margin, 2 × 26 padding, 2 × 1 border. */
	const W = 570;
	const TOP = 18;
	const BOTTOM = 16;
	const CLEF_X = 4;
	const LOW_X = 66;
	const HIGH_X = 100;
	const BARLINE = 136;
	/** Line names end here; a sung accidental's name ends at the next column. */
	const LINE_NAME_X = 204;
	const ROW_NAME_X = 229;
	/** The bars' shared baseline, and the longest bar's length. */
	const BAR_X = 234;
	const BAR_MAX = 196;
	const RIGHT = W - 2;

	/* THE ROW SPACING. A bar is 4.4 px; beside a sung neighbour half a step
	   away both draw 3 px (r2 §1, DESK DEFAULT). Rows closer than a thin bar
	   plus a 1 px gap cannot be told apart, so where such a pair is sung the
	   stave step grows from 7 px until half a step clears 4 px. */
	const BAR = 4.4;
	const THIN = 3;
	const MIN_GAP = 1;
	const BASE_STEP = 7;

	const WHITE: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
	const pc = (midi: number) => ((midi % 12) + 12) % 12;
	const isWhite = (midi: number) => WHITE[pc(midi)] !== undefined;
	/** The stave step of a white key's MIDI number. */
	const whiteStep = (midi: number) => (Math.floor(midi / 12) - 1) * 7 + WHITE[pc(midi)];

	const sung = $derived(new Set(figure.rows.map((r) => r.midi)));
	/** A row with a sung neighbour half a stave step away. */
	const tight = (midi: number) => [midi - 1, midi + 1].some((n) => sung.has(n) && (!isWhite(n) || !isWhite(midi)));
	const STEP = $derived(figure.rows.some((r) => tight(r.midi)) ? Math.max(BASE_STEP, 2 * (THIN + MIN_GAP)) : BASE_STEP);
	const LINE_GAP = $derived(STEP * 2);

	const STAVE_LINES: Record<'treble' | 'bass', number[]> = {
		bass: [18, 20, 22, 24, 26], // G2 B2 D3 F3 A3
		treble: [30, 32, 34, 36, 38], // E4 G4 B4 D5 F5
	};
	const lines = $derived(STAVE_LINES[figure.clef]);
	const bottomLine = $derived(lines[0]);
	const topLine = $derived(lines[4]);

	/** The steps a MIDI number reaches up to and down to, for the extent. */
	const upperStep = (midi: number) => whiteStep(isWhite(midi) ? midi : midi + 1);
	const lowerStep = (midi: number) => whiteStep(isWhite(midi) ? midi : midi - 1);

	const extent = $derived.by(() => {
		const ups = [topLine, diatonicOf(figure.compass.high), ...figure.rows.map((r) => upperStep(r.midi))];
		const downs = [bottomLine, diatonicOf(figure.compass.low), ...figure.rows.map((r) => lowerStep(r.midi))];
		if (figure.tessitura) {
			ups.push(upperStep(pitchToMidi(figure.tessitura.high)));
			downs.push(lowerStep(pitchToMidi(figure.tessitura.low)));
		}
		if (figure.passaggio && figure.zones) {
			ups.push(upperStep(pitchToMidi(figure.passaggio.secondo)) + 1);
			downs.push(lowerStep(pitchToMidi(figure.passaggio.primo)) - 1);
		}
		return { top: Math.max(...ups) + 1, bottom: Math.min(...downs) - 1 };
	});

	const y = (d: number) => TOP + (extent.top - d) * STEP;
	/** A sounding pitch's height: a natural on its step, a sharp or flat halfway between its neighbours. */
	const rowY = (midi: number) => (isWhite(midi) ? y(whiteStep(midi)) : (y(whiteStep(midi - 1)) + y(whiteStep(midi + 1))) / 2);
	const H = $derived(y(extent.bottom) + BOTTOM);

	// ── Stave lines, ledger lines, and their names ──────────────────────
	/** Ledger steps the bars reach beyond the stave: drawn faint and dotted, and named. */
	const barLedgers = $derived.by(() => {
		const out: number[] = [];
		const hi = Math.max(...figure.rows.map((r) => upperStep(r.midi)));
		const lo = Math.min(...figure.rows.map((r) => lowerStep(r.midi)));
		for (let l = topLine + 2; l <= hi; l += 2) out.push(l);
		for (let l = bottomLine - 2; l >= lo; l -= 2) out.push(l);
		return out;
	});
	const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	const stepName = (d: number) => `${LETTERS[((d % 7) + 7) % 7]}${Math.floor(d / 7)}`;

	// ── Bars ───────────────────────────────────────────────────────────
	interface DrawnRow extends FigureRow {
		cy: number;
		height: number;
		length: number;
		dark: boolean;
		name: string | null;
		labels: string[];
	}

	const measureTag = (m: string) => T('loupe.measureTagShort').replace('%m', m);

	const longestText = $derived.by(() => {
		const s = figure.longest.seconds;
		if (figure.scale === 'seconds' && s?.kind === 'point') return formatSeconds(s.seconds);
		if (s?.kind === 'range') return fill(T('insights.fit.span'), { low: formatSeconds(s.low), high: formatSeconds(s.high) });
		return fill(T('insights.phonation.share'), { n: Math.round(figure.longest.share * 100) });
	});

	const drawn = $derived(
		figure.rows.map((row): DrawnRow => {
			const dark = !figure.quiet && row.tags.length > 0;
			/* A dark bar's end names its findings as the list opens them, less the
			   pitch the row already shows, one per line; the longest bar's value
			   follows the first. */
			const labels = dark ? row.tags.map((tag) => `${measureTag(tag.measure)} · [${tag.vowel}]`) : [];
			if (row.midi === figure.longest.midi) {
				if (labels.length > 0) labels[0] = `${labels[0]} · ${longestText}`;
				else labels.push(longestText);
			}
			return {
				...row,
				cy: rowY(row.midi),
				height: tight(row.midi) ? THIN : BAR,
				length: (row.quavers / figure.longest.quavers) * BAR_MAX,
				dark,
				name: row.spellings.some((p) => (p.alter ?? 0) !== 0) ? row.spellings.map(pitchLabel).join(' / ') : null,
				labels,
			};
		}),
	);

	/** A label's text, its IPA set in the IPA face. */
	function labelParts(label: string): Array<{ text: string; ipa: boolean }> {
		return label
			.split(/(\[[^\]]*\])/)
			.filter((p) => p.length > 0)
			.map((text) => ({ text, ipa: /^\[.*\]$/.test(text) }));
	}

	// ── The passaggi ───────────────────────────────────────────────────
	/* THE LINE SITS ON THE ZONE EDGE (`phonationSection`): the primo belongs
	   to the zone between, so its line runs halfway to the pitch a semitone
	   under it, and the secondo's halfway to the one a semitone over it. */
	const passaggi = $derived.by(() => {
		if (!figure.passaggio || !figure.zones) return null;
		const p = pitchToMidi(figure.passaggio.primo);
		const s = pitchToMidi(figure.passaggio.secondo);
		return { primo: (rowY(p) + rowY(p - 1)) / 2, secondo: (rowY(s) + rowY(s + 1)) / 2 };
	});
	const shareText = (n: number) => fill(T('insights.phonation.share'), { n });

	// ── The compass ────────────────────────────────────────────────────
	const glyphPx = $derived(smuflFontSizePx(LINE_GAP));
	const sp = (n: number) => spToPx(n, LINE_GAP);
	const headHalf = $derived(prepared ? sp(prepared.glyph('noteheadBlack').widthSp / 2) : 6);
	const ACC: Record<number, RequiredGlyphName> = {
		[-2]: 'accidentalDoubleFlat',
		[-1]: 'accidentalFlat',
		1: 'accidentalSharp',
		2: 'accidentalDoubleSharp',
	};
	const clefName = $derived<RequiredGlyphName>(figure.clef === 'bass' ? 'fClef' : 'gClef');
	const clefAnchor = $derived(figure.clef === 'bass' ? 24 : 32);

	function noteLedgers(d: number): number[] {
		const out: number[] = [];
		for (let l = bottomLine - 2; l >= d; l -= 2) out.push(l);
		for (let l = topLine + 2; l <= d; l += 2) out.push(l);
		return out;
	}

	const notes = $derived(
		pitchToMidi(figure.compass.low) === pitchToMidi(figure.compass.high) &&
			diatonicOf(figure.compass.low) === diatonicOf(figure.compass.high)
			? [{ pitch: figure.compass.low, x: (LOW_X + HIGH_X) / 2 }]
			: [
					{ pitch: figure.compass.low, x: LOW_X },
					{ pitch: figure.compass.high, x: HIGH_X },
				],
	);

	const title = $derived(
		T(figure.scale === 'seconds' ? 'insights.figure.caption' : 'insights.figure.captionQuavers').toLocaleUpperCase(
			language === 'fr' ? 'fr-CA' : 'en-CA',
		),
	);
</script>

<svg class="tessituragram" viewBox="0 0 {W} {H}" aria-hidden="true" focusable="false" style="font-family: var(--font-sans);">
	<!-- The piece's tessitura, shaded on the stave and behind the bars, labelled once beside the stave. -->
	{#if figure.tessitura}
		{@const top = rowY(pitchToMidi(figure.tessitura.high)) - STEP / 2}
		{@const bottom = rowY(pitchToMidi(figure.tessitura.low)) + STEP / 2}
		<rect x="0" y={top} width={W} height={bottom - top} fill="var(--rose)" opacity="0.22" />
		<text x={BARLINE - 4} y={bottom - 2} font-size="7.5" fill="var(--rose-ink)" text-anchor="end">{T('insights.figure.tessitura')}</text>
	{/if}

	<!-- The stave: solid to the barline, faint under the bars. -->
	<g stroke="var(--ink-stave, #1a1612)" stroke-width="1">
		{#each lines as l (l)}
			<line x1="0" y1={y(l)} x2={BARLINE} y2={y(l)} />
			<line x1={BARLINE} y1={y(l)} x2={W} y2={y(l)} stroke-opacity="0.25" />
		{/each}
		{#each barLedgers as l (l)}
			<line x1={BARLINE} y1={y(l)} x2={W} y2={y(l)} stroke-opacity="0.35" stroke-dasharray="1 2" />
		{/each}
		<line x1={BARLINE} y1={y(topLine)} x2={BARLINE} y2={y(bottomLine)} />
	</g>

	{#if prepared && font}
		<text x={CLEF_X} y={y(clefAnchor)} font-family={font.family} font-size={glyphPx} fill="var(--ink-stave, #1a1612)"
			>{prepared.glyph(clefName).char}</text
		>
	{/if}

	<!-- The compass: the lowest and highest sung pitch, spelled as the score spells them. -->
	{#each notes as n (n.x)}
		{@const d = diatonicOf(n.pitch)}
		<g stroke="var(--ink-stave, #1a1612)" stroke-width="1">
			{#each noteLedgers(d) as l (l)}
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
	{/each}
	<text x={(LOW_X + HIGH_X) / 2} y={H - 4} font-size="8" fill="var(--rose-ink)" text-anchor="middle"
		>{fill(T('insights.fit.compass'), { low: pitchLabel(figure.compass.low), high: pitchLabel(figure.compass.high) })}</text
	>

	<!-- The passaggi, drawn before the bars and labels so no label is struck through. -->
	{#if passaggi}
		<g stroke="var(--rose-chip)" stroke-width="1" stroke-dasharray="4 3">
			<line x1={BARLINE + 6} y1={passaggi.primo} x2={RIGHT} y2={passaggi.primo} />
			<line x1={BARLINE + 6} y1={passaggi.secondo} x2={RIGHT} y2={passaggi.secondo} />
		</g>
	{/if}

	<!-- The bars: time per sounding pitch from one baseline. -->
	<g opacity={figure.quiet ? 0.5 : 1}>
		{#each drawn as r (r.midi)}
			<rect x={BAR_X} y={r.cy - r.height / 2} width={r.length} height={r.height} fill={r.dark ? 'var(--rose-ink)' : 'var(--rose)'} />
		{/each}
	</g>

	<!-- Labels on a paper halo, so no line crosses them. -->
	<g class="halo" font-size="7.5">
		{#each [...lines, ...barLedgers] as l (l)}
			<text x={LINE_NAME_X} y={y(l) + 2.6} fill="var(--ink-tertiary)" text-anchor="end">{stepName(l)}</text>
		{/each}
		{#each drawn as r (r.midi)}
			{#if r.name}
				<text x={ROW_NAME_X} y={r.cy + 2.6} fill="var(--rose-ink)" font-weight="600" text-anchor="end">{r.name}</text>
			{/if}
		{/each}
	</g>

	<g class="halo" font-size="8" fill="var(--rose-ink)">
		{#each drawn as r (r.midi)}
			{#each r.labels as label, i (i)}
				<text x={BAR_X + r.length + 4} y={r.cy + 2.8 + (i - (r.labels.length - 1) / 2) * 10} font-weight={r.dark ? 600 : 400}
					>{#each labelParts(label) as part, j (j)}{#if part.ipa}<tspan font-family="'Lato IPA', var(--font-sans)">{part.text}</tspan>{:else}{part.text}{/if}{/each}</text
				>
			{/each}
		{/each}
	</g>

	{#if passaggi && figure.zones}
		<g class="halo" font-size="7.5" fill="var(--rose-ink)">
			<text x={BARLINE + 8} y={passaggi.primo - 2.5}>{T('insights.figure.primo')}</text>
			<text x={BARLINE + 8} y={passaggi.secondo - 2.5}>{T('insights.figure.secondo')}</text>
		</g>
		<g class="halo" font-size="8" font-weight="600" fill="var(--rose-ink)" text-anchor="end">
			<text x={RIGHT} y={passaggi.secondo - 4}>{fill(T('insights.figure.zoneAbove'), { share: shareText(figure.zones.above) })}</text>
			<text x={RIGHT} y={passaggi.primo - 4}>{fill(T('insights.figure.zoneBetween'), { share: shareText(figure.zones.between) })}</text>
			<text x={RIGHT} y={passaggi.primo + 11}>{fill(T('insights.figure.zoneBelow'), { share: shareText(figure.zones.below) })}</text>
		</g>
	{/if}

	<text x={BAR_X} y="9" font-size="8" letter-spacing="0.05em" fill="var(--ink-tertiary)">{title}</text>
</svg>

<style>
	.tessituragram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* The paper-coloured backing: a halo of the page's own cream under each glyph. */
	.halo text {
		paint-order: stroke;
		stroke: var(--paper-cream);
		stroke-width: 3px;
		stroke-linejoin: round;
	}
</style>
