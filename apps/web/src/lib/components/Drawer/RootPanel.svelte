<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LoaderState } from '$lib/loader';
	import { t, type Language } from '$lib/i18n';
import SongList from './SongList.svelte';
import StationHeader from './StationHeader.svelte';
import type { SongRow } from '$lib/library/songs';

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
		onprint: () => void;
		/**
		 * N.73 S2. Keyed on the VISIBLE document, not on this panel: the
		 * transcription's guard when Studio shows the transcription, the
		 * score's when it shows the marked score. `+page.svelte` owns both
		 * expressions because only it knows which document is on the desk.
		 */
		printDisabled: boolean;
		/** N.67 step 5, the binder. Twinned on the print control, Dann's ruling. */
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
		onprint,
		printDisabled,
		onexport,
		onimport,
		onexportall,
		songLibrary,
	}: Props = $props();

	const charCount = $derived(inputText.length);
	const showWarning = $derived(charCount > 5000);
	const dictReady = $derived(loaderState.entryCount > 0 && !loaderState.isLoading);

	/* ── OCR state ─────────────────────────────────────────── */
	let ocrProcessing = $state(false);
	let ocrError = $state('');
	let fileInputEl: HTMLInputElement;

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
	<div class="section source-section">
		<StationHeader label={t('source.heading', language)} />
		<div class="station-body">
	<div class="textarea-wrapper">
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

	<!-- N.73 S2. Score intake, beside the wired scanner. Text intake and
	     score intake are one Source region: the drop surface and the
	     no-lyrics notice that follows it came here from the Fit drawer. -->
	{@render sourceScore?.()}

	<!-- SOURCE'S OWN ACTIONS, N.65 ship one. Two buttons, not three: Print
	     left with the binder controls. The `1fr 1fr 2fr` grid this came out
	     of does not exist any more, so `.binder-row`'s comment about column
	     alignment went with it. Clear and Transcribe keep the widths they
	     had in that grid, 1fr and 2fr, so the primary action is still the
	     wide one. -->
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
		     button produced it. -->
		<p class="error-text">{transcribeError}</p>
	{/if}
		</div>
	</div>

	<!-- ── ANALYSIS. N.73 S3 ship two moved this block ABOVE Output ──
	     The spec rules the scroll's order Source, Analysis, Output
	     (`fable-gui-audit-and-spec_r1_2026-08-18.md:119-121`, §3.3, "Station
	     order is invariant across documents... A singer's hand learns one
	     map"), and the ratified mockup draws the same four stations in the
	     same order (`fable-gui-mockup_r1_2026-08-18.html:313-329`). The tree
	     drew Output first. This block moved; nothing inside it changed.

	     It sits directly under the result summary, which is where the mockup
	     puts the words-and-milliseconds line: inside Analysis, beside "select
	     a word to inspect it". The summary itself did NOT move, so the two are
	     adjacent rather than merged. Merging them is a station boundary nobody
	     has ruled. -->
	<div class="section console-section">
		<StationHeader label={t('console.placeholder', language)} />
		<div class="station-body">
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
	</div>
	<!-- ── OUTPUT. Print, Export, Import. N.65 ship one ──────────────
	     Print came DOWN from the Clear-Print-Transcribe grid and joined the
	     two binder controls, per Dann's ruling 7 of 2026-08-20. All three
	     carry a song off the device rather than acting on the text, so they
	     are one row of three equal columns. The `1fr 1fr 2fr` grid and
	     `.binder-row`'s comment about column alignment are gone rather than
	     repaired: there is one row here now, so there is nothing to align a
	     second row against.

	     `Export all songs` was that grid's `2fr` third column and is now a
	     fourth cell, which wraps to the first column of a second row. It is
	     still shown only above one song, because with one song it says the
	     same thing as the button beside it.

	     THIS STATION HAS NO LABEL, DELIBERATELY, AND THE MEMO SAYS WHY.
	     Dann's ruling 4 named Source and only Source. The ratified r1 mockup
	     draws an OUTPUT label here (`fable-gui-mockup_r1_2026-08-18.html:325`)
	     but he has not ruled it and its French is NOT ESTABLISHED, so ship
	     one does not invent one. The header's slot is this element's first
	     child, the same position `StationHeader` takes in Source, Analysis,
	     and Songs, and ship two has to give every station a retractable
	     header anyway. -->
	<div class="section output-section">
		<div class="output-row">
			<button
				class="action-btn btn-secondary"
				disabled={printDisabled}
				onclick={onprint}
			>
				{t('input.print', language)}
			</button>
			<button class="action-btn btn-ghost" onclick={onexport}>{t('binder.export', language)}</button>
			<button class="action-btn btn-ghost" onclick={onimport}>{t('binder.import', language)}</button>
			{#if songLibrary.songs.length > 1}
				<button class="action-btn btn-ghost" onclick={onexportall}>{t('binder.exportAll', language)}</button>
			{/if}
		</div>
	</div>

	<!-- N.67 step 4b, THE LIBRARY DOOR. Adjacent to the binder row because both
	     are song-level acts: this one chooses which song, that one carries a song
	     off the device. Nothing goes on the paper. -->
	<div class="section song-section">
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
		/>
	</div>



</div>

<style>
	.root-panel {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 20px 1rem 40px;
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
	.textarea-wrapper {
		position: relative;
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
		background: white;
		border: 1px solid var(--sage);
		border-radius: 4px;
		padding: 0.5rem 0.6rem;
		padding-right: 2.2rem; /* room for the OCR icon */
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

	/* Output. Three equal columns, and a fourth cell wraps to the first
	   column of a second row when `Export all songs` is drawn. */
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

	.btn-secondary {
		color: var(--ink-secondary);
		background: white;
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

	.section {
		margin-top: 0;
	}

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
	.console-section,
	.output-section,
	.song-section {
		margin-top: 12px;
	}

	/* ── Word Console section ────────────────────────────── */

	/* ANALYSIS's two rules. KEPT, and both have a function under Dann's
	   ruling 3: the top one separates Analysis from Source and the bottom
	   one separates Analysis from Output. They are the drawer's only
	   station boundaries and they are the tree's own 2px sage, which
	   shipped and was walked. The r1 mockup draws station boundaries at 1px
	   against the anchors' 2px; the tree wins per tether 3, and the memo
	   names the difference. `margin-top` moved up into the shared station
	   step. */
	.console-section {
		border-top: 2px solid var(--sage);
		border-bottom: 2px solid var(--sage);
		padding: 6px 0 6px 0;
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
