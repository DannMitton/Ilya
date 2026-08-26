<script lang="ts">
	/* ── THE DOCK (N.92, mobile slice 2) ─────────────────────────────────
	   The four correction stations on the phone, in the ruled order:
	   DURATION, PITCH, ACCIDENTAL · ENTRY, LYRIC. Durations lead because N.95
	   measured durations as the broken channel, 0 of 28 confident before
	   re-derivation, and pitch as nearly fine.

	   A SIBLING OF THE DRAWER, NOT THE DRAWER RE-ANCHORED. The drawer is a
	   side-entering object whose anchors are ruled in E.36 §1.4, and
	   re-anchoring it to the bottom edge in portrait would move those anchors
	   and make geometry answer width. This is a separate surface that keeps
	   the drawer's grammar: one bare pull pointing the way it moves, the same
	   station labels, the same 180 ms.

	   THE VERBS ARE THE SHIPPED VERBS RE-HOMED. Nothing here is new function.
	   Every one of them calls `+page.svelte`'s own handler, the same handler
	   the desktop `CorrectionControls` calls, so the phone and the desk cannot
	   drift. Three cells render DISABLED and carry no behaviour at all:
	   tuplet, Rest, and Tie are slice 3's.

	   ONE DISTINCTION, DRAWN EVERYWHERE. A verb sits in a box, because a box
	   says something happens to the score when you touch it. A navigation mark
	   is bare: the stepper arrows and the dismissal chevron carry no box,
	   because they move the singer around rather than change the music.

	   44 PX FLOOR, unconditional, on every control here. The page's own glyphs
	   are the ruled exemption and this surface takes none. -------------- */
	import { t, type Language } from '$lib/i18n';
	import { loadNotationFont } from '$lib/shane/engine/notation-fonts';
	import { centredViewBox, commonInkBox, type InkBox } from '$lib/shane/loupe';
	import type { NoteBase } from '@ilya/score-parser';
	import type { ShiftDirection } from '$lib/shane/pairings';
	import { onMount } from 'svelte';

	interface Props {
		language: Language;
		/** Portrait anchors the dock to the bottom edge; landscape to the left. */
		portrait: boolean;
		/** `F3 · quarter · на`, composed by the caller from the taken entry. */
		readout: string;
		/** The Undo pill's sentence, or null when nothing can be undone. */
		undoLabel: string | null;
		selectedBase: NoteBase | null;
		selectedDotted: boolean;
		/** True when the station cursor's syllable sits on no note. */
		shiftDisabled: boolean;
		onundo: () => void;
		ondismiss: () => void;
		/** The stepper: entry by entry, across barlines. */
		onwalk: (direction: 1 | -1) => void;
		onbase: (base: NoteBase) => void;
		ondot: () => void;
		onstep: (direction: 1 | -1) => void;
		onoctave: (direction: 1 | -1) => void;
		onaccidental: (kind: 'flat' | 'natural' | 'sharp') => void;
		ondelete: () => void;
		onshift: (scope: 'end' | 'nextOpen', direction: ShiftDirection) => void;
		/** The measured height, so the loupe can centre in the room left over. */
		onheight: (height: number) => void;
	}

	let {
		language,
		portrait,
		readout,
		undoLabel,
		selectedBase,
		selectedDotted,
		shiftDisabled,
		onundo,
		ondismiss,
		onwalk,
		onbase,
		ondot,
		onstep,
		onoctave,
		onaccidental,
		ondelete,
		onshift,
		onheight,
	}: Props = $props();

	const T = (key: string) => t(key, language);

	/* THE NOTATION FACE, AND IT IS THE PAGE'S OWN. Finale Maestro is the
	   product default for every rendering (Dann, 2026-07-12 and 2026-07-13),
	   registered as a document-wide FontFace by `notation-fonts.ts:53`, and
	   the score's glyphs are drawn from it by `staff-renderer.ts:505`. These
	   cells set the same family, so a duration on this surface and the same
	   duration on the page are one object at two sizes, which is what the
	   design handoff's own NOT ESTABLISHED note asks for.

	   THE CODEPOINTS ARE WRITTEN HERE rather than read from the package's
	   `SMUFL_CODEPOINTS`, and that duplication has a reason. The package's
	   registry (`smufl-metadata.ts:71`) carries the glyphs the RENDERER needs,
	   which is noteheads, flags, and stems drawn separately; it carries no
	   combined duration glyph, because a staff never draws one. Adding five
	   entries to `REQUIRED_GLYPHS` changes what `prepareSmuflFont` validates
	   and reaches gate 5, and slice 3 needs those glyphs' METRICS rather than
	   only their characters, so that is where it belongs. Finale Maestro
	   carries all five (`FinaleMaestro.json`, `glyphBBoxes`).

	   THE WORD IS THE NAME, the shipped `CorrectionControls` discipline: the
	   glyph is `aria-hidden` and a screen reader hears "Eighth", never a
	   codepoint. Where the font has not loaded, the word is drawn instead, so
	   nobody ever meets a row of empty boxes. */
	const DURATIONS: { base: NoteBase; glyph: string; key: string }[] = [
		{ base: '16th', glyph: '\uE1D9', key: 'correct.len16th' },
		{ base: 'eighth', glyph: '\uE1D7', key: 'correct.len8th' },
		{ base: 'quarter', glyph: '\uE1D5', key: 'correct.lenQuarter' },
		{ base: 'half', glyph: '\uE1D3', key: 'correct.lenHalf' },
		{ base: 'whole', glyph: '\uE1D2', key: 'correct.lenWhole' },
	];
	/** SMuFL `augmentationDot`, the one duration glyph the renderer draws too. */
	const DOT_GLYPH = '\uE1E7';

	/* SMuFL's accidentals rather than Unicode's U+266D/E/F, so these cells and
	   the page's own accidentals are one ink at two sizes. The desktop
	   `CorrectionControls` keeps the Unicode characters, which is right there:
	   it sets in the interface face, not in the score's. */
	const ACCIDENTALS: { kind: 'flat' | 'natural' | 'sharp'; glyph: string; key: string }[] = [
		{ kind: 'flat', glyph: '\uE260', key: 'notation.tool.flat' },
		{ kind: 'natural', glyph: '\uE261', key: 'notation.tool.natural' },
		{ kind: 'sharp', glyph: '\uE262', key: 'notation.tool.sharp' },
	];

	/* ── CENTRING THE GLYPH, NOT THE CHARACTER ───────────────────────────
	   Dann, 2026-08-26, at the walk: the noteheads look centred and the notes
	   do not, and the margin inside the cell is not consistent.

	   HE IS DESCRIBING SMuFL'S ORIGIN. A duration glyph's origin is its
	   NOTEHEAD, and the stem and flag run out of the character's advance
	   width, so a row of characters laid out as text lines up the noteheads
	   and leaves every note hanging off its own centre by a different amount.
	   A whole note, which has no stem at all, is the only one that looks
	   right.

	   SO THE INK IS MEASURED AND THE INK IS CENTRED. Each glyph is drawn once
	   into a hidden SVG, `getBBox` gives its real inked box, and every glyph in
	   a set is then drawn through a viewBox of one size with its own ink
	   centred inside it. One box for the set gives one scale for the set, so a
	   whole note does not swell to the height of a sixteenth, and one box size
	   gives the same margin inside every cell of that row.

	   THREE SETS, NOT ONE, because they are three different sizes of thing: a
	   sharp is not as tall as a sixteenth and an augmentation dot is not as
	   tall as either. Each set is internally consistent, which is what the eye
	   reads along a row.

	   MEASURED RATHER THAN DECLARED. The numbers could be read out of
	   `FinaleMaestro.json`'s `glyphBBoxes` instead, and then they would be
	   right for exactly one face and cost a second parse of a 386 KB file on a
	   phone. Measuring what the browser actually drew is right for whichever
	   face is loaded, including the day someone chooses Bravura or Leland.

	   THE MEASUREMENT IS CANVAS, NOT `getBBox`, and that is a correction rather
	   than a preference. `getBBox` on an SVG `<text>` returns its LAYOUT box,
	   which is the advance width by the font's own ascent and descent: every
	   one of these nine glyphs measured 402 units tall at 100 px, which is the
	   em box and not the note. `measureText`'s `actualBoundingBox*` are the
	   inked bounds, and they are relative to the same origin and the same
	   baseline that `<text x="0" y="0">` uses, so the numbers carry across
	   without conversion. Measured through it, `noteQuarterUp` runs from 88.9
	   above the baseline to 13.2 below: the notehead sits AT the origin and the
	   stem is all of the rest, which is exactly the offset Dann saw. */
	const MEASURE_PX = 100;
	const NOTE_H = 26;
	const ACCIDENTAL_H = 22;
	const DOT_H = 10;

	const NOTE_GLYPHS = DURATIONS.map((d) => d.glyph);
	const ACCIDENTAL_GLYPHS = ACCIDENTALS.map((a) => a.glyph);
	const ALL_GLYPHS = [...NOTE_GLYPHS, DOT_GLYPH, ...ACCIDENTAL_GLYPHS];

	let boxes = $state<Record<string, InkBox>>({});

	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then(async () => {
				// The FontFace is registered by now; this waits for the browser to
				// have it ready to SHAPE with, so `getBBox` measures the real face
				// rather than the fallback serif.
				try {
					await document.fonts.load(`${MEASURE_PX}px 'Finale Maestro'`);
				} catch {
					// A browser that refuses the check still has the face registered.
				}
				if (!alive) return;
				measureGlyphs();
			})
			.catch(() => {
				// The page falls back to primitive shapes on the same failure, and
				// these cells fall back to their words. Neither waits on a font.
			});
		return () => {
			alive = false;
		};
	});

	function measureGlyphs(): void {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return;
		ctx.font = `${MEASURE_PX}px 'Finale Maestro'`;
		const next: Record<string, InkBox> = {};
		for (const glyph of ALL_GLYPHS) {
			const m = ctx.measureText(glyph);
			const left = m.actualBoundingBoxLeft ?? 0;
			const right = m.actualBoundingBoxRight ?? 0;
			const ascent = m.actualBoundingBoxAscent ?? 0;
			const descent = m.actualBoundingBoxDescent ?? 0;
			const width = left + right;
			const height = ascent + descent;
			// A browser without the inked bounds reports zeros, and a cell with
			// no box draws its word instead. Nobody meets an empty square.
			if (width > 0 && height > 0) {
				next[glyph] = { x: -left, y: -ascent, width, height };
			}
		}
		boxes = next;
	}

	const noteCommon = $derived(
		commonInkBox(NOTE_GLYPHS.map((g) => boxes[g]).filter((b): b is InkBox => !!b)),
	);
	const accidentalCommon = $derived(
		commonInkBox(ACCIDENTAL_GLYPHS.map((g) => boxes[g]).filter((b): b is InkBox => !!b)),
	);
	const dotCommon = $derived(commonInkBox(boxes[DOT_GLYPH] ? [boxes[DOT_GLYPH]] : []));

	/** One cell's drawing, or null where the face never arrived. */
	function drawn(
		glyph: string,
		common: { width: number; height: number },
		height: number,
	): { viewBox: string; width: number; height: number } | null {
		const box = boxes[glyph];
		if (!box || common.height <= 0) return null;
		return {
			viewBox: centredViewBox(box, common),
			width: (height * common.width) / common.height,
			height,
		};
	}

	let height = $state(0);
	$effect(() => {
		onheight(height);
	});
