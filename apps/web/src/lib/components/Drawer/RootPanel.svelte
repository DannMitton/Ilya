<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LoaderState } from '$lib/loader';
	import { t, type Language } from '$lib/i18n';
import SongList from './SongList.svelte';
import StationHeader from './StationHeader.svelte';
import IntakeWatermark from './IntakeWatermark.svelte';
import type { SongRow } from '$lib/library/songs';
import { STATION_IDS, type SectionSet } from './sections.svelte';

	interface Props {
		inputText: string;
		loaderState: LoaderState;
		canTranscribe: boolean;
		hasResults: boolean;
		wordCount: number;
		transcribeMs: number;
		transcribeError: string;
		language: Language;
		/*
		 * N.73 S3 ship one. `metadata`, `onmetadatachange`, `fromScore`,
		 * `onrevert` and `arrangerProvenance` are gone from this panel. They
		 * fed the metadata block and the provenance line, and both are pinned
		 * at the top of the drawer now; `+page.svelte` passes them straight to
		 * `MetadataFields` in the `pieceAnchor` snippet.
		 */
		showInspector: boolean;
		consoleContent?: Snippet;
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
		hasResults,
		wordCount,
		transcribeMs,
		transcribeError,
		language,
		showInspector,
		consoleContent,
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
	const dictReady = $derived(loaderState.entryCount > 0 && !loaderState.isLoading);

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

<div class="root-panel" class:status-ok={dictReady}>
	<!-- Dictionary error (persistent, stays at top) -->
	{#if loaderState.error}
		<div class="dict-status">
			<span class="status-dot error"></span>
			<span class="status-text">{loaderState.error}</span>
		</div>
	{/if}

	<!-- N.73 S3 ship one. THE METADATA BLOCK AND ITS PROVENANCE LINE ARE NOT
	     HERE ANY MORE. They are Piece, pinned at the top of the drawer's
	     column, rendered by `Drawer.svelte`'s top anchor from the
	     `pieceAnchor` snippet in `+page.svelte`. They left because a pinned
	     region cannot be a child of the scrolling one. Nothing about them
	     changed on the way out except who renders them.

	     The dictionary error above stays first in the SCROLL, which is no
	     longer first in the drawer. -->

	<!-- N.67 step 4b, THE LIBRARY DOOR.

	     BETWEEN NOTATION AND SOURCE, DANN'S RULING OF 2026-08-21. It sat below
	     the binder row until then, on the reasoning that the two are adjacent
	     song-level acts: this one chooses which song, that one carries a song
	     off the device. It now opens the scroll instead, ahead of the station
	     that holds the poem. Choosing the song comes before working on it.

	     THAT REASONING IS SPENT, and it is recorded rather than deleted: the
	     binder row still sits at the foot of Source, so the adjacency the step
	     4b note claimed is gone. Nothing inside this block changed, and neither
	     did the binder row. Only the order did. -->
	<!-- ── ANALYSIS, FIRST IN THE SCROLL. RULED BY DANN 2026-08-27, and it
	     reverses the placement he ruled on 2026-08-20, knowingly, for a reason
	     that did not exist then.

	     HIS 2026-08-20 ARRANGEMENT put Analysis last so the performance sat
	     together at the bottom: Analysis, then the score work. What changed is
	     that the score work grew. N.92's four slices put a whole correction
	     surface in this drawer, and with Corrections at the foot of the column
	     the bottom is the MUSIC half and the top is the TEXT half. Analysis is
	     the transcription's own console, so it belongs with the text, and it
	     rides directly under the pinned NOTATION anchor where the scroll
	     begins.

	     THE ORDER IS NOW: Notation pinned above, then Analysis, Repertoire,
	     Source, Output, and the score work with Corrections at the foot, with
	     the voice anchor pinned below all of it. Nothing inside this block
	     changed; only where it sits.

	     THE 2026-08-20 RULING'S REASON IS NOT LOST, it is inverted by its own
	     logic: the performance still sits together, and it sits at the bottom,
	     and Analysis is no longer part of it. -->
	<div class="section console-section" class:shut={!sections.has(STATION_IDS.analysis)}>
		<StationHeader
			label={t('console.placeholder', language)}
			expanded={sections.has(STATION_IDS.analysis)}
			ontoggle={() => sections.toggle(STATION_IDS.analysis)}
			controls="station-analysis"
		/>
		{#if sections.has(STATION_IDS.analysis)}
		<div class="station-body" id="station-analysis">
		<!-- THE RESULT SUMMARY MOVED INSIDE ANALYSIS, N.65 ship one, and this
		     is a decision the brief did not rule. It described the
		     transcription's word count and milliseconds from a position
		     between two stations, and Source's new boundary leaves it nowhere
		     to stand. The ratified r1 mockup draws it inside Analysis, beside
		     "select a word to inspect it"
		     (`fable-gui-mockup_r1_2026-08-18.html:322-324`), and what it
		     reports is a reading of the text rather than an act on it. Its
		     `margin-top: -4px` went with the move: that value tightened it
		     against the uploader above, which is no longer above it. -->
		<p class="result-summary" class:result-hidden={!hasResults}>
			{#if hasResults}
				{wordCount} {t('result.words', language)} {transcribeMs}ms
			{:else}
				&nbsp;
			{/if}
		</p>
		{#if showInspector && consoleContent}
			{@render consoleContent()}
		{:else}
			<div class="console-placeholder-body">
				{#if loaderState.isLoading}
					<div class="dict-progress">
						<span class="dict-progress-text">{t('dict.loading', language)}</span>
						<div class="dict-progress-track">
							{#if loaderState.progress >= 0}
								<div
									class="dict-progress-fill"
									style="width: {Math.round(loaderState.progress * 100)}%"
								></div>
							{:else}
								<div class="dict-progress-fill indeterminate"></div>
							{/if}
						</div>
					</div>
				{:else}
					<p class="placeholder-hint">
						{language === 'en' ? 'Select a word on the page to analyse it here.' : 'Sélectionnez un mot sur la page pour l\u2019analyser ici.'}
					</p>
				{/if}
			</div>
		{/if}
		</div>
		{/if}
	</div>
	<div class="section song-section" class:shut={!sections.has(STATION_IDS.songs)}>
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
			expanded={sections.has(STATION_IDS.songs)}
			ontoggle={() => sections.toggle(STATION_IDS.songs)}
		/>
	</div>

	<!-- ── SOURCE. N.65 ship one, Dann's ruling 4 of 2026-08-20 ──────
	     The textarea, the OCR scanner, the score drop zone, the Finale
	     disclosure, and now Clear and Transcribe are one labelled station.
	     They sat bare before this, against the spec's own first grouping
	     rule (`fable-gui-audit-and-spec_r1_2026-08-18.md` §3.3, "No orphan
	     controls. Every drawer control lives inside a labelled station").

	     `Clear` and `Transcribe` came DOWN here from the Clear-Print-
	     Transcribe grid. N.73 S3 ship two moved Analysis above Output and
	     left that grid where it was, which put Transcribe, the app's
	     primary action, below a tall empty Analysis pane and away from the
	     textarea it acts on. Dann's ruling 7 of 2026-08-20 dissolves the
	     repair rather than making it: once Source is a station with its own
	     contents, its two actions sit at its foot by construction.

	     THE BODY IS A FLEX COLUMN and the header is not in it, so the
	     header's own 0.4rem is the whole gap to the first entry. Ruling 2.
	     Twinned on SongList. -->
	<div class="section source-section" class:shut={!sections.has(STATION_IDS.source)}>
		<StationHeader
			label={t('source.heading', language)}
			expanded={sections.has(STATION_IDS.source)}
			ontoggle={() => sections.toggle(STATION_IDS.source)}
			controls="station-source"
		/>
		{#if sections.has(STATION_IDS.source)}
		<div class="station-body" id="station-source">
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

	<!-- ── THE SCORE FIELD'S ACTION ROW. N.65 ship B, §B.6. Dann dissolved
	     the naming question rather than answering it: "I do not think we
	     need an Output section articulated. What I want is the appearance
	     that the Print/Export/Import row shares the same relationship to the
	     score field as the Clear text/Transcribe row does to the text field
	     above it."

	     SO IT IS A ROW, NOT A STATION. No label, no heading, no chevron, and
	     no orphan control: both pairs belong to SOURCE. The `.output-section`
	     wrapper is gone rather than emptied, and its two contributions went
	     with it: the 6px of top padding the station recipe gives a label, and
	     the station boundary the row sat across. Those, with `.dz-wrap`'s
	     8px margin, were the 26px this ship closes to `.station-body`'s own
	     6px flex gap, the same gap that carries the textarea to Clear and
	     Transcribe.

	     PRINT HAS LEFT, AND THIS SHIP IS THE ONE THAT PROMISED IT. The note
	     that stood here said Print stayed only because deleting it would
	     leave no way to print until the desk-head ship, and that "that ship
	     removes it". It does. With it goes the transient consequence it
	     named: shutting SOURCE no longer takes Print with it, because Print
	     is not in SOURCE.

	     `Export all songs` is a third cell, shown only above one song,
	     because with one song it says the same thing as the button beside it.
	     THE GRID IS UNCHANGED, and that is a decision the brief did not rule.
	     It is still `repeat(3, 1fr)`, so the cell that used to wrap to a
	     second row now takes the column Print left empty. Two buttons where
	     there was one song, three where there is more than one, on one row
	     either way. Narrowing the grid to two columns is a separate ruling
	     and this ship does not make it. -->
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




</div>

<style>
	/* N.65 ship one, Dann's walk. NO GAP AND NO TOP PADDING. Both used to
	   sit between the stations on top of each station's own padding, so the
	   space above a label depended on which station it was. The station
	   recipe below owns every vertical measure in this column now. */
	.root-panel {
		display: flex;
		flex-direction: column;
		/* NO BOTTOM PADDING. Ruled by Dann 2026-08-21, measured on the deploy
		   of `7294b42` at a 430px viewport: shut, the station boundaries read
		   NOTATION 58.0, SOURCE 58.0, REPERTOIRE 58.0, and ANALYSIS 98.0 CSS
		   px, rule to rule. **The 40px difference was this declaration**, and
		   it is not ANALYSIS's: it sat between ANALYSIS and the Fit panel that
		   opens with SHIFT LYRICS. His ruling is that a shut station is the
		   same height as its siblings, and that boundary was the last one that
		   was not.

		   With it gone, ANALYSIS's own `.section.shut` 6px is the whole gap and
		   SHIFT LYRICS brings its own rule, which is the recipe every other
		   station boundary in this column already uses. Open, ANALYSIS gives
		   12px like every other open station. */
		padding: 0 1rem;
	}

	/* THE COLUMN'S FOOT BELONGS TO WHICHEVER PANEL ENDS THE COLUMN, and this
	   rule is what moves it there rather than back where it was.

	   `.drawer-content` holds two panels on Studio: this one, then
	   `.shane-panel`, which carries the same `40px` foot. Wall-open, that one
	   ends the column and this rule does not apply. **Wall-closed it is a
	   different drawer.** `INCLUDE_SHANE` gates the whole body of the
	   `shanePanel` snippet in `+page.svelte`, so a build with
	   `PUBLIC_INCLUDE_SHANE` unset renders no `.shane-panel` at all, this panel
	   ends the column, and without this rule ANALYSIS's 6px would be the entire
	   gap to the bottom anchor's lavender rule. `.env.example` documents unset
	   as the production build, so that configuration is real and not
	   hypothetical.

	   `:last-child` rather than a class, because the question this asks is
	   exactly "does anything follow me", and Svelte renders the absent snippet
	   as a comment node, which `:last-child` does not count. 40px is the value
	   this panel already spent; no new one enters. */
	.root-panel:last-child {
		padding-bottom: 40px;
	}

	/* ── Dictionary progress bar (Kimi spec) ───────────────── */

	.dict-progress {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		width: 60%;
	}

	.dict-progress-text {
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		font-family: var(--font-sans);
	}

	.dict-progress-track {
		width: 100%;
		height: 4px;
		background: var(--stone-300);
		border-radius: 2px;
		overflow: hidden;
	}

	.dict-progress-fill {
		height: 100%;
		background: var(--sage);
		border-radius: 2px;
		transition: width 200ms ease;
	}

	.dict-progress-fill.indeterminate {
		width: 30%;
		animation: indeterminate 1.5s ease-in-out infinite;
	}

	@keyframes indeterminate {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(433%); }
	}

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

	/* ── Result summary: always reserves space ────────────── */

	/* N.65 ship one. `margin-top: -4px` is gone. It pulled this line up
	   against the uploader that used to sit above it; it is the first entry
	   under ANALYSIS's header now, where a negative margin would eat the
	   ruled 0.4rem gap. */
	.result-summary {
		font-size: 0.75rem;
		color: var(--sage);
		font-family: var(--font-sans);
		margin: 0;
		min-height: 1.2em;
		text-align: right;
	}

	.result-hidden {
		visibility: hidden;
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

	/* ── The stations (N.65 ship one) ─────────────────────── */
	/* THE LABEL RECIPE IS NOT HERE ANY MORE. It is
	   `StationHeader.svelte`, the drawer's one owner, and the reasoning for
	   a component over a `:global` rule is written there. */

	/* THE STATION RECIPE, RULED BY DANN ON HIS WALK OF SHIP ONE, 2026-08-20:
	   "consistent spacing and consistent section dividing lines modelled
	   after Analysis." ANALYSIS IS THE MODEL and this is it, measured off
	   what `.console-section` already drew: a 2px sage rule, 6px, the
	   label, the label's own 0.4rem, the body, 6px, the next station's
	   rule. Every station in the drawer answers to it, so the space above
	   any label is 6px and the space below any body is 6px, wherever the
	   singer looks.

	   ONE RULE PER BOUNDARY, drawn by the station BELOW it. Analysis used
	   to draw both its own, which is why it was the only station with
	   lines: its neighbours drew none. Output and Songs draw their own top
	   rule now, so Analysis's bottom rule is gone rather than doubled. */
	.section {
		border-top: 2px solid var(--sage);
		/* 6px above the label, 12px below the body, RULED BY DANN on his walk
		   of `f59f7d2`: the Clear-and-Transcribe row read "cramped" against
		   the rule beneath it. 12px is the step this drawer already used
		   between stations before this ship folded it into the recipe, so no
		   new value enters the scale.

		   THE ASYMMETRY IS THE POINT and it is applied to every station, not
		   to Source alone. A label belongs to the rule above it, so it stays
		   close. A body has finished saying its piece, so it gets air before
		   the next rule. Spending 12px on both would push the label away from
		   the line that names it. */
		padding: 6px 0 12px;
	}

	/* A SHUT STATION IS THE SAME HEIGHT AS ITS TWINS. N.65, Dann's ruling of
	   2026-08-21, on the desktop with every station shut: "the spacing of
	   Notation Source Repertoire and Analysis all need to be consistent. Right
	   now these retracted sections are irregularly sized." Then the direction:
	   "I see more padding under Source and Repertoire than Metadata and
	   Notation. Make them Match Metadata and Notation."

	   THE RULING ABOVE IS KEPT, NOT OVERTURNED. Open, the asymmetry stands
	   exactly as it is: the label stays close to the rule that names it and
	   the body gets air before the next rule. A SHUT STATION HAS NO BODY, so
	   the 12px is air after nothing. This is the same move
	   `.station-label.tight` (`StationHeader.svelte:139`) already makes when it
	   drops the label's own gap on a station that shuts.

	   6px, NOT 0, AND THE TREE IS WHY. The brief said the bottom padding
	   "leaves with the body", which would land these three on 22.8px and
	   24.8px against Metadata's 28.8px and Notation's 30.8px: irregular again,
	   in the other direction. MEASURED with every station shut, before this
	   change: METADATA 28.8, NOTATION 30.8, SOURCE 34.8, REPERTOIRE 36.8,
	   ANALYSIS 36.8. Metadata and Notation are `.section` too, in
	   `MetadataFields.svelte` and `NotationFields.svelte`, and theirs is
	   `padding: 6px 0`. So the target is 6px, which is Dann's own instruction
	   read literally, and no new value enters the scale: it is this recipe's
	   own top step.

	   THE 2px THAT REMAINS IS A RULE, NOT PADDING. Notation, Source and
	   Analysis draw a `border-top`; Metadata and Repertoire do not, because
	   each sits directly under a rule something above it already draws.
	   Metadata's comes from the drawer header, Repertoire's from
	   `.drawer-anchor-top`'s `border-bottom` (`Drawer.svelte:839`). That is a
	   mark on the page, which is what Dann is looking at, and it is
	   consistent again.

	   THAT LIST NAMED REPERTOIRE AND SOURCE THE OTHER WAY ROUND UNTIL N.77
	   SHIP 4, and it was correct when written: Source was first in the
	   scroll then. The Repertoire move of `a1b5774` swapped them and the
	   list went stale where the exemption did. */
	.section.shut {
		padding-bottom: 6px;
	}

	/* THE EXEMPTION BELONGS TO WHATEVER IS FIRST IN THE SCROLL, AND IT MOVED
	   ON 2026-08-21 BECAUSE THE ORDER DID.

	   It read `.source-section { border-top: none }` until N.77 ship 4, and
	   its reason was sound: `.drawer-anchor-top` (`Drawer.svelte:839`) draws
	   a 2px sage `border-bottom` under the pinned Metadata and Notation
	   block, so the first station in the scroll already has a top boundary.
	   A `border-top` there lands on the same y and paints as one 4px rule,
	   which is the double line Dann had been asking about since the walk.

	   `a1b5774` moved Repertoire above Source. Source stopped being first
	   and kept the exemption, so its own boundary went blank and Repertoire
	   inherited the doubling. MEASURED on the built phone before this
	   change: two 2px sage marks at the same y above REPERTOIRE, and nothing
	   at all between REPERTOIRE and SOURCE.

	   So the exemption follows the position rather than the station. If the
	   order changes again, move it again. */
	.song-section {
		border-top: none;
	}

	/* THE OUTPUT STATION IS GONE, N.65 ship B, §B.6. Its `.output-section`
	   rule declared `border-top: none`, which was Dann's ruling of
	   2026-08-20 on his walk of the silhouette ship: no horizontal line
	   between the score field and the Print row. THAT RULING IS NOT
	   REVERSED, IT IS SATISFIED BY CONSTRUCTION. There is no boundary to
	   draw a line across any more, because the row is inside SOURCE. */

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

	/* One step between stations in the scroll, and it is the 12px the tree
	   already spent between Analysis and Songs. With `.root-panel`'s own
	   6px flex gap that is 18px, three times. Source takes none: it is
	   first, under the anchor's rule. */


	/* ── Word Console section ────────────────────────────── */

	/* ANALYSIS's two rules. KEPT, and both have a function under Dann's
	   ruling 3: the top one separates Analysis from Source and the bottom
	   one separates Analysis from Output. They are the drawer's only
	   station boundaries and they are the tree's own 2px sage, which
	   shipped and was walked. The r1 mockup draws station boundaries at 1px
	   against the anchors' 2px; the tree wins per tether 3, and the memo
	   names the difference. `margin-top` moved up into the shared station
	   step. */
	/* Analysis takes the shared recipe and adds only `overflow: visible`,
	   which the Inspector needs. Its border and padding used to be
	   declared here; they are the recipe now, and it is the recipe BECAUSE
	   they were declared here. */
	.console-section {
		overflow: visible;
	}

	.console-placeholder-body {
		min-height: 365px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 0.5rem;
	}

	.placeholder-hint {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		font-style: italic;
		color: var(--ink-tertiary);
	}

</style>
