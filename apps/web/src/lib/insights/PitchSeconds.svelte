<script lang="ts">
	/**
	 * SECONDS OF PHONATION PER PITCH, as Design round 2 draws it (QUEUE row 66;
	 * accepted by Dann 2026-10-11 03:50). The tessituragram as built, without the
	 * grey clef or the hairline leaders (brief §1 item 5; Dann 03:11: "more
	 * freedom with better-spaced chromatic pitch names. This is elegant").
	 *
	 * One row per sung pitch, high at the top, its name in a column on the left;
	 * the piece's tessitura shaded behind its rows; the typed passaggi as dashed
	 * lines with their names at their right ends; the typed tessitura as a
	 * bracket. A passaggio or a tessitura edge the piece does not sing sits a
	 * row's height per semitone past the nearest sung row. The legend is HTML,
	 * so a longer French label wraps instead of colliding.
	 *
	 * A document: nothing here is clickable or focusable.
	 */
	import { pitchToMidi, type Pitch } from '@ilya/score-parser';
	import { t, type Language } from '$lib/i18n';
	import { italicRuns } from '$lib/italics';
	import { pitchName } from '$lib/voice/note-picker';
	import type { TessituragramModel } from '$lib/insights/insights';

	interface Props {
		figure: TessituragramModel;
		typedTessitura: { low: Pitch; high: Pitch } | null;
		language: Language;
		/** Width of the box the chart sits in, in px. */
		width: number;
	}

	let { figure, typedTessitura, language, width }: Props = $props();
	const T = (key: string) => t(key, language);
	const N = (p: Pitch) => pitchName(p, language);

	const ROW = 11;
	const BAR = 7;
	const X0 = 38;
	/** Room for a passaggio's name past the bars. */
	const LINE_LABEL = 14;
	/* The bars take what the names, the bracket, and its label leave: 210 px on
	   the letter page (the drawing's), down to 50 on a phone, so nothing passes
	   the box's edge. */
	const BAR_W = $derived(Math.max(50, Math.min(210, width - X0 - 98 - 120)));
	const BRACKET_X = $derived(X0 + BAR_W + 98);

	/* THE BRACKET'S LABEL WRAPS (L17, closing polish lane). SVG text does not wrap, and the French « votre zone de travail confortable, telle que vous
	   l'avez indiquée » runs past the figure on a phone, where the bars give way to 50 px. So the label is cut into lines at word spaces, each no wider
	   than the room right of the bracket, from widths measured in the page's real font (after `document.fonts.ready`, and again when the width or the
	   language changes), never from a character count. Two lines where two will do, cut at the space that makes them most even; more only where a
	   word would still overrun. The typed range stays one line under it. A hidden copy of the label, whole, is what the widths are read from. */
	const LEAD = 12;
	const label = $derived(T('insights.r2.yourTessitura'));
	const room = $derived(width - BRACKET_X - 6);
	let whole = $state<SVGTextElement | null>(null);
	let fontsTick = $state(0);
	let wrapped = $state<{ text: string; room: number; lines: string[] } | null>(null);
	$effect(() => {
		document.fonts?.ready.then(() => (fontsTick += 1));
	});
	$effect(() => {
		void fontsTick;
		if (!whole || !(room > 0)) return;
		const text = label;
		wrapped = { text, room, lines: wrapLabel(whole, text, room) };
	});
	/** The label's lines: the measured cut, or the whole label until it is measured (and for any other text or room than the one measured). */
	const lines = $derived(wrapped && wrapped.text === label && wrapped.room === room ? wrapped.lines : [label]);

	function wrapLabel(el: SVGTextElement, text: string, avail: number): string[] {
		const total = el.getComputedTextLength();
		if (!(total > avail)) return [text];
		const spaces = [...text.matchAll(/ /g)].map((m) => m.index!);
		let best: { at: number; w: number } | null = null;
		for (const at of spaces) {
			const w = Math.max(el.getSubStringLength(0, at), total - el.getSubStringLength(0, at + 1));
			if (!best || w < best.w) best = { at, w };
		}
		if (best && best.w <= avail) return [text.slice(0, best.at), text.slice(best.at + 1)];
		const out: string[] = [];
		let start = 0;
		while (start < text.length) {
			let end = text.length;
			if (el.getSubStringLength(start, end - start) > avail) {
				const fits = spaces.filter((at) => at > start && el.getSubStringLength(start, at - start) <= avail);
				end = fits.length ? fits[fits.length - 1] : (spaces.find((at) => at > start) ?? text.length);
			}
			out.push(text.slice(start, end));
			start = end + 1;
		}
		return out;
	}

	const rows = $derived([...figure.rows].sort((a, b) => b.midi - a.midi));
	const maxQ = $derived(Math.max(1, ...rows.map((r) => r.quavers)));

	/** The vertical centre of a MIDI number, before the top margin is added. */
	function rawY(midi: number): number {
		const list = rows;
		if (list.length === 0) return 0;
		const centre = (k: number) => k * ROW + ROW / 2;
		const hi = list[0].midi;
		const lo = list[list.length - 1].midi;
		if (midi >= hi) return centre(0) - (midi - hi) * ROW;
		if (midi <= lo) return centre(list.length - 1) + (lo - midi) * ROW;
		for (let k = 0; k < list.length - 1; k++) {
			const a = list[k].midi;
			const b = list[k + 1].midi;
			if (midi <= a && midi >= b) return centre(k) + ((a - midi) / (a - b)) * ROW;
		}
		return 0;
	}

	/* A passaggio's line runs half a semitone under its pitch, between that row's bar and the next one down: it marks the edge "at or above", and it never crosses a bar. */
	const passaggi = $derived(
		figure.passaggio
			? [
					{ key: 'secondo', pitch: figure.passaggio.secondo, y: rawY(pitchToMidi(figure.passaggio.secondo) - 0.5) },
					{ key: 'primo', pitch: figure.passaggio.primo, y: rawY(pitchToMidi(figure.passaggio.primo) - 0.5) },
				]
			: [],
	);
	/* The two names never stack: the secondo's moves up until a row's height clears them. */
	const passaggioLabels = $derived.by(() => {
		if (passaggi.length < 2) return passaggi.map((p) => ({ ...p, ly: p.y }));
		const [s, p] = passaggi;
		return [{ ...s, ly: Math.min(s.y, p.y - ROW) }, { ...p, ly: p.y }];
	});

	const bracket = $derived.by(() => {
		if (!typedTessitura) return null;
		const top = rawY(pitchToMidi(typedTessitura.high)) - ROW / 2 + 1;
		const bottom = rawY(pitchToMidi(typedTessitura.low)) + ROW / 2 - 1;
		return { top, bottom, mid: (top + bottom) / 2 };
	});

	const band = $derived.by(() => {
		if (!figure.tessitura) return null;
		const hi = pitchToMidi(figure.tessitura.high);
		const lo = pitchToMidi(figure.tessitura.low);
		const ks = rows.map((r, k) => (r.midi <= hi && r.midi >= lo ? k : -1)).filter((k) => k >= 0);
		if (ks.length === 0) return null;
		return { top: ks[0] * ROW, height: (ks[ks.length - 1] - ks[0] + 1) * ROW };
	});

	/* Every y the chart draws, so nothing is clipped: rows, lines, labels, and the bracket's two lines of text. */
	const extent = $derived.by(() => {
		const ys = [0, rows.length * ROW];
		for (const p of passaggioLabels) ys.push(p.y - 4, p.ly - 8);
		if (bracket) ys.push(bracket.top, bracket.bottom, bracket.mid - 8 - (LEAD / 2) * (lines.length - 1), bracket.mid + 16 + (LEAD / 2) * (lines.length - 1));
		return { min: Math.min(...ys), max: Math.max(...ys) };
	});
	const top = $derived(4 - extent.min);
	const height = $derived(extent.max - extent.min + 8);