</script>

{#snippet cell(glyph: string, common: { width: number; height: number }, h: number, word: string)}
	{@const d = drawn(glyph, common, h)}
	{#if d}
		<svg
			class="glyph"
			viewBox={d.viewBox}
			width={d.width}
			height={d.height}
			aria-hidden="true"
			focusable="false"
		>
			<text x="0" y="0" font-family="Finale Maestro" font-size={MEASURE_PX} fill="currentColor"
				>{glyph}</text
			>
		</svg>
	{:else}
		{word}
	{/if}
{/snippet}

<section class="dock" class:portrait aria-label={T('a11y.drawer')} bind:offsetHeight={height}>
	<!-- THE HEADER ROW. The Undo pill sits alone on its own row so it can grow
	     to fit a long sentence, and it is ABSENT rather than disabled when
	     there is nothing to undo: a control that cannot act earns no ink. -->
	{#if undoLabel}
		<div class="dock-row dock-row-undo">
			<button type="button" class="undo-pill" onclick={onundo}>
				<span aria-hidden="true">&#x21B0;</span>
				{T('loupe.undo').replace('%s', undoLabel)}
			</button>
		</div>
	{/if}

	<!-- The stepper flanks the readout, and both marks are BARE: they walk the
	     singer along the line and change nothing in the score. A coarse tap on
	     the page chooses the measure; these are the fine step. -->
	<div class="dock-row dock-row-readout">
		<button type="button" class="mark" aria-label={T('correct.prev')} onclick={() => onwalk(-1)}
			>&#x2190;</button
		>
		<p class="readout">{readout}</p>
		<button type="button" class="mark" aria-label={T('correct.next')} onclick={() => onwalk(1)}
			>&#x2192;</button
		>
		<button
			type="button"
			class="mark chevron"
			aria-label={T('drawer.collapse')}
			onclick={ondismiss}>{portrait ? '⌄' : '‹'}</button
		>
	</div>

	<!-- DURATION, first, because N.95 measured it as the broken channel. -->
	<section class="station">
		<h3 class="station-label">{T('loupe.station.duration')}</h3>
		<div class="cells">
			{#each DURATIONS as d (d.base)}
				<button
					type="button"
					class="cell"
					class:engaged={selectedBase === d.base}
					aria-pressed={selectedBase === d.base}
					aria-label={T(d.key)}
					onclick={() => onbase(d.base)}
				>
					{@render cell(d.glyph, noteCommon, NOTE_H, T(d.key))}
				</button>
			{/each}
			<button
				type="button"
				class="cell"
				class:engaged={selectedDotted}
				aria-pressed={selectedDotted}
				aria-label={T('correct.dot')}
				onclick={ondot}
			>
				{@render cell(DOT_GLYPH, dotCommon, DOT_H, T('correct.dot'))}
			</button>
			<!-- SLICE 3 TAKES THIS. It renders so the station's shape is the shape
			     it will keep, and it carries no behaviour at all. -->
			<button type="button" class="cell" disabled>{T('loupe.tuplet')}</button>
		</div>
	</section>

	<!-- PITCH. The semitone verbs stay retired, per Dann's ruling of
	     2026-08-24: a B natural cannot become B flat, and down a semitone
	     respells as A sharp, which is what the spelling policy is for. -->
	<section class="station">
		<h3 class="station-label">{T('loupe.station.pitch')}</h3>
		<div class="cells">
			<button
				type="button"
				class="cell"
				aria-label={T('correct.stepUp')}
				onclick={() => onstep(1)}
				><span aria-hidden="true">&#x25B2;</span> {T('loupe.pitch.step')}</button
			>
			<button
				type="button"
				class="cell"
				aria-label={T('correct.stepDown')}
				onclick={() => onstep(-1)}
				><span aria-hidden="true">&#x25BC;</span> {T('loupe.pitch.step')}</button
			>
			<button
				type="button"
				class="cell"
				aria-label={T('correct.octaveUp')}
				onclick={() => onoctave(1)}
				><span aria-hidden="true">&#x25B2;</span> {T('loupe.pitch.octave')}</button
			>
			<button
				type="button"
				class="cell"
				aria-label={T('correct.octaveDown')}
				onclick={() => onoctave(-1)}
				><span aria-hidden="true">&#x25BC;</span> {T('loupe.pitch.octave')}</button
			>
		</div>
	</section>

	<!-- ACCIDENTAL · ENTRY. The three verbs are CUMULATIVE and capped at
	     doubles, exactly as shipped, so none of them is ever "on" and none
	     carries `aria-pressed`. What the note shows is on the readout. -->
	<section class="station">
		<h3 class="station-label">{T('loupe.station.accidental')}</h3>
		<div class="cells">
			{#each ACCIDENTALS as a (a.kind)}
				<button
					type="button"
					class="cell"
					aria-label={T(a.key)}
					onclick={() => onaccidental(a.kind)}
				>
					{@render cell(a.glyph, accidentalCommon, ACCIDENTAL_H, T(a.key))}
				</button>
			{/each}
			<button type="button" class="cell" disabled>{T('loupe.rest')}</button>
			<button type="button" class="cell" aria-label={T('correct.delete')} onclick={ondelete}
				>{T('loupe.delete')}</button
			>
			<button type="button" class="cell" disabled>{T('loupe.tie')}</button>
		</div>
	</section>

	<!-- LYRIC. The shipped Shift Lyrics verbs, on the same surface as the note
	     verbs rather than in a separate place, and named for what they touch
	     rather than for Finale's scope. The melisma pair drawn in the
	     schematic is NOT here: it was never ruled. -->
	<section class="station">
		<h3 class="station-label">{T('loupe.station.lyric')}</h3>
		<div class="lyric-row">
			<span class="lyric-label">{T('loupe.lyric.toEnd')}</span>
			<button
				type="button"
				class="cell cell-arrow"
				disabled={shiftDisabled}
				aria-label={T('shiftLyrics.backAria')}
				onclick={() => onshift('end', 'back')}>&#x2190;</button
			>
			<button
				type="button"
				class="cell cell-arrow"
				disabled={shiftDisabled}
				aria-label={T('shiftLyrics.forwardAria')}
				onclick={() => onshift('end', 'forward')}>&#x2192;</button
			>
		</div>
		<div class="lyric-row">
			<span class="lyric-label">{T('loupe.lyric.toNextOpen')}</span>
			<button
				type="button"
				class="cell cell-arrow"
				disabled={shiftDisabled}
				aria-label={T('shiftLyrics.backAria')}
				onclick={() => onshift('nextOpen', 'back')}>&#x2190;</button
			>
			<button
				type="button"
				class="cell cell-arrow"
				disabled={shiftDisabled}
				aria-label={T('shiftLyrics.forwardAria')}
				onclick={() => onshift('nextOpen', 'forward')}>&#x2192;</button
			>
		</div>
	</section>
</section>

<style>
	/* ANCHORED TO AN EDGE, NEVER LIFTED. The loupe is the one ruled exception
	   to "nothing floats over the paper", and this is not it: the dock sits on
	   an edge the way the drawer sits on its own.

	   ROTATION IS THE MODE SWITCH, so the anchor answers rotation rather than
	   width. Bottom in portrait, because the thumbs are there; left in
	   landscape, which is the drawer's own ruled anchor. Only the anchor
	   moves, and it moves once, on rotation.

	   THE Z-INDEX CLEARS THE INSTALL PROMPT, and that is measured rather than
	   chosen. `InstallPrompt.svelte:114` sits at 9000 and raises itself six
	   seconds into every iOS Safari session, and at any lower value it lands
	   on top of the LYRIC station and the singer cannot reach it. The mobile
	   drawer takes 60 (`Drawer.svelte:1526`) and the update toast 200. The
	   loupe is ruled nearest the user, the dock is its other half, and a
	   working surface a thumb cannot reach is not a surface. The prompt is
	   untouched and returns the moment the loupe goes away. */
	.dock {
		position: fixed;
		z-index: 9100;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 10px 12px 14px;
		background: var(--drawer-bg, #faf8f5);
		color: var(--ink-primary, #1a1612);
		/* THE 180 MS, opacity and transform only. The loupe carries the same
		   duration, which is what teaches the singer they are one object. */
		animation: dock-arrive 180ms ease-out;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	/* LANDSCAPE: THE LEFT EDGE, 380 PX. The schematic's figure, with its own
	   reasoning: 356 px of content is the narrowest column that holds every
	   station's row at 44 px per cell without wrapping, and a narrower dock
	   would wrap two stations and push the total past 430 px of height.

	   THE THREE TIGHTENED VALUES ARE MEASURED. At 932 by 430 this dock stood
	   478 px tall against a 430 px screen and scrolled by 48, and the 48 is
	   exactly the Undo pill's row: with no pill it measured 428 and fitted.
	   The schematic's 380 assumes a single-row LYRIC station, and this one
	   carries two rows, because the shipped shift verbs are a label with two
	   arrows rather than a cell. Closing the column gap, the label margins,
	   and the foot buys the row back and the dock measures 430. Portrait is
	   untouched: it has the height to spare. */
	.dock:not(.portrait) {
		gap: 4px;
		padding: 8px 12px 6px;
		left: 0;
		top: 0;
		bottom: 0;
		width: 380px;
		border-right: 1px solid var(--stone-300, #d6d3d1);
		box-shadow: 2px 0 10px rgba(46, 42, 38, 0.08);
	}

	.dock.portrait {
		left: 0;
		right: 0;
		bottom: 0;
		max-height: 62vh;
		border-top: 1px solid var(--stone-300, #d6d3d1);
		box-shadow: 0 -2px 10px rgba(46, 42, 38, 0.08);
	}

	@keyframes dock-arrive {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dock {
			animation: none;
		}
	}

	.dock-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	/* The pill sits alone on its row so a long sentence can grow into it. */
	.undo-pill {
		flex: 0 1 auto;
		min-height: 44px;
		padding: 8px 16px;
		border: 1px solid var(--stone-300, #d6d3d1);
		border-radius: 999px;
		background: var(--paper-light, #f5f1e8);
		color: var(--ink-primary, #1a1612);
		font: inherit;
		font-size: 0.8125rem;
		line-height: 1.2;
		cursor: pointer;
	}

	.readout {
		flex: 1 1 auto;
		margin: 0;
		text-align: center;
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
	}

	/* A NAVIGATION MARK IS BARE. No border and no fill, and the 44 px floor is
	   met by the target rather than by the mark. */
	.mark {
		flex: 0 0 auto;
		min-width: 44px;
		min-height: 44px;
		padding: 0;
		border: none;
		background: none;
		color: var(--ink-secondary, #4a4540);
		font-size: 1.125rem;
		line-height: 1;
		cursor: pointer;
	}

	.chevron {
		font-size: 1.375rem;
	}

	.station-label {
		margin: 8px 0 4px;
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sage, #8b9a7d);
	}

	.cells {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	/* A VERB SITS IN A BOX. 44 px is a floor and not a target: a cell grows
	   with its text and never shrinks below it. */
	.cell {
		/* A flex box so a drawn glyph centres on both axes. The gap is what puts
		   the space back between a pitch cell's triangle and its word: inside a
		   flex container the whitespace between two children is not a text node
		   any more, and `▲ step` came out as `▲step`. */
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.3em;
		flex: 1 1 auto;
		min-width: 44px;
		min-height: 44px;
		padding: 6px 8px;
		border: 1px solid var(--stone-300, #d6d3d1);
		border-radius: 4px;
		background: var(--paper-light, #f5f1e8);
		color: var(--ink-primary, #1a1612);
		font: inherit;
		font-size: 0.75rem;
		line-height: 1.15;
		cursor: pointer;
	}

	.cell:disabled {
		color: var(--ink-tertiary, #6a655f);
		opacity: 0.5;
		cursor: default;
	}

	.cell.engaged {
		border-color: var(--sage, #8b9a7d);
		color: var(--sage, #8b9a7d);
		font-weight: 600;
	}

	.cell:focus-visible,
	.mark:focus-visible,
	.undo-pill:focus-visible {
		outline: 2px solid var(--sage, #8b9a7d);
		outline-offset: 2px;
	}

	/* THE CELL CENTRES A BOX, and the box is the same size for every cell in a
	   row, so the margin around the drawing is the same in every one of them.
	   `display: block` keeps the SVG off the text baseline, which would
	   otherwise reintroduce the very offset this replaces. */
	.glyph {
		display: block;
		overflow: visible;
	}


	.dock:not(.portrait) .station-label {
		margin: 2px 0 3px;
	}

	.lyric-row {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.lyric-label {
		flex: 1 1 auto;
		font-size: 0.75rem;
		line-height: 1.2;
		color: var(--ink-secondary, #4a4540);
	}

	.cell-arrow {
		flex: 0 0 auto;
		min-width: 52px;
		text-align: center;
		font-size: 1rem;
	}

	/* THE DOCK NEVER PRINTS. The drawer manipulates; the page displays and
	   prints. */
	@media print {
		.dock {
			display: none !important;
		}
	}
</style>
