<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LoaderState } from '$lib/loader';
	import { t, type Language } from '$lib/i18n';
import SongList from './SongList.svelte';
import StationHeader from './StationHeader.svelte';
import IntakeWatermark from './IntakeWatermark.svelte';
import type { SongRow } from '$lib/library/songs';
import { STATION_IDS, type SectionSet } from './sections.svelte';

	/*
	 * N.108 INCREMENT 1. THIS PANEL IS THE PIECE GROUP'S CONTENTS AND NOTHING
	 * ELSE. It held four things and now holds three, and it holds them without
	 * a wrapper.
	 *
	 * ANALYSIS LEFT FOR THE TEXT GROUP. It is `AnalysisStation.svelte` now,
	 * rendered from `+page.svelte`'s `textGroup` snippet beside Notation, and
	 * the five props that fed it left with it: `hasResults`, `wordCount`,
	 * `transcribeMs`, `showInspector` and the `consoleContent` snippet. The
	 * ruling that put Analysis first in the scroll (Dann, 2026-08-27, "the
	 * bottom is the MUSIC half and the top is the TEXT half") is not reversed:
	 * it is what the three groups make structural. Analysis is with the text
	 * because Text is a group.
	 *
	 * SOURCE BECAME THE INTAKE AND LOST ITS HEADER. Ruled 2026-09-02: the
	 * intake has no station row and is never closed. Its two intakes are
	 * unchanged in increment 1, the textarea above and the score drop below,
	 * which is increment 2's to unify.
	 *
	 * THE BINDER ROW BECAME A STATION. It was a bare row at the foot of
	 * Source, which N.65 ship B ruled it into ("the appearance that the
	 * Print/Export/Import row shares the same relationship to the score field
	 * as the Clear text/Transcribe row does to the text field above it"). The
	 * three-group map names it: Piece holds "Export and import". That ruling
	 * is superseded by the map, and the row's own arrangement inside the
	 * station is untouched.
	 *
	 * THERE IS NO `.root-panel` WRAPPER. The stations are direct children of
	 * the group, because the group frame owns their inset and their boundary
	 * (`Drawer.svelte`'s `.group :global(.station)`), and a wrapper between
	 * them and the frame would put the band's adjacency rule out of reach.
	 * Svelte lets a component have more than one root element; this one has
	 * three.
	 */
	interface Props {
		inputText: string;
		loaderState: LoaderState;
		canTranscribe: boolean;
		transcribeError: string;
		language: Language;
		/*
		 * N.73 S3 ship one. `metadata`, `onmetadatachange`, `fromScore`,
		 * `onrevert` and `arrangerProvenance` are gone from this panel. They
		 * fed the metadata block and the provenance line, and both are pinned
		 * at the top of the drawer now; `+page.svelte` passes them straight to
		 * `MetadataFields` in the `pieceAnchor` snippet.
		 */
		/**
		 * N.73 S2. Score intake, rendered by `+page.svelte` inside this panel's
		 * Source region so text intake and score intake read as one. A snippet
		 * rather than props, matching consoleContent, so the uploader's wiring
		 * (its restore source, its {#key} on the open song, its arrival
		 * handler, and the INCLUDE_SHANE gate) stays where the rest of it
		 * lives and nothing is drilled through here.
		 */
		sourceScore?: Snippet;
		oninput: (text: string) => void;
		ontranscribe: () => void;
		onclear: () => void;
		/* `onprint` AND `printDisabled` LEFT WITH THE BUTTON, N.65, Dann's
		   ruling of 2026-08-21. Print is not a drawer control any more; it
		   sits under the sheet, rendered by `+page.svelte`, which is where
		   `handlePrint` always lived. The guard left with it because the
		   control under the sheet is ALWAYS LIVE, which is the same ruling. */
		onexport: () => void;
		onimport: () => void;
		onexportall: () => void;
		/**
		 * N.67 step 4b, the library door. Passed WHOLE rather than as seven
		 * separate props, so `+page.svelte` gains one line of wiring instead of
		 * seven and this panel's prop list stays readable.
		 */
		songLibrary: {
			songs: SongRow[];
			activeId: string;
			plural: boolean;
			error: string | null;
			/** N.67 step 6: what a row says when its record cannot be read. */
			unreadable: string;
			/** N.67 step 6: what a row says when a newer Ilya wrote it. */
			newerIlya: string;
			onopen: (id: string) => void;
			onnew: () => void;
			onrename: (id: string, name: string) => void;
			ondelete: (id: string) => void;
		};
		/**
		 * N.65 ship B. THE DRAWER'S ONE OPEN SET. Passed whole rather than as
		 * a pair of props per station, so this panel drills one name for its
		 * own two headers and REPERTOIRE's, and every station in the drawer
		 * reads the same object. `sections.svelte.ts` holds the mechanism.
		 */
		sections: SectionSet;
	}

	let {
		inputText,
		loaderState,
		canTranscribe,
		transcribeError,
		language,
		sourceScore,
		oninput,
		ontranscribe,
		onclear,
		onexport,
		onimport,
		onexportall,
		songLibrary,
		sections,
	}: Props = $props();

	/* ONE OWNER FOR "THE SOURCE FIELD IS EMPTY". The watermark and the sage
	   hover are bound to the same condition by Dann's ruling of 2026-08-20,
	   so they read it from one name rather than repeating the expression and
	   drifting apart later. */
	const sourceIsEmpty = $derived(inputText === '');

	const charCount = $derived(inputText.length);
	const showWarning = $derived(charCount > 5000);
	/* `dictReady` IS GONE with `.root-panel`. It set a `status-ok` class on
	   that wrapper, and nothing in this file or any other ever declared a rule
	   for it, so the wrapper's removal took its only reader and left a derived
	   value that computed an answer nobody asked. Deleted rather than moved.
	   N.108 increment 1. */

	/* ── OCR state ─────────────────────────────────────────── */
	let ocrProcessing = $state(false);
	let ocrError = $state('');
	/* N.65 ship B. `$state`, WHICH IT WAS NOT, AND THE COMPILER FOUND IT.
	   `svelte-check` raised `non_reactive_update` the moment SOURCE's body
	   went behind a retraction gate, and the warning is describing a real
	   consequence rather than a style: the hidden file input is inside the
	   body now, so it unmounts when a singer shuts the station and this
	   binding has to be able to say so. Nothing else changes; the one read,
	   `handleOcrClick`, already optional-chained. */
	let fileInputEl = $state<HTMLInputElement | undefined>(undefined);

	function handleOcrClick() {
		fileInputEl?.click();
	}

	async function handleOcrFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		ocrProcessing = true;
		ocrError = '';

		try {
			const { createWorker } = await import('tesseract.js');
			const worker = await createWorker('rus');
			const { data: { text } } = await worker.recognize(file);
			await worker.terminate();

			if (text.trim()) {
				oninput(text.trim());
			} else {
				ocrError = language === 'en'
					? 'No text recognised in image.'
					: 'Aucun texte reconnu dans l\u2019image.';
			}
		} catch (err) {
			ocrError = language === 'en'
				? 'OCR processing failed.'
				: 'Échec du traitement OCR.';
			console.error('OCR error:', err);
		} finally {
			ocrProcessing = false;
			// Reset so the same file can be re-selected
			input.value = '';
		}
	}

	/* ── Existing handlers ─────────────────────────────────── */

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			ontranscribe();
		}
	}

	// Metadata field handlers now live in MetadataFields.svelte.
	// The notation toggles and their cascade left this panel at item N.7.
	// They are NotationFields.svelte, rendered once by Drawer.svelte and
	// anchored below the scroll, because they govern the document rather than
	// this tab. This panel no longer sees notationPrefs at all.
