<script lang="ts">
	/**
	 * The tessituragram: N.123's phonation time per pitch joined to N.127
	 * increment 2's compass stave, refined for a first-time reader (QUEUE row 42,
	 * `brief-code-tessituragram-refined_r1_2026-10-07.md`; the drawing is Design's,
	 * `design-tessituragram-refined_r1_2026-10-07.html`, drawing 1).
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
	 * THIS FILE DRAWS; `tessituragram-layout.ts` DECIDES. Every position is
	 * computed there, where a test can check that no label touches a line, a
	 * bar, or another label. There are no halos: a label finds a clear place,
	 * and where none is near a hairline leader joins it to its element.
	 *
	 * Colour roles, one per token: `--rose-chip` the bars (about 4.6:1 on cream;
	 * `--rose` is about 2.9:1, under the 3:1 a graphic needs), `--rose` the
	 * tessitura band, `--rose-ink` a bar with a finding, every label but the
	 * line names (which are tertiary ink), the passaggio lines, and the leaders.
	 *
	 * A document: nothing here is clickable or focusable.
	 */
	import { onMount } from 'svelte';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/score/notation-fonts';
	import { italicRuns } from '$lib/italics';
	import { t, type Language } from '$lib/i18n';
	import type { TessituragramModel } from '$lib/insights/insights';
	import { formatCycles } from '$lib/insights/singing-measures';
	import { layoutTessituragram, W, type GlyphBox, type TextItem } from '$lib/insights/tessituragram-layout';

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

	/* LABELS ARE MEASURED IN THE FIGURE'S OWN FACE on a canvas, once the fonts
	   are ready; before then, or without a canvas, 5.3 px a character at 10 px
	   stands in (an overestimate, so the fallback errs toward clearance). */
	let fontsReady = $state(0);
	onMount(() => {
		document.fonts?.ready.then(() => (fontsReady += 1));
	});
	let measurer: CanvasRenderingContext2D | null = null;
	function measure(text: string, size: number, weight: number): number {
		void fontsReady;
		if (typeof document !== 'undefined') {
			measurer ??= document.createElement('canvas').getContext('2d');
			const family = getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim();
			if (measurer && family) {
				measurer.font = `${weight} ${size}px ${family}`;
				return measurer.measureText(text).width;
			}
		}
		return text.length * 0.53 * size;
	}
	function glyphBox(name: string): GlyphBox | null {
		if (!prepared) return null;
		const g = prepared.glyph(name as never);
		return { widthSp: g.widthSp, top: g.bBoxNE[1], bottom: g.bBoxSW[1] };
	}

	const L = $derived(layoutTessituragram(figure, language, measure, glyphBox));
	const H = $derived(L.height);
	const clefChar = $derived(prepared ? prepared.glyph(figure.clef === 'bass' ? 'fClef' : 'gClef').char : '');

	/** A label's text, its IPA set in the IPA face. */
	function labelParts(label: string): Array<{ text: string; ipa: boolean }> {
		return label
			.split(/(\[[^\]]*\])/)
			.filter((p) => p.length > 0)
			.map((text) => ({ text, ipa: /^\[.*\]$/.test(text) }));
	}

	const doseText = $derived.by(() => {
		const c = figure.cycles;
		if (!c) return null;
		const cycles =
			c.kind === 'point'
				? formatCycles(c.cycles, language)
				: fill(T('insights.fit.span'), { low: formatCycles(c.low, language), high: formatCycles(c.high, language) });
		return fill(T('insights.figure.cycleDose'), { cycles });
	});

	const title = $derived(
		T(figure.scale === 'seconds' ? 'insights.figure.caption' : 'insights.figure.captionQuavers').toLocaleUpperCase(
			language === 'fr' ? 'fr-CA' : 'en-CA',
		),
	);
	const STAVE = 'var(--ink-stave, #1a1612)';
</script>

