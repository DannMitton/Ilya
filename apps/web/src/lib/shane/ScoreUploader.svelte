<!--
	ScoreUploader — the Fit ingest widget (Round 9 §2 Items 1, 2, 6; handover
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
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import IntakeWatermark from '$lib/components/Drawer/IntakeWatermark.svelte';
	import { WorkerScoreReader } from './engine/score-reader';
	import { WebmscoreMsczConverter } from './engine/mscz-converter';
	import { WorkerPageReader } from './engine/page-reader';
	import { ImageUndecodableError, pieceIdFor, toGreyscalePng } from './engine/page-image';
	import {
		ingestScoreFile,
		fidelityBanner,
		type IngestedScore,
		type IngestError,
		type IngestOutcome,
		type IngestProvenance,
		type PageRead,
	} from './ingestion/ingest';
	import { detectScoreFormat, SNIFF_LENGTH } from './ingestion/format-detection';
	import type { EngravingAnswers } from './ingestion/recognized-to-musicxml';
	import type { ReadReport } from './ingestion/recognized';
	import type { PageProvenance } from '$lib/library/types';

	interface Props {
		language: Language;
		/** The parsed score, accepted by the user via "Continue to analysis".
		 *  Live wiring (§E.7) consumes this.
		 *
		 *  N.67 step 2: the FILE travels with it, because the library stores the
		 *  singer's own bytes and only this component ever holds them. */
		oningested: (
			ingested: IngestedScore,
			file: File,
			origin: 'upload' | 'restore',
			/** N.59 step 7: present only on the reader route. `file` is then the
			 *  GREYSCALE INK, not the picture the singer supplied, because the ink
			 *  is what the retention ruling stores and what a re-read reproduces. */
			page?: PageProvenance,
		) => void;
		/** N.67 step 2: a stored source, re-ingested at boot so a reload brings
		 *  the score back without the singer re-uploading it. The converters
		 *  live in this component (§B.2), so the re-ingest does too. */
		restore?: {
			fileName: string;
			bytes: ArrayBuffer;
			/** N.59 step 7: the clef and key this page was read with, so a
			 *  restore never asks the two questions again. */
			answers?: EngravingAnswers | null;
		} | null;
		/** N.70: threaded so the accept list can be dropped on a phone. Same
		 *  `isMobile` N.69 already threads to the Paper components. */
		isMobile?: boolean;
	}

	let { language, oningested, restore = null, isMobile = false }: Props = $props();

	const T = (key: string) => t(key, language);

	/* THE SCORE BOX SAYS ONE SENTENCE. RULED BY DANN 2026-08-21 walking
	   `2238e8b`: "I would like the text inside the score input field to
	   include only that first sentence 'Drop a score here or click to
	   browse...' with an ellipsis just like its sister box above. The text
	   'MNX, MusicXML, etc..' can exist outside the input field just
	   underneath it."

	   ASSEMBLED FROM THE TWO RETAINED KEYS, NOT WRITTEN. `upload.drop.title`
	   and `upload.drop.browse` already carry the two halves in both
	   languages. They were orphaned when the three-paragraph version was
	   collapsed into one string and were kept as its provenance; this is
	   them back on screen. No new English and NO NEW FRENCH: contract §6,
	   do not write French Dann has not seen.

	   JOINED AT THE RENDER SEAM rather than folded into a new key, because
	   a new key would be these same two strings with a space and an
	   ellipsis, and a third copy of a sentence the file already holds twice
	   is a thing to keep in step by hand.

	   THE ELLIPSIS IS `\u2026`, THE CHARACTER ITS SISTER ALREADY USES at
	   `i18n.ts`'s `input.placeholder`, `Paste Russian text here\u2026`. */
	const dropPlaceholder = $derived(
		`${T('upload.drop.title')} ${T('upload.drop.browse')}\u2026`
	);

	/** The file dialog offers the formats Ilya reads, so it matches the
	 *  dropzone text. */
	const ACCEPT = '.mnx,.json,.xml,.musicxml,.mxl,.musx,.mscz,.pdf,image/*';

	/**
	 * N.70 (Dann's ruling, 2026-08-16). THE FILTER IS KEPT WHERE IT HELPS AND
	 * DROPPED WHERE IT ONLY BLOCKS.
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
	 * Nothing is loosened about what Ilya ACCEPTS: `ingestScoreFile` sniffs the
	 * bytes and `classify` already answers for anything else. This only changes
	 * which files the picker will let a singer point at.
	 *
	 * NAMED CONSEQUENCE: `isMobile` is a WIDTH test, not an iOS test, so a
	 * narrow desktop window also gets the unfiltered picker. Accepted rather
	 * than inventing a second detector.
	 */
	const acceptList = $derived(isMobile ? undefined : ACCEPT);

	type UiState =
		| { kind: 'idle' }
		/** N.59, Ruling A: a picture waits here while the singer answers. */
		| { kind: 'asking'; file: File }
		| { kind: 'busy'; label: string }
		| { kind: 'done'; ingested: IngestedScore; file: File }
		| { kind: 'error'; message: string }
		| { kind: 'soon'; message: string };

	let ui = $state<UiState>({ kind: 'idle' });
	let dragging = $state(false);
	let bannerDismissed = $state(false);
	let fileInputEl: HTMLInputElement;

	/* ── converter lifecycles (this component owns them, §B.2) ──────── */
	let reader: WorkerScoreReader | null = null;
	const getReader = (): WorkerScoreReader => (reader ??= new WorkerScoreReader());
	let converter: WebmscoreMsczConverter | null = null;
	const getConverter = (): WebmscoreMsczConverter => (converter ??= new WebmscoreMsczConverter());
	/** N.59, Ruling E: constructed on the first real picture, per N.26's law
	 *  that a drop of one kind never pays for another's warm-up. Pyodide plus
	 *  numpy, opencv-python, and matplotlib is the heaviest warm-up in the app. */
	let pageReader: WorkerPageReader | null = null;
	const getPageReader = (): WorkerPageReader => (pageReader ??= new WorkerPageReader());
	onDestroy(() => {
		reader?.dispose();
		converter?.dispose();
		pageReader?.dispose();
	});

	/* ── N.59: the singer's two answers (Ruling A) ──────────────────── */

	/** Defaults per Ruling A: treble, no sharps or flats, no octave change. */
	const CLEF_CHOICES: { key: string; clef: { sign: string; line: number }; octaveChange: number }[] = [
		{ key: 'upload.ask.clefTreble', clef: { sign: 'G', line: 2 }, octaveChange: 0 },
		{ key: 'upload.ask.clefTrebleOttava', clef: { sign: 'G', line: 2 }, octaveChange: -1 },
		{ key: 'upload.ask.clefBass', clef: { sign: 'F', line: 4 }, octaveChange: 0 },
	];
	let clefChoice = $state(0);
	let fifths = $state(0);

	/** -7 through 7, flats first, so the list reads the way a circle of fifths does. */
	const FIFTHS_CHOICES = Array.from({ length: 15 }, (_, i) => i - 7);
	function fifthsLabel(n: number): string {
		if (n === 0) return T('upload.ask.keyNone');
		if (n === 1) return T('upload.ask.keySharp');
		if (n === -1) return T('upload.ask.keyFlat');
		return n > 0
			? T('upload.ask.keySharps').replace('%s', String(n))
			: T('upload.ask.keyFlats').replace('%s', String(-n));
	}
	const answers = $derived<EngravingAnswers>({
		clef: CLEF_CHOICES[clefChoice].clef,
		octaveChange: CLEF_CHOICES[clefChoice].octaveChange,
		fifths,
	});

	/* ── Intake ─────────────────────────────────────────────────────── */

	function browse(): void {
		fileInputEl?.click();
	}

	async function onPick(e: Event): Promise<void> {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = ''; // reset so the same file can be re-selected
		if (file) await handleFile(file);
	}

	function onDrop(e: DragEvent): void {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) void handleFile(file);
	}

	function onDragOver(e: DragEvent): void {
		e.preventDefault();
		dragging = true;
	}

	function onDragLeave(): void {
		dragging = false;
	}

	/** Is this a page the reader can read? Sniffed by bytes, as dispatch will. */
	async function isPicture(file: File): Promise<boolean> {
		return (await readableKind(file)) !== null;
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
	 * N.59, Ruling A. A picture stops here and asks its two questions BEFORE
	 * the read, because the reader detects neither clef nor key and E.43
	 * measured the cost of wrong values at 38% against 73%. A restored page
	 * does not ask again: its answers came back with it.
	 */
	async function handleFile(file: File, storedAnswers?: EngravingAnswers): Promise<void> {
		bannerDismissed = false;
		if (!storedAnswers && (await isPicture(file))) {
			ui = { kind: 'asking', file };
			return;
		}
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
		const picture = !!storedAnswers || (await isPicture(file));
		if (picture) getPageReader();
		ui = {
			kind: 'busy',
			label: isMusx
				? T('upload.status.converting')
				: isMscz
					? T('upload.status.convertingMscz')
					: picture
						? WorkerPageReader.hasLoadedBefore
							? T('upload.status.readingPage')
							: T('upload.status.preparingReader')
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
				readPages: readPages,
				engravingAnswers: storedAnswers ?? answers,
			});
		} catch (err) {
			console.error('[ScoreUploader] unexpected ingest failure:', err);
			ui = { kind: 'error', message: T('upload.err.parseFailed') };
			return;
		}

		if (outcome.ok) {
			ui = { kind: 'done', ingested: outcome.ingested, file };
			return;
		}
		const c = classify(outcome.error, isMscz);
		ui = c.soon ? { kind: 'soon', message: c.message } : { kind: 'error', message: c.message };
	}

	/**
	 * The page-reader seam handed to dispatch. Greyscale conversion happens
	 * here, once, and the SAME bytes are what step 7 stores, so a restored page
	 * re-reads to the same answer rather than an approximate one.
	 */
	async function readPages(file: File, forAnswers: EngravingAnswers): Promise<PageRead> {
		const kind = await readableKind(file);
		let inks: ArrayBuffer[];
		try {
			if (kind === 'pdf') {
				// Dynamic import: pdf.js is 644 KB gzipped and nobody who has not
				// dropped a PDF ever pays for it (N.26's law, and the same shape as
				// denigma and webmscore above).
				const { rasterizePdf } = await import('./engine/page-pdf');
				inks = await rasterizePdf(file);
			} else {
				inks = [await toGreyscalePng(file)];
			}
		} catch (e) {
			if (e instanceof ImageUndecodableError) throw { code: 'IMAGE_UNDECODABLE', message: e.message };
			if (typeof e === 'object' && e !== null && 'code' in e) throw e;
			throw e;
		}
		// A PDF is STORED BYTE FOR BYTE, not as its rasters, which is Dann's own
		// ruled precedent for `.musx`: storing the conversion would freeze the
		// song at today's rasterizer. A photograph has no such original to keep,
		// so its ink is both what is read and what is stored.
		lastInk = kind === 'pdf' ? await file.arrayBuffer() : inks[0].slice(0);
		// The original's hash is BEST EFFORT and the ink is not: `crypto.subtle`
		// is absent outside a secure context, and losing it must cost a recorded
		// provenance line, never the singer's page.
		let originalHash = '';
		try {
			const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
			originalHash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
		} catch (err) {
			console.error('[ScoreUploader] page kept, but the original could not be hashed:', err);
		}
		lastKind = kind;
		lastPage = {
			clef: forAnswers.clef,
			octaveChange: forAnswers.octaveChange,
			fifths: forAnswers.fifths,
			originalName: file.name,
			originalHash,
			staffSpace: [],
		};
		return getPageReader().read(inks, {
			clef: [forAnswers.clef.sign, forAnswers.clef.line],
			key: forAnswers.fifths,
			octaveChange: forAnswers.octaveChange,
			pieceId: await pieceIdFor(file),
		});
	}

	/**
	 * N.59 step 7. The greyscale ink of the last picture read, and the answers
	 * it was read with, so the owner can store them and restore without asking
	 * again. Held here because this component is the only one that ever sees
	 * the singer's bytes, which is why N.67 step 2 put the restore here too.
	 */
	let lastInk: ArrayBuffer | null = null;
	let lastPage: PageProvenance | null = null;
	let lastKind: 'image' | 'pdf' | null = null;

	/** The singer pressed "Read this page". */
	async function readAsked(): Promise<void> {
		if (ui.kind !== 'asking') return;
		await handleFile(ui.file, answers);
	}

	function accept(): void {
		if (ui.kind !== 'done') return;
		const page = pageFor(ui.ingested);
		oningested(ui.ingested, page ? inkFile(ui.file) : ui.file, 'upload', page ?? undefined);
		reset();
	}

	/** The page provenance for a reader arrival, with the measured spacing filled in. */
	function pageFor(ingested: IngestedScore): PageProvenance | null {
		if (ingested.provenance.via !== 'reader' || !lastPage) return null;
		return { ...lastPage, staffSpace: ingested.readReport?.staffSpace ?? [] };
	}

	/**
	 * What the owner stores. For a photograph that is the greyscale ink, because
	 * there is no better original to keep. For a PDF it is the PDF itself, kept
	 * under its own name and type.
	 */
	function inkFile(original: File): File {
		if (lastKind === 'pdf') {
			return new File([lastInk ?? new ArrayBuffer(0)], original.name, { type: 'application/pdf' });
		}
		const stem = original.name.replace(/\.[^.]+$/, '') || 'page';
		return new File([lastInk ?? new ArrayBuffer(0)], `${stem}.png`, { type: 'image/png' });
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
		// N.59 step 7: a stored picture carries its own answers, so restoring
		// never re-asks. Re-asking on every reload is the tool forgetting, which
		// is the same principle N.67 step 2's restore already states.
		await handleFile(file, restore.answers ?? undefined);
		if (ui.kind === 'done') {
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
		dragging = false;
		bannerDismissed = false;
	}

	/* ── Presentation mappings ──────────────────────────────────────── */

	function formatLabel(p: IngestProvenance): string {
		if (p.via === 'direct') {
			return p.format === 'mnx' ? T('upload.format.mnxDirect') : T('upload.format.musicxmlDirect');
		}
		if (p.via === 'mxl') return T('upload.format.mxl');
		if (p.via === 'denigma') return T('upload.format.musxDenigma');
		if (p.via === 'reader') {
			return T(p.sourceFormat === 'pdf' ? 'upload.format.pdfReader' : 'upload.format.imageReader');
		}
		return T('upload.format.msczWebmscore'); // via === 'webmscore'
	}

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
			case 'PAGE_READER_LOAD_FAILED':
				return { soon: false, message: T('upload.err.readerLoadFailed') };
			case 'PAGE_READ_FAILED':
				return { soon: false, message: T('upload.err.pageReadFailed') };
			case 'IMAGE_UNDECODABLE':
				return { soon: false, message: T('upload.err.imageUndecodable') };
			case 'PDF_UNREADABLE':
				return { soon: false, message: T('upload.err.pdfUnreadable') };
			case 'PDF_JBIG2_UNDECODED':
				return { soon: false, message: T('upload.err.pdfJbig2') };
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
		ui.kind === 'done' && !bannerDismissed ? fidelityBanner(ui.ingested.provenance) : null
	);
	const showBanner = $derived(bannerTier !== null);
	const readReport = $derived<ReadReport | null>(
		ui.kind === 'done' ? (ui.ingested.readReport ?? null) : null
	);
	const measureList = (subs: { measureIndex: number; count: number }[]): string =>
		subs.map((x) => x.measureIndex + 1).join(', ');
	const subTotal = (subs: { measureIndex: number; count: number }[]): number =>
		subs.reduce((n, x) => n + x.count, 0);