</script>

<!-- ── REPERTOIRE. N.108: the first station in the Piece group, and the
     group's band above it is its boundary, so it draws no rule of its own.
     Its own arrangement is untouched. -->
<SongList
	{language}
	songs={songLibrary.songs}
	activeId={songLibrary.activeId}
	plural={songLibrary.plural}
	error={songLibrary.error}
	unreadable={songLibrary.unreadable}
	newerIlya={songLibrary.newerIlya}
	onopen={songLibrary.onopen}
	onnew={songLibrary.onnew}
	onrename={songLibrary.onrename}
	ondelete={songLibrary.ondelete}
	expanded={sections.has(STATION_IDS.repertoire)}
	ontoggle={() => sections.toggle(STATION_IDS.repertoire)}
/>

<!-- ── THE INTAKE. N.108, ruled 2026-09-02: it has NO STATION ROW and it is
     never closed. Source's header, its chevron and its id are gone with the
     retraction; `source` is the one old wire value the migration drops,
     because a station that cannot close has nothing to store.

     ITS OWN CONTENTS ARE UNTOUCHED IN INCREMENT 1. Two intakes, the textarea
     above and the score drop below, exactly as they ship. Unifying them into
     one field is increment 2, and this ship deliberately does not begin it.

     WHAT SOURCE'S HEADER USED TO DO, the label, is done by an accessible name
     instead. It is not drawn: the intake is the only unlabelled thing in the
     drawer and it is unlabelled because it is always there, which is the
     whole of the ruling. `source.heading` is a ratified string with ratified
     French, so nothing new is written for it.

     THE DICTIONARY ERROR CAME HERE. It was first in `.root-panel`, above
     everything; there is no "above everything" any more, and what it reports
     is the dictionary that Transcribe needs, so it reports where that button
     is. -->
