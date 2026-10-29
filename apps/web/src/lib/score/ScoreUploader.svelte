<!--
	ScoreUploader — the score ingest widget (Round 9 §2 Items 1, 2, 6; handover
	v35 §E.5). One drag-and-drop surface with click-to-browse, auto-detection,
	provenance-driven fidelity treatment, and inline persistent errors keyed by
	IngestError code. Agentless throughout: the copy never speaks as an agent,
	IPA and analysis live elsewhere.

	This component owns both converter lifecycles (§B.2): it constructs a
	WorkerScoreReader (denigma, .musx) and a WebmscoreMsczConverter (webmscore,
	.mscz) lazily on first need and disposes them on destroy. Each is
	constructed only when a file of its own kind actually arrives: the webmscore
	converter's warm-up prefetches ~17.5 MB of runtime assets, and the denigma
	reader's pulls a 4,511,746-byte WASM artifact (1,039,849 gzipped, measured
	2026-08-10). N.26 gave the reader the same treatment the converter always
	had; before it, a drop of any kind paid for denigma. The parsed result is
	handed up through
	`oningested`; live wiring (§E.7) consumes it. MIDI is not read and is no
	longer offered: N.58 closed on 2026-08-19 by dropping it.

	N.108 INCREMENT 2. THIS COMPONENT NO LONGER HAS A FIELD OF ITS OWN, and
	that is the whole of the change. The drawer has ONE intake now, drawn by
	`RootPanel.svelte`, and it is the surface a singer pastes into, types into,
	drops onto, and picks a file with. So the dropzone, its watermark, its
	placeholder, its format list, its scan icon and its hidden file input are
	gone from this file, and with them `browse`, `onPick`, `onDrop`,
	`onDragOver`, `onDragLeave`, `dragging`, and N.70's `acceptList`. The
	ruling in `acceptList` IS NOT SPENT: it moved with the picker it governs,
	and `RootPanel` carries it with its reasons.

	WHAT IS LEFT IS THE ENGINE AND EVERY ANSWER IT GIVES. The two converter
	lifecycles, the busy labels, the fidelity banner, and `classify`'s named
	errors render UNDER the one field, because
	`+page.svelte` renders this component inside the intake, which is where a
	question about a file the singer just dropped belongs.

	THE INTAKE HANDS FILES IN THROUGH `take()`, exported as an instance method
	and called from `+page.svelte` on the `bind:this`. It is `handleFile` with
	one thing in front of it: the staff check below.

	N.146, 2026-09-16: NOTHING ASKS WHICH KIND A PDF OR A PICTURE IS ANY MORE.
	Dann: "can we make it so that Ilya autodetects content? I want to remove
	this cognitive burden from the user and lay it on Ilya instead" and "Why
	doesn't Ilya just process whatever it can without advertising that it is
	changing tactics mid-process?" `take()` now runs `hasStaves`
	(`reader/staff-detect.ts`) on the page before anything else: staves found,
	it tries the score, exactly the path this component always took; the score
	read that follows yields no sung line, or no staves were found at all, it
	tries the poem instead, silently, the same way `handleScoreAnswer` and
	`readPdfAsPoem` always worked, just reached without a press. `askKind` and
	the question it asked (`intake.pdf.title` / `intake.picture.title`) are
	gone; `decidePoemOrScore` (`ingestion/poem-or-score.ts`) is the pure
	branch table behind the whole decision, including what happens where
	NEITHER reading answers.

	2026-10-27, ruled by Dann: THE OLD PAGE READER'S ROUTE (`?reader=ilya`) IS
	RETIRED. Its `asking` state (a picture's clef and key questions), its read
	report, and the worker behind them are gone from this file; a scan goes to
	homr (`$lib/omr/scan.ts`) and nowhere else.
-->
<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { LoaderState } from '$lib/loader';
	import { WorkerScoreReader } from '$lib/reader/score-reader';
	import { WebmscoreMsczConverter } from '$lib/reader/mscz-converter';
	import { inkPng, toGreyscalePng } from '$lib/reader/page-image';
	import { hasStaves } from '$lib/reader/staff-detect';
	import { routePdf, type PdfRoute } from '$lib/score/ingestion/first-staved-page';
	import { readScanAsScore, readingWait } from '$lib/omr/scan';
	import { restoreStoredScan, type KeptReading } from '$lib/omr/restore';
	import { formatLabelKey } from './format-label';
	import {
		ingestScoreFile,
		fidelityBanner,
		type IngestedScore,
		type IngestError,
		type IngestOutcome,
	} from './ingestion/ingest';
	import { detectScoreFormat, isHeifImage, SNIFF_LENGTH } from './ingestion/format-detection';
	import { decidePoemOrScore } from './ingestion/poem-or-score';
	import { dictionaryGuardMode, isKnownWordForGuard } from './ingestion/ocr-guard';
	import { isKnownWord } from '$lib/pipeline';
	import type { PageProvenance } from '$lib/library/types';

	interface Props {
		language: Language;
		/** The parsed score. Live wiring (§E.7) consumes this.
		 *
		 *  N.67 step 2: the FILE travels with it, because the library stores the
		 *  singer's own bytes and only this component ever holds them.
		 *
		 *  N.145, 2026-09-16: CALLED AT ONCE, no longer via a singer's press
		 *  of "Continue to analysis", which is gone. See `announceArrival`. */
		oningested: (
			ingested: IngestedScore,
			file: File,
			origin: 'upload' | 'restore',
			/** N.59 step 7: the old page reader's provenance. Always `undefined`
			 *  since that route was retired (2026-10-27); the parameter stays
			 *  because `+page.svelte`'s `handleArrival` is typed with it. */
			page?: PageProvenance,
			/** A scan homr read: the scan and its stamped reading, both kept. */
			scan?: { file: File; reading: KeptReading },
		) => void;
		/** A stored scan was read again on restore: keep the new reading. */
		onreading?: (reading: KeptReading) => void;
		/** N.67 step 2: a stored source, re-ingested at boot so a reload brings
		 *  the score back without the singer re-uploading it. The converters
		 *  live in this component (§B.2), so the re-ingest does too. */
		restore?: {
			fileName: string;
			bytes: ArrayBuffer;
			/** homr's stamped reading of a stored scan. */
			reading?: KeptReading | null;
		} | null;
		/**
		 * N.108 increment 2. THE POEM, where a PDF turned out to hold one.
		 *
		 * This component reads a PDF either way; only the destination differs, and
		 * the destination is not this component's to write. `+page.svelte` owns
		 * `doc.inputText` and every other writer of it, so the words go up the same
		 * way a score does.
		 */
		onpoem: (text: string) => void;
		/**
		 * N.146 step 2b. The SAME `loaderState` `+page.svelte` already owns and
		 * already passes to `IntakePanel` / `AnalysisStation` -- no second
		 * loader, no second load. Read only by the OCR guard
		 * (`dictionaryGuardMode`, `ingestion/ocr-guard.ts`), to hold a busy
		 * reading until the dictionary it judges against has actually loaded.
		 */
		loaderState: LoaderState;
	}

	let { language, oningested, onreading, restore = null, onpoem, loaderState }: Props = $props();

	const T = (key: string) => t(key, language);

	/* THE DROP ZONE AND ITS SENTENCE LEFT THIS FILE (N.108 increment 2), and
	   with them `dropPlaceholder`, `ACCEPT` and `acceptList`.

	   DANN'S RULING OF 2026-08-21 IS NOT REVERSED, IT IS SPENT. It said the
	   score box says one sentence and the format list sits outside it. There is
	   no score box: there is one intake, and `RootPanel.svelte` draws it. The
	   two strings that sentence was assembled from, `upload.drop.title` and
	   `upload.drop.browse`, stay in `i18n.ts` unused, as does
	   `upload.drop.acceptedNow`, because the French table is not ruled yet and a
	   ratified French string is not this ship's to delete.

	   N.70'S RULING TRAVELLED WITH THE PICKER IT GOVERNS. `RootPanel` holds the
	   two file inputs now and carries the whole reasoning: iOS matches `accept`
	   by registered type, knows none of `.musicxml`, `.mnx`, `.musx`, `.mscz`,
	   and so greys out every format Ilya reads. The attribute is kept on a fine
	   pointer and dropped on a coarse one. */

	type UiState =
		| { kind: 'idle' }
		| { kind: 'busy'; label: string; key?: string }
		/** N.145, 2026-09-16: RENAMED FROM `done`. The parse already succeeded
		 *  and `oningested` has already been called (`announceArrival`, called
		 *  right after every upload-origin `handleFile`); nothing here is
		 *  still waiting on a singer's press. What this state carries is what
		 *  stays ON SCREEN afterwards: the format line, the fidelity banner,
		 *  and a picture or PDF's read report, until the singer dismisses it
		 *  or drops another file. */
		| { kind: 'arrived'; ingested: IngestedScore; file: File; scanKind?: 'image' | 'pdf' }
		| { kind: 'error'; message: string }
		| { kind: 'soon'; message: string };

	let ui = $state<UiState>({ kind: 'idle' });
	let bannerDismissed = $state(false);

	/* ── converter lifecycles (this component owns them, §B.2) ──────── */
	let reader: WorkerScoreReader | null = null;
	const getReader = (): WorkerScoreReader => (reader ??= new WorkerScoreReader());
	let converter: WebmscoreMsczConverter | null = null;
	const getConverter = (): WebmscoreMsczConverter => (converter ??= new WebmscoreMsczConverter());
	onDestroy(() => {
		reader?.dispose();
		converter?.dispose();
	});

	/* ── Intake ─────────────────────────────────────────────────────── */

	/**
	 * THE ONE WAY IN, N.108 increment 2. `RootPanel`'s field takes the drop and
	 * the pick; `+page.svelte` calls this on the instance.
	 *
	 * N.146: A PDF OR A PICTURE NO LONGER ASKS. A picture goes to `hasStaves`
	 * (`reader/staff-detect.ts`), a PDF to `routePdf` (`ingestion/first-staved-page.ts`:
	 * staves in its first four pages, or no text layer; rows 44, 45). Reader-bound
	 * (homr, `$lib/omr/scan.ts`, every page, ingested as a dropped MusicXML file
	 * is, no clef-and-key question): homr finding no music falls through to the
	 * poem route (`readPdfAsPoem` / `readAsPoemByOcr`), as does no staves.
	 *
	 * THE SNIFF IS STILL `readableKind`, WHICH IS `detectScoreFormat`, THE
	 * SAME ONE DISPATCH USES. A file whose head cannot be read at all falls
	 * through to the score route and earns that route's own named refusal.
	 */
	export async function take(file: File): Promise<void> {
		const kind = await readableKind(file);
		if (kind === null) {
			await handleFile(file);
			announceArrival();
			return;
		}
		bannerDismissed = false;
		ui = { kind: 'busy', label: T('upload.status.reading') };
		const rasterized = await rasterizeFirstPage(file, kind);
		if ('errorMessage' in rasterized) {
			ui = { kind: 'error', message: rasterized.errorMessage };
			return;
		}
		const { ink } = rasterized;
		const route = 'route' in rasterized ? rasterized.route : null;
		const stavesFound = route ? route.to === 'reader' && route.stavesFound : true;
		if (route ? route.to === 'reader' : await hasStaves(ink)) {
			await readScanAsScore(file, kind, {
				busy: (key) => (ui = { kind: 'busy', label: '', key }),
				ingest: async (xml, reading) => {
					await handleFile(xml);
					if (ui.kind === 'arrived') ui = { ...ui, scanKind: kind };
					announceArrival({ file, reading });
				},
				poem: () => (kind === 'pdf' ? readPdfAsPoem(file, ink, stavesFound, stavesFound ? false : null) : readAsPoemByOcr(inkPng(file, ink), null, true, false)),
				fail: () => (ui = { kind: 'error', message: T('upload.err.parseFailed') }),
			});
			return;
		}
		if (kind === 'pdf') {
			await readPdfAsPoem(file, ink, false, null);
		} else {
			await readAsPoemByOcr(inkPng(file, ink), null, false, null);
		}
	}

	/**
	 * N.146 step 2b. Callers parked here by `waitForDictionaryGuard`, spent
	 * the moment `loaderState` stops meaning `'wait'` (loaded, or failed --
	 * either way there is a verdict to give). The effect below is the ONE
	 * place this component reads `loaderState`; everywhere else that decides
	 * with the dictionary reads `dictionaryGuardMode`'s result, not the raw
	 * state, the same separation `ocr-guard.ts` keeps between its pure
	 * decision and the one real dictionary it is ever run against.
	 */
	let dictionaryWaiters: Array<() => void> = [];

	$effect(() => {
		if (dictionaryGuardMode(loaderState) === 'wait') return;
		untrack(() => {
			if (dictionaryWaiters.length === 0) return;
			const waiters = dictionaryWaiters;
			dictionaryWaiters = [];
			waiters.forEach((resolve) => resolve());
		});
	});

	/**
	 * Resolves at once if the dictionary already has a verdict (loaded, or
	 * failed); otherwise resolves the moment it does. Never opens a second
	 * loader or starts a second load -- `loaderState` is `+page.svelte`'s
	 * own, handed down as a prop the same way `IntakePanel` and
	 * `AnalysisStation` already receive it.
	 */
	function waitForDictionaryGuard(): Promise<void> {
		if (dictionaryGuardMode(loaderState) !== 'wait') return Promise.resolve();
		return new Promise((resolve) => {
			dictionaryWaiters.push(resolve);
		});
	}

	/**
	 * The page's ink and, for a PDF, its route (rows 44, 45). A page that cannot
	 * be rasterized at all is refused here, in `upload.err.pdfUnreadable`,
	 * `upload.err.pdfJbig2`, `upload.err.imageHeic`, or `upload.err.imageUndecodable`.
	 */
	async function rasterizeFirstPage(
		file: File,
		kind: 'image' | 'pdf'
	): Promise<{ ink: ArrayBuffer; route?: PdfRoute } | { errorMessage: string }> {
		if (kind === 'image') {
			try {
				return { ink: await toGreyscalePng(file) };
			} catch (err) {
				console.error('[ScoreUploader] the picture could not be rasterized:', err);
				return { errorMessage: await undecodablePictureMessage(file) };
			}
		}
		const { PdfUnreadableError, PdfJbig2UndecodedError } = await import('$lib/reader/page-pdf');
		try {
			const found = await routePdf(file);
			if (!found) throw new PdfUnreadableError('this PDF has no pages');
			return found;
		} catch (err) {
			if (err instanceof PdfJbig2UndecodedError) return { errorMessage: T('upload.err.pdfJbig2') };
			if (err instanceof PdfUnreadableError) return { errorMessage: T('upload.err.pdfUnreadable') };
			console.error('[ScoreUploader] the PDF could not be rasterized:', err);
			return { errorMessage: T('upload.err.pdfUnreadable') };
		}
	}

	/**
	 * The poem route on a PDF, silent since N.146: tried where the staff
	 * check found nothing, or where it found staves but the score read that
	 * followed yielded no sung line (`stavesFound` and `sungLineFound` carry
	 * that history through to `decidePoemOrScore`, by way of
	 * `readAsPoemByOcr`, once OCR has had its own attempt).
	 *
	 * IT IS AN EXTRACTION AND NOT AN OCR, so a scanned PDF holds no text and
	 * comes back empty. That is not a fault: it falls through to
	 * `readAsPoemByOcr`, which reads the SAME ink `take()` already
	 * rasterized, the existing Russian OCR path.
	 */
	async function readPdfAsPoem(
		file: File,
		ink: ArrayBuffer,
		stavesFound: boolean,
		sungLineFound: boolean | null
	): Promise<void> {
		ui = { kind: 'busy', label: T('intake.pdf.reading') };
		let text: string;
		try {
			const { extractPdfText } = await import('$lib/reader/page-pdf');
			text = await extractPdfText(file);
		} catch (err) {
			console.error('[ScoreUploader] the PDF text could not be read:', err);
			ui = { kind: 'error', message: T('upload.err.pdfUnreadable') };
			return;
		}
		if (text.trim() !== '') {
			onpoem(text);
			reset();
			return;
		}
		await readAsPoemByOcr(inkPng(file, ink), text, stavesFound, sungLineFound);
	}

	/**
	 * N.146. The poem route's OCR half, and the FINAL word on whether this
	 * upload is a poem at all: once OCR has had its attempt, every outcome
	 * this drop could have reached is on hand, and `decidePoemOrScore`
	 * (`ingestion/poem-or-score.ts`) says what they add up to -- including,
	 * N.146 step 2, `ocr-guard.ts`'s judgment of the OCR text itself, which
	 * refuses one that is mostly not Russian words. N.146 step 2b: that
	 * judgment waits for `loaderState` to say the dictionary has a verdict
	 * (loaded, or failed) before it runs at all (`waitForDictionaryGuard`).
	 *
	 * Shared by a picture, which never had a text layer to try (`textLayer`
	 * is `null`), and a PDF whose text layer came back empty (`textLayer` is
	 * `''`, passed on by `readPdfAsPoem` above) -- a distinction
	 * `decidePoemOrScore` does not need, since the two decide the same way,
	 * but kept here so the type stays honest about which file actually had a
	 * text layer to check.
	 *
	 * THIS IS THE CAMERA ICON'S OWN CODE, MOVED, NOT REWRITTEN, for the OCR
	 * step itself. It was `handleOcrFile` in `RootPanel.svelte`: the same
	 * dynamic `tesseract.js` import, the same `rus` worker, the same
	 * `terminate`, and the same two failure messages in both languages, which
	 * were English and French literals there and are English and French
	 * literals here. N.146 is what decides whether it runs at all and what an
	 * empty answer from it now means; the recognition itself is unchanged.
	 */
	async function readAsPoemByOcr(
		file: File,
		textLayer: string | null,
		stavesFound: boolean,
		sungLineFound: boolean | null
	): Promise<void> {
		ui = { kind: 'busy', label: T('intake.picture.reading') };
		let ocrText = '';
		try {
			const { createWorker } = await import('tesseract.js');
			const worker = await createWorker('rus');
			const { data: { text } } = await worker.recognize(file);
			await worker.terminate();
			ocrText = text;
		} catch (err) {
			console.error('[ScoreUploader] the picture could not be recognised:', err);
			ui = {
				kind: 'error',
				message: language === 'en'
					? 'OCR processing failed.'
					: 'Échec du traitement OCR.',
			};
			return;
		}
		// N.146 step 2b. The guard must not judge `ocrText` against a
		// dictionary that has not loaded (empty `ocrText` skips the wait: it
		// reaches `unreadable` on its own, `decidePoemOrScore`'s empty check,
		// with no guard verdict to wait for). `ui` is untouched here -- the
		// busy label above keeps showing until there is a real verdict.
		if (ocrText.trim() !== '') {
			await waitForDictionaryGuard();
		}
		const mode = dictionaryGuardMode(loaderState);
		const result = decidePoemOrScore(
			{ stavesFound, sungLineFound, textLayer, ocrText },
			isKnownWordForGuard(mode, isKnownWord)
		);
		if (result.kind === 'poem') {
			onpoem(result.text);
			reset();
			return;
		}
		// BOTH READINGS FAILED (N.146): no sung line worth showing (or no
		// staves at all), no text layer, and OCR found nothing the guard
		// accepts. Ruled 2026-09-24: one honest refusal for all of it, the
		// guard's included, since "no text" was false where OCR found text
		// the guard refused.
		ui = { kind: 'error', message: T('upload.err.pictureUnclear') };
	}

	/**
	 * The refusal for a picture this browser could not decode: HEIC and
	 * HEIF get their own (ruled 2026-09-24), every other picture keeps
	 * `upload.err.imageUndecodable`.
	 */
	async function undecodablePictureMessage(file: File): Promise<string> {
		const head = new Uint8Array(await file.slice(0, SNIFF_LENGTH).arrayBuffer());
		return T(isHeifImage(head) ? 'upload.err.imageHeic' : 'upload.err.imageUndecodable');
	}

	async function readableKind(file: File): Promise<'image' | 'pdf' | null> {
		const head = new Uint8Array(await file.slice(0, SNIFF_LENGTH).arrayBuffer());
		const detected = detectScoreFormat(file.name, head);
		if (!detected.ok) return null;
		if (detected.format === 'image') return 'image';
		if (detected.format === 'pdf') return 'pdf';
		return null;
	}

	/**
	 * A file that is not a picture or a PDF, dispatched by `ingestScoreFile`:
	 * MusicXML, MNX, `.mxl`, `.musx`, `.mscz`. A scan never reaches this function:
	 * `take()` sends it to homr, which hands back MusicXML, and that is what
	 * arrives here.
	 */
	async function handleFile(file: File): Promise<void> {
		bannerDismissed = false;
		// A .musx or .mscz routes through conversion; name the wait honestly.
		const isMusx = /\.musx$/i.test(file.name);
		const isMscz = /\.mscz$/i.test(file.name);
		// Start the matching converter's warm-up (module import + asset
		// prefetch) while the bytes are read and the container pre-check runs.
		// N.26: the denigma reader is warmed on a real .musx only, the same way
		// the webmscore converter always has been, so a MusicXML or .mxl drop no
		// longer pulls a WASM artifact it cannot use.
		if (isMusx) getReader();
		if (isMscz) getConverter();
		ui = {
			kind: 'busy',
			label: isMusx
				? T('upload.status.converting')
				: isMscz
					? T('upload.status.convertingMscz')
					: T('upload.status.reading'),
		};

		let outcome: IngestOutcome;
		try {
			outcome = await ingestScoreFile(file, {
				// Both constructed inside their closures, so only a real .musx
				// and a real .mscz pay their converter's warm-up (N.26).
				scoreReader: {
					convert: (f: File) => getReader().convert(f),
					dispose: () => reader?.dispose(),
				},
				msczConvert: (bytes, name) => getConverter().convert(bytes, name),
			});
		} catch (err) {
			console.error('[ScoreUploader] unexpected ingest failure:', err);
			ui = { kind: 'error', message: T('upload.err.parseFailed') };
			return;
		}

		if (outcome.ok) {
			ui = { kind: 'arrived', ingested: outcome.ingested, file };
			return;
		}
		const c = classify(outcome.error, isMscz);
		ui = c.soon ? { kind: 'soon', message: c.message } : { kind: 'error', message: c.message };
	}

	/**
	 * N.145, 2026-09-16, RULED BY DANN: option 2, instant for every file. A
	 * parse's own success used to leave the score waiting at `done` for a
	 * singer's press; `handleFile` now lands it at `arrived` instead, and
	 * every UPLOAD-origin caller of `handleFile` calls this right after, so
	 * the page draws the score with no press in between.
	 *
	 * THE RESTORE PATH DOES NOT CALL THIS, ON PURPOSE. `onMount` below calls
	 * `oningested` itself, with origin `'restore'`, and still resets to
	 * `idle` afterwards exactly as it always has: a reload silently brings
	 * the score back, and this file's `arrived` summary is not shown for it.
	 * Calling this here too would fire `oningested` a second time and with
	 * the wrong origin, which is why the origin is not a parameter: this
	 * function is upload-only by construction, matching what `accept()` used
	 * to do before this ship, minus the `reset()` its explicit press earned
	 * and this instant arrival does not.
	 */
	function announceArrival(scan?: { file: File; reading: KeptReading }): void {
		if (ui.kind !== 'arrived') return;
		oningested(ui.ingested, ui.file, 'upload', undefined, scan);
	}
	/**
	 * N.67 step 2. A song with a stored source re-ingests it on boot.
	 *
	 * No "Continue to analysis" step: the singer accepted this file already,
	 * and asking twice for the same score would be the tool forgetting. The
	 * busy label still shows, because a `.musx` really does take a conversion.
	 */
	onMount(async () => {
		if (!restore) return;
		const file = new File([restore.bytes], restore.fileName);
		const kind = await readableKind(file);
		if (kind !== null) {
			// A stored scan is read by homr.
			await restoreStoredScan(file, kind, restore.reading, {
				busy: (key) => (ui = { kind: 'busy', label: '', key }),
				ingest: async (xml) => (await handleFile(xml), ui.kind === 'arrived'),
				fail: () => (ui = { kind: 'error', message: T('upload.err.parseFailed') }),
				keep: (reading) => onreading?.(reading),
			});
		} else {
			// A stored score file (MusicXML, .mxl, .musx, .mscz) is re-ingested here;
			// a stored scan went to homr above.
			await handleFile(file);
		}
		// N.145 RENAMED 'done' TO 'arrived'; NOTHING ELSE HERE CHANGED. This
		// path calls `oningested` itself, with origin 'restore', and resets
		// to `idle` exactly as it always has, unlike an upload's
		// `announceArrival`, which this path does not call.
		if (ui.kind === 'arrived') {
			// 'restore', not 'upload': these bytes CAME from the vault, and
			// writing them back would be the tool rewriting what it just read.
			oningested(ui.ingested, ui.file, 'restore');
			reset();
		}
		// A stored source that no longer parses leaves its own error on screen,
		// which is the honest outcome: the song is still there, the score is not.
	});

	function reset(): void {
		ui = { kind: 'idle' };
		bannerDismissed = false;
	}

	/* ── Presentation mappings ──────────────────────────────────────── */

	/** Map a typed ingest error to user copy, and flag the "coming soon" cases
	 *  so they render as a calm note rather than an error. CONVERSION_FAILED
	 *  and WASM_LOAD_FAILED are shared between the denigma (.musx) and
	 *  webmscore (.mscz) paths, so the dropped file's kind picks the copy. */
	function classify(err: IngestError, isMscz = false): { soon: boolean; message: string } {
		switch (err.code) {
			case 'DETECTION_FAILED': {
				const f = err.failure;
				switch (f.kind) {
					case 'pre-2014-finale':
						return { soon: false, message: T('upload.err.mus') };
					case 'midi':
						return { soon: false, message: T('upload.err.midi') };
					case 'json-not-mnx':
						return { soon: false, message: T('upload.err.jsonNotMnx') };
					case 'xml-not-musicxml': {
						const base = T('upload.err.xmlNotMusicxml');
						return {
							soon: false,
							message: f.rootElement
								? `${base} ${T('upload.err.xmlRootIs').replace('%s', f.rootElement)}`
								: base,
						};
					}
					case 'zip-unrecognised':
						return { soon: false, message: T('upload.err.zipUnrecognised') };
					default:
						return { soon: false, message: T('upload.err.unrecognised') };
				}
			}
			case 'CONTAINER_UNREADABLE':
				return {
					soon: false,
					message: T(err.container === 'mxl' ? 'upload.err.mxlUnreadable' : 'upload.err.msczUnreadable'),
				};
			case 'MXL_NO_ROOTFILE':
				return { soon: false, message: T('upload.err.mxlNoRootfile') };
			case 'INVALID_MNX_JSON':
				return { soon: false, message: T('upload.err.invalidMnxJson') };
			case 'PARSE_FAILED':
				return { soon: false, message: T('upload.err.parseFailed') };
			case 'MSCZ_CONVERTER_UNAVAILABLE':
				return { soon: true, message: T('upload.soon.mscz') };
			case 'PAGE_READER_UNAVAILABLE':
				return { soon: false, message: T('upload.err.readerLoadFailed') };
			case 'CONVERSION_FAILED':
				return {
					soon: false,
					message: T(isMscz ? 'upload.err.msczConversionFailed' : 'upload.err.conversionFailed'),
				};
			case 'WASM_LOAD_FAILED':
				return {
					soon: false,
					message: T(isMscz ? 'upload.err.msczWasmLoadFailed' : 'upload.err.wasmLoadFailed'),
				};
			case 'SCORE_TOO_LARGE_FOR_DEVICE':
				return {
					soon: false,
					message: `${T('upload.err.tooLarge')}${err.suggestedAction ? ` ${err.suggestedAction}` : ''}`,
				};
			default:
				return { soon: false, message: T('upload.err.unrecognised') };
		}
	}

	const bannerTier = $derived(
		ui.kind === 'arrived' && !bannerDismissed ? fidelityBanner(ui.ingested.provenance) : null
	);
	const showBanner = $derived(bannerTier !== null);
</script>

<div class="uploader">
	<!-- THE IDLE BRANCH IS EMPTY (N.108 increment 2), and that is the shape of
	     the change rather than a hole in it. This component drew the score
	     intake; the drawer has one intake now and `RootPanel` draws it. What
	     stood here was the dropzone with its watermark and one placeholder
	     sentence, the scan icon, the format list, and the hidden file input.
	     Every one of them has a successor in `RootPanel`'s field, and the two
	     rulings they carried are recorded at the top of this file.

	     SO THIS COMPONENT RENDERS NOTHING UNTIL A FILE ARRIVES, and everything
	     it renders after that is an answer about that file: the clef and key
	     question (N.146: the only question left), the wait, the read report,
	     the refusals. It
	     is mounted inside the intake, so every one of them appears where the
	     file landed. -->
	{#if ui.kind === 'busy'}
		<div class="status">
			<span class="spinner"></span>
			<span class="status-label">{ui.key ? (readingWait.line(language) ?? T(ui.key)) : ui.label}</span>
		</div>
	{:else if ui.kind === 'arrived'}
		<!-- N.145, 2026-09-16. THE SCORE HAS ALREADY ARRIVED: `announceArrival`
		     (or, for a restore, `onMount`) has already called `oningested`.
		     Nothing below is a question; it is what stays on screen about the
		     file that just landed, until the singer dismisses it or drops
		     another. Try another file and Continue to analysis are gone: the
		     receipt's Clear and Replace already do the first job, and there is
		     nothing left to continue to. -->
		<div class="result">
			<p class="format-label">{T(formatLabelKey(ui.ingested.provenance, ui.ingested.result.score.source.origin, ui.scanKind))}</p>
			{#if showBanner}
				<div class="banner">
					<p class="banner-text">
						{T('upload.banner.denigma')}
					</p>
					<button type="button" class="banner-dismiss" onclick={() => (bannerDismissed = true)}>
						{T('upload.banner.dismiss')}
					</button>
				</div>
			{/if}
		</div>
	{:else if ui.kind === 'soon'}
		<div class="note">
			<p class="note-text">{ui.message}</p>
			<button type="button" class="btn-secondary" onclick={reset}>{T('upload.tryAnother')}</button>
		</div>
	{:else if ui.kind === 'error'}
		<div class="error">
			<p class="error-text">{ui.message}</p>
			<button type="button" class="btn-secondary" onclick={reset}>{T('upload.tryAnother')}</button>
		</div>
	{/if}

	<!-- THE HIDDEN FILE INPUT LEFT WITH THE DROPZONE (N.108 increment 2). One
	     intake means one picker, and `RootPanel` holds it, along with the
	     `accept` rule N.70 wrote for it. -->

	<!-- THE OLDER-FINALE DISCLOSURE IS GONE. Dann's ruling, 2026-08-20 on his
	     walk: "Let's eliminate the 'have an older Finale file' subsection. It
	     is useless. That will let the button row beneath it snug up to the
	     input like the buttons and input field above it."

	     IT WAS REDUNDANT, WHICH IS WHY THIS IS NOT A LOSS. Dropping a `.mus`
	     file already returns `upload.err.mus`, which carries the same two
	     live options: resave as `.musx` in Finale 2014 or later, or export to
	     MusicXML. Its third option was "print to PDF and upload the PDF (PDF
	     import is coming soon)", and PDF import has since shipped, so PDF is
	     named in the drop zone's own sentence. That path is untouched:
	     `format-detection.ts` still returns `pre-2014-finale` for a `.mus`
	     and `:421` above still renders `upload.err.mus`.

	     The trial-version line is the only sentence with no other home, and
	     it went with the block rather than being rehoused unasked. -->
</div>

<style>
	.uploader {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		/* Match the Transcription textarea-wrapper's 8px top margin, so the
		   input box sits the same 14px below the metadata on both tabs. */
		margin-top: 8px;
		font-family: var(--font-sans);
	}

	/* ── THE DROPZONE'S RULES LEFT WITH IT (N.108 increment 2) ──
	   `.dropzone`, `.dropzone:hover`, `.dropzone.dragging`, `.dz-wrap`,
	   `.dz-formats`, `.dz-placeholder`, `.scan-btn` and `.scan-btn:hover` are
	   deleted with the markup they dressed. Svelte scopes a rule to the file
	   that writes the markup, and the markup is `RootPanel`'s field now.

	   THREE OF DANN'S RULINGS WERE DECLARED IN THEM, and here is where each
	   went:
	   - The placeholder top left, at the field size, in the textarea's exact
	     treatment (2026-08-20 and 2026-08-21, asked four times): the one field
	     IS the textarea, so the treatment is the textarea's by construction and
	     no second box has to be made to look like it.
	   - Three quarters of 152px (2026-08-20): there is no second box to size.
	     The one field keeps `.text-input`'s own `calc(6.75em + 13.5px)`, which
	     is the same ruling applied to the field that survived.
	   - Lavender names the score intake and sage names the text intake
	     (2026-07-13, ratified since): SPENT, not reversed. Hue names place, and
	     there is one place. The one field takes the neutral dashed frame Design
	     drew for it in the r2 prototype at `:190`; the memo says so and it is
	     Dann's to rule on the walk.

	/* ── Busy status ──────────────────────────────────────── */

	.status {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 132px;
		justify-content: center;
	}

	.status-label {
		font-size: 0.85rem;
		color: var(--ink-secondary);
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid var(--stone-300);
		border-top-color: var(--sage);
		border-radius: 50%;
		animation: uploader-spin 0.8s linear infinite;
	}

	@keyframes uploader-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ── Result ───────────────────────────────────────────── */

	.result {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.format-label {
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}

	.banner {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.6rem 0.7rem;
		border-left: 3px solid #7c6bb0; /* lavender, denigma tier (Round 9 Item 1) */
		background: rgba(124, 107, 176, 0.08);
		border-radius: 3px;
	}

	.banner-text {
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--ink-secondary);
	}

	.banner-dismiss {
		align-self: flex-end;
		font-size: 0.72rem;
		color: var(--ink-tertiary);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.banner-dismiss:hover {
		color: var(--ink-secondary);
	}

	/* ── Note (coming soon) and error ─────────────────────── */

	.note,
	.error {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
		padding: 0.7rem;
		border-radius: 4px;
	}

	.note {
		background: rgba(0, 0, 0, 0.03);
	}

	.note-text {
		font-size: 0.8rem;
		color: var(--ink-secondary);
	}

	.error {
		background: rgba(217, 119, 6, 0.06);
	}

	.error-text {
		font-size: 0.8rem;
		color: #b45309;
		line-height: 1.4;
	}

	/* ── Buttons ──────────────────────────────────────────── */

	/* PILL ENDS, N.108 increment 4. Ruled by Dann 2026-09-03 from the
	   calibration ritual's own two buttons (`CalibrationWizard.svelte`'s
	   `.wizard-primary` and `.wizard-secondary`, `border-radius: 999px`):
	   "The buttons shown here can form the template. Can we make other
	   buttons share its rounded ends?" Only the corners move; the fill, the
	   border, the type and the padding are untouched.

	   The one button this component draws, in its refusals. */
	.btn-secondary {
		padding: 0.4rem 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		border-radius: 999px;
		cursor: pointer;
		border: none;
		transition: opacity 0.12s;
	}

	.btn-secondary {
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-300);
	}

	.btn-secondary:hover {
		opacity: 0.85;
	}

	/* The older-Finale guidance's six rules went with its markup, Dann's
	   ruling 2026-08-20. Its `.mus-help` also carried the drop zone's only
	   `border-top: 1px solid var(--stone-300)`, which is the line that stood
	   between the score box and the Output row. */
</style>
