<script lang="ts">
	/**
	 * THE WELCOME PLATE (brief r2 item 5): one small square page, drawn in code, that turns over five times in place through six images: я, [ɑ], the
	 * eighth note on a staff (Finale Maestro), the [ɑ] zone, the vowel space, the Илья icon. Each turn is the same 30-degree edge sweeping top to bottom; the sheet
	 * decides when (`welcome-motion.ts`), this component only shows the first `turned + 1` layers. The numbers are `welcome-plate.ts`'s.
	 *
	 * The plate is `role="img"` named Илья (`lang="ru"`, so a screen reader says the Russian name in either interface language), and its layers are hidden from a screen reader: the sheet's words say everything the pictures say.
	 * Its contents are in `--ink-stave` (the stave's furniture) and the paper's own cream; the plate is "a page", so it keeps paper's colour while the
	 * sheet around it is the app's (`--drawer-bg`).
	 */
	import { ACTIVE, BOX, ICON_STRIPES, ICON_WORD, NOTE_FONT_SIZE, NOTE_GLYPH, STAFF, activeZoneEnlarged, noteBaselineY, noteX, staffLineYs, vowelSpace, FRAME } from './welcome-plate';
	import { WIPE_EASE, WIPE_MS } from './welcome-motion';

	let { turned, animate }: { turned: number; animate: boolean } = $props();

	const space = vowelSpace();
	const big = activeZoneEnlarged(space);
	const lines = staffLineYs();
	const nx = noteX();
	const ny = noteBaselineY();
	const centre = BOX / 2;
</script>

<div class="plate" class:still={!animate} role="img" lang="ru" aria-label={ICON_WORD} style:--wipe="{WIPE_MS}ms" style:--ease={WIPE_EASE}>
	<!-- 0: я -->
	<div class="layer base" aria-hidden="true">
		<svg viewBox="0 0 {BOX} {BOX}"><text class="serif" x={centre} y="195" text-anchor="middle" font-size="176" fill="var(--ink-primary)">я</text></svg>
	</div>
	<!-- 1: [ɑ] -->
	<div class="layer" class:shown={turned >= 1} aria-hidden="true">
		<svg viewBox="0 0 {BOX} {BOX}"><text class="ipa" x={centre} y="192" text-anchor="middle" font-size="124" fill="var(--ink-secondary)">[ɑ]</text></svg>
	</div>
	<!-- 2: the eighth note on a staff, Finale Maestro U+E1D7 (the box `FinaleMaestro.json` keys `note8thUp`), its notehead on the middle line -->
	<div class="layer" class:shown={turned >= 2} aria-hidden="true">
		<svg viewBox="0 0 {BOX} {BOX}">
			{#each lines as y (y)}<line x1={STAFF.x1} y1={y} x2={STAFF.x2} y2={y} stroke="var(--ink-stave)" stroke-width="2.2" />{/each}
			<text class="smufl" x={nx} y={ny} font-size={NOTE_FONT_SIZE} fill="var(--ink-stave)">{NOTE_GLYPH}</text>
		</svg>
	</div>
	<!-- 3: the [ɑ] zone, enlarged -->
	<div class="layer" class:shown={turned >= 3} aria-hidden="true">
		<svg viewBox="0 0 {BOX} {BOX}">
			<ellipse cx={big.cx} cy={big.cy} rx={big.rx} ry={big.ry} style="fill: {big.fill}; fill-opacity: {big.opacity}" />
			<text class="ipa" x={centre} y="170" text-anchor="middle" font-size="56" fill="var(--ink-stave)">[ɑ]</text>
		</svg>
	</div>
	<!-- 4: the vowel space of a bass, from computeZones({}, 'bass') and the chart's own geometry -->
	<div class="layer" class:shown={turned >= 4} aria-hidden="true">
		<svg viewBox="0 0 {BOX} {BOX}">
			<rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} fill="var(--paper-light)" stroke="var(--ink-stave)" stroke-opacity=".35" />
			{#each space.zones as z (z.vowel)}
				<ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} style="fill: {z.fill}; fill-opacity: {z.opacity}; mix-blend-mode: multiply" />
			{/each}
			<circle cx={space.dot.x} cy={space.dot.y} r="5" fill="var(--lavender-jewel)" stroke="var(--paper-light)" stroke-width="1.5" />
			<text class="ipa" x={space.dot.x + 8} y={space.dot.y - 7} font-size="16" fill="var(--ink-stave)">{ACTIVE}</text>
		</svg>
	</div>
	<!-- 5: the icon: five equal stripes in the jewels of TEXT, MELODY, INSIGHTS, LEARN, GUIDE, and the name in cream -->
	<div class="layer" class:shown={turned >= 5} aria-hidden="true">
		<div class="icon">
			{#each ICON_STRIPES as c (c)}<i style="background: {c}"></i>{/each}
			<span class="serif">{ICON_WORD}</span>
		</div>
	</div>
</div>

<style>
	/*
	 * The fonts are the app's own files: Source Serif 4 (the Cyrillic subset is in google-families.css), Lato IPA (app.css), and Finale Maestro (below).
	 * THE NOTE IS FINALE MAESTRO, the app's default music font (`AGENTS.md`, Engraving constraints; `score/notation-fonts.ts`, `DEFAULT_NOTATION_FONT_ID`), by the
	 * same family name and file URL the score renderer registers, so the browser reuses one file. The desk's amendment of 2026-11-16, item 5; the first build
	 * used Bravura because the brief and prototype named it. `welcome-plate.test.ts` holds the family and URL to `notation-fonts.ts`.
	 */
	@font-face {
		font-family: 'Finale Maestro';
		src: url('/fonts/finale-maestro/FinaleMaestro.otf') format('opentype');
		font-display: swap;
	}
	.plate {
		position: relative;
		width: var(--plate-size, 208px);
		aspect-ratio: 1;
		border-radius: 9%;
		overflow: hidden;
		background: var(--paper-light);
		container-type: size;
		box-shadow:
			0 0 0 1px rgba(58, 53, 47, 0.16),
			0 1px 2px rgba(46, 42, 38, 0.14),
			0 8px 18px rgba(46, 42, 38, 0.1);
	}
	.layer {
		position: absolute;
		inset: 0;
		/* The 30-degree edge: tan 30 is 0.577, so the top edge runs from the left at 0% to the right at -58%. Hidden: a sliver above the plate. */
		clip-path: polygon(0 0%, 100% -58%, 100% -58%, 0 0%);
		transition: clip-path var(--wipe) var(--ease);
	}
	.layer.base {
		clip-path: none;
		transition: none;
	}
	.layer.shown {
		clip-path: polygon(0 0%, 100% -58%, 100% 100%, 0 158%);
	}
	.still .layer {
		transition: none;
	}
	.layer svg {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--paper-light);
	}
	.serif {
		font-family: var(--font-serif);
		font-weight: 700;
	}
	.ipa {
		font-family: 'Lato IPA', var(--font-sans);
	}
	.smufl {
		font-family: 'Finale Maestro';
	}
	.icon {
		position: absolute;
		inset: 0;
		display: flex;
	}
	.icon i {
		flex: 1;
	}
	.icon span {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 23cqw;
		line-height: 1;
		color: var(--paper-light);
		letter-spacing: -0.01em;
	}
</style>