<div class="station station-intake">
	<h3 class="visually-hidden">{t('source.heading', language)}</h3>
	<div class="station-body">
	{#if loaderState.error}
		<div class="dict-status">
			<span class="status-dot error"></span>
			<span class="status-text">{loaderState.error}</span>
		</div>
	{/if}
	<div class="textarea-wrapper" class:empty={sourceIsEmpty}>
		<!-- THE TEXT WATERMARK (N.65). Empty field only, which is Dann's own
		     ruling: it never sits under a pasted poem. `inputText` is the
		     source of truth for the field's value, so the mark leaves the
		     instant anything is typed and returns when Clear empties it. It is
		     BEHIND the placeholder by stacking, not by luck: the textarea is
		     transparent with `z-index: 1` and this wrapper holds the white
		     fill, so the placeholder always paints over the mark even if a
		     singer drags the field short enough for the two to meet. -->
		{#if sourceIsEmpty}
			<IntakeWatermark word={t('input.watermark', language)} colour="var(--light-sage)" />
		{/if}
		<textarea
			class="text-input"
			placeholder={t('input.placeholder', language)}
			value={inputText}
			oninput={(e) => oninput((e.target as HTMLTextAreaElement).value)}
			onkeydown={handleKeydown}
			rows="6"
			disabled={loaderState.isLoading || ocrProcessing}
		></textarea>

		<!-- OCR camera icon: top-right corner of textarea -->
		<button
			class="ocr-btn"
			onclick={handleOcrClick}
			disabled={loaderState.isLoading || ocrProcessing}
			aria-label={language === 'en' ? 'Scan Cyrillic text from image' : 'Numériser du texte cyrillique à partir d\u2019une image'}
			title={language === 'en' ? 'Click here for optical character recognition' : 'Cliquez ici pour la reconnaissance optique de caractères'}
		>
			{#if ocrProcessing}
				<span class="ocr-spinner"></span>
			{:else}
				<!-- Viewfinder / scan frame icon -->
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
					<!-- Four corner brackets -->
					<path d="M2 7V2h5"/>
					<path d="M17 2h5v5"/>
					<path d="M22 17v5h-5"/>
					<path d="M7 22H2v-5"/>
					<!-- Scan line -->
					<line x1="5" y1="12" x2="19" y2="12"/>
				</svg>
			{/if}
		</button>

		<!-- Hidden file input for image selection -->
		<input
			type="file"
			accept="image/*"
			class="ocr-file-input"
			bind:this={fileInputEl}
			onchange={handleOcrFile}
		/>
	</div>

	{#if showWarning}
		<p class="char-warning">{charCount.toLocaleString()} {t('input.warning', language)}</p>
	{/if}

	{#if ocrError}
		<p class="ocr-error">{ocrError}</p>
	{/if}

	<!-- SOURCE'S OWN ACTIONS, N.65 ship one. Two buttons, not three: Print
	     left with the binder controls. The `1fr 1fr 2fr` grid this came out
	     of does not exist any more, so `.binder-row`'s comment about column
	     alignment went with it. Clear and Transcribe keep the widths they
	     had in that grid, 1fr and 2fr, so the primary action is still the
	     wide one.

	     BETWEEN THE TWO FIELDS, RULED BY DANN 2026-08-20 on his walk of the
	     silhouette ship. They used to sit below the score box, so
	     Transcribe, which acts on the TEXTAREA, sat under a field it does
	     not touch. It now sits directly under the textarea it acts on, and
	     the score box follows the pair. `transcribeError` comes with them,
	     because it is this button's own failure and it reports where the
	     button is. The Finale disclosure does NOT come with them: it is
	     about score files, it lives inside `ScoreUploader`'s own root, and
	     it travels with the score box by construction. -->
	<div class="source-actions">
		<button
			class="action-btn btn-ghost"
			onclick={onclear}
		>
			{t('input.clear', language)}
		</button>
		<button
			class="action-btn btn-primary"
			disabled={!canTranscribe}
			onclick={ontranscribe}
		>
			{loaderState.isLoading ? t('input.transcribeLoading', language) : t('input.transcribe', language)}
		</button>
	</div>

	{#if transcribeError}
		<!-- The failure of Transcribe, so it reports inside the station whose
		     button produced it, and directly under it. -->
		<p class="error-text">{transcribeError}</p>
	{/if}

	<!-- N.73 S2. Score intake, beside the wired scanner. Text intake and
	     score intake are one Source region: the drop surface and the
	     no-lyrics notice that follows it came here from the Fit drawer.
	     BELOW the action row since 2026-08-20; see that row's comment. -->
	{@render sourceScore?.()}

	</div>
</div>

<!-- ── EXPORT AND IMPORT. N.108: the binder row is a STATION in Piece now,
     which the three-group map names. It was a bare row at the foot of Source,
     by Dann's ruling of N.65 ship B §B.6: "I do not think we need an Output
     section articulated. What I want is the appearance that the
     Print/Export/Import row shares the same relationship to the score field
     as the Clear text/Transcribe row does to the text field above it."

     THAT RULING IS SUPERSEDED BY THE MAP, not overturned by this file. What it
     was protecting was the row's relationship to a field, and the field it sat
     under is the intake, which is now headerless and never closed; a bare row
     at the foot of a headerless station would be the orphan control the spec's
     §3.3 forbids. The row's own arrangement inside the station is untouched.

     `Export all songs` is a third cell, shown only above one song, because
     with one song it says the same thing as the button beside it. THE GRID IS
     UNCHANGED, `repeat(3, 1fr)`: two buttons where there is one song, three
     where there is more than one, on one row either way. Narrowing it to two
     columns is a separate ruling and this ship does not make it. -->
<div class="station">
	<StationHeader
		label={t('binder.heading', language)}
		expanded={sections.has(STATION_IDS.binder)}
		ontoggle={() => sections.toggle(STATION_IDS.binder)}
		controls="station-binder"
	/>
	{#if sections.has(STATION_IDS.binder)}
	<div class="station-body" id="station-binder">
	<div class="output-row">
		<!-- PRINT IS NOT HERE ANY MORE, N.65, Dann's ruling of 2026-08-21: "we
		     will simply not offer a Print button for the Learn or Guide
		     sections", and before that, on where it goes: "what if we add it
		     under the WYSIWYG flush left? Visually it can parallel the
		     Transcription button above the WYSIWYG." It is `.sheet-print` in
		     `+page.svelte`. This row is Export and Import, and `Export all
		     songs` keeps its conditional fourth cell below. -->
		<button class="action-btn btn-ghost" onclick={onexport}>{t('binder.export', language)}</button>
		<button class="action-btn btn-ghost" onclick={onimport}>{t('binder.import', language)}</button>
		{#if songLibrary.songs.length > 1}
			<button class="action-btn btn-ghost" onclick={onexportall}>{t('binder.exportAll', language)}</button>
		{/if}
	</div>
	</div>
	{/if}
</div>

<style>
	/* ── `.root-panel` IS GONE (N.108 increment 1) ────────────
	   The wrapper and its three rules left with it: the `0 1rem` sides, which
	   the group's own 18px station inset replaces; the `:last-child` 40px
	   foot, which belonged to whichever panel ended the column and there is no
	   last panel now (the scroll carries a 12px foot instead, in
	   `Drawer.svelte`); and the flex column, which the group is.

	   The 1rem was ruled: every station rule in the drawer had to share one
	   inset, Dann 2026-08-20. THE RULING HOLDS AND ITS OWNER MOVED. One inset,
	   declared once, in the frame that contains every station rather than in
	   each panel that draws some of them. */

	/* ── The dictionary error, now inside the intake ──────── */
	/* It reports the dictionary Transcribe needs, so it reports where that
	   button is. Its own two rules are unchanged. */

	/* ── The dictionary progress bar left with Analysis ─────
	   `.dict-progress` and its four rules are `AnalysisStation.svelte`'s now,
	   with the markup that draws them. */

	/* ── Dictionary error (kept from original) ─────────────── */

	.dict-status {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-dot.error { background: #d97706; }

	.status-text {
		color: var(--ink-tertiary);
		font-family: var(--font-sans);
	}

	/* ── Textarea with OCR overlay ────────────────────────── */

	/* N.65 ship one. THE 8px TOP MARGIN IS GONE. It gave the textarea room
	   below the metadata block when the two were adjacent; the metadata block
	   is a pinned anchor now and the textarea is the first entry under
	   SOURCE's header, where 8px would add to the header's own 0.4rem and
	   break ruling 2. `ScoreUploader`'s `.uploader` keeps its matching 8px:
	   it is not first under a header. */
	/* THE WHITE FILL LIVES HERE NOW, not on the textarea, and that is what
	   lets the watermark sit BEHIND the placeholder instead of merely beside
	   it. A `::placeholder` is part of the textarea, so a mark can only get
	   under it by getting under the textarea, and a mark under an opaque
	   textarea is a mark nobody sees. The fill moved up one box; the field
	   looks identical.

	   The radius is the textarea's own 4px, repeated here so the white does
	   not square off the corners the border rounds. */
	.textarea-wrapper {
		position: relative;
		background: white;
		border-radius: 4px;
		/* `.dropzone`'s own value, copied so the two intakes tint at one
		   speed. */
		transition: background 0.15s ease;
	}

	/* ── THE SAGE HOVER (N.65). Dann's ruling, 2026-08-20, on his walk of
	   `0e5ed6e`: "I notice the score input field has a lavender mouseover. I
	   love it. Can the text input field have a sage mouseover?"

	   THE TWIN'S TREATMENT IN THIS BOX'S OWN HUE. `.dropzone:hover` is
	   `rgba(142, 126, 155, 0.06)`, which is `--deeper-lavender` at 6 percent,
	   the score box's own border hue. This is `--sage` #8B9A7D at the same 6
	   percent, which is the text box's own border hue. Hue names place, so
	   the two intakes must not share one tint.

	   NO DRAG STATE. `.dropzone.dragging` doubles the tint to 12 percent
	   because it takes a drop. The textarea takes none, so there is nothing
	   for a second value to describe.

	   ON THE WRAPPER, NOT THE TEXTAREA, and this is the whole reason the
	   wrapper exists. `.text-input` is transparent at `z-index: 1`, ABOVE the
	   watermark; a background on it would paint over `text` and hide the
	   thing the wrapper was built to reveal. The wrapper sits BELOW the
	   watermark, so the tint goes behind the mark and the mark stays on top
	   of it. The wrapper's box is also the textarea's border box exactly,
	   because the textarea is `display: block; width: 100%` and the wrapper
	   has no padding of its own, so the hover target matches what the score
	   box gets: the whole bordered field.

	   EMPTY ONLY, and that is Dann's correction of the same day. The score
	   box's hover disappears because the whole drop zone unmounts once a
	   score arrives. The textarea never unmounts, so an unconditional hover
	   would tint the singer's poem every time the cursor crossed it. It is
	   bound to `sourceIsEmpty`, the same name the watermark is bound to. */
	.textarea-wrapper.empty:hover {
		background: rgba(139, 154, 125, 0.06);
	}

	/* THE BORDER IS 1px, AND THE WEIGHT CHANGE IS NOT RULED. Brief §3.6
	   proposes it and Dann rules it by looking at it on the walk. It was
	   `3px solid var(--sage)`. THE HUE IS UNCHANGED AND MUST STAY: sage
	   names the text intake and lavender names the score intake, which is
	   hue naming place, and Dann ruled that right. Every lighter sage token
	   measures worse against the white fill than #8B9A7D's own 2.99:1, so
	   weight is the only lever that does not cost contrast.

	   The body font stays `var(--font-serif)`. Its contents are a poem, so
	   the Reading voice is correct there, and §3.6 says so in as many
	   words. */
	.text-input {
		width: 100%;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--ink-primary);
		/* TRANSPARENT, with the white on `.textarea-wrapper`. See that rule. */
		background: transparent;
		/* `display: block` because the default `inline-block` put the textarea
		   on a text baseline, which left a 7px strip of wrapper below it,
		   MEASURED on the desk before this change: wrapper 154.47px tall
		   against the textarea's 147.47px. That strip was invisible while the
		   wrapper had no background and would be a white shelf under the field
		   now that it has one. It was never a designed gap. */
		display: block;
		/* Above the watermark, so the placeholder and any typed poem paint over
		   it rather than under it. */
		position: relative;
		z-index: 1;
		border: 1px solid var(--sage);
		border-radius: 4px;
		padding: 0.5rem 0.6rem;
		padding-right: 2.2rem; /* room for the OCR icon */
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
		line-height: 1.5;
		box-sizing: border-box;
		transition: border-color 150ms ease;
	}

	/* Came here from a `!important` global in `+page.svelte` that reached
	   into `.drawer-content textarea`. Nothing competes with it here, so the
	   `!important` is gone with the move. */
	.text-input:focus {
		border-color: var(--deeper-sage, #7A8A6C);
	}

	/* RULED by Dann 2026-08-20: "just make it consistent with its twin."
	   The italic is deleted. `.meta-input::placeholder` sets colour only,
	   and a placeholder is instruction, which belongs to the Instrument
	   voice. Italic is the paper's mannerism. */
	.text-input::placeholder {
		color: var(--ink-tertiary);
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

	/* ── OCR camera button ────────────────────────────────── */

	.ocr-btn {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 28px;
		height: 28px;
		padding: 4px;
		border: none;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.8);
		color: var(--ink-tertiary);
		cursor: pointer;
		opacity: 0.3;
		transition: color 0.15s ease, background 0.15s ease, opacity 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ocr-btn:hover:not(:disabled) {
		color: var(--sage);
		background: rgba(255, 255, 255, 0.95);
		opacity: 1;
	}

	.ocr-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.ocr-file-input {
		display: none;
	}

	.ocr-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--stone-300);
		border-top-color: var(--sage);
		border-radius: 50%;
		animation: ocr-spin 0.8s linear infinite;
	}

	@keyframes ocr-spin {
		to { transform: rotate(360deg); }
	}

	.ocr-error {
		font-size: 0.7rem;
		color: #d97706;
		font-family: var(--font-sans);
	}

	.char-warning {
		font-size: 0.7rem;
		color: #d97706;
		font-family: var(--font-sans);
	}

	.error-text {
		font-size: 0.75rem;
		color: #d97706;
		font-family: var(--font-sans);
	}

	/* ── The two action rows (N.65 ship one) ──────────────── */
	/* `.button-row` and `.binder-row` are gone. They shared one
	   `1fr 1fr 2fr` grid so a Clear-Print-Transcribe row and an
	   Export-Import row would align column for column. Print left that row
	   for Output, so there is no second row to align against and the grid
	   has nothing left to do. */

	/* Source's foot. Clear and Transcribe keep the 1fr and 2fr they held in
	   the old grid, so the primary action is still the wide one. */
	.source-actions {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 6px;
	}

	/* Output. Three equal columns. Print was the first of them until N.65
	   moved it under the sheet; Export and Import hold the first two now and
	   `Export all songs` takes the third when it is drawn. */
	.output-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.action-btn {
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.btn-ghost {
		color: var(--stone-500);
		background: transparent;
		font-weight: 500;
		border: 1px solid var(--stone-600, #57534e);
	}

	.btn-primary {
		color: white;
		background: var(--sage);
	}

	.action-btn:hover:not(:disabled) {
		opacity: 0.85;
	}

	.action-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	/* ── THE STATION RECIPE MOVED TO THE FRAME (N.108) ───────
	   `.section`, `.section + .section`, `.section.shut` and the two exemption
	   comments are gone from this file. What they declared was: a 2px sage
	   rule between stations, 6px above a label, 12px below a body, 6px below a
	   shut one, and no rule above whatever was first in the scroll.

	   EVERY ONE OF THOSE IS NOW ONE DECLARATION IN `Drawer.svelte`, on
	   `.group :global(.station)` and its two neighbours, for the reason that
	   file gives: the inset and the boundary are properties of the FRAME, and
	   five components were declaring them. That is the same argument
	   `StationHeader.svelte` makes for the label.

	   DANN'S RULINGS INSIDE THEM ARE NOT LOST, and here is where each went:
	   - "one rule per boundary, drawn by the station below it, none above the
	     first" (2026-08-27) is `.group-band + .station { border-top: none }`.
	   - "a shut station is the same height as its twins" (2026-08-21) is
	     satisfied by construction: the row IS the station when it is shut, and
	     every row is the same box.
	   - The 2px sage rule itself (2026-08-20) is retired inside a group and
	     replaced by a 1px hairline, because inside a frame it is a station
	     that ends and not a region. The band says the region.
	   - The asymmetry, a label close to the rule above it and a body given air
	     below it (2026-08-20), survives as the header's 8px and the body's
	     12px. */

	/* A station's contents, as a box the header is NOT inside. That is what
	   makes the header's own 0.4rem the whole gap to the first entry, which
	   is Dann's ruling 2. Put the header in the flex column instead and the
	   column's gap adds to it, which is exactly how SONGS came to measure
	   12.39px where every other station measured 6.39px. Twinned on
	   SongList's `.station-body`. */
	.station-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* THE INTAKE'S NAME IS SPOKEN AND NOT DRAWN. N.108: the intake is the one
	   station with no visible label, because it is the one station that is
	   never closed, and a heading a screen reader can reach is what keeps it
	   from being an unnamed region of controls. `source.heading` is the
	   ratified string its drawn header used to carry, so no new French is
	   written and none is owed. The clip recipe is the tree's own, copied
	   value for value from `NotePicker.svelte`'s `.visually-hidden`. */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	/* ── ANALYSIS'S RULES LEFT WITH ANALYSIS (N.108) ─────────
	   `.console-section`, `.console-placeholder-body`, `.placeholder-hint`,
	   `.result-summary` and `.result-hidden` are `AnalysisStation.svelte`'s
	   now, copied value for value, because Svelte scopes a rule to the file
	   that writes the markup and the markup went to the Text group. */

</style>