</script>

<div class="pitch-seconds">
	<svg {width} {height} viewBox="0 0 {width} {height}" role="img" aria-label={T('insights.figure.caption')}>
		<g transform="translate(0 {top})">
			{#if band}
				<rect class="band" x={X0} y={band.top} width={BAR_W} height={band.height}></rect>
			{/if}
			{#each rows as r, k (r.midi)}
				<text class="name" x={X0 - 7} y={k * ROW + ROW / 2 + 3.3} text-anchor="end">{N(r.spellings[0])}</text>
				<rect class="bar" x={X0} y={k * ROW + (ROW - BAR) / 2} width={Math.max(1, (r.quavers / maxQ) * BAR_W)} height={BAR}></rect>
			{/each}
			{#each passaggioLabels as p (p.key)}
				<line class="passaggio" x1={X0} x2={X0 + BAR_W + 8} y1={p.y} y2={p.y}></line>
				<text class="line-name" x={X0 + BAR_W + LINE_LABEL} y={p.ly + 3.3}>{#each italicRuns(T(`insights.figure.${p.key}`)) as run, j (j)}{run.text}{/each} {N(p.pitch)}</text>
			{/each}
			{#if bracket && typedTessitura}
				<path class="bracket" d="M{BRACKET_X - 4} {bracket.top} H{BRACKET_X} V{bracket.bottom} H{BRACKET_X - 4}"></path>
				<text class="bracket-name bracket-label" x={BRACKET_X + 6} y={bracket.mid - 2 - (LEAD / 2) * (lines.length - 1)}>{#each lines as ln, k (k)}<tspan x={BRACKET_X + 6} dy={k === 0 ? 0 : LEAD}>{ln}</tspan>{/each}</text>
				<text class="bracket-name" x={BRACKET_X + 6} y={bracket.mid + 10 + (LEAD / 2) * (lines.length - 1)}>{t('insights.fit.span', language).replace('{low}', N(typedTessitura.low)).replace('{high}', N(typedTessitura.high))}</text>
			{/if}
		</g>
	</svg>
	{#if bracket && typedTessitura}
		<!-- The measurer: the label whole, in an svg of its own (so no test or reader of the figure meets it), hidden and out of the flow. -->
		<svg class="measurer" width="0" height="0" aria-hidden="true"><text class="bracket-name" x="0" y="0" bind:this={whole}>{label}</text></svg>
	{/if}
	<ul class="legend">
		{#if band}<li><span class="swatch band-swatch"></span>{T('insights.r2.pieceTessitura')}<sup>1</sup></li>{/if}
		{#if passaggi.length}<li><span class="swatch dash-swatch"></span>{#each italicRuns(T('insights.figure.key.passaggi')) as run, j (j)}{#if run.title}<em>{run.text}</em>{:else}{run.text}{/if}{/each}</li>{/if}
		{#if bracket}<li><span class="swatch bracket-swatch"></span>{T('insights.r2.yourTessitura')}</li>{/if}
	</ul>
</div>

<style>
	.pitch-seconds svg {
		display: block;
		overflow: visible;
		font-family: var(--font-sans);
	}

	.name,
	.line-name,
	.bracket-name {
		font-size: 9.5px;
		fill: var(--rose-ink);
	}

	.line-name {
		font-style: italic;
	}

	.bar {
		fill: var(--rose-jewel);
	}

	.band {
		fill: var(--rose);
		opacity: 0.2;
	}

	.passaggio {
		stroke: var(--rose-ink);
		stroke-width: 1;
		stroke-dasharray: 4 3;
	}

	.pitch-seconds svg.measurer {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
	}

	.bracket {
		fill: none;
		stroke: var(--rose-ink);
		stroke-width: 1.2;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 18px;
		margin: 6px 0 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-sans);
		font-size: 9.5px;
		color: var(--ink-secondary);
	}

	.legend li {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.swatch {
		display: inline-block;
		width: 16px;
		height: 8px;
	}

	.band-swatch {
		background: color-mix(in srgb, var(--rose) 20%, transparent);
	}

	.dash-swatch {
		height: 0;
		border-top: 1px dashed var(--rose-ink);
	}

	.bracket-swatch {
		width: 4px;
		height: 8px;
		border: 1.2px solid var(--rose-ink);
		border-left: none;
	}

	sup {
		font-size: 0.7em;
		line-height: 0;
	}
</style>
