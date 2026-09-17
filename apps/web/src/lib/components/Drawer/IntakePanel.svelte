<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LoaderState } from '$lib/loader';
	import { t, type Language } from '$lib/i18n';
	import type { TextArrival } from '$lib/one-action';

	/*
	 * IntakePanel.svelte — THE INPUT GROUP'S CONTENTS AND NOTHING ELSE.
	 *
	 * N.108-5, RULED BY DANN 2026-09-07: "The intake becomes its own group band
	 * between Piece and Text, named INPUT, painted sage like Text (hue names
	 * place: it is text); it holds the whole intake frame (field, receipts,
	 * Choose a file, the drop hint, the button) and nothing else; Piece keeps
	 * the name, metadata, repertoire, and export and import."
	 *
	 * EXTRACTED FROM `RootPanel.svelte`, NOT WRITTEN FRESH. Every line of the
	 * markup, every rule and every comment on both came across verbatim. A band
	 * cannot be drawn around part of one component's output, so the part had to
	 * become a component; nothing about what it draws changed.
	 *
	 * IT IS STILL HEADERLESS AND STILL NEVER CLOSED, the 2026-09-02 ruling: the
	 * intake has no station row and no id in the drawer's open set. That is
	 * also why the migration Dann asked for has nothing to add. A station with
	 * no id cannot be stored shut, so INPUT stands open for every singer,
	 * returning or new, by construction rather than by a stored value.
	 * Recorded as a DESK DEFAULT in the N.108-5 memo.
	 *
	 * WHAT `RootPanel` KEPT: Repertoire and the binder, which are Piece's.
	 *
	 * THE BUTTON FAMILY IS DECLARED TWICE ON PURPOSE. `.action-btn`,
	 * `.btn-ghost` and `.btn-primary` are copied from `RootPanel.svelte` value
	 * for value, because Svelte scopes a rule to the file that writes the
	 * markup. `SongList.svelte`, `VoiceAnchor.svelte` and `CalibrationWizard`
	 * each say the same thing in their own headers, so this is the tree's habit
	 * and not a new one. **Change one and change all four.**
	 */
	interface Props {
		inputText: string;
		loaderState: LoaderState;
		canTranscribe: boolean;
		transcribeError: string;
		language: Language;
		/**
		 * The score engine's answers, rendered under the frame. A snippet
		 * rather than props, so the uploader's wiring (its restore source, its
		 * `{#key}` on the open song, its arrival handler and the
		 * `INCLUDE_SHANE` gate) stays in `+page.svelte` where the rest of it
		 * lives and nothing is drilled through here.
		 */
		sourceScore?: Snippet;
		/**
		 * N.108-5, RULED BY DANN 2026-09-07. The second argument is HOW the
		 * text got here, because a paste transcribes at once and a keystroke
		 * after a quiet pause. This component is the only place that can tell
		 * them apart: the answer is on the `InputEvent`, and by the time
		 * `+page.svelte` has a string it is gone.
		 */
		oninput: (text: string, how: TextArrival) => void;
		/**
		 * N.145, 2026-09-16, REPLACES `ontranscribe`. Transcribe and fit is
		 * removed (Dann: "yes, remove the button"); text already transcribes
		 * on paste and after a typing pause (`oninput`'s own `TextArrival`),
		 * so the one thing this field still needs its own verb for is
		 * Cmd+Enter, which skips the pause. Maps to `+page.svelte`'s
		 * `flushText`.
		 */
		onflush: () => void;
		onclear: () => void;
		/** N.70's ruling arrives with the picker it governs; see `acceptList`. */
		isMobile?: boolean;
		/** The transcription's own count, shown once there has been one. */
		wordCount: number;
		/**
		 * N.115. The poem's own measure, for its receipt. IT CAME FROM HERE and
		 * went up to `+page.svelte`: Input's closed state line needs the same
		 * number, and two derivations of one count are two answers waiting to
		 * disagree. Blank lines are not lines of verse.
		 */
		lineCount: number;
		hasResults: boolean;
		/** The ACCEPTED score, or null. Not a file mid-flight. */
		score: { fileName: string } | null;
		/**
		 * N.134, RULED BY DANN 2026-09-10: the poem in the box is the score's own
		 * words, so its receipt carries `from score`, the Piece fields' tag.
		 * Derived in `+page.svelte`, where the score and the poem both live.
		 */
		poemFromScore?: boolean;
		/** A file arrived at the one field, by drop or by picker. */
		onfile: (file: File) => void;
		/** Clear on the SCORE receipt. Leaves the poem alone. */
		onclearscore: () => void;
		/* N.147, RULED BY DANN 2026-09-17: THE SYLLABLE LINE THAT LIVED HERE
		   (N.114, 2026-09-07 and 2026-09-09; `syllableLine`, `syllablesPlaced`,
		   `syllablesTotal`, `onstartover`) IS GONE, collapsed row and all. His
		   reason: two copies of the syllabified text confuse the singer, and
		   moving between drawer and loupe to place syllables is inconvenient,
		   worst on a phone. This band keeps the source text only now; the row
		   lives in the loupe (`LoupeSyllables.svelte`, rendered by
		   `Loupe.svelte`), beside the notes it places onto. */
		/**
		 * NOTATION AND ANALYSIS, N.115 increment 3. RULED BY DANN 2026-09-10
		 * late: the Text fold is deleted, "as a child of Input it adds no
		 * value except to bottleneck access to Notation and Analysis." The
		 * two stations stand here, under the poem box, as the two plain rows
		 * they always were, each with its own id and its own chevron.
		 *
		 * A SNIPPET, for `sourceScore`'s reason: Notation's and Analysis's
		 * wiring is all in `+page.svelte`, and moving them did not move one
		 * prop of it. It was `textSection` inside a fold with its own open
		 * state; the fold and its three props went, and the name went with
		 * them because it named the fold.
		 */
		notationAndAnalysis?: Snippet;
	}

	let {
		inputText,
		loaderState,
		canTranscribe,
		transcribeError,
		language,
		sourceScore,
		oninput,
		onflush,
		onclear,
		isMobile = false,
		wordCount,
		lineCount,
		hasResults,
		score,
		poemFromScore = false,
		onfile,
		onclearscore,
		notationAndAnalysis,
	}: Props = $props();

	/* ONE OWNER FOR "THE SOURCE FIELD IS EMPTY". It bound the watermark and
	   the sage hover together by Dann's ruling of 2026-08-20; the watermark
	   was retired 2026-09-03 and the hover is the one reader left. The name
	   stays, because the poem's receipt reads it too. */
	const sourceIsEmpty = $derived(inputText === '');

	const charCount = $derived(inputText.length);
	const showWarning = $derived(charCount > 5000);

	/**
	 * N.70 (Dann's ruling, 2026-08-16), MOVED HERE WITH THE PICKER IT GOVERNS.
	 * It was `ScoreUploader`'s until N.108 increment 2 gave the drawer one
	 * intake; the reasoning is his and is reproduced whole rather than cited,
	 * because a ruling that lives one file away from the line it governs is a
	 * ruling that gets deleted by someone tidying.
	 *
	 * iOS matches `accept` by REGISTERED TYPE, not by the string, and it has no
	 * registration for `.musicxml`, `.mnx`, `.musx`, or `.mscz`. So on a phone
	 * every format Ilya can actually read is greyed out and unselectable, while
	 * PDF and images, which iOS does have registrations for, stay pickable.
	 * Dann hit this on his own iPhone, 2026-08-16.
	 *
	 * A narrower MIME list was considered and rejected: iOS would need a type
	 * registration it probably does not have, so it could fail exactly as
	 * silently. Dropping the attribute cannot half-work.
	 *
	 * Nothing is loosened about what Ilya ACCEPTS: the sniff reads the bytes and
	 * every refusal is named. This only changes which files the picker will let
	 * a singer point at.
	 *
	 * NAMED CONSEQUENCE: `isMobile` is a WIDTH test, not an iOS test, so a
	 * narrow desktop window also gets the unfiltered picker. Accepted rather
	 * than inventing a second detector.
	 *
	 * N.108 increment 4: THERE IS ONE PICKER NOW and this rule governs it, as
	 * it governed the two before. The photograph picker that carried the same
	 * rule with an `image/*` filter is gone; `image/*` is still in ACCEPT, so
	 * a photograph is pickable on a fine pointer and every kind is pickable on
	 * a coarse one, which is the whole of N.70.
	 */
	const ACCEPT = '.mnx,.json,.xml,.musicxml,.mxl,.musx,.mscz,.pdf,image/*';
	const acceptList = $derived(isMobile ? undefined : ACCEPT);

	let dragging = $state(false);
	let textareaEl = $state<HTMLTextAreaElement | undefined>(undefined);
	let fileInputEl = $state<HTMLInputElement | undefined>(undefined);

	function chooseFile(): void {
		fileInputEl?.click();
	}

	function onPick(e: Event): void {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = ''; // reset so the same file can be re-selected
		if (file) onfile(file);
	}

	/* A FILE DROP IS TAKEN AND A TEXT DROP IS NOT. `preventDefault` runs only
	   where `dataTransfer` actually carries a file, so dropping selected text
	   onto the field still inserts it the way a textarea always has. Dragover
	   is prevented unconditionally, because without it the browser refuses the
	   drop before this handler ever sees it. */
	function onDrop(e: DragEvent): void {
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (!file) return;
		e.preventDefault();
		onfile(file);
	}

	function onDragOver(e: DragEvent): void {
		e.preventDefault();
		dragging = true;
	}

	function onDragLeave(): void {
		dragging = false;
	}

	/** Replace on the POEM's receipt. The field never left, so this is what
	 *  Replace means where it did not: the poem is selected and the next thing
	 *  typed or pasted takes its place. Nothing is destroyed by pressing it. */
	function replacePoem(): void {
		textareaEl?.focus();
		textareaEl?.select();
	}
	/* `dictReady` IS GONE with `.root-panel`. It set a `status-ok` class on
	   that wrapper, and nothing in this file or any other ever declared a rule
	   for it, so the wrapper's removal took its only reader and left a derived
	   value that computed an answer nobody asked. Deleted rather than moved.
	   N.108 increment 1. */

	/* ── THE OCR MOVED OUT, N.108 increment 4 ───────────────
	   The camera icon that stood in the field's top-right corner is gone with
	   the photograph button beside it, ruled by Dann 2026-09-03: the icon,
	   Choose a file, and Read a score from a photograph "all serve the same
	   function". What the icon did has not gone anywhere. A picture picked or
	   dropped now asks in place which it is, and the poem answer runs exactly
	   the same Tesseract read, in `ScoreUploader.svelte`, beside the PDF
	   question it now shares. The two failure messages went with it, word for
	   word in both languages.

	   THIS PANEL KEEPS NO OCR STATE, so the field is no longer disabled by a
	   read it cannot see: the wait and the refusal both appear under the field,
	   where `ScoreUploader` renders every other answer about a file. */

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
	 * finished changing the text rather than started.
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

	/* ── Existing handlers ─────────────────────────────────── */

	/* N.145, 2026-09-16: CALLS `onflush`, NOT THE REMOVED BUTTON. Cmd+Enter
	   still means "transcribe now, skip the pause"; it used to reach that
	   through Transcribe and fit's own handler and now calls `flushText`
	   directly. */
	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
			e.preventDefault();
			onflush();
		}
	}