</script>

<div class="uploader">
	{#if ui.kind === 'idle'}
		<div class="dz-wrap">
			<button
				type="button"
				class="dropzone"
				class:dragging
				onclick={browse}
				ondragover={onDragOver}
				ondragleave={onDragLeave}
				ondrop={onDrop}
			>
				<!-- THE SCORE WATERMARK (N.65). This branch IS the empty state:
				     the drop zone only renders while `ui.kind === 'idle'`, so
				     the mark leaves when a score arrives and returns on reset,
				     with no predicate of its own. It stays through `dragging`,
				     because a field being dragged over is still empty.
				     BEHIND the placeholder below by stacking: it takes
				     `z-index: 1` and this takes the default, so the mark paints
				     over the white fill and under the words. -->
				<IntakeWatermark word={T('upload.watermark')} colour="var(--light-lavender)" />
				<!-- ONE PLACEHOLDER, IN THE TEXTAREA'S EXACT TREATMENT. RULED
				     by Dann 2026-08-20 on his walk of `3c498aa`, and it is the
				     fourth time he asked for these two fields to look like each
				     other. THE PAIR IS THIS BOX AND THE TEXTAREA, side by side
				     in Source; the metadata fields were never it.

				     This was three stacked <p>s in three treatments, centred:
				     `dz-title` bold and dark at 0.9rem, `dz-browse` at 0.8rem,
				     and `dz-accepted` at 0.68rem. The textarea shows one quiet
				     sans line, top left, at the field size, in
				     `--ink-tertiary`, roman, 400. That is what this is now.

				     The drag state keeps its own sentence, in the same one
				     treatment. It is live feedback rather than a placeholder,
				     and nothing about the ruling asked for it to go. -->
				<p class="dz-placeholder">
					{dragging ? T('upload.drop.release') : dropPlaceholder}
				</p>
			</button>
			<!-- Score-from-image scan, mirroring the Transcription OCR icon.
			     Visual only until the OMR/image path ships (Round 9); the
			     tooltip marks it coming soon, and it takes no action yet. -->
			<button
				type="button"
				class="scan-btn"
				title={T('upload.scanTooltip')}
				aria-label={T('upload.scanTooltip')}
				onclick={browse}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
					<path d="M2 7V2h5" />
					<path d="M17 2h5v5" />
					<path d="M22 17v5h-5" />
					<path d="M7 22H2v-5" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</button>
			<!-- THE FORMAT LIST, OUTSIDE THE BOX. §B.7, the other half of Dann's
			     ruling: "The text 'MNX, MusicXML, etc..' can exist outside the
			     input field just underneath it." A line of its own, between the
			     box and the action row that follows the uploader in SOURCE.

			     `upload.drop.acceptedNow` VERBATIM, in both languages. N.65,
			     Dann's ruling of 2026-08-21 dropped the string's `Accepted
			     now:` / `Acceptés maintenant :` lead-in, so this line is now a
			     bare list of formats rather than a sentence: "I think it's
			     understood that the file names are the acceptable formats." His
			     reason is the French, which wrapped to two lines with the
			     lead-in and displaced everything under it.

			     IT ENDS WITHOUT A FULL STOP, and that follows from the same
			     ruling rather than being left over from ship B: a list with no
			     lead-in is not a sentence. The « ou » that ship B dropped is
			     back, from `upload.drop.placeholder`, the string Dann added it
			     to by hand.

			     INSIDE `.dz-wrap` RATHER THAN BESIDE IT, so it belongs to the box
			     it describes and travels with it: the wrap is the idle state's own
			     element and unmounts when a score arrives. -->
			<p class="dz-formats">{T('upload.drop.acceptedNow')}</p>
		</div>
	{:else if ui.kind === 'asking'}
		<!-- N.59, Ruling A. Two questions the reader cannot answer for itself.
		     The drawer manipulates, so the control is lawful here; nothing about
		     this appears on the paper. Defaults are treble and no accidentals,
		     with the octave-down treble one tap away. -->
		<div class="ask">
			<p class="ask-title">{T('upload.ask.title')}</p>
			<p class="ask-why">{T('upload.ask.why')}</p>
			<label class="ask-field">
				<span class="ask-label">{T('upload.ask.clef')}</span>
				<select class="ask-select" bind:value={clefChoice}>
					{#each CLEF_CHOICES as choice, i (choice.key)}
						<option value={i}>{T(choice.key)}</option>
					{/each}
				</select>
			</label>
			<label class="ask-field">
				<span class="ask-label">{T('upload.ask.key')}</span>
				<select class="ask-select" bind:value={fifths}>
					{#each FIFTHS_CHOICES as n (n)}
						<option value={n}>{fifthsLabel(n)}</option>
					{/each}
				</select>
			</label>
			<div class="result-actions">
				<button type="button" class="btn-secondary" onclick={reset}>{T('upload.ask.cancel')}</button>
				<button type="button" class="btn-primary" onclick={readAsked}>{T('upload.ask.read')}</button>
			</div>
		</div>
	{:else if ui.kind === 'busy'}
		<div class="status">
			<span class="spinner"></span>
			<span class="status-label">{ui.label}</span>
		</div>
	{:else if ui.kind === 'done'}
		<div class="result">
			<p class="format-label">{formatLabel(ui.ingested.provenance)}</p>
			{#if showBanner}
				<div class="banner">
					<p class="banner-text">
						{bannerTier === 'reader' ? T('upload.banner.reader') : T('upload.banner.denigma')}
					</p>
					<button type="button" class="banner-dismiss" onclick={() => (bannerDismissed = true)}>
						{T('upload.banner.dismiss')}
					</button>
				</div>
			{/if}
			{#if readReport}
				<!-- N.59, Ruling D. The read report lives in the DRAWER and counts
				     every substitution. Nothing is marked on the page: a mark that
				     appears on everything says nothing (E.47's strike). -->
				<div class="read-report">
					<p class="report-title">{T('upload.report.title')}</p>
					<p class="report-line">
						{T('upload.report.systems')
							.replace('%s', String(readReport.systems))
							.replace('%s', String(readReport.staves))}
					</p>
					<p class="report-line">
						{T('upload.report.events')
							.replace('%s', String(readReport.notes))
							.replace('%s', String(readReport.rests))
							.replace('%s', String(readReport.measures))}
					</p>
					<p class="report-line">
						{T('upload.report.spacing').replace(
							'%s',
							readReport.staffSpace.map((v) => v.toFixed(1)).join(', ')
						)}
					</p>
					<p class="report-line">
						{T('upload.report.seconds').replace('%s', readReport.readSeconds.toFixed(1))}
					</p>
					{#if readReport.pitchSubstitutions.length > 0}
						<p class="report-sub">
							{T('upload.report.pitchSubs')
								.replace('%s', String(subTotal(readReport.pitchSubstitutions)))
								.replace('%s', measureList(readReport.pitchSubstitutions))}
						</p>
					{/if}
					{#if readReport.durationSubstitutions.length > 0}
						<p class="report-sub">
							{T('upload.report.durationSubs')
								.replace('%s', String(subTotal(readReport.durationSubstitutions)))
								.replace('%s', measureList(readReport.durationSubstitutions))}
						</p>
					{/if}
					<!-- N.96 ship 1b. Named FIRST among the report's caveats, because a
					     page nobody read is a bigger fact about this upload than any
					     per-note assumption below it. One line per failed page: the
					     ruled string takes one page number, and rendering it twice
					     beats coining a plural nobody approved. -->
					{#each readReport.failedPages as pageNo (pageNo)}
						<p class="report-sub">
							{T('upload.report.pageFailed').replace('%s', String(pageNo))}
						</p>
					{/each}
					{#if readReport.staffSelectionFallbacks > 0}
						<p class="report-sub">
							{T('upload.report.staffFallback').replace(
								'%s',
								String(readReport.staffSelectionFallbacks)
							)}
						</p>
					{/if}
				</div>
			{/if}
			<div class="result-actions">
				<button type="button" class="btn-secondary" onclick={reset}>{T('upload.tryAnother')}</button>
				<button type="button" class="btn-primary" onclick={accept}>{T('upload.continue')}</button>
			</div>
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

	<!-- Hidden file input; the dropzone and browse click drive it. -->
	<input
		type="file"
		accept={acceptList}
		class="file-input"
		bind:this={fileInputEl}
		onchange={onPick}
	/>

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

	/* ── Dropzone ──────────────────────────────────────────── */

	.dropzone {
		/* The watermark's containing block. Nothing else about this box
		   changed; it was `static`. */
		position: relative;
		display: flex;
		flex-direction: column;
		/* TOP LEFT, not centred. Dann's ruling: the placeholder sits where the
		   textarea's sits. Centring is what made these two boxes read as
		   different kinds of thing. */
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		/* A true visual twin of the Transcription text field (.text-input):
		   same box, 4px radius, white fill, and only the colour differs, the
		   score intake's lavender against the text intake's sage (Dann,
		   measured from the live site 2026-07-13).

		   N.65 ship one took BOTH borders from 3px to 1px, and THE WEIGHT
		   CHANGE IS NOT RULED. Brief §3.6 proposes it and Dann rules it by
		   looking at it on the walk. The hue is untouched and must stay: he
		   ruled that sage naming the text intake and lavender naming the
		   score intake is right, and no lighter lavender token measures
		   better against the white fill than #8E7E9B's own 3.74:1. */
		/* 75 PERCENT OF 152px. Dann's ruling, 2026-08-20, on his walk of the
		   silhouette ship: both intake fields go to three quarters of their
		   height. 152 was the twin of the textarea's six rows; both fields
		   drop by the same fraction, not to the same number, because they
		   were never the same number. */
		min-height: 114px;
		padding: 0.5rem 0.6rem;
		/* The textarea's own reserve for its OCR icon, mirrored here for the
		   scan icon in this box's top-right corner. Without it the first line
		   of a top-left placeholder runs under the glyph, which the centred
		   text never did. `.text-input` carries the same value. */
		padding-right: 2.2rem;
		border: 1px solid var(--deeper-lavender);
		border-radius: 4px;
		background: white;
		box-sizing: border-box;
		cursor: pointer;
		/* No resize affordance (Dann's ruling, 2026-07-13): the textarea's
		   handle serves growing TYPED content; a drop target's content
		   never grows. The box twins the Transcription field's border and
		   fill but holds its half-width drawer dimension. */
		transition: background 0.15s ease;
		text-align: center;
	}

	.dropzone:hover {
		background: rgba(142, 126, 155, 0.06);
	}

	.dropzone.dragging {
		background: rgba(142, 126, 155, 0.12);
	}

	/* ── Score-from-image scan icon (visual only, coming soon) ── */

	/* N.65 ship B. THE 8px `margin-bottom` IS GONE. Its comment said it
	   mirrored "the room beneath the Transcription textarea before the next
	   control," and it mirrored 6px with 8px. §B.6 dissolves the question:
	   the Print row is inside SOURCE now, so the room beneath this box is
	   `.station-body`'s own 6px flex gap, the SAME element that sets the
	   textarea's. A margin here would add to it and the two would differ
	   again.

	   A COLUMN NOW, because §B.7 gave this wrap a second child: the box, then
	   the format list. The 6px gap between them is `.station-body`'s value,
	   so the box, its line, and the action row are three siblings a
	   consistent 6px apart, which is the relationship Dann asked for.
	   `position: relative` stays: it is the scan button's containing block. */
	.dz-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* THE PLACEHOLDER'S OWN TREATMENT, ONE STEP QUIETER IN NOTHING. Same
	   family, size, weight, colour, and alignment as `.dz-placeholder`,
	   because this is the second half of one sentence that used to sit in
	   one element, and Dann moved it rather than restyling it. */
	.dz-formats {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--ink-tertiary);
		text-align: start;
	}

	.scan-btn {
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
		opacity: 0.4;
		cursor: default;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s ease, opacity 0.2s ease;
	}

	.scan-btn:hover {
		opacity: 0.7;
		color: var(--deeper-lavender);
	}

	/* The drop zone's own three lines sit ABOVE the watermark. Positioned, so
	   they win the paint order against an absolutely positioned sibling; the
	   watermark still paints over the white fill beneath them. `z-index: 1` on
	   the text rather than a negative index on the mark, because a negative
	   index would put the mark behind this box's own background and hide it. */
	/* THE PLACEHOLDER, VALUE FOR VALUE WITH `.text-input::placeholder` AND
	   `.text-input`'s own box. Dann's ruling of 2026-08-20: same family, same
	   size, same weight, same colour, same alignment, top left, one line of
	   prose that wraps.

	   `line-height: 1.5` is the textarea's, which its `::placeholder`
	   inherits, so a wrapped sentence sets on the same leading here.
	   `text-align: start` is stated rather than left to the default, because
	   this <p> lives inside a <button> and a button centres its text. `start`
	   rather than `left` so the two fields' computed values match STRING FOR
	   STRING, not merely in what they render: the textarea's placeholder
	   inherits the initial `start`, and a row of the memo's table that reads
	   `left` beside `start` invites the next session to go looking for a
	   difference that is not there.

	   `position: relative; z-index: 1` keeps it above the `score` watermark,
	   which the three lines it replaces also did. */
	.dz-placeholder {
		position: relative;
		z-index: 1;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5;
		color: var(--ink-tertiary);
		text-align: start;
	}

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

	.result-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
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

	.btn-primary,
	.btn-secondary {
		padding: 0.4rem 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		border-radius: 4px;
		cursor: pointer;
		border: none;
		transition: opacity 0.12s;
	}

	.btn-primary {
		color: white;
		background: var(--sage);
	}

	.btn-secondary {
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-300);
	}

	.btn-primary:hover,
	.btn-secondary:hover {
		opacity: 0.85;
	}

	.file-input {
		display: none;
	}

	/* The older-Finale guidance's six rules went with its markup, Dann's
	   ruling 2026-08-20. Its `.mus-help` also carried the drop zone's only
	   `border-top: 1px solid var(--stone-300)`, which is the line that stood
	   between the score box and the Output row. */

	/* ── N.59: the two questions, and the read report ──────── */

	.ask,
	.read-report {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 4px;
		background: var(--paper-cream);
	}

	.ask-title,
	.report-title {
		margin: 0;
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--ink);
	}

	.ask-why {
		margin: 0 0 0.25rem;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--ink-soft, var(--ink));
	}

	.ask-field {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.85rem;
	}

	.ask-label {
		color: var(--ink);
	}

	/* The 44px floor is the cursor's alone (CONTRACT, corrected 2026-08-14),
	   but a select is a real touch target and takes it. */
	.ask-select {
		min-height: 44px;
		flex: 1 1 auto;
		max-width: 62%;
		padding: 0 0.5rem;
		font-family: inherit;
		font-size: 0.85rem;
		color: var(--ink);
		background: var(--paper);
		border: 1px solid var(--rule);
		border-radius: 3px;
	}

	.report-line,
	.report-sub {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--ink-soft, var(--ink));
	}

	.report-sub {
		color: var(--ink);
	}
</style>