{#snippet words(item: TextItem)}
	{#if item.kind === 'barLabel'}
		{#each labelParts(item.text) as part, j (j)}{#if part.ipa}<tspan font-family="'Lato IPA', var(--font-sans)">{part.text}</tspan>{:else}{part.text}{/if}{/each}
	{:else if item.kind === 'passaggio' || item.kind === 'key'}
		{#each italicRuns(item.text) as run, i (i)}{#if run.title}<tspan font-style="italic">{run.text}</tspan>{:else}{run.text}{/if}{/each}
	{:else}
		{item.text}
	{/if}
{/snippet}

<svg class="tessituragram" viewBox="0 0 {W} {H}" aria-hidden="true" focusable="false" style="font-family: var(--font-sans);">
	<text x={L.barX} y="12" font-size="9.5" font-weight="500" letter-spacing="0.06em" fill="var(--ink-tertiary)">{title}</text>

	<g transform="translate(0 {L.dy})">
		<!-- The piece's tessitura: shaded behind the bars only, bracketed beside the barline. -->
		{#if L.band}
			<rect x={L.band.x} y={L.band.y} width={L.band.width} height={L.band.height} fill="var(--rose)" opacity="0.22" />
		{/if}
		{#each L.tessBracket as s, i (i)}
			<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.stroke} stroke-width={s.width} />
		{/each}

		<!-- The stave: solid to the barline, faint under the bars. -->
		<g stroke={STAVE} stroke-width="1">
			{#each L.staveYs as ly (ly)}
				<line x1="0" y1={ly} x2={L.barline} y2={ly} />
			{/each}
			<line x1={L.barline} y1={L.staveYs[L.staveYs.length - 1]} x2={L.barline} y2={L.staveYs[0]} />
			{#each L.faint as s, i (i)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke-opacity={s.opacity} stroke-dasharray={s.dash} />
			{/each}
		</g>

		{#if prepared && font && L.clef}
			<text x={L.clef.x} y={L.clef.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE}>{clefChar}</text>
		{/if}

		<!-- The compass: the lowest and highest sung pitch, spelled as the score spells them. -->
		{#each L.notes as n (n.x)}
			<g stroke={STAVE} stroke-width="1">
				{#each n.ledgers as ly (ly)}
					<line x1={n.x - L.headHalf - 4} y1={ly} x2={n.x + L.headHalf + 4} y2={ly} />
				{/each}
			</g>
			{#if prepared && font}
				<text x={n.x - L.headHalf} y={n.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE}>{prepared.glyph('noteheadBlack').char}</text>
				{#if n.pitch.alter && n.accX !== null}
					{@const acc = prepared.glyph(({ [-2]: 'accidentalDoubleFlat', [-1]: 'accidentalFlat', 1: 'accidentalSharp', 2: 'accidentalDoubleSharp' } as const)[n.pitch.alter as -2 | -1 | 1 | 2])}
					<text x={n.accX} y={n.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE}>{acc.char}</text>
				{/if}
			{:else}
				<ellipse cx={n.x} cy={n.y} rx="6" ry="4.4" fill={STAVE} transform="rotate(-18 {n.x} {n.y})" />
			{/if}
		{/each}

		<!-- The passaggi: each line stops at its own name. -->
		<g stroke="var(--rose-ink)" stroke-width="1" stroke-dasharray="4 3">
			{#each L.passLines as s, i (i)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
			{/each}
		</g>

		<!-- The bars: time per sounding pitch from one baseline. A finding keeps its bar dark. -->
		<g opacity={figure.quiet ? 0.5 : 1}>
			{#each L.rows as r (r.midi)}
				<rect x={L.barX} y={r.cy - r.height / 2} width={r.length} height={r.height} fill={r.dark ? 'var(--rose-ink)' : 'var(--rose-chip)'} />
			{/each}
		</g>

		<!-- Half the singing: a bracket beside the bars, serifs toward them, and a tick at the centre of gravity (N.123 part 2). -->
		<g stroke="var(--rose-ink)" stroke-width="1" fill="none">
			{#each L.halfBracket as s, i (i)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
			{/each}
		</g>
		<!-- Leaders, only where a label cannot sit beside its element: a solid hairline, no arrowhead. -->
		<g stroke="var(--rose-ink)" stroke-width="0.6">
			{#each L.leaders as s, i (i)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
			{/each}
		</g>

		<!-- Every label: one face, 10 px, line names in tertiary ink and the rest in rose ink. -->
		{#each L.texts as item, i (i)}
			<text x={item.x} y={item.y} font-size={item.size} font-weight={item.weight} fill={item.fill} text-anchor={item.anchor}>{@render words(item)}</text>
		{/each}

		<!-- The key: each mark drawn small, then its words. -->
		{#each L.keyMarks as m (m.kind)}
			{#if m.kind === 'tessitura'}
				<rect x={m.x} y={m.y - 4} width="16" height="8" fill="var(--rose)" opacity="0.22" />
			{:else if m.kind === 'passaggi'}
				<line x1={m.x} y1={m.y} x2={m.x + 16} y2={m.y} stroke="var(--rose-ink)" stroke-width="1" stroke-dasharray="4 3" />
			{:else}
				<line x1={m.x} y1={m.y} x2={m.x + 16} y2={m.y} stroke={STAVE} stroke-width="1" stroke-opacity="0.35" stroke-dasharray="1 2" />
			{/if}
		{/each}
	</g>
</svg>
{#if doseText}
	<p class="dose">{doseText}</p>
{/if}

<style>
	.tessituragram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* The cycle-dose line, set as the section's prose (`.prose` in InsightsPane). */
	.dose {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-primary);
	}
</style>