</script>

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

	<!-- ═══ THE ONE FIELD (N.108 increment 2) ═══════════════════════════
	     It was two: a textarea for the poem and a drop zone for the score,
	     side by side under one heading since N.73 S2. It is one now, and the
	     kind is decided by what arrives rather than by which box it was put
	     in. The frame is Design's r2 prototype at `:190`, a neutral dashed
	     rule around the whole intake; the field inside it is the textarea,
	     unchanged in font, size and behaviour.

	     THE DASHED RULE IS THE DROP AFFORDANCE, and it is neutral on purpose.
	     "Hue names place" ruled sage for the text intake and lavender for the
	     score intake (Dann, 2026-07-13, ratified since). There is one place
	     now, so there is one hue and it is neither of theirs. Design drew it
	     that way and marked the fill a placeholder; it is Dann's on the walk.

	     THE DROP TARGET IS THE WHOLE FRAME, receipts and buttons included, so
	     a singer who already has a poem can still drop a score without
	     hunting for a strip of empty field. -->
	<div
		class="intake"
		class:dragging
		class:empty={sourceIsEmpty}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
		ondrop={onDrop}
		role="group"
		aria-label={t('source.heading', language)}
	>
		<!-- THE WATERMARK IS RETIRED. Ruled by Dann 2026-09-03 on his walk of
		     `cedf246`, amending N.65 (his own ruling of 2026-08-20, which put
		     a large centred word inside each of the two intake fields). The
		     component is deleted, not merely unmounted: `IntakeWatermark.svelte`
		     is gone from the tree.

		     `input.watermark` AND `upload.watermark` STAY IN `i18n.ts`. They
		     are the receipt tags now, and `input.watermark` reads `poem` since
		     Dann's ruling of 2026-09-07 (N.111-3b), because TEXT was also the
		     name of the band this field sits in. `upload.watermark` is still
		     `score` and still ratified in both languages; the poem's French is
		     owed. -->
		<textarea
			class="text-input"
			bind:this={textareaEl}
			placeholder={t('intake.placeholder', language)}
			value={inputText}
			oninput={(e) => oninput((e.target as HTMLTextAreaElement).value, arrivalOf(e))}
			onkeydown={handleKeydown}
			rows="6"
			disabled={loaderState.isLoading}
		></textarea>

		<!-- THE CAMERA ICON IS GONE, N.108 increment 4, ruled by Dann
		     2026-09-03 on his walk of `42f6871`: the icon, Choose a file, and
		     Read a score from a photograph "all serve the same function. Please
		     consolidate these and find a reasonable place for the user to
		     perform their file retrieval."

		     WHAT THE ICON MEANT IS NOW A QUESTION RATHER THAN A BUTTON. It
		     existed because pressing it was how a singer said "this picture is
		     text, not music"; the increment 2 comment said so in as many words,
		     "the two stay apart because the button a singer presses is what says
		     which they meant". One picker cannot say it that way, so the picture
		     asks in place, exactly as a PDF has since increment 2, and the poem
		     answer runs the same OCR. `ScoreUploader.take` holds both questions.

		     A DROPPED PICTURE NOW ASKS TOO. It went straight to the score reader
		     before, on the brief's "a photograph goes to the reader"; that rule
		     assumed the camera icon was the other way in, and the icon is gone.
		     Recorded in the memo as a departure. -->

		<!-- ── THE HINT IS THE FIELD'S CAPTION. N.114a, RULED BY DANN
		     2026-09-09 walking `3765314`: it moves from the foot of the frame,
		     under Choose a file, to sit directly under the textarea and above
		     the receipts. The copy is `intake.dropHint` unchanged in both
		     languages, and so is its type: it says what a file dropped on the
		     field will do, so it reads where the field is rather than three
		     controls later. Choose a file did not move. -->
		{#if !sourceIsEmpty || score}
			<p class="intake-drop-hint">{t('intake.dropHint', language)}</p>
		{/if}

		<!-- ── THE EMPTY FIELD'S CAPTION. N.115, RULED BY DANN 2026-09-10
		     after the walk: the placeholder is "Paste, type, or drop your poem
		     here." and the line under the field is "A score or a photograph can
		     go here too, or you can choose a file." with the last three words
		     as the link and the Choose a file pill gone.

		     THE OPPOSITE GUARD FROM THE DROP HINT, and deliberately: this line
		     says what else the EMPTY field takes, and `intake.dropHint` says
		     what a second file does to a field that already holds something.
		     Only one of the two is ever drawn, in the intake hint's ruled
		     place (2026-09-09), directly under the textarea.

		     ONE SURFACE TAKES EITHER KIND, which is why Design's second dashed
		     box with its own pill is not built: two boxes say "poem here,
		     score there" and that is not true.

		     THE LINK IS A SUBSTRING OF A RULED SENTENCE, so the sentence stays
		     whole in the table where Dann reads it and this splits it here.
		     `intake.captionLink` is the phrase in each language; if it is ever
		     absent from the caption the whole sentence is drawn as text, which
		     loses the link and never loses the words. -->
		{#if sourceIsEmpty && !score}
			{@const caption = t('intake.caption', language)}
			{@const link = t('intake.captionLink', language)}
			{@const at = caption.indexOf(link)}
			<p class="intake-caption">
				{#if at === -1}
					{caption}
				{:else}
					{caption.slice(0, at)}<button type="button" class="caption-link" onclick={chooseFile}>{link}</button>{caption.slice(at + link.length)}
				{/if}
			</p>
		{/if}

		<!-- ── THE RECEIPTS, one line per kind (the prototype `:362-:374`).
		     Each carries its own Clear and its own Replace, and neither
		     handler can reach the other's material: the poem's Clear is
		     `onclear`, which empties `inputText`, and the score's is
		     `onclearscore`, which detaches the source and, since N.108
		     increment 3, empties the Metadata fields that score filled and
		     nothing the singer typed. The tags are
		     `input.watermark` and `upload.watermark`, the two ratified words
		     the watermarks already used, so the receipt names each kind in
		     the word the field named it in. -->
		{#if !sourceIsEmpty}
			<div class="intake-receipt receipt-poem">
				<span class="tag">{t('input.watermark', language)}</span>
				<span class="line">{t('intake.lines', language).replace('%s', String(lineCount))}</span>
				{#if hasResults}
					<span class="count">{t('intake.words', language).replace('%s', String(wordCount))}</span>
				{/if}
				{#if poemFromScore}
					<span class="from-score">{t('meta.fromScore', language)}</span>
				{/if}
				<button type="button" class="receipt-btn" onclick={onclear}>{t('intake.clear', language)}</button>
				<button type="button" class="receipt-btn" onclick={replacePoem}>{t('intake.replace', language)}</button>
			</div>
		{/if}
		{#if score}
			<div class="intake-receipt receipt-score">
				<span class="tag">{t('upload.watermark', language)}</span>
				<span class="line" title={score.fileName}>{score.fileName}</span>
				<button type="button" class="receipt-btn" onclick={onclearscore}>{t('intake.clear', language)}</button>
				<button type="button" class="receipt-btn" onclick={chooseFile}>{t('intake.replace', language)}</button>
			</div>
		{/if}

		<!-- THE SYLLABLE LINE THAT STOOD HERE (N.114, 2026-09-07 and
		     2026-09-09) IS GONE, N.147, RULED BY DANN 2026-09-17, collapsed
		     row and all: two copies of the syllabified text confused the
		     singer, and moving between drawer and loupe to place syllables
		     was inconvenient, worst on a phone. This band shows the source
		     text only now. The row lives in the loupe
		     (`LoupeSyllables.svelte`, rendered by `Loupe.svelte`), beside the
		     notes it places onto. -->

		<!-- ── THE CHOOSE A FILE PILL IS STRUCK. N.115, ruled by Dann
		     2026-09-10: the verb is the link in the field's caption above and
		     the pill is gone, so the empty drawer has one filled thing on it
		     and no ghost pill competing for the same act. `intake.choose` is
		     deleted from `i18n.ts` with it; nothing else read the key.

		     THE PHONE STILL HAS A WAY IN, which is what the pill was protecting
		     (a phone cannot drop a file): the caption's link calls the same
		     `chooseFile()`, and it is drawn in exactly the state a phone singer
		     with no poem is in. Once there IS material, Replace on each receipt
		     opens the same picker, which is what it always did. -->

		<!-- THE ONE PICKER. N.70 governs it; see `acceptList`. -->
		<input
			type="file"
			accept={acceptList}
			class="hidden-input"
			bind:this={fileInputEl}
			onchange={onPick}
		/>
	</div>

	{#if showWarning}
		<p class="char-warning">{charCount.toLocaleString()} {t('input.warning', language)}</p>
	{/if}

	<!-- THE SCORE ENGINE'S ANSWERS, and nothing else: `ScoreUploader` draws
	     no field of its own since N.108 increment 2. What appears here is the
	     PDF question, the clef-and-key question, the wait, the read report,
	     the fidelity banner and every named refusal, and each of them is
	     about a file that arrived at the frame directly above. -->
	{@render sourceScore?.()}

	<!-- ── NOTATION AND ANALYSIS. N.115 increment 3, RULED BY DANN 2026-09-10
	     late: the fold that stood here is deleted, "as a child of Input it
	     adds no value except to bottleneck access to Notation and Analysis."
	     The two stations render where the fold's body rendered, closed by
	     default, each with the station row, the chevron and the hairline
	     every other station in the drawer has.

	     BELOW THE SCORE ENGINE'S ANSWERS AND ABOVE TRANSCRIBE AND FIT, which
	     is where the fold stood and is a DESK DEFAULT the fold carried: the
	     primary stays last in the band, and the uploader's answers stay
	     directly under the frame they are about. -->
	{#if notationAndAnalysis}
		<div class="intake-stations">{@render notationAndAnalysis()}</div>
	{/if}

	<!-- ── THE ONE TRANSCRIBE IS REMOVED, 2026-09-16 (N.145). Dann: "yes,
	     remove the button." `input.transcribe` and `input.transcribeLoading`
	     stay in `i18n.ts`, unused, the same way N.108 increment 2's dropzone
	     strings did: a ratified string is not this ship's to delete. -->

	{#if transcribeError}
		<!-- The failure of Transcribe, so it reports inside the station whose
		     button produced it, and directly under it. -->
		<p class="error-text">{transcribeError}</p>
	{/if}

	</div>
</div>

<style>
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


	/* ── THE ONE FIELD'S FRAME (N.108 increment 2) ──────────
	   `.textarea-wrapper` is `.intake`, and it grew from a box around one
	   textarea into the frame around the whole intake: the field, both
	   receipts, the two buttons and the drop hint.

	   THE PROTOTYPE'S OWN RULE, `:190`: a 1px DASHED neutral border at ink
	   0.28, the tree's 4px control radius, `--paper-light` as the fill, 12px of
	   padding. Dashed because the frame takes a drop; neutral because there is
	   one intake and "hue names place" has one place to name. Design marked the
	   fill a placeholder and this ship carries that forward rather than
	   inventing a different one: no hex is written here that `app.css` does not
	   already hold.

	   THE FILL IS ON THIS BOX AND THE FIELD INSIDE IT IS TRANSPARENT. That was
	   the watermark's stacking once; the watermark was retired 2026-09-03 and
	   the arrangement is kept because it is what the field looks like. Moving
	   the fill back onto the textarea would change the frame, which this
	   ruling did not ask for.

	   `position: relative` STAYS WITH NO CAMERA TO CONTAIN. It was the
	   watermark's containing block, then the OCR button's, and both are gone
	   (N.108 increments 2 and 4). It is kept because `.dragging` paints this
	   box and a positioned box is what the frame has always been; removing it
	   is a change to the frame that nothing asked for. */
	.intake {
		position: relative;
		border: 1px dashed rgba(26, 22, 18, 0.28);
		border-radius: 4px;
		background: var(--paper-light);
		padding: 12px;
		/* `.dropzone`'s own value, kept so the frame tints at the speed the
		   score box always did. */
		transition: background 0.15s ease;
	}

	/* ── THE SAGE HOVER (N.65), KEPT AND NARROWED ───────────
	   Dann's ruling, 2026-08-20: "Can the text input field have a sage
	   mouseover?" It is `--sage` #839275 at 6 percent, and it stays bound to
	   `sourceIsEmpty`, which is his own correction of the same day: an
	   unconditional hover would tint the singer's poem every time the cursor
	   crossed it.

	   THE LAVENDER TWIN IS GONE with the second box. `.dropzone:hover` was the
	   same 6 percent in `--lavender`, and there is nothing left for it
	   to describe. */
	.intake.empty:hover {
		background: rgba(131, 146, 117, 0.06);
	}

	/* THE DRAG STATE IS THE SCORE BOX'S, at its own doubled tint, moved onto
	   the frame that takes the drop now. `.dropzone.dragging` was
	   `rgba(142, 126, 155, 0.12)`; this is the same 12 percent in the sage the
	   one field hovers in, because one field means one hue. */
	.intake.dragging {
		background: rgba(131, 146, 117, 0.12);
	}

	/* ── The receipts (the prototype `:192-:196`) ───────────
	   One row per kind, tag then line then count then the two verbs. The
	   44px minimum is the prototype's and is the thumb target; the hairline
	   under each is the drawer's own station hairline value, so a receipt
	   separates from what follows it the way a station does. */
	.intake-receipt {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		border-bottom: 1px solid rgba(26, 22, 18, 0.08);
	}

	.intake-receipt .tag {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-tertiary);
		flex: none;
		width: 40px;
	}

	/* The file name can be long and the drawer is 520px. It takes the room
	   that is left and ellipsises; the whole name is on the element's title. */
	.intake-receipt .line {
		flex: 1;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--ink-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* The word count, moved off `AnalysisStation`'s instrument line. Tabular
	   figures so it does not jitter as the count grows. */
	.intake-receipt .count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		font-variant-numeric: tabular-nums;
		flex: none;
	}

	/* N.134. The provenance tag, in the drawer's existing `from score` voice:
	   `.band-state-tag`'s values in `Drawer.svelte`, which is where the same
	   string already stands on a band head. Italic tertiary, so it reads as a
	   note on the receipt rather than a second tag beside `poem`. */
	.intake-receipt .from-score {
		flex: none;
		font-size: 12px;
		font-style: italic;
		color: var(--ink-tertiary);
		white-space: nowrap;
	}

	/* Clear and Replace. Quiet, because a receipt is a statement and these are
	   its two afterthoughts; the 44px is the prototype's thumb target. */
	.receipt-btn {
		flex: none;
		min-height: 44px;
		padding: 0 8px;
		border: none;
		background: transparent;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--stone-500);
		cursor: pointer;
	}

	.receipt-btn:hover {
		color: var(--ink-primary);
	}

	/* THE SYLLABLE LINE'S OWN RULES (`.syl-box`, `.syl-row`, `.syl-preview`,
	   `.syl-head`, `.syl-start-over`, `.syl-toggle`, `.syl-count`,
	   `.syl-chevron`, and their `pointer: coarse` touch floor) ARE GONE, N.147,
	   with the markup they drew. `--intake-row-gap` went with them: both its
	   spends were inside this block. */

	.intake-drop-hint {
		margin: 0;
		padding-top: 8px;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}

	/* THE EMPTY FIELD'S CAPTION, N.115. The drop hint's recipe value for
	   value, because the two occupy the same place under the textarea and only
	   one is ever drawn: a caption that changed size when the field filled
	   would make the frame jump. */
	.intake-caption {
		margin: 0;
		padding-top: 8px;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}

	/* THE VERB, INSIDE THE SENTENCE. A link rather than a pill, ruled
	   2026-09-10, so it takes a link's dress: the caption's own type, one step
	   darker, underlined at the drawing's 2px offset. It is a `<button>`
	   because it opens a picker rather than going anywhere. */
	.caption-link {
		padding: 0;
		font: inherit;
		color: var(--ink-secondary);
		background: none;
		border: none;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	.caption-link:hover {
		color: var(--ink-primary);
	}

	.hidden-input {
		display: none;
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
	.text-input {
		width: 100%;
		font-family: var(--font-serif);
		font-size: 0.9rem;
		color: var(--ink-primary);
		/* TRANSPARENT, with the fill on `.intake`. See that rule. */
		background: transparent;
		/* `display: block` because the default `inline-block` put the textarea
		   on a text baseline, which left a 7px strip of wrapper below it,
		   MEASURED on the desk before this change: wrapper 154.47px tall
		   against the textarea's 147.47px. That strip was invisible while the
		   wrapper had no background and would be a white shelf under the field
		   now that it has one. It was never a designed gap. */
		display: block;
		/* `position: relative` and `z-index: 1` are gone with the watermark
		   (2026-09-03). They lifted this field above the mark so the
		   placeholder and any typed poem painted over it rather than under
		   it; there is no mark to be above. */
		border: 1px solid var(--sage);
		border-radius: 4px;
		padding: 0.5rem 0.6rem;
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
		border-color: var(--sage-deep, #7A8A6C);
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

	/* THE OCR CAMERA BUTTON'S RULES ARE GONE, N.108 increment 4, with the
	   button they drew: `.ocr-btn`, its hover and disabled states,
	   `.ocr-file-input`, `.ocr-spinner`, the `ocr-spin` keyframes, and
	   `.ocr-error`. They are deleted rather than left, because `svelte-check`
	   counts an unused selector as a warning and gate 3's baseline is 7.

	   `.intake`'s `position: relative` STAYS. It was the camera's containing
	   block and it is also the dragging state's, so it has a second reader. */

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

	/* ── NOTATION AND ANALYSIS, N.115 increment 3 ────────────
	   THE TWO STATIONS LOSE THEIR SIDE INSET, and only that. The drawer insets
	   every `.station` 18 px from the group's edge; these two already stand
	   inside the intake, which took that 18 px, so a second one would push
	   them 36 px in. Their hairlines, headers, bodies and motion stay the
	   drawer's, which is what makes them the two plain rows the ruling asks
	   for. Two classes deep, so the rule outranks the drawer's
	   `.group .station` whatever order the bundle loads the two sheets in.

	   THE FOLD'S OWN RULES WENT WITH IT: its hairline, its state-line recipe,
	   and its copy of the drawer's motion. The hairline above Notation is the
	   drawer's own station hairline now, drawn by the station rather than by a
	   wrapper. */
	.station-intake .intake-stations :global(.station) {
		margin-left: 0;
		margin-right: 0;
	}

	/* `.intake-transcribe` IS REMOVED, 2026-09-16 (N.145), with the row it
	   laid out: Transcribe and fit is gone. */

	/* PILL ENDS, N.108 increment 4. Ruled by Dann 2026-09-03 from the
	   calibration ritual's own two buttons (`CalibrationWizard.svelte`'s
	   `.wizard-primary` and `.wizard-secondary`, `border-radius: 999px`):
	   "The buttons shown here can form the template. Can we make other
	   buttons share its rounded ends?" Only the corners move; the fill, the
	   border, the type and the padding are untouched.

	   N.147, 2026-09-17: THIS WHOLE FAMILY IS NOW UNUSED IN THIS FILE.
	   `.btn-primary` already stood unused after N.145 took Transcribe and fit;
	   N.147 took "Start placement over" (`.syl-start-over`, RULED BY DANN
	   2026-09-10, N.114b item 3), which was the last `.action-btn`/
	   `.btn-ghost` in this file, with the syllable row it rode. Every button
	   left standing here (Clear, Replace, Choose a file) wears `.receipt-btn`.

	   ALL FOUR STAY, UNUSED, RATHER THAN BEING REMOVED: this file's own header
	   calls `.action-btn`, `.btn-ghost` and `.btn-primary` a twinned
	   declaration across four files, "change one and change all four," and
	   deleting a rule from one twin while the other three keep it would be the
	   smaller, quieter version of exactly the drift that note exists to
	   prevent. svelte-check counts all four now (the web-check gate moves
	   8 → 12 warnings with this ship; see the N.147 memo). */
	.action-btn {
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		border: none;
		border-radius: 999px;
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
</style>
