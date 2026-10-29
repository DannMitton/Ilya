<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, tIfPresent, type Language } from '$lib/i18n';
	import type { TextArrival } from '$lib/one-action';
	import { comparePoem, lyricsSegments, poemSegments } from '$lib/text/poem-compare';
	import { inputViews, type InputView } from '$lib/text/input-views.svelte';
	import { lyricsOnLeave } from '$lib/text/break-glue';
	import { pointer } from './IntakeCamera.svelte';
	import ViewPair from '../ViewPair.svelte';
	/*
	 * IntakeViews.svelte: INPUT'S TWO VIEWS OF ONE FIELD: POEM AND LYRICS.
	 * N.135 STAGE 3, RULED BY DANN 2026-10-16 00:32 to 00:51 (`OPEN.md`,
	 * "N.135 STAGE 3", defaults 1, 5, 6, 11), strings ratified 01:18.
	 *
	 * The pair above the field's top right corner is `DeskHead.svelte`'s pair,
	 * member for member and rule for rule (the markup is `:113-128` there, the
	 * styles `:179-226`), so the two look the same on the page; its two members
	 * are Poem and Lyrics. Under it one line always says which view this is.
	 *
	 * ONE TEXT SHOWS AT A TIME, in ONE textarea. Poem is the poet's published
	 * text and Lyrics is the sung text, which is what seats, transcribes, and
	 * prints (`SongRecord.poem` stays that text; `publishedPoem` is the poet's).
	 * A Lyrics edit goes up by `oninput` exactly as the field's edits always
	 * have; a Poem edit goes up by `onpoemedit` and seats nothing.
	 *
	 * THE COLOUR IS A LAYER BEHIND THE TEXTAREA, not a second copy of the text
	 * beside it. A textarea cannot colour a word of its own text, so the layer
	 * draws the active view's text, word for word, in the textarea's own face
	 * and box, and the textarea's glyphs are transparent over it with the caret
	 * inked. The text is typed into, selected in, pasted into, and dropped on a
	 * plain textarea; the layer only paints. N.147 took a second rendering of
	 * the syllabified text out of this band (`IntakePanel.svelte`), and this is
	 * not one: nothing the singer can read is drawn twice. The words the song
	 * adds go sage (`--sage-ink`), the words it leaves out go grey
	 * (`--ink-tertiary`), and neither is stored (`poem-compare.ts`).
	 *
	 * THE COLOUR IS PAINTED BY THE CSS CUSTOM HIGHLIGHT API where the browser
	 * has it (`CSS.highlights`; which Safari and Firefox versions do is NOT
	 * ESTABLISHED here), and by inline spans where it does not. The layer then holds ONE text node, so it wraps exactly as the
	 * textarea does. MEASURED 2026-10-16 in headless Chromium at phone width:
	 * with a span around each coloured word the layer re-wrapped a word onto
	 * another line than the textarea's in 2 of 120 random cases (a span's edges
	 * shift sub-pixel widths at a break), which would have put the colour a line
	 * off the caret; with one text node the wrapping matched in every case
	 * (`report-code-input-two-views_r1_2026-10-16.md`).
	 */
	interface Props {
		language: Language;
		/** The open song, so the view last used for it is remembered for the session. */
		songId: string;
		/** The sung text, or the score's derived words where the song has none of its own. */
		lyricsText: string;
		/** The poet's published text. */
		poemText: string;
		disabled?: boolean;
		/** A Lyrics edit, and HOW it arrived: a paste transcribes at once, a keystroke after a pause. */
		oninput: (text: string, how: TextArrival) => void;
		/** A Poem edit, and HOW it arrived (a paste or a typed key), which decides whether a wordless score's Lyrics takes it (row 109 B). */
		onpoemedit: (text: string, how: TextArrival) => void;
		onflush: () => void;
		/** The camera glyph, which stands in the field's top right corner. */
		corner?: Snippet;
		/** The field is showing the score's derived words, not text of the singer's: leaving it changes nothing (step 9). */
		scoreWords?: boolean;
	}

	let { language, songId, lyricsText, poemText, disabled = false, oninput, onpoemedit, onflush, corner, scoreWords = false }: Props = $props();

	const VIEWS: InputView[] = ['poem', 'lyrics'];
	const view = $derived(inputViews.view);
	/* A song opening chooses its view once (`InputViews.open`); a re-render of
	   the same song moves nothing. */
	$effect.pre(() => inputViews.open(songId, lyricsText, poemText));

	const text = $derived(view === 'poem' ? poemText : lyricsText);
	const cmp = $derived(comparePoem(lyricsText, poemText));
	const segments = $derived(view === 'poem' ? poemSegments(poemText, cmp) : lyricsSegments(lyricsText, cmp));
	const omitted = $derived(view === 'poem' && cmp ? cmp.omitted : 0);
	/* Text ending in a line break needs a character on its last line, or the
	   layer is a line shorter than the textarea and its last row does not scroll
	   into view with it. */
	const padLast = $derived(text === '' || text.endsWith('\n'));
	/* The layer's one text node, with the pad where it is needed. */
	const layerText = $derived(padLast ? `${text}\u200b` : text);
	const highlights = typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

	const line = $derived(
		inputViews.landed === 'lyrics'
			? t('intake.view.landedLyrics', language)
			: inputViews.landed === 'poem'
				? t('intake.view.landedPoem', language)
				: t(view === 'poem' ? 'intake.view.poemLine' : 'intake.view.lyricsLine', language),
	);
	/* The Lyrics placeholder's French is owed and left empty, so in French the
	   field draws none until Dann rules (`i18n.ts`, `intake.placeholderLyrics`). */
	const placeholder = $derived(view === 'poem' ? t('intake.placeholder', language) : tIfPresent('intake.placeholderLyrics', language));

	let taEl = $state<HTMLTextAreaElement | undefined>(undefined);
	let layerEl = $state<HTMLDivElement | undefined>(undefined);
	/* The width a classic scrollbar takes from the textarea's content box. The
	   layer has no scrollbar, so without this its lines would wrap wider than
	   the textarea's and the colour would drift off the words. Zero on a phone,
	   whose scrollbars overlay. */
	let bar = $state(0);

	function measure(): void {
		if (!taEl) return;
		bar = Math.max(0, taEl.offsetWidth - taEl.clientWidth - 2);
		if (layerEl) layerEl.scrollTop = taEl.scrollTop;
	}
	$effect(() => {
		void text;
		void view;
		measure();
	});
	$effect(() => {
		void view;
		if (taEl) taEl.scrollTop = 0;
		measure();
	});
	$effect(() => {
		if (!taEl || typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(measure);
		observer.observe(taEl);
		return () => observer.disconnect();
	});

	/* The coloured words as ranges over the layer's one text node. */
	$effect(() => {
		if (!highlights || !layerEl) return;
		const node = layerEl.firstChild?.nodeType === 3 ? layerEl.firstChild : [...layerEl.childNodes].find((n) => n.nodeType === 3);
		if (!node) return;
		const ranges: Record<'differs' | 'omitted', Range[]> = { differs: [], omitted: [] };
		let at = 0;
		for (const seg of segments) {
			if (seg.kind !== 'plain') {
				const range = new Range();
				range.setStart(node, at);
				range.setEnd(node, at + seg.text.length);
				ranges[seg.kind].push(range);
			}
			at += seg.text.length;
		}
		CSS.highlights.set('intake-differs', new Highlight(...ranges.differs));
		CSS.highlights.set('intake-omitted', new Highlight(...ranges.omitted));
	});
	$effect(() => () => {
		if (!highlights) return;
		CSS.highlights.delete('intake-differs');
		CSS.highlights.delete('intake-omitted');
	});

	/** Replace on the receipt: the field is selected and the next thing typed or pasted takes its place. */
	export function selectAll(): void {
		taEl?.focus();
		taEl?.select();
	}

	/**
	 * Whether this input was typed or arrived whole.
	 *
	 * N.108-5. `inputType` is the platform's own answer and this reads it
	 * rather than guessing from the length of the change: a paste, a drag of
	 * text into the field, and a dictation insert all arrive whole and should
	 * transcribe at once, while a keystroke and a backspace should not.
	 *
	 * ANYTHING IT CANNOT NAME IS TREATED AS TYPING, which is the safe way
	 * round: the worst case is a 600 ms pause before a transcription the
	 * singer was going to get anyway, where the other way round is the
	 * pipeline running on every keystroke of a long poem.
	 *
	 * `undo` AND `redo` COUNT AS WHOLE, because a singer who presses Cmd-Z has
	 * finished changing the text rather than started. (Moved here with the
	 * textarea from `IntakePanel.svelte`, unchanged.)
	 */
	const WHOLE = new Set([
		'insertFromPaste',
		'insertFromPasteAsQuotation',
		'insertFromDrop',
		'insertFromYank',
		'insertReplacementText',
		'insertTranspose',
		'historyUndo',
		'historyRedo',
	]);

	function arrivalOf(e: Event): TextArrival {
		const kind = (e as InputEvent).inputType;
		return typeof kind === 'string' && WHOLE.has(kind) ? 'paste' : 'typing';
	}

	function onInput(e: Event): void {
		const value = (e.target as HTMLTextAreaElement).value;
		inputViews.edited();
		if (view === 'poem') onpoemedit(value, arrivalOf(e));
		else oninput(value, arrivalOf(e));
	}

	/**
	 * N.135 stage 2b r5, step 9 (Dann 2026-10-29 01:48): leaving the Lyrics field glues a `#` typed after a word with an ordinary
	 * space («я #» to «я\u00A0#», `lyricsOnLeave`). Nothing changes while the singer types, and nothing on a paste, a Poem edit, or
	 * a score's own text. The new text goes up as a whole arrival (`oninput(value, 'paste')`), the path a typed edit takes, so the
	 * app's state takes it like any edit; the textarea's own undo history does not (a value set from code is not in it).
	 */
	function onBlur(e: FocusEvent): void {
		if (view !== 'lyrics') return;
		const glued = lyricsOnLeave((e.target as HTMLTextAreaElement).value, scoreWords);
		if (glued === null) return;
		inputViews.edited();
		oninput(glued, 'paste');
	}

	/* N.145, 2026-09-16: Cmd+Enter skips the quiet pause (`flushText`). */
	function onKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			onflush();
		}
	}
