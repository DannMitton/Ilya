<script lang="ts">
	/**
	 * The piece's compass as a small stave in the corner of Insights' page one
	 * (Dann's walk, 2026-10-09, `OPEN.md` "THE INSIGHTS PAGE, REARRANGED", ruling
	 * 1): the clef, the lowest and highest sung pitch as two notes, and "Compass
	 * {low} to {high}" under it, at a normal notation size. Where it stands is
	 * the header's (`TitleHeader`'s `aside`), so it is in the same place on every
	 * page one. Positions are decided in `compass-stave.ts`.
	 *
	 * A document: nothing here is clickable or focusable.
	 */
	import { onMount } from 'svelte';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/score/notation-fonts';
	import type { Language } from '$lib/i18n';
	import type { TessituragramModel } from '$lib/insights/insights';
	import type { GlyphBox } from '$lib/insights/tessituragram-layout';
	import { layoutCompassStave } from '$lib/insights/compass-stave';

	interface Props {
		compass: TessituragramModel['compass'];
		clef: TessituragramModel['clef'];
		language: Language;
	}

	let { compass, clef, language }: Props = $props();

	let font = $state<LoadedNotationFont | null>(null);
	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then((f) => {
				if (alive) font = f;
			})
			.catch(() => {
				/* the stave draws its heads as ellipses and omits the clef */
			});
		return () => {
			alive = false;
		};
	});
	const prepared = $derived(font?.prepared ?? null);

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

	const L = $derived(layoutCompassStave(compass, clef, language, measure, glyphBox));
	const clefChar = $derived(prepared ? prepared.glyph(clef === 'bass' ? 'fClef' : 'gClef').char : '');
	const STAVE = 'var(--ink-stave, #1a1612)';
	const ACC = { [-2]: 'accidentalDoubleFlat', [-1]: 'accidentalFlat', 1: 'accidentalSharp', 2: 'accidentalDoubleSharp' } as const;
</script>

<svg class="compass-stave" width={L.width} height={L.height} viewBox="0 0 {L.width} {L.height}" aria-hidden="true" focusable="false" style="font-family: var(--font-sans);">
	<g stroke={STAVE} stroke-width="0.8">
		{#each L.staveYs as ly (ly)}
			<line x1={L.staveLeft} y1={ly} x2={L.staveRight} y2={ly} />
		{/each}
	</g>

	{#if prepared && font && L.clef}
		<text x={L.clef.x} y={L.clef.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE}>{clefChar}</text>
	{/if}

	<!-- The compass: the lowest and highest sung pitch, spelled as the score spells them. -->
	{#each L.notes as n (n.x)}
		<g stroke={STAVE} stroke-width="0.8">
			{#each n.ledgers as ly (ly)}
				<line x1={n.x - L.headHalf - 3} y1={ly} x2={n.x + L.headHalf + 3} y2={ly} />
			{/each}
		</g>
		{#if prepared && font}
			<text x={n.x - L.headHalf} y={n.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE}>{prepared.glyph('noteheadBlack').char}</text>
			{#if n.pitch.alter && n.accX !== null}
				<text x={n.accX} y={n.y} font-family={font.family} font-size={L.glyphPx} fill={STAVE}>{prepared.glyph(ACC[n.pitch.alter as -2 | -1 | 1 | 2]).char}</text>
			{/if}
		{:else}
			<ellipse cx={n.x} cy={n.y} rx="4.5" ry="3.3" fill={STAVE} transform="rotate(-18 {n.x} {n.y})" />
		{/if}
	{/each}

	<text x={L.text.x} y={L.text.y} font-size="10" font-weight="500" fill="var(--rose-ink)" text-anchor="end">{L.text.text}</text>
</svg>

<style>
	.compass-stave {
		display: block;
		overflow: visible;
	}
</style>
