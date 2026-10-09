<script lang="ts">
	/**
	 * The tessituragram: N.123's phonation time per pitch joined to N.127
	 * increment 2's compass stave, refined for a first-time reader (QUEUE row 42,
	 * `brief-code-tessituragram-refined_r1_2026-10-07.md`; the drawing is Design's,
	 * `design-tessituragram-refined_r1_2026-10-07.html`, drawing 1).
	 *
	 * THE STAVE IS THE HISTOGRAM'S BACKGROUND (Dann's walk, 2026-10-09, `OPEN.md`
	 * "THE INSIGHTS PAGE, REARRANGED"): five grey lines and a proportionate grey
	 * clef, no notes, so each bar's height on the stave says its pitch. The compass
	 * that stood on this stave is its own small stave in the page's corner
	 * (`CompassStave.svelte`), and the cycle dose is a sentence of the page's own
	 * (`cycle-dose.ts`). Each bar carries one label, its own pitch. This departs
	 * from Design's drawing 1 on that ruling.
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
	import { layoutTessituragram, W, type GlyphBox, type TextItem } from '$lib/insights/tessituragram-layout';

	interface Props {
		figure: TessituragramModel;
		language: Language;
	}

	let { figure, language }: Props = $props();

	const T = (key: string) => t(key, language);

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

		<!-- The stave behind the bars: grey lines from the clef to the band's end, broken around every label. -->
		<g stroke={STAVE} stroke-width="1">
			{#each L.faint as s, i (i)}
				<line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke-opacity={s.opacity} stroke-dasharray={s.dash} />
			{/each}
		</g>

		<!-- Its clef, as quiet as the lines: the bars' height is the pitch, and no note is drawn. -->
		{#if prepared && font && L.clef}
			<text x={L.clef.x} y={L.clef.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE} fill-opacity="0.3">{clefChar}</text>
		{/if}

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

<style>
	.tessituragram {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

</style>