</script>

<div class="views-head">
	<ViewPair
		items={VIEWS.map((id) => ({ id, label: t(id === 'poem' ? 'intake.view.poem' : 'intake.view.lyrics', language) }))}
		active={view}
		idPrefix="intake-tab"
		controls="intake-view-panel"
		name={t('source.heading', language)}
		onchoose={(id) => inputViews.show(id as InputView)}
	/>
</div>

<div class="views-lines" aria-live="polite">
	<p class="views-line">{line}</p>
	{#if omitted > 0}
		<p class="views-line">{t('intake.view.omittedLine', language)}</p>
	{/if}
</div>

<div class="field" id="intake-view-panel" role="tabpanel" aria-labelledby="intake-tab-{view}">
	<div class="layer face" class:beside-camera={pointer.coarse} style:--bar="{bar}px" bind:this={layerEl} aria-hidden="true">{#if highlights}{layerText}{:else}{#each segments as seg, i (i)}{#if seg.kind === 'plain'}{seg.text}{:else}<span class:differs={seg.kind === 'differs'} class:omitted={seg.kind === 'omitted'}>{seg.text}</span>{/if}{/each}{#if padLast}&#8203;{/if}{/if}</div>
	<textarea
		class="text-input face"
		class:beside-camera={pointer.coarse}
		bind:this={taEl}
		{placeholder}
		value={text}
		oninput={onInput}
		onkeydown={onKeydown}
		onblur={onBlur}
		onscroll={measure}
		aria-labelledby="intake-tab-{view}"
		rows="6"
		{disabled}
	></textarea>
	<div class="corner">{@render corner?.()}</div>
</div>

<style>
	/* ── The pair, DeskHead's own (`DeskHead.svelte:179-226`) ────────────── */
	.views-head {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		/* The 44px floor (`PRODUCT.md:595`) is met by the members' hit areas
		   below, not by the drawn pair, so the row holds the room they need. */
		min-height: 24px;
		margin-bottom: 6px;
	}

	@media (pointer: coarse) {
		.views-head {
			min-height: 44px;
			margin-bottom: 0;
		}
	}

	/* The pair's own rules are `ViewPair.svelte`'s now (moved unchanged, row 110). */

	/* ── The lines under the control ─────────────────────────────────────── */
	/* `.intake-drop-hint`'s recipe: sans, 0.75rem, tertiary ink. */
	.views-lines {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-bottom: 6px;
	}

	.views-line {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}

	/* ── The field: a textarea over a layer ──────────────────────────────── */
	.field {
		position: relative;
	}

	/* THE BORDER IS 1px, AND THE WEIGHT CHANGE IS NOT RULED. Brief §3.6
	   proposes it and Dann rules it by looking at it on the walk. It was
	   `3px solid var(--sage)`. THE HUE IS UNCHANGED AND MUST STAY: sage
	   names the text intake and lavender names the score intake, which is
	   hue naming place, and Dann ruled that right. Every lighter sage token
	   measures worse against the white fill than #839275's own 3.32:1, so
	   weight is the only lever that does not cost contrast.

	   The body font stays `var(--font-serif)`. Its contents are a poem, so
	   the Reading voice is correct there, and §3.6 says so in as many
	   words. */

	/* THE ONE FACE. The layer and the textarea share every property that sets
	   where a word falls, so the layer's words sit under the textarea's: font,
	   size, line height, padding, border, wrapping. They are written once. */
	.face {
		width: 100%;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		line-height: 1.5;
		padding: 0.5rem 0.6rem;
		border: 1px solid var(--sage);
		border-radius: 4px;
		box-sizing: border-box;
		white-space: pre-wrap;
		overflow-wrap: break-word;
		word-break: normal;
		letter-spacing: normal;
		tab-size: 8;
	}

	/* `app.css`'s N.23 raises every textarea to 16px on a coarse pointer, so
	   iOS does not zoom on focus. The layer is not a textarea, so it is told
	   the same here, or its lines would wrap at a smaller size than the
	   textarea's own. */
	@media (pointer: coarse) {
		.layer {
			font-size: max(1rem, 16px);
		}
	}

	.layer {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
		color: var(--ink-primary);
		border-color: transparent;
		padding-right: calc(0.6rem + var(--bar, 0px));
		/* The textarea paints the field's border; the layer's own is invisible
		   but still takes its 1px, so the two content boxes agree. */
	}

	.layer.beside-camera {
		padding-right: calc(50px - 12px + var(--bar, 0px));
	}

	.layer .differs {
		color: var(--sage-ink);
	}

	.layer .omitted {
		color: var(--ink-tertiary);
	}

	/* The same two colours where the highlight API paints them. */
	:global(::highlight(intake-differs)) {
		color: var(--sage-ink);
	}

	:global(::highlight(intake-omitted)) {
		color: var(--ink-tertiary);
	}

	.text-input {
		position: relative;
		z-index: 1;
		/* `display: block` because the default `inline-block` put the textarea
		   on a text baseline, which left a 7px strip of wrapper below it,
		   MEASURED on the desk before this change: wrapper 154.47px tall
		   against the textarea's 147.47px. That strip was invisible while the
		   wrapper had no background and would be a white shelf under the field
		   now that it has one. It was never a designed gap. */
		display: block;
		/* TRANSPARENT GLYPHS over the layer's words, the caret inked. The fill
		   is `.intake`'s (the frame) and the textarea paints no background, so
		   the layer shows through. Both properties, for WebKit. */
		color: transparent;
		-webkit-text-fill-color: transparent;
		caret-color: var(--ink-primary);
		background: transparent;
		/* ── 75 PERCENT OF ITS OWN HEIGHT, AT EITHER FONT SIZE ────────
		   Dann's ruling, 2026-08-20, on his walk of the silhouette ship.

		   THE HEIGHT IS NOT ONE NUMBER, AND THAT IS WHY THIS IS AN
		   EXPRESSION. `app.css`'s N.23 focus-zoom rule names `textarea`, so
		   this field renders at 14.4px on the desk and 16px on a phone.
		   MEASURED before the change: 147.56px on the desk, 162px at
		   360 x 640. A fixed pixel height would have cut the phone by 32
		   percent while cutting the desk by 25.

		   The field's own height is `rows` x `line-height` plus its padding
		   and border: 6 x 1.5em + 18px, which is 9em + 18px. Three quarters
		   of that is 6.75em + 13.5px, and `em` here resolves against this
		   field's own font, so the fraction holds at both sizes. Computed:
		   110.7px on the desk, 121.5px on the phone, each exactly 75 percent.

		   `rows="6"` STAYS in the markup as the no-CSS fallback; an explicit
		   height outranks it. `resize: vertical` is untouched, so this is a
		   starting height and the singer can still drag the field taller. */
		height: calc(6.75em + 13.5px);
		resize: vertical;
		transition: border-color 150ms ease;
	}

	.text-input:focus {
		border-color: var(--sage-deep, #7A8A6C);
	}

	/* RULED by Dann 2026-08-20: "just make it consistent with its twin."
	   The italic is deleted. `.meta-input::placeholder` sets colour only,
	   and a placeholder is instruction, which belongs to the Instrument
	   voice. Italic is the paper's mannerism. */
	.text-input::placeholder {
		color: var(--ink-tertiary);
		/* The glyphs of the field are transparent (above), so the placeholder
		   carries its own fill colour. */
		-webkit-text-fill-color: var(--ink-tertiary);
		/* THE FAMILY AND THE SIZE, not just the italic. Measured 2026-08-20
		   before this change: every other placeholder in the drawer rendered
		   Source Sans 3 at 12.8px and this one rendered Source Serif 4 at
		   14.4px, because a `::placeholder` inherits the control's own font
		   and the control is deliberately serif for the poem it holds. The
		   italic that two earlier passes deleted was the smallest of the
		   three differences and never the one Dann was pointing at.

		   Brief §3.6 already ruled the principle: "The placeholder is
		   instruction, so it belongs to the Instrument voice." Instruction is
		   sans at the field size. The BODY stays `var(--font-serif)` at
		   0.9rem, which the same section rules is not a defect.

		   On a coarse pointer `app.css`'s N.23 block raises this to 16px with
		   every other placeholder, so the two displays each show one size. */
		font-family: var(--font-sans);
		font-size: 0.8rem;
	}

	.text-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Typed lines wrap short of the camera's glyph rather than run under it:
	   its box ends 50px inside the frame, the field begins 12px in. */
	.text-input.beside-camera {
		padding-right: calc(50px - 12px);
	}

	/* THE CAMERA'S ANCHOR. `IntakeCamera` is `position: absolute` at 6px in
	   from its positioned ancestor, which was the frame; the field now sits
	   under the pair, so a zero-size anchor at the frame's corner (the frame's
	   12px padding outside the field) keeps the glyph exactly where it was
	   against the field. */
	.corner {
		position: absolute;
		top: -12px;
		right: -12px;
		width: 0;
		height: 0;
		z-index: 2;
	}
</style>
